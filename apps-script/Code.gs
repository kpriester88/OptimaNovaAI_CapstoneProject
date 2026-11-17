/**
 * Linden Street Community Partners: automatic Gmail thank-you drafts
 *
 * What it does
 *   Every 5 minutes (once turned on), it looks at the Donor Tracker. For any
 *   row that has a letter ready but no Gmail Draft ID yet, it creates a Gmail
 *   DRAFT (never sends) and writes the draft's ID into the "Gmail Draft ID"
 *   column, so Send Status changes to "Draft in Gmail".
 *
 *   If a row changes later (for example, you add the gift date or the EIN),
 *   it updates that row's existing draft to match, as long as nobody has
 *   edited the draft by hand in Gmail. Drafts edited in Gmail are left alone.
 *
 *   Every draft it creates or updates is recorded as one row on the
 *   "Automation Log" tab (created automatically if it doesn't exist).
 *
 * Setup: see the "Thank-You Letters" menu in the Sheet after installing.
 */

// ---------- Settings you can change ----------
const CONFIG = {
  // Demo mode: every draft goes to this address instead of the donor's email.
  DEMO_MODE: true,
  DEMO_TO: 'donor.test@example.com',

  // false = draft as soon as a row has a first name, language and amount
  //         (anything else missing shows in [brackets] in the draft).
  // true  = wait until Data Check says "Complete".
  REQUIRE_COMPLETE: false,

  // Update an existing draft when its row changes (skipped if the draft was
  // edited by hand in Gmail, or once Date Sent is filled in).
  UPDATE_EXISTING_DRAFTS: true,

  CHECK_EVERY_MINUTES: 5, // allowed: 1, 5, 10, 15 or 30

  TRACKER_SHEET: 'Donor Tracker',
  DRAFTS_SHEET: 'Email Drafts',
  LOG_SHEET: 'Automation Log',
  FIRST_ROW: 2,
  LAST_ROW: 151,
};

// Donor Tracker columns (A = 1)
const COL = {
  DONOR_ID: 1,    // A
  FIRST_NAME: 2,  // B
  EMAIL: 3,       // C
  LANGUAGE: 4,    // D
  GIFT_DATE: 5,   // E
  AMOUNT: 6,      // F
  DONOR_TYPE: 7,  // G
  NOTE: 9,        // I
  MISSING: 10,    // J
  DATA_CHECK: 11, // K
  DATE_SENT: 15,  // O
  DRAFT_ID: 16,   // P
};
const TRACKER_WIDTH = 18; // A:R
// Email Drafts columns: D = Subject, E = Email Body
const SUBJECT_IDX = 3;
const BODY_IDX = 4;

const LOG_HEADERS = ['Run Time', 'Donor ID', 'First Name', 'Email', 'Language',
  'Gift Date', 'Amount', 'Donor Type', 'Special Note', 'Missing Info',
  'Gmail Draft ID', 'Tracker Row', 'Status'];
const STATUS_CREATED = "Draft ready for Priya's review";
const STATUS_UPDATED = 'Draft updated to match the Sheet';

// ---------- Menu ----------
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Thank-You Letters')
    .addItem('Create / update Gmail drafts now', 'syncDrafts')
    .addItem('Refresh ALL unsent drafts from the Sheet…', 'refreshAllDrafts')
    .addSeparator()
    .addItem('Turn ON automatic drafts', 'turnOnAutoDrafts')
    .addItem('Turn OFF automatic drafts', 'turnOffAutoDrafts')
    .addToUi();
}

function turnOnAutoDrafts() {
  removeTriggers_();
  ScriptApp.newTrigger('syncDrafts')
    .timeBased()
    .everyMinutes(CONFIG.CHECK_EVERY_MINUTES)
    .create();
  syncDrafts();
  toast_('Automatic drafts are ON. New rows get a Gmail draft within about ' +
         CONFIG.CHECK_EVERY_MINUTES + ' minutes.');
}

function turnOffAutoDrafts() {
  removeTriggers_();
  toast_('Automatic drafts are OFF. Use "Create / update Gmail drafts now" to run it by hand.');
}

// ---------- Main jobs ----------
function syncDrafts() {
  runSync_(false);
}

/**
 * One-time catch-up: rewrites every unsent draft so it matches the Sheet,
 * even drafts edited in Gmail (asks first). Rows whose draft can't be found
 * get a fresh draft and a new Gmail Draft ID.
 */
function refreshAllDrafts() {
  const ui = SpreadsheetApp.getUi();
  const answer = ui.alert(
    'Refresh all unsent drafts?',
    'Every unsent Gmail draft will be replaced with the current letter from the Sheet. ' +
    'Any edits made directly in Gmail will be lost. Rows with a Date Sent are skipped.',
    ui.ButtonSet.YES_NO);
  if (answer !== ui.Button.YES) return;
  runSync_(true);
}

function runSync_(force) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return; // another run is already working

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const tracker = ss.getSheetByName(CONFIG.TRACKER_SHEET);
    const draftsSheet = ss.getSheetByName(CONFIG.DRAFTS_SHEET);
    const n = CONFIG.LAST_ROW - CONFIG.FIRST_ROW + 1;

    const rows = tracker.getRange(CONFIG.FIRST_ROW, 1, n, TRACKER_WIDTH).getDisplayValues();
    const letters = draftsSheet.getRange(CONFIG.FIRST_ROW, 1, n, 5).getDisplayValues();
    const props = PropertiesService.getScriptProperties();

    let created = 0;
    let updated = 0;
    const log = [];

    for (let i = 0; i < n; i++) {
      const row = rows[i];
      const donorId = String(row[COL.DONOR_ID - 1]).trim();
      if (!String(row[COL.FIRST_NAME - 1]).trim() || donorId === 'EXAMPLE') continue;

      const subject = letters[i][SUBJECT_IDX];
      const body = letters[i][BODY_IDX];
      if (!readyToDraft_(row, subject, body)) continue;

      const to = recipient_(row);
      if (!to) continue;

      const draftId = String(row[COL.DRAFT_ID - 1]).trim();
      const sent = !!String(row[COL.DATE_SENT - 1]).trim();

      const sheetRow = CONFIG.FIRST_ROW + i;

      if (!draftId) {
        const newId = createAndRecord_(tracker, sheetRow, to, subject, body, props);
        log.push(logRow_(row, newId, sheetRow, STATUS_CREATED));
        created++;
      } else if (sent) {
        continue;
      } else if (force) {
        const draft = findDraft_(draftId);
        if (draft) {
          draft.update(to, subject, body);
          props.setProperty(key_(draftId), fingerprint_(subject, body));
          log.push(logRow_(row, draftId, sheetRow, STATUS_UPDATED));
          updated++;
        } else {
          const newId = createAndRecord_(tracker, sheetRow, to, subject, body, props);
          log.push(logRow_(row, newId, sheetRow, STATUS_CREATED));
          created++;
        }
      } else if (CONFIG.UPDATE_EXISTING_DRAFTS) {
        if (updateIfUntouched_(draftId, to, subject, body, props)) {
          log.push(logRow_(row, draftId, sheetRow, STATUS_UPDATED));
          updated++;
        }
      }
    }

    writeLog_(ss, log);

    if (created || updated || force) {
      toast_('Gmail drafts: ' + created + ' created, ' + updated + ' updated.');
    }
  } finally {
    lock.releaseLock();
  }
}

// ---------- Helpers ----------
function readyToDraft_(row, subject, body) {
  if (!String(row[COL.LANGUAGE - 1]).trim()) return false;
  if (!String(row[COL.AMOUNT - 1]).trim()) return false;
  if (!subject || !body) return false;
  if (subject.charAt(0) === '[') return false;                 // no language chosen
  if (body.indexOf('Choose a preferred language') === 0) return false;
  if (CONFIG.REQUIRE_COMPLETE && row[COL.DATA_CHECK - 1] !== 'Complete') return false;
  return true;
}

function recipient_(row) {
  if (CONFIG.DEMO_MODE) return CONFIG.DEMO_TO;
  const email = String(row[COL.EMAIL - 1]).trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

/**
 * Updates a draft to match the Sheet, only if the draft in Gmail is still
 * exactly what this script last wrote. Hand-edited drafts are marked "H:" and
 * never touched again; drafts that were sent or deleted are skipped.
 */
function updateIfUntouched_(draftId, to, subject, body, props) {
  const k = key_(draftId);
  const last = props.getProperty(k);
  const wanted = fingerprint_(subject, body);

  if (last === wanted) return false;                    // nothing changed
  if (last && last.indexOf('H:') === 0) return false;   // hand-edited or gone

  const draft = findDraft_(draftId);
  if (!draft) {                                         // sent or deleted
    props.setProperty(k, 'H:gone');
    return false;
  }

  const msg = draft.getMessage();
  const inGmail = fingerprint_(msg.getSubject(), msg.getPlainBody());

  if (inGmail === wanted) {                             // already matches
    props.setProperty(k, wanted);
    return false;
  }
  if (last === inGmail) {                               // untouched since we wrote it
    draft.update(to, subject, body);
    props.setProperty(k, wanted);
    return true;
  }
  props.setProperty(k, 'H:' + inGmail);                 // edited in Gmail: leave it
  return false;
}

function createAndRecord_(tracker, sheetRow, to, subject, body, props) {
  const draft = GmailApp.createDraft(to, subject, body);
  const newId = draft.getId();
  tracker.getRange(sheetRow, COL.DRAFT_ID).setValue(newId);
  props.setProperty(key_(newId), fingerprint_(subject, body));
  return newId;
}

// ---------- Automation Log ----------
function logRow_(row, draftId, sheetRow, status) {
  const cell = function (col) { return String(row[col - 1]).trim(); };
  return [
    '', // Run Time is filled in by writeLog_
    cell(COL.DONOR_ID), cell(COL.FIRST_NAME), cell(COL.EMAIL), cell(COL.LANGUAGE),
    cell(COL.GIFT_DATE), cell(COL.AMOUNT), cell(COL.DONOR_TYPE), cell(COL.NOTE),
    cell(COL.MISSING), draftId, sheetRow, status,
  ];
}

function writeLog_(ss, entries) {
  if (!entries.length) return;
  let sheet = ss.getSheetByName(CONFIG.LOG_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.LOG_SHEET);
    sheet.appendRow(LOG_HEADERS);
    sheet.setFrozenRows(1);
  }
  const runTime = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(),
                                       'MMM d, yyyy h:mm a');
  entries.forEach(function (e) { e[0] = runTime; });
  sheet.getRange(sheet.getLastRow() + 1, 1, entries.length, LOG_HEADERS.length)
       .setNumberFormat('@')   // keep IDs, dates and amounts exactly as shown
       .setValues(entries);
}

function findDraft_(draftId) {
  try {
    return GmailApp.getDraft(draftId) || null;
  } catch (e) {
    return null; // sent, deleted, or not a draft ID
  }
}

function fingerprint_(subject, body) {
  // Ignore spacing and line-break differences Gmail can introduce.
  const text = (String(subject) + '|' + String(body)).replace(/\s+/g, '');
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, text,
                                        Utilities.Charset.UTF_8);
  return Utilities.base64Encode(bytes);
}

function key_(draftId) {
  return 'draft_' + draftId;
}

function removeTriggers_() {
  ScriptApp.getProjectTriggers()
    .filter(function (t) { return t.getHandlerFunction() === 'syncDrafts'; })
    .forEach(function (t) { ScriptApp.deleteTrigger(t); });
}

function toast_(message) {
  try {
    SpreadsheetApp.getActiveSpreadsheet().toast(message, 'Thank-You Letters', 6);
  } catch (e) {
    // No open spreadsheet window (timed run): nothing to show.
  }
}
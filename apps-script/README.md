# Apps Script

`Code.gs` is the full script. To install it, open the Sheet, go to **Extensions → Apps Script**, and paste it in.

What the script does:

- Adds a **Thank-You Letters** menu to the Sheet, which turns automatic drafts on or off.
- Runs on a time-driven trigger **every 5 minutes**.
- For any `Donor Tracker` row that has a first name, a language, and an amount but no Gmail Draft ID, it creates a **Gmail draft** (it never sends) and writes the draft ID to column P.
- If the row changes later, it updates the matching draft, unless someone has already edited that draft in Gmail.
- Appends one row to `Automation Log` for every draft it creates or updates, and creates that tab if it is missing.

**Before committing:**

- Replace the demo recipient address with a placeholder such as `donor.test@example.com`.
- Remove any spreadsheet ID. Use `SpreadsheetApp.getActiveSpreadsheet()` instead.
- Check that there are no keys, tokens, or personal email addresses left in the code.

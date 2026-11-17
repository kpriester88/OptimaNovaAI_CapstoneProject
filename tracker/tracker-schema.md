# Tracker Schema

## Donor Tracker tab

Column colors: **navy = input**, **grey = formula (don't type over it)**, **green = review and send tracking**.

| Col | Header | Type | Notes |
|---|---|---|---|
| A | Donor ID | Input | e.g. `LS-001` |
| B | First Name | Input | Used in the greeting |
| C | Email | Input | Draft recipient (demo mode overrides it) |
| D | Preferred Language | Input (dropdown) | English · Spanish · Haitian Creole |
| E | Gift Date | Input | Written in the donor's language using `Lookups` |
| F | Amount | Input | Currency |
| G | Donor Type | Input (dropdown) | First-time · Repeat. Confirmed by staff, never inferred |
| H | Designation / Program | Optional (dropdown) | Food Pantry · Youth Program · Community Outreach · Benefits Enrollment · General Support (adds no line) |
| I | Special Note from Donor | Optional | Shown to the reviewer, **not** inserted into the letter |
| J | Missing Info | Formula | Lists blank required fields, e.g. `Gift date; First-time/Repeat;` |
| K | Data Check | Formula | `Complete` · `Incomplete` · `CHECK: marked ready but info missing` |
| L | Priya's Review | Review (dropdown) | Not reviewed · Ready to send · Needs changes · On hold |
| M | Reviewer Notes | Review | Free text |
| N | Reviewed On | Review | Date |
| O | Date Sent | Tracking | Filled once the email goes out |
| P | Gmail Draft ID | Script | Written by Apps Script |
| Q | Send Status | Formula / script | No Gmail draft yet · Draft in Gmail · Approved, waiting to send · Sent · **SENT WITHOUT APPROVAL** |
| R | Tribute: who it's for | Optional | Written as it should read, e.g. "your grandmother" |
| S | Tribute Type | Optional (dropdown) | In honor of · In memory of. Required if R is filled |

## Email Drafts tab

| Col | Header |
|---|---|
| A | Donor ID |
| B | To |
| C | Language |
| D | Subject |
| E | Email Body |
| F | Data Check |
| G | Priya's Review |
| H–M | Helper columns: first name, amount, localized date, donor line, program line, tribute line |

## Automation Log tab

`Run Time · Donor ID · First Name · Email · Language · Gift Date · Amount · Donor Type · Special Note · Missing Info · Gmail Draft ID · Tracker Row · Status`

## Template tokens

| Token | Replaced with |
|---|---|
| `{{FIRST}}` | First name |
| `{{AMOUNT}}` | Gift amount |
| `{{DATE}}` | Gift date in the donor's language |
| `{{DONOR_LINE}}` | First-time or repeat line |
| `{{PROGRAM}}` | Program line (only when a designation is set) |
| `{{PROGRAM_NAME}}` | Program name from `Lookups` |
| `{{TRIBUTE}}` | Tribute line (only when a tribute is filled in) |
| `{{EIN}}` | Organization EIN from `Templates!B12` |

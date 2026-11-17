# Test Log

All inputs are made up and use `example.com` addresses. In demo mode, every draft goes to a single test inbox (`donor.test@example.com`).

| # | Input | Expected | What happened | Result |
|---|---|---|---|---|
| 1 | **LS-001 Sam** – English, $500.00, Nov 2, First-time, Community Outreach | Complete row. English draft with the amount, date, first-time line, and Community Outreach line | Data Check: *Complete*. Draft created with the program line and first-time line. Draft ID written back to the row | Pass |
| 2 | **LS-003 Lucía** – Spanish, $80.00, Nov 4, Repeat, Food Pantry | Spanish draft, accent kept in "Lucía", date written in Spanish, repeat line | Data Check: *Complete*. Spanish draft created | Pass (fluent check still needed) |
| 3 | **LS-004 Widlyne** – Haitian Creole, $200.00, Nov 4, Donor Type blank, marked *Ready to send* | Draft in Haitian Creole. Missing donor type flagged. Red CHECK flag because it's marked ready while incomplete | Missing Info: `First-time/Repeat`. Data Check: **CHECK: marked ready but info missing** | Pass: the safety flag caught it |
| 4 | **LS-002 Maya** – English, $75.00, gift date and donor type blank | No date guessed. Placeholders in the draft. Row marked Incomplete | Missing Info: `Gift date; First-time/Repeat`. Data Check: *Incomplete* | Pass |
| 5 | **LS-006 Mike** – language blank | No language guessed. Language flagged as missing | Missing Info: `Language; First-time/Repeat`. Logged as *Draft ready for Priya's review* | Pass |
| 6 | **LS-014 Taylor** – gift date and amount both blank | No amount or date invented | Missing Info: `Gift date; Amount; First-time/Repeat`. Draft shows placeholders | Pass |
| 7 | **LS-028 Mary** – email blank (designed to fail safely) | Nothing reaches a real person. Email flagged as missing | Missing Info: `Email; Gift date`. Draft held in the test inbox for review, so nothing went out | Pass |

## Observations and fixes

- **EIN missing on every early run.** Before the organization's EIN was entered in `Templates!B12`, every row listed `EIN (Templates tab)` as missing. That worked as intended: no tax ID was ever invented. The setup steps now say to enter the EIN first.
- **"Marked ready while incomplete" needed its own flag.** A plain *Incomplete* label was easy to miss once a reviewer had already marked a row *Ready to send*. Adding the red **CHECK** status (test 3) made it hard to overlook.
- **Suggested next fix:** add a duplicate check on Donor ID and email before a draft is created.

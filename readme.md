# Gmail Auto-Delete Script

A Google Apps Script that automatically deletes Gmail messages from specific senders based on email addresses listed in a Google Sheet.

## Features

- Reads a Google Sheet to get email addresses to target.
- Deletes emails older than a configurable number of days (e.g., 3-day, 5-day lists).
- Archived emails older than a year.
- Supports batch operations to avoid Gmail API limits.
- Modular code with reusable functions for fetching emails from sheets.

## Setup

1. Create a Google Sheet with columns like:
   - `3dayEmails`
   - `5dayEmails`
2. Add the email addresses under each column.
3. Copy the script into [Google Apps Script](https://script.google.com/) attached to your Google account.
4. Copy the spreadsheet ID from its URL and replace it in the code:
```
var ssid = "YOUR_SPREADSHEET_ID";
```
5. In order to enable the archiving functionalitiy, add Gmail API to the services.
6. (Optional) Set up a **time-driven trigger** to run the script automatically daily.

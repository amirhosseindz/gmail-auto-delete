# Gmail Auto-Delete Script

A Google Apps Script that automatically deletes Gmail messages from specific senders based on email addresses listed in a Google Sheet.

## Features

- Reads a Google Sheet to get email addresses to target.
- Deletes emails older than a configurable number of days (e.g., 3-day, 5-day lists).
- Supports batch deletion to avoid Gmail API limits.
- Modular code with reusable functions for fetching emails from sheets.

## Setup

1. Create a Google Sheet named `GmailAutoDelete` with columns like:
   - `3dayEmails`
   - `5dayEmails`
2. Add the email addresses under each column.
3. Copy the script into [Google Apps Script](https://script.google.com/) attached to your Google account.
4. (Optional) Set up a **time-driven trigger** to run the script automatically daily.

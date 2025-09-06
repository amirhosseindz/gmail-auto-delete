/**
 * Fetches all non-empty values from a column by its header name.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - The sheet object.
 * @param {string} headerName - The header title of the column.
 * @returns {string[]} Array of non-empty values in that column.
 */
function getColumnValuesByHeader(sheet, headerName) {
  if (!sheet) {
    Logger.log("Sheet not found.");
    return [];
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var colIndex = headers.indexOf(headerName) + 1; // +1 because getRange is 1-based

  if (colIndex === 0) {
    Logger.log("Column '" + headerName + "' not found.");
    return [];
  }

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    Logger.log("No data found in column '" + headerName + "'.");
    return [];
  }

  var values = sheet.getRange(2, colIndex, lastRow - 1, 1).getValues()
                    .flat()
                    .filter(e => e); // remove empty cells
  return values;
}

/**
 * Fetches email lists for 3-day and 5-day scenarios.
 * @returns {Object} Object containing arrays: { emails3Day, emails5Day }
 */
function getEmailListsFromSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("GmailAutoDelete");

  var emails3Day = getColumnValuesByHeader(sheet, "3dayEmails");
  var emails5Day = getColumnValuesByHeader(sheet, "5dayEmails");

  Logger.log("3-day emails: " + emails3Day);
  Logger.log("5-day emails: " + emails5Day);

  return {
    emails3Day: emails3Day,
    emails5Day: emails5Day
  };
}

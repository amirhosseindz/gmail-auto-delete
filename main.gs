function autoDeleteEmails() {
  var {
    emails3Day: emails3,
    emails5Day: emails5
  } = getEmailListsFromSheet();

  Logger.log("=== Auto-delete job started ===");

  Logger.log("Running cleanup for verification codes...");
  deleteEmailsInBatch('subject:(verification code OR authentication code) older_than:1d');

  Logger.log("Running cleanup for 3-day group (" + emails3.length + " senders)...");
  deleteByAgeAndSenders(3, emails3);

  Logger.log("Running cleanup for 5-day group (" + emails5.length + " senders)...");
  deleteByAgeAndSenders(5, emails5);

  Logger.log("Archiving emails older than a year...");
  archiveOldEmails("1y");

  Logger.log("=== Auto-delete job finished ===");
}

function deleteByAgeAndSenders(days, senders) {
  if (!senders || senders.length === 0) {
    Logger.log("No senders provided for " + days + "d cleanup.");
    return;
  }

  var query = 'older_than:' + days + 'd (' + senders.map(s => 'from:' + s).join(" OR ") + ')';
  Logger.log("Query for " + days + "d group: " + query);

  deleteEmailsInBatch(query);
}

function deleteEmailsInBatch(query) {
  var batchSize = 500; // how many threads to fetch per batch (max 500)
  var start = 0;
  var totalDeleted = 0;

  while (true) {
    var threads = GmailApp.search(query, 0, batchSize);
    if (threads.length === 0) break;

    Logger.log("Fetched " + threads.length + " threads.");

    var chunkSize = 100; // how many threads to delete per chunk (max 100)
  
    for (var i = 0; i < threads.length; i += chunkSize) {
      var chunk = threads.slice(i, i + chunkSize);

      GmailApp.moveThreadsToTrash(chunk);

      Logger.log("Deleted chunk of " + chunk.length + " threads.");

      Utilities.sleep(500); // optional pause to prevent rate limits
    }

    totalDeleted += threads.length;
    start += batchSize;

    // Safety: prevent infinite loops
    if (start > 5000) {
      Logger.log("Stopping early to avoid timeouts (processed ~5000 threads).");
      break;
    }
  }

  Logger.log("Moved " + totalDeleted + " threads to Trash.");
}

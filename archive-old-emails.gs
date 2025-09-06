/**
 * Archives all Gmail emails older than 1 year in your Inbox.
 * Processes emails in batches of 500 using the Gmail Advanced API.
 * Logs progress for each batch.
 * Safe query: excludes starred, chats, spam, trash.
 * Make sure Gmail API is added in the services.
 * 
 * @param {string} period - Period string like "1y" (1 year), "6m" (6 months), "30d" (30 days)
 */
function archiveOldEmails(period) {
  if (!period) {
    Logger.log('No period specified. Using 1 year by default.');
    period = '1y';
  }

  const QUERY = `older_than:${period} in:inbox -in:chats -is:starred -in:spam -in:trash`;
  const MAX_RESULTS = 500; // Gmail API max per request
  let totalArchived = 0;
  let pageToken = PropertiesService.getScriptProperties().getProperty('ARCHIVE_PAGE_TOKEN');
  let batchNumber = parseInt(PropertiesService.getScriptProperties().getProperty('ARCHIVE_BATCH_NUMBER')) || 1;

  do {
    // Fetch a batch of messages
    let response = Gmail.Users.Messages.list('me', {
      q: QUERY,
      maxResults: MAX_RESULTS,
      pageToken: pageToken
    });

    if (!response.messages || response.messages.length === 0) break;

    let ids = response.messages.map(msg => msg.id);

    // Archive this batch
    Gmail.Users.Messages.batchModify({
      ids: ids,
      removeLabelIds: ['INBOX']
    }, 'me');

    Logger.log(`Batch ${batchNumber}: Archived ${ids.length} emails.`);
    totalArchived += ids.length;

    // Save pageToken and batchNumber to resume in case of timeout
    pageToken = response.nextPageToken || null;

    if (pageToken) {
      PropertiesService.getScriptProperties().setProperty('ARCHIVE_PAGE_TOKEN', pageToken);
      PropertiesService.getScriptProperties().setProperty('ARCHIVE_BATCH_NUMBER', batchNumber + 1);
    } else {
      // No more pages → clear state
      PropertiesService.getScriptProperties().deleteProperty('ARCHIVE_PAGE_TOKEN');
      PropertiesService.getScriptProperties().deleteProperty('ARCHIVE_BATCH_NUMBER');
    }

    batchNumber++;

    // Small delay to be gentle on quotas
    Utilities.sleep(500);

    // Stop if script execution limit is near (optional safety)
    if (batchNumber % 20 === 0) {
      Logger.log('Pausing to avoid timeout. Run script again to continue.');
      break;
    }

  } while (pageToken);

  Logger.log(`Total emails archived this run: ${totalArchived}`);
}

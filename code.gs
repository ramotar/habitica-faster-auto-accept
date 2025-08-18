// [Authors] Place all other functions in this or other separate files
// - Ideally prefix functions that access the API with "api_" to quickly see which ones
//   access the API and to be able to budget your 30 requests per minute limit well

function processWebhookInstant(type, data) {
  // [Authors] This function gets called immediately,
  //   whenever a webhook of your script is activated.
  // - Place immediate reactions here.
  // - Make sure, that the processing time does not exceed 30 seconds.
  //   Otherwise you risk the deactivation of your webhook.

  if (type == "questInvited" && AUTO_ACCEPT_QUESTS) {
    api_acceptQuestInvite();
  }
  else if (type == "questFinished" && QUEST_FINISHED_NOTIFICATION) {
    sendQuestFinishedNotification(data);
  }

  return false;
}

function processWebhookDelayed(type, data) {
  // [Authors] This function gets called asynchronously,
  //   whenever a webhook of your script is activated.
  // - Here you can take care of heavy work, that may take longer.
  // - It may take up to 30 - 60 seconds for this function to activate
  //   after the webhook was triggered.
}

function processTrigger() {
  // [Authors] This function gets called by the example trigger.
  // - This is the place for recurrent tasks.
  acceptPendingQuestInvite();
}

function sendQuestFinishedNotification(data) {
  let questKey = data.quest.key;

  let questName = getQuestName(questKey);
  let questString = (questName == null ? "`" + questKey + "`" : "**" + questName + "**");

  let questFinishedNotification = "You have finished the quest " + questString + ", congratulations! &#127881;";

  api_sendPM(questFinishedNotification);
}

function getQuestName(key, defaultValue = null) {
  let content = api_getContent();

  if (key in content.quests) {
    return content.quests[key].text;
  }
  else {
    return defaultValue;
  }
}

function acceptPendingQuestInvite() {
  let party = api_getParty();
  if (typeof party !== "undefined" && typeof party.quest.key !== "undefined" && !party.quest.active && !(INT_USER_ID in party.quest.members)) {
    api_acceptQuestInvite();
  }
}

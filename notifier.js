/*
 * notifier.js
 * typeform-slack-integration
 * author: cheniel
 *
 * Run this to notify users about a new registrant via Slack incoming webhook.
 */
var common = require('./common.js');

var TIMEOUT = 10000

function convertTypeformDateToTimestamp(dateString) {
  var date = new Date(dateString + "Z");
  return Math.floor(date.getTime() / 1000);
}

function checkTypeformRepeating(lastTimestamp, config) {
  console.log("Checking with last timestamp: " + lastTimestamp);
  common.getTypeformData(config.typeformId, config.typeformApiKey, function(data) {
    var questions = data.questions;

    for (var i=0; i < data.responses.length; i++) {
      var answers = data.responses[i].answers;
      var responseTimestamp = convertTypeformDateToTimestamp(data.responses[i].metadata.date_submit);
      if (responseTimestamp > lastTimestamp) {
        lastTimestamp = responseTimestamp;
      }
      
      console.log("New responses detected!");
      var message = "Registrant #*" + data.stats.responses.completed + "* applied!\n";
      for (var q=0; q < questions.length; q++) {
        var question = questions[q];
        message += question.question + "\n*" + answers[question.id] + "*\n";
      }
      common.sendMessageToSlack(config.slackWebHook, message);
    }
    setTimeout(function() { checkTypeformRepeating(lastTimestamp, config); }, TIMEOUT);
  }, function() { 
    console.log("Failed..."); 
    setTimeout(function() { checkTypeformRepeating(lastTimestamp, config); }, TIMEOUT);
  }, lastTimestamp);
}

common.readConfig(function(config) {
  common.getTypeformData(config.typeformId, config.typeformApiKey, function(data) {
    var lastTimestamp = convertTypeformDateToTimestamp(data.responses[0].metadata.date_submit);
    console.log("Initial last timestamp: " + lastTimestamp);
    setTimeout(function() { checkTypeformRepeating(lastTimestamp, config); }, TIMEOUT);
  }, function() {
    console.log("Initial Typeform data retrieval failed.");
    process.exit(1);
  });
});


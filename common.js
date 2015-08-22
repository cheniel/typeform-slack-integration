var request = require('request')
  , fs = require('fs');

CONFIG_FILE = 'config.json'

exports.printConfig = function(config) {
  console.log("Slack token: " + config.slackToken);
  console.log("Slack web hook: " + config.slackWebHook);
  console.log("Typeform API endpoint: " + exports.generateTypeformUrl(config.formId, config.apiKey));
}

exports.readConfig = function(callback) {
  fs.readFile(CONFIG_FILE, 'utf8', function (err, data) {
    if (err) {
      console.log("Make sure to define a " + CONFIG_FILE +". See README.md for more info.");
      throw err;
    }
    config = JSON.parse(data);
    callback(config);
  });
}

exports.sendMessageToSlack = function(slackWebHook, message, channel) {
  var options = {
    'url': slackWebHook,
    'method': 'POST',
    'body': { text: message },
    'json': true,
  };
  if (channel) {
    options.body["channel"] = channel;
  }
  request(options,function(error,response,body){
    console.log("attempted to post to slack");
    console.log("errors: " + error);
    console.log("body: " + body);
  });
}

exports.generateTypeformUrl = function(formId, apiKey, since) {
  url = "https://api.typeform.com/v0/form/" + formId + "?completed=true&order_by[]=date_submit,desc&key=" + apiKey;
  if (since) { url += "&since=" + since; }
  return url;
}

exports.getTypeformData = function(formId, apiKey, successCallback, failureCallback, since) {
  var typeformUrl = exports.generateTypeformUrl(formId, apiKey, since);
  request(typeformUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var jsonResponse = JSON.parse(body);
      successCallback(jsonResponse);
    } else {
      console.log(error);
      failureCallback();
    }
  });
}


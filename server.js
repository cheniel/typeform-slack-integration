/*
 * server.js
 * typeform-slack-integration
 * author: cheniel
 *
 * Run this to start a web server which you can set as a GET slash command on Slack.
 */
var http = require('http')
  , url = require('url')
  , common = require('./common.js');

common.readConfig(function(config) {
  http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});

    var params = url.parse(req.url, true).query;
    var requestToken = params.token;
    var quiet = params.text == 'quiet';

    common.getTypeformData(config.typeformId, config.typeformApiKey, function(data) {
        if (data.responses.length == 0) {
          res.end("No registrants :(");
          return;
        }
        var latestResponse = data.responses[0].answers;

        var message = "We have " + data.stats.responses.completed + " registrants! " 
        if (latestResponse[config.typeformNameField] && latestResponse[config.typeformFromField]) {
          message += "\nThe latest one is *" + latestResponse[config.typeformNameField] + "* from *" + latestResponse[config.typeformFromField] + "*.";
        }
        if (requestToken == config.slackToken && !quiet) {
          message += "\nRequested by @" + params.user_name;
          common.sendMessageToSlack(config.slackWebHook, message + "\n Type /registrants to check again.", "#" + params.channel_name);
        } else {
          res.end(message);
        }
        res.end("");
    }, function() { res.end("Failed to get registrants :("); });

  }).listen(config.port, config.host);

  common.printConfig(config);
  console.log("Ready to go! " + config.host + ":" + config.port);
});


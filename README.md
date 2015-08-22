# typeform-slack-integration
Typeform Integration for Slack which allows for viewing of registrant count and notification of new entries.

## Notifications

## Slash Commands


## Setup

[Install node.js](https://nodejs.org/) and run `npm install`.

If you just want notifications of new registrants, you will have to run `notifier.js` and setup the first three values in `config.json`

If you want to enable slash commands, you will have to run `server.js`, and setup the first six values, optionally setting the last two.

Set up the first three by [getting your Typeform UID and API Key](http://helpcenter.typeform.com/hc/en-us/articles/200071986-Data-API) and [creating a Slack incoming webhook](https://api.slack.com/incoming-webhooks)

If you're running both, this is what `config.json` should look like:
```json
{
  "typeformId": "TYPEFORM_UID",
  "typeformApiKey": "TYPEFORM_API_KEY",
  "slackWebHook": "SLACK_INCOMING_WEBHOOK",

  "host": "SERVER_HOST",
  "port": 80,
  "slackToken": "SLACK_SLASH_COMMAND_TOKEN",

  "typeformNameField": "NAME_FIELD_ID_OF_TYPEFORM",
  "typeformFromField": "FROM_FIELD_ID_OF_TYPEFORM"
}
```

### Setup `notifier.js`

Make sure your `config.json` defines `typeformId`, `typeformApiKey` and `slackWebHook`.

You're done! Run `node notifier.js`

### Setup `server.js`

Make sure your `config.json` defines `host`, `port`, `typeformId`, `typeformApiKey`, `slackWebHook` and `slackToken`.

To define `slackToken` and set up your slash command, go [here](https://api.slack.com/slash-commands). 
* Set the URL to the webserver you will be running on
* Define the method as `GET`.
* Copy the Token into `slackToken` in `config.json`
* Recommended: set the Usage Hint to `[quiet]`

You may optionally specify `typeformNameField` and `typeformFromField`. Open your Typeform API in a web browser and grab the question ID of the fields you want to use as Name and From.

Once you've done all this, simply run `node server.js`.

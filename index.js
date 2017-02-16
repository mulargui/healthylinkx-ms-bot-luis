
var builder = require('botbuilder');

//=========================================================
// Bot Setup to connect to the MS Bot Connector
//=========================================================
/*
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());
*/
//=========================================================
// Bot Setup to connect to a console
//=========================================================

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);

//=========================================================
// Bot Dialogs
//=========================================================

var conversation = require('./conversation').conversation;
bot.dialog('/', conversation);
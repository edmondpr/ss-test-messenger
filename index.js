var bodyParser = require('body-parser');
var request = require('request');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'));

app.use(bodyParser.json());

app.get('/', function(req, res) {
  console.log(req);
  res.send('It works!');
});

app.get(['/facebook', '/instagram'], function(req, res) {
  if (
    req.param('hub.mode') == 'subscribe' &&
    req.param('hub.verify_token') == 'token'
  ) {
    res.send(req.param('hub.challenge'));
  } else {
    res.sendStatus(400);
  }
});

app.post('/facebook', function(req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      question = event.message.text;
      sendTextMessage(sender, respond(question));
    }
  }
  res.sendStatus(200);
});

function respond(question) {
  switch (question) {
    case 'What time is it?':
      var currentdate = new Date(); 
      answer = 'It\'s ' + currentdate.getHours() + ':' + currentdate.getMinutes();      
      break;
    case 'Can\'t login again':
      answer = 'Hi Vitaly,\n\nI\'ve re-enabled your account.\n\nWe\'ll try to get something set up on our end this week so you don\'t get disabled in the next one.\n\nRegards,\nAdrian'
      break;
    case 'I can\'t see any shifts available':
      answer = 'Hi Melisa,\n\nIt seems like you were not set up on the correct Bayada office.\n\nCould you please tell me which office you are from?\n\nRegards,\nAdrian'
      break;
    default:
      answer = 'No clue, sorry!'; 
  }
  return answer;
}

app.post('/instagram', function(req, res) {
  console.log('Instagram request body:');
  console.log(req.body);
  // Process the Instagram updates here
  res.sendStatus(200);
});

app.listen();


var token = "CAAFV23OcXFgBAFuGjSZCT5WDxytZCpzsnRPiijcfTOUtkZANP2S5hLJHDweITRuzJjTYKDmxgMPiz0LuZAQbHPu7AZAqHlZAwepsaYzs8s79tGFTTvjgfZAIU9KjAJu9XEALyqQft4XmNBtKcQTnkqAUJ5JxYXKCU3YCqvZApG0NZBkbPIejBzBuxJ91fthE1cjEZD";

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}
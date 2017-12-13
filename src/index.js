const TOKEN = '_SLACK_TOKEN_';
const USER = '_USER_ID_';
const STATUS_CHANNEL = 'status';
const Botkit = require('botkit');

const controller = Botkit.slackbot({
 debug: false
});

const bot = controller.spawn({
  token: TOKEN
}).startRTM(function(err) {
  if (err) {
    throw new Error(err);
  }
});

const askYesterday = function(response, convo) {
  convo.ask("What did you do yesterday?", function(response, convo) {
    askToday(response, convo);
    convo.next();
  });
};

const askToday =  function(response, convo) {
  convo.ask("What are you going to do today?", function(response, convo) {
    askBlockers(response, convo);
    convo.next();
  });
}

const line = "==".repeat(20);
const askBlockers = function(response, convo) {
    convo.ask("What's blocking you today?", function(response, convo) {
    convo.say('Thank you!');
    const text = convo.getResponsesAsArray().map(message => {
        return `*${message.question}*\n>_${message.answer.replace(/[\r\n]+/g, ' ')}_`
    }).join("\n");
    bot.say({
        text: `${line}\nHere's the status of <@${convo.context.user}>\n ${text}\n${line}`,
        channel: CHANNEL
        mrkdwn: true
    });   
    convo.next();
  });
}

bot.startPrivateConversation({
    user: USER
}, function (error, convo) {
    if(error) {
        console.log('error', error);
    }
    else {
        convo.say("Hello! It's time to get your status!");
        askYesterday({}, convo);
    }
});

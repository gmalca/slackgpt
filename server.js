const { App } = require("@slack/bolt");
require("dotenv").config();
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN
});
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const CHAT_HISTORY = {};
const CHAT_HISTORY_SAVE_TIME = 10 * 60 * 1000; // 10 Minutes
const CHAT_HISTORY_TIMERS = {};

app.event("message", async ({ event, say }) => {
    try {
        if (event.channel_type === 'im') {
            let msg = event.text;
            say("Thinking...");
            console.log('Received msg', msg);
            const response = await getOpenAIResponse(msg, event.user);
            saveChatHistory(event.user, msg, response);
            say(response);
        }
        else {
            console.log(event, event.channel_type, event.text);
        }
    }
    catch (error) {
        say("Sorry, something went wrong.");
        console.error(error);
    }
});

app.event("app_mention", async ({ event, context, client, say }) => {
    try {
        let msg = event.text.replace(/(\<@.*\>)/g,'').trim();
        say("Thinking...");
        console.log('Received msg', msg);
        const response = await getOpenAIResponse(msg);
        saveChatHistory(event.user, msg, response);
        say(response);
    }
    catch (error) {
        say("Sorry, something went wrong.");
        console.error(error);
    }
  });

app.error((error) => {
    console.error(error);
});

function saveChatHistory(user, msg, response) {
    if (!CHAT_HISTORY[user]) {
        CHAT_HISTORY[user] = [];
    }
    CHAT_HISTORY[user].push([msg, response]);
    if (CHAT_HISTORY_TIMERS[user]) {
        clearTimeout(CHAT_HISTORY_TIMERS[user]);
    }
    CHAT_HISTORY_TIMERS[user] = setTimeout(() => {
        delete CHAT_HISTORY[user];
        delete CHAT_HISTORY_TIMERS[user];
    }, CHAT_HISTORY_SAVE_TIME);
}

async function getOpenAIResponse(msg, user) {
    let messages = [];
    if (user && CHAT_HISTORY[user]) {
        messages = CHAT_HISTORY[user].map(([msg, response]) => {
            return {role: "user", content: msg},
            {role: "assistant", content: response}
        });
    }
    messages.push({role: "user", content: msg})
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.5                
    });
    return response.data.choices[0].message.content;
}

(async () => {
    await app.start();
    console.log('⚡️ GabGPT Slack Bot App Started');
})();
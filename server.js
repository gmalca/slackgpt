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

app.event("message", async ({ event, say }) => {
    try {
        if (event.channel_type === 'im') {
            let msg = event.text;
            console.log('Received msg', msg);
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: msg,
                temperature: 0.5,
                max_tokens: 1024,
              });
            say(response.data.choices[0].text);
        }
    }
    catch (error) {
        console.error(error);
    }
});

app.error((error) => {
    console.error(error);
});

(async () => {
    await app.start();
    console.log('⚡️ GabGPT Slack Bot App Started');
})();
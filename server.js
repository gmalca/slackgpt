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
            const response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    {role: "user", content: msg}
                ],
                temperature: 0.5                
              });
            // console.log('Response', response.data, response.data.choices, response.data.choices[0].message);
            say(response.data.choices[0].message.content);
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
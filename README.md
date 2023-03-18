# Slack GPT Bot (by Gab)

## Slack App Creation
1. Go to the Slack API Website: https://api.slack.com/
2. Click on "Create an app" and select "From scratch"
3. Give your app a name, select your Slack workspace
4. In Basic information > Add features and functionality. Click on "Permissions" and in Scopes add in Bot Token Scopes: `chat:write` , `im:history`, `im:read`, `im:write`
5. In settings, click on "Socket Mode", enable it and give the token a name. Copy the **Slack App Token**.
6. In Basic information > Add features and functionality. Click on "Event Subscriptions" and enable it. Under "Subscribe to bot events" select `message.im`. Save changes.
7. Go to "OAuth & Permissions" section and install your app to your workspace
8. Copy the **Slack Bot Token**
9. Go to your App's **Basic Information** screen and copy the **Signing Secret***
10. Under **App Home**, make sure you select "Allow users to send Slash commands and messages from the messages tab"

## OpenAI API
1. Go to the OpenAI API website
2. Log in or sign up for an OpenAI account
3. Go to the API Key section (https://platform.openai.com/account/api-keys) and create a new API key
4. Copy the API Key

## Instructions:

1. Clone this repository: `git clone git@github.com:gmalca/slackgpt.git`
2. Enter directory: `cd slackgpt`
3. Install dependencies: `npm install`
4. Rename `.env.example` to `.env`
5. Edit `.env` and add your `SLACK_SIGNING_SECRET` (Slack Instructions Step 9), `SLACK_BOT_TOKEN` (Slack Instructions Step 8), `SLACK_APP_TOKEN` (Slack Instructions Step 5) and `OPENAI_API_KEY` (OpenAI Instructions Step 4)
6. Run the app: `npm start server.js`

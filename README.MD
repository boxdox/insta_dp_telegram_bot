# Instagram Profile Picture Viewer bot for Telegram

This bot helps you to download profile picture of any Instagram user.
_Note: For security reasons and to prevent API abuse, the API being used is stored in environment variables_

## Usage

Use this link to get started [t.me/instagram_dp_bot](https://t.me/instagram_dp_bot) or search for `@instagram_dp_bot`

It has two commands:

1. /start : Initializes the bot and displays help
2. /get _username_ : This command to get profile picture of specified username
3. _instagram url_ : Directly paste the instagram profile url

## Development

Previously, this bot was built using python [(available here)](https://github.com/boxdox/insta_dp_telegram_bot/tree/python), but now I have switched to Node.JS

_Note: the bot assumes that the API Token and API URL is available in the environment variables as `API_TOKEN` as `PROFILE_PIC_API`, be sure to set it before running the bot_

```
git clone https://github.com/boxdox/insta_dp_telegram_bot.git
cd insta_dp_telegram_bot
yarn
yarn dev
```

## Deployment

You can directly deploy the bot to any PaaS like `Heroku`, then run:

```
yarn start
```

## Licence

[MIT Licence](https://boxdox.mit-license.org)

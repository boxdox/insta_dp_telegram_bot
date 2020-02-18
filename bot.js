/*
 * Copyright (c) 2020 MIT
 * @File: bot.js
 * @Author: boxdox
 * @Date: Tuesday, February 18th 2020
 * @Last Modified: Tuesday, February 18th 2020
 */

const Telegraf = require("telegraf");
const axios = require("axios");

// Initialize the bot
const bot = new Telegraf(process.env.API_TOKEN);

// Send the welcome message
bot.start(({ reply }) => {
  reply(
    "I will send you HighDefinition DP from Instagram! Usage: /get username"
  );
});

// Bot Help
bot.command("help", ({ reply }) => {
  reply("Use `/get username` to get started");
});

// Bot `/get` command
bot.command("get", ({ message, reply, replyWithPhoto }) => {
  const data = message.text.split(" ");
  // Validate input
  if (data.length !== 2) {
    reply("Invalid Request. Use `/get username`");
  } else {
    const username = data[1];
    reply("Please wait for a few seconds...");
    axios
      .get(`https://instagram.com/${username}`)
      .then(res => {
        if (res.status === 200) {
          return res.data;
        }
      })
      .then(body => {
        // Magic! xD
        const l = body.search("pic_url_hd") + 13;
        const r = body.search("requested_by_viewer") - 3;
        return body.slice(l, r).replace(/\\u0026/gm, "&");
      })
      .then(image => {
        replyWithPhoto(image).catch(() =>
          reply("An error occured while sending the image. Please Try Again")
        );
      })
      .catch(error => {
        if (error.response.status === 404) {
          reply("No such account exists. Check the username and try again.");
        } else {
          reply("Some error has occured. Try again later.");
        }
      });
  }
});

bot.launch();

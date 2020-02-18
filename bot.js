/*
 * Copyright (c) 2020 MIT
 * @File: bot.js
 * @Author: boxdox
 * @Date: Tuesday, February 18th 2020
 * @Last Modified: Tuesday, February 18th 2020
 */

const Telegraf = require("telegraf");
const axios = require("axios");

// Function to get instagram profile picture
const getProfilePicture = username => {
  return axios
    .get(`https://instagram.com/${username}`)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      } else {
        return Promise.reject("No account exists");
      }
    })
    .then(body => {
      const l = body.search("pic_url_hd") + 13;
      const r = body.search("requested_by_viewer") - 3;
      return body.slice(l, r).replace(/\\u0026/gm, "&");
    })
    .catch(err => {
      console.log(err);
    });
};

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
  const username = message.text.split(" ")[1];
  reply("Please wait for a few seconds...");
  getProfilePicture(username).then(image => {
    replyWithPhoto(image);
  });
});

bot.launch();

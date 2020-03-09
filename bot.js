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
  reply(
    `Usage:
-----------------
/get username
or
paste the profile url 
to get started
Problems? open an issue on github repo
https://git.io/JvouT`
  );
});

// Check for profile link as message
bot.on("message", ({ message, reply, replyWithPhoto }) => {
  const URL_REGEX = /http(?:s)?:\/\/(?:www\.)?instagram.com\/(.*)/;
  const COMMAND_REGEX = /\/get (.*)/;
  const { text } = message;
  let username;
  // Test the message type:
  // If it is a profile link
  if (URL_REGEX.test(text)) {
    username = text.match(URL_REGEX)[1];
    if (username.includes("?")) {
      username = username.split("?")[0];
    }
  }
  // If it is a /get command
  else if (COMMAND_REGEX.test(text)) {
    username = text.match(COMMAND_REGEX)[1];
    if (username.includes(" ")) {
      username = null;
      reply("Invalid username, try again.");
    }
  } // If none matches
  else {
    reply(
      "Invalid Command. Use /get 'username', or paste a profile url or try /help"
    );
  }

  // Check if username was defined from either of two regex checks and send the photo
  if (username !== undefined && username !== null && username !== "") {
    reply("Please wait for a few seconds...");
    getProfileId(username, reply).then(id =>
      getProfilePic(id).then(photo =>
        replyWithPhoto(photo).catch(() =>
          reply("An error occured while sending the image. Please Try Again")
        )
      )
    );
  }
});

// Get the profile id
const getProfileId = (username, reply) => {
  return axios
    .get(`https://instagram.com/${username}`)
    .then(res => {
      if (res.status === 200) {
        return res.data;
      }
    })
    .then(data => {
      const graphqlData = JSON.parse(
        data.split("window._sharedData = ")[1].split(";</script>")[0]
      ).entry_data.ProfilePage[0].graphql;
      return graphqlData.user.id;
    })
    .catch(error => {
      if (error.response.status === 404) {
        reply("No such account exists. Check the username and try again.");
      } else {
        reply("Some error has occured. Try again later.");
      }
    });
};

// Get hd profile pic from the id
const getProfilePic = id => {
  return axios
    .get(`${process.env.PROFILE_PIC_API}${id}`)
    .then(res => res.data)
    .then(url => {
      testRegex = /(https:\/\/.*)<br><br><br>/;
      return url.match(testRegex)[1];
    })
    .catch(err => {
      console.log(err.response);
    });
};

bot.launch();

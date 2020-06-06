/*
 * Copyright (c) 2020 MIT
 * @File: bot.js
 * @Author: boxdox
 * @Date: Tuesday, February 18th 2020
 * @Last Modified: Saturday, June 6th 2020
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
bot.on("message", async ({ message, reply, replyWithPhoto }) => {
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
    try {
      const id = await getProfileId(username, reply);
      const imageUrl = await getProfilePic(id, reply);

      try {
        await replyWithPhoto(imageUrl);
      } catch ({ response }) {
        throw new Error("Couldn't send the image, please try again later.");
      }
    } catch ({ message }) {
      reply(message);
    }
  }
});

// Get the profile id
const getProfileId = async (username, reply) => {
  try {
    const res = await axios.get(`https://instagram.com/${username}`);
    if (res.status === 200) {
      const graphData = await JSON.parse(
        res.data.split("window._sharedData = ")[1].split(";</script>")[0]
      ).entry_data.ProfilePage[0].graphql;
      return graphData.user.id;
    }
  } catch ({ response }) {
    if (response.status === 404) {
      throw new Error(
        "No such account exists. Check the username and try again."
      );
    } else {
      throw new Error("Some error has occured. Try again later.");
    }
  }
};

// Get hd profile pic from the id
const getProfilePic = async (id, reply) => {
  const testRegex = /(https:\/\/.*)<br><br><br>/;

  try {
    const res = await axios.get(`${process.env.PROFILE_PIC_API}${id}`);
    return res.data.match(testRegex)[1];
  } catch ({ response }) {
    throw new Error("API Error, please try again later.");
  }
};

bot.launch();

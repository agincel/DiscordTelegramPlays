/*
    DiscordPlays & Soon (tm) to Be TelegramPlays Bot
    Adam Gincel - 2018
*/

const Promise = require("bluebird");
const fs = require("fs");
const startDate = new Date(); //use to ignore all old messages

//Telegram init
let usingTelegram = fs.existsSync("./app/telegramToken.txt");
let TelegramBot = null;
if (usingTelegram) {
  const Telegram = require('node-telegram-bot-api'); //telegram
  let telegramToken = fs.readFileSync("./app/telegramToken.txt", "utf8");
  telegramToken = telegramToken.replace("\n", "");
  console.log("Logging into Telegram.");
  TelegramBot = new Telegram(telegramToken, {polling: true});
} else {
  console.log("Not using Telegram as no Bot token was found in './app/telegramToken.txt'.");
}

//Discord init
let usingDiscord = fs.existsSync("./app/discordToken.txt");
let DiscordBot = null;
if (usingDiscord) {
  const Discord = require("discord.js"); //discord
  DiscordBot = new Discord.Client();

  let discordToken = fs.readFileSync("./app/discordToken.txt", "utf8");
  discordToken = discordToken.replace("\n", "");

  console.log("Logging into Discord.");
  DiscordBot.login(discordToken);
  DiscordBot.on("ready", () => {
    console.log(`Discord is logged in as ${DiscordBot.user.tag}!`);
  });
} else {
  console.log("Not using Discord as no Bot token was found in './app/discordToken.txt'.");
}

let supportedChannel = "discord-plays";
if (fs.existsSync("./app/supportedChannel.txt")) {
  let supportedChannel = fs.readFileSync("./app/supportedChannel.txt", "utf8");
  supportedChannel = supportedChannel.replace("\n", "");
  console.log("Listening Discord channel name set to: " + supportedChannel);
} else {
  console.log("No Discord listening channel name defined in './app/supportedChannel.txt' -- using default 'discord-plays'.");
}

const config = require("./config.js");
const keyHandler = require("./keyHandler.js");

let democracyVotes = {};

function delay(t) {
  //kinda hacky but useful
  return new Promise(function(resolve) {
    setTimeout(resolve, t);
  });
}

async function genericSendMessage(text, platform, parameters) {
  if (platform == "telegram") {
    const ret = await TelegramBot.sendMessage(parameters.chatId, text, {
      parse_mode: "Markdown"
    });
    return ret;
  } else {
    const ret = await parameters.msg.channel.send(text);
    return ret;
  }
}

async function genericEditMessage(text, platform, parameters, msg) {
  if (platform == "telegram") {
    return await TelegramBot.editMessageText(text, {
      chat_id: parameters.chatId,
      message_id: msg.message_id,
      parse_mode: "Markdown"
    });
  } else {
    return await msg.edit(text);
  }
}

async function handleMessage(text, platform, platformObject, args, IDs) {
  if (args[0].indexOf("@") > -1) {
    args[0] = args[0].split("@")[0]; //change /command@BotUserName to /command, really should check for equality with username but meh
  }

  async function sendMessage(text) {
    return await genericSendMessage(text, platform, platformObject);
  }
  async function editMessage(text, msg) {
    return await genericEditMessage(text, platform, platformObject, msg);
  }

  //command replies
  if (args[0] == "/ping") {
    return await sendMessage("Hello, I am online.");
  }

  if (
    (platform == "discord" && platformObject.msg.channel.name == supportedChannel) ||
    (platform == "telegram")
  ) {
    let usableCommands = []; //determine how many commands in this message are in config.commands
    for (let i = 0; i < args.length; i++) {
      for (let j = 0; j < config.commands.length; j++) {
        if (args[i].toLowerCase() == config.commands[j].toLowerCase()) {
          usableCommands.push(args[i].toLowerCase());
        }
      }
    }

    let commandsToExecute = usableCommands.length; //limit the execution of those messages to the first config.executePerMessage many commands
    if (commandsToExecute > config.executePerMessage && config.mode == "anarchy") {
      commandsToExecute = config.executePerMessage;
    } else if (config.mode == "democracy") {
      commandsToExecute = 0;
      if (usableCommands.length > 0) { //vote for the first command you typed
        if (democracyVotes[usableCommands[0]]) {
          democracyVotes[usableCommands[0]] += 1;
        } else {
          democracyVotes[usableCommands[0]] = 1;
        }
      }
    }
    for (let i = 0; i < commandsToExecute; i++) { //for each of the first commandsToExecute commands, send them to the keyHandler. Does not execute if in Democracy.
      keyHandler.sendKey(usableCommands[i]);
      console.log(
        platformObject.username + ": " + usableCommands[i]
      );
      await delay(config.delay);
    }

    if (usableCommands.length == 0) {
      //If this was just a normal message, print it to the log prepended with a ~
      console.log("~" + platformObject.username + ": " + text);
    }
  }
}

if (usingDiscord) {
  DiscordBot.on("message", async msg => {
    if (new Date(msg.createdTimestamp) > startDate) {
      //console.log("Got a discord message: " + msg.content);

      return await handleMessage(
        msg.content,
        "discord",
        { msg: msg, username: msg.author.username },
        msg.content.toLowerCase().split(" "),
        { telegram: false, discord: msg.author.id }
      );
    } else {
      console.log("Skipping discord message: " + msg.content);
      return null;
    }
  });
}

if (usingTelegram) {
  TelegramBot.on('message', async (msg) => {
      if (new Date(msg.date * 1000) > startDate && msg.text) {
          const chatId = msg.chat.id;
          //console.log("Got a telegram message: " + msg.text);
          return await handleMessage(msg.text, "telegram", {chatId: chatId, msg: msg, username: msg.from.username ? msg.from.username : msg.from.first_name}, msg.text.toLowerCase().split(" "), {telegram: msg.from.id, discord: false});
      } else if (msg.text) {
          return null;
      }
  });
}

function applyDemocracy() {
  let votes = Object.keys(democracyVotes);
  let winningVote = "";
  let winningVoteScore = -1;
  for (let i = 0; i < votes.length; i++) {
    if (democracyVotes[votes[i]] > winningVoteScore) {
      winningVoteScore = democracyVotes[votes[i]];
      winningVote = votes[i];
    }
  }

  if (winningVote != "") {
    console.log("\'" + winningVote + "\' was selected with " + winningVoteScore.toString() + " votes.");
    keyHandler.sendKey(winningVote);
  } else {
    console.log("No option selected.");
  }

  democracyVotes = {}; //vaguely hacky I know, but it clears the object
}

setInterval(applyDemocracy, config.democracyTimer);
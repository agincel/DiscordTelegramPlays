/*
    Discord & Telegram Bot 
    Adam Gincel - 2018
*/

const Promise = require("bluebird");
const fs = require("fs");
/*
const Telegram = require('node-telegram-bot-api'); //telegram
var telegramToken = fs.readFileSync("./app/telegramToken.txt", "utf8");
telegramToken = telegramToken.replace("\n", "");*/
//const TelegramBot = new Telegram(telegramToken, {polling: true});

const Discord = require("discord.js"); //discord
const DiscordBot = new Discord.Client();
var discordToken = fs.readFileSync("./app/discordToken.txt", "utf8");
discordToken = discordToken.replace("\n", "");
console.log("Logging into Discord?");
DiscordBot.login(discordToken);

const startDate = new Date(); //use to ignore all old messages


var config = require("./config.js");
var keyHandler = require('./keyHandler.js');

var supportedChannel = fs.readFileSync("./app/supportedChannel.txt", "utf8");
supportedChannel = supportedChannel.replace("\n", "");
console.log(supportedChannel);

function delay(t) { //kinda hacky but useful
	return new Promise(function(resolve) { 
		setTimeout(resolve, t)
	});
}

DiscordBot.on('ready', () => {
    console.log(`Discord is logged in as ${DiscordBot.user.tag}!`);
});

async function genericSendMessage(text, platform, parameters) {
    if (platform == "telegram") {
        var ret = await TelegramBot.sendMessage(parameters.chatId, text, {parse_mode: "Markdown"});
        return ret;
    } else {
        var ret = await parameters.msg.channel.send(text);
        return ret;
    }
}

async function genericEditMessage(text, platform, parameters, msg) {
    if (platform == "telegram") {
        return await TelegramBot.editMessageText(text, {chat_id: parameters.chatId, message_id: msg.message_id, parse_mode: "Markdown"});
    } else {
        return await msg.edit(text);
    }
}

async function handleMessage(text, platform, platformObject, args, IDs) {

    if (args[0].indexOf("@") > -1) {
        args[0] = args[0].split("@")[0]; //change /command@BotUserName to /command, really should check for equality with username but meh
    }

    async function sendMessage (text) {
        return await genericSendMessage(text, platform, platformObject);
    }
    async function editMessage(text, msg) {
        return await genericEditMessage(text, platform, platformObject, msg);
    }


    //command replies
    if (args[0] == "/ping") {
        return await sendMessage("Hello, I am online.");
    } 

    if (platform == "discord" && platformObject.msg.channel.name == supportedChannel) {
        var usableCommands = [];
        for (let i = 0; i < args.length; i++) {
            for (let j = 0; j < config.commands.length; j++) {
                if (args[i].toLowerCase() == config.commands[j].toLowerCase()) {
                    usableCommands.push(args[i].toLowerCase());
                }
            }
        }
        let commandsToExecute = usableCommands.length;
        if (commandsToExecute > 3)
        	commandsToExecute = 3;
        for (let i = 0; i < commandsToExecute; i++) {
            keyHandler.sendKey(usableCommands[i]);
            console.log(platformObject.msg.author.username + ": " + usableCommands[i]);
            await delay(config.delay);
        }

        if (usableCommands.length == 0) {
            console.log("~" + platformObject.msg.author.username + ": " + text);
        }
    }
    
}


DiscordBot.on('message', async msg => {
    
    if (new Date(msg.createdTimestamp) > startDate) {
        //console.log("Got a discord message: " + msg.content);
        
        return await handleMessage(msg.content, "discord", {msg: msg}, msg.content.toLowerCase().split(" "), {telegram: false, discord: msg.author.id});
    } else {
        console.log("Skipping discord message: " + msg.content);
        return null;
    }
});
/*
TelegramBot.on('message', async (msg) => {
    if (new Date(msg.date * 1000) > startDate && msg.text) {
        const chatId = msg.chat.id;
        console.log("Got a telegram message: " + msg.text);
        return await handleMessage(msg.text, "telegram", {chatId: chatId, msg: msg}, msg.text.toLowerCase().split(" "), {telegram: msg.from.id, discord: false});
    } else if (msg.text) {
        console.log("Skipping telegram message: " + msg.text);
        return null;
    }
});*/
//var nconf = require('nconf').argv().env().file({ file:'config.json' });
var fs = require("fs");

// List of commands to check for
var commands = [
    'left', 'right', 'up', 'down',
    'start', 'select',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'space', 'enter', 'shift',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
];

var ircConfig = {
    // Either 'windows' or 'other'
    os: 'windows',

    // Title of the window of the program
    // Ex: 'Desmume' or 'VBA'
    programName: "na",

    // Ex: irc.twitch.tv or 199.9.252.26
    server: 'irc.twitch.tv',
    // Your twitch username
    //nick: username,
    // oauth token from www.twitchapps.com/tmi
    //password: oauth,
    // name of channel
    //channel: channel,

    // If you want to print usernames/commands like in twitchplayspokemon
    printToConsole: true,
    // Maximum characters to show for a person's name in the console log
    maxCharName: 8,
    // Maximum characters to show for a command in the console log
    // Ex: left => left since only 4 char, democracy => democra
    maxCharCommand: 10,

    // If you need to filter the commands sent to the program
    // Ex: democracy/anarchy since they don't affect the program itself
    // Ex: ["democracy","anarchy"]
    filteredCommands: [],

    // If you want to prevent people from using from command too often
    // Ex: ["start"]
    throttledCommands: [],
    // Throttle time in seconds
    // Ex: you can limit 'start' so it's only used every 10 sec
    timeToWait: 10000,

    // Linux: delay between each possible keypress in ms (can't be too fast)
    // If you want to change delay for windows - change key.py
    delay: 100,

    sendKey: true,
    commands: commands
};

module.exports = ircConfig;

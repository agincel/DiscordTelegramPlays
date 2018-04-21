// List of commands to check for
const commands = [
  "left",
  "right",
  "up",
  "down",
  "start",
  "select",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "space",
  "enter",
  "shift",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "c1",
  "c2",
  "c3",
  "c4",
  "c5",
  "c6",
  "c7",
  "c8",
  "c9",
  "c10",
  "c11",
  "c12",
  "c13",
  "b1",
  "b2",
  "b3",
  "b4",
  "b5",
  "b6",
  "b7",
  "b8",
  "b9",
  "b10",
  "b11",
  "b12",
  "b13",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "h7",
  "h8",
  "h9",
  "h10",
  "face",
  "hh",
  "pp",
  "end"
];

const programConfig = {
  // Either 'windows' or 'other', currently only windows works
  os: "windows",

  // Title of the window of the program
  // Ex: 'Desmume' or 'VBA'
  // Currently disabled for DiscordTelegramPlays, which instead sends input to the ForegroundWindow
  programName: "na",

  // Ex: irc.twitch.tv or 199.9.252.26
  server: "irc.twitch.tv",
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

  // Delay between consecutive commands in one message in Anarchy mode
  delay: 150,

  sendKey: true,
  commands: commands,
  executePerMessage: 4,
  mode: "democracy", // "democracy" to tally votes every democracyTimer seconds, or "anarchy" to send all inputs through
  democracyTimer: 10000 // number of milliseconds to wait between each input
};

module.exports = programConfig;

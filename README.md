# DiscordPlays
A NodeJS Discord bot that sends input to a Python Win32 API, allowing for Discord messages to affect input on a PC. Similar to Twitch Plays.

## Installation
You need [NodeJS](https://nodejs.org/en/download/), [Python 3.5](https://www.python.org/downloads/release/python-364/) or higher, and the corresponding version of [PyWin32](https://github.com/mhammond/pywin32/releases). Make sure Python is in your path. If you're not sure it's working, you should be able to run `python` and type the command `import win32ui` -- if it works, the environment is set up properly.

Run `npm install` in the directory to install all required NodeJS libraries. 

## Required created files
`./app/discordToken.txt`
    This file needs to exist, and needs to be populated with your Discord Bot User Token.
`./app/supportedChannel.txt`
    Whatever text is in this file is the name of the channel that will be checked -- for example, if the contents of this file are:
    ```
    discord-plays
    ```
    Any channel on any server the bot is in with the name `discord-plays` will send input to the bot. Yes, you could fairly easily change this to use a specific unique channel ID if you wanted.

## Operation
Run `npm start` in the root directory of this project to run the file. It will spin up a Discord bot with the token provided, and will start performing events upon message reciept.

The bot takes all messages received from users and splits them up by spaces. The message "hello there a b c" becomes ["hello", "there", "a", "b", "c"]
Each of those is compared against the command list in `./app/config.js`. Any of those (up until the first X, see the for loop in `./app/index.js`), will be sent to `./app/keyHandler.js`
`./app/keyHandler.js` has a dictionary that can change the input accepted string to something else before sending it to `./app/key.py`, if you deem that necessary. It currently changes `Start` to `s`, for example.
`./app/key.py` is where the magic happens. There's a big dictionary mapping any string (received from `keyHandler.js`) to a literal keycode. These are then sent as key events to the currently focused window. (with some reworking this also supports only targeting a specific window by name, but I found that more cumbersome).
    Some work could be done here to make pywin32 support Xinput, Mouse input, etc if desired.

## Commands
Many commands are baked in by default -- full alphanumeric support, plus spacebar, shift, and enter. These can be added or removed in `./app/config.js`. Anything in that file will be recognized as a valid command by the bot and forwarded to `./app/keyHandler.js` when it's received.

## What's with all of these references to Telegram, and these generic functions?
This started as a combined Discord & Telegram bot I made. With a little more work it will be possible to make this support `TelegramPlays` as well as `DiscordPlays`. At that time I will probably change the repo name. Sorry for the confusion! As of right now the bot only supports Discord.

## Credits
This project used [hzoo's Twitch Plays X](https://github.com/hzoo/TwitchPlaysX/) as a starting point. This project is under the same MIT license as that project -- it's great!
# DiscordTelegramPlays
A NodeJS Combination Discord and/or Telegram Bot that sends input to a Python Win32 API, allowing for received messages to affect input on a PC. Similar to Twitch Plays.

## Installation
You need [NodeJS](https://nodejs.org/en/download/), [Python 3.5](https://www.python.org/downloads/release/python-364/) or higher, and the corresponding version of [PyWin32](https://github.com/mhammond/pywin32/releases). Make sure Python is in your path. If you're not sure it's working, you should be able to run `python` and type the command `import win32ui` -- if it works, the environment is set up properly.

Run `npm install` in the directory to install all required NodeJS libraries. 

## Required created files
- `./app/discordToken.txt`
    - In order to use a Discord Bot, this file needs to exist and needs to be populated with your Discord Bot User Token.
- `./app/telegramToken.txt`
    - Similarly, in order to use a Telegram Bot, this file must exist and needs to be populated with your Telegram Bot User Token.
- `./app/supportedChannel.txt`
    - Whatever text is in this file is the name of the Discord channel that will be checked -- for example, if the contents of this file are:

    ```
    discord-plays
    ```

    - Any channel on any server the bot is in with the name "discord-plays" will send input to the bot.
        - Yes, you could fairly easily change this to use a specific unique channel ID if you wanted.
        - Yes, this also could be in config.js. I decided to make it external as to keep any server channel names private, just in case someone was worried about that.
        
## I need both a Telegram and a Discord Bot for this?
Nope! If the program does not find a `./app/telegramToken.txt` or a `./app/discordToken.txt`, it will simply inform you it is not using any of the respective platform's functionality, and will proceed as normal. You need at least one set up to do anything, of course.

## Operation
Run `npm start` in the root directory of this project to run the file. It will spin up a Discord bot with the token provided, and will start performing events upon message reciept.

- The bot takes all messages received from users and splits them up by spaces. The message "hello there a b c" becomes ["hello", "there", "a", "b", "c"]
- Each of those is compared against the command list in `./app/config.js`. Any of those (up until the first X, see the for loop in `./app/index.js`), will be sent to `./app/keyHandler.js`
- `./app/keyHandler.js` has a dictionary that can change the input accepted string to something else before sending it to `./app/key.py` or `./app/mouse.py`, if you deem that necessary. It currently changes `start` to `s`, for example.
- `./app/key.py` is where the magic happens. There's a big dictionary mapping any string (received from `keyHandler.js`) to a literal keycode. These are then sent as key events to the currently focused window. (with some reworking this also supports only targeting a specific window by name, but I found that more cumbersome).
- `./app/mouse.py` receives a string in the form `"x,y"`, parsing those into x y coordinates to be clicked. These coordinates can be scaled using the `mult` variable to account for Windows Display Scaling, which in Windows 10 is set to 125% by default.
    - The program has some built-in mouse coordinate mappings for you to use as an example. It wouldn't take much work to allow users to send arbitrary coordinates, if desired.

## Commands
Many commands are baked in by default -- full alphanumeric support, plus spacebar, shift, and enter. These can be added or removed in `./app/config.js`. Anything in that file will be recognized as a valid command by the bot and forwarded to `./app/keyHandler.js` when it's received.

## Democracy and Anarchy
Similarly to Twitch Plays, this Bot supports both Democracy and Anarchy modes. While there is currently no way for users to switch between them, setting config.js's `mode` variable to "democracy" or "anarchy" will behave how you expect.
- In Anarchy mode, all commands sent by users are instantly executed. By default, the first `config.executePerMessage` commands sent will be executed, to prevent thousands of commands being executed from a single long message.
- In Democracy mode, the first command of each message counts as a vote towards the usage of that comand. Each `config.democracyTimer` milliseconds, the bot finds which command won the most points and executes it.

## Credits
This project used [hzoo's Twitch Plays X](https://github.com/hzoo/TwitchPlaysX/) as a starting point. This project is under the same MIT license as that project -- check it out!

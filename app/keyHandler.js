var spawn = require("child_process").spawn;
var config = require('./config.js'),
lastTime = {},
windowID = 'unfilled',
throttledCommands = config.throttledCommands,
regexThrottle = new RegExp('^(' + throttledCommands.join('|') + ')$', 'i'),
regexFilter = new RegExp('^(' + config.filteredCommands.join('|') + ')$', 'i');

for (var i = 0; i < throttledCommands.length; i++) {
    lastTime[throttledCommands[i]] = new Date().getTime();
}

function delay(t) {
	return new Promise(function(resolve) { 
		setTimeout(resolve, t)
	});
}


function setWindowID() {
    if (config.os === 'other' & windowID === 'unfilled') {
        exec('xdotool search --onlyvisible --name ' + config.programName, function(error, stdout) {
            windowID = stdout.trim();
            // console.log(key, windowID);
        });
    }
}

var defaultKeyMap = {
    'up':'Up','left':'Left','down':'Down','right':'Right','space':'Space','enter':'Enter','shift':'Shift','start':'s','select':'e'
};

async function sendKey(command) {
    //if doesn't match the filtered words
    if (!command.match(regexFilter)) {
        var allowKey = true,
        key = defaultKeyMap[command] || command;
        //throttle certain commands (not individually though)
        if (key.match(regexThrottle)) {
            var newTime = new Date().getTime();
            if (newTime - lastTime[key] < config.timeToWait) {
                allowKey = false;
            } else {
                lastTime = newTime;
            }
        }
        if (allowKey) {
            //console.log('python key.py na ' + key);
            spawn('python',["./app/key.py", "na", key]);
        }
    }
}


//Only actually does something when not running under windows.
setWindowID();

exports.sendKey = sendKey;

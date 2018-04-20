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
    'start':'s','select':'e'
};

var mouseMap = {
		"c1":"547,407",
		"c2":"617,407",
		"c3":"681,407",
		"c4":"757,407",
		"c5":"818,407",
		"c6":"890,407",
		"c7":"960,407",
		"c8":"1031,407",
		"c9":"1096,407",
		"c10":"1167,407",
		"c11":"1233,407",
		"c12":"1307,407",
		"c13":"1368,407",
		"b1":"547,588",
		"b2":"617,588",
		"b3":"681,588",
		"b4":"757,588",
		"b5":"818,588",
		"b6":"890,588",
		"b7":"960,588",
		"b8":"1031,588",
		"b9":"1096,588",
		"b10":"1167,588",
		"b11":"1233,588",
		"b12":"1307,588",
		"b13":"1368,588",
		"face":"963,201",
		"hh":"962,830",
		"pp":"1137,822",
		"end":"1557,490",
		"h1":"645,1046",
        "h2":"702,1046",
        "h3":"758,1046",
        "h4":"817,1046",
        "h5":"867,1046",
        "h6":"918,1046",
        "h7":"975,1046",
        "h8":"1030,1046",
        "h9":"1083,1046",
        "h10":"1140,1046"
}

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
        if (allowKey && !mouseMap[command]) {
            //if we're allowed and this is not a mouse command
            //send key to key.py
            spawn('python',["./app/key.py", key]);
        } else if (allowKey) {
        	//this is a mouse command, send those coordinates to mouse.py
        	spawn('python', ["./app/mouse.py", mouseMap[command]]);
        }
    }
}


//Only actually does something when not running under windows.
setWindowID();

exports.sendKey = sendKey;

'use strict';

var getColor = require('./getColor.js');


function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}

var minColor = 12570;
var maxColor = 20000;

function runColor() {

	try {
		getColor(minColor++);
	}
    catch (err) {
    	console.log(minColor + " failed");
    	console.log(err);
    }

    if (minColor <= maxColor) {
		setTimeout(runColor, 1010);
    }
}

runColor();
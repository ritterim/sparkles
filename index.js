var gpio = require('rpi-gpio');
var Hapi = require('hapi');
var moment = require('moment');
var request = require('request');
var server = new Hapi.Server(process.env.PORT);

gpio.setup(7, gpio.DIR_OUT, function() {
    gpio.write(7, true);
    console.log('Pin 7 is setup for output.');
});

var config = {
    queryInterval: process.env.QUERY_INTERVAL,
    teamcity: {
        user: process.env.TC_USER,
        password: process.env.TC_PASSWORD,
        baseUri: process.env.TC_URI
    }
};

var pingTeamcityBuildQueue = function() {

    var options = {
        url: 'http://' + config.teamcity.baseUri + '/httpAuth/app/rest/builds?locator=branch:default:any,running:true',
        method: 'GET',
        auth: {
            'user': config.teamcity.user,
            'pass': config.teamcity.password
        },
        json: true,
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        }
    };

    console.log('waiting for teamcity...');
    request.get(options, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            console.log("current # of builds " + "(" + moment().format("dddd, MMMM Do YYYY, h:mm:ss a") + ") : " + body.count );
            toggleLights(body.count);
        }
        setTimeout(pingTeamcityBuildQueue, config.queryInterval);
    });
}

var toggleLights = function(buildCount) {
    if (buildCount > 0) {
        gpio.write(7, false, function(err) {
            console.log('The lights are on.');
        });
    }
    else {
        gpio.write(7, true, function(err) {
            console.log('The lights are off.');
        });
    }
}

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply("Hello, I'm sparkles!");
    }
});

server.start(function () {
    console.log('Sparkles running at: ', server.info.uri);
    pingTeamcityBuildQueue();
});


var lightManager = require('./lightManager');
var moment = require('moment');
var request = require('request');

var buildingLightManager = function(config) {
    var light = new lightManager(config.get('lights.building'));

    var lightsInterval = null;
    var lightsStatus = true;

    var pingTeamcityBuildQueue = function() {

        var teamCityConfig = {
            url: 'http://' + config.get('teamcity.baseUri') + '/httpAuth/app/rest/builds?locator=branch:default:any,running:true',
            method: 'GET',
            auth: {
                'user': config.get('teamcity.user'),
                'pass': config.get('teamcity.password')
            },
            json: true,
            headers : {
                'Accept' : 'application/json',
                'Content-Type' : 'application/json'
            }
        };

        console.log('waiting for teamcity...');
        request.get(teamCityConfig, function (error, response, body) {
            if (error) {
                console.log(error);
            } else {
                console.log("current # of builds " + "(" + moment().format("dddd, MMMM Do YYYY, h:mm:ss a") + ") : " + body.count );
                toggleLights(body.count);
            }

            processTeamCityResponse(body);

            config.get('io').emit('teamcity.building', formatMessageResponse());

            setTimeout(pingTeamcityBuildQueue, config.get('teamcity.queryInterval'));
        });
    }

    var toggleLights = function(buildCount) {
        if (buildCount > 0) {
            if (lightsInterval == null) {
                lightsInterval = setInterval(function() {
                    lightsStatus = !lightsStatus;

                    lightsStatus === true ? light.turnOn() : light.turnOff();
                }, 500);
            }
        }
        else {
            clearInterval(lightsInterval);
            lightsInterval = null;

            light.turnOff();
        }
    }

    var buildTimeInterval =  null;
    var currentBuildTime = 0;
    var currentBuildCount = 0;

    var processTeamCityResponse = function(response) {
        currentBuildCount = response.count;

        if (currentBuildCount === 0) {
            clearInterval(buildTimeInterval);
            buildTimeInterval = null;
            currentBuildTime = 0;
        }
        else if (currentBuildCount > 0) {
            if (buildTimeInterval === null) {
                buildTimeInterval = setInterval(function() {
                    currentBuildTime += 1;
                }, 1000);
            }
        }
    };

    var formatMessageResponse = function() {
        var buildTime = '';

        if (currentBuildTime > 0) {
            var buildTime = currentBuildTime;
            var minutes = parseInt(buildTime / 60);
            var seconds = buildTime % 60;

            minutes = minutes > 9 ? minutes : '0' + minutes;
            seconds = seconds > 9 ? seconds : '0' + seconds;

            buildTime = minutes + ':' + seconds;
        }
        else {
            buildTime = '--:--';
        }

        return {
            count: currentBuildCount,
            elapsedTime: buildTime
        };
    }

    this.start = function() {
        pingTeamcityBuildQueue();
    }
};

module.exports = buildingLightManager;

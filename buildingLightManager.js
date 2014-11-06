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

    this.start = function() {
        pingTeamcityBuildQueue();
    }
};

module.exports = buildingLightManager;

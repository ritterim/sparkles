var lightManager = require('./lightManager');
var moment = require('moment');
var request = require('request');
var cheerio = require('cheerio');

var passFailLightManager = function(config) {
    var passLight = new lightManager(config.get('lights.pass'));
    var failLight = new lightManager(config.get('lights.fail'));
    var togglePassFailLightsInterval = null;
    var togglePassLight = true;

    var scrapeTeamCity = function() {
        var teamCityConfig = {
            url: 'http://' + config.get('teamcity.baseUri'),
            method: 'GET',
            auth: {
                'user': config.get('teamcity.user'),
                'pass': config.get('teamcity.password')
            }
        };

        request.get(teamCityConfig, function(error, response, body) {
            clearInterval(togglePassFailLightsInterval);

            togglePassFailLightsInterval = setInterval(function() {
                togglePassFailLights(togglePassLight);
                togglePassLight = !togglePassLight;
            }, 200);

            var $ = cheerio.load(body);
            var failuresExist = false;

            $('td.projectName').each(function() {
                var $this = $(this);
                var projectTitle = $this.find('a').text();
                var projectStatus = $this.find('.handle').attr('title');

                failuresExist = projectStatus.indexOf('fail') !== -1 && !isProjectInExclusionList(projectTitle, config.get('lights.fail.exclusionList')) ? true : failuresExist;

                console.log('%s (%s)', projectTitle, projectStatus);
            });

            setTimeout(function() {
                if (failuresExist) {
                    passLight.turnOff();
                    failLight.turnOn();
                }
                else {
                    failLight.turnOff();
                    passLight.turnOn();
                }

                pushAllPassingStatusMessage({ isAllPassing: !failuresExist, isStatusUnknown: false });
                clearInterval(togglePassFailLightsInterval);
            }, 1000);

            setTimeout(scrapeTeamCity, config.get('teamcity.buildStatusQueryInterval'));
        });
    }

    function isProjectInExclusionList(project, exclusionList) {
        for (var i = 0; i < exclusionList.length; i++) {
            if (exclusionList[i].indexOf(project) !== -1) {
                return true;
            }
        }

        return false;
    }

    function pushAllPassingStatusMessage(message) {
        config.get('io').emit('teamcity.buildStatus', message);
    }

    function togglePassFailLights(togglePass) {
        if (togglePass) {
            pushAllPassingStatusMessage({ isAllPassing: true, isStatusUnknown: true });
            failLight.turnOff();
            passLight.turnOn();
        }
        else {
            pushAllPassingStatusMessage({ isAllPassing: false, isStatusUnknown: true });
            passLight.turnOff();
            failLight.turnOn();
        }
    }

    this.start = function() {
        scrapeTeamCity();
    }
};

module.exports = passFailLightManager;

var lightManager = require('./lightManager');
var moment = require('moment');
var request = require('request');
var cheerio = require('cheerio');

var passFailLightManager = function(options) {
    if (typeof options === 'undefined') {
        options = {
            lights: {
                pass: {},
                fail: {
                    exclusionList: []
                }
            },
            teamcity: {
                baseUri: '',
                password: '',
                buildStatusQueryInterval: '',
                user: ''
            }
        };
    }

    var passLight = new lightManager(options.lights.pass);
    var failLight = new lightManager(options.lights.fail);    
    var togglePassFailLightsInterval = null;
    var togglePassLight = true;

    var scrapeTeamCity = function() {
        var teamCityOptions = {
            url: 'http://' + options.teamcity.baseUri,
            method: 'GET',
            auth: {
                'user': options.teamcity.user,
                'pass': options.teamcity.password
            }
        };

        request.get(teamCityOptions, function(error, response, body) {
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

                failuresExist = projectStatus.indexOf('fail') !== -1 && !isProjectInExclusionList(projectTitle, options.lights.fail.exclusionList) ? true : failuresExist;
                    
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

                clearInterval(togglePassFailLightsInterval);
            }, 1000);
            
            setTimeout(scrapeTeamCity, options.teamcity.buildStatusQueryInterval);
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
    
    function togglePassFailLights(togglePass) {
        if (togglePass) {
            failLight.turnOff();
            passLight.turnOn();
        }
        else {
            passLight.turnOff();
            failLight.turnOn();
        }
    }

    this.start = function() {
        scrapeTeamCity();
    }
};

module.exports = passFailLightManager;

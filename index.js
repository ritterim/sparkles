var config = require('config');
var Hapi = require('hapi');
var buildingLightManager = require('./buildingLightManager');
var twitterLightManager = require('./twitterLightManager');
var passFailLightManager = require('./passFailLightManager');

var server = new Hapi.Server(config.get('port'));

var building = new buildingLightManager(config);
var twitter = new twitterLightManager(config);
var passFail = new passFailLightManager(config);

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply("Hello, I'm sparkles!");
    }
});

server.start(function () {
    console.log('Sparkles running at: ', server.info.uri);
    building.start();
    twitter.start();
    passFail.start();
});


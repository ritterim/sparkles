var config = require('config');

// library does not have ability to create new config. keys.
config.set = function(key, value) {
    this[key] = value;
};

var Hapi = require('hapi');
var Path = require('path');
var buildingLightManager = require('./buildingLightManager');
var twitterLightManager = require('./twitterLightManager');
var passFailLightManager = require('./passFailLightManager');

var server = new Hapi.Server(config.get('port'));
var io = require('socket.io')(server.listener);

config.set('io', io);

server.views({
    engines: {
        html: require('handlebars')
    },
    path: Path.join(__dirname, './views')
});

var building = new buildingLightManager(config);
var twitter = new twitterLightManager(config);
var passFail = new passFailLightManager(config);

server.route({
    method: 'GET',
    path: '/public/{param*}',
    handler: {
        directory: {
            path: 'public'
        }
    }
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.view('index');
    }
});

server.start(function () {
    console.log('Sparkles running at: ', server.info.uri);

    building.start();
    twitter.start();
    passFail.start();
});

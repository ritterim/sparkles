var Hapi = require('hapi');
var buildingLightManager = require('./buildingLightManager');
var twitterLightManager = require('./twitterLightManager');

var server = new Hapi.Server(process.env.PORT);

var config = {
    lights: {
        building: {
            pin: process.env.LIGHTS_BUILDING_PIN,
            provider: process.env.LIGHTS_BUILDING_PROVIDER
        },
        twitter: {
            consumerKey: process.env.LIGHTS_TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.LIGHTS_TWITTER_CONSUMER_SECRET,
            accessTokenKey: process.env.LIGHTS_TWITTER_ACCESS_TOKEN_KEY,
            accessTokenSecret: process.env.LIGHTS_TWITTER_ACCESS_TOKEN_SECRET,
            statusTrack: process.env.LIGHTS_TWITTER_STATUS_TRACK,
            pin: process.env.LIGHTS_TWITTER_PIN,
            provider: process.env.LIGHTS_TWITTER_PROVIDER
        },
    },
    teamcity: {
        user: process.env.TC_USER,
        password: process.env.TC_PASSWORD,
        queryInterval: process.env.QUERY_INTERVAL,
        baseUri: process.env.TC_URI
    }
};

var building = new buildingLightManager(config);
var twitter = new twitterLightManager(config);

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
});


var Hapi = require('hapi');
var buildingLightManager = require('./buildingLightManager');

var server = new Hapi.Server(process.env.PORT);

var config = {
    lights: {
        building: {
            pin: process.env.LIGHTS_BUILDING_PIN,
            provider: process.env.LIGHTS_BUILDING_PROVIDER
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
});


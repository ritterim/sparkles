var lightManager = require('./lightManager');
var util = require('util');
var twitter = require('twitter');

var twitterLightManager = function(config) {
    var light = new lightManager(config.get('lights.twitter'));
    var twitterStream = null;

    var twit = new twitter({
        consumer_key: config.get('lights.twitter.consumerKey'),
        consumer_secret: config.get('lights.twitter.consumerSecret'),
        access_token_key: config.get('lights.twitter.accessTokenKey'),
        access_token_secret: config.get('lights.twitter.accessTokenSecret')
    });

    this.start = function() {
        twit.stream('statuses/filter', { track: config.get('lights.twitter.statusTrack') }, function(stream) {
            twitterStream = stream;

            twitterStream.on('data', function(data) {
                light.blink(500);
            });
        });
    };

    this.stop = function() {
        if (twitterStream) {
            twitterStream.destroy();
        }
    };
};

module.exports = twitterLightManager;

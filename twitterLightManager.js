var lightManager = require('./lightManager');
var util = require('util');
var twitter = require('twitter');

var twitterLightManager = function(options) {
    if (typeof options === 'undefined') {
        options = {
            lights: {
                twitter: {
                    consumerKey: '',
                    consumerSecret: '',
                    accessTokenKey: '',
                    accessTokenSecret: '',
                    statusTrack: ''
                }
            }
        };
    }

    var light = new lightManager(options.lights.twitter);
    var twitterStream = null;

    var twit = new twitter({
        consumer_key: options.lights.twitter.consumerKey,
        consumer_secret: options.lights.twitter.consumerSecret,
        access_token_key: options.lights.twitter.accessTokenKey,
        access_token_secret: options.lights.twitter.accessTokenSecret
    });

    this.start = function() {
        twit.stream('statuses/filter', { track: options.lights.twitter.statusTrack }, function(stream) {
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

var fakeLightProvider = require('./fakeLightProvider');
var raspiLightProvider = require('./raspiLightProvider');

var lightManager = function(config) {
    var provider = typeof config.get('provider') === 'string'
        ? (config.get('provider') === 'raspiLightProvider' ? new raspiLightProvider(config) : new fakeLightProvider(config))
        : config.get('provider');

    this.blink = function(interval) {
        provider.blink(interval);
    };

    this.turnOff = function() {
        provider.turnOff();
    }

    this.turnOn = function() {
        provider.turnOn();
    };
};

module.exports = lightManager;

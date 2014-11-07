var fakeLightProvider = require('./fakeLightProvider');
var raspiLightProvider = require('./raspiLightProvider');

var lightManager = function(config) {
    var provider = typeof config.get('provider') === 'string'
        ? (config.get('provider') === 'fakeLightProvider' ? new fakeLightProvider(config) : new raspiLightProvider(config))
        : config.get('provider');

    this.blink = function(interval) {
        provider.blink(interval);
    };

    this.getProvider = function() {
        return provider;
    };

    this.turnOff = function() {
        provider.turnOff();
    };

    this.turnOn = function() {
        provider.turnOn();
    };
};

module.exports = lightManager;

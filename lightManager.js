var fakeLightProvider = require('./fakeLightProvider');
var raspiLightProvider = require('./raspiLightProvider');

var lightManager = function(options) {
    if (typeof options === 'undefined') {
        options = {
            provider: 'raspiLightProvider'
        };
    }

    var provider = options.provider === 'raspiLightProvider' ? new raspiLightProvider(options) : new fakeLightProvider(options);

    this.turnOff = function() {
        provider.turnOff();
    }

    this.turnOn = function() {
        provider.turnOn();
    };
};

module.exports = lightManager;

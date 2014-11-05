var gpio = require('rpi-gpio');

var raspiLightProvider = function(options) {
    if (typeof options === 'undefined') {
        options = {};
    }

    var OFF = true;
    var ON = false;
    var pin = options.pin || 7;
    var self = this;
    var blinkTimeout = null;

    gpio.setup(pin, gpio.DIR_OUT, function() {
        gpio.write(pin, OFF);
    });

    this.blink = function(interval) {
        clearTimeout(blinkTimeout);

        self.turnOff();
        self.turnOn();
        
        blinkTimeout = setTimeout(function() {
            self.turnOff();
        }, interval);
    };

    this.turnOff = function() {
        gpio.write(pin, OFF);
    };

    this.turnOn = function() {
        gpio.write(pin, ON);
    };
};

module.exports = raspiLightProvider;

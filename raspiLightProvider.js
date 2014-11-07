var gpio = require('rpi-gpio');

var raspiLightProvider = function(config) {
    var ID = 'raspiLightProvider';
    var OFF = true;
    var ON = false;

    var pin = config.get('pin');
    pin = pin === null ? 7 : pin;

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

    this.getId = function() {
        return ID;
    };

    this.turnOff = function() {
        gpio.write(pin, OFF);
    };

    this.turnOn = function() {
        gpio.write(pin, ON);
    };
};

module.exports = raspiLightProvider;

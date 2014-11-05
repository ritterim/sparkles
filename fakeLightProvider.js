var fakeLightProvider = function(options) {
    if (typeof options === 'undefined') {
        options = {};
    }

    var pin = typeof options.pin === 'undefined' ? 7 : options.pin;
    var self = this;
    var blinkTimeout = null;

    this.blink = function(interval) {
        clearTimeout(blinkTimeout);

        self.turnOff();
        self.turnOn();
        
        blinkTimeout = setTimeout(function() {
            self.turnOff();
        }, interval);
    };

    this.turnOff = function() {
        console.log('Turning pin %s off', pin);
    };

    this.turnOn = function() {
        console.log('Turning pin %s on', pin);
    };
};

module.exports = fakeLightProvider;

var fakeLightProvider = function(config) {
    var ID = 'fakeLightProvider';

    var pin = typeof config.get('pin') === 'undefined' ? 7 : config.get('pin');
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

    this.getId = function() {
        return ID;
    }

    this.turnOff = function() {
        console.log('Turning pin %s off', pin);
    };

    this.turnOn = function() {
        console.log('Turning pin %s on', pin);
    };
};

module.exports = fakeLightProvider;

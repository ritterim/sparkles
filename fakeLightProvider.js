var fakeLightProvider = function(options) {
    if (typeof options === 'undefined') {
        options = {};
    }

    var pin = typeof options.pin === 'undefined' ? 7 : options.pin;

    this.turnOff = function() {
        console.log('Turning pin %s off', pin);
    };

    this.turnOn = function() {
        console.log('Turning pin %s on', pin);
    };
};

module.exports = fakeLightProvider;

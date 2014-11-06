var assert = require('assert');
var sinon = require('sinon');
var sut = require('./../lightManager');

var Provider = function() {
    this.turnOff = function() {};
    this.turnOn = function() {};
};

suite('LightManager', function() {
    suite('#turnOff()', function() {
        test('should call provider\'s turnOff function', function() {
            var provider = new Provider();
            var spy = sinon.spy(provider, 'turnOff');
            
            var result = new sut({
                get: function() {
                    return provider;
                }
            }).turnOff();

            assert(spy.calledOnce);
        });
    });

    suite('#turnOn()', function() {
        test('should call provider\'s turnOn function', function() {
            var provider = new Provider();
            var spy = sinon.spy(provider, 'turnOn');
            
            var result = new sut({
                get: function() {
                    return provider;
                }
            }).turnOn();

            assert(spy.calledOnce);
        });
    });
});

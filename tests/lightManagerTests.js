var assert = require('assert');
var gpio = require('rpi-gpio');
var sinon = require('sinon');
var sut = require('./../lightManager');

var Provider = function() {
    this.turnOff = function() {};
    this.turnOn = function() {};
};

suite('LightManager', function() {
    suite('#constructor()', function() {
        test('should use fake provider if provided', function() {
            var provider = 'fakeLightProvider';

            var result = new sut({
                get: function() {
                    return provider;
                }
            });

            assert.equal('fakeLightProvider', result.getProvider().getId());
        });

        test('should use raspi provider if none provided', function() {
            var spy = sinon.stub(gpio, 'setup');

            var result = new sut({
                get: function() {
                    return '';
                }
            });

            assert.equal('raspiLightProvider', result.getProvider().getId());
        });
    });

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

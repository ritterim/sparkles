var assert = require('assert');
var sinon = require('sinon');
var sut = require('./../raspiLightProvider');

suite('RaspiLightProvider', function() {
    suite('#constructor()', function() {
        test('should use pin config. if provided', function() {
            var result = new sut({
                get: function() {
                    return '0';
                }
            });

            assert.equal('0', result.getPin());
        });

        test('should use default pin numbering if no value provided', function() {
            var result = new sut({
                get: function() {
                    return null;
                }
            });

            assert.equal('7', result.getPin());
        });

        test('should use config. for getting off and on values', function() {
            var config = {
                get: function() {}
            };

            var stub = sinon.stub(config, 'get');

            stub.withArgs('off').returns(false);
            stub.withArgs('on').returns(true);

            var result = new sut(config);

            var offOnValues = result.getOffOnValues();

            assert.equal(false, offOnValues.off);
            assert.equal(true, offOnValues.on);
        });
    });
});

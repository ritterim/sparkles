var assert = require('assert');
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
    });
});

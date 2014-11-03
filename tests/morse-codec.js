var assert = require('assert');
var sut = require('./../morse-codec');
var noCacheRequire = require('./nocache-require').noCacheRequire;
var testData = noCacheRequire('mocha-testdata');

suite('MorseCodec', function() {
    suite('#encode()', function() {
        test('should use defaults to encode input', function() {
            var result = new sut().encode('test');

            assert.equal(result, '- . ... -');
        });

        test('should use defaults to separate encoded input', function() {
            var result = new sut().encode('test test');

            assert.equal(result, '- . ... -/- . ... -');
        });

        testData(
            ['t~t ~t', '- -/-'],
            ['~@#$%^&*()',''])
            .test('should filter invalid input and continue without throwing an error', function(input, expected) {
                var result = new sut().encode(input);

                assert.equal(result, expected);
            });
    });
});



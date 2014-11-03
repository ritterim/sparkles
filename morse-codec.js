var morseCodec = function(options) {
    if (typeof options === 'undefined') {
        options = {};
    }

    this.versions = {
        'ITC': 'itc'
    };

    var ditDuration = options.ditDuration || 100;
    var dahDuration = ditDuration * 3;
    var characterSeparationDuration = ditDuration * 3;
    var wordSeparationDuration = ditDuration * 7;
    var version = options.version || this.versions.ITC;
    var dictionary = {};
    var encodingOptions = options.encoding || {
        'characterSeparator': ' ',
        'inputWordSeparator': ' ',
        'wordSeparator': '/'
    };
    
    var dictionaries = {
        'itc': {
            'A': '.-',
            'B': '-...',
            'C': '-.-.',
            'D': '-..',
            'E': '.',
            'F': '..-.',
            'G': '--.',
            'H': '....',
            'I': '..',
            'J': '.---',
            'K': '-.-',
            'L': '.-..',
            'M': '--',
            'N': '-.',
            'O': '---',
            'P': '.--.',
            'Q': '--.-',
            'R': '.-.',
            'S': '...',
            'T': '-',
            'U': '..-',
            'V': '...-',
            'W': '.--',
            'X': '-..-',
            'Y': '-.--',
            'Z': '--..',
            '1': '.----',
            '2': '..---',
            '3': '...--',
            '4': '....-',
            '5': '.....',
            '6': '-....',
            '7': '--...',
            '8': '---..',
            '9': '----.',
            '0': '-----'
        }
    };

    this.encode = function(input) {
        var length = input.length;
        var output = '';
        
        for (var i = 0; i < length; i++) {
            var character = input.charAt(i).toUpperCase();
            var parsedCharacter = dictionary[character];

            if (typeof parsedCharacter !== 'undefined') {
                output += parsedCharacter + encodingOptions.characterSeparator;
            }
            else {
                if (character === encodingOptions.inputWordSeparator) {
                    var lastCharacterPosition = output.length - 1;
                    
                    if (output.charAt(lastCharacterPosition) === encodingOptions.inputWordSeparator) {
                        output = output.substr(0, lastCharacterPosition);
                    }
                    
                    output += encodingOptions.wordSeparator;
                }
            }
        }

        return output.trim();
    };

    function getDictionary(version) {
        var dictionary = {};
        var versionDictionary = dictionaries[version];

        for (var key in versionDictionary) {
            dictionary[key] = versionDictionary[key];
        }

        return dictionary;
    }

    function init() {
        dictionary = getDictionary(version);
    }

    init();
};

module.exports = morseCodec;

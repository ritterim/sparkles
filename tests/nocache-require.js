var noCacheRequire = function(module) {
    delete require.cache[require.resolve(module)];

    return require(module);
};

exports.noCacheRequire = noCacheRequire;

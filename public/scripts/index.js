var socket = io();

socket.on('teamcity.building', function(message) {
    buildingPanel.numberOfBuilds(message.count);
    buildingPanel.buildTime(message.elapsedTime);
});

socket.on('twitter.tweet', function(tweet) {
    twitterPanel.tweets.unshift(tweet);

    if (twitterPanel.tweets().length > twitterPanel.maxTweetQueue) {
        twitterPanel.tweets.pop();
    }
});

socket.on('teamcity.buildStatus', function(isAllPassing) {
    passFailPanel.isAllPassing(isAllPassing);
});

var buildingPanel = new function() {
    var currentBuildTime = ko.observable(0);

    this.numberOfBuilds = ko.observable();
    this.buildTime = ko.observable();
};

var twitterPanel = new function() {
    this.maxTweetQueue = document.currentScript.getAttribute('data-max-tweet-queue');
    this.tweets = ko.observableArray();
};

var passFailPanel = new function() {
    var self = this;

    this.isAllPassing = ko.observable();

    this.isAnyFailing = ko.computed(function() {
        return !self.isAllPassing();
    });
};

ko.applyBindings(buildingPanel, document.getElementById('building-panel'));
ko.applyBindings(twitterPanel, document.getElementById('twitter-panel'));
ko.applyBindings(passFailPanel, document.getElementById('pass-fail-panel'));

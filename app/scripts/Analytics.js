/* global ga */

define(function () {

    'use strict';

    var Analytics = {};

    Analytics.queue = function () {
        if (location.host !== 'yugiohcalculator.com') {
            console.log.apply(console, ['Queued:'].concat(Array.prototype.slice.call(arguments)));
            return;
        }
        return ga.apply(this, arguments);
    };

    Analytics.event = function (eventCategory, eventAction) {
        return Analytics.queue('send', 'event', {
            eventCategory: eventCategory,
            eventAction: eventAction
        });
    };

    return Analytics;

});

'use strict';

var async = require('async');
var yugiohwikia = require('./yugiohwikia');

var sites = {
    'yugioh.wikia.com': yugiohwikia
};

/**
 * Retrieves rulings for the given card name.
 *
 * @param {string} options.card The name of the card to retrieve rulings
 * for. Required.
 * @param {string[]} options.sites The websites to retrieve rulings
 * from. Defaults to ["*"]. If specified, will only retrieve rulings from the
 * specified sites. If ["*"], will retrieve rulings from all sites.
 * @param {Function} callback Function to call once all rulings are accumulated.
 */
function get(options, callback) {

    var response = {
        error: null,
        rulings: []
    };

    if (typeof options.card === 'undefined' || options.card.length === 0) {
        response.error = 'No card name specified.';
        callback(response);
        return;
    }

    // Use the default / replace the wildcard.
    if (typeof options.sites === 'undefined' || options.sites.indexOf('*') > -1) {
        options.sites = Object.keys(sites);
    }

    async.each(options.sites, function siteIterator(item, callback) {

        // Catch bad input and throw out results.
        if (!sites.hasOwnProperty(item)) {
            response.error = 'Unconfigured website specified.';
            response.rulings = [];
            callback(response);
        }

        // Accumulate rulings from each site.
        var site = sites[item];
        site.getRulings(options.card, function getRulingsCallback(rulings) {
            Array.prototype.push.apply(response.rulings, rulings);
            callback(null);
        });

    }, function (err) {

        callback(response);

    });

}

module.exports = {
    get: get
};

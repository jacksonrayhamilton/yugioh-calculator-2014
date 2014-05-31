'use strict';

var yugiohwikia = require('yugiohwikia');

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
 */
function get(options) {

    var resp = {
        error: null,
        rulings: []
    };

    if (typeof options.card === 'undefined' || options.card.length === 0) {
        resp.error = 'No card name specified.';
        return resp;
    }

    // Replace the wildcard.
    if (options.sites.indexOf('*') > -1) {
        options.sites = Object.keys(sites);
    }

    options.sites.every(function (siteKey) {
        // Catch bad input and throw out results.
        if (!sites.hasOwnProperty(siteKey)) {
            resp.error = 'Unconfigured website specified.';
            resp.rulings = [];
            return false;
        }
        // Accumulate rulings from each site.
        var site = sites[siteKey];
        var rulings = site.getRulings(options.card);
        Array.prototype.push.apply(resp.rulings, rulings);
        return true;
    });

    return resp;

}

module.exports = {
    get: get
};

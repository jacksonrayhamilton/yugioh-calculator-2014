'use strict';

/**
 * Contains methods for retrieving and parsing rulings from a website.
 */
var website = {

    /**
     * @param {string} options.url Url of the website. Will be used for
     * pattern-matching, etc.
     * @param {Function} options.getRulings Accepts a card name as a
     * parameter. Returns the result of `parseRulings` when applied to a chunk
     * of html.
     * @param {Function} options.parseRulings Accepts a string of html as a
     * parameter. Returns an object literal containing the source of the rulings
     * found, and an array containg a list of strings with relevant information.
     */
    init: function (options) {
        this.url = options.url;
        this.getPagePath = options.getPagePath;
        this.getRulings = options.getRulings;
        this.parseRulings = options.parseRulings;
        this.getAttribution = options.getAttribution;
        return this;
    }

};

module.exports = website;

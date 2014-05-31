'use strict';

var request = require('request');
var cheerio = require('cheerio');
var website = require('./website');

var url = 'http://yugioh.wikia.com/';

function getPagePath(card) {
    return url + 'wiki/Card_Rulings:Dark_Magician';
}

function getRulings(card, callback) {
    request(getPagePath(card), function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var rulings = parseRulings(body);
            callback(rulings);
        }
    });
}

function parseRulings(html) {
    return [html];
}

module.exports = Object.create(website).init({
    url: url,
    getRulings: getRulings,
    parseRulings: parseRulings
});

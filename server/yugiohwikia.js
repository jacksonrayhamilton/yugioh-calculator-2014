'use strict';

var website = require('website');

var url = 'http://yugioh.wikia.com/';

function getRulings(card) {

}

function parseRulings(html) {

}

module.exports = Object.create(website).init({
    url: url,
    getRulings: getRulings,
    parseRulings: parseRulings
});

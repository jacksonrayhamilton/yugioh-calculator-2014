'use strict';

var _ = require('underscore');
var request = require('request');
var cheerio = require('cheerio');
var website = require('./website');

var url = 'http://yugioh.wikia.com/';

function capitalize(str) {
    return str.substring(0, 1).toUpperCase() + str.substring(1);
}

var pattern = {
    build: function (regex, replacement) {
        return {
            regex: regex,
            replacement: replacement
        };
    }
};

var getCapitalizedCardName = (function() {

    var nonCapitalizedWords = [
        'a', 'an', 'and', 'as', 'at', 'be', 'by', 'for', 'from', 'in',
        'into', 'of', 'on', 'or', 'the', 'to', 'with'
    ];

    var edgeCases = [
        // From
        'Hieratic Seal From the Ashes',
        'Tour Guide From the Underworld',
        'Tour Bus From the Underworld',
        // Into
        'Crevice Into the Different Dimension',
        // The
        'Arcana Force 0 - The Fool',
        'Avatar of The Pot',
        'Exxod, Master of The Guard',
        'Otherworld - The "A" Zone',
        // With
        'At One With the Sword',
        // Strange dashes
        'Blackwing - Hillen the Tengu-wind',
        'Dice-nied',
        'Kinka-byo',
        'Morphtronic Mix-up',
        'Number 53: Heart-eartH',
        'Yamato-no-Kami',
        // Strange apostrophes
        'Van\'Dalgyon the Dark Dragon Lord',
        // Multi-caps
        'Arcana Force EX - The Dark Ruler',
        'Arcana Force EX - The Light Ruler',
        'Arcana Force I - The Magician',
        'Arcana Force III - The Empress',
        'Arcana Force IV - The Emperor',
        'Arcana Force VI - The Lovers',
        'Arcana Force VII - The Chariot',
        'Arcana Force XIV - Temperance',
        'Arcana Force XVIII - The Moon',
        'Arcana Force XXI - The World',
        'Assault on GHQ',
        'Batteryman AA',
        'Batteryman AAA',
        'Bonding H2O',
        'CXyz Dark Fairy Cheer Girl',
        'DUCKER Mobile Cannon',
        'DZW - Chimera Cloth',
        'ESP Amplifier',
        'Flying Fortress SKY FIRE',
        'Geargiano Mk-II',
        'KA-2 Des Scissors',
        'NEX',
        'Spell Reactor RE',
        'Summon Reactor SK',
        'Trap Reactor Y FI',
        'TG-SX1',
        'TG1-EM1',
        'TGX1-HL',
        'TGX3-DX2',
        'TG-SX1',
        'TGX300',
        'VW-Tiger Catapult',
        'VWXYZ-Dragon Catapult Cannon',
        'Victory Viper XX03',
        'XY-Dragon Cannon',
        'XYZ-Dragon Cannon',
        'XZ-Tank Cannon',
        'YZ-Tank Dragon',
        'Z-ONE',
        'ZERO-MAX'
    ];

    var edgeCasePatterns = [
        // Strange dashes
        pattern.build(/abyss-s/i, 'Abyss-s'),
        pattern.build(/hard-s/i, 'Hard-s'),
        // Multi-caps
        pattern.build(/cxyz/i, 'CXyz'),
        pattern.build(/dna/i, 'DNA'),
        pattern.build(/hero\s/i, 'HERO '),
        pattern.build(/lv/i, 'LV'),
        pattern.build(/mk-/i, 'MK-'),
        pattern.build(/ufo/i, 'UFO'),
        pattern.build(/xx-/i, 'XX-'),
        pattern.build(/zw\s-/i, 'ZW -')
    ];

    return function getCapitalizedCardName(name) {

        // The names need to be lowercase to perform the following checks.
        name = name.toLowerCase();

        // If this name is an edge case, then return the "specially"-capitalized
        // name.
        var found = _.find(edgeCases, function (edgeCase) {
            return name === edgeCase.toLowerCase();
        });

        if (typeof found !== 'undefined') {
            return found;
        }

        // Capitalize the first word.
        name = capitalize(name);

        // Capitalize all subsequent words that need to be capitalized (".",
        // "/", "-", "double-quotes" and whitespace are word delimiters).
        name = name.replace(/([\"\.\/\- ])(\s*)(\w+)/g, function(all, separator, whitespace, word) {

            // If the current word should be capitalized, do so.
            if (nonCapitalizedWords.indexOf(word) === -1) {
                word = capitalize(word);
            }

            // Return the current word to be added onto the name.
            return separator + whitespace + word;

        });

        // If the name falls under an edge case pattern, fix that part of the
        // name.
        edgeCasePatterns.forEach(function (pattern) {
            name = name.replace(pattern.regex, pattern.replacement);
        });

        return name;
    };
}());

// Cleans a string so it is suitable in a yugioh.wikia.com url
var getUrlEscapedString = (function() {

    var patterns = [
        pattern.build(/\s/g, '_'),
        pattern.build(/%/g, '%25'),
        pattern.build(/&/g, '%26'),
        pattern.build(/\'/g, '%27'),
        pattern.build(/\=/g, '%3D'),
        pattern.build(/\?/g, '%3F'),
        pattern.build(/#/g, '')
    ];

    return function(str) {
        // Run the string through each regex to ensure the url works.
        return patterns.reduce(function (str, pattern) {
            return str.replace(pattern.regex, pattern.replacement);
        }, str);
    };

}());

function getPagePath(card) {
    return url + 'wiki/Card_Rulings:' +
        getUrlEscapedString(
            getCapitalizedCardName(
                card.replace(/\s+/gi, ' ').trim()));
}

function getAttribution(url, title) {
    return 'These rulings were retrieved from the ' +
        '<a target="_blank" href="' + url + '">"' +
        title + '"</a> ' + 'article on the <a target="_blank" ' +
        'href="http://yugioh.wikia.com/">Yu-Gi-Oh! Wiki</a> ' +
        'at <a target="_blank" href="http://www.wikia.com/">' +
        'Wikia</a> and are licensed under the ' +
        '<a target="_blank" href="' +
        'http://creativecommons.org/licenses/by-sa/3.0/">' +
        'Creative Commons Attribution-Share Alike License</a>.';
}

function getRulings(card, callback) {

    var url = getPagePath(card);

    request(url, function (error, response, body) {
        if (error || response.statusCode !== 200) {
            callback(null, [{
                error: '<div class="yc-ruling-error">' +
		    'Unable to access yugioh.wikia.com (' + response.statusCode + ').' +
		    '<ul>' +
		    '<li>You may have misspelled this card\'s name above.</li>' +
		    '<li>This card may not have any rulings.</li>' +
		    '<li>Wikia\'s site may be currently unavailable.</li>' +
		    '</ul>' +
		    '</div>',
                source: url
            }]);
            return;
        }
        callback(null, [parseRulings({
            url: url,
            html: body
        })]);
    });

}

function parseRulings(options) {

    if (typeof options === 'string') {
        options = {
            html: options
        };
    }

    var $ = cheerio.load(options.html);
    var $WikiaArticle = $('#WikiaArticle');

    ['.navbox',
     '.home-top-right-ads',
     '.RelatedPagesModule',
     '.printfooter',
     'noscript',
     'a:contains(Edit)',
     'ol.references'].forEach(function (selector) {
        $WikiaArticle.find(selector).remove();
    });

    $WikiaArticle.find('[style]').removeAttr('style');

    $WikiaArticle.find('a[title]').each(function (index, element) {
        var $anchor = $(element);
        $anchor.attr('href', 'http://yugioh.wikia.com' + $anchor.attr('href'));
        $anchor.attr('target', '_blank');
    });

    $WikiaArticle.find('a.external').each(function (index, element) {
        $(element).attr('target', '_blank');
    });

    var title = $('#WikiaPageHeader').find('h1').first().text();

    var lis = $WikiaArticle.find('li');
    var lisHtml = [];
    lis.each(function (index, element) {
        lisHtml.push($(element).html());
    });

    return {
        error: null,
        source: options.url,
        items: lisHtml,
        attribution: getAttribution(options.url, title)
    };
}

module.exports = Object.create(website).init({
    url: url,
    getPagePath: getPagePath,
    getRulings: getRulings,
    parseRulings: parseRulings,
    getAttribution: getAttribution
});

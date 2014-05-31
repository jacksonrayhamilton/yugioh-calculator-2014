'use strict';

var request = require('request');
var cheerio = require('cheerio');
var website = require('./website');

var url = 'http://yugioh.wikia.com/';

function getPagePath(card) {
    return url + 'wiki/Card_Rulings:Dark_Magician';
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
        if (!error && response.statusCode === 200) {
            callback([parseRulings({
                url: url,
                html: body
            })]);
        }
        // TODO: Handle error.
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
     'a:contains(Edit)'].forEach(function (selector) {
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

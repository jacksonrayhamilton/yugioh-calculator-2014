var path = require('path');
var st = require('st');
var connect = require('connect');
var bodyParser = require('body-parser');
var urlrouter = require('urlrouter');
var ruling = require('./server/ruling');

var mount = st({
    path: path.join(__dirname, 'dist'),
    cache: {
        content: {
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    },
    index: 'index.html'
});

var app = connect()
    .use(connect.logger('dev'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded())
    .use(urlrouter(function (app) {
        app.post('/ruling', function (req, res, next) {
            ruling.get({
                card: req.body.card,
                sites: req.body.sites
            }, function getCallback(rulings) {
                res.end(JSON.stringify(rulings));
            });
        });
    }))
    .use(mount);

module.exports = app;

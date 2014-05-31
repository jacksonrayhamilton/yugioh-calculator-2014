var path = require('path');
var st = require('st');
var connect = require('connect');
var bodyParser = require('body-parser');
var urlrouter = require('urlrouter');
var ruling = require('ruling');

var mount = st({
    path: path.join(__dirname, 'dist'),
    index: 'index.html'
});

var app = connect()
    .use(connect.logger('dev'))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded())
    .use(urlrouter(function (app) {
        app.get('/ruling', function (req, res, next) {
            console.log(req);
            res.end();
        });
    }))
    .use(mount);

module.exports = app;

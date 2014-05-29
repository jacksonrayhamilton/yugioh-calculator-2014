var path = require('path');
var st = require('st');
var connect = require('connect');
var bodyParser = require('body-parser');

var mount = st({
    path: path.join(__dirname, 'dist'),
    index: 'index.html'
});

var app = connect()
        .use(connect.logger('dev'))
        .use(bodyParser.json())
        .use(bodyParser.urlencoded())
        .use(mount);

module.exports = app;

var util = require('util');
var ruling = require('./ruling');

ruling.get({
    card: 'Dark Magician',
    sites: ['*']
}, function (rulings) {
    console.log(util.inspect(rulings, {depth: null}));
});

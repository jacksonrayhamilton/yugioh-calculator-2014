var util = require('util');
var ruling = require('./ruling');

ruling.get({
    card: 'Thunder King Rai-Oh',
    sites: ['*']
}, function (rulings) {
    console.log(util.inspect(rulings, {depth: null}));
});

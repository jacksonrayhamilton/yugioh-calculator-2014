define(['backbone'],
function (Backbone) {

    'use strict';

    var Operator = Backbone.Model.extend({

        initialize: function (args) {
            this.symbol = args.symbol;
        }

    });

    return Operator;

});

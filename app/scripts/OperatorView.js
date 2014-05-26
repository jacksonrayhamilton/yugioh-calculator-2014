define(['backbone'],
function (Backbone) {

    'use strict';

    var OperatorView = Backbone.View.extend({

        getDisplayedValue: function () {
            return this.model.get('symbol');
        }

    });

    return OperatorView;

});

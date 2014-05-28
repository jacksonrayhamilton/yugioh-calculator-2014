define(['backbone'],
function (Backbone) {

    'use strict';

    var BlackWindow = Backbone.Model.extend({

        defaults: function() {
            return {
                visibleSubView: null
            };
        }

    });

    return BlackWindow;

});

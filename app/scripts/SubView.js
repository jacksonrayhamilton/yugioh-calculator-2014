define(['backbone'],
function (Backbone) {

    'use strict';

    var SubView = Backbone.View.extend({

        show: function() {
            this.$el.show();
        },

        hide: function() {
            this.$el.hide();
        }

    });

    return SubView;

});

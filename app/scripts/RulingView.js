define(['jquery', 'underscore', 'SubView'],
function ($, _, SubView) {

    'use strict';

    var RulingView = SubView.extend({

        initialize: function () {
            this.$input = this.$el.find('.yc-ruling-input');
            this.$results = this.$el.find('.yc-ruling-results');
        },

        events: {
            'click .yc-ruling-submit': function () {
                var query = this.$input.val();
                $.ajax({
                    type: 'POST',
                    url: '/ruling',
                    data: {
                        card: query
                    }
                })
                .always(_.bind(function (data) {
                    console.log(data);
                    this.$results.html(data);
                }, this));
            }
        }

    });

    return RulingView;

});

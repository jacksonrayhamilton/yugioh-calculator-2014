define(['jquery', 'underscore', 'SubView'],
function ($, _, SubView) {

    'use strict';

    var RulingView = SubView.extend({

        initialize: function () {
            this.$input = this.$el.find('.yc-ruling-input');
            this.$results = this.$el.find('.yc-ruling-results');
            this.resultsTemplate = _.template(this.$el.find('.yc-ruling-results-template').html());
        },

        submitRulingQuery: function () {
            var query = this.$input.val();
            $.ajax({
                type: 'POST',
                url: '/ruling',
                data: {
                    card: query
                },
                dataType: 'JSON'
            })
                .always(_.bind(function (data) {
                    this.populateResults(data);
                }, this));
        },

        events: {
            'keyup .yc-ruling-input': function (event) {
                if (event.keyCode === 13) {
                    this.submitRulingQuery();
                }
            },
            'click .yc-ruling-submit': function () {
                this.submitRulingQuery();
            }
        },

        populateResults: function (data) {
            this.$results.empty();

            var html = '';

            if (data.error) {
                this.$results.html(data.error);
                return;
            }

            _.forEach(data.rulings, function (ruling) {
                html += this.resultsTemplate(ruling);
            }, this);

            this.$results.html(html);
        }

    });

    return RulingView;

});

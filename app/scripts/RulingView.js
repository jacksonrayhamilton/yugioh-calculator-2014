define(['jquery', 'underscore', 'SubView', 'Analytics'],
function ($, _, SubView, Analytics) {

    'use strict';

    var RulingView = SubView.extend({

        initialize: function () {
            this.$input = this.$el.find('.yc-ruling-input');
            this.$results = this.$el.find('.yc-ruling-results');
            this.resultsTemplate = _.template(this.$el.find('.yc-ruling-results-template').html());
        },

        submitRulingQuery: function () {
            Analytics.event('Ruling', 'Submit Ruling Query');

            this.$results
                .removeClass('visible')
                .addClass('hidden');

            setTimeout(_.bind(function () {
                this.$results.scrollTop(0);
            }, this), 300);

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
                    this.$results
                        .removeClass('hidden')
                        .addClass('visible');
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

define(['jquery', 'backbone'],
function ($, Backbone) {

    'use strict';

    /**
     * Provides the main user interface, allowing for digit, math, operation
     * and special buttons to be pressed.
     */
    var ButtonView = Backbone.View.extend({

        initialize: function (args) {
            this.players = args.players;
            this.operation = args.operation;
            this.timer = args.timer;
        },

        events: {
            // 'click .specialButton': 'subViewButtonHandler',
            // 'click #donate': 'subViewButtonHandler',
            'click .yc-restart-timer': function () {
                this.timer.restart();
            },
            'click .yc-reset-life-points': function () {
                this.players.resetLifePoints();
            },
            'click .yc-digit': function (event) {
                // Extract the digit data from the clicked element, but make it
                // a string because jQuery likes to parse it.
                var digit = $(event.currentTarget).data('digit') + '';
                this.operation.insertDigit(digit);
            },
            'click .yc-backspace': function () {
                this.operation.deleteLastDigit();
            },
            'click .yc-clear': function () {
                this.operation.clearValue();
            },
            'click .yc-plus': function () {
                this.operation.enterValue('+');
            },
            'click .yc-minus': function () {
                this.operation.enterValue('-');
            }
        },

        // subViewButtonHandler: function(event) {
        //     var subView = event.currentTarget.id;
        //     blackWindowView.show(subView);
        // }
    });

    return ButtonView;

});

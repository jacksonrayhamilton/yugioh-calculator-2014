define(['jquery', 'backbone'],
function ($, Backbone) {

    'use strict';

    /**
     * Provides the main user interface, allowing for digit, math, expression
     * and special buttons to be pressed.
     */
    var ButtonView = Backbone.View.extend({

        initialize: function (args) {
            this.app = args.app;
            this.players = args.players;
            this.expression = args.expression;
            this.timer = args.timer;
            this.undos = args.undos;
            this.$expressionEvaluationButton = this.$el.find('.yc-expression-evaluation-button');
            this.listenTo(this.app, 'change:expressionEvaluationMode', this.renderExpressionEvaluationButton);
            this.render();
        },

        render: function () {
            this.renderExpressionEvaluationButton();
        },

        renderExpressionEvaluationButton: function () {
            if (this.app.get('expressionEvaluationMode')) {
                this.$expressionEvaluationButton.addClass('yc-evaluating');
            } else {
                this.$expressionEvaluationButton.removeClass('yc-evaluating');
            }
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
            'click .yc-undo': function () {
                this.undos.undo();
            },
            'click .yc-digit': function (event) {
                // Extract the digit data from the clicked element, but make it
                // a string because jQuery likes to parse it.
                var digit = $(event.currentTarget).data('digit') + '';
                this.expression.insertDigit(digit);
            },
            'click .yc-backspace': function () {
                this.expression.backspace();
            },
            'click .yc-clear': function () {
                this.expression.clearValue();
            },
            'click .yc-expression-evaluation': function () {
                if (this.app.get('expressionEvaluationMode')) {
                    this.expression.evaluate();
                    this.app.set('expressionEvaluationMode', false);
                } else {
                    this.app.set('expressionEvaluationMode', true);
                }
            },
            'click .yc-plus': function () {
                if (this.app.get('expressionEvaluationMode')) {
                    this.expression.insertOperator('+');
                } else {
                    this.expression.enterValue('+');
                }
            },
            'click .yc-minus': function () {
                if (this.app.get('expressionEvaluationMode')) {
                    this.expression.insertOperator('-');
                } else {
                    this.expression.enterValue('-');
                }
            }
        }

        // subViewButtonHandler: function(event) {
        //     var subView = event.currentTarget.id;
        //     blackWindowView.show(subView);
        // }
    });

    return ButtonView;

});

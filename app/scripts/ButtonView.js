define(['jquery', 'backbone', './Analytics'],
function ($, Backbone, Analytics) {

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
            this.blackWindowView = args.blackWindowView;
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
            'click .yc-window-button': 'windowButtonHandler',
            // 'click #donate': 'subViewButtonHandler',
            'click .yc-restart-timer': function () {
                Analytics.event('Action', 'Restart Timer');
                this.timer.restart();
            },
            'click .yc-reset-life-points': function () {
                Analytics.event('Action', 'Reset Life Points');
                this.players.resetLifePoints();
            },
            'click .yc-undo': function () {
                Analytics.event('Action', 'Undo');
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
                    Analytics.event('Action', 'Evaluate Expression');
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
                    Analytics.event('Action', 'Add');
                    this.expression.enterValue('+');
                }
            },
            'click .yc-minus': function () {
                if (this.app.get('expressionEvaluationMode')) {
                    this.expression.insertOperator('-');
                } else {
                    Analytics.event('Action', 'Subtract');
                    this.expression.enterValue('-');
                }
            }
        },

        windowButtonHandler: function (event) {
            var subWindow = $(event.currentTarget).data('window');
            this.blackWindowView.show(subWindow);
        }

    });

    return ButtonView;

});

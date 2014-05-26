define(['backbone', 'underscore', './Operand', './Operator'],
function (Backbone, _, Operand, Operator) {

    'use strict';

    /**
     * Controls the value of the addition/subtraction Operation that the
     * user is performing on a Player, and provides how that value is changed.
     */
    var Expression = Backbone.Model.extend({

        defaults: function() {
            return {
                items: [new Operand()],
                index: 0
            };
        },

        getCurrentItem: function () {
            return this.get('items')[this.get('index')];
        },

        initialize: function (args) {
            this.players = args.players;
        },

        insertDigit: function (digit) {
            this.getCurrentItem().insertDigit(digit);
            this.trigger('change');
        },

        insertOperator: function (symbol) {
            var newItems = [
                new Operator({
                    symbol: symbol
                }),
                new Operand()
            ];
            var index = this.get('index');
            this.set('index', index + newItems.length);
            this.set('items', this.get('items').concat(newItems));
        },

        backspace: function () {
            var index = this.get('index');
            var currentItem = this.getCurrentItem();
            var currentItemIndex = currentItem.get('index');
            if (index > 0 && currentItemIndex === 0) {
                var items = this.get('items');
                items.splice(items.length - 2, 2);
                this.set('index', index - 2);
            } else if (currentItemIndex > 0) {
                currentItem.deleteLastDigit();
                this.trigger('change');
            }
        },

        clearValue: function () {
            this.set(this.defaults());
        },

        enterValue: function (sign) {
            var selectedPlayer = this.players.getSelected();
            var integerValue = parseInt(this.get('items')[0].get('value'));
            if (sign === '+') {
                selectedPlayer.gain(integerValue);
            } else {
                selectedPlayer.lose(integerValue);
            }
            this.clearValue();
        },

        evaluate: function () {
            this.set({
                items: _.reduce(this.get('items'), function (previous, current) {
                    previous.push(current);
                    if (previous.length === 3) {
                        var loperand = parseInt(previous[0].get('value'));
                        var operator = previous[1].get('symbol');
                        var roperand = parseInt(previous[2].get('value'));
                        var result;
                        if (operator === '+') {
                            result = loperand + roperand;
                        } else if (operator === '-') {
                            result = loperand - roperand;
                        }
                        var resultString = result.toString();
                        var padding = 4 - resultString.length;
                        var paddedResultString = new Array(padding + 1).join('0') + resultString;
                        var indexOfNonZero = resultString.search(/([^0])/);
                        var newIndex;
                        if (indexOfNonZero > -1) {
                            // There was a non-zero, so find the first zero after it.
                            newIndex = indexOfNonZero + Math.max(0, resultString.indexOf('0'));
                        } else {
                            // All zeros, might as well start at the beginning.
                            newIndex = 0;
                        }
                        return [new Operand({
                            value: paddedResultString,
                            index: newIndex
                        })];
                    } else {
                        return previous;
                    }
                }, []),
                index: 0
            });
        }

    });

    return Expression;

});

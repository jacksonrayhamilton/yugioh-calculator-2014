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

                    // Accumulate operands and operators.
                    previous.push(current);

                    // 3 means there are enough items to evaluate a subexpression.
                    if (previous.length === 3) {

                        // Evaluate the subexpression.
                        var loperand = parseInt(previous[0].get('value'));
                        var operator = previous[1].get('symbol');
                        var roperand = parseInt(previous[2].get('value'));
                        var result;
                        if (operator === '+') {
                            result = loperand + roperand;
                        } else if (operator === '-') {
                            result = loperand - roperand;
                        }

                        // Create a zero-padded string representation of the result (%04d).
                        var resultString = result.toString();
                        var padding = 4 - resultString.length;
                        var paddedResultString = new Array(padding + 1).join('0') + resultString;

                        // Determine the index of the last non-zero digit in the result.
                        var match,
                            nonZeroRegexp = /([^0])/g,
                            indexOfNonZero = -1;
                        while ((match = nonZeroRegexp.exec(paddedResultString)) !== null) {
                            indexOfNonZero = match.index;
                        }

                        var newIndex;
                        if (indexOfNonZero > -1) {
                            // Set the index to the first zero after the last non-zero.
                            newIndex = indexOfNonZero + Math.max(1, paddedResultString.substring(indexOfNonZero + 1).indexOf('0'));
                        } else {
                            // All zeros, start at the beginning.
                            newIndex = 0;
                        }

                        // Yield the result.
                        return [new Operand({
                            value: paddedResultString,
                            index: newIndex
                        })];
                    } else {
                        // Yield the accumulation.
                        return previous;
                    }
                }, []),

                // There will only be one term when we're through.
                index: 0
            });
        }

    });

    return Expression;

});

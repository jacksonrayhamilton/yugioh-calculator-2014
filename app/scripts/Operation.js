define(['backbone', './insertString'],
function (Backbone, insertString) {

    'use strict';

    /**
     * Controls the value of the addition/subtraction Operation that the
     * user is performing on a Player, and provides how that value is changed.
     */
    var Operation = Backbone.Model.extend({

        defaults: function() {
            return {
                value: '0000',
                index: 0
            };
        },

        // Inserts digit(s) into the value, from the current index
        insertDigit: function(digit) {
            var index = this.get('index');
            this.set({
                value: insertString(this.get('value'), digit, index),
                index: index + digit.length
            });
        },

        // Either replaces the last digit with a 0, or removes it
        deleteLastDigit: function() {
            var index = this.get('index');
            if (index > 0) {
                var replacement = (index <= 4) ? '0' : '';
                this.set({
                    value: insertString(this.get('value'), replacement, (index - 1)),
                    index: index - 1
                });
            }
        },

        clearValue: function() {
            this.set(this.defaults());
        },

        enterValue: function(sign) {
            var selectedPlayer = this.players.getSelected();
            var integerValue = parseInt(this.get('value'));
            if (sign === '+') {
                selectedPlayer.gain(integerValue);
            } else {
                selectedPlayer.lose(integerValue);
            }
            this.clearValue();
        }
    });

    return Operation;

});

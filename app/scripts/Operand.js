define(['backbone', './insertString'],
function (Backbone, insertString) {

    'use strict';

    var Operand = Backbone.Model.extend({

        defaults: function() {
            return {
                value: '0000',
                index: 0
            };
        },

        // Inserts digit(s) into the value, from the current index
        insertDigit: function (digit) {
            var index = this.get('index');
            this.set({
                value: insertString(this.get('value'), digit, index),
                index: index + digit.length
            });
        },

        // Either replaces the last digit with a 0, or removes it
        deleteLastDigit: function () {
            var index = this.get('index');
            if (index > 0) {
                var replacement = (index <= 4) ? '0' : '';
                this.set({
                    value: insertString(this.get('value'), replacement, (index - 1)),
                    index: index - 1
                });
            }
        }

    });

    return Operand;

});

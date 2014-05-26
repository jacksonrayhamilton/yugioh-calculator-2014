define(['backbone'],
function (Backbone) {

    'use strict';

    var OperandView = Backbone.View.extend({

        getDisplayedValue: function (isSelected) {
            var value = this.model.get('value');
            var index = this.model.get('index');

            // Determine the "currently selected" character in the value
            // (the one that will be highlighted to show the user his index).
            var wrappedChar = value.charAt(index);
            if (wrappedChar === '') {
                wrappedChar = '&nbsp;';
            }

            var displayedValue;
            if (isSelected) {
                // Wrap that "currently selected" character.
                displayedValue =
                    value.substring(0, index) +
                    '<span class="yc-selected-operand-digit">' + wrappedChar + '</span>' +
                    value.substring(index + 1);
            } else {
                displayedValue = value;
            }

            // Remove leading zeroes in the displayed value.
            if (index > 0) {
                displayedValue = displayedValue.replace(/^0+/, function (match) {
                    return new Array(match.length + 1).join('');
                });
            }

            return displayedValue;
        }

    });

    return OperandView;

});

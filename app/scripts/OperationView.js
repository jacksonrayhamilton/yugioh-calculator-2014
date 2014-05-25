define(['backbone'],
function (Backbone) {

    'use strict';

    /**
     * Representation of the number in the current operation being performed.
     */
    var OperationView = Backbone.View.extend({

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.render();
        },

        getDisplayedValue: function() {
            var value = this.model.get('value');
            var index = this.model.get('index');

            // Determine the "currently selected" character in the value
            // (the one that will be highlighted to show the user his index).
            var wrappedChar = value.charAt(index);
            if (wrappedChar === '') {
                wrappedChar = '&nbsp;';
            }

            // Wrap that "currently selected" character.
            var displayedValue =
                    value.substring(0, index) +
                    '<div class="yc-selected-operation-digit">' + wrappedChar + '</div>' +
                    value.substring(index + 1);

            // Remove leading zeroes in the displayed value.
            if (index > 0) {
                displayedValue = displayedValue.replace(/^0+/, function (match) {
                    return new Array(match.length + 1).join('&nbsp;');
                });
            }

            return displayedValue;
        },

        render: function() {
            this.$el.html(this.getDisplayedValue());
        }
    });

    return OperationView;

});

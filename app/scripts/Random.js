define(['PersistentModel'],
function (PersistentModel) {

    'use strict';

    /**
     * Controls the outcome of die rolls and coin flips.
     */
    var Random = PersistentModel.extend({

        defaults: function() {
            return {
                lastRoll: '',
                lastFlip: ''
            };
        },

        getRandomInteger: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        roll: function () {
            // Quietly unset so that the next set is guaranteed to make a
            // change.
            this.set({ lastRoll: null }, { silent: true });
            this.set('lastRoll', this.getRandomInteger(1, 6));
        },

        flip: function () {
            this.set({ lastFlip: null }, { silent: true });
            this.set('lastFlip', this.getRandomInteger(0, 1));
        }

    }, {
        getFlipFace: function (flip) {
            switch (flip) {
                case 0:
                    return 'Heads';
                case 1:
                    return 'Tails';
            }
        }
    });

    return Random;

});

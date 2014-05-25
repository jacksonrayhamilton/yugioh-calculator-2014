define(['backbone'],
function (Backbone) {

    'use strict';

    var Player = Backbone.Model.extend({

        defaults: function() {
            return {
                lifePoints: Player.INITIAL_LIFE_POINTS,
                selected: false
            };
        },

        gain: function(amount) {
            this.set({
                lifePoints: this.get('lifePoints') + amount
            });
        },

        lose: function(amount) {
            this.set({
                lifePoints: this.get('lifePoints') - amount
            });
        },

        resetLifePoints: function() {
            this.set({
                lifePoints: Player.INITIAL_LIFE_POINTS
            }, {
                // Add a "reset" option so that anything listening for a
                // change in lifePoints can respond accordingly.
                reset: true
            });
        },

        select: function() {
            this.set({
                selected: true
            });
        }

    }, {
        INITIAL_LIFE_POINTS: 8000
    });

    return Player;

});

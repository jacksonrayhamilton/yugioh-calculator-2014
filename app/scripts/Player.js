define(['./PersistentModel'],
function (PersistentModel) {

    'use strict';

    var Player = PersistentModel.extend({

        defaults: function () {
            return {
                lifePoints: Player.INITIAL_LIFE_POINTS,
                selected: false
            };
        },

        gain: function (amount) {
            this.set({
                lifePoints: this.get('lifePoints') + amount
            }, {
                delta: amount
            });
        },

        lose: function (amount) {
            this.set({
                lifePoints: this.get('lifePoints') - amount
            }, {
                delta: -1 * amount
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

        revertLifePoints: function (lifePoints) {
            this.set({ lifePoints: null }, { silent: true });
            this.set({ lifePoints: lifePoints }, { revert: true });
            this.trigger('lifePointsRevert', {
                playerId: this.get('playerId'),
                lifePoints: lifePoints
            });
        },

        select: function() {
            this.set('selected', true);
        }

    }, {
        INITIAL_LIFE_POINTS: 8000
    });

    return Player;

});

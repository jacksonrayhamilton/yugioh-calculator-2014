define(['backbone', 'underscore', './Player'],
function (Backbone, _, Player) {

    'use strict';

    var PlayerCollection = Backbone.Collection.extend({

        model: Player,

        initialize: function () {
            this.on('change:selected', this.unselectOthers);
        },

        /**
         * When a player is selected, unselects all other players.
         */
        unselectOthers: function (changedModel, isSelected) {
            if (isSelected) {
                _.forEach(this.models, function (model) {
                    if (model !== changedModel) {
                        model.set({
                            selected: false
                        });
                    }
                });
            }
        },

        getSelected: function () {
            return this.findWhere({
                selected: true
            });
        },

        resetLifePoints: function () {
            this.forEach(function (player) {
                player.resetLifePoints();
            });
            this.trigger('lifePointsReset', {
                lifePoints: this.reduce(function (arr, player) {
                    arr.push({
                        playerId: player.get('playerId'),
                        lifePoints: player.previous('lifePoints')
                    });
                    return arr;
                }, [])
            });
        }

    });

    return PlayerCollection;

});

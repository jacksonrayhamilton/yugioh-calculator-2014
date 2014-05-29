define(['underscore', 'PersistentModel'],
function (_, PersistentModel) {

    'use strict';

    var History = PersistentModel.extend({

        defaults: function() {
            return {
                items: []
            };
        },

        initialize: function (args) {

            PersistentModel.prototype.initialize.call(this);

            this.players = args.players;
            this.timer = args.timer;
            this.random = args.random;

            var items = this.get('items');
            // If the history is too long after restoring, shorten it.
            if (items.length > History.MAX_ITEMS) {
                var overflow = items.length - History.MAX_ITEMS;
                this.set('items', items.slice(overflow));
            }

            this.listenTo(this.players, 'change:lifePoints', this.logLifePointsChange);
            this.listenTo(this.players, 'lifePointsRevert', this.logLifePointsRevert);
            this.listenTo(this.players, 'lifePointsReset', this.logLifePointsReset);
            this.listenTo(this.players, 'lifePointsResetRevert', this.logLifePointsResetRevert);
            this.listenTo(this.timer, 'restart', this.logTimerRestart);
            this.listenTo(this.timer, 'restartRevert', this.logTimerRestartRevert);
            this.listenTo(this.random, 'change', this.logRandom);

        },

        /**
         * Manages timestamping all History items before logging them.
         */
        log: function(item) {
            _.extend(item, {
                time: new Date().getTime()
            });
            this.set('items', this.get('items').concat(item));
        },

        /**
         * Logs changes in life points, except when they are reset. (Resets are
         * handled by `logLifePointsReset`.
         */
        logLifePointsChange: function (model, value, options) {
            if (!options.revert && !options.reset && !options.resetRevert) {
                var previous = model.previous('lifePoints');
                var difference = value - previous;
                this.log({
                    playerId: model.get('playerId'),
                    event: {
                        name: 'lifePointsChange',
                        loperand: previous,
                        roperand: difference,
                        result: value
                    }
                });
            }
        },

        logLifePointsRevert: function (options) {
            this.log({
                playerId: options.playerId,
                event: {
                    name: 'lifePointsRevert',
                    lifePoints: options.lifePoints
                }
            });
        },

        logLifePointsReset: function () {
            this.log({
                event: {
                    name: 'lifePointsReset'
                }
            });
        },

        logLifePointsResetRevert: function () {
            this.log({
                event: {
                    name: 'lifePointsResetRevert'
                }
            });
        },

        logTimerRestart: function () {
            this.log({
                event: {
                    name: 'timerRestart',
                    startTime: this.timer.previous('startTime')
                }
            });
        },

        logTimerRestartRevert: function (options) {
            this.log({
                event: {
                    name: 'timerRestartRevert',
                    startTime: options.startTime
                }
            });
        },

        logRandom: function (model) {
            if (model.changed.lastRoll) {
                this.log({
                    event: {
                        name: 'roll',
                        result: model.get('lastRoll')
                    }
                });
            } else if (model.changed.lastFlip) {
                this.log({
                    event: {
                        name: 'flip',
                        result: model.get('lastFlip')
                    }
                });
            }
        }

    }, {
        MAX_ITEMS: 100
    });

    return History;

});

define(['underscore', './indexOfWhere', './PersistentModel'],
function (_, indexOfWhere, PersistentModel) {

    'use strict';

    var Undos = PersistentModel.extend({

        defaults: function () {
            return {
                items: [],
                games: 0
            };
        },

        initialize: function (args) {
            this.players = args.players;
            this.timer = args.timer;
            this.restore();
            this.on('change', function () {
                //console.log(this.get('items'), this.get('games'));
                this.persist();
            });
            this.on('change:games', this.cleanGames);
            this.listenTo(this.players, 'change:lifePoints', this.pushLifePointsDelta);
            this.listenTo(this.players, 'lifePointsReset', this.pushLifePointsReset);
            this.listenTo(this.timer, 'restart', this.pushTimerRestart);
        },

        push: function (item) {
            this.get('items').push(item);
            this.trigger('change:items');
        },

        pop: function () {
            var item = this.get('items').pop();
            if (typeof item !== 'undefined') {
                this.trigger('change:items');
            }
            return item;
        },

        /**
         * Possibly cleans up old games after new ones have started.
         */
        cleanGames: function () {
            var games = this.get('games');
            if (games > Undos.GAMES_LIMIT) {
                var items = this.get('items');
                var index = indexOfWhere(items, {
                    type: 'lifePointsReset'
                });
                var slicedItems = items.slice(index + 1);
                this.set({
                    items: slicedItems,
                    games: games - 1
                });
            }
        },

        pushLifePointsDelta: function (player, value, options) {
            if (!options.delta) {
                return;
            }
            var item = {
                type: 'lifePointsDelta',
                player: player.id,
                delta: options.delta
            };
            this.set('items', this.get('items').concat(item));
        },

        pushLifePointsReset: function () {
            var item = {
                type: 'lifePointsReset',
                lifePoints: this.players.map(function (player) {
                    return {
                        player: player.id,
                        lifePoints: player.previous('lifePoints')
                    };
                })
            };
            this.set({
                items: this.get('items').concat(item),
                games: this.get('games') + 1
            });
        },

        pushTimerRestart: function () {
            var item = {
                type: 'timerRestart',
                startTime: this.timer.previous('startTime'),
                turn: this.timer.previous('turn')
            };
            this.set({
                items: this.get('items').concat(item)
            });
        },

        /**
         * Performs undo logic.
         */
        undo: function () {
            var last = this.pop();
            if (typeof last === 'undefined') {
                return;
            }
            if (last.type === 'lifePointsDelta') {
                var player = this.players.get(last.player);
                player.set('lifePoints', player.get('lifePoints') - last.delta);
                // TODO: Log LP change undone.
            } else if (last.type === 'lifePointsReset') {
                _.forEach(last.lifePoints, function (item) {
                    this.players.get(item.player).set('lifePoints', item.lifePoints);
                }, this);
                this.set('games', this.get('games') - 1);
                // TODO: Log reset undone.
            } else if (last.type === 'timerRestart') {
                this.timer.clearTimeout();
                this.timer.set({
                    startTime: last.startTime,
                    turn: last.turn
                });
                this.timer.tick();
                // TODO: Log timer reset undone.
            }
        }

    }, {
        // CONSIDER: Is this behavior for better or worse? Sheer numbers instead? Mins / maxes?
        GAMES_LIMIT: 10
    });

    return Undos;

});

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
            this.notes = args.notes;
            this.restore();
            this.on('change', function () {
                //console.log(this.get('items'), this.get('games'));
                this.persist();
            });
            this.on('change:games', this.cleanGames);
            this.listenTo(this.players, 'change:lifePoints', this.pushLifePointsDelta);
            this.listenTo(this.players, 'lifePointsReset', this.pushLifePointsReset);
            this.listenTo(this.timer, 'restart', this.pushTimerRestart);
            this.listenTo(this.notes, 'clear', this.pushNotesClear);
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
            this.set('items', this.get('items').concat(item));
        },

        pushNotesClear: function () {
            var item = {
                type: 'notesClear',
                content: this.notes.previous('content')
            };
            this.set('items', this.get('items').concat(item));
        },

        undo: function () {
            var last = this.pop();
            if (typeof last === 'undefined') {
                return;
            }
            switch (last.type) {
                case 'lifePointsDelta':
                    var player = this.players.get(last.player);
                    var lifePoints = player.get('lifePoints') - last.delta;
                    player.revertLifePoints(lifePoints);
                    break;
                case 'lifePointsReset':
                    this.players.revertResetLifePoints(last.lifePoints);
                    this.set('games', this.get('games') - 1);
                    break;
                case 'timerRestart':
                    this.timer.revertRestart(last);
                    break;
                case 'notesClear':
                    // If there is already content, don't overwrite it. Undoing
                    // is a clear is meant to be a recovery option; it should
                    // not be destructive.
                    if (this.notes.get('content').length > 0) {
                        break;
                    }
                    this.notes.set('content', last.content);
                    this.notes.trigger('unclear');
                    break;
            }
        }

    }, {
        // CONSIDER: Is this behavior for better or worse? Sheer numbers instead? Mins / maxes?
        GAMES_LIMIT: 10
    });

    return Undos;

});

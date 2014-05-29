define(['underscore', './PersistentModel'],
function (_, PersistentModel) {

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
            this.on('change:items', function () {
                this.clean(true);
                this.persist();
            });
            this.listenTo(this.players, 'change:lifePoints', this.pushLifePointsDelta);
            this.listenTo(this.players, 'lifePointsReset', this.pushLifePointsReset);
            this.listenTo(this.timer, 'restart', this.pushTimerRestart);
            this.listenTo(this.notes, 'clear', this.pushNotesClear);
        },

        push: function (item) {
            this.set('items', this.get('items').concat(item));
        },

        pop: function () {
            var item = this.get('items').pop();
            if (typeof item !== 'undefined') {
                this.trigger('change:items');
            }
            return item;
        },

        clean: function (silent) {
            var items = this.get('items');
            if (items.length > Undos.MAX_ITEMS) {
                this.set({
                    items: items.slice(items.length - Undos.MAX_ITEMS)
                }, {
                    // May have to be silent to avoid infinite recursion.
                    silent: silent
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
            this.push(item);
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
            this.push(item);
        },

        pushTimerRestart: function () {
            var item = {
                type: 'timerRestart',
                startTime: this.timer.previous('startTime'),
                turn: this.timer.previous('turn')
            };
            this.push(item);
        },

        pushNotesClear: function () {
            var item = {
                type: 'notesClear',
                content: this.notes.previous('content')
            };
            this.push(item);
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
        MAX_ITEMS: 50
    });

    return Undos;

});

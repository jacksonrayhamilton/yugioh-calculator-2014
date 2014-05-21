/*global define*/

require.config({
    paths: {
        jquery: '../bower_components/jquery/dist/jquery',
        fittext: '../bower_components/FitText.js/jquery.fittext',
        underscore: '../bower_components/underscore/underscore',
        backbone: '../bower_components/backbone/backbone',
        localstorage: '../bower_components/backbone.localStorage/backbone.localStorage',
        moment: '../bower_components/moment/moment',
        fastclick: '../bower_components/fastclick/lib/fastclick',
        domready: '../bower_components/requirejs-domready/domReady'
    },
    shim: {
        fittext: {
            deps: [ 'jquery' ]
        }
    }
});

define(['jquery', 'underscore', 'backbone', 'moment', 'fastclick', 'hacks', 'domready!'
], function($, _, Backbone, moment, FastClick) {

    'use strict';

    /**
     * Offers some utility methods to Models.
     */
    var ImprovedModel = Backbone.Model.extend({

        // Pushes an argument to an array attribute of this model
        push: function(arg, val) {
            var arr = _.clone(this.get(arg));
            arr.push(val);
            this.set(arg, arr);
        }
    });

    /**
     * Allows for persisting/restoring the state of Models through localStorage.
     * Restores a Model on instantiation. Persists it on change.
     * Optionally, override initialize() to watch for specific changes.
     * Also offers some utility methods.
     */
    var PersistentModel = ImprovedModel.extend({

        initialize: function() {
            this.restore();
            this.on('change', this.persist);
        },

        persist: function() {
            localStorage.setItem(this.id, JSON.stringify(this.toJSON()));
        },

        restore: function() {
            var attributes = localStorage.getItem(this.id);
            if (attributes) {
                this.set(JSON.parse(attributes));
            }
        }
    });

    /**
     * Maintains the state of a player. Keeps track of his life points, wins,
     * matches and whether he is selected.
     */
    var Player = PersistentModel.extend({

        defaults: function() {
            return {
                lifePoints: Player.INITIAL_LIFE_POINTS,
                score: [],
                selected: false
            };
        },

        getWins: function() {
            var score = this.get('score');
            var wins = 0;
            for (var i = 0, j = score.length; i < j; i += 1) {
                if (score[i] === true) {
                    wins += 1;
                }
            }
            return wins;
        },

        gain: function(amount) {
            this.set('lifePoints', this.get('lifePoints') + amount);
        },

        lose: function(amount) {
            this.set('lifePoints', this.get('lifePoints') - amount);
        },

        resetLifePoints: function() {
            this.set({ lifePoints: Player.INITIAL_LIFE_POINTS }, { reset: true });
        },

        select: function() {
            this.set('selected', true);
        }

    }, {
        INITIAL_LIFE_POINTS: 8000
    });

    /**
     * Multiple players. Maintains who is selected among them.
     */
    var PlayerCollection = Backbone.Collection.extend({

        model: Player,

        initialize: function() {
            this.on('change:selected', this.unselectOthers);
        },

        /**
         * When selecting a player, unselects all other players.
         */
        unselectOthers: function(changedModel, value) {
            if (value === true) {
                for (var i = 0, j = this.models.length; i < j; i += 1) {
                    var model = this.models[i];
                    if (model !== changedModel) {
                        model.set('selected', false);
                    }
                }
            }
        },

        getSelected: function() {
            for (var i = 0, j = this.models.length; i < j; i += 1) {
                var model = this.models[i];
                if (model.get('selected')) {
                    return model;
                }
            }
        },

        newMatch: function() {
            for (var i = 0, j = this.models.length; i < j; i += 1) {
                this.models[i].set('score', []);
                this.models[i].resetLifePoints();
            }
            timer.restart();
            this.trigger('new:match');
        },

        /**
         * Determines the game number that is coming up, and fires an event
         * with that info.
         */
        triggerNewGame: function() {
            var gameNumber = this.models[0].get('score').length + 1;
            this.trigger('new:game', gameNumber);
        },

        // 0 = player0, 1 = player1 [, X = playerX...], null = draw
        endGame: function(winner) {

            var i, j;

            if (winner !== null) {

                // Distribute a win/loss accordingly, and reset life points
                // in preparation for the next game/match
                for (i = 0, j = this.models.length; i < j; i += 1) {
                    var hasWon = (i === winner);
                    this.models[i].push('score', hasWon);
                    this.models[i].resetLifePoints();
                }

                if ((this.models[winner].getWins()) === 2) {
                    // If a player has 2 wins, then he has won the match
                    // Start a new match now
                    this.newMatch();
                }
                else {
                    this.triggerNewGame();
                }
            }
            // Draws result in both players receiving a null
            else {
                for (i = 0, j = this.models.length; i < j; i += 1) {
                    this.models[i].push('score', null);
                    this.models[i].resetLifePoints();
                }
                this.triggerNewGame();
            }
        }
    });

    /**
     * Visual representation of a player.
     */
    var PlayerView = Backbone.View.extend({

        initialize: function() {
            this.$lifePoints = this.$el.find('.lifePoints');
            this.$score = this.$el.find('.score');
            this.$tapHint = this.$el.find('.tapHint');
            this.listenTo(this.model, 'change:lifePoints', this.renderLifePoints);
            this.listenTo(this.model, 'change:selected', this.renderSelected);
            this.listenTo(this.model, 'change:score', this.renderScore);
            this.render();
        },

        render: function() {
            this.renderLifePoints();
            this.renderSelected();
            this.renderScore();
        },

        renderLifePoints: function() {
            this.$lifePoints.html(this.model.get('lifePoints'));
            return this;
        },

        renderSelected: function() {
            if (this.model.get('selected')) {
                this.$el.addClass('selected');
                this.$tapHint.html('Selected');
            } else {
                this.$el.removeClass('selected');
                this.$tapHint.html('Tap to select');
            }
            return this;
        },

        // Displays which game (in a match) that the player has won, if any
        renderScore: function() {
            var score = this.model.get('score');
            if (score.length === 0) {
                this.$score.html('');
            }
            else {
                for (var i = 0, j = score.length; i < j; i += 1) {
                    if (score[i] === true) {
                        this.$score.html('Won G' + (i + 1));
                        break;
                    }
                }
            }
            return this;
        },

        events: {
            'click': function() {
                this.model.select();
            }
        }
    });


    /**
     * Inserts a string into a target string, replacing characters in the string up
     * to the length of the inserted string. (Works like the INSERT key.) Also, it
     * always replaces at least 1 character.
     */
    function insertString(target, string, index) {
        // Length should always be treated as at least 1
        var length = (string.length > 0) ? string.length : 1;
        return target.substring(0, index) + string + target.substring(index + length);
    }


    /**
     * Controls the value of the addition/subtraction Operation that the
     * user is performing on a Player, and provides how that value is changed.
     */
    var Operation = Backbone.Model.extend({

        defaults: function() {
            return {
                value: '0000',
                index: 0
            };
        },

        // Inserts digit(s) into the value, from the current index
        insertDigit: function(digit) {
            var index = this.get('index');
            this.set({
                value: insertString(this.get('value'), digit, index),
                index: index + digit.length
            });
        },

        // Either replaces the last digit with a 0, or removes it
        deleteLastDigit: function() {
            var index = this.get('index');
            if (index > 0) {
                var replacement = (index <= 4) ? '0' : '';
                this.set({
                    value: insertString(this.get('value'), replacement, (index - 1)),
                    index: index - 1
                });
            }
        },

        clearValue: function() {
            this.set(this.defaults());
        },

        enterValue: function(sign) {
            var selectedPlayer = players.getSelected();
            var integerValue = parseInt(this.get('value'));
            if (sign === '+') {
                selectedPlayer.gain(integerValue);
            } else {
                selectedPlayer.lose(integerValue);
            }
            this.clearValue();
        }
    });

    /**
     * Representation of the number in the current operation being performed.
     */
    var OperationView = Backbone.View.extend({

        el: '#operation',

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.render();
        },

        getDisplayedValue: (function() {
            // Regex for replacing the leading zeros in the value
            var leadingZeros = /^0+/;
            // Function to replace multiple leading zeros with non-breaking spaces
            var toNbsp = function(match) {
                return new Array(match.length + 1).join('&nbsp;');
            };
            return function() {
                var value = this.model.get('value');
                var index = this.model.get('index');

                // Determine the "currently selected" character in the value
                // (the one that will be highlighted to show the user his index)
                var wrappedChar = value.charAt(index);
                if (wrappedChar === '') {
                    wrappedChar = '&nbsp;';
                }

                // Wrap that "currently selected" character
                var displayedValue =
                        value.substring(0, index) +
                        '<div class="selected">' + wrappedChar + '</div>' +
                        value.substring(index + 1);

                // Remove leading zeroes in the displayed value
                if (index > 0) {
                    displayedValue = displayedValue.replace(leadingZeros, toNbsp);
                }

                return displayedValue;
            };
        }()),

        render: function() {
            this.$el.html(this.getDisplayedValue());
        }
    });

    /**
     * Timer Model and View
     * Controls the matches' Timer, how and when it is rendered, reset, and
     * when overtime occurs and a match enters "turns."
     */
    var Timer = PersistentModel.extend({

        defaults: function() {
            return {
                startTime: undefined,
                timeout: undefined,
                turn: null
            };
        },

        initialize: function() {
            this.restore();
            this.on('change:startTime change:turn', this.persist);
            if (this.get('startTime') === undefined) {
                this.restart();
            } else {
                this.tick();
            }
        },

        inOvertime: function() {
            return (this.getTimePassed() > Timer.MATCH_TIME);
        },

        tick: function() {
            if (this.inOvertime()) {
                if (this.get('turn') === null) {
                    this.set({ turn: 0 }, { silent: true });
                }
                this.trigger('overtime');
            }
            else {
                var self = this;
                this.set('timeout', setTimeout(function() {
                    self.tick();
                }, Timer.UPDATE_FREQUENCY));
            }
        },

        restart: function() {
            clearTimeout(this.get('timeout'));
            this.set({
                startTime: new Date().getTime(),
                turn: null
            });
            this.tick();
        },

        getTimePassed: function() {
            return new Date().getTime() - this.get('startTime');
        },

        getTimeLeft: function() {
            return Timer.MATCH_TIME - this.getTimePassed();
        }

    }, {
        UPDATE_FREQUENCY: 1000, // 1 second
        MATCH_TIME: 2400000     // 40 minutes
    });

    /**
     * Formats milliseconds as "00:00" (MINS:SECS).
     */
    function formatMs(ms) {
        var seconds = Math.floor(ms / 1000) % 60;
        var minutes = Math.floor(ms / 60000);
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return minutes + ':' + seconds;
    }

    /**
     * Visual representation of the match timer. Counts down from 40:00 to 0 and
     * then goes into overtime.
     */
    var TimerView = Backbone.View.extend({

        el: '#timer',

        initialize: function() {
            this.$display = this.$el.find('#display');
            this.$previousTurn = this.$el.find('#previousTurn');
            this.$nextTurn = this.$el.find('#nextTurn');
            this.listenTo(this.model, 'change:timeout', this.renderTime);
            this.listenTo(this.model, 'change:turn overtime', this.renderTurn);
            if (this.model.inOvertime()) {
                this.renderTurn();
            } else {
                this.renderTime();
            }
        },

        renderTime: function() {
            this.$display.html(formatMs(this.model.getTimeLeft()));
        },

        renderTurn: function() {
            var turn = this.model.get('turn');
            if (turn === null) {
                this.$previousTurn.hide();
                this.$nextTurn.hide();
            }
            else {
                this.$display.html(turn);
                if (turn === 0) {
                    this.$previousTurn.hide();
                } else {
                    this.$previousTurn.show();
                }
                this.$nextTurn.show();
            }
        },

        events: {
            'click .changeTurn': function(e) {
                var direction = e.target.id;
                var turn = this.model.get('turn');
                if (direction === 'previousTurn' || direction === 'previousTurnArrow') {
                    turn -= 1;
                } else if (direction === 'nextTurn' || direction === 'nextTurnArrow') {
                    turn += 1;
                }
                this.model.set('turn', turn);
            }
        }
    });

    /**
     * Provides the main user interface, allowing for digit, math, operation
     * and special buttons to be pressed.
     */
    var ButtonView = Backbone.View.extend({

        el: '#buttons',

        events: {
            'click .specialButton': 'subViewButtonHandler',
            'click #donate': 'subViewButtonHandler',
            'click .digitButton': function(e) {
                // Get the digit in from the 5th character of the
                // clicked button's id (e.g."digit0")
                var digit = e.currentTarget.id.substring(5);
                operation.insertDigit(digit);
            },
            'click #backspace': function() {
                operation.deleteLastDigit();
            },
            'click #clear': function() {
                operation.clearValue();
            },
            'click #add': function() {
                operation.enterValue('+');
            },
            'click #subtract': function() {
                operation.enterValue('-');
            }
        },

        subViewButtonHandler: function(e) {
            var subView = e.currentTarget.id;
            blackWindowView.show(subView);
        }
    });

    /**
     * A view which has its visibility toggled by BlackWindowView should extend
     * SubView and override `show()` and/or `hide()` if necessary.
     */
    var SubView = Backbone.View.extend({

        show: function() {
            this.$el.show();
        },

        hide: function() {
            this.$el.hide();
        }
    });


    /**
     * Not necessarily a View for PlayerCollection, but does invoke its methods.
     * Provides a user interface for games/matches to be ended.
     */
    var ResetView = SubView.extend({

        el: '#resetView',

        events: {
            'click #player0Button': function() {
                players.endGame(0);
                blackWindowView.hide();
            },
            'click #player1Button': function() {
                players.endGame(1);
                blackWindowView.hide();
            },
            'click #drawButton': function() {
                players.endGame(null);
                blackWindowView.hide();
            },
            'click #newMatchButton': function() {
                players.newMatch();
                blackWindowView.hide();
            }
        }
    });


    /**
     * Persists, restores and modifies the state of Notes
     */
    var Notes = PersistentModel.extend({

        defaults: function() {
            return {
                content: ''
            };
        },

        clear: function() {
            this.set(this.defaults());
            this.trigger('clear');
        }
    });

    /**
     * Visual representation of a note.
     */
    var NotesView = SubView.extend({

        el: '#notesView',

        initialize: function() {
            this.$textarea = this.$el.find('#notesTextarea');
            this.listenTo(this.model, 'clear', this.render);
            this.render();
        },

        events: {
            'keyup #notesTextarea': function() {
                this.model.set('content', this.$textarea.val());
            },
            'click #clearNotesButton': function() {
                this.model.clear();
            }
        },

        render: function() {
            this.$textarea.val(this.model.get('content'));
        }
    });


    /**
     * History Model and View
     * Maintains a set of items logging everything that happens in each game.
     * Manages how said items are displayed in the history table.
     */
    var History = PersistentModel.extend({

        defaults: function() {
            return {
                items: []
            };
        },

        initialize: function() {
            PersistentModel.prototype.initialize.call(this);
            var items = this.get('items');
            // If the history is getting too long, shorten it to 75 items
            if (items.length > 75) {
                var overflow = items.length - 75;
                items.splice(0, overflow);
                this.set('items', items);
            }
            this.listenTo(players, 'change:lifePoints', this.logLifePoints);
            this.listenTo(players, 'change:score', this.logScore);
            this.listenTo(players, 'new:game', this.logNewGame);
            this.listenTo(players, 'new:match', this.logNewMatch);
            this.listenTo(random, 'change', this.logRandom);
        },

        /**
         * Manages timestamping all History items before logging them.
         */
        log: function(item) {
            _.extend(item, {
                timestamp: moment().format('hh:mm:ss A')
            });
            this.push('items', item);
        },

        /**
         * Logs changes in life points, except when they are reset. (They are
         * only reset when scores change, and in those cases, the score change
         * is ALL that NEEDS to be logged).
         */
        logLifePoints: function(model, value, options) {
            if (!options.reset) {
                var previous = model.previous('lifePoints');
                var difference = value - previous;
                var event;
                if (difference > 0) {
                    event = previous + ' + ' + difference + ' = ' + value;
                } else {
                    event = previous + ' - ' + (difference * -1) + ' = ' + value;
                }
                this.log({
                    playerId: model.get('playerId'),
                    event: event
                });
            }
        },

        /**
         * Logs changes in score (wins, losses, or draws).
         */
        logScore: function(model, value) {
            // Look at the last score in a Player's score array
            var lastScore = value[value.length - 1];
            var playerId = model.get('playerId');
            if (lastScore === null) {
                this.log({
                    playerId: playerId,
                    event: 'A draw occurred.'
                });
            }
            else if (lastScore === true) {
                this.log({
                    playerId: playerId,
                    event: 'won.'
                });
            }
            else if (lastScore === false) {
                this.log({
                    playerId: playerId,
                    event: 'lost.'
                });
            }
        },

        logNewGame: function(gameNumber) {
            this.log({
                playerId: null,
                event: 'Next game (G' + gameNumber + ').'
            });
        },

        logNewMatch: function() {
            this.log({
                playerId: null,
                event: 'New match.'
            });
        },

        logRandom: function(model/*, value*/) {
            var item = {
                playerId: null
            };
            if (model.changed.lastRoll) {
                item.event = 'Rolled ' + model.get('lastRoll') + '.';
                this.log(item);
            }
            else {
                item.event = 'Flipped ' + model.get('lastFlip') + '.';
                this.log(item);
            }
        }
    });

    /**
     * Visual representation of the game's history.
     */
    var HistoryView = SubView.extend({

        el: '#historyView',

        initialize: function() {
            this.$tableContainer = this.$el.find('#historyTableContainer');
            this.$table = this.$el.find('#historyTable');
            this.$itemTemplateHtml = this.$el.find('#historyItemTemplate').html();
            this.lastRenderedRow = 0;
        },

        /**
         * Renders all History items (the first time). Only renders new
         * (unrendered) History items each subsequent time.
         */
        render: function() {
            var items = this.model.get('items');
            var itemsToRender = items.slice(this.lastRenderedRow);
            var html = '';
            for (var i = 0, j = itemsToRender.length; i < j; i += 1) {
                var playerId = itemsToRender[i].playerId;
                var displayName;
                if (playerId === null) {
                    displayName = '';
                } else {
                    displayName = players.findWhere({ playerId: playerId }).get('displayName');
                }
                var variables = {
                    className: 'player' + playerId,
                    displayName: displayName,
                    event: itemsToRender[i].event,
                    timestamp: itemsToRender[i].timestamp
                };
                var tr = _.template(this.$itemTemplateHtml, variables);
                html += tr;
            }
            this.$table.append(html);
            this.lastRenderedRow = items.length;
        },

        /*
         * Renders the History's table and scrolls to the bottom of it.
         * In order to relieve the user of constant DOM interactions,
         * HistoryView only renders on show().
         */
        show: function() {
            this.render();
            this.$el.show();
            var self = this;
            setTimeout(function() {
                self.$tableContainer.scrollTop(self.$tableContainer.prop('scrollHeight'));
            }, 10);
        }
    });


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

        getRandomInteger: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        roll: function() {
            this.set({ 'lastRoll': null }, { silent: true });
            this.set('lastRoll', this.getRandomInteger(1, 6));
        },

        flip: function() {
            this.set({ 'lastFlip': null }, { silent: true });
            this.set('lastFlip', (this.getRandomInteger(0, 1) === 0) ? 'Heads' : 'Tails');
        }
    });

    /**
     * Visual representation of random outcomes.
     */
    var RandomView = SubView.extend({

        el: '#randomView',

        initialize: function() {
            this.rollTimeout = null;
            this.flipTimeout = null;
            this.$lastRoll = this.$el.find('#lastRoll');
            this.$lastFlip = this.$el.find('#lastFlip');
            this.listenTo(this.model, 'change:lastRoll', this.renderLastRoll);
            this.listenTo(this.model, 'change:lastFlip', this.renderLastFlip);
            this.render();
        },

        render: function() {
            this.$lastRoll.html(this.model.get('lastRoll'));
            this.$lastFlip.html(this.model.get('lastFlip'));
        },

        // Shows a result in the given element, also shakes it to indicate a change
        renderResult: function($el, result, timeout) {
            clearTimeout(timeout);
            $el.html(result).addClass('shake');
            timeout = setTimeout(function() {
                $el.removeClass('shake');
            }, 800);
        },

        renderLastRoll: function() {
            this.renderResult(
                this.$lastRoll,              // Element to use
                this.model.get('lastRoll'),  // String to put in element
                this.rollTimeout);           // Non-conflicting timeout
        },

        renderLastFlip: function() {
            this.renderResult(
                this.$lastFlip,
                this.model.get('lastFlip'),
                this.flipTimeout);
        },

        events: {
            'click #roll': function() {
                this.model.roll();
            },
            'click #flip': function() {
                this.model.flip();
            }
        }
    });

    /**
     * Money.
     */
    var DonateView = SubView.extend({
        el: '#donateView'
    });

    /**
     * Contains the Views corresponding with the Special Buttons.
     * (Reset, History, etc.) It controls its own and its "Sub Views'" visibility.
     */
    var BlackWindow = Backbone.Model.extend({

        defaults: function() {
            return {
                visibleSubView: null
            };
        }
    });

    var BlackWindowView = Backbone.View.extend({

        el: '#window',

        initialize: function(options) {
            this.subViews = options.subViews;
        },

        events: {
            'click #cancelButton': function() {
                this.hide();
            }
        },

        show: function(subView) {
            this.subViews[subView].show();
            this.model.set('visibleSubView', subView);
            this.$el.show();
        },

        hide: function() {
            this.$el.hide();
            this.subViews[this.model.get('visibleSubView')].hide();
        }
    });

    // Initialization

    var player0 = new Player({
        playerId: 0,
        id: 'player0',
        displayName: 'You',
        selected: true
    });
    var player1 = new Player({
        playerId: 1,
        id: 'player1',
        displayName: 'Opponent'
    });
    var players = new PlayerCollection([player0, player1]);
    new PlayerView({
        model: player0,
        el: '#player0'
    });
    new PlayerView({
        model: player1,
        el: '#player1'
    });

    var operation = new Operation();
    new OperationView({ model: operation });

    var timer = new Timer({ id: 'timer' });
    new TimerView({ model: timer });

    new ButtonView();

    var resetView = new ResetView();

    var notes = new Notes({ id: 'notes' });
    var notesView = new NotesView({ model: notes });

    var random = new Random({ id: 'random' });
    var randomView = new RandomView({ model: random });

    var history = new History({ id: 'history' });
    var historyView = new HistoryView({ model: history });

    var donateView = new DonateView();

    var blackWindow = new BlackWindow();
    var blackWindowView = new BlackWindowView({
        model: blackWindow,
        subViews: {
            reset: resetView,
            notes: notesView,
            history: historyView,
            random: randomView,
            donate: donateView
        }
    });


    // Hide the address bar in mobile safari
    window.scrollTo(0, document.body.scrollHeight);

    // Remove the 300ms delay on mobile devices
    FastClick.attach(document.body);
});

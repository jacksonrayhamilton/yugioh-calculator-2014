define(['jquery', 'underscore', 'backbone', 'fastclick',
        'Player', 'PlayerCollection', 'PlayerView',
        'Expression', 'ExpressionView',
        'ButtonView',
        'Timer', 'TimerView',
        'Undos',
        'Notes', 'NotesView',
        'Random', 'RandomView',
        'History', 'HistoryView',
        'BlackWindow', 'BlackWindowView',
        'fitText'],
function($, _, Backbone, FastClick,
         Player, PlayerCollection, PlayerView,
         Expression, ExpressionView,
         ButtonView,
         Timer, TimerView,
         Undos,
         Notes, NotesView,
         Random, RandomView,
         History, HistoryView,
         BlackWindow, BlackWindowView,
         fitText) {

    'use strict';

    var App = Backbone.Model.extend({

        defaults: function () {
            return {
                expressionEvaluationMode: false
            };
        },

        initialize: function () {

            var player0 = new Player({
                playerId: 0,
                id: 'player-0',
                selected: true
            });

            var player1 = new Player({
                playerId: 1,
                id: 'player-1'
            });

            new PlayerView({
                model: player0,
                el: '#yc-player-0'
            });

            new PlayerView({
                model: player1,
                el: '#yc-player-1'
            });

            var players = new PlayerCollection([player0, player1]);

            var expression = new Expression({
                players: players
            });

            new ExpressionView({
                model: expression,
                el: '#yc-expression'
            });

            var timer = new Timer({
                id: 'timer'
            });

            new TimerView({
                model: timer,
                el: '#yc-timer'
            });

            var notes = new Notes({
                id: 'notes'
            });

            var notesView = new NotesView({
                model: notes,
                el: '.yc-notes-window'
            });

            var random = new Random({
                id: 'random'
            });

            var randomView = new RandomView({
                model: random,
                el: '.yc-random-window'
            });

            var history = new History({
                id: 'history',
                players: players,
                timer: timer,
                random: random
            });

            var historyView = new HistoryView({
                model: history,
                el: '.yc-history-window'
            });

            var blackWindow = new BlackWindow();

            var blackWindowView = new BlackWindowView({
                model: blackWindow,
                subViews: {
                    notes: notesView,
                    history: historyView,
                    //ruling: rulingView,
                    random: randomView
                },
                el: '.yc-window'
            });

            var undos = new Undos({
                id: 'undos',
                players: players,
                timer: timer,
                notes: notes
            });

            new ButtonView({
                app: this,
                players: players,
                expression: expression,
                timer: timer,
                undos: undos,
                blackWindowView: blackWindowView,
                el: '#yc-calculator'
            });

            // Make predefined texts fit to their containers.
            fitText();

            // Change the lengths of the notes gradient as it grows.
            //resizeNotesGradient();

            // Hide the address bar in old Mobile Safari.
            window.scrollTo(0, document.body.scrollHeight);

            // Remove the 300ms delay on mobile devices.
            FastClick.attach(document.body);

        }

    });

    return App;

});

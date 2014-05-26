define(['jquery', 'underscore', 'backbone', 'moment', 'fastclick',
        './Player', './PlayerCollection', './PlayerView', './Expression', './ExpressionView',
        './ButtonView', './Timer', './TimerView', './fitText'],
function($, _, Backbone, moment, FastClick,
         Player, PlayerCollection, PlayerView, Expression, ExpressionView,
         ButtonView, Timer, TimerView, fitText) {

    'use strict';

    var App = Backbone.Model.extend({

        defaults: function () {
            return {
                expressionEvaluationMode: false
            };
        },

        initialize: function () {

            var player0 = new Player({
                playerId: 0, // TODO: Remove these?
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

            new ButtonView({
                app: this,
                players: players,
                expression: expression,
                timer: timer,
                el: '#yc-calculator'
            });

            // Make predefined texts fit to their containers.
            fitText();

            // Hide the address bar in mobile safari
            window.scrollTo(0, document.body.scrollHeight);

            // Remove the 300ms delay on mobile devices
            FastClick.attach(document.body);

        }

    });

    return App;

});

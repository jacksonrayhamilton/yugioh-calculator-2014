define(['jquery', 'underscore', 'backbone', 'moment', 'fastclick',
        './Player', './PlayerCollection', './PlayerView', './Operation', './OperationView',
        './ButtonView', './fitText'],
function($, _, Backbone, moment, FastClick,
         Player, PlayerCollection, PlayerView, Operation, OperationView,
         ButtonView, fitText) {

    'use strict';

    var App = Backbone.Model.extend({

        initialize: function () {

            var player0 = new Player({
                playerId: 0,
                id: 'player0', // TODO: Remove these?
                selected: true
            });

            var player1 = new Player({
                playerId: 1,
                id: 'player1'
            });

            var players = new PlayerCollection([player0, player1]);

            new PlayerView({
                model: player0,
                el: '#yc-player-0'
            });

            new PlayerView({
                model: player1,
                el: '#yc-player-1'
            });

            var operation = new Operation({
                players: players
            });

            new OperationView({
                model: operation,
                el: '#yc-operand'
            });

            new ButtonView({
                operation: operation,
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

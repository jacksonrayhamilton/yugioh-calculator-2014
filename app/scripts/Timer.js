define(['./PersistentModel', 'underscore'],
function (PersistentModel, _) {

    'use strict';

    /**
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
            } else {
                this.set('timeout', setTimeout(_.bind(function() {
                    this.tick();
                }, this), Timer.UPDATE_FREQUENCY));
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

    return Timer;

});

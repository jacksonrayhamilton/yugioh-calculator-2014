define(['backbone', './formatMs'],
function (Backbone, formatMs) {

    'use strict';

    /**
     * Visual representation of the match timer. Counts down from 40:00 to 0 and
     * then goes into overtime.
     */
    var TimerView = Backbone.View.extend({

        initialize: function () {
            this.$display = this.$el.find('.yc-timer-display');
            this.$previousTurn = this.$el.find('.yc-timer-previous-turn');
            this.$nextTurn = this.$el.find('.yc-timer-next-turn');
            this.listenTo(this.model, 'change:timeout', this.renderTime);
            this.listenTo(this.model, 'change:turn overtime', this.renderTurn);
            if (this.model.inOvertime()) {
                this.renderTurn();
            } else {
                this.renderTime();
            }
        },

        renderTime: function () {
            this.$display.html(formatMs(this.model.getTimeLeft()));
        },

        renderTurn: function () {
            var turn = this.model.get('turn');
            if (turn === null) {
                this.$previousTurn.hide();
                this.$nextTurn.hide();
            } else {
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
            'click .yc-timer-previous-turn': function () {
                this.model.set('turn', this.model.get('turn') - 1);
            },
            'click .yc-timer-next-turn': function () {
                this.model.set('turn', this.model.get('turn') + 1);
            }
        }

    });

    return TimerView;

});

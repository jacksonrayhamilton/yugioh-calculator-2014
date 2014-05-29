define(['underscore', 'SubView', 'TimeFormatter', 'Random'],
function (_, SubView, TimeFormatter, Random) {

    'use strict';

    var HistoryView = SubView.extend({

        initialize: function () {
            this.$tableContainer = this.$el.find('.yc-history-table-container');
            this.$table = this.$el.find('.yc-history-table');
            this.$itemTemplateHtml = this.$el.find('.yc-history-item-template').html();
            this.lastRenderedRow = 0;
        },

        getDisplayName: function (playerId) {
            if (playerId === 0) {
                return 'Left';
            } else if (playerId === 1) {
                return 'Right';
            }
            return '';
        },

        getClassName: function (playerId) {
            if (typeof playerId !== 'undefined') {
                return 'yc-history-player-' + playerId;
            }
            return 'yc-history-neutral';
        },

        getEventIcon: function (event) {
            var clock = '<span class="icon-fa-clock"></span>';
            var reset = '<span class="icon-fa-reset"></span>';
            var undo = '<span class="icon-fa-undo"></span>';
            var dice = '<span class="icon-yc-dice"></span>';
            var coin = '<span class="icon-yc-coin"></span>';
            switch (event.name) {
                case 'lifePointsReset':
                    return reset;
                case 'lifePointsResetRevert':
                    return undo;
                case 'lifePointsRevert':
                    return undo;
                case 'timerRestart':
                    return clock;
                case 'timerRevert':
                    return undo;
                case 'roll':
                    return dice;
                case 'flip':
                    return coin;
            }
        },

        getEventDescription: function (event) {
            switch (event.name) {
                case 'lifePointsChange':
                    if (event.roperand >= 0) {
                        return event.loperand + ' + ' + event.roperand + ' = ' + event.result;
                    } else {
                        return event.loperand + ' - ' + (event.roperand * -1) + ' = ' + event.result;
                    }
                    break;
                case 'lifePointsReset':
                    return 'Life points reset.';
                case 'lifePointsResetRevert':
                    return 'Life points reset reverted.';
                case 'lifePointsRevert':
                    return 'Life points reverted to ' + event.lifePoints + '.';
                case 'timerRestart':
                    return 'Timer restarted (previous start time: ' + TimeFormatter.getTimestamp(event.startTime) + ').';
                case 'timerRevert':
                    return 'Timer reverted to start time ' + TimeFormatter.getTimestamp(event.startTime) + '.';
                case 'roll':
                    return 'Rolled ' + event.result + '.';
                case 'flip':
                    return 'Flipped ' + Random.getFlipFace(event.result) + '.';
            }
        },

        /**
         * Renders all History items (the first time). Only renders new
         * (unrendered) History items each subsequent time.
         */
        render: function() {
            var items = this.model.get('items');
            var itemsToRender = items.slice(this.lastRenderedRow);
            var html = _.reduce(itemsToRender, _.bind(function (html, item) {
                var playerId = item.playerId;
                var tr = _.template(this.$itemTemplateHtml, {
                    className: this.getClassName(playerId),
                    displayName: this.getDisplayName(playerId),
                    icon: this.getEventIcon(item.event),
                    description: this.getEventDescription(item.event),
                    timestamp: TimeFormatter.getTimestamp(item.time)
                });
                return html + tr;
            }, this), '');
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
            setTimeout(_.bind(function() {
                this.$tableContainer.scrollTop(this.$tableContainer.prop('scrollHeight'));
            }, this), 10);
        }

    });

    return HistoryView;

});

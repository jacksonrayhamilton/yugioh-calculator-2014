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

        getEventDescription: function (event) {
            switch (event.name) {
                case 'lifePointsChanged':
                    if (event.roperand >= 0) {
                        return event.loperand + ' + ' + event.roperand + ' = ' + event.result;
                    } else {
                        return event.loperand + ' - ' + (event.roperand * -1) + ' = ' + event.result;
                    }
                    break;
                case 'lifePointsReset':
                    var previousValues = _.reduce(event.lifePoints, _.bind(function (arr, data) {
                        arr.push(this.getDisplayName(data.playerId) + ': ' + data.lifePoints);
                        return arr;
                    }, this), []).join('; ');
                    return 'Life points reset (' + previousValues + ').';
                case 'timerRestarted':
                    return 'Timer restarted (previous start time: ' + TimeFormatter.getTimestamp(event.startTime) + ').';
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

define(['backbone'],
function (Backbone) {

    'use strict';

    /**
     * Visual representation of a player.
     */
    var PlayerView = Backbone.View.extend({

        initialize: function () {
            this.$lifePoints = this.$el.find('.yc-life-points');
            this.$tapHint = this.$el.find('.yc-tap-hint-content');
            this.listenTo(this.model, 'change:lifePoints revert:lifePoints', this.renderLifePoints);
            this.listenTo(this.model, 'change:selected', this.renderSelected);
            this.render();
        },

        render: function () {
            this.renderLifePoints();
            this.renderSelected();
        },

        renderLifePoints: function () {
            this.$lifePoints.html(this.model.get('lifePoints'));
            return this;
        },

        renderSelected: function () {
            if (this.model.get('selected')) {
                this.$el.addClass('yc-selected-life-points');
                this.$tapHint.html('Selected');
            } else {
                this.$el.removeClass('yc-selected-life-points');
                this.$tapHint.html('');
            }
            return this;
        },

        events: {
            click: function () {
                this.model.select();
            }
        }

    });

    return PlayerView;

});

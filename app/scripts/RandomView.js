define(['SubView', 'Random', 'Analytics'],
function (SubView, Random, Analytics) {

    'use strict';

    var RandomView = SubView.extend({

        initialize: function() {
            this.rollTimeout = null;
            this.flipTimeout = null;
            this.$lastRoll = this.$el.find('.yc-last-roll');
            this.$lastFlip = this.$el.find('.yc-last-flip');
            this.listenTo(this.model, 'change:lastRoll', this.renderLastRoll);
            this.listenTo(this.model, 'change:lastFlip', this.renderLastFlip);
            this.render();
        },

        render: function() {
            //this.$lastRoll.html(this.model.get('lastRoll'));
            //this.$lastFlip.html(Random.getFlipFace(this.model.get('lastFlip')));
        },

        // Shows a result in the given element, also shakes it to indicate a change
        renderResult: function($el, result, timeout) {
            clearTimeout(timeout);
            $el.html(result).addClass('yc-shake');
            return setTimeout(function () {
                $el.removeClass('yc-shake');
            }, 800);
        },

        renderLastRoll: function() {
            this.rollTimeout = this.renderResult(this.$lastRoll,
                                                 this.model.get('lastRoll'),
                                                 this.rollTimeout);
        },

        renderLastFlip: function() {
            this.flipTimeout = this.renderResult(this.$lastFlip,
                                                 Random.getFlipFace(this.model.get('lastFlip')),
                                                 this.flipTimeout);
        },

        events: {
            'click .yc-roll': function() {
                Analytics.event('Random', 'Roll Die');
                this.model.roll();
            },
            'click .yc-flip': function() {
                Analytics.event('Random', 'Flip Coin');
                this.model.flip();
            }
        },

        show: function () {
            this.$lastRoll.html('');
            this.$lastFlip.html('');
            this.$el.show();
        }

    });

    return RandomView;

});

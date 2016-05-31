define(['jquery', 'backbone', './Analytics'],
function ($, Backbone, Analytics) {

    'use strict';

    var BlackWindowView = Backbone.View.extend({

        initialize: function (options) {
            this.subViews = options.subViews;
        },

        events: {
            'click .yc-window-exit-button': function () {
                this.hide();
            }
        },

        show: function (subView) {
            var subViewCaps = subView.substring(0, 1).toUpperCase() + subView.substring(1);
            Analytics.event(subViewCaps, 'Show ' + subViewCaps);
            var theSubView = this.subViews[subView];
            theSubView.show();
            this.model.set('visibleSubView', subView);
            this.$el.show();
            $(window).trigger('resize'); // Hack to get resizing scripts to kick in.
        },

        hide: function() {
            this.$el.hide();
            this.subViews[this.model.get('visibleSubView')].hide();
        }

    });

    return BlackWindowView;

});

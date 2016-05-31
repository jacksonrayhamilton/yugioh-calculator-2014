define(['./SubView', './Analytics'],
function (SubView, Analytics) {

    'use strict';

    var NotesView = SubView.extend({

        initialize: function () {
            this.$content = this.$el.find('.yc-notes');
            this.listenTo(this.model, 'clear unclear', this.render);
            this.render();
        },

        events: {
            'blur .yc-notes': function () {
                Analytics.event('Notes', 'Wrote Notes');
            },
            'keyup .yc-notes': function () {
                this.model.set('content', this.$content.val());
            },
            'click .yc-notes-clear-button': function () {
                Analytics.event('Notes', 'Cleared Notes');
                this.model.clear();
            }
        },

        render: function () {
            this.$content.val(this.model.get('content'));
        }

    });

    return NotesView;

});

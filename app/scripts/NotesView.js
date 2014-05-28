define(['./SubView'],
function (SubView) {

    'use strict';

    var NotesView = SubView.extend({

        initialize: function () {
            this.$content = this.$el.find('.yc-notes');
            this.listenTo(this.model, 'clear', this.render);
            this.render();
        },

        events: {
            'keyup .yc-notes': function () {
                this.model.set('content', this.$content.val());
            },
            'click .yc-notes-clear-button': function () {
                this.model.clear();
            }
        },

        render: function () {
            this.$content.val(this.model.get('content'));
        }

    });

    return NotesView;

});

define(['./PersistentModel'],
function (PersistentModel) {

    'use strict';

    var Notes = PersistentModel.extend({

        defaults: function() {
            return {
                content: ''
            };
        },

        clear: function() {
            this.set(this.defaults());
            this.trigger('clear');
        }

    });

    return Notes;

});

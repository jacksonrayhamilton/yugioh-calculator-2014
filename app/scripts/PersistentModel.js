define(['backbone'],
function (Backbone) {

    'use strict';

    var prefix = 'yc-';

    /**
     * Allows for persisting/restoring the state of Models through localStorage.
     * Restores a Model on instantiation. Persists it on change.
     * Optionally, override initialize() to watch for specific changes.
     * Also offers some utility methods.
     */
    var PersistentModel = Backbone.Model.extend({

        initialize: function() {
            this.restore();
            this.on('change', this.persist);
        },

        persist: function() {
            localStorage.setItem(prefix + this.id, JSON.stringify(this.toJSON()));
        },

        restore: function() {
            var attributes = localStorage.getItem(prefix + this.id);
            if (attributes) {
                this.set(JSON.parse(attributes));
            }
        }

    });

    return PersistentModel;

});

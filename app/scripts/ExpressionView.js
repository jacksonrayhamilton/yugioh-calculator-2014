define(['backbone', 'underscore', './Operand', './OperandView', './Operator', './OperatorView'],
function (Backbone, _, Operand, OperandView, Operator, OperatorView) {

    'use strict';

    /**
     * Representation of the number in the current operation being performed.
     */
    var ExpressionView = Backbone.View.extend({

        initialize: function() {
            this.listenTo(this.model, 'change', this.render);
            this.render();
        },

        getDisplayedValue: function() {
            var itemsIndex = this.model.get('index');
            return _.reduce(this.model.get('items'), function (previous, current, index) {
                var view;
                if (current instanceof Operand) {
                    view = new OperandView({
                        model: current
                    });
                } else if (current instanceof Operator) {
                    view = new OperatorView({
                        model: current
                    });
                }
                return previous + view.getDisplayedValue(index === itemsIndex);
            }, '');
        },

        render: function() {
            this.$el.html(this.getDisplayedValue());
        }

    });

    return ExpressionView;

});

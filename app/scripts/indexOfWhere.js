define(['underscore'],
function (_) {

    'use strict';

    function indexOfWhere(array, item) {
        var result = -1;
        var matchesItem = _.matches(item);
        _.some(array, function (value, index) {
            if (matchesItem(value)) {
                result = index;
                return true;
            }
        });
        return result;
    }

    return indexOfWhere;

});

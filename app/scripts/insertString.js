/**
 * Inserts a string into a target string, replacing characters in the string up
 * to the length of the inserted string. (Works like the INSERT key.) Also, it
 * always replaces at least 1 character.
 */
define(function () {
    return function (target, string, index) {
        // Length should always be treated as at least 1
        var length = (string.length > 0) ? string.length : 1;
        return target.substring(0, index) + string + target.substring(index + length);
    };
});

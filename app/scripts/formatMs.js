define(function () {

    'use strict';

    /**
     * Formats milliseconds as "00:00" (MINS:SECS).
     */
    var formatMs = function (ms) {
        ms = Math.round(ms / 1000) * 1000;
        var seconds = Math.floor(ms / 1000) % 60;
        var minutes = Math.floor(ms / 60000);
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return minutes + ':' + seconds;
    };

    return formatMs;

});

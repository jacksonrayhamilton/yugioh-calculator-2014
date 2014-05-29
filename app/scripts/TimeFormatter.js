define(function () {

    'use strict';

    /**
     * Pads a 2-digit number with a leading zero, if needed.
     */
    function pad(number) {
        return number < 10 ? '0' + number : '' + number;
    }

    /**
     * Gets a timestamp in the format "hh:mm:ss A".
     */
    function getTimestamp(ms) {
        var date = typeof ms === 'undefined' ? new Date() : new Date(ms);
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var period;
        if (hours < 12) {
            if (hours === 0) {
                hours = 12;
            }
            period = 'AM';
        } else {
            if (hours > 12) {
                hours -= 12;
            }
            period = 'PM';
        }
        return [pad(hours), pad(minutes), pad(seconds)].join(':') + ' ' + period;
    }

    /**
     * Formats milliseconds as "00:00" (MINS:SECS).
     */
    function formatMs(ms) {
        // Round to make for a more-accurate end result.
        ms = Math.round(ms / 1000) * 1000;
        var seconds = Math.floor(ms / 1000) % 60;
        var minutes = Math.floor(ms / 60000);
        return pad(minutes) + ':' + pad(seconds);
    }

    return {
        getTimestamp: getTimestamp,
        formatMs: formatMs
    };

});

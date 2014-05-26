define(function () {

    'use strict';

    function pad(number) {
        return number < 10 ? '0' + number : '' + number;
    }

    function getTimestamp() {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var ret = [pad(hours), pad(minutes), pad(seconds)].join(':');
        ret += ' ' + (hours < 12 ? 'AM' : 'PM');
        return ret;
    }

    return getTimestamp;

});

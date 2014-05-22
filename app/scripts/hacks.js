/*global define*/
define(['jquery', 'fittext'], function ($) {
'use strict';
$(function () {

    $('.yc-life-points').fitText({
        compression: 0.9,
        dimension: 'height',
        lineHeight: true,
        ratio: 1 / 3
    });

    $('.yc-operand').fitText({
        compression: 0.8,
        dimension: 'height',
        lineHeight: true,
        ratio: 1
    });

    $('.yc-button').fitText({
        compression: 0.85,
        dimension: 'height',
        lineHeight: true,
        ratio: 1
    });

    $('.yc-timer').fitText({
        compression: 0.75,
        dimension: 'height',
        lineHeight: true,
        ratio: 1 / 2,
        shrinkRate: 1.5
    });

});
});

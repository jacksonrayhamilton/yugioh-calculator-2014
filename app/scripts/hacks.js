/*global define*/
define(['jquery', 'fittext', 'domready!'], function ($) {
    'use strict';

    $('.yc-quantity').fitText(0.14, {
        dimension: 'height'
    });

    $('.yc-button').fitText(0.15, {
        dimension: 'height'
    });

    $('.yc-timer').fitText(0.14, {
        dimension: 'height'
    });
});

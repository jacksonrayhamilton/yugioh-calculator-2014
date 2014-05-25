/**
 * Sets up texts to automatically fit to their containers.
 */
define(['jquery', 'fittext'], function ($) {

    'use strict';

    return function () {

        $('.yc-life-points').fitText({
            compression: 0.95,
            dimension: 'height',
            lineHeight: true,
            ratio: 1 / 3
        });

        $('.yc-tap-hint').fitText({
            compression: 0.15,
            dimension: 'height'
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
            compression: 0.8,
            dimension: 'height',
            lineHeight: true,
            ratio: 1 / 2,
            shrinkRate: 1.5
        });

    };

});

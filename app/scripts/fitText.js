/**
 * Sets up texts to automatically fit to their containers.
 */
define(['jquery', 'fittext'],
function ($) {

    'use strict';

    return function () {

        $('.yc-life-points').fitText({
            compression: 0.95,
            dimension: 'height',
            lineHeight: true,
            ratio: 1 / 3,
            shrinkRate: 2
        });

        $('.yc-tap-hint').fitText({
            compression: 0.15,
            dimension: 'height'
        });

        $('.yc-expression').fitText({
            compression: 0.8,
            dimension: 'height',
            lineHeight: true,
            ratio: 1
        });

        $('.yc-main-button').fitText({
            compression: 0.85,
            dimension: 'height',
            lineHeight: true,
            ratio: 1
        });

        $('.yc-window-exit-button').fitText({
            compression: 0.85,
            dimension: 'height',
            lineHeight: true,
            ratio: 1
        });

        $('.yc-notes-clear-button').fitText({
            compression: 0.85,
            dimension: 'height',
            lineHeight: true,
            ratio: 1 / 3
        });

        $('.yc-notes').fitText({
            compression: 0.1,
            dimension: 'height',
            container: $('.yc-notes-container')
            // lineHeight: function ($element) {
            //     return ($element.height() * 0.1) + 'px';
            // }
        });

        $('.yc-timer-display').fitText({
            compression: 0.8,
            dimension: 'height',
            lineHeight: true,
            ratio: 1 / 2,
            shrinkRate: 1.5
        });

    };

});

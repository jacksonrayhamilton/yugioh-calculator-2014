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
            dimension: 'height'
        });

        $('.yc-history-table-container').fitText({
            compression: 0.04,
            dimension: 'height'
        });

        $('.yc-random-button').fitText({
            compression: 0.85,
            dimension: 'height',
            lineHeight: true,
            ratio: 1
        });

        $('.yc-last-roll').fitText({
            compression: 0.9,
            dimension: 'height',
            lineHeight: true
        });

        $('.yc-last-flip').fitText({
            compression: 0.35,
            dimension: 'height',
            lineHeight: true,
            ratio: 1,
            shrinkRate: 1.5
        });

        $('.yc-timer-display').fitText({
            compression: 0.8,
            dimension: 'height',
            lineHeight: true,
            ratio: 1 / 2,
            shrinkRate: 1.5
        });

        $('.yc-window-title').fitText({
            compression: 0.8,
            dimension: 'height',
            lineHeight: true
        });

        $('.yc-window-text').fitText({
            compression: 0.05,
            dimension: 'height'
        });

    };

});

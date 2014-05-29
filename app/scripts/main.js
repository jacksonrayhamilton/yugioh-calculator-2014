require.config({
    paths: {
        jquery: '/bower_components/jquery/dist/jquery',
        fittext: '/bower_components/FitText.js/jquery.fittext',
        underscore: '/bower_components/underscore/underscore',
        backbone: '/bower_components/backbone/backbone',
        fastclick: '/bower_components/fastclick/lib/fastclick'
    },
    shim: {
        fittext: {
            deps: ['jquery', 'underscore']
        }
    }
});

/**
 * Kickstart the application when the DOM is ready.
 */
define(['jquery', './App'],
function($, App) {

    'use strict';

    $(function () {
        try {
            new App();
        } catch (error) {
            console.error(error);
        }
    });

});

define(['jquery'],
function ($) {

    'use strict';

    function resizeNotesGradient() {

        var $notes = $('.yc-notes');
        var $notesContainer = $('.yc-notes-container');

        function setBackgroundImage() {
            var height = $notesContainer.height();
            var start = (height * 0.095) + 'px';
            var end = (height * 0.10) + 'px';
            var color = '#000';
            var backgroundColor = '#FFFEDE';
            var cssArgs = ['to bottom',
                           backgroundColor,
                           backgroundColor + ' ' + start,
                           color + ' ' + start,
                           color + ' ' + end].join(',');
            $notes.css('background-image', 'repeating-linear-gradient(' + cssArgs + ')');
        }

        // http://stackoverflow.com/a/6263537/1468130
        $notes.on('focus', function () {
            $notes.data('before', $notes.html());
        }).on('blur keyup paste input', function () {
            if ($notes.data('before') !== $notes.html()) {
                $notes.data('before', $notes.html());
                $notes.trigger('change');
            }
        }).on('change', setBackgroundImage);

        $(window).on('resize orientationchange', setBackgroundImage);

        // Call once initially.
        setBackgroundImage();

    }

    return resizeNotesGradient;

});

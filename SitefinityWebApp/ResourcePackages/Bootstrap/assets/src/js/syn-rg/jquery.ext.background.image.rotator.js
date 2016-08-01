/* jQuery Background Images Rotarot plugin
 * Copyright (c) 2016 O C Synnes - Syn-RG
 * Version 1.0 (20-06-2016)
 * Requires jQuery 1.8.3 or later
 * Add $(#elementId).fn.rotateBackgroundImages() in on document ready
 * 
 * Include the folloing CSS:

#slideshow {
    display:block !important;
    z-index: 0;
    height: 100%;
    width: 100%;
    max-width: 100%;
    max-height:100%;
    position:fixed;
    overflow:hidden;
}

#slideshow img {
    position: absolute;
    top: -9999px;
    bottom: -9999px;
    left: -9999px;
    right: -9999px;
    margin: auto;
    min-width:100%;
    min-height:100%;
    z-index:8;
}

#slideshow img.active {
    z-index:10;
}

#slideshow img.last-active {
    z-index:9;
}
*/
; (function ($, undefined) {
    "use strict";
    
    $.fn.rotateBackgroundImages = function (options) {
        var bgImages = $(this).data('bg-images');
        for (var i=0; i < bgImages.length; i++) {
            $(this).append('<img src="' + bgImages[i].url + '" class="bg-image"/>');
        }
        $('#' + $(this).attr("id") + ' img:first-child').addClass('active');

        $.fn.rotateBackgroundImages.settings = $.extend({
            selector: '#' + $(this).attr("id"),
            displayTime: 6000,
            transitionTime: 2000
        }, options);
        window.setInterval($.fn.rotateBackgroundImages.slideSwitch, $.fn.rotateBackgroundImages.settings.displayTime);
    }
    $.fn.rotateBackgroundImages.slideSwitch = function () {
        var selector = $.fn.rotateBackgroundImages.settings.selector;
        var $active = $(selector + ' img.active');
        if ($active.length === 0) $active = $(selector + ' img:last-child');
        var $next = $active.next().length ? $active.next()
            : $(selector + ' img:first-child');
        $active.addClass('last-active');

        $next.css({ opacity: 0.0 })
            .addClass('active')
            .animate({ opacity: 1.0 }, $.fn.rotateBackgroundImages.settings.transitionTime, function () {
                $active.removeClass('active last-active');
            });
    }
    $.fn.rotateBackgroundImages.settings;
})(jQuery);
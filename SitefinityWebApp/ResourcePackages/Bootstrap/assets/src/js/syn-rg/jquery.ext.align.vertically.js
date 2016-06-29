/* jQuery Vertically Align elements to body plugin
 * Copyright (c) 2016 O C Synnes - Syn-RG
 * Version 1.1 (26-06-2016)
 * Requires jQuery 1.8.3 or later
 * Applies to all elements with class "aling-vertically-center"
 * Add $.fn.alignVertically() in on resize
 */
; (function ($, undefined) {
    "use strict";
    
    $.fn.alignVertically = function (devideFactor, applyMarginAlsoToBottom) {
        if(!devideFactor)
            devideFactor = 2;
        $('.aling-vertically-center').each(function () {
            $(this).css('margin-top', '');
            var minMargin = parseInt( $(this).css('margin-top').replace('px', ''));
            $(this).css('margin-top', 0);
            var marginTop = ($(window).height() - $(this).height()) / devideFactor;
            marginTop -= $(this).offset().top;
            $(this).css('margin-top', (marginTop > minMargin) ? marginTop : '');
            if (applyMarginAlsoToBottom)
                $(this).css('margin-bottom', (marginTop > minMargin) ? marginTop : '');
        });
    }
})(jQuery);
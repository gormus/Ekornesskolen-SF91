/* jQuery Even Heights of elements / childrem plugin
 * Copyright (c) 2016 O C Synnes - Syn-RG
 * Version 1.0 (20-06-2016)
 * Requires jQuery 1.8.3 or later
 * Add $.fn.synrg.evenHeights(?selector) or element.evenHeights(?selector) in on resize
 */
; (function ($, undefined) {
    "use strict";
    
    $.fn.evenHeights = function (selector, breakpoint) {
        if (!breakpoint)
            breakpoint = 768;
        var parent = null;
        if (selector)
            parent = $(this).find('.' + selector).first();
        if (!parent)
            parent = $('.' + selector).first();
        if (parent.children().length) {
            $(parent).children().each(function () {
                $(this).height('auto');
            });
            if ($(window).width() > breakpoint) {
                var cHeight = 0;
                parent.children().each(function () {
                    if (cHeight < $(this).height())
                        cHeight = $(this).height();
                });
            }
            parent.children().each(function () {
                $(this).height(cHeight);
            });
        }
    }
})(jQuery);
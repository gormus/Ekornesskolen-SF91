/* jQuery Sticky Header plugin
 * Copyright (c) 2016 O C Synnes - Syn-RG
 * Version 1.0 (20-06-2016)
 * Requires jQuery 1.8.3 or later
 * Use $(element).stickMe(options) on header to activate
 
Customizing
topOffset
int	topOffset: 300	Header will become sticky when the body is scrolled down by 300 pixels

shadow
boolean	shadow: true	Header will have shadow when it becomes sticky

shadowOpacity
float	shadowOpacity: 0.5	This sets the opacity of shadow that header gets when it's sticky

animate
boolean	animate: true	This brings header into display smoothly

transitionStyle
string	transitionStyle: 'fade'	Transition style for header when it becomes sticky 'fade' 'slide'

triggetAtCenter
boolean	triggerAtCenter: false	By default header becomes sticky when it reaches the center of viewport, setting it to false will make header sticky just when header is scrolled out of the viewport

stickyAlready
boolean	stickyAlready: true	Makes header sticky when page loads

transitionDuration
int	transitionDuration: 1000	Transition duration of animation

*  ### Using events: ####
* $(document).ready(function () {
*     $('.site-header').on('sticky-begin', function () {
*         console.log("Began");
*     });

*     $('.site-header').on('sticking', function () {
*         console.log("Sticking");
*     });

*     $('.site-header').on('top-reached', function () {
*         console.log("Top reached");
*     });

*     $('.site-header').on('bottom-reached', function () {
*         console.log("Bottom reached");
*     });
* })
*/

; (function ($) {
    "use strict";
    
    $.fn.stickMe = function (options) {
        //  Assigning variables
        var $window = $(window),
            $document = $(document),
            $elemTopOffset,
            $body = $('body'),
            position = 0,
            $elem = $(this),
            $elemHeight = $elem.innerHeight(),
            $win_center = $window.height() / 2,
            $pos,
            settings = $.extend({
                transitionDuration: 300,
                shadow: false,
                shadowOpacity: 0.3,
                animate: true,
                triggerAtCenter: true,
                topOffset: $elemHeight,
                transitionStyle: 'fade',
                stickyAlready: false
            }, options);

        //  Initial state
        $elem
            .addClass('stick-me')
            .addClass('not-sticking');
        switch (settings.triggerAtCenter) {
            case (settings.triggerAtCenter && settings.topOffset < $elemHeight) || (settings.triggerAtCenter && settings.topOffset > $elemHeight):
                settings.triggerAtCenter = false;
                break;
        }
        if (settings.stickyAlready) {
            settings.triggerAtCenter = false;
            settings.topOffset = 0;
            stick();
        }

        $elemTopOffset = $elem.offset().top;

        function $elem_slide() {
            if (settings.animate === true && settings.transitionStyle === 'slide' && settings.stickyAlready !== true) {
                $elem.slideDown(settings.transitionDuration);
            }
            if (settings.animate === true && settings.transitionStyle === 'fade' && settings.stickyAlready !== true) {
                $elem.fadeIn(settings.transitionDuration);
            } else {
                $elem.show();
            }
            $elem.removeClass('not-sticking');
        }

        function stick() {
            $elem
                .addClass('sticking')
                .css('position', 'fixed')
                .css('top', '0');
            if ($elem.hasClass('sticking')) {
                $elem.trigger('sticking');
            }
            if (position === 0) {
                position = 1;
                if (settings.stickyAlready === false) {
                    $elem.trigger('sticky-begin');
                }
            }
            if ($elem.hasClass('not-sticking')) {
                $elem.hide();
                $elem_slide();
            }
            if (settings.shadow === true) {
                $elem.css('box-shadow', '0px 1px 2px rgba(0,0,0,' + settings.shadowOpacity + ')');
            }
            $body.css('padding-top', $elemHeight);
        }

        function unstick() {
            if (settings.animate === true && settings.stickyAlready !== true) {
                if (settings.shadow === true) {
                    $elem.animate({ 'box-shadow': 'none' }, settings.transitionDuration);
                }
                $elem
                    .show()
                    .switchClass('sticking', 'not-sticking', settings.transitionDuration)
                    .css('position', 'relative');
            }
            else {
                if (settings.shadow === true) {
                    $elem.css('box-shadow', 'none');
                }
                $elem.addClass('not-sticking')
                    .removeClass('sticking')
                    .show()
                    .css('position', 'relative');
            }
            $body.css('padding-top', '0');
        }
        $window.scroll(function () {
            $pos = $window.scrollTop();
            if ($pos === 0) {
                position = 0;
                $elem.trigger('top-reached');
            }
            if (settings.triggerAtCenter === true) {
                if ($pos > $win_center + $elemHeight) {
                    stick();
                }
            }
            if (settings.triggerAtCenter === false) {
                if ($pos > settings.topOffset) {
                    stick();
                }
            }
            if ($pos + $window.height() > $document.height() - 1) {
                $elem.trigger('bottom-reached');
            }
            if (settings.triggerAtCenter === true) {
                if ($pos < (1 + $elemTopOffset)) {
                    unstick();
                }
            }
            if (settings.triggerAtCenter === false) {
                if ($pos < 1) {
                    if (settings.stickyAlready !== true) {
                        unstick();
                    }
                }
            }
        });
        return this;
    };
})(jQuery);
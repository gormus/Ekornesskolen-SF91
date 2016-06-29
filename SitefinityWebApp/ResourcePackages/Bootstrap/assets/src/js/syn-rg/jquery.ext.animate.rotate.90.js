/* jQuery Expandable rotate 90 degrees plugin
 * Copyright (c) 2016 O C Synnes - Syn-RG
 * Version 1.0 (20-06-2016)
 * Requires jQuery 1.8.3 or later
 */
$.fn.animateRotate90 = function (duration, easing, complete) {
    return this.each(function () {
        var obj = $(this);
        var matrix = obj.css("-webkit-transform") ||
            obj.css("-moz-transform") ||
            obj.css("-ms-transform") ||
            obj.css("-o-transform") ||
            obj.css("transform");
        if (matrix !== 'none') {
            var values = matrix.split('(')[1].split(')')[0].split(',');
            var a = values[0];
            var b = values[1];
            var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
        } else {
            var angle = 0;
        }
        var degree = (angle < 0) ? angle + 360 : angle;

        $({ deg: degree }).animate({ deg: (degree === 0) ? -90 : 360 }, {
            duration: duration,
            easing: easing,
            step: function (now) {
                obj.css({
                    transform: 'rotate(' + now + 'deg)'
                });
            },
            complete: complete || $.noop
        });
    });
};
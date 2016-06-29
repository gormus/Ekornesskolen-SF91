/* jQuery Expandable Two Level Menu plugin
 * Users AnimateCss for effects & transitions
 * Copyright (c) 2016 O C Synnes - Syn-RG
 * Version 1.0 (20-06-2016)
 * Requires jQuery 1.9.2 or later
 * Requires jQuery Easing
 */

; (function ($, undefined) {
    "use strict";

    var ver = '1.2';

    // ## Activate
    $.fn.menuTwoLevelExp = function () {
        $.fn.menuTwoLevelExp.defaults.menuToggle = $(this);
        $.fn.menuTwoLevelExp.defaults.menuWrapper = $('#' + $.fn.menuTwoLevelExp.defaults.menuToggle.data('target'));

        // # Override defaults
        $.fn.menuTwoLevelExp.overrideDefaults();

        // # Init
        // initially hide level 2 when not active
        $.fn.menuTwoLevelExp.defaults.menuWrapper.children('ul').first().children().not('.active').each(function () {
            $(this).children('ul').hide();
        });
        // initial visibility
        if ($.fn.menuTwoLevelExp.defaults.menuVisible)
            $.fn.menuTwoLevelExp.defaults.menuWrapper.show();

        // # Bind click events
        // bind menu-toggle
        $.fn.menuTwoLevelExp.defaults.menuToggle.unbind('click').click(function () {
            $.fn.menuTwoLevelExp.toggleMenu();
        });
        // bind menu-close
        $('.' + $.fn.menuTwoLevelExp.defaults.menuCloseClass).each(function () {
            $(this).unbind('click').click(function () {
                $.fn.menuTwoLevelExp.toggleMenu();
            });
        });
        // bind menu close on outside click
        $(document).mouseup(function (e) {
            if ($.fn.menuTwoLevelExp.defaults.menuVisible
                && !$.fn.menuTwoLevelExp.defaults.menuWrapper.is(e.target)
                && !$.fn.menuTwoLevelExp.defaults.menuWrapper.has(e.target).length
                && !$.fn.menuTwoLevelExp.defaults.menuToggle.is(e.target)
                && !$.fn.menuTwoLevelExp.defaults.menuToggle.has(e.target).length )
                $.fn.menuTwoLevelExp.toggleMenu();
        });
        // bind level1 events & set animation
        $.fn.menuTwoLevelExp.defaults.menuWrapper.children('ul').first().children().each(function () {

            $(this).find('a').each(function () {
                if ($(this).attr('href') === '#')
                    $(this).attr('href', 'javascript:void(0);');
                if ($(this).parent().hasClass('active') && $(this).parent().children().length > 1)
                    $(this).parent().addClass('expanded');
                if ($.fn.menuTwoLevelExp.defaults.subMenuAnimateCaret === 'rotate' && $(this).parent().hasClass('expanded'))
                    $(this).children('.' + $.fn.menuTwoLevelExp.defaults.subMenuCaretClass).first().css({ transform: 'rotate(-90deg)' });
                if ($.fn.menuTwoLevelExp.defaults.subMenuAnimateCaret === 'change' && $(this).parent().hasClass('expanded'))
                    $(this).children('.' + $.fn.menuTwoLevelExp.defaults.subMenuCaretClass).first()
                        .removeClass($.fn.menuTwoLevelExp.defaults.subMenuCaretClosedClass)
                        .addClass($.fn.menuTwoLevelExp.defaults.subMenuCaretOpenedClass);

                // bind click events
                $(this).unbind('click').click(function (event) {
                    // close already opened submenu
                    var showOnlyOneSubMenu = ($.fn.menuTwoLevelExp.defaults.showOnlyOneSubMenu && $(this).parent().parent().find('li.expanded').first().children('a').first().text() !== $(this).parent().children('a').first().text()); 
                    if (showOnlyOneSubMenu) {
                        $(this).parent().parent().find('li.expanded').first().find('ul.level2').slideToggle($.fn.menuTwoLevelExp.defaults.subMenuToggleSpeed, $.fn.menuTwoLevelExp.defaults.subMenuToggleEasing);
                        // animations
                        if ($.fn.menuTwoLevelExp.defaults.subMenuAnimateCaret === 'rotate')
                            $.fn.menuTwoLevelExp.animateRotate($(this).parent().parent().find('li.expanded').first().find('a'));
                        if ($.fn.menuTwoLevelExp.defaults.subMenuAnimateCaret === 'change')
                            $.fn.menuTwoLevelExp.animateChange($(this).parent().parent().find('li.expanded').first().find('a'));
                    }
                    // set & remove expanded
                    if (showOnlyOneSubMenu)
                        $(this).parent().parent().find('li.expanded').first().removeClass('expanded');
                    $(this).parent().toggleClass('expanded');
                    // toggle menu
                    $(this).parent().children('ul').first().slideToggle($.fn.menuTwoLevelExp.defaults.subMenuToggleSpeed, $.fn.menuTwoLevelExp.defaults.subMenuToggleEasing);
                    // animations
                    if ($.fn.menuTwoLevelExp.defaults.subMenuAnimateCaret === 'rotate')
                        $.fn.menuTwoLevelExp.animateRotate(this);
                    if ($.fn.menuTwoLevelExp.defaults.subMenuAnimateCaret === 'change')
                        $.fn.menuTwoLevelExp.animateChange(this);
                });
            });
        });

    };

    // ## Functions
    $.fn.menuTwoLevelExp.toggleMenu = function () {
        // kill ongoing animation
        $.fn.menuTwoLevelExp.defaults.menuWrapper
            .removeClass('animated')
            .removeClass($.fn.menuTwoLevelExp.defaults.menuShow)
            .removeClass($.fn.menuTwoLevelExp.defaults.menuHide);
        // show menu
        if (!$.fn.menuTwoLevelExp.defaults.menuVisible) {
            $.fn.menuTwoLevelExp.defaults.menuWrapper
                .show()
                .addClass('animated')
                .addClass($.fn.menuTwoLevelExp.defaults.menuShow);
            $.fn.menuTwoLevelExp.defaults.menuWrapper.one($.fn.menuTwoLevelExp.animationEnd, function () {
                $.fn.menuTwoLevelExp.defaults.menuWrapper
                    .removeClass('animated')
                    .removeClass($.fn.menuTwoLevelExp.defaults.menuShow);
            });
        }
        // hide menu
        else {
            $.fn.menuTwoLevelExp.defaults.menuWrapper
                .addClass('animated')
                .addClass($.fn.menuTwoLevelExp.defaults.menuHide);
            $.fn.menuTwoLevelExp.defaults.menuWrapper.one($.fn.menuTwoLevelExp.animationEnd, function () {
                $.fn.menuTwoLevelExp.defaults.menuWrapper
                    .removeClass('animated')
                    .removeClass($.fn.menuTwoLevelExp.defaults.menuHide)
                    .hide();
            });
        }
        $.fn.menuTwoLevelExp.defaults.menuVisible = !$.fn.menuTwoLevelExp.defaults.menuVisible;
    }
    $.fn.menuTwoLevelExp.animateRotate = function (obj) {
        $(obj).children('.' + $.fn.menuTwoLevelExp.defaults.subMenuCaretClass).first().animateRotate90($.fn.menuTwoLevelExp.defaults.subMenuToggleSpeed, $.fn.menuTwoLevelExp.defaults.subMenuToggleEasing);
    }
    $.fn.menuTwoLevelExp.animateChange = function (obj) {
        if ($(obj).children('.' + $.fn.menuTwoLevelExp.defaults.subMenuCaretClass).first().hasClass($.fn.menuTwoLevelExp.defaults.subMenuCaretClosedClass))
            $(obj).children('.' + $.fn.menuTwoLevelExp.defaults.subMenuCaretClass).first()
                .removeClass($.fn.menuTwoLevelExp.defaults.subMenuCaretClosedClass)
                .addClass($.fn.menuTwoLevelExp.defaults.subMenuCaretOpenedClass);
        else
            $(obj).children('.' + $.fn.menuTwoLevelExp.defaults.subMenuCaretClass).first()
                .removeClass($.fn.menuTwoLevelExp.defaults.subMenuCaretOpenedClass)
                .addClass($.fn.menuTwoLevelExp.defaults.subMenuCaretClosedClass)
    }

    $.fn.menuTwoLevelExp.overrideDefaults = function () {
        // initial menu visibility
        if ($.fn.menuTwoLevelExp.defaults.menuToggle.data('menu-visible'))
            $.fn.menuTwoLevelExp.defaults.menuVisible = $.fn.menuTwoLevelExp.defaults.menuToggle.data('menu-visible');
        // menu close buttons class
        if ($.fn.menuTwoLevelExp.defaults.menuToggle.data('menu-close-class'))
            $.fn.menuTwoLevelExp.defaults.menuCloseClass = $.fn.menuTwoLevelExp.defaults.menuToggle.data('menu-close-class');
        // menu 1st level class
        if ($.fn.menuTwoLevelExp.defaults.menuToggle.data('menu-level1-class'))
            $.fn.menuTwoLevelExp.defaults.menuLevel1Class = $.fn.menuTwoLevelExp.defaults.menuToggle.data('menu-level1-class');
        // menu 2nd level class
        if ($.fn.menuTwoLevelExp.defaults.menuToggle.data('menu-level2-class'))
            $.fn.menuTwoLevelExp.defaults.menuLevel2Class = $.fn.menuTwoLevelExp.defaults.menuToggle.data('menu-level2-class');
        // menu show animation
        if ($.fn.menuTwoLevelExp.defaults.menuToggle.data('menu-show'))
            $.fn.menuTwoLevelExp.defaults.menuShow = $.fn.menuTwoLevelExp.defaults.menuToggle.data('menu-show');
        // menu hide animation
        if ($.fn.menuTwoLevelExp.defaults.menuToggle.data('menu-hide'))
            $.fn.menuTwoLevelExp.defaults.menuHide = $.fn.menuTwoLevelExp.defaults.menuToggle.data('menu-hide');
        // submenu toggle speed
        if ($.fn.menuTwoLevelExp.defaults.menuToggle.data('submenu-toggle-speed'))
            $.fn.menuTwoLevelExp.defaults.subMenuToggleSpeed = parseint($.fn.menuTwoLevelExp.defaults.menuToggle.data('submenu-toggle-speed'));
        // submenu toggle easing
        if ($.fn.menuTwoLevelExp.defaults.menuToggle.data('submenu-toggle-easing'))
            $.fn.menuTwoLevelExp.defaults.subMenuHide = $.fn.menuTwoLevelExp.defaults.menuToggle.data('submenu-toggle-easing');
        // submenu caret class
        if ($.fn.menuTwoLevelExp.defaults.menuToggle.data('submenu-caret-class'))
            $.fn.menuTwoLevelExp.defaults.subMenuCaretClass = $.fn.menuTwoLevelExp.defaults.menuToggle.data('submenu-caret-class');
        // submenu animate caret
        if ($.fn.menuTwoLevelExp.defaults.menuToggle.data('submenu-animate-caret'))
            $.fn.menuTwoLevelExp.defaults.subMenuAnimateCaret = $.fn.menuTwoLevelExp.defaults.menuToggle.data('submenu-animate-caret');
        // submenu caret closed class
        if ($.fn.menuTwoLevelExp.defaults.menuToggle.data('submenu-caret-closed-class'))
            $.fn.menuTwoLevelExp.defaults.subMenuCaretClosedClass = $.fn.menuTwoLevelExp.defaults.menuToggle.data('submenu-caret-closed-class');
        // submenu caret opened class
        if ($.fn.menuTwoLevelExp.defaults.menuToggle.data('submenu-caret-opened-class'))
            $.fn.menuTwoLevelExp.defaults.subMenuCaretOpenedClass = $.fn.menuTwoLevelExp.defaults.menuToggle.data('submenu-caret-opened-class');
        // show only one submenu at the time
        if ($.fn.menuTwoLevelExp.defaults.menuToggle.attr('data-show-only-one-submenu'))
            $.fn.menuTwoLevelExp.defaults.showOnlyOneSubMenu = $.fn.menuTwoLevelExp.defaults.menuToggle.data('show-only-one-submenu');
    }
    // ## Variables, properties & defaults
    $.fn.menuTwoLevelExp.defaults = {
        menuToggle: null,
        menuWrapper: null,
        menuVisible: false,
        menuCloseClass: 'menu-close',
        menuLevel1Class: 'level1',
        menuLevel2Class: 'level2',
        menuShow: 'fadeIn',
        menuHide: 'fadeOut',
        subMenuToggleSpeed: 400,
        subMenuToggleEasing: 'easeOutCirc',
        subMenuAnimateCaret: 'rotate',
        subMenuCaretClass: 'fa',
        subMenuCaretClosedClass: '',
        subMenuCaretOpenedClass: '',
        showOnlyOneSubMenu: true,
    }
    $.fn.menuTwoLevelExp.version = ver;

    // ## Constants
    $.fn.menuTwoLevelExp.animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

})(jQuery);

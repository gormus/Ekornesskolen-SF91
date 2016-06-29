/* jQuery extension for presentations
 * Copyright (c) 2016 O C Synnes - Syn-RG
 * Version 1.0 (26-06-2016)
 * Requires jQuery 1.8.3 or later
 */
; (function ($, undefined) {
    "use strict";

    $.fn.presentation = function ($, undefined) { };

    $.fn.presentation.currentPresentation = { slides: [] };
    
    $.fn.presentation.addCurrentToMyPresentation = function (remove) {
        if (remove) {
            $.each($.fn.presentation.currentPresentation.slides, function (i, slide) {
                if (slide && slide.url && slide.url === decodeURIComponent(self.location.pathname)) {
                    $.fn.presentation.currentPresentation.slides.splice(i, 1);
                }
            });
        }
        else{
            var page = $.fn.presentation.getCurrentPageByUrl(decodeURIComponent(self.location.pathname));
            if (page) {
                $.fn.presentation.currentPresentation.slides.push({ 'title': page.title, 'parentTitle': (page.parentTitle ? page.parentTitle : 'The Ekornes School'), 'url': page.url });
            }
        }
        $.fn.presentation.persistCurrentReport();
    };

    $.fn.presentation.getCurrentPageByUrl = function (url) {
        var $currentUrl = decodeURIComponent(url);
        var $currentPage;
        if (availablePages) {
            $.each(availablePages.rootPages, function (i, page) {
                if (page.url === $currentUrl) {
                    $currentPage = page;
                    return false;
                }
                else {
                    $.each(page.subPages, function (i, subpage) {
                        if (subpage.url === $currentUrl) {
                            $currentPage = subpage;
                            return false;
                        }
                    });
                    if ($currentPage)
                        return false;
                }
            });
            return $currentPage;
        }
        else
            log('Presentation requires avaiablePages enabled in navigation widget!');
    };

    $.fn.presentation.persistCurrentReport = function () {
        $.fn.presentation.updateGui();
        $.cookie('currentPresentation', JSON.stringify($.fn.presentation.currentPresentation), { expires: 365, path: '/' });
    };

    $.fn.presentation.loadCurrentReport = function () {
        $.fn.presentation.currentPresentation = JSON.parse($.cookie('currentPresentation'));
    };

    $.fn.presentation.bindPages = function () {
        $.each($.fn.presentation.currentPresentation.slides, function (i, slide) {
            if (slide && decodeURIComponent(self.location.pathname) === slide.url) {
                $('.my-presentation-add').first().toggleClass('unselect');
                $('.my-presentation-add').first().children().first()
                    .toggleClass('fa-minus-circle')
                    .toggleClass('fa-plus-circle');
                $('.my-presentation-add').first().find('span.value').text('Remove from my presentation');
            }
        });
        $('.my-presentation-add').each(function () {
            $(this).unbind('click').click(function () {
                var remove = $(this).hasClass('unselect');
                $(this).presentation.addCurrentToMyPresentation(remove);
                $(this).toggleClass('unselect');
                $(this).children().first()
                    .toggleClass('fa-minus-circle')
                    .toggleClass('fa-plus-circle');
                $(this).find('span.value').text(!remove ? 'Remove from my presentation' : 'Add to my presentation');
            });
        });
        $('.my-presentation-empty').each(function () {
            $(this).unbind('click').click(function () {
                $.fn.presentation.currentPresentation = { slides: [] };
                $.fn.presentation.persistCurrentReport();
                $('#my-presentation-editor').html('');
            });
        });
        $('.my-presentation-add-all').each(function () {
            $(this).unbind('click').click(function () {
                $.fn.presentation.currentPresentation = { slides: [] };
                $.each(availablePages.rootPages, function (i, page) {
                    $.fn.presentation.currentPresentation.slides.push({ 'title': page.title, 'parentTitle': 'The Ekornes School', 'url': page.url });
                    $.each(page.subPages, function (y, subpage) {
                        $.fn.presentation.currentPresentation.slides.push({ 'title': subpage.title, 'parentTitle': subpage.parentTitle, 'url': subpage.url });
                    });
                });
                $.fn.presentation.persistCurrentReport();
                $.fn.presentation.createEditor();
            });
        });
        $.fn.presentation.updateGui();

        $('.show-presentation').each(function () {
            $(this).unbind('click').click(function () {
                $.fn.presentation.showPresentation();
            });
        });
    };
    $.fn.presentation.updateGui = function () {
        var $topMenuItem = $('#my-presentation span.text').first();
        var $topMenuItemBadge = $topMenuItem.find('span.badge');
        if($topMenuItemBadge.length)
            $topMenuItemBadge.text($.fn.presentation.currentPresentation.slides.length);
        else
            $topMenuItem.append('<span class="badge">' + $.fn.presentation.currentPresentation.slides.length + '</span>');
        if ($.fn.presentation.currentPresentation.slides.length === 0)
            $topMenuItemBadge.hide();
        else
            $topMenuItemBadge.fadeIn(300).fadeOut(300).fadeIn(300).fadeOut(300).fadeIn(300).fadeOut(300).fadeIn(300);
    };
    $.fn.presentation.createEditor = function () {
        var $editor = $('#my-presentation-editor');
        $editor.html('');
        $.each($.fn.presentation.currentPresentation.slides, function (i, slide) {
            switch (slide.url) {
                case '/the-ekornes-group/the-factories':
                    $editor.append('<div id="{1}" data-ordinal="{3}" class="col-xs-4 col-md-3 my-presentation-slide"><div class="slide" style="background-color:#fff;background-image:url(/images/default-source/Dummies/the-factories.tmb-lg.png)"><div class="remove-page" title="Remove page"><span class="pe-7s pe-7s-close"></span></div></div>');
                    break;
                case '/the-ekornes-group/the-key-figures':
                    $editor.append('<div id="{1}" data-ordinal="{3}" class="col-xs-4 col-md-3 my-presentation-slide"><div class="slide" style="background-color:#fff;background-image:url(/images/default-source/Dummies/the-key-figures.tmb-lg.png)"><div class="remove-page" title="Remove page"><span class="pe-7s pe-7s-close"></span></div></div>');
                    break;
                case '/the-stressless-features/balanceadapt':
                    $editor.append('<div id="{1}" data-ordinal="{3}" class="col-xs-4 col-md-3 my-presentation-slide"><div class="slide" style="background-color:#fff;background-image:url(/images/default-source/Dummies/balance-adapt.tmb-lg.png)"><div class="remove-page" title="Remove page"><span class="pe-7s pe-7s-close"></span></div></div>');
                    break;
                default:
                    $editor.append(String.format('<div id="{1}" data-ordinal="{3}" class="col-xs-4 col-md-3 my-presentation-slide"><div class="slide"><div class="remove-page" title="{4}"><span class="pe-7s pe-7s-close"></span></div><div class="slide-content"><small>{2}</small>{0}<small>(slide no: {3})</small></div></span></div></div>', slide.title, slide.url, slide.parentTitle, i + 1, 'Remove page'));
                    break;
            }
        });
        $('#my-presentation-editor').children().each(function () {
            $(this).find('div.remove-page').first().unbind('click').click(function () {
                var $remove = $(this).parent().parent();
                var $removeUrl = $remove.attr('id')
                $.each($.fn.presentation.currentPresentation.slides, function (i, slide) {
                    if (slide && slide.url === $removeUrl) {
                        $.fn.presentation.currentPresentation.slides.splice(i, 1);
                    }
                });
                $.fn.presentation.persistCurrentReport();
                $remove.remove();
            });
        });
        $('#my-presentation-editor').sortable({
            placeholder: 'col-xs-4 col-md-3 my-presentation-slide fill',
            forcePlaceholderSize: true
        }).bind('sortupdate', function (e, ui) { });
    };

    //$(element).setPrevNext() to activate
    $.fn.presentation.setPrevNext = function () {
        var $currentUrl = decodeURIComponent(self.location.pathname);
        var $prevPage;
        var $nextPage;
        var $pageDetected = false;

        if (availablePages) {
            $.each(availablePages.rootPages, function (i, page) {
                if (page.url === $currentUrl) {
                    $pageDetected = true;
                    $prevPage = availablePages.rootPages[i - 1];
                    $nextPage = availablePages.rootPages[i + 1];
                    if ($prevPage && $prevPage.subPages.length) {
                        $prevPage = $prevPage.subPages[$prevPage.subPages.length - 1];
                    }
                    if ($nextPage && $nextPage.subPages.length) {
                        $nextPage = $nextPage.subPages[0];
                    }
                }
                else {
                    $.each(page.subPages, function (i, subpage) {
                        if (subpage.url === $currentUrl) {
                            $pageDetected = true;
                            $prevPage = page.subPages[i - 1];
                            $nextPage = page.subPages[i + 1];
                        }
                    });
                }
                if (!$prevPage) {
                    $prevPage = availablePages.rootPages[i - 1];
                    if ($prevPage && $prevPage.subPages.length) {
                        $prevPage = $prevPage.subPages[$prevPage.subPages.length - 1];
                    }
                }
                if (!$nextPage) {
                    $nextPage = availablePages.rootPages[i + 1];
                    if ($nextPage && $nextPage.subPages.length) {
                        $nextPage = $nextPage.subPages[0];
                    }
                }
                if ($pageDetected)
                    return false;
            });
            if ($prevPage) {
                $('#prevLink').attr('href', $prevPage.url);
                $('#prevLink').html('<div class="pe-7s pe-7s-angle-left"></div><span class="subject">' + ($prevPage.parentTitle ? $prevPage.parentTitle : 'The Ekornes School') + ':</span><br/><span class="title">' + $prevPage.title + "</span>");
            }
            else {
                $('#prevLink').hide();
            }
            if ($nextPage) {
                $('#nextLink').attr('href', $nextPage.url);
                $('#nextLink').html('<div class="pe-7s pe-7s-angle-right"></div><span class="subject">' + ($nextPage.parentTitle ? $nextPage.parentTitle : 'The Ekornes School') + ':</span><br/><span class="title">' + $nextPage.title + '</span>');
            }
            else {
                $('#nextLink').hide();
            }
            $('#prev-next').animate({ 'opacity': 1 }, 600);
        }
        else {
            log('Presentation requires avaiablePages enabled in navigation widget!')
        }
    };

    // Presentation
    $.fn.presentation.showPresentation = function () {
        var $carouselIndicatiors = '';
        var $carouselItems = '';
        $.each($.fn.presentation.currentPresentation.slides, function (i, slide) {
            $carouselIndicatiors += String.format('<li data-target="#carousel-es" data-slide-to="{0}"{1}></li>', i, ((i === 0) ? ' class="active"' : ''));
            switch (slide.url) {
                case '/the-ekornes-group/the-factories':
                    $carouselItems += '<div class="item' + ((i === 0) ? ' active' : '') + '">'
                        + '<img src="/images/default-source/Dummies/the-factories.tmb-lg.png" />'
                        + '<div class="carousel-caption">'
                        + '<h3>' + slide.parentTitle + '</h3>'
                        + '<h1>' + slide.title + '</h1>'
                        + '</div>'
                        + '</div>';
                    break;
                case '/the-ekornes-group/the-key-figures':
                    $carouselItems += '<div class="item' + ((i === 0) ? ' active' : '') + '">'
                        + '<img src="/images/default-source/Dummies/the-key-figures.tmb-lg.png" />'
                        + '<div class="carousel-caption">'
                        + '<h3>' + slide.parentTitle + '</h3>'
                        + '<h1>' + slide.title + '</h1>'
                        + '</div>'
                        + '</div>';
                    break;
                case '/the-stressless-features/balanceadapt':
                    $carouselItems += '<div class="item' + ((i === 0) ? ' active' : '') + '">'
                        + '<img src="/images/default-source/Dummies/balance-adapt.tmb-lg.png" />'
                        + '<div class="carousel-caption">'
                        + '<h3>' + slide.parentTitle + '</h3>'
                        + '<h1>' + slide.title + '</h1>'
                        + '</div>'
                        + '</div>';
                    break;
                default:
                    $carouselItems += '<div class="item' + ((i === 0) ? ' active' : '') + '">'
                        + '<div class="carousel-caption">'
                        + '<h3>' + slide.parentTitle + '</h3>'
                        + '<h1>' + slide.title + '</h1>'
                        + '</div>'
                        + '</div>';
                    break;
            }
        });

        $('#PublicWrapper').prepend('<div id="popup">'
                + '<div class="slide-header" title="Ekornes">'
                + '<div id="close" title="Close presentation"><span class="pe-7s pe-7s-close"></span></div>'
                + '<div id="full-screen" title="Present in full screen"><span class="pe-7s pe-7s-expand1"></span></div>'
                + '</div>'
                + '<div id="carousel-es" class="carousel slide" data-ride="carousel">'
                + '<ol id="carousel-indicators" class="carousel-indicators">'
                + $carouselIndicatiors
                + '</ol>'
                + '<div class="carousel-inner" role="listbox">'
                + $carouselItems
                + '</div>'
                + '<a class="left carousel-control" href="#carousel-es" role="button" data-slide="prev">'
                + '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>'
                + '<span class="sr-only">Previous</span>'
                + '</a>'
                + '<a class="right carousel-control" href="#carousel-es" role="button" data-slide="next">'
                + '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>'
                + '<span class="sr-only">Next</span>'
                + '</a>'
                + '</div>'
                + '</div>');
        $('#carousel-es').carousel({ interval: 7000, keyboard: true, wrap: true });
        if($('#carousel-es div.item').first().hasClass('white'))
            $('#popup').css({ 'background-color': '#fff' });

        $('a.right.carousel-control').first().focus();
        $('#popup').show().fadeTo(700, 1);
        $('#close').unbind("click").click(function () {
            $('#popup').fadeOut(700, function () { $(this).hide(); });
        });
        $('#full-screen').unbind("click").click(function () {
            $('#popup').toggleFullScreen();
            $('#full-screen').children().first().toggleClass('pe-7s-expand1').toggleClass('pe-7s-close-circle');
        });
        $(document).bind('keyup', function (e) {
            if (e.keyCode == 39) {
                $('a.carousel-control.right').trigger('click');
            }
            else if (e.keyCode == 37) {
                $('a.carousel-control.left').trigger('click');
            }

        });
    }


})(jQuery);
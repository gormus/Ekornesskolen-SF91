/* jQuery extension for presentations
 * Copyright (c) 2016 O C Synnes - Syn-RG
 * Version 1.0 (26-06-2016)
 * Requires jQuery 1.8.3 or later
 */
; (function ($, undefined) {
    "use strict";

    $.fn.presentation = function($, undefined) {};

    // Properties
    $.fn.presentation.currentPresentation = { slides: [], customSlides: [] };
    $.fn.presentation.currentCustomSlide = null;

    // Init
    $.fn.presentation.init = function () {
        // For testing purposes only
        //localStorage.clear();

        if (typeof (Storage) !== "undefined") {
            // Code for localStorage/sessionStorage.

            if (!localStorage.currentPresentation) {
                $.fn.presentation.persistCurrentPresentation();
            }
            else {
                $.fn.presentation.loadCurrentPresentation();
            }
            log('Local storage enabled...');
        } else {
            // Sorry! No Web Storage support..
            log('Sorry! This web browser does not support local storage, and cannot be used for this application!',
                true);
        }
    };

    // Doers
    $.fn.presentation.addToMyPresentation = function (type, url, remove) {
        if (remove) {
            switch (type) {
                case 'master':
                    var master = $.fn.presentation.getCurrentPageByUrl(url);
                    if (master) {
                        $.each(master.subPages, function (i, subPage) {
                            $.each($.fn.presentation.currentPresentation.slides, function (i, slide) {
                                if (slide && slide.url && slide.url === subPage.url) {
                                    $.fn.presentation.currentPresentation.slides.splice(i, 1);
                                }
                            });
                        });
                    }
                default:
                    $.each($.fn.presentation.currentPresentation.slides, function (i, slide) {
                        if (slide && slide.url && slide.url === url) {
                            $.fn.presentation.currentPresentation.slides.splice(i, 1);
                        }
                    });
            }
        }
        else{
            var page = $.fn.presentation.getCurrentPageByUrl(url);
            if (page) {
                switch (type) {
                    case 'master':
                        var master = $.fn.presentation.getCurrentPageByUrl(url);
                        if (master) {
                            $.each(master.subPages, function (i, subPage) {
                                var add = true;
                                $.each($.fn.presentation.currentPresentation.slides, function (i, slide) {
                                    if (slide && slide.url && slide.url === subPage.url) {
                                        add = false;
                                    }
                                });
                                if(add)
                                    $.fn.presentation.currentPresentation.slides.push({ 'title': subPage.title, 'parentTitle': (subPage.parentTitle ? subPage.parentTitle : 'The Ekornes School'), 'parentUrl': (subPage.parentUrl ? subPage.parentUrl : null), 'url': subPage.url, 'ordinal': subPage.ordinal, 'type': subPage.type });
                            });
                        }
                    default:
                        $.fn.presentation.currentPresentation.slides.push({ 'title': page.title, 'parentTitle': (page.parentTitle ? page.parentTitle : 'The Ekornes School'), 'parentUrl': (page.parentUrl ? page.parentUrl : null), 'url': page.url, 'ordinal': page.ordinal, 'type': type });
                }
            }
        }
        $.fn.presentation.persistCurrentPresentation();
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

    $.fn.presentation.persistCurrentPresentation = function () {
        $.fn.presentation.bindPages();
        localStorage.currentPresentation = JSON.stringify($.fn.presentation.currentPresentation);
        log(JSON.stringify($.fn.presentation.currentPresentation));
    };

    $.fn.presentation.loadCurrentPresentation = function () {
        $.fn.presentation.currentPresentation = JSON.parse(localStorage.currentPresentation);
        $.each($.fn.presentation.currentPresentation.customSlides, function (i, customSlide) {
            $.fn.presentation.currentPresentation.customSlides[i] = $.extend({}, $.fn.presentation.customSlide(), customSlide);
        });
    };

    $.fn.presentation.bindPages = function () {
        var allUrls = '';
        $.each($.fn.presentation.currentPresentation.slides, function (i, slide) {
            allUrls += '"' + slide.url + '"';
        });
        $('.my-presentation-add').each(function () {
            if (allUrls.indexOf('"' + $(this).data('slide-url') + '"') !== -1) {
                $(this).attr('title', 'Remove from my presentation');
                $(this).addClass('unselect');
                $(this).children().first()
                    .addClass('fa-check-square-o')
                    .removeClass('fa-square-o');
            } else {
                $(this).attr('title', 'Add to my presentation');
                $(this).removeClass('unselect');
                $(this).children().first()
                    .removeClass('fa-check-square-o')
                    .addClass('fa-square-o');
            }
            // Bind events
            $(this).unbind('click').click(function () {
                var remove = $(this).hasClass('unselect');
                $(this).presentation.addToMyPresentation($(this).data('slide-type'), $(this).data('slide-url'), remove);
                $(this).toggleClass('unselect');
                $(this).attr('title', !remove ? 'Remove from my presentation' : 'Add to my presentation');
                $.fn.presentation.bindPages();
                $.fn.presentation.createList();
            });
            $('.custom-slide-tmb').each(function () {
                $(this).unbind('click').click(function () {
                    $.fn.presentation.currentCustomSlide = $.fn.presentation.customSlide();
                    $.fn.presentation.currentCustomSlide.type = $(this).data('custom-slide-type');
                    $('#my-presentation-editor').html(
                        $.fn.presentation.currentCustomSlide.toHtml() +
                        '<p class="text-right"><input id="add-custom-slide" class="button add" type="button" value="Save changes & Add to presentation" /></p>'
                        );
                    var currentSlideElement = $('#my-presentation-editor').children().first();
                    currentSlideElement.height(currentSlideElement.width() / 16 * 9);
                    // Bind event
                    $('#add-custom-slide').unbind('click').click(function () {
                        $.fn.presentation.currentCustomSlide.persist();
                        $.fn.presentation.createList();
                    });
                });
            });
        });
        // Check children
        $('.my-presentation-add').each(function () {
            if ($(this).data('slide-type') === 'master') {
                var allChecked = true;
                var someChecked = false;
                $(this).parent().children('ul.level2').first().children('li').each(function () {
                    if (!$(this).children().first().hasClass('unselect'))
                        allChecked = false;
                    else {
                        someChecked = true;
                    }
                });
                if (allChecked) {
                    $(this).attr('title', 'Remove from my presentation');
                    $(this).addClass('unselect');
                    $(this)
                        .children()
                        .first()
                        .removeClass('partial')
                        .addClass('fa-check-square-o')
                        .removeClass('fa-square-o');
                } else {
                    if (someChecked) {
                        $(this).attr('title', 'Add to my presentation');
                        $(this).removeClass('unselect');
                        $(this)
                            .children()
                            .first()
                            .addClass('partial')
                            .addClass('fa-check-square-o')
                            .removeClass('fa-square-o');
                    }
                }
            }
        });
        $('.my-presentation-empty').each(function () {
            $(this).unbind('click').click(function () {
                if ($.fn.presentation.currentPresentation.slides.length) {
                    if (confirm('Are you sure you want to delete this presentation?')) {
                        $.fn.presentation.currentPresentation = { slides: [], customSlides: [] };
                        $.fn.presentation.persistCurrentPresentation();
                        $('#my-presentation-list').html('');
                    }
                }
            });
        });
        $('.show-presentation').each(function () {
            $(this).unbind('click').click(function () {
                $.fn.presentation.showPresentation();
            });
        });
    };

    $.fn.presentation.createList = function () {
        // Create ordinals (default sorting)
        if (availablePages.rootPages[0].ordinal === undefined) {
            var c = 0;
            for (var i = 0; i < availablePages.rootPages.length; i++) {
                availablePages.rootPages[i].ordinal = c;
                c++;
                for (var ii = 0; ii < availablePages.rootPages[i].subPages.length; ii++) {
                    availablePages.rootPages[i].subPages[ii].ordinal = c;
                    c++;
                }
            }
        }
        var $list = $('#my-presentation-list');
        $list.html('');
        var guiOrdinal = 0;
        if ($.fn.presentation.currentPresentation.slides.length) {
            $.each($.fn.presentation.currentPresentation.slides.sort(sort_by('guiOrdinal', 'ordinal')),
                function(i, slide) {
                    $.each($.fn.presentation.currentPresentation.customSlides,
                        function(i, customSlide) {
                            if (customSlide.guiOrdinal === guiOrdinal) {
                                $list.append(customSlide.toListElement());
                                guiOrdinal++;
                            }
                        });
                    $list.append(String.format('<div id="{1}" data-gui-ordinal="{3}" class="col-xs-12 my-presentation-slide"><div class="slide"><div class="remove-page" title="{4}"><span class="pe-7s pe-7s-close"></span></div><div class="slide-content"><small>{2}</small>{0}<small>({4}: {3})</small></div></span></div></div>', slide.title, slide.url, slide.parentTitle, guiOrdinal, slide.type, 'Remove page'));
                    slide.guiOrdinal = guiOrdinal;
                    guiOrdinal++;
                });
        } else {
            $.each($.fn.presentation.currentPresentation.customSlides,
            function(i, customSlide) {
                customSlide.guiOrdinal = i;
                $list.append(customSlide.toListElement());
            });
            $.fn.presentation.persistCurrentPresentation();
        }
        $('#my-presentation-list').children().each(function () {
            $(this).find('div.remove-page').first().unbind('click').click(function () {
                var $remove = $(this).parent().parent();
                var $removeId = $remove.attr('id');
                $.each($.fn.presentation.currentPresentation.slides, function (i, slide) {
                    if (slide && slide.url === $removeId) {
                        $.fn.presentation.currentPresentation.slides.splice(i, 1);
                    }
                });
                $.each($.fn.presentation.currentPresentation.customSlides, function (i, customSlide) {
                    if (customSlide && customSlide.id === $removeId) {
                        $.fn.presentation.currentPresentation.customSlides.splice(i, 1);
                    }
                });
                $.fn.presentation.persistCurrentPresentation();
                $remove.remove();
            });
        });
        $('#my-presentation-list').sortable({
            placeholder: 'col-xs-12 my-presentation-slide fill',
            handle: '.slide.custom',
            forcePlaceholderSize: true
        }).bind('sortupdate', function (e, ui) {
            var newGuiOrdinal = 0;
            $('#my-presentation-list').children().each(function() {
                $(this).attr('data-gui-ordinal', newGuiOrdinal);
                $.each($.fn.presentation.currentPresentation.slides, function (i, slide) {
                    if (slide && slide.url ===  $(this).attr('id')) {
                       slide.guiOrdinal = newGuiOrdinal;
                    }
                });
                $.each($.fn.presentation.currentPresentation.customSlides, function (i, customSlide) {
                    if (customSlide && customSlide.id === $(this).attr('id')) {
                        customSlide.guiOrdinal = newGuiOrdinal;
                    }
                });
                newGuiOrdinal++;
            } );
            $.fn.presentation.persistCurrentPresentation();
        });
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
            log('Presentation requires avaiablePages enabled in navigation widget!');
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

    // Custom slide
    $.fn.presentation.customSlide = function (){
        return {
            type: '',
            id: guid(),
            guiOrdinal: 0,
            title: 'Title',
            subTitle: 'Sub title',
            text: 'Content text',
            imageUrl: '',
            videoUrl: '',
            toHtml: function() {
                switch (this.type) {
                case 'title':
                    return String
                        .format('<div id="edit-{0}" class="custom-slide title"><h1 contenteditable="true">{1}</h1><h2 contenteditable="true">{2}</h2><p>{0}</p></div>',
                            this.id,
                            this.title,
                            this.subTitle);
                default:
                    return this.type;
                }
            },
            toListElement: function() {
                return String
                    .format('<div id="{1}" data-gui-ordinal="{3}" class="col-xs-12 my-presentation-slide"><div class="slide custom"><div class="remove-page" title="{4}"><span class="pe-7s pe-7s-close"></span></div><div class="slide-content">{0}<small>{2}</small><small>({4}: {3})</small></div></span></div></div>', this.title, this.id, this.subTitle, this.guiOrdinal, 'custom ' + this.type, 'Remove page');
            },
            persist: function () {
                switch (this.type) {
                case 'title':
                    var element = $('#edit-' + this.id);
                    this.title = element.find('h1').first().text();
                    this.subTitle = element.find('h2').first().text();
                default:
                    var add = true;
                    var thisId = this.id;
                    $.each($.fn.presentation.currentPresentation.customSlides,
                        function(i, customSlide) {
                            log(thisId);
                            log(customSlide.id);
                            if (customSlide.id === thisId) {
                                add = false;
                            }
                        });
                    log(add);
                    if (add) {
                        $.fn.presentation.currentPresentation.customSlides.push(this);
                    }
                    $.fn.presentation.persistCurrentPresentation();
                }
            }
        }
    };
})(jQuery);
var dropdownSelectors = $('.dropdown, .dropup');

// Custom function to read dropdown data
// =========================
function dropdownEffectData(target) {
    // @todo - page level global?
    var effectInDefault = null,
        effectOutDefault = null;
    var dropdown = $(target),
        dropdownMenu = $('.dropdown-menu', target);
    var parentUl = dropdown.parents('ul.nav');

    // If parent is ul.nav allow global effect settings
    if (parentUl.size() > 0) {
        effectInDefault = parentUl.data('dropdown-in') || null;
        effectOutDefault = parentUl.data('dropdown-out') || null;
    }

    return {
        target: target,
        dropdown: dropdown,
        dropdownMenu: dropdownMenu,
        effectIn: dropdownMenu.data('dropdown-in') || effectInDefault,
        effectOut: dropdownMenu.data('dropdown-out') || effectOutDefault,
    };
}
// Custom function to read navbar data
// =========================
function navbarEffectData(target) {
    var effectInDefault = null,
        effectOutDefault = null;
    var navbar = $(target),
        navbarNav = $('.navbar-nav', target);

    return {
        target: target,
        navbar: navbar,
        navbarNav: navbarNav,
        effectIn: navbar.data('collapse-in'),
        effectOut: navbar.data('collapse-out'),
    };
}


// Custom function to start dropdown effect (in or out)
// =========================
function dropdownEffectStart(data, effectToStart) {
    if (effectToStart) {
        data.dropdown.addClass('dropdown-animating');
        data.dropdownMenu.addClass('animated');
        data.dropdownMenu.addClass(effectToStart);
    }
}
// Custom function to start collapse effect (in or out)
// =========================
function navbarEffectStart(data, effectToStart) {
    if (effectToStart) {
        data.navbar.addClass('dropdown-animating');
        data.navbarNav.addClass('animated');
        data.navbarNav.addClass(effectToStart);
    }
}

// Custom function to read when dropdown animation is over
// =========================
function dropdownEffectEnd(data, callbackFunc) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    data.dropdown.one(animationEnd, function () {
        data.dropdown.removeClass('dropdown-animating');
        data.dropdownMenu.removeClass('animated');
        data.dropdownMenu.removeClass(data.effectIn);
        data.dropdownMenu.removeClass(data.effectOut);

        // Custom callback option, used to remove open class in out effect
        if (typeof callbackFunc == 'function') {
            callbackFunc();
        }
    });
}
// Custom function to read when navbar animation is over
// =========================
function navbarEffectEnd(data, callbackFunc) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    data.navbar.one(animationEnd, function () {
        data.navbar.removeClass('dropdown-animating');
        data.navbarNav.removeClass('animated');
        data.navbarNav.removeClass(data.effectIn);
        data.navbarNav.removeClass(data.effectOut);

        // Custom callback option, used to remove open class in out effect
        if (typeof callbackFunc == 'function') {
            callbackFunc();
        }
    });
}

// Bootstrap API hooks
// =========================
$(window).load(function () {
    dropdownSelectors.on({
        "show.bs.dropdown": function () {
            // On show, start in effect
            var dropdown = dropdownEffectData(this);
            dropdownEffectStart(dropdown, dropdown.effectIn);
        },
        "shown.bs.dropdown": function () {
            // On shown, remove in effect once complete
            var dropdown = dropdownEffectData(this);
            if (dropdown.effectIn && dropdown.effectOut) {
                dropdownEffectEnd(dropdown, function () { });
            }
        },
        "hide.bs.dropdown": function (e) {
            // On hide, start out effect
            var dropdown = dropdownEffectData(this);
            if (dropdown.effectOut) {
                e.preventDefault();
                dropdownEffectStart(dropdown, dropdown.effectOut);
                dropdownEffectEnd(dropdown, function () {
                    dropdown.dropdown.removeClass('open');
                });
            }
        },
    });
    $('#main-menu').on({
        "show.bs.collapse": function () {
            // On show, start in effect
            var navbar = navbarEffectData(this);
            navbarEffectStart(navbar, navbar.effectIn);
        },
        "shown.bs.collapse": function () {
            // On shown, remove in effect once complete
            var navbar = navbarEffectData(this);
            if (navbar.effectIn && navbar.effectOut) {
                navbarEffectEnd(navbar, function () { });
            }
        },
        "hide.bs.collapse": function (e) {
            // On hide, start out effect
            var navbar = navbarEffectData(this);
            if (navbar.effectOut) {
                e.preventDefault();
                navbarEffectStart(navbar, navbar.effectOut);
                navbarEffectEnd(navbar, function () {
                    navbar.navbar.removeClass('in');
                });
            }
        }
    });
});
/*  Syn-RG Utilities */
// Console log
function log(message, alert) {
    if (window.location.host.indexOf('syn-rg.no') !== -1 || window.location.host.indexOf('localhost') !== -1)
        console.log(message);
    if (alert)
        alert(message);
}

// Failsafe
var docReadyRun = false;
var winLoadRun = false;
window.setTimeout(failSafe, 3000);
window.setTimeout(failSafe, 8000);
function failSafe() {
    if (!inEditMode) {
        if (!docReadyRun)
            onDocumentReadyInit();
        if (!winLoadRun)
            onWindowLoadInit();
        if (!docReadyRun || !winLoadRun)
            log('Failsafe ran');
    }
}

// Resize Event
var rsResizing;
var rsHiding = false;
window.onresize = function () {
    if (!inEditMode && !rsHiding) {
        rsHiding = true;
        $('#PublicWrapper').first().animate({ 'opacity': 0 }, 150);
    }
    window.clearTimeout(rsResizing);
    if (!inEditMode)
        rsResizing = window.setTimeout(onResize, 300);
};

// Document ready
var inEditMode = false;
$(document).ready(function () {
    // In edit mode?
    inEditMode = $('body').hasClass('sfPageEditor');
    if (!inEditMode)
        window.setTimeout(onDocumentReadyInit, 5);
});

// Run last always
$(window).load(function () {
    // In edit mode?
    inEditMode = $('body').hasClass('sfPageEditor');
    if (!inEditMode) {
        window.setTimeout(onWindowLoadInit, 5);
        log('jQuery version loaded: ' + $.fn.jquery);
        if ((typeof $().emulateTransitionEnd === 'function'))
            log('Boostrap 3 loaded');
        if ($.easing && $.easing.easeInOutQuad)
            log('jQuery Easing loaded');
        if (jQuery.ui)
            log('jQuery UI version loaded: ' + $.ui.version);
        if (jQuery.cookie)
            log('jQuery Cookie loaded');
        if (jQuery.fn.sortable)
            log('jQuery Sortable loaded');
        if ($.fn.animateRotate90)
            log('jQuery Animate Rotate 90 loaded');
        if ($.fn.menuTwoLevelExp)
            log('jQuery Expandable Two Level Menu version loaded: ' + $.fn.menuTwoLevelExp.version);
        if ($.fn.alignVertically)
            log('jQuery Vertically Align loaded');
        if ($.fn.evenHeights)
            log('jQuery Even Heights loaded');
        if ($.fn.stickMe)
            log('jQuery Sticky Header loaded');
        if ($.fn.rotateBackgroundImages)
            log('jQuery Background Image Rotator loaded');
        if ($.fn.presentation.currentPresentation)
            log('Syn-RG Presentation loaded');
        if (jQuery.fn["fullScreen"])
            log('jQuery Fullscreen plugin loaded');
        log('Startup scripts executed');
    }
    else {
        $('#PublicWrapper').first().css({ 'opacity': 1 });
        log('jQuery version loaded: ' + $.fn.jquery);
        if ((typeof $().emulateTransitionEnd === 'function'))
            log('Boostrap 3 loaded');
        log("Page is in edit mode, no project scripts are executed");
    }
});
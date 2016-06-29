// Main JS that runs on every page in project
// On Resize
function onResize() {
    // run first
    rsHiding = false;

    // Menu
    if ($('#MainMenu')) {
        var ul = $('#MainMenu').find('ul.main-menu').first();
        var right = ($(window).width() - ($('#MainMenuToggle').offset().left + $('#MainMenuToggle').outerWidth()));
        right = $(window).width() > 645 ? right - 15 : right;
        var height = $(window).height() - 105;
        var width = $(window).width() > 645 ? 633 : $(window).width() - 30;
        $('#MainMenu').css({ 'right': right, 'width': width });
        ul.css({ 'height': height });
    }

    // layout
    $.fn.alignVertically(2.1, true);

    // run last
    $('#PublicWrapper').first().animate({ 'opacity': 1 }, 300);
}

// On Document Ready
function onDocumentReadyInit() {
    docReadyRun = true;

    // My presentation cookie
    if (!$.cookie('currentPresentation')) {
        $.fn.presentation.persistCurrentReport();
    }
    else {
        $.fn.presentation.loadCurrentReport();
    }

    // run always
    onResize();

    // Presentation
    $.fn.presentation.bindPages()
    if ($('#prev-next').length)
        $('#prev-next').presentation.setPrevNext();
    if ($('#my-presentation-editor').length)
        $('#my-presentation-editor').presentation.createEditor();
}

// On Window Ready
function onWindowLoadInit() {
    winLoadRun = true;

    // Image rotator
    $('#Background').rotateBackgroundImages();

    // Menu init
    $('#MainMenuToggle').menuTwoLevelExp();

    // Sticy header
    $('.header-wrapper').first().stickMe({ transitionDuration: 600, triggerAtCenter: true, transitionStyle: 'slide' });
}


// ==UserScript==
// @name           MarkLocation
// @namespace      fluks
// @description    Mark and scroll to location on a page.
// @version        0.0.1
// @include        *
// @exclude        
// @author         fluks.github@gmail.com
// ==/UserScript==

const
    KEY_MARK = 'å',
    KEY_GOTO = 'ä',
    // Time window in ms after pressing a mark or goto key to register
    // a number key press.
    TIME_DELTA_KEY = 500;
var
    marks = [],
    markPressed = false,
    gotoPressed = false,
    markTimeout = undefined,
    gotoTimeout = undefined;

var clearMarkPressed = function() {
    markPressed = false;
    console.log('mark cleared: ' + markPressed);
};

var clearGotoPressed = function() {
    gotoPressed = false;
    console.log('goto cleared: ' + gotoPressed);
};

var keydownHandler = function(e) {
    if (e.key === KEY_MARK && e.ctrlKey) {
        console.log('mark pressed');

        window.clearTimeout(markTimeout);
        window.clearTimeout(gotoTimeout);
        gotoPressed = false;

        markPressed = true;
        markTimeout = window.setTimeout(clearMarkPressed, TIME_DELTA_KEY);
    }
    else if (e.key === KEY_GOTO && e.ctrlKey) {
        console.log('goto pressed');

        window.clearTimeout(markTimeout);
        window.clearTimeout(gotoTimeout);
        markPressed = false;

        gotoPressed = true;
        gotoTimeout = window.setTimeout(clearGotoPressed, TIME_DELTA_KEY);
    }
    else if ('1234567890'.includes(e.key)) {
        var i = parseInt(e.key);

        if (markPressed) {
            console.log('mark ' + i);

            window.clearTimeout(markTimeout);
            markPressed = false;

            marks[i] = { x: window.pageXOffset, y: window.pageYOffset };
        }
        else if (gotoPressed) {
            console.log('goto ' + i);

            window.clearTimeout(gotoTimeout);
            gotoPressed = false;

            var offsets = marks[i];
            if (offsets)
                window.scrollTo(offsets.x, offsets.y);
            else
                console.log('no mark set for index ' + i);
        }
    }
};

// Added true.
window.addEventListener('keydown', keydownHandler, true);

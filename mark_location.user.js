// ==UserScript==
// @name           MarkLocation
// @namespace      fluks
// @description    Mark and scroll to location on a page.
// @version        0.0.1
// @include        *
// @exclude        
// @author         fluks.github@gmail.com
// ==/UserScript==

/* Usage:
 *
 * Press ctrl + keyMark key to mark a position on a page and after that before
 * timeDeltaIndex ms, press a number where to store that position.
 *
 * To go to a saved positiion press ctrl + keyGoto key and a number where you
 * previously saved a position.
 *
 * Change keyMark, keyGoto and timeDeltaIndex values as you wish.
 */

var
    keyMark = 'å',
    keyGoto = 'ä',
    // Time window in ms after pressing a mark or goto key to register
    // a number key press.
    timeDeltaIndex = 500;
    marks = [],
    markPressed = false,
    gotoPressed = false,
    markTimeout = undefined,
    gotoTimeout = undefined;

var keydownHandler = function(e) {
    if (e.key === keyMark && e.ctrlKey) {
        window.clearTimeout(markTimeout);
        window.clearTimeout(gotoTimeout);
        gotoPressed = false;

        markPressed = true;
        markTimeout = window.setTimeout(function() {
            markPressed = false;
        }, timeDeltaIndex);
    }
    else if (e.key === keyGoto && e.ctrlKey) {
        window.clearTimeout(markTimeout);
        window.clearTimeout(gotoTimeout);
        markPressed = false;

        gotoPressed = true;
        gotoTimeout = window.setTimeout(function() {
            gotoPressed = false;
        }, timeDeltaIndex);
    }
    else if ('1234567890'.includes(e.key)) {
        var i = parseInt(e.key);

        if (markPressed) {
            window.clearTimeout(markTimeout);
            markPressed = false;

            marks[i] = { x: window.pageXOffset, y: window.pageYOffset };
        }
        else if (gotoPressed) {
            window.clearTimeout(gotoTimeout);
            gotoPressed = false;

            var offsets = marks[i];
            if (offsets)
                window.scrollTo(offsets.x, offsets.y);
        }
    }
};

window.addEventListener('keydown', keydownHandler);

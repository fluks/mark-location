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

/** Scroll window in a such way that the node's top is just under window's top.
 * @param {Node} node - The node to where the window is scrolled to.
 */
var scrollToNode = function(node) {
    if (!node) {
        console.log("Node is gone!");
        return;
    }

    var oldColor = node.style.backgroundColor;
    node.style.backgroundColor = 'red';
    window.setTimeout(function() {
        node.style.backgroundColor = oldColor;
    }, 2000);

    var nodeRect = node.getBoundingClientRect();
    window.scrollTo(0, nodeRect.top);
    // el.wrappedJSObject.scrollIntoView()

    /*console.log('about to scroll, node.top at ' + nodeRect.top);*/
    /*var scrollUpOrDown = nodeRect.top < 0 ? -1 : 1;*/
    /*var i = 0;*/
    /*var nodeTopLast = undefined;*/
    /*while ((nodeRect.top < 0 || nodeRect.top > 100) && i < 1000) {*/
    /*window.scrollBy(0, scrollUpOrDown * 10);*/
    /*if (nodeTopLast !== undefined && nodeTopLast === nodeRect.top) {*/
    /*console.log("node didn't move");*/
    /*break;*/
    /*}*/
    /*nodeTopLast = nodeRect.top;*/

    /*console.log('scrolling window ' + i + ' nth time, node.top at ' + nodeRect.top);*/
    /*++i;*/
    /*}*/
};

/** Find the topmost node which is visible in window. The top attribute of
 * the node's bounding rectangle(BR) must be <= window's BR.top and
 * the difference smallest of all nodes.
 * @return {Node} Topmost Node.
 */
var topmostNode = function() {
    // window.pageYOffset! Add handler to notice if window's size changes.
    var allNodes = document.getElementsByTagName('*');
    var windowBottom = window.innerHeight;

    for (var i = 0; i < allNodes.length; i++) {
        var node = allNodes[i];
        var nodeRect = node.getBoundingClientRect();
        if (nodeRect.top > 0 && nodeRect.top < 50) {
            console.log(node.nodeName + ': ' + nodeRect.top + ' ' + nodeRect.bottom);
            var oldColor = node.style.backgroundColor;
            node.style.backgroundColor = 'blue';
            window.setTimeout(function() {
                node.style.backgroundColor = oldColor;
            }, 2000);

            return node;
        }
    }
    console.log('No topmost node found');

    return null;
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

            marks[i] = topmostNode();
        }
        else if (gotoPressed) {
            console.log('goto ' + i);

            window.clearTimeout(gotoTimeout);
            gotoPressed = false;

            scrollToNode(marks[i]);
        }
    }
};

// Added true.
window.addEventListener('keydown', keydownHandler, true);

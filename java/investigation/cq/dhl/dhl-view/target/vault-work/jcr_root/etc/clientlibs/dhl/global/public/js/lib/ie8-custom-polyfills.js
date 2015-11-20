// getElementsByClassName polyfill
(function(){
    if (!Element.getElementsByClassName) {
        Element.prototype.getElementsByClassName = function (search) {
            var d = document,
                elements, pattern, i, results = [];
            if (d.querySelectorAll) { // IE8
                return d.querySelectorAll("." + search);
            }
            if (d.evaluate) { // IE6, IE7
                pattern = ".//*[contains(concat(' ', @class, ' '), ' " + search + " ')]";
                elements = d.evaluate(pattern, d, null, 0, null);
                while ((i = elements.iterateNext())) {
                    results.push(i);
                }
            } else {
                elements = d.getElementsByTagName("*");
                pattern = new RegExp("(^|\\s)" + search + "(\\s|$)");
                for (i = 0; i < elements.length; i++) {
                    if (pattern.test(elements[i].className)) {
                        results.push(elements[i]);
                    }
                }
            }
            return results;
        }
    }
})();

//AudioCheck polyfill
var createElement = document.createElement.bind(document);

document.createElement = function(element) {
    if (element === 'audio') {
        return {
            canPlayType: true
        };
    } else {
        return createElement(element);
    }
};

//currentTarget polyfill

/** EventTarget support */
(function() {
    if (document.addEventListener || !window.Element || !window.Event) { return; }

    var expando = "__events"; /* own property for storing listeners */
    var flag = "__immediateStopped"; /* stopImmediatePropagation flag */

    Event.prototype.NONE = Event.NONE = 0;
    Event.prototype.CAPTURING_PHASE = Event.CAPTURING_PHASE = 1;
    Event.prototype.AT_TARGET = Event.AT_TARGET = 2;
    Event.prototype.BUBBLING_PHASE = Event.BUBBLING_PHASE = 3;

    Event.prototype.preventDefault = function() { if (this.cancelable !== false) { this.returnValue = false; } }
    Event.prototype.stopPropagation = function() { this.cancelBubble = true; }
    Event.prototype.stopImmediatePropagation = function() { this[flag] = this.cancelBubble = true; }

    var decorate = function(e, listenerNode) { /* improve event properties */
        e.timeStamp = +new Date();
        if (!e.target) { e.target = e.srcElement || listenerNode; }
        e.pageX = e.clientX + document.documentElement.scrollLeft;
        e.pageY = e.clientY + document.documentElement.scrollTop;

        if (e.type == "mouseover") {
            e.relatedTarget = e.fromElement;
        } else if (e.type == "mouseout") {
            e.relatedTarget = e.toElement;
        } else {
            e.relatedTarget = null;
        }
        return e;
    }

    /**
     * @param {object[]} data
     * @param {function} listener
     * @param {bool} useCapture
     * @returns {number}
     */
    var indexOf = function(data, listener, useCapture) { /* return an index of an existing listener */
        for (var i=0;i<data.length;i++) {
            var item = data[i];
            if (item.useCapture == useCapture && item.listener == listener) { return i; }
        }
        return -1;
    }

    var fire = function(event, listener, currentTarget) {
        event.currentTarget = currentTarget;
        if (typeof(listener) == "function") {
            listener.call(currentTarget, event);
        } else {
            listener.handleEvent(event);
        }
    }

    var getAncestors = function(node) {
        var result = [];
        while (node.parentNode) {
            result.unshift(node.parentNode);
            node = node.parentNode;
        }
        return result;
    }

    /**
     * Run listeners on a nodelist
     * @param {Event} event
     * @param {node[]} nodes
     * @param {number} phase
     * @returns {bool} terminated?
     */
    var runListeners = function(event, nodes, phase) {
        event.eventPhase = phase;
        for (var i=0;i<nodes.length;i++) {
            var node = nodes[i];
            var listeners = [];
            var data = (node[expando] || {})[event.type] || [];

            for (var j=0;j<data.length;j++) { /* get list of relevant listeners */
                var item = data[j];
                if (item.useCapture && phase == Event.BUBBLING_PHASE) { continue; }
                if (!item.useCapture && phase == Event.CAPTURING_PHASE) { continue; }
                listeners.push(item.listener);
            }

            /* trick: use try-catch to gracefully handle failing listeners, but do not use it abundantly */
            j=0;
            while (j < listeners.length) {
                try {
                    while (j < listeners.length) {
                        var listener = listeners[j++];
                        fire(event, listener, node);
                        if (event[flag]) { return true; } /* stopped immediate propagation */
                    }
                } catch (e) {
                    //setTimeout(function() { throw e; }, 0);
                }
            }

            if (event.cancelBubble) { return true; } /* stopped propagation */
        }

        return false; /* propagation not stopped */
    }

    /**
     * The "real" event handler/processor. "this" is {Node} listenerNode.
     * @param {Event} event
     * @returns {boolean} Not cancelled?
     */
    var handler = function(event) {
        decorate(event, this);

        var ancestors = getAncestors(event.target);
        if (ancestors.length) { /* capture */
            if (runListeners(event, ancestors, Event.CAPTURING_PHASE)) { return event.returnValue; }
        }

        /* at target */
        if (runListeners(event, [event.target], Event.AT_TARGET)) { return event.returnValue; }

        if (ancestors.length && event.bubbles !== false) { /* bubble */
            ancestors.reverse();
            if (runListeners(event, ancestors, Event.BUBBLING_PHASE)) { return event.returnValue; }
        }

        event.stopPropagation && event.stopPropagation(); /* do not process natively */
        return event.returnValue;
    }

    var proto = {
        addEventListener: function(type, listener, useCapture) {
            var data = (this[expando] || {})[type] || [];
            var count = data.length;
            if (indexOf(data, listener, useCapture) > -1) { return; } /* already added */

            if (expando in this) {
                var storage = this[expando];
            } else {
                var storage = {
                    _handler: handler.bind(this)
                };
                this[expando] = storage;
            }
            if (!(type in storage)) { storage[type] = []; }
            storage[type].push({listener:listener, useCapture:useCapture});

            if (!count) { this.attachEvent("on"+type, storage._handler); } /* first: add native listener */
        },

        removeEventListener: function(type, listener, useCapture) {
            var data = (this[expando] || {})[type] || [];
            var index = indexOf(data, listener, useCapture);
            if (index == -1) { return; } /* not present */

            data.splice(index, 1);
            if (!data.length) { this.detachEvent("on"+type, this[expando]._handler); } /* last: remove native listener */
        },

        dispatchEvent: function(event) {
            event.returnValue = true;
            return handler.call(this, event);
        }
    }

    var todo = [Element, window.constructor, document.constructor];
    while (todo.length) {
        var parent = todo.pop();
        for (var p in proto) { parent.prototype[p] = proto[p]; }
    }
})();

// element.classList polyfill
// https://github.com/remy/polyfills/blob/master/classList.js

(function () {
    if (typeof window.Element === "undefined" || "classList" in document.documentElement) return;

    var prototype = Array.prototype,
        push = prototype.push,
        splice = prototype.splice,
        join = prototype.join;

    function DOMTokenList(el) {
      this.el = el;
      // The className needs to be trimmed and split on whitespace
      // to retrieve a list of classes.
      var classes = el.className.replace(/^\s+|\s+$/g,'').split(/\s+/);
      for (var i = 0; i < classes.length; i++) {
        push.call(this, classes[i]);
      }
    };

    DOMTokenList.prototype = {
      add: function(token) {
        if(this.contains(token)) return;
        push.call(this, token);
        this.el.className = this.toString();
      },
      contains: function(token) {
        return this.el.className.indexOf(token) != -1;
      },
      item: function(index) {
        return this[index] || null;
      },
      remove: function(token) {
        if (!this.contains(token)) return;
        for (var i = 0; i < this.length; i++) {
          if (this[i] == token) break;
        }
        splice.call(this, i, 1);
        this.el.className = this.toString();
      },
      toString: function() {
        return join.call(this, ' ');
      },
      toggle: function(token) {
        if (!this.contains(token)) {
          this.add(token);
        } else {
          this.remove(token);
        }

        return this.contains(token);
      }
    };

    window.DOMTokenList = DOMTokenList;

    function defineElementGetter (obj, prop, getter) {
        if (Object.defineProperty) {
            Object.defineProperty(obj, prop,{
                get : getter
            });
        } else {
            obj.__defineGetter__(prop, getter);
        }
    }

    defineElementGetter(Element.prototype, 'classList', function () {
      return new DOMTokenList(this);
    });

})();

// Custom polyfill for form field error messages made via CSS3 animations
// On focus: adding custom css class to form elements.
// On blur: removing it after a timeout.
(function() {
    var cfg = {
        selectors: ['input', 'textarea', 'select'],
        focusClass: 'lt-ie9-focus-timeout',
        focusTimeout: 2000
    };

    function isMatchingSelector(elem) {
        var result = false;
        for (var i = 0; i < cfg.selectors.length; i++) {
            if (elem.tagName.toUpperCase() === cfg.selectors[i].toUpperCase()) {
                result = true;
            }
        }
        return result;
    }

    function handleFocus(e) {
        var event = e || window.event,
        elem = event.srcElement;

        if (isMatchingSelector(elem)) {
            elem.classList.add(cfg.focusClass);
            if (!elem.onfocusout) {
                elem.onfocusout = function() {
                    setTimeout(function() {
                        elem.classList.remove(cfg.focusClass);
                    }, cfg.focusTimeout);
                };
            }
        }
    }

    document.onfocusin = handleFocus;

})();

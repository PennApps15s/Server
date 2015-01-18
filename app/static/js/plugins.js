// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.
/*jslint browser: true*/
/*jslint jquery: true*/

/*
 * jQuery Hotkeys Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Based upon the plugin by Tzury Bar Yochay:
 * http://github.com/tzuryby/hotkeys
 *
 * Original idea by:
 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
 */

/*
 * One small change is: now keys are passed by object { keys: '...' }
 * Might be useful, when you want to pass some other data to your handler
 */

(function(jQuery) {

  jQuery.hotkeys = {
    version: "0.8",

    specialKeys: {
      8: "backspace",
      9: "tab",
      10: "return",
      13: "return",
      16: "shift",
      17: "ctrl",
      18: "alt",
      19: "pause",
      20: "capslock",
      27: "esc",
      32: "space",
      33: "pageup",
      34: "pagedown",
      35: "end",
      36: "home",
      37: "left",
      38: "up",
      39: "right",
      40: "down",
      45: "insert",
      46: "del",
      59: ";",
      61: "=",
      96: "0",
      97: "1",
      98: "2",
      99: "3",
      100: "4",
      101: "5",
      102: "6",
      103: "7",
      104: "8",
      105: "9",
      106: "*",
      107: "+",
      109: "-",
      110: ".",
      111: "/",
      112: "f1",
      113: "f2",
      114: "f3",
      115: "f4",
      116: "f5",
      117: "f6",
      118: "f7",
      119: "f8",
      120: "f9",
      121: "f10",
      122: "f11",
      123: "f12",
      144: "numlock",
      145: "scroll",
      173: "-",
      186: ";",
      187: "=",
      188: ",",
      189: "-",
      190: ".",
      191: "/",
      192: "`",
      219: "[",
      220: "\\",
      221: "]",
      222: "'"
    },

    shiftNums: {
      "`": "~",
      "1": "!",
      "2": "@",
      "3": "#",
      "4": "$",
      "5": "%",
      "6": "^",
      "7": "&",
      "8": "*",
      "9": "(",
      "0": ")",
      "-": "_",
      "=": "+",
      ";": ": ",
      "'": "\"",
      ",": "<",
      ".": ">",
      "/": "?",
      "\\": "|"
    },

    // excludes: button, checkbox, file, hidden, image, password, radio, reset, search, submit, url
    textAcceptingInputTypes: [
      "text", "password", "number", "email", "url", "range", "date", "month", "week", "time", "datetime",
      "datetime-local", "search", "color", "tel"],

    // default input types not to bind to unless bound directly
    textInputTypes: /textarea|input|select/i,

    options: {
      filterInputAcceptingElements: true,
      filterTextInputs: true,
      filterContentEditable: true
    }
  };

  function keyHandler(handleObj) {
    if (typeof handleObj.data === "string") {
      handleObj.data = {
        keys: handleObj.data
      };
    }

    // Only care when a possible input has been specified
    if (!handleObj.data || !handleObj.data.keys || typeof handleObj.data.keys !== "string") {
      return;
    }

    var origHandler = handleObj.handler,
      keys = handleObj.data.keys.toLowerCase().split(" ");

    handleObj.handler = function(event) {
      //      Don't fire in text-accepting inputs that we didn't directly bind to
      if (this !== event.target &&
        (jQuery.hotkeys.options.filterInputAcceptingElements &&
          jQuery.hotkeys.textInputTypes.test(event.target.nodeName) ||
          (jQuery.hotkeys.options.filterContentEditable && jQuery(event.target).attr('contenteditable')) ||
          (jQuery.hotkeys.options.filterTextInputs &&
            jQuery.inArray(event.target.type, jQuery.hotkeys.textAcceptingInputTypes) > -1))) {
        return;
      }

      var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[event.which],
        character = String.fromCharCode(event.which).toLowerCase(),
        modif = "",
        possible = {};

      jQuery.each(["alt", "ctrl", "shift"], function(index, specialKey) {

        if (event[specialKey + 'Key'] && special !== specialKey) {
          modif += specialKey + '+';
        }
      });

      // metaKey is triggered off ctrlKey erronously
      if (event.metaKey && !event.ctrlKey && special !== "meta") {
        modif += "meta+";
      }

      if (event.metaKey && special !== "meta" && modif.indexOf("alt+ctrl+shift+") > -1) {
        modif = modif.replace("alt+ctrl+shift+", "hyper+");
      }

      if (special) {
        possible[modif + special] = true;
      }
      else {
        possible[modif + character] = true;
        possible[modif + jQuery.hotkeys.shiftNums[character]] = true;

        // "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
        if (modif === "shift+") {
          possible[jQuery.hotkeys.shiftNums[character]] = true;
        }
      }

      for (var i = 0, l = keys.length; i < l; i++) {
        if (possible[keys[i]]) {
          return origHandler.apply(this, arguments);
        }
      }
    };
  }

  jQuery.each(["keydown", "keyup", "keypress"], function() {
    jQuery.event.special[this] = {
      add: keyHandler
    };
  });

})(jQuery || this.jQuery || window.jQuery);
/*global define:false require:false */
(function (name, context, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition();
    else if (typeof define == 'function' && define.amd) define(definition);
    else context[name] = definition();
})('jquery-scrollto', this, function(){
    // Prepare
    var jQuery, $, ScrollTo;
    jQuery = $ = window.jQuery || require('jquery');

    // Fix scrolling animations on html/body on safari
    $.propHooks.scrollTop = $.propHooks.scrollLeft = {
        get: function(elem,prop) {
            var result = null;
            if ( elem.tagName === 'HTML' || elem.tagName === 'BODY' ) {
                if ( prop === 'scrollLeft' ) {
                    result = window.scrollX;
                } else if ( prop === 'scrollTop' ) {
                    result = window.scrollY;
                }
            }
            if ( result == null ) {
                result = elem[prop];
            }
            return result;
        }
    };
    $.Tween.propHooks.scrollTop = $.Tween.propHooks.scrollLeft = {
        get: function(tween) {
            return $.propHooks.scrollTop.get(tween.elem, tween.prop);
        },
        set: function(tween) {
            // Our safari fix
            if ( tween.elem.tagName === 'HTML' || tween.elem.tagName === 'BODY' ) {
                // Defaults
                tween.options.bodyScrollLeft = (tween.options.bodyScrollLeft || window.scrollX);
                tween.options.bodyScrollTop = (tween.options.bodyScrollTop || window.scrollY);

                // Apply
                if ( tween.prop === 'scrollLeft' ) {
                    tween.options.bodyScrollLeft = Math.round(tween.now);
                }
                else if ( tween.prop === 'scrollTop' ) {
                    tween.options.bodyScrollTop = Math.round(tween.now);
                }

                // Apply
                window.scrollTo(tween.options.bodyScrollLeft, tween.options.bodyScrollTop);
            }
            // jQuery's IE8 Fix
            else if ( tween.elem.nodeType && tween.elem.parentNode ) {
                tween.elem[ tween.prop ] = tween.now;
            }
        }
    };

    // jQuery ScrollTo
    ScrollTo = {
        // Configuration
        config: {
            duration: 400,
            easing: 'swing',
            callback: undefined,
            durationMode: 'each',
            offsetTop: 0,
            offsetLeft: 0
        },

        // Set Configuration
        configure: function(options){
            // Apply Options to Config
            $.extend(ScrollTo.config, options||{});

            // Chain
            return this;
        },

        // Perform the Scroll Animation for the Collections
        // We use $inline here, so we can determine the actual offset start for each overflow:scroll item
        // Each collection is for each overflow:scroll item
        scroll: function(collections, config){
            // Prepare
            var collection, $container, container, $target, $inline, position, containerTagName,
                containerScrollTop, containerScrollLeft,
                containerScrollTopEnd, containerScrollLeftEnd,
                startOffsetTop, targetOffsetTop, targetOffsetTopAdjusted,
                startOffsetLeft, targetOffsetLeft, targetOffsetLeftAdjusted,
                scrollOptions,
                callback;

            // Determine the Scroll
            collection = collections.pop();
            $container = collection.$container;
            $target = collection.$target;
            containerTagName = $container.prop('tagName');

            // Prepare the Inline Element of the Container
            $inline = $('<span/>').css({
                'position': 'absolute',
                'top': '0px',
                'left': '0px'
            });
            position = $container.css('position');

            // Insert the Inline Element of the Container
            $container.css({position:'relative'});
            $inline.appendTo($container);

            // Determine the top offset
            startOffsetTop = $inline.offset().top;
            targetOffsetTop = $target.offset().top;
            targetOffsetTopAdjusted = targetOffsetTop - startOffsetTop - parseInt(config.offsetTop,10);

            // Determine the left offset
            startOffsetLeft = $inline.offset().left;
            targetOffsetLeft = $target.offset().left;
            targetOffsetLeftAdjusted = targetOffsetLeft - startOffsetLeft - parseInt(config.offsetLeft,10);

            // Determine current scroll positions
            containerScrollTop = $container.prop('scrollTop');
            containerScrollLeft = $container.prop('scrollLeft');

            // Reset the Inline Element of the Container
            $inline.remove();
            $container.css({position:position});

            // Prepare the scroll options
            scrollOptions = {};

            // Prepare the callback
            callback = function(event){
                // Check
                if ( collections.length === 0 ) {
                    // Callback
                    if ( typeof config.callback === 'function' ) {
                        config.callback();
                    }
                }
                else {
                    // Recurse
                    ScrollTo.scroll(collections,config);
                }
                // Return true
                return true;
            };

            // Handle if we only want to scroll if we are outside the viewport
            if ( config.onlyIfOutside ) {
                // Determine current scroll positions
                containerScrollTopEnd = containerScrollTop + $container.height();
                containerScrollLeftEnd = containerScrollLeft + $container.width();

                // Check if we are in the range of the visible area of the container
                if ( containerScrollTop < targetOffsetTopAdjusted && targetOffsetTopAdjusted < containerScrollTopEnd ) {
                    targetOffsetTopAdjusted = containerScrollTop;
                }
                if ( containerScrollLeft < targetOffsetLeftAdjusted && targetOffsetLeftAdjusted < containerScrollLeftEnd ) {
                    targetOffsetLeftAdjusted = containerScrollLeft;
                }
            }

            // Determine the scroll options
            if ( targetOffsetTopAdjusted !== containerScrollTop ) {
                scrollOptions.scrollTop = targetOffsetTopAdjusted;
            }
            if ( targetOffsetLeftAdjusted !== containerScrollLeft ) {
                scrollOptions.scrollLeft = targetOffsetLeftAdjusted;
            }

            // Check to see if the scroll is necessary
            if ( $container.prop('scrollHeight') === $container.width() ) {
                delete scrollOptions.scrollTop;
            }
            if ( $container.prop('scrollWidth') === $container.width() ) {
                delete scrollOptions.scrollLeft;
            }

            // Perform the scroll
            if ( scrollOptions.scrollTop != null || scrollOptions.scrollLeft != null ) {
                $container.animate(scrollOptions, {
                    duration: config.duration,
                    easing: config.easing,
                    complete: callback
                });
            }
            else {
                callback();
            }

            // Return true
            return true;
        },

        // ScrollTo the Element using the Options
        fn: function(options){
            // Prepare
            var collections, config, $container, container;
            collections = [];

            // Prepare
            var $target = $(this);
            if ( $target.length === 0 ) {
                // Chain
                return this;
            }

            // Handle Options
            config = $.extend({},ScrollTo.config,options);

            // Fetch
            $container = $target.parent();
            container = $container.get(0);

            // Cycle through the containers
            while ( ($container.length === 1) && (container !== document.body) && (container !== document) ) {
                // Check Container for scroll differences
                var containerScrollTop, containerScrollLeft;
                containerScrollTop = $container.css('overflow-y') !== 'visible' && container.scrollHeight !== container.clientHeight;
                containerScrollLeft =  $container.css('overflow-x') !== 'visible' && container.scrollWidth !== container.clientWidth;
                if ( containerScrollTop || containerScrollLeft ) {
                    // Push the Collection
                    collections.push({
                        '$container': $container,
                        '$target': $target
                    });
                    // Update the Target
                    $target = $container;
                }
                // Update the Container
                $container = $container.parent();
                container = $container.get(0);
            }

            // Add the final collection
            collections.push({
                '$container': $('html'),
                // document.body doesn't work in firefox, html works for all
                // internet explorer starts at the beggining
                '$target': $target
            });

            // Adjust the Config
            if ( config.durationMode === 'all' ) {
                config.duration /= collections.length;
            }

            // Handle
            ScrollTo.scroll(collections,config);

            // Chain
            return this;
        }
    };

    // Apply our extensions to jQuery
    $.ScrollTo = $.ScrollTo || ScrollTo;
    $.fn.ScrollTo = $.fn.ScrollTo || ScrollTo.fn;

    // Export
    return ScrollTo;
});

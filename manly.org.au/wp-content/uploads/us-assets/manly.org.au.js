! function(a, b) {
    "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", b) : "object" == typeof module && module.exports ? module.exports = b() : a.EvEmitter = b()
}("undefined" == typeof window ? this : window, function() {
    function a() {}
    var b = a.prototype;
    return b.on = function(a, b) {
        if (a && b) {
            var c = this._events = this._events || {},
                d = c[a] = c[a] || [];
            return -1 == d.indexOf(b) && d.push(b), this
        }
    }, b.once = function(a, b) {
        if (a && b) {
            this.on(a, b);
            var c = this._onceEvents = this._onceEvents || {},
                d = c[a] = c[a] || {};
            return d[b] = !0, this
        }
    }, b.off = function(a, b) {
        var c = this._events && this._events[a];
        if (c && c.length) {
            var d = c.indexOf(b);
            return -1 != d && c.splice(d, 1), this
        }
    }, b.emitEvent = function(a, b) {
        var c = this._events && this._events[a];
        if (c && c.length) {
            c = c.slice(0), b = b || [];
            for (var d = this._onceEvents && this._onceEvents[a], e = 0; e < c.length; e++) {
                var f = c[e],
                    g = d && d[f];
                g && (this.off(a, f), delete d[f]), f.apply(this, b)
            }
            return this
        }
    }, b.allOff = function() {
        delete this._events, delete this._onceEvents
    }, a
}),
function(a, b) {
    "use strict";
    "function" == typeof define && define.amd ? define(["ev-emitter/ev-emitter"], function(c) {
        return b(a, c)
    }) : "object" == typeof module && module.exports ? module.exports = b(a, require("ev-emitter")) : a.imagesLoaded = b(a, a.EvEmitter)
}("undefined" == typeof window ? this : window, function(b, c) {
    function f(a, b) {
        for (var c in b) a[c] = b[c];
        return a
    }

    function g(b) {
        if (Array.isArray(b)) return b;
        var c = "object" == typeof b && "number" == typeof b.length;
        return c ? a.call(b) : [b]
    }

    function j(a, b, c) {
        if (!(this instanceof j)) return new j(a, b, c);
        var d = a;
        return "string" == typeof a && (d = document.querySelectorAll(a)), d ? (this.elements = g(d), this.options = f({}, this.options), "function" == typeof b ? c = b : f(this.options, b), c && this.on("always", c), this.getImages(), l && (this.jqDeferred = new l.Deferred), void setTimeout(this.check.bind(this))) : void m.error("Bad element for imagesLoaded " + (d || a))
    }

    function i(a) {
        this.img = a
    }

    function k(a, b) {
        this.url = a, this.element = b, this.img = new Image
    }
    var l = b.jQuery,
        m = b.console,
        a = Array.prototype.slice;
    j.prototype = Object.create(c.prototype), j.prototype.options = {}, j.prototype.getImages = function() {
        this.images = [], this.elements.forEach(this.addElementImages, this)
    }, j.prototype.addElementImages = function(a) {
        "IMG" == a.nodeName && this.addImage(a), !0 === this.options.background && this.addElementBackgroundImages(a);
        var b = a.nodeType;
        if (b && d[b]) {
            for (var c, e = a.querySelectorAll("img"), f = 0; f < e.length; f++) c = e[f], this.addImage(c);
            if ("string" == typeof this.options.background) {
                var g = a.querySelectorAll(this.options.background);
                for (f = 0; f < g.length; f++) {
                    var h = g[f];
                    this.addElementBackgroundImages(h)
                }
            }
        }
    };
    var d = {
        1: !0,
        9: !0,
        11: !0
    };
    return j.prototype.addElementBackgroundImages = function(a) {
        var b = getComputedStyle(a);
        if (b)
            for (var c, d = /url\((['"])?(.*?)\1\)/gi, e = d.exec(b.backgroundImage); null !== e;) c = e && e[2], c && this.addBackground(c, a), e = d.exec(b.backgroundImage)
    }, j.prototype.addImage = function(a) {
        var b = new i(a);
        this.images.push(b)
    }, j.prototype.addBackground = function(a, b) {
        var c = new k(a, b);
        this.images.push(c)
    }, j.prototype.check = function() {
        function a(a, c, d) {
            setTimeout(function() {
                b.progress(a, c, d)
            })
        }
        var b = this;
        return this.progressedCount = 0, this.hasAnyBroken = !1, this.images.length ? void this.images.forEach(function(b) {
            b.once("progress", a), b.check()
        }) : void this.complete()
    }, j.prototype.progress = function(a, b, c) {
        this.progressedCount++, this.hasAnyBroken = this.hasAnyBroken || !a.isLoaded, this.emitEvent("progress", [this, a, b]), this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, a), this.progressedCount == this.images.length && this.complete(), this.options.debug && m && m.log("progress: " + c, a, b)
    }, j.prototype.complete = function() {
        var a = this.hasAnyBroken ? "fail" : "done";
        if (this.isComplete = !0, this.emitEvent(a, [this]), this.emitEvent("always", [this]), this.jqDeferred) {
            var b = this.hasAnyBroken ? "reject" : "resolve";
            this.jqDeferred[b](this)
        }
    }, i.prototype = Object.create(c.prototype), i.prototype.check = function() {
        var a = this.getIsImageComplete();
        return a ? void this.confirm(0 !== this.img.naturalWidth, "naturalWidth") : (this.proxyImage = new Image, this.proxyImage.addEventListener("load", this), this.proxyImage.addEventListener("error", this), this.img.addEventListener("load", this), this.img.addEventListener("error", this), void(this.proxyImage.src = this.img.src))
    }, i.prototype.getIsImageComplete = function() {
        return this.img.complete && this.img.naturalWidth
    }, i.prototype.confirm = function(a, b) {
        this.isLoaded = a, this.emitEvent("progress", [this, this.img, b])
    }, i.prototype.handleEvent = function(a) {
        var b = "on" + a.type;
        this[b] && this[b](a)
    }, i.prototype.onload = function() {
        this.confirm(!0, "onload"), this.unbindEvents()
    }, i.prototype.onerror = function() {
        this.confirm(!1, "onerror"), this.unbindEvents()
    }, i.prototype.unbindEvents = function() {
        this.proxyImage.removeEventListener("load", this), this.proxyImage.removeEventListener("error", this), this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
    }, k.prototype = Object.create(i.prototype), k.prototype.check = function() {
        this.img.addEventListener("load", this), this.img.addEventListener("error", this), this.img.src = this.url;
        var a = this.getIsImageComplete();
        a && (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), this.unbindEvents())
    }, k.prototype.unbindEvents = function() {
        this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
    }, k.prototype.confirm = function(a, b) {
        this.isLoaded = a, this.emitEvent("progress", [this, this.element, b])
    }, j.makeJQueryPlugin = function(a) {
        a = a || b.jQuery, a && (l = a, l.fn.imagesLoaded = function(a, b) {
            var c = new j(this, a, b);
            return c.jqDeferred.promise(l(this))
        })
    }, j.makeJQueryPlugin(), j
});
jQuery.easing.jswing = jQuery.easing.swing;
var pow = Math.pow;
jQuery.extend(jQuery.easing, {
    def: "easeOutExpo",
    easeInExpo: function(a) {
        return 0 === a ? 0 : pow(2, 10 * a - 10)
    },
    easeOutExpo: function(a) {
        return 1 === a ? 1 : 1 - pow(2, -10 * a)
    },
    easeInOutExpo: function(a) {
        return 0 === a ? 0 : 1 === a ? 1 : .5 > a ? pow(2, 20 * a - 10) / 2 : (2 - pow(2, -20 * a + 10)) / 2
    }
});
if (window.$us === undefined) {
    window.$us = {}
}
$us.mobileNavOpened = 0;
$us.header = {
    isVertical: jQuery.noop,
    isHorizontal: jQuery.noop,
    isFixed: jQuery.noop,
    isTransparent: jQuery.noop,
    isHidden: jQuery.noop,
    isStickyEnabled: jQuery.noop,
    isStickyAutoHideEnabled: jQuery.noop,
    isSticky: jQuery.noop,
    isStickyAutoHidden: jQuery.noop,
    getScrollDirection: jQuery.noop,
    getAdminBarHeight: jQuery.noop,
    getHeight: jQuery.noop,
    getCurrentHeight: jQuery.noop,
    getScrollTop: jQuery.noop
};
jQuery.fn.usMod = function(mod, value) {
    if (this.length == 0) return this;
    if (value === undefined) {
        var pcre = new RegExp('^.*?' + mod + '\_([a-zA-Z0-9\_\-]+).*?$');
        return (pcre.exec(this.get(0).className) || [])[1] || !1
    }
    this.each(function(_, item) {
        item.className = item.className.replace(new RegExp('(^| )' + mod + '\_[a-zA-Z0-9\_\-]+( |$)'), '$2');
        if (value !== !1) {
            item.className += ' ' + mod + '_' + value
        }
    });
    return this
};
$us.toBool = function(value) {
    if (typeof value == 'boolean') {
        return value
    }
    if (typeof value == 'string') {
        value = value.trim();
        return (value.toLocaleLowerCase() == 'true' || value == '1')
    }
    return !!parseInt(value)
};
$us.getScript = function(url, callback) {
    if (!$us.ajaxLoadJs) {
        callback();
        return !1
    }
    if ($us.loadedScripts === undefined) {
        $us.loadedScripts = {};
        $us.loadedScriptsFunct = {}
    }
    if ($us.loadedScripts[url] === 'loaded') {
        callback();
        return
    } else if ($us.loadedScripts[url] === 'loading') {
        $us.loadedScriptsFunct[url].push(callback);
        return
    }
    $us.loadedScripts[url] = 'loading';
    $us.loadedScriptsFunct[url] = [];
    $us.loadedScriptsFunct[url].push(callback)
    var complete = function() {
        for (var i = 0; i < $us.loadedScriptsFunct[url].length; i++) {
            if (typeof $us.loadedScriptsFunct[url][i] === 'function') {
                $us.loadedScriptsFunct[url][i]()
            }
        }
        $us.loadedScripts[url] = 'loaded'
    };
    var options = {
        dataType: "script",
        cache: !0,
        url: url,
        complete: complete
    };
    return jQuery.ajax(options)
};
$us.detectIE = function() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10)
    }
    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10)
    }
    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10)
    }
    return !1
};
$us.getAnimationName = function(animationName, defaultAnimationName) {
    if (jQuery.easing.hasOwnProperty(animationName)) {
        return animationName
    }
    return defaultAnimationName ? defaultAnimationName : jQuery.easing._default
};
$us.timeout = function(fn, delay) {
    var start = new Date().getTime(),
        handle = new Object();

    function loop() {
        var current = new Date().getTime(),
            delta = current - start;
        delta >= delay ? fn.call() : handle.value = window.requestAnimationFrame(loop)
    };
    handle.value = window.requestAnimationFrame(loop);
    return handle
};
$us.clearTimeout = function(handle) {
    if (handle) {
        window.cancelAnimationFrame(handle.value)
    }
};
$us.debounce = function(fn, wait, immediate) {
    var timeout, args, context, timestamp, result;
    if (null == wait) wait = 100;

    function later() {
        var last = Date.now() - timestamp;
        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last)
        } else {
            timeout = null;
            if (!immediate) {
                result = fn.apply(context, args);
                context = args = null
            }
        }
    }
    var debounced = function() {
        context = this;
        args = arguments;
        timestamp = Date.now();
        var callNow = immediate && !timeout;
        if (!timeout) timeout = setTimeout(later, wait);
        if (callNow) {
            result = fn.apply(context, args);
            context = args = null
        }
        return result
    };
    debounced.prototype = {
        clear: function() {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null
            }
        },
        flush: function() {
            if (timeout) {
                result = fn.apply(context, args);
                context = args = null;
                clearTimeout(timeout);
                timeout = null
            }
        }
    };
    return debounced
};
$us.mixins = {};
$us.mixins.Events = {
    on: function(eventType, handler) {
        if (this.$$events === undefined) {
            this.$$events = {}
        }
        if (this.$$events[eventType] === undefined) {
            this.$$events[eventType] = []
        }
        this.$$events[eventType].push(handler);
        return this
    },
    off: function(eventType, handler) {
        if (this.$$events === undefined || this.$$events[eventType] === undefined) {
            return this
        }
        if (handler !== undefined) {
            var handlerPos = jQuery.inArray(handler, this.$$events[eventType]);
            if (handlerPos != -1) {
                this.$$events[eventType].splice(handlerPos, 1)
            }
        } else {
            this.$$events[eventType] = []
        }
        return this
    },
    trigger: function(eventType, extraParameters) {
        if (this.$$events === undefined || this.$$events[eventType] === undefined || this.$$events[eventType].length == 0) {
            return this
        }
        var params = (arguments.length > 2 || !jQuery.isArray(extraParameters)) ? Array.prototype.slice.call(arguments, 1) : extraParameters;
        params.unshift(this);
        for (var index = 0; index < this.$$events[eventType].length; index++) {
            this.$$events[eventType][index].apply(this.$$events[eventType][index], params)
        }
        return this
    }
};
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    jQuery.isMobile = !0
} else {
    jQuery.isMobile = (navigator.platform == 'MacIntel' && navigator.maxTouchPoints > 1);
    jQuery('html').toggleClass('ios-touch', !!jQuery.isMobile)
}
jQuery('html').toggleClass('no-touch', !jQuery.isMobile);
jQuery('html').toggleClass('ie11', $us.detectIE() == 11);
! function($) {
    $us.$window = $(window);
    $us.$document = $(document);
    $us.$html = $('html');
    $us.$body = $('.l-body:first');
    $us.$htmlBody = $us.$html.add($us.$body);
    $us.$canvas = $('.l-canvas:first');
    $us.usbPreview = $us.$body.is('.usb_preview')
}(jQuery);
! function($, undefined) {
    "use strict";

    function USCanvas(options) {
        var defaults = {
            disableEffectsWidth: 900,
            backToTopDisplay: 100
        };
        this.options = $.extend({}, defaults, options || {});
        this.$header = $('.l-header', $us.$canvas);
        this.$main = $('.l-main', $us.$canvas);
        this.$sections = $('> *:not(.l-header) .l-section', $us.$canvas);
        this.$firstSection = this.$sections.first();
        this.$firstStickySection = this.$sections.filter('.type_sticky:first:visible');
        this.$secondSection = this.$sections.eq(1);
        this.$fullscreenSections = this.$sections.filter('.full_height');
        this.$topLink = $('.w-toplink');
        this.type = $us.$canvas.usMod('type');
        this._headerPos = this.$header.usMod('pos');
        this.headerPos = this._headerPos;
        this.headerInitialPos = $us.$body.usMod('headerinpos');
        this.headerBg = this.$header.usMod('bg');
        this.rtl = $us.$body.hasClass('rtl');
        this.isScrolling = !1;
        this.isAndroid = /Android/i.test(navigator.userAgent);
        if (this.isStickySection()) {
            if (!!window.IntersectionObserver) {
                this.observer = (new IntersectionObserver(function(e) {
                    e[0].target.classList.toggle('is_sticky', e[0].intersectionRatio === 1)
                }.bind(this), {
                    threshold: [0, 1]
                })).observe(this.$firstStickySection[0])
            }
        }
        if ($us.$body.hasClass('us_iframe')) {
            $('a:not([target])').each(function() {
                $(this).attr('target', '_parent')
            });
            jQuery(function($) {
                var $framePreloader = $('.l-popup-box-content .g-preloader', window.parent.document);
                $framePreloader.hide()
            })
        }
        $us.$window.on('scroll', this._events.scroll.bind(this)).on('resize load', this._events.resize.bind(this));
        $us.timeout(this._events.resize.bind(this), 25);
        $us.timeout(this._events.resize.bind(this), 75)
    }
    USCanvas.prototype = {
        isStickySection: function() {
            return !!this.$firstStickySection.length
        },
        hasStickySection: function() {
            if (this.isStickySection()) {
                return this.$firstStickySection.hasClass('is_sticky')
            }
            return !1
        },
        getHeightStickySection: function() {
            return this.isStickySection() ? Math.ceil(this.$firstStickySection.outerHeight(!0)) : 0
        },
        getHeightFirstSection: function() {
            return this.$firstSection.length ? parseInt(this.$firstSection.outerHeight(!0)) : 0
        },
        _events: {
            scroll: function() {
                var scrollTop = parseInt($us.$window.scrollTop());
                this.$topLink.toggleClass('active', (scrollTop >= this.winHeight * this.options.backToTopDisplay / 100));
                if (this.isAndroid) {
                    if (this.pid) {
                        $us.clearTimeout(this.pid)
                    }
                    this.isScrolling = !0;
                    this.pid = $us.timeout(function() {
                        this.isScrolling = !1
                    }.bind(this), 100)
                }
            },
            resize: function() {
                this.winHeight = parseInt($us.$window.height());
                this.winWidth = parseInt($us.$window.width());
                $us.$body.toggleClass('disable_effects', (this.winWidth < this.options.disableEffectsWidth));
                var ieVersion = $us.detectIE();
                if ((ieVersion !== !1 && ieVersion == 11) && (this.$fullscreenSections.length > 0 && !this.isScrolling)) {
                    this.$fullscreenSections.each(function(index, section) {
                        var $section = $(section),
                            sectionHeight = this.winHeight,
                            isFirstSection = (index == 0 && $section.is(this.$firstSection));
                        if (isFirstSection) {
                            sectionHeight -= $section.offset().top
                        } else {
                            sectionHeight -= $us.header.getCurrentHeight()
                        }
                        if ($section.hasClass('valign_center')) {
                            var $sectionH = $section.find('.l-section-h'),
                                sectionTopPadding = parseInt($section.css('padding-top')),
                                contentHeight = $sectionH.outerHeight(),
                                topMargin;
                            $sectionH.css('margin-top', '');
                            var sectionOverlapped = (isFirstSection && $us.header.isFixed() && !$us.header.isTransparent() && $us.header.isHorizontal());
                            if (sectionOverlapped) {
                                topMargin = Math.max(0, (sectionHeight - sectionTopPadding - contentHeight) / 2)
                            } else {
                                topMargin = Math.max(0, (sectionHeight - contentHeight) / 2 - sectionTopPadding)
                            }
                            $sectionH.css('margin-top', topMargin || '')
                        }
                    }.bind(this));
                    $us.$canvas.trigger('contentChange')
                }
                if ($us.$body.hasClass('us_iframe')) {
                    var $frameContent = $('.l-popup-box-content', window.parent.document),
                        outerHeight = $us.$body.outerHeight(!0);
                    if (outerHeight > 0 && $(window.parent).height() > outerHeight) {
                        $frameContent.css('height', outerHeight)
                    } else {
                        $frameContent.css('height', '')
                    }
                }
                this._events.scroll.call(this)
            }
        }
    };
    $us.canvas = new USCanvas($us.canvasOptions || {})
}(jQuery);
! function() {
    jQuery.fn.resetInlineCSS = function() {
        for (var index = 0; index < arguments.length; index++) {
            this.css(arguments[index], '')
        }
        return this
    };
    jQuery.fn.clearPreviousTransitions = function() {
        var prevTimers = (this.data('animation-timers') || '').split(',');
        if (prevTimers.length >= 2) {
            this.resetInlineCSS('transition');
            prevTimers.map(clearTimeout);
            this.removeData('animation-timers')
        }
        return this
    };
    jQuery.fn.performCSSTransition = function(css, duration, onFinish, easing, delay) {
        duration = duration || 250;
        delay = delay || 25;
        easing = easing || 'ease';
        var $this = this,
            transition = [];
        this.clearPreviousTransitions();
        for (var attr in css) {
            if (!css.hasOwnProperty(attr)) {
                continue
            }
            transition.push(attr + ' ' + (duration / 1000) + 's ' + easing)
        }
        transition = transition.join(', ');
        $this.css({
            transition: transition
        });
        var timer1 = setTimeout(function() {
            $this.css(css)
        }, delay);
        var timer2 = setTimeout(function() {
            $this.resetInlineCSS('transition');
            if (typeof onFinish == 'function') {
                onFinish()
            }
        }, duration + delay);
        this.data('animation-timers', timer1 + ',' + timer2)
    };
    jQuery.fn.slideDownCSS = function(duration, onFinish, easing, delay) {
        if (this.length == 0) {
            return
        }
        var $this = this;
        this.clearPreviousTransitions();
        this.resetInlineCSS('padding-top', 'padding-bottom');
        var timer1 = setTimeout(function() {
            var paddingTop = parseInt($this.css('padding-top')),
                paddingBottom = parseInt($this.css('padding-bottom'));
            $this.css({
                visibility: 'hidden',
                position: 'absolute',
                height: 'auto',
                'padding-top': 0,
                'padding-bottom': 0,
                display: 'block'
            });
            var height = $this.height();
            $this.css({
                overflow: 'hidden',
                height: '0px',
                opacity: 0,
                visibility: '',
                position: ''
            });
            $this.performCSSTransition({
                opacity: 1,
                height: height + paddingTop + paddingBottom,
                'padding-top': paddingTop,
                'padding-bottom': paddingBottom
            }, duration, function() {
                $this.resetInlineCSS('overflow').css('height', 'auto');
                if (typeof onFinish == 'function') {
                    onFinish()
                }
            }, easing, delay)
        }, 25);
        this.data('animation-timers', timer1 + ',null')
    };
    jQuery.fn.slideUpCSS = function(duration, onFinish, easing, delay) {
        if (this.length == 0) {
            return
        }
        this.clearPreviousTransitions();
        this.css({
            height: this.outerHeight(),
            overflow: 'hidden',
            'padding-top': this.css('padding-top'),
            'padding-bottom': this.css('padding-bottom')
        });
        var $this = this;
        this.performCSSTransition({
            height: 0,
            opacity: 0,
            'padding-top': 0,
            'padding-bottom': 0
        }, duration, function() {
            $this.resetInlineCSS('overflow', 'padding-top', 'padding-bottom').css({
                display: 'none'
            });
            if (typeof onFinish == 'function') {
                onFinish()
            }
        }, easing, delay)
    };
    jQuery.fn.fadeInCSS = function(duration, onFinish, easing, delay) {
        if (this.length == 0) {
            return
        }
        this.clearPreviousTransitions();
        this.css({
            opacity: 0,
            display: 'block'
        });
        this.performCSSTransition({
            opacity: 1
        }, duration, onFinish, easing, delay)
    };
    jQuery.fn.fadeOutCSS = function(duration, onFinish, easing, delay) {
        if (this.length == 0) {
            return
        }
        var $this = this;
        this.performCSSTransition({
            opacity: 0
        }, duration, function() {
            $this.css('display', 'none');
            if (typeof onFinish == 'function') {
                onFinish()
            }
        }, easing, delay)
    }
}();
jQuery(function($) {
    "use strict";
    if (document.cookie.indexOf('us_cookie_notice_accepted=true') !== -1) {
        $('.l-cookie').remove()
    } else {
        $(document).on('click', '#us-set-cookie', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var d = new Date();
            d.setFullYear(d.getFullYear() + 1);
            document.cookie = 'us_cookie_notice_accepted=true; expires=' + d.toUTCString() + '; path=/;' + (location.protocol === 'https:' ? ' secure;' : '');
            $('.l-cookie').remove()
        })
    }
    var USPopupLink = function(context, options) {
        var $links = $('a[ref=magnificPopup][class!=direct-link]:not(.inited)', context || document),
            defaultOptions = {
                fixedContentPos: !0,
                mainClass: 'mfp-fade',
                removalDelay: 300,
                type: 'image'
            };
        if ($links.length) {
            $us.getScript($us.templateDirectoryUri + '/common/js/vendor/magnific-popup.js', function() {
                $links.addClass('inited').magnificPopup($.extend({}, defaultOptions, options || {}))
            })
        }
    };
    $.fn.wPopupLink = function(options) {
        return this.each(function() {
            $(this).data('wPopupLink', new USPopupLink(this, options))
        })
    };
    $(document).wPopupLink();
    var USSectionVideo = function(container) {
        this.$usSectionVideoContainer = $('.l-section-video', container);
        if (!this.$usSectionVideoContainer.length) {
            return
        }
        $us.$window.on('resize load', function() {
            this.$usSectionVideoContainer.each(function() {
                var $videoContainer = $(this);
                if (!$videoContainer.data('video-disable-width')) {
                    return !1
                }
                if (window.innerWidth < parseInt($videoContainer.data('video-disable-width'))) {
                    $videoContainer.addClass('hidden')
                } else {
                    $videoContainer.removeClass('hidden')
                }
            })
        }.bind(this))
    };
    $.fn.wSectionVideo = function(options) {
        return this.each(function() {
            $(this).data('wSectionVideo', new USSectionVideo(this, options))
        })
    };
    $('.l-section').wSectionVideo();
    (function() {
        var $footer = $('.l-footer');
        if ($us.$body.hasClass('footer_reveal') && $footer.length && $footer.html().trim().length) {
            var usFooterReveal = function() {
                var footerHeight = $footer.innerHeight();
                if (window.innerWidth > parseInt($us.canvasOptions.columnsStackingWidth) - 1) {
                    $us.$canvas.css('margin-bottom', Math.round(footerHeight) - 1)
                } else {
                    $us.$canvas.css('margin-bottom', '')
                }
            };
            usFooterReveal();
            $us.$window.on('resize load', function() {
                usFooterReveal()
            })
        }
    })();
    var $usYTVimeoVideoContainer = $('.with_youtube, .with_vimeo');
    if ($usYTVimeoVideoContainer.length) {
        $(window).on('resize load', function() {
            $usYTVimeoVideoContainer.each(function() {
                var $container = $(this),
                    $frame = $container.find('iframe').first(),
                    cHeight = $container.innerHeight(),
                    cWidth = $container.innerWidth(),
                    fWidth = '',
                    fHeight = '';
                if (cWidth / cHeight < 16 / 9) {
                    fWidth = cHeight * (16 / 9);
                    fHeight = cHeight
                } else {
                    fWidth = cWidth;
                    fHeight = fWidth * (9 / 16)
                }
                $frame.css({
                    'width': Math.round(fWidth),
                    'height': Math.round(fHeight),
                })
            })
        })
    }
});
(function($, undefined) {
    "use strict";

    function USWaypoints() {
        this.waypoints = [];
        $us.$canvas.on('contentChange', this._countAll.bind(this));
        $us.$window.on('resize load', this._events.resize.bind(this)).on('scroll scroll.waypoints', this._events.scroll.bind(this));
        $us.timeout(this._events.resize.bind(this), 75);
        $us.timeout(this._events.scroll.bind(this), 75)
    }
    USWaypoints.prototype = {
        _events: {
            scroll: function() {
                var scrollTop = parseInt($us.$window.scrollTop());
                scrollTop = (scrollTop >= 0) ? scrollTop : 0;
                for (var i = 0; i < this.waypoints.length; i++) {
                    if (this.waypoints[i].scrollPos < scrollTop) {
                        this.waypoints[i].fn(this.waypoints[i].$elm);
                        this.waypoints.splice(i, 1);
                        i--
                    }
                }
            },
            resize: function() {
                $us.timeout(function() {
                    this._countAll.call(this);
                    this._events.scroll.call(this)
                }.bind(this), 150);
                this._countAll.call(this);
                this._events.scroll.call(this)
            }
        },
        add: function($elm, offset, fn) {
            $elm = ($elm instanceof $) ? $elm : $($elm);
            if ($elm.length == 0) {
                return
            }
            if (typeof offset != 'string' || offset.indexOf('%') == -1) {
                offset = parseInt(offset)
            }
            var waypoint = {
                $elm: $elm,
                offset: offset,
                fn: fn
            };
            this._count(waypoint);
            this.waypoints.push(waypoint)
        },
        _count: function(waypoint) {
            var elmTop = waypoint.$elm.offset().top,
                winHeight = $us.$window.height();
            if (typeof waypoint.offset == 'number') {
                waypoint.scrollPos = elmTop - winHeight + waypoint.offset
            } else {
                waypoint.scrollPos = elmTop - winHeight + winHeight * parseInt(waypoint.offset) / 100
            }
        },
        _countAll: function() {
            for (var i = 0; i < this.waypoints.length; i++) {
                this._count(this.waypoints[i])
            }
        }
    };
    $us.waypoints = new USWaypoints
})(jQuery);
(function() {
    var lastTime = 0,
        vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame']
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                id = window.setTimeout(function() {
                    callback(currTime + timeToCall)
                }, timeToCall);
            lastTime = currTime + timeToCall;
            return id
        }
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id)
        }
    }
}());
if ($us.$body.hasClass('single-format-video')) {
    figure = $us.$body.find('figure.wp-block-embed div.wp-block-embed__wrapper');
    if (figure.length) {
        figure.each(function() {
            if (this.firstElementChild === null) {
                this.remove()
            }
        })
    }
}! function($, undefined) {
    "use strict";
    $us.ToggleMoreContent = function(container) {
        this.init(container)
    };
    $us.ToggleMoreContent.prototype = {
        init: function(container) {
            this.$container = $(container);
            this.$firstElm = $('> *:first', this.$container);
            this.toggleHeight = this.$container.data('toggle-height') || 200;
            this.$container.on('click', '.toggle-show-more, .toggle-show-less', this._events.elmToggleShowMore.bind(this));
            if (!this.$container.closest('.owl-carousel').length) {
                this.initHeightCheck.call(this)
            }
        },
        initHeightCheck: function() {
            var height = this.$firstElm.css('height', this.toggleHeight).height();
            this.$firstElm.css('height', '');
            var elmHeight = this.$firstElm.height();
            if (elmHeight && elmHeight <= height) {
                $('.toggle-links', this.$container).hide();
                this.$firstElm.css('height', '');
                this.$container.removeClass('with_show_more_toggle')
            } else {
                $('.toggle-links', this.$container).show();
                this.$firstElm.css('height', this.toggleHeight)
            }
        },
        _isVisible: function() {
            if (!this.$container.length) {
                return !1
            }
            var w = window,
                d = document,
                rect = this.$container[0].getBoundingClientRect(),
                containerPosition = {
                    top: w.pageYOffset + rect.top,
                    left: w.pageXOffset + rect.left,
                    right: w.pageXOffset + rect.right,
                    bottom: w.pageYOffset + rect.bottom
                },
                windowPosition = {
                    top: w.pageYOffset,
                    left: w.pageXOffset,
                    right: w.pageXOffset + d.documentElement.clientWidth,
                    bottom: w.pageYOffset + d.documentElement.clientHeight
                };
            return (containerPosition.bottom > windowPosition.top && containerPosition.top < windowPosition.bottom && containerPosition.right > windowPosition.left && containerPosition.left < windowPosition.right)
        },
        _events: {
            elmToggleShowMore: function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.$container.toggleClass('show_content', $(e.target).hasClass('toggle-show-more'));
                $us.timeout(function() {
                    $us.$canvas.trigger('contentChange');
                    if ($.isMobile && !this._isVisible()) {
                        $us.$htmlBody.stop(!0, !1).scrollTop(this.$container.offset().top - $us.header.getCurrentHeight())
                    }
                }.bind(this), 1)
            }
        }
    };
    $.fn.usToggleMoreContent = function() {
        return this.each(function() {
            $(this).data('usToggleMoreContent', new $us.ToggleMoreContent(this))
        })
    };
    $('[data-toggle-height]').usToggleMoreContent()
}(jQuery);
! function($, undefined) {
    "use strict";
    if ($us.detectIE() == 11) {
        if ($('.w-post-elm.has_ratio').length && !$('.w-grid').length) {
            $us.getScript($us.templateDirectoryUri + '/common/js/vendor/objectFitPolyfill.js', function() {
                objectFitPolyfill()
            })
        }
        $us.getScript($us.templateDirectoryUri + '/common/js/vendor/css-vars-ponyfill.js', function() {
            cssVars({})
        })
    }
}(jQuery);
! function($, undefined) {
    $us.$window.on('us.wpopup.afterShow', function(_, WPopup) {
        if (WPopup instanceof $us.WPopup && $('video.wp-video-shortcode', WPopup.$box).length) {
            var handle = $us.timeout(function() {
                $us.clearTimeout(handle);
                window.dispatchEvent(new Event('resize'))
            }, 1)
        }
    })
}(jQuery);
! function($, undefined) {
    "use strict";
    if ($us.detectIE() == 11 && $('.w-image.has_ratio').length) {
        $us.getScript($us.templateDirectoryUri + '/common/js/vendor/objectFitPolyfill.js', function() {
            objectFitPolyfill()
        })
    }
}(jQuery);
! function($) {
    "use strict";
    $us.WFlipBox = function(container) {
        this.$container = $(container);
        this.$front = this.$container.find('.w-flipbox-front');
        this.$frontH = this.$container.find('.w-flipbox-front-h');
        this.$back = this.$container.find('.w-flipbox-back');
        this.$backH = this.$container.find('.w-flipbox-back-h');
        this.$xFlank = this.$container.find('.w-flipbox-xflank');
        this.$yFlank = this.$container.find('.w-flipbox-yflank');
        this.$btn = this.$container.find('.w-btn');
        if (!!window.MSInputMethodContext && !!document.documentMode) {
            this.$container.usMod('animation', 'cardflip').find('.w-flipbox-h').css({
                'transition-duration': '0s',
                '-webkit-transition-duration': '0s'
            })
        }
        var isWebkit = 'WebkitAppearance' in document.documentElement.style;
        if (isWebkit && this.$container.usMod('animation') === 'cubeflip' && this.$btn.length) {
            this.$container.usMod('animation', 'cubetilt')
        }
        var animation = this.$container.usMod('animation'),
            direction = this.$container.usMod('direction');
        this.forceSquare = (animation == 'cubeflip' && ['ne', 'se', 'sw', 'nw'].indexOf(direction) != -1);
        this.autoSize = (this.$front[0].style.height == '' && !this.forceSquare);
        this.centerContent = (this.$container.usMod('valign') == 'center');
        if (this._events === undefined) {
            this._events = {}
        }
        $.extend(this._events, {
            resize: this.resize.bind(this)
        });
        if (this.centerContent || this.forceSquare || this.autoSize) {
            $us.$window.bind('resize load', this._events.resize);
            this.resize()
        }
        this.makeHoverable('.w-btn');
        $us.timeout(function() {
            this.$back.css('display', '');
            this.$yFlank.css('display', '');
            this.$xFlank.css('display', '');
            this.resize()
        }.bind(this), 250);
        $us.$canvas.on('contentChange', this._events.resize)
    };
    $us.WFlipBox.prototype = {
        resize: function() {
            var width = this.$container.width(),
                height;
            if (this.centerContent || this.autoSize || this.forceSquare) {
                this.padding = parseInt(this.$front.css('padding-top'))
            }
            if (this.autoSize || this.centerContent) {
                var frontContentHeight = this.$frontH.height(),
                    backContentHeight = this.$backH.height()
            }
            if (this.forceSquare || this.autoSize) {
                height = this.forceSquare ? width : (Math.max(frontContentHeight, backContentHeight) + 2 * this.padding);
                this.$front.css('height', height + 'px')
            } else {
                height = this.$container.height()
            }
            if (this.centerContent) {
                this.$front.css('padding-top', Math.max(this.padding, (height - frontContentHeight) / 2));
                this.$back.css('padding-top', Math.max(this.padding, (height - backContentHeight) / 2))
            }
        },
        makeHoverable: function(exclude) {
            if (this._events === undefined) {
                this._events = {}
            }
            if (jQuery.isMobile) {
                this._events.touchHoverStart = function() {
                    this.$container.toggleClass('hover')
                }.bind(this);
                this.$container.on('touchstart', this._events.touchHoverStart);
                if (exclude) {
                    this._events.touchHoverPrevent = function(e) {
                        e.stopPropagation()
                    };
                    this.$container.find(exclude).on('touchstart', this._events.touchHoverPrevent)
                }
            } else {
                this._mouseInside = !1;
                this._focused = !1;
                $.extend(this._events, {
                    mouseHoverStart: function() {
                        this.$container.addClass('hover');
                        this._mouseInside = !0
                    }.bind(this),
                    mouseHoverEnd: function() {
                        if (!this._focused) {
                            this.$container.removeClass('hover')
                        }
                        this._mouseInside = !1
                    }.bind(this),
                    focus: function() {
                        this.$container.addClass('hover');
                        this._focused = !0
                    }.bind(this),
                    blur: function() {
                        if (!this._mouseInside) {
                            this.$container.removeClass('hover')
                        }
                        this._focused = !1
                    }.bind(this)
                });
                this.$container.on('mouseenter', this._events.mouseHoverStart);
                this.$container.on('mouseleave', this._events.mouseHoverEnd);
                this.$focusable = this.$container.find('a').addBack('a');
                this.$focusable.on('focus', this._events.focus);
                this.$focusable.on('blur', this._events.blur)
            }
        }
    };
    $.fn.wFlipBox = function(options) {
        return this.each(function() {
            $(this).data('wFlipBox', new $us.WFlipBox(this, options))
        })
    };
    $(function() {
        $('.w-flipbox').wFlipBox()
    })
}(jQuery);
(function($, undefined) {
    "use strict";
    var _undefined = undefined;
    $us.WGrid = function(container, options) {
        this.init(container, options)
    };
    $us.WGrid.prototype = {
        init: function(container, options) {
            this.$container = $(container);
            this.$filters = $('.g-filters-item', this.$container);
            this.$items = $('.w-grid-item', this.$container);
            this.$list = $('.w-grid-list', this.$container);
            this.$loadmore = $('.g-loadmore', this.$container);
            this.$pagination = $('> .pagination', this.$container);
            this.$preloader = $('.w-grid-preloader', this.$container);
            this.$style = $('> style:first', this.$container);
            this.loading = !1;
            this.changeUpdateState = !1;
            this.gridFilter = null;
            this.noResultsHideGrid = !1;
            if (this.$container.is('[data-no_results_hide_grid]')) {
                this.$container.removeAttr('data-no_results_hide_grid');
                this.noResultsHideGrid = !0
            }
            this.curFilterTaxonomy = '';
            this.paginationType = this.$pagination.length ? 'regular' : (this.$loadmore.length ? 'ajax' : 'none');
            this.filterTaxonomyName = this.$list.data('filter_taxonomy_name') ? this.$list.data('filter_taxonomy_name') : 'category';
            if (this.$container.data('gridInit') == 1) {
                return
            }
            this.$container.data('gridInit', 1);
            var $jsonContainer = $('.w-grid-json', this.$container);
            if ($jsonContainer.length && $jsonContainer.is('[onclick]')) {
                this.ajaxData = $jsonContainer[0].onclick() || {};
                this.ajaxUrl = this.ajaxData.ajax_url || '';
                if (!$us.usbPreview) $jsonContainer.remove()
            } else {
                this.ajaxData = {};
                this.ajaxUrl = ''
            }
            this.carouselSettings = this.ajaxData.carousel_settings;
            this.breakpoints = this.ajaxData.carousel_breakpoints || {};
            if ($us.detectIE() == 11) {
                $us.getScript($us.templateDirectoryUri + '/common/js/vendor/objectFitPolyfill.js', function() {
                    objectFitPolyfill()
                })
            }
            if (this.$list.hasClass('owl-carousel')) {
                $us.getScript($us.templateDirectoryUri + '/common/js/vendor/owl.carousel.js', function() {
                    this.carouselOptions = {
                        autoHeight: this.carouselSettings.autoHeight,
                        autoplay: this.carouselSettings.autoplay,
                        autoplayHoverPause: !0,
                        autoplayTimeout: this.carouselSettings.timeout,
                        center: this.carouselSettings.center,
                        dots: this.carouselSettings.dots,
                        items: parseInt(this.carouselSettings.items),
                        loop: this.carouselSettings.loop,
                        mouseDrag: !jQuery.isMobile,
                        nav: this.carouselSettings.nav,
                        navElement: 'div',
                        navText: ['', ''],
                        responsive: {},
                        rewind: !this.carouselSettings.loop,
                        stagePadding: 0,
                        rtl: $('.l-body').hasClass('rtl'),
                        slideBy: this.carouselSettings.slideby,
                        slideTransition: this.carouselSettings.transition,
                        smartSpeed: this.carouselSettings.speed
                    };
                    if (this.carouselSettings.smooth_play == 1) {
                        this.carouselOptions.slideTransition = 'linear';
                        this.carouselOptions.autoplaySpeed = this.carouselSettings.timeout;
                        this.carouselOptions.slideBy = 1
                    }
                    if (this.carouselSettings.carousel_fade) {
                        $.extend(this.carouselOptions, {
                            animateOut: 'fadeOut',
                            animateIn: 'fadeIn',
                        })
                    }
                    $.each(this.breakpoints, function(breakpointWidth, breakpointArgs) {
                        if (breakpointArgs !== _undefined && breakpointArgs.items !== _undefined) {
                            this.carouselOptions.responsive[breakpointWidth] = breakpointArgs;
                            this.carouselOptions.responsive[breakpointWidth].items = parseInt(breakpointArgs.items)
                        }
                    }.bind(this));
                    this.$list.on('initialized.owl.carousel', function(e) {
                        var $list = $(this);
                        $('[data-toggle-height]', e.currentTarget).each(function(_, item) {
                            var usToggle = $(item).data('usToggleMoreContent');
                            if (usToggle instanceof $us.ToggleMoreContent) {
                                usToggle.initHeightCheck();
                                $us.timeout(function() {
                                    $list.trigger('refresh.owl.carousel')
                                }, 1)
                            }
                        });
                        if ($.isMobile && $list.closest('.w-tabs-section.active').length) {
                            $us.timeout(function() {
                                $list.trigger('refresh.owl.carousel')
                            }, 50)
                        }
                    }).on('mousedown.owl.core', function() {
                        var $target = $(this);
                        if ($('[data-toggle-height]', $target).length && !jQuery.isMobile) {
                            var owlCarousel = $target.data('owl.carousel');
                            owlCarousel.$stage.off('mousedown.owl.core')
                        }
                    });
                    this.$list.owlCarousel(this.carouselOptions)
                }.bind(this))
            }
            if (this.$container.hasClass('popup_page')) {
                if (this.ajaxData == _undefined) {
                    return
                }
                this.lightboxTimer = null;
                this.$lightboxOverlay = this.$container.find('.l-popup-overlay');
                this.$lightboxWrap = this.$container.find('.l-popup-wrap');
                this.$lightboxBox = this.$container.find('.l-popup-box');
                this.$lightboxContent = this.$container.find('.l-popup-box-content');
                this.$lightboxContentPreloader = this.$lightboxContent.find('.g-preloader');
                this.$lightboxContentFrame = this.$container.find('.l-popup-box-content-frame');
                this.$lightboxNextArrow = this.$container.find('.l-popup-arrow.to_next');
                this.$lightboxPrevArrow = this.$container.find('.l-popup-arrow.to_prev');
                this.$container.find('.l-popup-closer').click(function() {
                    this.hideLightbox()
                }.bind(this));
                this.$container.find('.l-popup-box').click(function() {
                    this.hideLightbox()
                }.bind(this));
                this.$container.find('.l-popup-box-content').click(function(e) {
                    e.stopPropagation()
                }.bind(this));
                this.originalURL = window.location.href;
                this.lightboxOpened = !1;
                if (this.$list.hasClass('owl-carousel')) {
                    $us.getScript($us.templateDirectoryUri + '/common/js/vendor/owl.carousel.js', function() {
                        this.initLightboxAnchors()
                    }.bind(this))
                } else {
                    this.initLightboxAnchors()
                }
                $(window).on('resize', function() {
                    if (this.lightboxOpened && $us.$window.width() < $us.canvasOptions.disableEffectsWidth) {
                        this.hideLightbox()
                    }
                }.bind(this))
            }
            if (this.$list.hasClass('owl-carousel')) {
                return
            }
            if (this.paginationType != 'none' || this.$filters.length) {
                if (this.ajaxData == _undefined) {
                    return
                }
                this.templateVars = this.ajaxData.template_vars || {};
                if (this.filterTaxonomyName) {
                    this.initialFilterTaxonomy = this.$list.data('filter_default_taxonomies') ? this.$list.data('filter_default_taxonomies').toString().split(',') : '';
                    this.curFilterTaxonomy = this.initialFilterTaxonomy
                }
                this.curPage = this.ajaxData.current_page || 1;
                this.infiniteScroll = this.ajaxData.infinite_scroll || 0
            }
            if (this.$container.hasClass('with_isotope')) {
                $us.getScript($us.templateDirectoryUri + '/common/js/vendor/isotope.js', function() {
                    this.$list.imagesLoaded(function() {
                        var smallestItemSelector, isotopeOptions = {
                            itemSelector: '.w-grid-item',
                            layoutMode: (this.$container.hasClass('isotope_fit_rows')) ? 'fitRows' : 'masonry',
                            isOriginLeft: !$('.l-body').hasClass('rtl'),
                            transitionDuration: 0
                        };
                        if (this.$list.find('.size_1x1').length) {
                            smallestItemSelector = '.size_1x1'
                        } else if (this.$list.find('.size_1x2').length) {
                            smallestItemSelector = '.size_1x2'
                        } else if (this.$list.find('.size_2x1').length) {
                            smallestItemSelector = '.size_2x1'
                        } else if (this.$list.find('.size_2x2').length) {
                            smallestItemSelector = '.size_2x2'
                        }
                        if (smallestItemSelector) {
                            smallestItemSelector = smallestItemSelector || '.w-grid-item';
                            isotopeOptions.masonry = {
                                columnWidth: smallestItemSelector
                            }
                        }
                        this.$list.on('layoutComplete', function() {
                            if (window.USAnimate) {
                                $('.w-grid-item.off_autostart', this.$list).removeClass('off_autostart');
                                new USAnimate(this.$list)
                            }
                            $us.$window.trigger('scroll.waypoints')
                        }.bind(this));
                        this.$list.isotope(isotopeOptions);
                        if (this.paginationType == 'ajax') {
                            this.initAjaxPagination()
                        }
                        $us.$canvas.on('contentChange', function() {
                            this.$list.imagesLoaded(function() {
                                this.$list.isotope('layout')
                            }.bind(this))
                        }.bind(this))
                    }.bind(this))
                }.bind(this))
            } else if (this.paginationType == 'ajax') {
                this.initAjaxPagination()
            }
            this.$filters.each(function(index, filter) {
                var $filter = $(filter),
                    taxonomy = $filter.data('taxonomy');
                $filter.on('click', function() {
                    if (taxonomy != this.curFilterTaxonomy) {
                        if (this.loading) {
                            return
                        }
                        this.setState(1, taxonomy);
                        this.$filters.removeClass('active');
                        $filter.addClass('active')
                    }
                }.bind(this))
            }.bind(this));
            if (this.$container.closest('.l-main').length) {
                $us.$body.on('us_grid.updateState', this._events.updateState.bind(this)).on('us_grid.updateOrderBy', this._events.updateOrderBy.bind(this))
            }
            this.$list.on('click', '[ref=magnificPopup]', this._events.initMagnificPopup.bind(this))
        },
        _events: {
            updateState: function(e, params, page, gridFilter) {
                if (!this.$container.is('[data-filterable="true"]') || !this.$container.hasClass('used_by_grid_filter')) {
                    return
                }
                page = page || 1;
                this.changeUpdateState = !0;
                this.gridFilter = gridFilter;
                if (this.ajaxData === _undefined) {
                    this.ajaxData = {}
                }
                if (!this.hasOwnProperty('templateVars')) {
                    this.templateVars = this.ajaxData.template_vars || {
                        query_args: {}
                    }
                }
                this.templateVars.us_grid_filter_params = params;
                if (this.templateVars.query_args !== !1) {
                    this.templateVars.query_args.paged = page
                }
                this.templateVars.filters_args = gridFilter.filtersArgs || {};
                this.setState(page);
                if (this.paginationType === 'regular' && /page(=|\/)/.test(location.href)) {
                    var url = location.href.replace(/(page(=|\/))(\d+)(\/?)/, '$1' + page + '$2');
                    history.replaceState(document.title, document.title, url)
                }
            },
            updateOrderBy: function(e, orderby, page, gridOrder) {
                if (!this.$container.is('[data-filterable="true"]') || !this.$container.hasClass('used_by_grid_order')) {
                    return
                }
                page = page || 1;
                this.changeUpdateState = !0;
                if (!this.hasOwnProperty('templateVars')) {
                    this.templateVars = this.ajaxData.template_vars || {
                        query_args: {}
                    }
                }
                if (this.templateVars.query_args !== !1) {
                    this.templateVars.query_args.paged = page
                }
                this.templateVars.grid_orderby = orderby;
                this.setState(page)
            },
            initMagnificPopup: function(e) {
                e.stopPropagation();
                e.preventDefault();
                var $target = $(e.currentTarget);
                if ($target.data('magnificPopup') === _undefined) {
                    $target.magnificPopup({
                        type: 'image',
                        mainClass: 'mfp-fade'
                    });
                    $target.trigger('click')
                }
            }
        },
        initLightboxAnchors: function() {
            this.$anchors = this.$list.find('.w-grid-item-anchor');
            this.$anchors.on('click', function(e) {
                var $clicked = $(e.target),
                    $item = $clicked.closest('.w-grid-item'),
                    $anchor = $item.find('.w-grid-item-anchor'),
                    itemUrl = $anchor.attr('href');
                if (!$item.hasClass('custom-link')) {
                    if ($us.$window.width() >= $us.canvasOptions.disableEffectsWidth) {
                        e.stopPropagation();
                        e.preventDefault();
                        this.openLightboxItem(itemUrl, $item)
                    }
                }
            }.bind(this))
        },
        initAjaxPagination: function() {
            this.$loadmore.on('click', function() {
                if (this.curPage < this.ajaxData.max_num_pages) {
                    this.setState(this.curPage + 1)
                }
            }.bind(this));
            if (this.infiniteScroll) {
                $us.waypoints.add(this.$loadmore, '-70%', function() {
                    if (!this.loading) {
                        this.$loadmore.click()
                    }
                }.bind(this))
            }
        },
        setState: function(page, taxonomy) {
            if (this.loading && !this.changeUpdateState) {
                return
            }
            if (page !== 1 && this.paginationType == 'ajax' && this.none !== _undefined && this.none == !0) {
                return
            }
            this.none = !1;
            this.loading = !0;
            var $none = this.$container.find('> .w-grid-none');
            if ($none.length) {
                $none.hide()
            }
            if (this.$filters.length && !this.changeUpdateState) {
                taxonomy = taxonomy || this.curFilterTaxonomy;
                if (taxonomy == '*') {
                    taxonomy = this.initialFilterTaxonomy
                }
                if (taxonomy != '') {
                    var newTaxArgs = {
                            'taxonomy': this.filterTaxonomyName,
                            'field': 'slug',
                            'terms': taxonomy
                        },
                        taxQueryFound = !1;
                    if (this.templateVars.query_args.tax_query == _undefined) {
                        this.templateVars.query_args.tax_query = []
                    } else {
                        $.each(this.templateVars.query_args.tax_query, function(index, taxArgs) {
                            if (taxArgs != null && taxArgs.taxonomy == this.filterTaxonomyName) {
                                this.templateVars.query_args.tax_query[index] = newTaxArgs;
                                taxQueryFound = !0;
                                return !1
                            }
                        }.bind(this))
                    }
                    if (!taxQueryFound) {
                        this.templateVars.query_args.tax_query.push(newTaxArgs)
                    }
                } else if (this.templateVars.query_args.tax_query != _undefined) {
                    $.each(this.templateVars.query_args.tax_query, function(index, taxArgs) {
                        if (taxArgs != null && taxArgs.taxonomy == this.filterTaxonomyName) {
                            this.templateVars.query_args.tax_query[index] = null;
                            return !1
                        }
                    }.bind(this))
                }
            }
            this.templateVars.query_args.paged = page;
            if (this.paginationType == 'ajax') {
                if (page == 1) {
                    this.$loadmore.addClass('done')
                } else {
                    this.$loadmore.addClass('loading')
                }
                if (!this.infiniteScroll) {
                    this.prevScrollTop = $us.$window.scrollTop()
                }
            }
            if (this.paginationType != 'ajax' || page == 1) {
                this.$preloader.addClass('active');
                if (this.$list.data('isotope')) {
                    this.$list.isotope('remove', this.$container.find('.w-grid-item'));
                    this.$list.isotope('layout')
                } else {
                    this.$container.find('.w-grid-item').remove()
                }
            }
            this.ajaxData.template_vars = JSON.stringify(this.templateVars);
            var isotope = this.$list.data('isotope');
            if (isotope && page == 1) {
                this.$list.html('');
                isotope.remove(isotope.items);
                isotope.reloadItems()
            }
            if (this.xhr !== _undefined) {
                this.xhr.abort()
            }
            this.xhr = $.ajax({
                type: 'post',
                url: this.ajaxData.ajax_url,
                data: this.ajaxData,
                success: function(html) {
                    var $result = $(html),
                        $container = $('.w-grid-list', $result),
                        $pagination = $('.pagination > *', $result),
                        $items = $container.children(),
                        smallestItemSelector;
                    this.$container.toggleClass('no_results_hide_grid', (this.noResultsHideGrid && !$items.length));
                    $container.imagesLoaded(function() {
                        this.beforeAppendItems($items);
                        $items.appendTo(this.$list);
                        $container.html('');
                        var $sliders = $items.find('.w-slider');
                        this.afterAppendItems($items);
                        if (isotope) {
                            isotope.insert($items);
                            isotope.reloadItems()
                        }
                        if ($sliders.length) {
                            $us.getScript($us.templateDirectoryUri + '/common/js/vendor/royalslider.js', function() {
                                $sliders.each(function(index, slider) {
                                    $(slider).wSlider().find('.royalSlider').data('royalSlider').ev.on('rsAfterInit', function() {
                                        if (isotope) {
                                            this.$list.isotope('layout')
                                        }
                                    })
                                }.bind(this))
                            }.bind(this))
                        }
                        if (isotope) {
                            if (this.$list.find('.size_1x1').length) {
                                smallestItemSelector = '.size_1x1'
                            } else if (this.$list.find('.size_1x2').length) {
                                smallestItemSelector = '.size_1x2'
                            } else if (this.$list.find('.size_2x1').length) {
                                smallestItemSelector = '.size_2x1'
                            } else if (this.$list.find('.size_2x2').length) {
                                smallestItemSelector = '.size_2x2'
                            }
                            if (isotope.options.masonry) {
                                isotope.options.masonry.columnWidth = smallestItemSelector || '.w-grid-item'
                            }
                            this.$list.isotope('layout');
                            this.$list.trigger('layoutComplete')
                        }
                        if (this.paginationType == 'ajax') {
                            if ($items.find('.w-tabs').length > 0) {
                                $('.w-tabs', $items).each(function() {
                                    $(this).wTabs()
                                })
                            }
                            if ($items.find('.w-video').length > 0) {
                                $('.w-video', $items).each(function() {
                                    $(this).wVideo()
                                })
                            }
                            if (page == 1) {
                                var $jsonContainer = $result.find('.w-grid-json');
                                if ($jsonContainer.length) {
                                    var ajaxData = $jsonContainer[0].onclick() || {};
                                    this.ajaxData.max_num_pages = ajaxData.max_num_pages || this.ajaxData.max_num_pages
                                } else {
                                    this.ajaxData.max_num_pages = 1
                                }
                            }
                            if (this.templateVars.query_args.paged >= this.ajaxData.max_num_pages || !$items.length) {
                                this.$loadmore.addClass('done')
                            } else {
                                this.$loadmore.removeClass('done');
                                this.$loadmore.removeClass('loading')
                            }
                            if (this.infiniteScroll) {
                                $us.waypoints.add(this.$loadmore, '-70%', function() {
                                    if (!this.loading) {
                                        this.$loadmore.click()
                                    }
                                }.bind(this))
                            } else if (Math.round(this.prevScrollTop) != Math.round($us.$window.scrollTop())) {
                                $us.$window.scrollTop(this.prevScrollTop)
                            }
                            if ($us.detectIE() == 11) {
                                objectFitPolyfill()
                            }
                        } else if (this.paginationType === 'regular' && this.changeUpdateState) {
                            $('a[href]', $pagination).each(function(_, item) {
                                var $item = $(item),
                                    pathname = location.pathname.replace(/((\/page.*)?)\/$/, '');
                                $item.attr('href', pathname + $item.attr('href'))
                            });
                            this.$pagination.html($pagination)
                        }
                        if (this.$container.hasClass('popup_page')) {
                            $.each($items, function(index, item) {
                                var $loadedItem = $(item),
                                    $anchor = $loadedItem.find('.w-grid-item-anchor'),
                                    itemUrl = $anchor.attr('href');
                                if (!$loadedItem.hasClass('custom-link')) {
                                    $anchor.click(function(e) {
                                        if ($us.$window.width() >= $us.canvasOptions.disableEffectsWidth) {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            this.openLightboxItem(itemUrl, $loadedItem)
                                        }
                                    }.bind(this))
                                }
                            }.bind(this))
                        }
                        if (this.changeUpdateState && $result.find('.w-grid-none').length) {
                            if (!$none.length) {
                                this.$container.prepend($result.find('.w-grid-none'))
                            } else {
                                $none.show()
                            }
                            this.none = !0
                        }
                        if (this.changeUpdateState && this.gridFilter) {
                            var $jsonData = $result.filter('.w-grid-filter-json-data:first');
                            if ($jsonData.length) {
                                this.gridFilter.trigger('us_grid_filter.update-items-amount', $jsonData[0].onclick() || {})
                            }
                            $jsonData.remove()
                        }
                        var customStyles = $('style#grid-post-content-css', $result).html() || '';
                        if (customStyles) {
                            if (!this.$style.length) {
                                this.$style = $('<style></style>');
                                this.$container.append(this.$style)
                            }
                            this.$style.text(this.$style.text() + customStyles)
                        }
                        $us.$canvas.resize();
                        this.$preloader.removeClass('active');
                        if (window.USAnimate && this.$container.is('.with_css_animation')) {
                            new USAnimate(this.$container)
                        }
                    }.bind(this));
                    this.loading = !1;
                    this.$container.trigger('USGridItemsLoaded')
                }.bind(this),
                error: function() {
                    this.$loadmore.removeClass('loading')
                }.bind(this)
            });
            this.curPage = page;
            this.curFilterTaxonomy = taxonomy
        },
        _hasScrollbar: function() {
            return document.documentElement.scrollHeight > document.documentElement.clientHeight
        },
        _getScrollbarSize: function() {
            if ($us.scrollbarSize === _undefined) {
                var scrollDiv = document.createElement('div');
                scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
                document.body.appendChild(scrollDiv);
                $us.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
                document.body.removeChild(scrollDiv)
            }
            return $us.scrollbarSize
        },
        openLightboxItem: function(itemUrl, $item) {
            this.showLightbox();
            var prevIndex, nextIndex, currentIndex = 0,
                items = this.$items.filter(':visible:not(.custom-link)').toArray();
            for (var i in items) {
                if ($item.is(items[i])) {
                    currentIndex = parseInt(i);
                    break
                }
            }
            if (currentIndex > 0) {
                prevIndex = currentIndex - 1
            }
            if (currentIndex < items.length) {
                nextIndex = currentIndex + 1
            }
            var $prevItem = $($.isNumeric(prevIndex) ? items[prevIndex] : ''),
                $nextItem = $($.isNumeric(nextIndex) ? items[nextIndex] : '');
            if ($nextItem.length > 0) {
                this.$lightboxNextArrow.show();
                this.$lightboxNextArrow.attr('title', $nextItem.find('.w-grid-item-title').text());
                this.$lightboxNextArrow.off('click').click(function(e) {
                    var $nextItemAnchor = $nextItem.find('.w-grid-item-anchor'),
                        nextItemUrl = $nextItemAnchor.attr('href');
                    e.stopPropagation();
                    e.preventDefault();
                    this.openLightboxItem(nextItemUrl, $nextItem)
                }.bind(this))
            } else {
                this.$lightboxNextArrow.attr('title', '');
                this.$lightboxNextArrow.hide()
            }
            if ($prevItem.length > 0) {
                this.$lightboxPrevArrow.show();
                this.$lightboxPrevArrow.attr('title', $prevItem.find('.w-grid-item-title').text());
                this.$lightboxPrevArrow.off('click').on('click', function(e) {
                    var $prevItemAnchor = $prevItem.find('.w-grid-item-anchor'),
                        prevItemUrl = $prevItemAnchor.attr('href');
                    e.stopPropagation();
                    e.preventDefault();
                    this.openLightboxItem(prevItemUrl, $prevItem)
                }.bind(this))
            } else {
                this.$lightboxPrevArrow.attr('title', '');
                this.$lightboxPrevArrow.hide()
            }
            if (itemUrl.indexOf('?') !== -1) {
                this.$lightboxContentFrame.attr('src', itemUrl + '&us_iframe=1')
            } else {
                this.$lightboxContentFrame.attr('src', itemUrl + '?us_iframe=1')
            }
            if (history.replaceState) {
                history.replaceState(null, null, itemUrl)
            }
            this.$lightboxContentFrame.off('load').on('load', function() {
                this.lightboxContentLoaded()
            }.bind(this))
        },
        lightboxContentLoaded: function() {
            this.$lightboxContentPreloader.css('display', 'none');
            this.$lightboxContentFrame.contents().find('body').off('keyup.usCloseLightbox').on('keyup.usCloseLightbox', function(e) {
                if (e.key === "Escape") {
                    this.hideLightbox()
                }
            }.bind(this))
        },
        showLightbox: function() {
            clearTimeout(this.lightboxTimer);
            this.$lightboxOverlay.appendTo($us.$body).show();
            this.$lightboxWrap.appendTo($us.$body).show();
            this.lightboxOpened = !0;
            this.$lightboxContentPreloader.css('display', 'block');
            $us.$html.addClass('usoverlay_fixed');
            if (!$.isMobile) {
                this.windowHasScrollbar = this._hasScrollbar();
                if (this.windowHasScrollbar && this._getScrollbarSize()) {
                    $us.$html.css('margin-right', this._getScrollbarSize())
                }
            }
            this.lightboxTimer = setTimeout(function() {
                this.afterShowLightbox()
            }.bind(this), 25)
        },
        afterShowLightbox: function() {
            clearTimeout(this.lightboxTimer);
            this.$container.on('keyup', function(e) {
                if (this.$container.hasClass('popup_page')) {
                    if (e.key === "Escape") {
                        this.hideLightbox()
                    }
                }
            }.bind(this));
            this.$lightboxOverlay.addClass('active');
            this.$lightboxBox.addClass('active');
            $us.$canvas.trigger('contentChange');
            $us.$window.trigger('resize')
        },
        hideLightbox: function() {
            clearTimeout(this.lightboxTimer);
            this.lightboxOpened = !1;
            this.$lightboxOverlay.removeClass('active');
            this.$lightboxBox.removeClass('active');
            if (history.replaceState) {
                history.replaceState(null, null, this.originalURL)
            }
            this.lightboxTimer = setTimeout(function() {
                this.afterHideLightbox()
            }.bind(this), 500)
        },
        afterHideLightbox: function() {
            this.$container.off('keyup');
            clearTimeout(this.lightboxTimer);
            this.$lightboxOverlay.appendTo(this.$container).hide();
            this.$lightboxWrap.appendTo(this.$container).hide();
            this.$lightboxContentFrame.attr('src', 'about:blank');
            $us.$html.removeClass('usoverlay_fixed');
            if (!$.isMobile) {
                if (this.windowHasScrollbar) {
                    $us.$html.css('margin-right', '')
                }
            }
        },
        beforeAppendItems: function($items) {
            if ($('[data-toggle-height]', $items).length) {
                var handle = $us.timeout(function() {
                    $('[data-toggle-height]', $items).usToggleMoreContent();
                    $us.clearTimeout(handle)
                }, 1)
            }
        },
        afterAppendItems: function($items) {}
    };
    $.fn.wGrid = function(options) {
        return this.each(function() {
            $(this).data('wGrid', new $us.WGrid(this, options))
        })
    };
    $(function() {
        $('.w-grid').wGrid()
    });
    $('.w-grid-list').each(function() {
        var $list = $(this);
        if (!$list.find('[ref=magnificPopupGrid]').length) {
            return
        }
        $us.getScript($us.templateDirectoryUri + '/common/js/vendor/magnific-popup.js', function() {
            var delegateStr = 'a[ref=magnificPopupGrid]:visible',
                popupOptions;
            if ($list.hasClass('owl-carousel')) {
                delegateStr = '.owl-item:not(.cloned) a[ref=magnificPopupGrid]'
            }
            popupOptions = {
                type: 'image',
                delegate: delegateStr,
                gallery: {
                    enabled: !0,
                    navigateByImgClick: !0,
                    preload: [0, 1],
                    tPrev: $us.langOptions.magnificPopup.tPrev,
                    tNext: $us.langOptions.magnificPopup.tNext,
                    tCounter: $us.langOptions.magnificPopup.tCounter
                },
                removalDelay: 300,
                mainClass: 'mfp-fade',
                fixedContentPos: !0,
                callbacks: {
                    beforeOpen: function() {
                        var owlCarousel = $list.data('owl.carousel');
                        if (owlCarousel && owlCarousel.settings.autoplay) {
                            $list.trigger('stop.owl.autoplay')
                        }
                    },
                    beforeClose: function() {
                        var owlCarousel = $list.data('owl.carousel');
                        if (owlCarousel && owlCarousel.settings.autoplay) {
                            $list.trigger('play.owl.autoplay')
                        }
                    }
                }
            };
            $list.magnificPopup(popupOptions);
            if ($list.hasClass('owl-carousel')) {
                $list.on('initialized.owl.carousel', function(initEvent) {
                    var $currentList = $(initEvent.currentTarget),
                        items = {};
                    $('.owl-item:not(.cloned)', $currentList).each(function(_, item) {
                        var $item = $(item),
                            id = $item.find('[data-id]').data('id');
                        if (!items.hasOwnProperty(id)) {
                            items[id] = $item
                        }
                    });
                    $currentList.on('click', '.owl-item.cloned', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var $target = $(e.currentTarget),
                            id = $target.find('[data-id]').data('id');
                        if (items.hasOwnProperty(id)) {
                            $('a[ref=magnificPopupGrid]', items[id]).trigger('click')
                        }
                    })
                })
            }
        })
    })
})(jQuery);
! function($, undefined) {
    "use strict";
    var _window = window;

    function USHeader(settings) {
        this.$container = $('.l-header', $us.$canvas);
        this.$showBtn = $('.w-header-show:first', $us.$body);
        this.settings = settings || {};
        this.state = 'default';
        this.$elms = {};
        this.canvasOffset = 0;
        this.bodyHeight = $us.$body.height();
        this.adminBarHeight = 0;
        if (this.$container.length === 0) {
            return
        }
        this.$places = {
            hidden: $('.l-subheader.for_hidden', this.$container)
        };
        this._states = {
            sticky: !1,
            sticky_auto_hide: !1,
            scroll_direction: 'down',
            vertical_scrollable: !1,
            init_height: this.getHeight()
        };
        this.pos = this.$container.usMod('pos');
        this.bg = this.$container.usMod('bg');
        this.shadow = this.$container.usMod('shadow');
        this.orientation = $us.$body.usMod('header');
        this.breakpoints = {
            laptops: 1280,
            tablets: 1024,
            mobiles: 600
        };
        for (var k in this.breakpoints) {
            this.breakpoints[k] = parseInt(((settings[k] || {}).options || {}).breakpoint) || this.breakpoints[k]
        }
        $('.l-subheader-cell', this.$container).each(function(_, place) {
            var $place = $(place),
                key = $place.parent().parent().usMod('at') + '_' + $place.usMod('at');
            this.$places[key] = $place
        }.bind(this));
        $('[class*=ush_]', this.$container).each(function(_, elm) {
            var $elm = $(elm),
                matches = /(^| )ush_([a-z_]+)_([0-9]+)(\s|$)/.exec(elm.className);
            if (!matches) {
                return
            }
            var id = matches[2] + ':' + matches[3];
            this.$elms[id] = $elm;
            if ($elm.is('.w-vwrapper, .w-hwrapper')) {
                this.$places[id] = $elm
            }
        }.bind(this));
        $us.$window.on('scroll', $us.debounce(this._events.scroll.bind(this), 10)).on('resize load', $us.debounce(this._events.resize.bind(this), 10));
        this.$container.on('contentChange', this._events.contentChange.bind(this));
        this.$showBtn.on('click', this._events.showBtn.bind(this));
        this.on('changeSticky', this._events._changeSticky.bind(this)).on('swichVerticalScrollable', this._events._swichVerticalScrollable.bind(this));
        this._events.resize.call(this);
        if (this.isStickyAutoHideEnabled()) {
            this.$container.addClass('sticky_auto_hide')
        }
        this.$container.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function() {
            $us.debounce(this.trigger.bind(this, 'transitionEnd'), 1)()
        }.bind(this))
    }
    $.extend(USHeader.prototype, $us.mixins.Events, {
        prevScrollTop: 0,
        currentStateIs: function(state) {
            return (state && (['default'].concat(Object.keys(this.breakpoints))).indexOf(state) !== -1 && this.state === state)
        },
        isVertical: function() {
            return this.orientation === 'ver'
        },
        isHorizontal: function() {
            return this.orientation === 'hor'
        },
        isFixed: function() {
            return this.pos === 'fixed'
        },
        isTransparent: function() {
            return this.bg === 'transparent'
        },
        _isWithinScrollBoundaries: function(scrollTop) {
            scrollTop = parseInt(scrollTop);
            return (scrollTop + _window.innerHeight >= $us.$document.height()) || scrollTop <= 0
        },
        isHidden: function() {
            return !!$us.header.settings.is_hidden
        },
        isStickyEnabled: function() {
            return this.settings[this.state].options.sticky || !1
        },
        isStickyAutoHideEnabled: function() {
            return this.isStickyEnabled() && (this.settings[this.state].options.sticky_auto_hide || !1)
        },
        isSticky: function() {
            return this._states.sticky || !1
        },
        isStickyAutoHidden: function() {
            return this._states.sticky_auto_hide || !1
        },
        getScrollDirection: function() {
            return this._states.scroll_direction || 'down'
        },
        getAdminBarHeight: function() {
            var wpAdminBar = document.getElementById('wpadminbar');
            return wpAdminBar ? wpAdminBar.offsetHeight : 0
        },
        getHeight: function() {
            var height = 0,
                beforeContent = getComputedStyle(this.$container.get(0), ':before').content;
            if (beforeContent && ['none', 'auto'].indexOf(beforeContent) === -1) {
                height = beforeContent.replace(/[^+\d]/g, '')
            }
            if (!height) {
                height = this.$container.outerHeight()
            }
            return !isNaN(height) ? parseInt(height) : 0
        },
        getInitHeight: function() {
            return parseInt(this._states.init_height) || this.getHeight()
        },
        getCurrentHeight: function() {
            var height = 0;
            if (this.isHorizontal() && (!this.currentStateIs('mobiles') || (this.adminBarHeight && this.adminBarHeight >= this.getScrollTop()))) {
                height += this.adminBarHeight
            }
            if (!this.isStickyAutoHidden()) {
                height += this.getHeight()
            }
            return height
        },
        getScrollTop: function() {
            return parseInt($us.$window.scrollTop()) || this.prevScrollTop
        },
        getOffsetTop: function() {
            var top = parseInt(this.$container.css('top'));
            return !isNaN(top) ? top : 0
        },
        isScrollAtTopPosition: function() {
            return parseInt($us.$window.scrollTop()) === 0
        },
        setState: function(state) {
            if (this.currentStateIs(state)) {
                return
            }
            var options = this.settings[state].options || {},
                orientation = options.orientation || 'hor',
                pos = ($us.toBool(options.sticky) ? 'fixed' : 'static'),
                bg = ($us.toBool(options.transparent) ? 'transparent' : 'solid'),
                shadow = options.shadow || 'thin';
            if (orientation === 'ver') {
                pos = 'fixed';
                bg = 'solid'
            }
            this._setOrientation(orientation);
            this._setPos(pos);
            this._setBg(bg);
            this._setShadow(shadow);
            this._setLayout(this.settings[state].layout || {});
            $us.$body.usMod('state', this.state = state);
            if (this.currentStateIs('default') || this.currentStateIs('laptops')) {
                $us.$body.removeClass('header-show')
            }
            if ($us.nav !== undefined) {
                $us.nav.resize()
            }
            if (this.isStickyAutoHideEnabled()) {
                this.$container.removeClass('down')
            }
        },
        _setPos: function(pos) {
            if (pos === this.pos) {
                return
            }
            this.$container.usMod('pos', this.pos = pos);
            if (this.pos === 'static') {
                this.trigger('changeSticky', !1)
            }
        },
        _setBg: function(bg) {
            if (bg != this.bg) {
                this.$container.usMod('bg', this.bg = bg)
            }
        },
        _setShadow: function(shadow) {
            if (shadow != this.shadow) {
                this.$container.usMod('shadow', this.shadow = shadow)
            }
        },
        _setLayout: function(layout) {
            for (var place in layout) {
                if (!layout[place] || !this.$places[place]) {
                    continue
                }
                this._placeElements(layout[place], this.$places[place])
            }
        },
        _setOrientation: function(orientation) {
            if (orientation != this.orientation) {
                $us.$body.usMod('header', this.orientation = orientation)
            }
        },
        _placeElements: function(elms, $place) {
            for (var i = 0; i < elms.length; i++) {
                var elmId;
                if (typeof elms[i] == 'object') {
                    elmId = elms[i][0];
                    if (!this.$places[elmId] || !this.$elms[elmId]) {
                        continue
                    }
                    this.$elms[elmId].appendTo($place);
                    this._placeElements(elms[i].shift(), this.$places[elmId])
                } else {
                    elmId = elms[i];
                    if (!this.$elms[elmId]) {
                        continue
                    }
                    this.$elms[elmId].appendTo($place)
                }
            }
        },
        _isVerticalScrollable: function() {
            if (!this.isVertical()) {
                return
            }
            if ((this.currentStateIs('default') || this.currentStateIs('laptops')) && this.isFixed()) {
                this.$container.addClass('scrollable');
                var headerHeight = this.getHeight(),
                    canvasHeight = parseInt($us.canvas.winHeight),
                    documentHeight = parseInt($us.$document.height());
                this.$container.removeClass('scrollable');
                if (headerHeight > canvasHeight) {
                    this.trigger('swichVerticalScrollable', !0)
                } else if (this._states.vertical_scrollable) {
                    this.trigger('swichVerticalScrollable', !1)
                }
                if (headerHeight > documentHeight) {
                    this.$container.css({
                        position: 'absolute',
                        top: 0
                    })
                }
            } else if (this._states.vertical_scrollable) {
                this.trigger('swichVerticalScrollable', !1)
            }
        },
        _events: {
            _swichVerticalScrollable: function(_, state) {
                this.$container.toggleClass('scrollable', this._states.vertical_scrollable = !!state);
                if (!this._states.vertical_scrollable) {
                    this.$container.resetInlineCSS('position', 'top', 'bottom');
                    delete this._headerScrollRange
                }
            },
            _changeSticky: function(_, state) {
                this._states.sticky = !!state;
                var currentHeight = this.getCurrentHeight();
                $us.debounce(function() {
                    this.$container.toggleClass('sticky', this._states.sticky).resetInlineCSS('position', 'top', 'bottom');
                    if (currentHeight == this.getCurrentHeight()) {
                        this.trigger('transitionEnd')
                    }
                }.bind(this), 10)()
            },
            contentChange: function() {
                this._isVerticalScrollable.call(this)
            },
            showBtn: function(e) {
                if ($us.$body.hasClass('header-show')) {
                    return
                }
                e.stopPropagation();
                $us.$body.addClass('header-show').on(($.isMobile ? 'touchstart' : 'click'), this._events.hideMobileVerticalHeader.bind(this))
            },
            hideMobileVerticalHeader: function(e) {
                if ($.contains(this.$container[0], e.target)) {
                    return
                }
                $us.$body.off(($.isMobile ? 'touchstart' : 'click'), this._events.hideMobileVerticalHeader.bind(this));
                $us.timeout(function() {
                    $us.$body.removeClass('header-show')
                }, 10)
            },
            scroll: function() {
                var scrollTop = this.getScrollTop(),
                    headerAbovePosition = ($us.canvas.headerInitialPos === 'above');
                if (this.prevScrollTop != scrollTop) {
                    this._states.scroll_direction = (this.prevScrollTop <= scrollTop) ? 'down' : 'up'
                }
                this.prevScrollTop = scrollTop;
                if (this.isScrollAtTopPosition()) {
                    this._states.scroll_direction = 'up'
                }
                if (this.isStickyAutoHideEnabled() && this.isSticky() && !this._isWithinScrollBoundaries(scrollTop) && !headerAbovePosition) {
                    this._states.sticky_auto_hide = (this.getScrollDirection() === 'down');
                    this.$container.toggleClass('down', this._states.sticky_auto_hide)
                }
                if (!this.isFixed()) {
                    return
                }
                var headerAttachedFirstSection = ['bottom', 'below'].indexOf($us.canvas.headerInitialPos) !== -1;
                if (this.isHorizontal() && (headerAbovePosition || (headerAttachedFirstSection && (this.currentStateIs('tablets') || this.currentStateIs('mobiles'))) || !headerAttachedFirstSection)) {
                    if (this.isStickyEnabled()) {
                        var scrollBreakpoint = parseInt(this.settings[this.state].options.scroll_breakpoint) || 100,
                            isSticky = scrollTop >= scrollBreakpoint;
                        if (isSticky != this.isSticky()) {
                            this.trigger('changeSticky', isSticky)
                        }
                    }
                    if (this.isSticky()) {
                        $us.debounce(function() {
                            if (!$us.$window.scrollTop()) {
                                this.trigger('changeSticky', !1)
                            }
                        }.bind(this), 1)()
                    }
                }
                if (this.isHorizontal() && headerAttachedFirstSection && !headerAbovePosition && (this.currentStateIs('default') || this.currentStateIs('laptops'))) {
                    var top = ($us.canvas.getHeightFirstSection() + this.adminBarHeight);
                    if ($us.canvas.headerInitialPos == 'bottom') {
                        top -= this.getInitHeight()
                    }
                    if (this.isStickyEnabled()) {
                        var isSticky = scrollTop >= top;
                        if (isSticky != this.isSticky()) {
                            $us.debounce(function() {
                                this.trigger('changeSticky', isSticky)
                            }.bind(this), 1)()
                        }
                    }
                    if (!this.isSticky() && top != this.getOffsetTop()) {
                        this.$container.css('top', top)
                    }
                }
                if (this.isVertical() && !headerAttachedFirstSection && !headerAbovePosition && this._states.vertical_scrollable) {
                    var headerHeight = this.getHeight(),
                        documentHeight = parseInt($us.$document.height());
                    if (documentHeight > headerHeight) {
                        var canvasHeight = parseInt($us.canvas.winHeight) + this.canvasOffset,
                            scrollRangeDiff = (headerHeight - canvasHeight),
                            cssProps;
                        if (this._headerScrollRange === undefined) {
                            this._headerScrollRange = [0, scrollRangeDiff]
                        }
                        if (this.bodyHeight > headerHeight) {
                            if (scrollTop < this._headerScrollRange[0]) {
                                this._headerScrollRange[0] = Math.max(0, scrollTop);
                                this._headerScrollRange[1] = (this._headerScrollRange[0] + scrollRangeDiff);
                                cssProps = {
                                    position: 'fixed',
                                    top: this.adminBarHeight
                                }
                            } else if (this._headerScrollRange[0] < scrollTop && scrollTop < this._headerScrollRange[1]) {
                                cssProps = {
                                    position: 'absolute',
                                    top: this._headerScrollRange[0]
                                }
                            } else if (this._headerScrollRange[1] <= scrollTop) {
                                this._headerScrollRange[1] = Math.min(documentHeight - canvasHeight, scrollTop);
                                this._headerScrollRange[0] = (this._headerScrollRange[1] - scrollRangeDiff);
                                cssProps = {
                                    position: 'fixed',
                                    top: (canvasHeight - headerHeight)
                                }
                            }
                        } else {
                            cssProps = {
                                position: 'absolute',
                                top: this.adminBarHeight,
                            }
                        }
                        if (cssProps) {
                            this.$container.css(cssProps)
                        }
                    }
                }
            },
            resize: function() {
                var newState = 'default';
                for (var state in this.breakpoints) {
                    if (_window.innerWidth <= this.breakpoints[state]) {
                        newState = state
                    } else {
                        break
                    }
                }
                this.setState(newState || 'default');
                this.canvasOffset = $us.$window.outerHeight() - $us.$window.innerHeight();
                this.bodyHeight = $us.$body.height();
                this.adminBarHeight = this.getAdminBarHeight();
                if (this.isFixed() && this.isHorizontal()) {
                    this.$container.addClass('notransition');
                    $us.timeout(function() {
                        this.$container.removeClass('notransition')
                    }.bind(this), 50)
                }
                this._isVerticalScrollable.call(this);
                this._events.scroll.call(this)
            }
        }
    });
    $us.header = new USHeader($us.headerSettings || {})
}(window.jQuery);
(function($) {
    $.fn.wSlider = function() {
        return this.each(function() {
            var $this = $(this),
                $frame = $this.find('.w-slider-h'),
                $slider = $this.find('.royalSlider'),
                $options = $this.find('.w-slider-json'),
                options = $options[0].onclick() || {};
            if ($this.data('sliderInit') == 1) {
                return
            }
            $this.data('sliderInit', 1);
            $us.getScript($us.templateDirectoryUri + '/common/js/vendor/royalslider.js', function() {
                $options.remove();
                if (!$.fn.royalSlider) {
                    return
                }
                if ($this.parent().hasClass('w-post-elm')) {
                    options.imageScaleMode = 'fill'
                }
                options.usePreloader = !1;
                $slider.royalSlider(options);
                var slider = $slider.data('royalSlider');
                if (options.fullscreen && options.fullscreen.enabled) {
                    var rsEnterFullscreen = function() {
                        $slider.appendTo($('body'));
                        slider.ev.off('rsEnterFullscreen', rsEnterFullscreen);
                        slider.ev.on('rsExitFullscreen', rsExitFullscreen);
                        slider.updateSliderSize()
                    };
                    slider.ev.on('rsEnterFullscreen', rsEnterFullscreen);
                    var rsExitFullscreen = function() {
                        $slider.prependTo($frame);
                        slider.ev.off('rsExitFullscreen', rsExitFullscreen);
                        slider.ev.on('rsEnterFullscreen', rsEnterFullscreen)
                    }
                }
                slider.ev.on('rsAfterContentSet', function() {
                    slider.slides.forEach(function(slide) {
                        $(slide.content.find('img')[0]).attr('alt', slide.caption.attr('data-alt'))
                    })
                });
                $us.$canvas.on('contentChange', function() {
                    $slider.parent().imagesLoaded(function() {
                        slider.updateSliderSize()
                    })
                })
            })
        })
    };
    $(function() {
        jQuery('.w-slider').wSlider()
    })
})(jQuery);
! function($) {
    $us.Nav = function(container, options) {
        this.init(container, options)
    };
    $us.mobileNavOpened = 0;
    $us.Nav.prototype = {
        init: function(container, options) {
            this.$nav = $(container);
            if (this.$nav.length == 0) {
                return
            }
            this.$control = this.$nav.find('.w-nav-control');
            this.$close = this.$nav.find('.w-nav-close');
            this.$items = this.$nav.find('.menu-item');
            this.$list = this.$nav.find('.w-nav-list.level_1');
            this.$subItems = this.$list.find('.menu-item-has-children');
            this.$subAnchors = this.$list.find('.menu-item-has-children > .w-nav-anchor');
            this.$subLists = this.$list.find('.menu-item-has-children > .w-nav-list');
            this.$anchors = this.$nav.find('.w-nav-anchor');
            this.$arrows = $('.w-nav-arrow');
            this.options = this.$nav.find('.w-nav-options:first')[0].onclick() || {};
            if (this.$nav.length == 0) {
                return
            }
            this.type = this.$nav.usMod('type');
            this.layout = this.$nav.usMod('layout');
            this.mobileOpened = !1;
            if ($.isMobile && this.type == 'desktop') {
                this.$list.on('click', '.w-nav-anchor[class*="level_"]', function(e) {
                    var $target = $(e.currentTarget),
                        $item = $target.closest('.menu-item');
                    if ($target.usMod('level') > 1 && !$item.hasClass('menu-item-has-children')) {
                        $target.parents('.menu-item.opened').removeClass('opened')
                    }
                })
            }
            this.$control.on('click', function() {
                this.mobileOpened = !this.mobileOpened;
                this.setTabIndex(!0);
                this.$anchors.each(function() {
                    if ($(this).attr('href') == undefined) {
                        $(this).attr('href', 'javascript:void(0)')
                    }
                });
                if (this.layout != 'dropdown') {
                    this.$anchors.removeAttr('tabindex')
                }
                if (this.mobileOpened) {
                    $('.l-header .w-nav').not(container).each(function() {
                        $(this).trigger('USNavClose')
                    });
                    this.$control.addClass('active');
                    this.$items.filter('.opened').removeClass('opened');
                    this.$subLists.resetInlineCSS('display', 'height');
                    if (this.layout == 'dropdown') {
                        this.$list.slideDownCSS(250, this._events.contentChanged)
                    }
                    $us.mobileNavOpened++
                } else {
                    this.$control.removeClass('active');
                    if (this.layout == 'dropdown') {
                        this.$list.slideUpCSS(250, this._events.contentChanged)
                    }
                    this.setTabIndex();
                    if (this.layout != 'dropdown') {
                        this.$anchors.attr('tabindex', -1)
                    }
                    $us.mobileNavOpened--
                }
                $us.$canvas.trigger('contentChange')
            }.bind(this));
            this.$control.on('focusin', function(e) {
                if (this.type != 'mobile' || this.layout == 'dropdown') {
                    return
                }
                this.$anchors.attr('tabindex', -1)
            }.bind(this));
            this.$close.on('click', function() {
                this.mobileOpened = !1;
                this.$control.removeClass('active');
                $us.mobileNavOpened--;
                $us.$canvas.trigger('contentChange')
            }.bind(this));
            $us.$document.keyup(function(e) {
                if (e.keyCode == 27) {
                    if (this.mobileOpened) {
                        if (this.layout == 'dropdown') {
                            this.$list.slideUpCSS(250, this._events.contentChanged)
                        }
                        this.mobileOpened = !1;
                        this.$control.removeClass('active');
                        this.setTabIndex();
                        if (this.layout != 'dropdown') {
                            this.$anchors.attr('tabindex', -1)
                        }
                        $us.mobileNavOpened--;
                        $us.$canvas.trigger('contentChange')
                    }
                }
            }.bind(this));
            this._events = {
                menuToggler: function($item, show) {
                    if (this.type != 'mobile') {
                        return
                    }
                    var $sublist = $item.children('.w-nav-list');
                    if (show) {
                        $item.addClass('opened');
                        $sublist.slideDownCSS(250, this._events.contentChanged)
                    } else {
                        $item.removeClass('opened');
                        $sublist.slideUpCSS(250, this._events.contentChanged)
                    }
                }.bind(this),
                focusHandler: function(e) {
                    if (this.type == 'mobile') {
                        return
                    }
                    var $item = $(e.target).closest('.menu-item'),
                        $target = $(e.target);
                    $item.parents('.menu-item').addClass('opened');
                    $item.on('mouseleave', function() {
                        $target.blur()
                    })
                }.bind(this),
                blurHandler: function(e) {
                    if (this.type == 'mobile') {
                        return
                    }
                    var $item = $(e.target).closest('.menu-item');
                    $item.parents('.menu-item').removeClass('opened')
                }.bind(this),
                clickHandler: function(e) {
                    if (this.type != 'mobile') {
                        return
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    var $item = $(e.currentTarget).closest('.menu-item'),
                        isOpened = $item.hasClass('opened');
                    this._events.menuToggler($item, !isOpened)
                }.bind(this),
                keyDownHandler: function(e) {
                    if (this.type != 'mobile') {
                        return
                    }
                    var keyCode = e.keyCode || e.which;
                    if (keyCode == 13) {
                        var $target = $(e.target),
                            $item = $target.closest('.menu-item'),
                            isOpened = $item.hasClass('opened');
                        if (!$target.is(this.$arrows)) {
                            return
                        }
                        e.stopPropagation();
                        e.preventDefault();
                        this._events.menuToggler($item, !isOpened)
                    }
                    if (keyCode == 9) {
                        var $target = $(e.target) ? $(e.target) : {},
                            i = this.$anchors.index($target),
                            isDropdownLayout = this.layout == 'dropdown' ? !0 : !1,
                            closeMenu = function() {
                                if (this.mobileOpened) {
                                    if (isDropdownLayout) {
                                        this.$list.slideUpCSS(250, this._events.contentChanged)
                                    }
                                    this.mobileOpened = !1;
                                    this.$control.removeClass('active');
                                    $us.mobileNavOpened--;
                                    $us.$canvas.trigger('contentChange');
                                    this.setTabIndex();
                                    if (this.layout != 'dropdown') {
                                        this.$anchors.attr('tabindex', -1)
                                    }
                                }
                            }.bind(this);
                        if (e.shiftKey) {
                            if ((i === this.$anchors.length - 1) && this.layout != 'dropdown') {
                                this.$anchors.attr('tabindex', -1)
                            }
                            if (i === 0) {
                                closeMenu()
                            }
                        } else {
                            if (i === this.$anchors.length - 1) {
                                closeMenu()
                            }
                        }
                    }
                }.bind(this),
                resize: this.resize.bind(this),
                contentChanged: function() {
                    if (this.type == 'mobile' && $us.header.isHorizontal() && $us.canvas.headerPos == 'fixed' && this.layout == 'fixed') {
                        this.setFixedMobileMaxHeight()
                    }
                    $us.header.$container.trigger('contentChange')
                }.bind(this),
                close: function() {
                    if (this.$list != undefined && jQuery.fn.slideUpCSS != undefined && this.mobileOpened && this.type == 'mobile') {
                        this.mobileOpened = !1;
                        if (this.layout == 'dropdown' && this.headerOrientation == 'hor') {
                            this.$list.slideUpCSS(250)
                        }
                        $us.mobileNavOpened--;
                        $us.$canvas.trigger('contentChange')
                    }
                }.bind(this),
                detachAnimation: function() {
                    this.$nav.removeClass('us_animate_this')
                }.bind(this),
            };
            this.$subItems.each(function(index) {
                var $item = $(this.$subItems[index]),
                    $arrow = $item.find('.w-nav-arrow').first(),
                    $subAnchor = $item.find('.w-nav-anchor').first(),
                    dropByLabel = $item.hasClass('mobile-drop-by_label') || $item.parents('.menu-item').hasClass('mobile-drop-by_label'),
                    dropByArrow = $item.hasClass('mobile-drop-by_arrow') || $item.parents('.menu-item').hasClass('mobile-drop-by_arrow');
                if (dropByLabel || (this.options.mobileBehavior && !dropByArrow)) {
                    $subAnchor.on('click', this._events.clickHandler)
                } else if (dropByArrow || (!this.options.mobileBehavior && !dropByLabel)) {
                    $arrow.on('click', this._events.clickHandler);
                    $arrow.on('click', this._events.keyDownHandler)
                }
            }.bind(this));
            this.$subItems.each(function() {
                var $this = $(this),
                    $parentItem = $this.parent().closest('.menu-item');
                if ($parentItem.length == 0 || $parentItem.usMod('columns') === !1) {
                    $this.addClass('togglable')
                }
            });
            if (!$us.$html.hasClass('no-touch')) {
                this.$list.find('.menu-item-has-children.togglable > .w-nav-anchor').on('click', function(e) {
                    if (this.type == 'mobile') {
                        return
                    }
                    e.preventDefault();
                    var $this = $(e.currentTarget),
                        $item = $this.parent();
                    if ($item.hasClass('opened')) {
                        return location.assign($this.attr('href'))
                    }
                    $item.addClass('opened');
                    var outsideClickEvent = function(e) {
                        if ($.contains($item[0], e.target)) {
                            return
                        }
                        $item.removeClass('opened');
                        $us.$body.off('touchstart', outsideClickEvent)
                    };
                    $us.$body.on('touchstart', outsideClickEvent)
                }.bind(this))
            }
            $($us.$document).on('mouseup touchend', function(e) {
                if (this.mobileOpened && this.type == 'mobile') {
                    if (!this.$control.is(e.target) && this.$control.has(e.target).length === 0 && !this.$list.is(e.target) && this.$list.has(e.target).length === 0) {
                        this.mobileOpened = !1;
                        this.$control.removeClass('active');
                        this.$items.filter('.opened').removeClass('opened');
                        this.$subLists.slideUpCSS(250);
                        if (this.layout == 'dropdown' && this.headerOrientation == 'hor') {
                            this.$list.slideUpCSS(250)
                        }
                        $us.mobileNavOpened--;
                        $us.$canvas.trigger('contentChange')
                    }
                }
            }.bind(this));
            this.$anchors.on('focus.upsolution', this._events.focusHandler);
            this.$anchors.on('blur.upsolution', this._events.blurHandler);
            this.$nav.on('keydown.upsolution', this._events.keyDownHandler);
            this.$nav.on('transitionend', this._events.detachAnimation);
            this.$anchors.on('click', function(e) {
                var $item = $(e.currentTarget).closest('.menu-item'),
                    dropByLabel = $item.hasClass('mobile-drop-by_label') || $item.parents('.menu-item').hasClass('mobile-drop-by_label'),
                    dropByArrow = $item.hasClass('mobile-drop-by_arrow') || $item.parents('.menu-item').hasClass('mobile-drop-by_arrow');
                if (this.type != 'mobile' || $us.header.isVertical()) {
                    return
                }
                if (dropByLabel || (this.options.mobileBehavior && $item.hasClass('menu-item-has-children') && !dropByArrow)) {
                    return
                }
                this.mobileOpened = !1;
                this.$control.removeClass('active');
                if (this.layout == 'dropdown') {
                    this.$list.slideUpCSS(250)
                }
                $us.mobileNavOpened--;
                $us.$canvas.trigger('contentChange')
            }.bind(this));
            $us.$window.on('resize', $us.debounce(this._events.resize, 5));
            $us.timeout(function() {
                this.resize();
                $us.header.$container.trigger('contentChange')
            }.bind(this), 50);
            this.$nav.on('USNavClose', this._events.close)
        },
        setTabIndex: function(add) {
            this.$subItems.each(function(index) {
                var $item = $(this.$subItems[index]);
                if ($item.hasClass('mobile-drop-by_arrow') || $item.parents('.menu-item').hasClass('mobile-drop-by_arrow') || (!$item.hasClass('mobile-drop-by_label') && !this.options.mobileBehavior)) {
                    if (add) {
                        $item.find('.w-nav-arrow').attr('tabindex', 0)
                    } else {
                        $item.find('.w-nav-arrow').removeAttr('tabindex')
                    }
                }
            }.bind(this))
        },
        setFixedMobileMaxHeight: function() {
            this.$list.css('max-height', $us.canvas.winHeight - $us.header.getCurrentHeight() + 'px')
        },
        resize: function() {
            if (this.$nav.length == 0) {
                return
            }
            var nextType = (window.innerWidth < this.options.mobileWidth) ? 'mobile' : 'desktop';
            if ($us.header.orientation != this.headerOrientation || nextType != this.type) {
                this.$subLists.resetInlineCSS('display', 'height');
                if (this.headerOrientation == 'hor' && this.type == 'mobile') {
                    this.$list.resetInlineCSS('display', 'height', 'max-height', 'opacity')
                }
                this.$items.removeClass('opened');
                this.headerOrientation = $us.header.orientation;
                this.type = nextType;
                this.$nav.usMod('type', nextType);
                this.setTabIndex();
                if (this.layout != 'dropdown') {
                    this.$anchors.removeAttr('tabindex')
                }
            }
            if ($us.header.isHorizontal() && this.type == 'mobile' && this.layout == 'dropdown' && $us.header.isFixed()) {
                this.setFixedMobileMaxHeight()
            }
            this.$list.removeClass('hide_for_mobiles')
        }
    };
    $.fn.usNav = function(options) {
        return this.each(function() {
            $(this).data('usNav', new $us.Nav(this, options))
        })
    };
    $('.l-header .w-nav').usNav()
}(jQuery);
(function($, undefined) {
    var _window = window,
        _document = document;
    _window.$us.YTPlayers = _window.$us.YTPlayers || {};
    "use strict";
    $us.wVideo = function(container) {
        this.$container = $(container);
        this.$videoH = $('.w-video-h', this.$container);
        this.data = {};
        if (this.$container.is('[onclick]')) {
            this.data = this.$container[0].onclick() || {};
            if (!$us.usbPreview) this.$container.removeAttr('onclick')
        }
        this._events = {
            overlayClick: this._overlayClick.bind(this),
        };
        if (this.$container.is('.with_overlay')) {
            this.$container.one('click', '> *', this._events.overlayClick)
        } else if (!$.isEmptyObject(this.data)) {
            this.insertPlayer()
        }
    };
    $.extend($us.wVideo.prototype, {
        _overlayClick: function(e) {
            e.preventDefault();
            this.insertPlayer()
        },
        insertPlayer: function() {
            var data = $.extend({
                player_id: '',
                player_api: '',
                player_html: ''
            }, this.data || {});
            if (data.player_api && !$('script[src="' + data.player_api + '"]', _document.head).length) {
                $('head').append('<script src="' + data.player_api + '"></script>')
            }
            this.$videoH.html(data.player_html);
            if (this.$container.is('.with_overlay')) {
                this.$container.removeAttr('style').removeClass('with_overlay')
            }
        }
    });
    $.fn.wVideo = function(options) {
        return this.each(function() {
            $(this).data('wVideo', new $us.wVideo(this, options))
        })
    };
    $(function() {
        $('.w-video').wVideo()
    })
})(jQuery);
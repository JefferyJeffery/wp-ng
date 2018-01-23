(function($, window, Galleria, undef) {
    var doc = window.document, $doc = $(doc), $win = $(window), protoArray = Array.prototype, VERSION = 1.57, DEBUG = true, TIMEOUT = 3e4, DUMMY = false, NAV = navigator.userAgent.toLowerCase(), HASH = window.location.hash.replace(/#\//, ""), PROT = window.location.protocol == "file:" ? "http:" : window.location.protocol, M = Math, F = function() {}, FALSE = function() {
        return false;
    }, MOBILE = !(window.screen.width > 1279 && window.devicePixelRatio == 1 || window.screen.width > 1e3 && window.innerWidth < window.screen.width * .9), IE = function() {
        var v = 3, div = doc.createElement("div"), all = div.getElementsByTagName("i");
        do {
            div.innerHTML = "\x3c!--[if gt IE " + ++v + "]><i></i><![endif]--\x3e";
        } while (all[0]);
        return v > 4 ? v : doc.documentMode || undef;
    }(), DOM = function() {
        return {
            html: doc.documentElement,
            body: doc.body,
            head: doc.getElementsByTagName("head")[0],
            title: doc.title
        };
    }, IFRAME = window.parent !== window.self, _eventlist = "data ready thumbnail loadstart loadfinish image play pause progress " + "fullscreen_enter fullscreen_exit idle_enter idle_exit rescale " + "lightbox_open lightbox_close lightbox_image", _events = function() {
        var evs = [];
        $.each(_eventlist.split(" "), function(i, ev) {
            evs.push(ev);
            if (/_/.test(ev)) {
                evs.push(ev.replace(/_/g, ""));
            }
        });
        return evs;
    }(), _legacyOptions = function(options) {
        var n;
        if (typeof options !== "object") {
            return options;
        }
        $.each(options, function(key, value) {
            if (/^[a-z]+_/.test(key)) {
                n = "";
                $.each(key.split("_"), function(i, k) {
                    n += i > 0 ? k.substr(0, 1).toUpperCase() + k.substr(1) : k;
                });
                options[n] = value;
                delete options[key];
            }
        });
        return options;
    }, _patchEvent = function(type) {
        if ($.inArray(type, _events) > -1) {
            return Galleria[type.toUpperCase()];
        }
        return type;
    }, _video = {
        youtube: {
            reg: /https?:\/\/(?:[a-zA_Z]{2,3}.)?(?:youtube\.com\/watch\?)((?:[\w\d\-\_\=]+&amp;(?:amp;)?)*v(?:&lt;[A-Z]+&gt;)?=([0-9a-zA-Z\-\_]+))/i,
            embed: function() {
                return PROT + "//www.youtube.com/embed/" + this.id;
            },
            get_thumb: function(data) {
                return PROT + "//img.youtube.com/vi/" + this.id + "/default.jpg";
            },
            get_image: function(data) {
                return PROT + "//img.youtube.com/vi/" + this.id + "/hqdefault.jpg";
            }
        },
        vimeo: {
            reg: /https?:\/\/(?:www\.)?(vimeo\.com)\/(?:hd#)?([0-9]+)/i,
            embed: function() {
                return PROT + "//player.vimeo.com/video/" + this.id;
            },
            getUrl: function() {
                return PROT + "//vimeo.com/api/v2/video/" + this.id + ".json?callback=?";
            },
            get_thumb: function(data) {
                return data[0].thumbnail_medium;
            },
            get_image: function(data) {
                return data[0].thumbnail_large;
            }
        },
        dailymotion: {
            reg: /https?:\/\/(?:www\.)?(dailymotion\.com)\/video\/([^_]+)/,
            embed: function() {
                return PROT + "//www.dailymotion.com/embed/video/" + this.id;
            },
            getUrl: function() {
                return "https://api.dailymotion.com/video/" + this.id + "?fields=thumbnail_240_url,thumbnail_720_url&callback=?";
            },
            get_thumb: function(data) {
                return data.thumbnail_240_url;
            },
            get_image: function(data) {
                return data.thumbnail_720_url;
            }
        },
        _inst: []
    }, Video = function(type, id) {
        for (var i = 0; i < _video._inst.length; i++) {
            if (_video._inst[i].id === id && _video._inst[i].type == type) {
                return _video._inst[i];
            }
        }
        this.type = type;
        this.id = id;
        this.readys = [];
        _video._inst.push(this);
        var self = this;
        $.extend(this, _video[type]);
        _videoThumbs = function(data) {
            self.data = data;
            $.each(self.readys, function(i, fn) {
                fn(self.data);
            });
            self.readys = [];
        };
        if (this.hasOwnProperty("getUrl")) {
            $.getJSON(this.getUrl(), _videoThumbs);
        } else {
            window.setTimeout(_videoThumbs, 400);
        }
        this.getMedia = function(type, callback, fail) {
            fail = fail || F;
            var self = this;
            var success = function(data) {
                callback(self["get_" + type](data));
            };
            try {
                if (self.data) {
                    success(self.data);
                } else {
                    self.readys.push(success);
                }
            } catch (e) {
                fail();
            }
        };
    }, _videoTest = function(url) {
        var match;
        for (var v in _video) {
            match = url && _video[v].reg && url.match(_video[v].reg);
            if (match && match.length) {
                return {
                    id: match[2],
                    provider: v
                };
            }
        }
        return false;
    }, _nativeFullscreen = {
        support: function() {
            var html = DOM().html;
            return !IFRAME && (html.requestFullscreen || html.msRequestFullscreen || html.mozRequestFullScreen || html.webkitRequestFullScreen);
        }(),
        callback: F,
        enter: function(instance, callback, elem) {
            this.instance = instance;
            this.callback = callback || F;
            elem = elem || DOM().html;
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullScreen) {
                elem.webkitRequestFullScreen();
            }
        },
        exit: function(callback) {
            this.callback = callback || F;
            if (doc.exitFullscreen) {
                doc.exitFullscreen();
            } else if (doc.msExitFullscreen) {
                doc.msExitFullscreen();
            } else if (doc.mozCancelFullScreen) {
                doc.mozCancelFullScreen();
            } else if (doc.webkitCancelFullScreen) {
                doc.webkitCancelFullScreen();
            }
        },
        instance: null,
        listen: function() {
            if (!this.support) {
                return;
            }
            var handler = function() {
                if (!_nativeFullscreen.instance) {
                    return;
                }
                var fs = _nativeFullscreen.instance._fullscreen;
                if (doc.fullscreen || doc.mozFullScreen || doc.webkitIsFullScreen || doc.msFullscreenElement && doc.msFullscreenElement !== null) {
                    fs._enter(_nativeFullscreen.callback);
                } else {
                    fs._exit(_nativeFullscreen.callback);
                }
            };
            doc.addEventListener("fullscreenchange", handler, false);
            doc.addEventListener("MSFullscreenChange", handler, false);
            doc.addEventListener("mozfullscreenchange", handler, false);
            doc.addEventListener("webkitfullscreenchange", handler, false);
        }
    }, _galleries = [], _instances = [], _hasError = false, _canvas = false, _pool = [], _loadedThemes = [], _themeLoad = function(theme) {
        _loadedThemes.push(theme);
        $.each(_pool, function(i, instance) {
            if (instance._options.theme == theme.name || !instance._initialized && !instance._options.theme) {
                instance.theme = theme;
                instance._init.call(instance);
            }
        });
    }, Utils = function() {
        return {
            clearTimer: function(id) {
                $.each(Galleria.get(), function() {
                    this.clearTimer(id);
                });
            },
            addTimer: function(id) {
                $.each(Galleria.get(), function() {
                    this.addTimer(id);
                });
            },
            array: function(obj) {
                return protoArray.slice.call(obj, 0);
            },
            create: function(className, nodeName) {
                nodeName = nodeName || "div";
                var elem = doc.createElement(nodeName);
                elem.className = className;
                return elem;
            },
            removeFromArray: function(arr, elem) {
                $.each(arr, function(i, el) {
                    if (el == elem) {
                        arr.splice(i, 1);
                        return false;
                    }
                });
                return arr;
            },
            getScriptPath: function(src) {
                src = src || $("script:last").attr("src");
                var slices = src.split("/");
                if (slices.length == 1) {
                    return "";
                }
                slices.pop();
                return slices.join("/") + "/";
            },
            animate: function() {
                var transition = function(style) {
                    var props = "transition WebkitTransition MozTransition OTransition".split(" "), i;
                    if (window.opera) {
                        return false;
                    }
                    for (i = 0; props[i]; i++) {
                        if (typeof style[props[i]] !== "undefined") {
                            return props[i];
                        }
                    }
                    return false;
                }((doc.body || doc.documentElement).style);
                var endEvent = {
                    MozTransition: "transitionend",
                    OTransition: "oTransitionEnd",
                    WebkitTransition: "webkitTransitionEnd",
                    transition: "transitionend"
                }[transition];
                var easings = {
                    _default: [ .25, .1, .25, 1 ],
                    galleria: [ .645, .045, .355, 1 ],
                    galleriaIn: [ .55, .085, .68, .53 ],
                    galleriaOut: [ .25, .46, .45, .94 ],
                    ease: [ .25, 0, .25, 1 ],
                    linear: [ .25, .25, .75, .75 ],
                    "ease-in": [ .42, 0, 1, 1 ],
                    "ease-out": [ 0, 0, .58, 1 ],
                    "ease-in-out": [ .42, 0, .58, 1 ]
                };
                var setStyle = function(elem, value, suffix) {
                    var css = {};
                    suffix = suffix || "transition";
                    $.each("webkit moz ms o".split(" "), function() {
                        css["-" + this + "-" + suffix] = value;
                    });
                    elem.css(css);
                };
                var clearStyle = function(elem) {
                    setStyle(elem, "none", "transition");
                    if (Galleria.WEBKIT && Galleria.TOUCH) {
                        setStyle(elem, "translate3d(0,0,0)", "transform");
                        if (elem.data("revert")) {
                            elem.css(elem.data("revert"));
                            elem.data("revert", null);
                        }
                    }
                };
                var change, strings, easing, syntax, revert, form, css;
                return function(elem, to, options) {
                    options = $.extend({
                        duration: 400,
                        complete: F,
                        stop: false
                    }, options);
                    elem = $(elem);
                    if (!options.duration) {
                        elem.css(to);
                        options.complete.call(elem[0]);
                        return;
                    }
                    if (!transition) {
                        elem.animate(to, options);
                        return;
                    }
                    if (options.stop) {
                        elem.off(endEvent);
                        clearStyle(elem);
                    }
                    change = false;
                    $.each(to, function(key, val) {
                        css = elem.css(key);
                        if (Utils.parseValue(css) != Utils.parseValue(val)) {
                            change = true;
                        }
                        elem.css(key, css);
                    });
                    if (!change) {
                        window.setTimeout(function() {
                            options.complete.call(elem[0]);
                        }, options.duration);
                        return;
                    }
                    strings = [];
                    easing = options.easing in easings ? easings[options.easing] : easings._default;
                    syntax = " " + options.duration + "ms" + " cubic-bezier(" + easing.join(",") + ")";
                    window.setTimeout(function(elem, endEvent, to, syntax) {
                        return function() {
                            elem.one(endEvent, function(elem) {
                                return function() {
                                    clearStyle(elem);
                                    options.complete.call(elem[0]);
                                };
                            }(elem));
                            if (Galleria.WEBKIT && Galleria.TOUCH) {
                                revert = {};
                                form = [ 0, 0, 0 ];
                                $.each([ "left", "top" ], function(i, m) {
                                    if (m in to) {
                                        form[i] = Utils.parseValue(to[m]) - Utils.parseValue(elem.css(m)) + "px";
                                        revert[m] = to[m];
                                        delete to[m];
                                    }
                                });
                                if (form[0] || form[1]) {
                                    elem.data("revert", revert);
                                    strings.push("-webkit-transform" + syntax);
                                    setStyle(elem, "translate3d(" + form.join(",") + ")", "transform");
                                }
                            }
                            $.each(to, function(p, val) {
                                strings.push(p + syntax);
                            });
                            setStyle(elem, strings.join(","));
                            elem.css(to);
                        };
                    }(elem, endEvent, to, syntax), 2);
                };
            }(),
            removeAlpha: function(elem) {
                if (elem instanceof jQuery) {
                    elem = elem[0];
                }
                if (IE < 9 && elem) {
                    var style = elem.style, currentStyle = elem.currentStyle, filter = currentStyle && currentStyle.filter || style.filter || "";
                    if (/alpha/.test(filter)) {
                        style.filter = filter.replace(/alpha\([^)]*\)/i, "");
                    }
                }
            },
            forceStyles: function(elem, styles) {
                elem = $(elem);
                if (elem.attr("style")) {
                    elem.data("styles", elem.attr("style")).removeAttr("style");
                }
                elem.css(styles);
            },
            revertStyles: function() {
                $.each(Utils.array(arguments), function(i, elem) {
                    elem = $(elem);
                    elem.removeAttr("style");
                    elem.attr("style", "");
                    if (elem.data("styles")) {
                        elem.attr("style", elem.data("styles")).data("styles", null);
                    }
                });
            },
            moveOut: function(elem) {
                Utils.forceStyles(elem, {
                    position: "absolute",
                    left: -1e4
                });
            },
            moveIn: function() {
                Utils.revertStyles.apply(Utils, Utils.array(arguments));
            },
            hide: function(elem, speed, callback) {
                callback = callback || F;
                var $elem = $(elem);
                elem = $elem[0];
                if (!$elem.data("opacity")) {
                    $elem.data("opacity", $elem.css("opacity"));
                }
                var style = {
                    opacity: 0
                };
                if (speed) {
                    var complete = IE < 9 && elem ? function() {
                        Utils.removeAlpha(elem);
                        elem.style.visibility = "hidden";
                        callback.call(elem);
                    } : callback;
                    Utils.animate(elem, style, {
                        duration: speed,
                        complete: complete,
                        stop: true
                    });
                } else {
                    if (IE < 9 && elem) {
                        Utils.removeAlpha(elem);
                        elem.style.visibility = "hidden";
                    } else {
                        $elem.css(style);
                    }
                }
            },
            show: function(elem, speed, callback) {
                callback = callback || F;
                var $elem = $(elem);
                elem = $elem[0];
                var saved = parseFloat($elem.data("opacity")) || 1, style = {
                    opacity: saved
                };
                if (speed) {
                    if (IE < 9) {
                        $elem.css("opacity", 0);
                        elem.style.visibility = "visible";
                    }
                    var complete = IE < 9 && elem ? function() {
                        if (style.opacity == 1) {
                            Utils.removeAlpha(elem);
                        }
                        callback.call(elem);
                    } : callback;
                    Utils.animate(elem, style, {
                        duration: speed,
                        complete: complete,
                        stop: true
                    });
                } else {
                    if (IE < 9 && style.opacity == 1 && elem) {
                        Utils.removeAlpha(elem);
                        elem.style.visibility = "visible";
                    } else {
                        $elem.css(style);
                    }
                }
            },
            wait: function(options) {
                Galleria._waiters = Galleria._waiters || [];
                options = $.extend({
                    until: FALSE,
                    success: F,
                    error: function() {
                        Galleria.raise("Could not complete wait function.");
                    },
                    timeout: 3e3
                }, options);
                var start = Utils.timestamp(), elapsed, now, tid, fn = function() {
                    now = Utils.timestamp();
                    elapsed = now - start;
                    Utils.removeFromArray(Galleria._waiters, tid);
                    if (options.until(elapsed)) {
                        options.success();
                        return false;
                    }
                    if (typeof options.timeout == "number" && now >= start + options.timeout) {
                        options.error();
                        return false;
                    }
                    Galleria._waiters.push(tid = window.setTimeout(fn, 10));
                };
                Galleria._waiters.push(tid = window.setTimeout(fn, 10));
            },
            toggleQuality: function(img, force) {
                if (IE !== 7 && IE !== 8 || !img || img.nodeName.toUpperCase() != "IMG") {
                    return;
                }
                if (typeof force === "undefined") {
                    force = img.style.msInterpolationMode === "nearest-neighbor";
                }
                img.style.msInterpolationMode = force ? "bicubic" : "nearest-neighbor";
            },
            insertStyleTag: function(styles, id) {
                if (id && $("#" + id).length) {
                    return;
                }
                var style = doc.createElement("style");
                if (id) {
                    style.id = id;
                }
                DOM().head.appendChild(style);
                if (style.styleSheet) {
                    style.styleSheet.cssText = styles;
                } else {
                    var cssText = doc.createTextNode(styles);
                    style.appendChild(cssText);
                }
            },
            loadScript: function(url, callback) {
                var done = false, script = $("<scr" + "ipt>").attr({
                    src: url,
                    async: true
                }).get(0);
                script.onload = script.onreadystatechange = function() {
                    if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                        done = true;
                        script.onload = script.onreadystatechange = null;
                        if (typeof callback === "function") {
                            callback.call(this, this);
                        }
                    }
                };
                DOM().head.appendChild(script);
            },
            parseValue: function(val) {
                if (typeof val === "number") {
                    return val;
                } else if (typeof val === "string") {
                    var arr = val.match(/\-?\d|\./g);
                    return arr && arr.constructor === Array ? arr.join("") * 1 : 0;
                } else {
                    return 0;
                }
            },
            timestamp: function() {
                return new Date().getTime();
            },
            loadCSS: function(href, id, callback) {
                var link, length;
                $("link[rel=stylesheet]").each(function() {
                    if (new RegExp(href).test(this.href)) {
                        link = this;
                        return false;
                    }
                });
                if (typeof id === "function") {
                    callback = id;
                    id = undef;
                }
                callback = callback || F;
                if (link) {
                    callback.call(link, link);
                    return link;
                }
                length = doc.styleSheets.length;
                if ($("#" + id).length) {
                    $("#" + id).attr("href", href);
                    length--;
                } else {
                    link = $("<link>").attr({
                        rel: "stylesheet",
                        href: href,
                        id: id
                    }).get(0);
                    var styles = $('link[rel="stylesheet"], style');
                    if (styles.length) {
                        styles.get(0).parentNode.insertBefore(link, styles[0]);
                    } else {
                        DOM().head.appendChild(link);
                    }
                    if (IE && length >= 31) {
                        Galleria.raise("You have reached the browser stylesheet limit (31)", true);
                        return;
                    }
                }
                if (typeof callback === "function") {
                    var $loader = $("<s>").attr("id", "galleria-loader").hide().appendTo(DOM().body);
                    Utils.wait({
                        until: function() {
                            return $loader.height() > 0;
                        },
                        success: function() {
                            $loader.remove();
                            callback.call(link, link);
                        },
                        error: function() {
                            $loader.remove();
                            Galleria.raise("Theme CSS could not load after 20 sec. " + (Galleria.QUIRK ? "Your browser is in Quirks Mode, please add a correct doctype." : "Please download the latest theme at http://galleria.io/customer/."), true);
                        },
                        timeout: 5e3
                    });
                }
                return link;
            }
        };
    }(), _playIcon = function(container) {
        var css = ".galleria-videoicon{width:60px;height:60px;position:absolute;top:50%;left:50%;z-index:1;" + "margin:-30px 0 0 -30px;cursor:pointer;background:#000;background:rgba(0,0,0,.8);border-radius:3px;-webkit-transition:all 150ms}" + ".galleria-videoicon i{width:0px;height:0px;border-style:solid;border-width:10px 0 10px 16px;display:block;" + "border-color:transparent transparent transparent #ffffff;margin:20px 0 0 22px}.galleria-image:hover .galleria-videoicon{background:#000}";
        Utils.insertStyleTag(css, "galleria-videoicon");
        return $(Utils.create("galleria-videoicon")).html("<i></i>").appendTo(container).click(function() {
            $(this).siblings("img").mouseup();
        });
    }, _transitions = function() {
        var _slide = function(params, complete, fade, door) {
            var easing = this.getOptions("easing"), distance = this.getStageWidth(), from = {
                left: distance * (params.rewind ? -1 : 1)
            }, to = {
                left: 0
            };
            if (fade) {
                from.opacity = 0;
                to.opacity = 1;
            } else {
                from.opacity = 1;
            }
            $(params.next).css(from);
            Utils.animate(params.next, to, {
                duration: params.speed,
                complete: function(elems) {
                    return function() {
                        complete();
                        elems.css({
                            left: 0
                        });
                    };
                }($(params.next).add(params.prev)),
                queue: false,
                easing: easing
            });
            if (door) {
                params.rewind = !params.rewind;
            }
            if (params.prev) {
                from = {
                    left: 0
                };
                to = {
                    left: distance * (params.rewind ? 1 : -1)
                };
                if (fade) {
                    from.opacity = 1;
                    to.opacity = 0;
                }
                $(params.prev).css(from);
                Utils.animate(params.prev, to, {
                    duration: params.speed,
                    queue: false,
                    easing: easing,
                    complete: function() {
                        $(this).css("opacity", 0);
                    }
                });
            }
        };
        return {
            active: false,
            init: function(effect, params, complete) {
                if (_transitions.effects.hasOwnProperty(effect)) {
                    _transitions.effects[effect].call(this, params, complete);
                }
            },
            effects: {
                fade: function(params, complete) {
                    $(params.next).css({
                        opacity: 0,
                        left: 0
                    });
                    Utils.animate(params.next, {
                        opacity: 1
                    }, {
                        duration: params.speed,
                        complete: complete
                    });
                    if (params.prev) {
                        $(params.prev).css("opacity", 1).show();
                        Utils.animate(params.prev, {
                            opacity: 0
                        }, {
                            duration: params.speed
                        });
                    }
                },
                flash: function(params, complete) {
                    $(params.next).css({
                        opacity: 0,
                        left: 0
                    });
                    if (params.prev) {
                        Utils.animate(params.prev, {
                            opacity: 0
                        }, {
                            duration: params.speed / 2,
                            complete: function() {
                                Utils.animate(params.next, {
                                    opacity: 1
                                }, {
                                    duration: params.speed,
                                    complete: complete
                                });
                            }
                        });
                    } else {
                        Utils.animate(params.next, {
                            opacity: 1
                        }, {
                            duration: params.speed,
                            complete: complete
                        });
                    }
                },
                pulse: function(params, complete) {
                    if (params.prev) {
                        $(params.prev).hide();
                    }
                    $(params.next).css({
                        opacity: 0,
                        left: 0
                    }).show();
                    Utils.animate(params.next, {
                        opacity: 1
                    }, {
                        duration: params.speed,
                        complete: complete
                    });
                },
                slide: function(params, complete) {
                    _slide.apply(this, Utils.array(arguments));
                },
                fadeslide: function(params, complete) {
                    _slide.apply(this, Utils.array(arguments).concat([ true ]));
                },
                doorslide: function(params, complete) {
                    _slide.apply(this, Utils.array(arguments).concat([ false, true ]));
                }
            }
        };
    }();
    _nativeFullscreen.listen();
    $.event.special["click:fast"] = {
        propagate: true,
        add: function(handleObj) {
            var getCoords = function(e) {
                if (e.touches && e.touches.length) {
                    var touch = e.touches[0];
                    return {
                        x: touch.pageX,
                        y: touch.pageY
                    };
                }
            };
            var def = {
                touched: false,
                touchdown: false,
                coords: {
                    x: 0,
                    y: 0
                },
                evObj: {}
            };
            $(this).data({
                clickstate: def,
                timer: 0
            }).on("touchstart.fast", function(e) {
                window.clearTimeout($(this).data("timer"));
                $(this).data("clickstate", {
                    touched: true,
                    touchdown: true,
                    coords: getCoords(e.originalEvent),
                    evObj: e
                });
            }).on("touchmove.fast", function(e) {
                var coords = getCoords(e.originalEvent), state = $(this).data("clickstate"), distance = Math.max(Math.abs(state.coords.x - coords.x), Math.abs(state.coords.y - coords.y));
                if (distance > 6) {
                    $(this).data("clickstate", $.extend(state, {
                        touchdown: false
                    }));
                }
            }).on("touchend.fast", function(e) {
                var $this = $(this), state = $this.data("clickstate");
                if (state.touchdown) {
                    handleObj.handler.call(this, e);
                }
                $this.data("timer", window.setTimeout(function() {
                    $this.data("clickstate", def);
                }, 400));
            }).on("click.fast", function(e) {
                var state = $(this).data("clickstate");
                if (state.touched) {
                    return false;
                }
                $(this).data("clickstate", def);
                handleObj.handler.call(this, e);
            });
        },
        remove: function() {
            $(this).off("touchstart.fast touchmove.fast touchend.fast click.fast");
        }
    };
    $win.on("orientationchange", function() {
        $(this).resize();
    });
    Galleria = function() {
        var self = this;
        this._options = {};
        this._playing = false;
        this._playtime = 5e3;
        this._active = null;
        this._queue = {
            length: 0
        };
        this._data = [];
        this._dom = {};
        this._thumbnails = [];
        this._layers = [];
        this._initialized = false;
        this._firstrun = false;
        this._stageWidth = 0;
        this._stageHeight = 0;
        this._target = undef;
        this._binds = [];
        this._id = parseInt(M.random() * 1e4, 10);
        var divs = "container stage images image-nav image-nav-left image-nav-right " + "info info-text info-title info-description " + "thumbnails thumbnails-list thumbnails-container thumb-nav-left thumb-nav-right " + "loader counter tooltip", spans = "current total";
        $.each(divs.split(" "), function(i, elemId) {
            self._dom[elemId] = Utils.create("galleria-" + elemId);
        });
        $.each(spans.split(" "), function(i, elemId) {
            self._dom[elemId] = Utils.create("galleria-" + elemId, "span");
        });
        var keyboard = this._keyboard = {
            keys: {
                UP: 38,
                DOWN: 40,
                LEFT: 37,
                RIGHT: 39,
                RETURN: 13,
                ESCAPE: 27,
                BACKSPACE: 8,
                SPACE: 32
            },
            map: {},
            bound: false,
            press: function(e) {
                var key = e.keyCode || e.which;
                if (key in keyboard.map && typeof keyboard.map[key] === "function") {
                    keyboard.map[key].call(self, e);
                }
            },
            attach: function(map) {
                var key, up;
                for (key in map) {
                    if (map.hasOwnProperty(key)) {
                        up = key.toUpperCase();
                        if (up in keyboard.keys) {
                            keyboard.map[keyboard.keys[up]] = map[key];
                        } else {
                            keyboard.map[up] = map[key];
                        }
                    }
                }
                if (!keyboard.bound) {
                    keyboard.bound = true;
                    $doc.on("keydown", keyboard.press);
                }
            },
            detach: function() {
                keyboard.bound = false;
                keyboard.map = {};
                $doc.off("keydown", keyboard.press);
            }
        };
        var controls = this._controls = {
            0: undef,
            1: undef,
            active: 0,
            swap: function() {
                controls.active = controls.active ? 0 : 1;
            },
            getActive: function() {
                return self._options.swipe ? controls.slides[self._active] : controls[controls.active];
            },
            getNext: function() {
                return self._options.swipe ? controls.slides[self.getNext(self._active)] : controls[1 - controls.active];
            },
            slides: [],
            frames: [],
            layers: []
        };
        var carousel = this._carousel = {
            next: self.$("thumb-nav-right"),
            prev: self.$("thumb-nav-left"),
            width: 0,
            current: 0,
            max: 0,
            hooks: [],
            update: function() {
                var w = 0, h = 0, hooks = [ 0 ];
                $.each(self._thumbnails, function(i, thumb) {
                    if (thumb.ready) {
                        w += thumb.outerWidth || $(thumb.container).outerWidth(true);
                        var containerWidth = $(thumb.container).width();
                        w += containerWidth - M.floor(containerWidth);
                        hooks[i + 1] = w;
                        h = M.max(h, thumb.outerHeight || $(thumb.container).outerHeight(true));
                    }
                });
                self.$("thumbnails").css({
                    width: w,
                    height: h
                });
                carousel.max = w;
                carousel.hooks = hooks;
                carousel.width = self.$("thumbnails-list").width();
                carousel.setClasses();
                self.$("thumbnails-container").toggleClass("galleria-carousel", w > carousel.width);
                carousel.width = self.$("thumbnails-list").width();
            },
            bindControls: function() {
                var i;
                carousel.next.on("click:fast", function(e) {
                    e.preventDefault();
                    if (self._options.carouselSteps === "auto") {
                        for (i = carousel.current; i < carousel.hooks.length; i++) {
                            if (carousel.hooks[i] - carousel.hooks[carousel.current] > carousel.width) {
                                carousel.set(i - 2);
                                break;
                            }
                        }
                    } else {
                        carousel.set(carousel.current + self._options.carouselSteps);
                    }
                });
                carousel.prev.on("click:fast", function(e) {
                    e.preventDefault();
                    if (self._options.carouselSteps === "auto") {
                        for (i = carousel.current; i >= 0; i--) {
                            if (carousel.hooks[carousel.current] - carousel.hooks[i] > carousel.width) {
                                carousel.set(i + 2);
                                break;
                            } else if (i === 0) {
                                carousel.set(0);
                                break;
                            }
                        }
                    } else {
                        carousel.set(carousel.current - self._options.carouselSteps);
                    }
                });
            },
            set: function(i) {
                i = M.max(i, 0);
                while (carousel.hooks[i - 1] + carousel.width >= carousel.max && i >= 0) {
                    i--;
                }
                carousel.current = i;
                carousel.animate();
            },
            getLast: function(i) {
                return (i || carousel.current) - 1;
            },
            follow: function(i) {
                if (i === 0 || i === carousel.hooks.length - 2) {
                    carousel.set(i);
                    return;
                }
                var last = carousel.current;
                while (carousel.hooks[last] - carousel.hooks[carousel.current] < carousel.width && last <= carousel.hooks.length) {
                    last++;
                }
                if (i - 1 < carousel.current) {
                    carousel.set(i - 1);
                } else if (i + 2 > last) {
                    carousel.set(i - last + carousel.current + 2);
                }
            },
            setClasses: function() {
                carousel.prev.toggleClass("disabled", !carousel.current);
                carousel.next.toggleClass("disabled", carousel.hooks[carousel.current] + carousel.width >= carousel.max);
            },
            animate: function(to) {
                carousel.setClasses();
                var num = carousel.hooks[carousel.current] * -1;
                if (isNaN(num)) {
                    return;
                }
                self.$("thumbnails").css("left", function() {
                    return $(this).css("left");
                });
                Utils.animate(self.get("thumbnails"), {
                    left: num
                }, {
                    duration: self._options.carouselSpeed,
                    easing: self._options.easing,
                    queue: false
                });
            }
        };
        var tooltip = this._tooltip = {
            initialized: false,
            open: false,
            timer: "tooltip" + self._id,
            swapTimer: "swap" + self._id,
            init: function() {
                tooltip.initialized = true;
                var css = ".galleria-tooltip{padding:3px 8px;max-width:50%;background:#ffe;color:#000;z-index:3;position:absolute;font-size:11px;line-height:1.3;" + "opacity:0;box-shadow:0 0 2px rgba(0,0,0,.4);-moz-box-shadow:0 0 2px rgba(0,0,0,.4);-webkit-box-shadow:0 0 2px rgba(0,0,0,.4);}";
                Utils.insertStyleTag(css, "galleria-tooltip");
                self.$("tooltip").css({
                    opacity: .8,
                    visibility: "visible",
                    display: "none"
                });
            },
            move: function(e) {
                var mouseX = self.getMousePosition(e).x, mouseY = self.getMousePosition(e).y, $elem = self.$("tooltip"), x = mouseX, y = mouseY, height = $elem.outerHeight(true) + 1, width = $elem.outerWidth(true), limitY = height + 15;
                var maxX = self.$("container").width() - width - 2, maxY = self.$("container").height() - height - 2;
                if (!isNaN(x) && !isNaN(y)) {
                    x += 10;
                    y -= height + 8;
                    x = M.max(0, M.min(maxX, x));
                    y = M.max(0, M.min(maxY, y));
                    if (mouseY < limitY) {
                        y = limitY;
                    }
                    $elem.css({
                        left: x,
                        top: y
                    });
                }
            },
            bind: function(elem, value) {
                if (Galleria.TOUCH) {
                    return;
                }
                if (!tooltip.initialized) {
                    tooltip.init();
                }
                var mouseout = function() {
                    self.$("container").off("mousemove", tooltip.move);
                    self.clearTimer(tooltip.timer);
                    self.$("tooltip").stop().animate({
                        opacity: 0
                    }, 200, function() {
                        self.$("tooltip").hide();
                        self.addTimer(tooltip.swapTimer, function() {
                            tooltip.open = false;
                        }, 1e3);
                    });
                };
                var hover = function(elem, value) {
                    tooltip.define(elem, value);
                    $(elem).hover(function() {
                        self.clearTimer(tooltip.swapTimer);
                        self.$("container").off("mousemove", tooltip.move).on("mousemove", tooltip.move).trigger("mousemove");
                        tooltip.show(elem);
                        self.addTimer(tooltip.timer, function() {
                            self.$("tooltip").stop().show().animate({
                                opacity: 1
                            });
                            tooltip.open = true;
                        }, tooltip.open ? 0 : 500);
                    }, mouseout).click(mouseout);
                };
                if (typeof value === "string") {
                    hover(elem in self._dom ? self.get(elem) : elem, value);
                } else {
                    $.each(elem, function(elemID, val) {
                        hover(self.get(elemID), val);
                    });
                }
            },
            show: function(elem) {
                elem = $(elem in self._dom ? self.get(elem) : elem);
                var text = elem.data("tt"), mouseup = function(e) {
                    window.setTimeout(function(ev) {
                        return function() {
                            tooltip.move(ev);
                        };
                    }(e), 10);
                    elem.off("mouseup", mouseup);
                };
                text = typeof text === "function" ? text() : text;
                if (!text) {
                    return;
                }
                self.$("tooltip").html(text.replace(/\s/, "&#160;"));
                elem.on("mouseup", mouseup);
            },
            define: function(elem, value) {
                if (typeof value !== "function") {
                    var s = value;
                    value = function() {
                        return s;
                    };
                }
                elem = $(elem in self._dom ? self.get(elem) : elem).data("tt", value);
                tooltip.show(elem);
            }
        };
        var fullscreen = this._fullscreen = {
            scrolled: 0,
            crop: undef,
            active: false,
            prev: $(),
            beforeEnter: function(fn) {
                fn();
            },
            beforeExit: function(fn) {
                fn();
            },
            keymap: self._keyboard.map,
            parseCallback: function(callback, enter) {
                return _transitions.active ? function() {
                    if (typeof callback == "function") {
                        callback.call(self);
                    }
                    var active = self._controls.getActive(), next = self._controls.getNext();
                    self._scaleImage(next);
                    self._scaleImage(active);
                    if (enter && self._options.trueFullscreen) {
                        $(active.container).add(next.container).trigger("transitionend");
                    }
                } : callback;
            },
            enter: function(callback) {
                fullscreen.beforeEnter(function() {
                    callback = fullscreen.parseCallback(callback, true);
                    if (self._options.trueFullscreen && _nativeFullscreen.support) {
                        fullscreen.active = true;
                        Utils.forceStyles(self.get("container"), {
                            width: "100%",
                            height: "100%"
                        });
                        self.rescale();
                        if (Galleria.MAC) {
                            if (!(Galleria.SAFARI && /version\/[1-5]/.test(NAV))) {
                                self.$("container").css("opacity", 0).addClass("fullscreen");
                                window.setTimeout(function() {
                                    fullscreen.scale();
                                    self.$("container").css("opacity", 1);
                                }, 50);
                            } else {
                                self.$("stage").css("opacity", 0);
                                window.setTimeout(function() {
                                    fullscreen.scale();
                                    self.$("stage").css("opacity", 1);
                                }, 4);
                            }
                        } else {
                            self.$("container").addClass("fullscreen");
                        }
                        $win.resize(fullscreen.scale);
                        _nativeFullscreen.enter(self, callback, self.get("container"));
                    } else {
                        fullscreen.scrolled = $win.scrollTop();
                        if (!Galleria.TOUCH) {
                            window.scrollTo(0, 0);
                        }
                        fullscreen._enter(callback);
                    }
                });
            },
            _enter: function(callback) {
                fullscreen.active = true;
                if (IFRAME) {
                    fullscreen.iframe = function() {
                        var elem, refer = doc.referrer, test = doc.createElement("a"), loc = window.location;
                        test.href = refer;
                        if (test.protocol != loc.protocol || test.hostname != loc.hostname || test.port != loc.port) {
                            Galleria.raise("Parent fullscreen not available. Iframe protocol, domains and ports must match.");
                            return false;
                        }
                        fullscreen.pd = window.parent.document;
                        $(fullscreen.pd).find("iframe").each(function() {
                            var idoc = this.contentDocument || this.contentWindow.document;
                            if (idoc === doc) {
                                elem = this;
                                return false;
                            }
                        });
                        return elem;
                    }();
                }
                Utils.hide(self.getActiveImage());
                if (IFRAME && fullscreen.iframe) {
                    fullscreen.iframe.scrolled = $(window.parent).scrollTop();
                    window.parent.scrollTo(0, 0);
                }
                var data = self.getData(), options = self._options, inBrowser = !self._options.trueFullscreen || !_nativeFullscreen.support, htmlbody = {
                    height: "100%",
                    overflow: "hidden",
                    margin: 0,
                    padding: 0
                };
                if (inBrowser) {
                    self.$("container").addClass("fullscreen");
                    fullscreen.prev = self.$("container").prev();
                    if (!fullscreen.prev.length) {
                        fullscreen.parent = self.$("container").parent();
                    }
                    self.$("container").appendTo("body");
                    Utils.forceStyles(self.get("container"), {
                        position: Galleria.TOUCH ? "absolute" : "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 1e4
                    });
                    Utils.forceStyles(DOM().html, htmlbody);
                    Utils.forceStyles(DOM().body, htmlbody);
                }
                if (IFRAME && fullscreen.iframe) {
                    Utils.forceStyles(fullscreen.pd.documentElement, htmlbody);
                    Utils.forceStyles(fullscreen.pd.body, htmlbody);
                    Utils.forceStyles(fullscreen.iframe, $.extend(htmlbody, {
                        width: "100%",
                        height: "100%",
                        top: 0,
                        left: 0,
                        position: "fixed",
                        zIndex: 1e4,
                        border: "none"
                    }));
                }
                fullscreen.keymap = $.extend({}, self._keyboard.map);
                self.attachKeyboard({
                    escape: self.exitFullscreen,
                    right: self.next,
                    left: self.prev
                });
                fullscreen.crop = options.imageCrop;
                if (options.fullscreenCrop != undef) {
                    options.imageCrop = options.fullscreenCrop;
                }
                if (data && data.big && data.image !== data.big) {
                    var big = new Galleria.Picture(), cached = big.isCached(data.big), index = self.getIndex(), thumb = self._thumbnails[index];
                    self.trigger({
                        type: Galleria.LOADSTART,
                        cached: cached,
                        rewind: false,
                        index: index,
                        imageTarget: self.getActiveImage(),
                        thumbTarget: thumb,
                        galleriaData: data
                    });
                    big.load(data.big, function(big) {
                        self._scaleImage(big, {
                            complete: function(big) {
                                self.trigger({
                                    type: Galleria.LOADFINISH,
                                    cached: cached,
                                    index: index,
                                    rewind: false,
                                    imageTarget: big.image,
                                    thumbTarget: thumb
                                });
                                var image = self._controls.getActive().image;
                                if (image) {
                                    $(image).width(big.image.width).height(big.image.height).attr("style", $(big.image).attr("style")).attr("src", big.image.src);
                                }
                            }
                        });
                    });
                    var n = self.getNext(index), p = new Galleria.Picture(), ndata = self.getData(n);
                    p.preload(self.isFullscreen() && ndata.big ? ndata.big : ndata.image);
                }
                self.rescale(function() {
                    self.addTimer(false, function() {
                        if (inBrowser) {
                            Utils.show(self.getActiveImage());
                        }
                        if (typeof callback === "function") {
                            callback.call(self);
                        }
                        self.rescale();
                    }, 100);
                    self.trigger(Galleria.FULLSCREEN_ENTER);
                });
                if (!inBrowser) {
                    Utils.show(self.getActiveImage());
                } else {
                    $win.resize(fullscreen.scale);
                }
            },
            scale: function() {
                self.rescale();
            },
            exit: function(callback) {
                fullscreen.beforeExit(function() {
                    callback = fullscreen.parseCallback(callback);
                    if (self._options.trueFullscreen && _nativeFullscreen.support) {
                        _nativeFullscreen.exit(callback);
                    } else {
                        fullscreen._exit(callback);
                    }
                });
            },
            _exit: function(callback) {
                fullscreen.active = false;
                var inBrowser = !self._options.trueFullscreen || !_nativeFullscreen.support, $container = self.$("container").removeClass("fullscreen");
                if (fullscreen.parent) {
                    fullscreen.parent.prepend($container);
                } else {
                    $container.insertAfter(fullscreen.prev);
                }
                if (inBrowser) {
                    Utils.hide(self.getActiveImage());
                    Utils.revertStyles(self.get("container"), DOM().html, DOM().body);
                    if (!Galleria.TOUCH) {
                        window.scrollTo(0, fullscreen.scrolled);
                    }
                    var frame = self._controls.frames[self._controls.active];
                    if (frame && frame.image) {
                        frame.image.src = frame.image.src;
                    }
                }
                if (IFRAME && fullscreen.iframe) {
                    Utils.revertStyles(fullscreen.pd.documentElement, fullscreen.pd.body, fullscreen.iframe);
                    if (fullscreen.iframe.scrolled) {
                        window.parent.scrollTo(0, fullscreen.iframe.scrolled);
                    }
                }
                self.detachKeyboard();
                self.attachKeyboard(fullscreen.keymap);
                self._options.imageCrop = fullscreen.crop;
                var big = self.getData().big, image = self._controls.getActive().image;
                if (!self.getData().iframe && image && big && big == image.src) {
                    window.setTimeout(function(src) {
                        return function() {
                            image.src = src;
                        };
                    }(self.getData().image), 1);
                }
                self.rescale(function() {
                    self.addTimer(false, function() {
                        if (inBrowser) {
                            Utils.show(self.getActiveImage());
                        }
                        if (typeof callback === "function") {
                            callback.call(self);
                        }
                        $win.trigger("resize");
                    }, 50);
                    self.trigger(Galleria.FULLSCREEN_EXIT);
                });
                $win.off("resize", fullscreen.scale);
            }
        };
        var idle = this._idle = {
            trunk: [],
            bound: false,
            active: false,
            add: function(elem, to, from, hide) {
                if (!elem || Galleria.TOUCH) {
                    return;
                }
                if (!idle.bound) {
                    idle.addEvent();
                }
                elem = $(elem);
                if (typeof from == "boolean") {
                    hide = from;
                    from = {};
                }
                from = from || {};
                var extract = {}, style;
                for (style in to) {
                    if (to.hasOwnProperty(style)) {
                        extract[style] = elem.css(style);
                    }
                }
                elem.data("idle", {
                    from: $.extend(extract, from),
                    to: to,
                    complete: true,
                    busy: false
                });
                if (!hide) {
                    idle.addTimer();
                } else {
                    elem.css(to);
                }
                idle.trunk.push(elem);
            },
            remove: function(elem) {
                elem = $(elem);
                $.each(idle.trunk, function(i, el) {
                    if (el && el.length && !el.not(elem).length) {
                        elem.css(elem.data("idle").from);
                        idle.trunk.splice(i, 1);
                    }
                });
                if (!idle.trunk.length) {
                    idle.removeEvent();
                    self.clearTimer(idle.timer);
                }
            },
            addEvent: function() {
                idle.bound = true;
                self.$("container").on("mousemove click", idle.showAll);
                if (self._options.idleMode == "hover") {
                    self.$("container").on("mouseleave", idle.hide);
                }
            },
            removeEvent: function() {
                idle.bound = false;
                self.$("container").on("mousemove click", idle.showAll);
                if (self._options.idleMode == "hover") {
                    self.$("container").off("mouseleave", idle.hide);
                }
            },
            addTimer: function() {
                if (self._options.idleMode == "hover") {
                    return;
                }
                self.addTimer("idle", function() {
                    idle.hide();
                }, self._options.idleTime);
            },
            hide: function() {
                if (!self._options.idleMode || self.getIndex() === false) {
                    return;
                }
                self.trigger(Galleria.IDLE_ENTER);
                var len = idle.trunk.length;
                $.each(idle.trunk, function(i, elem) {
                    var data = elem.data("idle");
                    if (!data) {
                        return;
                    }
                    elem.data("idle").complete = false;
                    Utils.animate(elem, data.to, {
                        duration: self._options.idleSpeed,
                        complete: function() {
                            if (i == len - 1) {
                                idle.active = false;
                            }
                        }
                    });
                });
            },
            showAll: function() {
                self.clearTimer("idle");
                $.each(idle.trunk, function(i, elem) {
                    idle.show(elem);
                });
            },
            show: function(elem) {
                var data = elem.data("idle");
                if (!idle.active || !data.busy && !data.complete) {
                    data.busy = true;
                    self.trigger(Galleria.IDLE_EXIT);
                    self.clearTimer("idle");
                    Utils.animate(elem, data.from, {
                        duration: self._options.idleSpeed / 2,
                        complete: function() {
                            idle.active = true;
                            $(elem).data("idle").busy = false;
                            $(elem).data("idle").complete = true;
                        }
                    });
                }
                idle.addTimer();
            }
        };
        var lightbox = this._lightbox = {
            width: 0,
            height: 0,
            initialized: false,
            active: null,
            image: null,
            elems: {},
            keymap: false,
            init: function() {
                if (lightbox.initialized) {
                    return;
                }
                lightbox.initialized = true;
                var elems = "overlay box content shadow title info close prevholder prev nextholder next counter image", el = {}, op = self._options, css = "", abs = "position:absolute;", prefix = "lightbox-", cssMap = {
                    overlay: "position:fixed;display:none;opacity:" + op.overlayOpacity + ";filter:alpha(opacity=" + op.overlayOpacity * 100 + ");top:0;left:0;width:100%;height:100%;background:" + op.overlayBackground + ";z-index:99990",
                    box: "position:fixed;display:none;width:400px;height:400px;top:50%;left:50%;margin-top:-200px;margin-left:-200px;z-index:99991",
                    shadow: abs + "background:#000;width:100%;height:100%;",
                    content: abs + "background-color:#fff;top:10px;left:10px;right:10px;bottom:10px;overflow:hidden",
                    info: abs + "bottom:10px;left:10px;right:10px;color:#444;font:11px/13px arial,sans-serif;height:13px",
                    close: abs + "top:10px;right:10px;height:20px;width:20px;background:#fff;text-align:center;cursor:pointer;color:#444;font:16px/22px arial,sans-serif;z-index:99999",
                    image: abs + "top:10px;left:10px;right:10px;bottom:30px;overflow:hidden;display:block;",
                    prevholder: abs + "width:50%;top:0;bottom:40px;cursor:pointer;",
                    nextholder: abs + "width:50%;top:0;bottom:40px;right:-1px;cursor:pointer;",
                    prev: abs + "top:50%;margin-top:-20px;height:40px;width:30px;background:#fff;left:20px;display:none;text-align:center;color:#000;font:bold 16px/36px arial,sans-serif",
                    next: abs + "top:50%;margin-top:-20px;height:40px;width:30px;background:#fff;right:20px;left:auto;display:none;font:bold 16px/36px arial,sans-serif;text-align:center;color:#000",
                    title: "float:left",
                    counter: "float:right;margin-left:8px;"
                }, hover = function(elem) {
                    return elem.hover(function() {
                        $(this).css("color", "#bbb");
                    }, function() {
                        $(this).css("color", "#444");
                    });
                }, appends = {};
                var exs = "";
                if (IE > 7) {
                    exs = IE < 9 ? "background:#000;filter:alpha(opacity=0);" : "background:rgba(0,0,0,0);";
                } else {
                    exs = "z-index:99999";
                }
                cssMap.nextholder += exs;
                cssMap.prevholder += exs;
                $.each(cssMap, function(key, value) {
                    css += ".galleria-" + prefix + key + "{" + value + "}";
                });
                css += ".galleria-" + prefix + "box.iframe .galleria-" + prefix + "prevholder," + ".galleria-" + prefix + "box.iframe .galleria-" + prefix + "nextholder{" + "width:100px;height:100px;top:50%;margin-top:-70px}";
                Utils.insertStyleTag(css, "galleria-lightbox");
                $.each(elems.split(" "), function(i, elemId) {
                    self.addElement("lightbox-" + elemId);
                    el[elemId] = lightbox.elems[elemId] = self.get("lightbox-" + elemId);
                });
                lightbox.image = new Galleria.Picture();
                $.each({
                    box: "shadow content close prevholder nextholder",
                    info: "title counter",
                    content: "info image",
                    prevholder: "prev",
                    nextholder: "next"
                }, function(key, val) {
                    var arr = [];
                    $.each(val.split(" "), function(i, prop) {
                        arr.push(prefix + prop);
                    });
                    appends[prefix + key] = arr;
                });
                self.append(appends);
                $(el.image).append(lightbox.image.container);
                $(DOM().body).append(el.overlay, el.box);
                hover($(el.close).on("click:fast", lightbox.hide).html("&#215;"));
                $.each([ "Prev", "Next" ], function(i, dir) {
                    var $d = $(el[dir.toLowerCase()]).html(/v/.test(dir) ? "&#8249;&#160;" : "&#160;&#8250;"), $e = $(el[dir.toLowerCase() + "holder"]);
                    $e.on("click:fast", function() {
                        lightbox["show" + dir]();
                    });
                    if (IE < 8 || Galleria.TOUCH) {
                        $d.show();
                        return;
                    }
                    $e.hover(function() {
                        $d.show();
                    }, function(e) {
                        $d.stop().fadeOut(200);
                    });
                });
                $(el.overlay).on("click:fast", lightbox.hide);
                if (Galleria.IPAD) {
                    self._options.lightboxTransitionSpeed = 0;
                }
            },
            rescale: function(event) {
                var width = M.min($win.width() - 40, lightbox.width), height = M.min($win.height() - 60, lightbox.height), ratio = M.min(width / lightbox.width, height / lightbox.height), destWidth = M.round(lightbox.width * ratio) + 40, destHeight = M.round(lightbox.height * ratio) + 60, to = {
                    width: destWidth,
                    height: destHeight,
                    "margin-top": M.ceil(destHeight / 2) * -1,
                    "margin-left": M.ceil(destWidth / 2) * -1
                };
                if (event) {
                    $(lightbox.elems.box).css(to);
                } else {
                    $(lightbox.elems.box).animate(to, {
                        duration: self._options.lightboxTransitionSpeed,
                        easing: self._options.easing,
                        complete: function() {
                            var image = lightbox.image, speed = self._options.lightboxFadeSpeed;
                            self.trigger({
                                type: Galleria.LIGHTBOX_IMAGE,
                                imageTarget: image.image
                            });
                            $(image.container).show();
                            $(image.image).animate({
                                opacity: 1
                            }, speed);
                            Utils.show(lightbox.elems.info, speed);
                        }
                    });
                }
            },
            hide: function() {
                lightbox.image.image = null;
                $win.off("resize", lightbox.rescale);
                $(lightbox.elems.box).hide().find("iframe").remove();
                Utils.hide(lightbox.elems.info);
                self.detachKeyboard();
                self.attachKeyboard(lightbox.keymap);
                lightbox.keymap = false;
                Utils.hide(lightbox.elems.overlay, 200, function() {
                    $(this).hide().css("opacity", self._options.overlayOpacity);
                    self.trigger(Galleria.LIGHTBOX_CLOSE);
                });
            },
            showNext: function() {
                lightbox.show(self.getNext(lightbox.active));
            },
            showPrev: function() {
                lightbox.show(self.getPrev(lightbox.active));
            },
            show: function(index) {
                lightbox.active = index = typeof index === "number" ? index : self.getIndex() || 0;
                if (!lightbox.initialized) {
                    lightbox.init();
                }
                self.trigger(Galleria.LIGHTBOX_OPEN);
                if (!lightbox.keymap) {
                    lightbox.keymap = $.extend({}, self._keyboard.map);
                    self.attachKeyboard({
                        escape: lightbox.hide,
                        right: lightbox.showNext,
                        left: lightbox.showPrev
                    });
                }
                $win.off("resize", lightbox.rescale);
                var data = self.getData(index), total = self.getDataLength(), n = self.getNext(index), ndata, p, i;
                Utils.hide(lightbox.elems.info);
                try {
                    for (i = self._options.preload; i > 0; i--) {
                        p = new Galleria.Picture();
                        ndata = self.getData(n);
                        p.preload(ndata.big ? ndata.big : ndata.image);
                        n = self.getNext(n);
                    }
                } catch (e) {}
                lightbox.image.isIframe = data.iframe && !data.image;
                $(lightbox.elems.box).toggleClass("iframe", lightbox.image.isIframe);
                $(lightbox.image.container).find(".galleria-videoicon").remove();
                lightbox.image.load(data.big || data.image || data.iframe, function(image) {
                    if (image.isIframe) {
                        var cw = $(window).width(), ch = $(window).height();
                        if (image.video && self._options.maxVideoSize) {
                            var r = M.min(self._options.maxVideoSize / cw, self._options.maxVideoSize / ch);
                            if (r < 1) {
                                cw *= r;
                                ch *= r;
                            }
                        }
                        lightbox.width = cw;
                        lightbox.height = ch;
                    } else {
                        lightbox.width = image.original.width;
                        lightbox.height = image.original.height;
                    }
                    $(image.image).css({
                        width: image.isIframe ? "100%" : "100.1%",
                        height: image.isIframe ? "100%" : "100.1%",
                        top: 0,
                        bottom: 0,
                        zIndex: 99998,
                        opacity: 0,
                        visibility: "visible"
                    }).parent().height("100%");
                    lightbox.elems.title.innerHTML = data.title || "";
                    lightbox.elems.counter.innerHTML = index + 1 + " / " + total;
                    $win.resize(lightbox.rescale);
                    lightbox.rescale();
                    if (data.image && data.iframe) {
                        $(lightbox.elems.box).addClass("iframe");
                        if (data.video) {
                            var $icon = _playIcon(image.container).hide();
                            window.setTimeout(function() {
                                $icon.fadeIn(200);
                            }, 200);
                        }
                        $(image.image).css("cursor", "pointer").mouseup(function(data, image) {
                            return function(e) {
                                $(lightbox.image.container).find(".galleria-videoicon").remove();
                                e.preventDefault();
                                image.isIframe = true;
                                image.load(data.iframe + (data.video ? "&autoplay=1" : ""), {
                                    width: "100%",
                                    height: IE < 8 ? $(lightbox.image.container).height() : "100%"
                                });
                            };
                        }(data, image));
                    }
                });
                $(lightbox.elems.overlay).show().css("visibility", "visible");
                $(lightbox.elems.box).show();
            }
        };
        var _timer = this._timer = {
            trunk: {},
            add: function(id, fn, delay, loop) {
                id = id || new Date().getTime();
                loop = loop || false;
                this.clear(id);
                if (loop) {
                    var old = fn;
                    fn = function() {
                        old();
                        _timer.add(id, fn, delay);
                    };
                }
                this.trunk[id] = window.setTimeout(fn, delay);
            },
            clear: function(id) {
                var del = function(i) {
                    window.clearTimeout(this.trunk[i]);
                    delete this.trunk[i];
                }, i;
                if (!!id && id in this.trunk) {
                    del.call(this, id);
                } else if (typeof id === "undefined") {
                    for (i in this.trunk) {
                        if (this.trunk.hasOwnProperty(i)) {
                            del.call(this, i);
                        }
                    }
                }
            }
        };
        return this;
    };
    Galleria.prototype = {
        constructor: Galleria,
        init: function(target, options) {
            options = _legacyOptions(options);
            this._original = {
                target: target,
                options: options,
                data: null
            };
            this._target = this._dom.target = target.nodeName ? target : $(target).get(0);
            this._original.html = this._target.innerHTML;
            _instances.push(this);
            if (!this._target) {
                Galleria.raise("Target not found", true);
                return;
            }
            this._options = {
                autoplay: false,
                carousel: true,
                carouselFollow: true,
                carouselSpeed: 400,
                carouselSteps: "auto",
                clicknext: false,
                dailymotion: {
                    foreground: "%23EEEEEE",
                    highlight: "%235BCEC5",
                    background: "%23222222",
                    logo: 0,
                    hideInfos: 1
                },
                dataConfig: function(elem) {
                    return {};
                },
                dataSelector: "img",
                dataSort: false,
                dataSource: this._target,
                debug: undef,
                dummy: undef,
                easing: "galleria",
                extend: function(options) {},
                fullscreenCrop: undef,
                fullscreenDoubleTap: true,
                fullscreenTransition: undef,
                height: 0,
                idleMode: true,
                idleTime: 3e3,
                idleSpeed: 200,
                imageCrop: false,
                imageMargin: 0,
                imagePan: false,
                imagePanSmoothness: 12,
                imagePosition: "50%",
                imageTimeout: undef,
                initialTransition: undef,
                keepSource: false,
                layerFollow: true,
                lightbox: false,
                lightboxFadeSpeed: 200,
                lightboxTransitionSpeed: 200,
                linkSourceImages: true,
                maxScaleRatio: undef,
                maxVideoSize: undef,
                minScaleRatio: undef,
                overlayOpacity: .85,
                overlayBackground: "#0b0b0b",
                pauseOnInteraction: true,
                popupLinks: false,
                preload: 2,
                queue: true,
                responsive: true,
                show: 0,
                showInfo: true,
                showCounter: true,
                showImagenav: true,
                swipe: "auto",
                theme: null,
                thumbCrop: true,
                thumbEventType: "click:fast",
                thumbMargin: 0,
                thumbQuality: "auto",
                thumbDisplayOrder: true,
                thumbPosition: "50%",
                thumbnails: true,
                touchTransition: undef,
                transition: "fade",
                transitionInitial: undef,
                transitionSpeed: 400,
                trueFullscreen: true,
                useCanvas: false,
                variation: "",
                videoPoster: true,
                vimeo: {
                    title: 0,
                    byline: 0,
                    portrait: 0,
                    color: "aaaaaa"
                },
                wait: 5e3,
                width: "auto",
                youtube: {
                    modestbranding: 1,
                    autohide: 1,
                    color: "white",
                    hd: 1,
                    rel: 0,
                    showinfo: 0
                }
            };
            this._options.initialTransition = this._options.initialTransition || this._options.transitionInitial;
            if (options) {
                if (options.debug === false) {
                    DEBUG = false;
                }
                if (typeof options.imageTimeout === "number") {
                    TIMEOUT = options.imageTimeout;
                }
                if (typeof options.dummy === "string") {
                    DUMMY = options.dummy;
                }
                if (typeof options.theme == "string") {
                    this._options.theme = options.theme;
                }
            }
            $(this._target).children().hide();
            if (Galleria.QUIRK) {
                Galleria.raise("Your page is in Quirks mode, Galleria may not render correctly. Please validate your HTML and add a correct doctype.");
            }
            if (_loadedThemes.length) {
                if (this._options.theme) {
                    for (var i = 0; i < _loadedThemes.length; i++) {
                        if (this._options.theme === _loadedThemes[i].name) {
                            this.theme = _loadedThemes[i];
                            break;
                        }
                    }
                } else {
                    this.theme = _loadedThemes[0];
                }
            }
            if (typeof this.theme == "object") {
                this._init();
            } else {
                _pool.push(this);
            }
            return this;
        },
        _init: function() {
            var self = this, options = this._options;
            if (this._initialized) {
                Galleria.raise("Init failed: Gallery instance already initialized.");
                return this;
            }
            this._initialized = true;
            if (!this.theme) {
                Galleria.raise("Init failed: No theme found.", true);
                return this;
            }
            $.extend(true, options, this.theme.defaults, this._original.options, Galleria.configure.options);
            options.swipe = function(s) {
                if (s == "enforced") {
                    return true;
                }
                if (s === false || s == "disabled") {
                    return false;
                }
                return !!Galleria.TOUCH;
            }(options.swipe);
            if (options.swipe) {
                options.clicknext = false;
                options.imagePan = false;
            }
            (function(can) {
                if (!("getContext" in can)) {
                    can = null;
                    return;
                }
                _canvas = _canvas || {
                    elem: can,
                    context: can.getContext("2d"),
                    cache: {},
                    length: 0
                };
            })(doc.createElement("canvas"));
            this.bind(Galleria.DATA, function() {
                if (window.screen && window.screen.width && Array.prototype.forEach) {
                    this._data.forEach(function(data) {
                        var density = "devicePixelRatio" in window ? window.devicePixelRatio : 1, m = M.max(window.screen.width, window.screen.height);
                        if (m * density < 1024) {
                            data.big = data.image;
                        }
                    });
                }
                this._original.data = this._data;
                this.get("total").innerHTML = this.getDataLength();
                var $container = this.$("container");
                if (self._options.height < 2) {
                    self._userRatio = self._ratio = self._options.height;
                }
                var num = {
                    width: 0,
                    height: 0
                };
                var testHeight = function() {
                    return self.$("stage").height();
                };
                Utils.wait({
                    until: function() {
                        num = self._getWH();
                        $container.width(num.width).height(num.height);
                        return testHeight() && num.width && num.height > 50;
                    },
                    success: function() {
                        self._width = num.width;
                        self._height = num.height;
                        self._ratio = self._ratio || num.height / num.width;
                        if (Galleria.WEBKIT) {
                            window.setTimeout(function() {
                                self._run();
                            }, 1);
                        } else {
                            self._run();
                        }
                    },
                    error: function() {
                        if (testHeight()) {
                            Galleria.raise("Could not extract sufficient width/height of the gallery container. Traced measures: width:" + num.width + "px, height: " + num.height + "px.", true);
                        } else {
                            Galleria.raise("Could not extract a stage height from the CSS. Traced height: " + testHeight() + "px.", true);
                        }
                    },
                    timeout: typeof this._options.wait == "number" ? this._options.wait : false
                });
            });
            this.append({
                "info-text": [ "info-title", "info-description" ],
                info: [ "info-text" ],
                "image-nav": [ "image-nav-right", "image-nav-left" ],
                stage: [ "images", "loader", "counter", "image-nav" ],
                "thumbnails-list": [ "thumbnails" ],
                "thumbnails-container": [ "thumb-nav-left", "thumbnails-list", "thumb-nav-right" ],
                container: [ "stage", "thumbnails-container", "info", "tooltip" ]
            });
            Utils.hide(this.$("counter").append(this.get("current"), doc.createTextNode(" / "), this.get("total")));
            this.setCounter("&#8211;");
            Utils.hide(self.get("tooltip"));
            this.$("container").addClass([ Galleria.TOUCH ? "touch" : "notouch", this._options.variation, "galleria-theme-" + this.theme.name ].join(" "));
            if (!this._options.swipe) {
                $.each(new Array(2), function(i) {
                    var image = new Galleria.Picture();
                    $(image.container).css({
                        position: "absolute",
                        top: 0,
                        left: 0
                    }).prepend(self._layers[i] = $(Utils.create("galleria-layer")).css({
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 2
                    })[0]);
                    self.$("images").append(image.container);
                    self._controls[i] = image;
                    var frame = new Galleria.Picture();
                    frame.isIframe = true;
                    $(frame.container).attr("class", "galleria-frame").css({
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 4,
                        background: "#000",
                        display: "none"
                    }).appendTo(image.container);
                    self._controls.frames[i] = frame;
                });
            }
            this.$("images").css({
                position: "relative",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%"
            });
            if (options.swipe) {
                this.$("images").css({
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 0,
                    height: "100%"
                });
                this.finger = new Galleria.Finger(this.get("stage"), {
                    onchange: function(page) {
                        self.pause().show(page);
                    },
                    oncomplete: function(page) {
                        var index = M.max(0, M.min(parseInt(page, 10), self.getDataLength() - 1)), data = self.getData(index);
                        $(self._thumbnails[index].container).addClass("active").siblings(".active").removeClass("active");
                        if (!data) {
                            return;
                        }
                        self.$("images").find(".galleria-frame").css("opacity", 0).hide().find("iframe").remove();
                        if (self._options.carousel && self._options.carouselFollow) {
                            self._carousel.follow(index);
                        }
                    }
                });
                this.bind(Galleria.RESCALE, function() {
                    this.finger.setup();
                });
                this.$("stage").on("click", function(e) {
                    var data = self.getData();
                    if (!data) {
                        return;
                    }
                    if (data.iframe) {
                        if (self.isPlaying()) {
                            self.pause();
                        }
                        var frame = self._controls.frames[self._active], w = self._stageWidth, h = self._stageHeight;
                        if ($(frame.container).find("iframe").length) {
                            return;
                        }
                        $(frame.container).css({
                            width: w,
                            height: h,
                            opacity: 0
                        }).show().animate({
                            opacity: 1
                        }, 200);
                        window.setTimeout(function() {
                            frame.load(data.iframe + (data.video ? "&autoplay=1" : ""), {
                                width: w,
                                height: h
                            }, function(frame) {
                                self.$("container").addClass("videoplay");
                                frame.scale({
                                    width: self._stageWidth,
                                    height: self._stageHeight,
                                    iframelimit: data.video ? self._options.maxVideoSize : undef
                                });
                            });
                        }, 100);
                        return;
                    }
                    if (data.link) {
                        if (self._options.popupLinks) {
                            var win = window.open(data.link, "_blank");
                        } else {
                            window.location.href = data.link;
                        }
                        return;
                    }
                });
                this.bind(Galleria.IMAGE, function(e) {
                    self.setCounter(e.index);
                    self.setInfo(e.index);
                    var next = this.getNext(), prev = this.getPrev();
                    var preloads = [ prev, next ];
                    preloads.push(this.getNext(next), this.getPrev(prev), self._controls.slides.length - 1);
                    var filtered = [];
                    $.each(preloads, function(i, val) {
                        if ($.inArray(val, filtered) == -1) {
                            filtered.push(val);
                        }
                    });
                    $.each(filtered, function(i, loadme) {
                        var d = self.getData(loadme), img = self._controls.slides[loadme], src = self.isFullscreen() && d.big ? d.big : d.image || d.iframe;
                        if (d.iframe && !d.image) {
                            img.isIframe = true;
                        }
                        if (!img.ready) {
                            self._controls.slides[loadme].load(src, function(img) {
                                if (!img.isIframe) {
                                    $(img.image).css("visibility", "hidden");
                                }
                                self._scaleImage(img, {
                                    complete: function(img) {
                                        if (!img.isIframe) {
                                            $(img.image).css({
                                                opacity: 0,
                                                visibility: "visible"
                                            }).animate({
                                                opacity: 1
                                            }, 200);
                                        }
                                    }
                                });
                            });
                        }
                    });
                });
            }
            this.$("thumbnails, thumbnails-list").css({
                overflow: "hidden",
                position: "relative"
            });
            this.$("image-nav-right, image-nav-left").on("click:fast", function(e) {
                if (options.pauseOnInteraction) {
                    self.pause();
                }
                var fn = /right/.test(this.className) ? "next" : "prev";
                self[fn]();
            }).on("click", function(e) {
                e.preventDefault();
                if (options.clicknext || options.swipe) {
                    e.stopPropagation();
                }
            });
            $.each([ "info", "counter", "image-nav" ], function(i, el) {
                if (options["show" + el.substr(0, 1).toUpperCase() + el.substr(1).replace(/-/, "")] === false) {
                    Utils.moveOut(self.get(el.toLowerCase()));
                }
            });
            this.load();
            if (!options.keepSource && !IE) {
                this._target.innerHTML = "";
            }
            if (this.get("errors")) {
                this.appendChild("target", "errors");
            }
            this.appendChild("target", "container");
            if (options.carousel) {
                var count = 0, show = options.show;
                this.bind(Galleria.THUMBNAIL, function() {
                    this.updateCarousel();
                    if (++count == this.getDataLength() && typeof show == "number" && show > 0) {
                        this._carousel.follow(show);
                    }
                });
            }
            if (options.responsive) {
                $win.on("resize", function() {
                    if (!self.isFullscreen()) {
                        self.resize();
                    }
                });
            }
            if (options.fullscreenDoubleTap) {
                this.$("stage").on("touchstart", function() {
                    var last, cx, cy, lx, ly, now, getData = function(e) {
                        return e.originalEvent.touches ? e.originalEvent.touches[0] : e;
                    };
                    self.$("stage").on("touchmove", function() {
                        last = 0;
                    });
                    return function(e) {
                        if (/(-left|-right)/.test(e.target.className)) {
                            return;
                        }
                        now = Utils.timestamp();
                        cx = getData(e).pageX;
                        cy = getData(e).pageY;
                        if (e.originalEvent.touches.length < 2 && now - last < 300 && cx - lx < 20 && cy - ly < 20) {
                            self.toggleFullscreen();
                            e.preventDefault();
                            return;
                        }
                        last = now;
                        lx = cx;
                        ly = cy;
                    };
                }());
            }
            $.each(Galleria.on.binds, function(i, bind) {
                if ($.inArray(bind.hash, self._binds) == -1) {
                    self.bind(bind.type, bind.callback);
                }
            });
            return this;
        },
        addTimer: function() {
            this._timer.add.apply(this._timer, Utils.array(arguments));
            return this;
        },
        clearTimer: function() {
            this._timer.clear.apply(this._timer, Utils.array(arguments));
            return this;
        },
        _getWH: function() {
            var $container = this.$("container"), $target = this.$("target"), self = this, num = {}, arr;
            $.each([ "width", "height" ], function(i, m) {
                if (self._options[m] && typeof self._options[m] === "number") {
                    num[m] = self._options[m];
                } else {
                    arr = [ Utils.parseValue($container.css(m)), Utils.parseValue($target.css(m)), $container[m](), $target[m]() ];
                    if (!self["_" + m]) {
                        arr.splice(arr.length, Utils.parseValue($container.css("min-" + m)), Utils.parseValue($target.css("min-" + m)));
                    }
                    num[m] = M.max.apply(M, arr);
                }
            });
            if (self._userRatio) {
                num.height = num.width * self._userRatio;
            }
            return num;
        },
        _createThumbnails: function(push) {
            this.get("total").innerHTML = this.getDataLength();
            var src, thumb, data, $container, self = this, o = this._options, i = push ? this._data.length - push.length : 0, chunk = i, thumbchunk = [], loadindex = 0, gif = IE < 8 ? "http://upload.wikimedia.org/wikipedia/commons/c/c0/Blank.gif" : "data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw%3D%3D", active = function() {
                var a = self.$("thumbnails").find(".active");
                if (!a.length) {
                    return false;
                }
                return a.find("img").attr("src");
            }(), optval = typeof o.thumbnails === "string" ? o.thumbnails.toLowerCase() : null, getStyle = function(prop) {
                return doc.defaultView && doc.defaultView.getComputedStyle ? doc.defaultView.getComputedStyle(thumb.container, null)[prop] : $container.css(prop);
            }, fake = function(image, index, container) {
                return function() {
                    $(container).append(image);
                    self.trigger({
                        type: Galleria.THUMBNAIL,
                        thumbTarget: image,
                        index: index,
                        galleriaData: self.getData(index)
                    });
                };
            }, onThumbEvent = function(e) {
                if (o.pauseOnInteraction) {
                    self.pause();
                }
                var index = $(e.currentTarget).data("index");
                if (self.getIndex() !== index) {
                    self.show(index);
                }
                e.preventDefault();
            }, thumbComplete = function(thumb, callback) {
                $(thumb.container).css("visibility", "visible");
                self.trigger({
                    type: Galleria.THUMBNAIL,
                    thumbTarget: thumb.image,
                    index: thumb.data.order,
                    galleriaData: self.getData(thumb.data.order)
                });
                if (typeof callback == "function") {
                    callback.call(self, thumb);
                }
            }, onThumbLoad = function(thumb, callback) {
                thumb.scale({
                    width: thumb.data.width,
                    height: thumb.data.height,
                    crop: o.thumbCrop,
                    margin: o.thumbMargin,
                    canvas: o.useCanvas,
                    position: o.thumbPosition,
                    complete: function(thumb) {
                        var top = [ "left", "top" ], arr = [ "Width", "Height" ], m, css, data = self.getData(thumb.index);
                        $.each(arr, function(i, measure) {
                            m = measure.toLowerCase();
                            if (o.thumbCrop !== true || o.thumbCrop === m) {
                                css = {};
                                css[m] = thumb[m];
                                $(thumb.container).css(css);
                                css = {};
                                css[top[i]] = 0;
                                $(thumb.image).css(css);
                            }
                            thumb["outer" + measure] = $(thumb.container)["outer" + measure](true);
                        });
                        Utils.toggleQuality(thumb.image, o.thumbQuality === true || o.thumbQuality === "auto" && thumb.original.width < thumb.width * 3);
                        if (o.thumbDisplayOrder && !thumb.lazy) {
                            $.each(thumbchunk, function(i, th) {
                                if (i === loadindex && th.ready && !th.displayed) {
                                    loadindex++;
                                    th.displayed = true;
                                    thumbComplete(th, callback);
                                    return;
                                }
                            });
                        } else {
                            thumbComplete(thumb, callback);
                        }
                    }
                });
            };
            if (!push) {
                this._thumbnails = [];
                this.$("thumbnails").empty();
            }
            for (;this._data[i]; i++) {
                data = this._data[i];
                src = data.thumb || data.image;
                if ((o.thumbnails === true || optval == "lazy") && (data.thumb || data.image)) {
                    thumb = new Galleria.Picture(i);
                    thumb.index = i;
                    thumb.displayed = false;
                    thumb.lazy = false;
                    thumb.video = false;
                    this.$("thumbnails").append(thumb.container);
                    $container = $(thumb.container);
                    $container.css("visibility", "hidden");
                    thumb.data = {
                        width: Utils.parseValue(getStyle("width")),
                        height: Utils.parseValue(getStyle("height")),
                        order: i,
                        src: src
                    };
                    if (o.thumbCrop !== true) {
                        $container.css({
                            width: "auto",
                            height: "auto"
                        });
                    } else {
                        $container.css({
                            width: thumb.data.width,
                            height: thumb.data.height
                        });
                    }
                    if (optval == "lazy") {
                        $container.addClass("lazy");
                        thumb.lazy = true;
                        thumb.load(gif, {
                            height: thumb.data.height,
                            width: thumb.data.width
                        });
                    } else {
                        thumb.load(src, onThumbLoad);
                    }
                    if (o.preload === "all") {
                        thumb.preload(data.image);
                    }
                } else if (data.iframe && optval !== null || optval === "empty" || optval === "numbers") {
                    thumb = {
                        container: Utils.create("galleria-image"),
                        image: Utils.create("img", "span"),
                        ready: true,
                        data: {
                            order: i
                        }
                    };
                    if (optval === "numbers") {
                        $(thumb.image).text(i + 1);
                    }
                    if (data.iframe) {
                        $(thumb.image).addClass("iframe");
                    }
                    this.$("thumbnails").append(thumb.container);
                    window.setTimeout(fake(thumb.image, i, thumb.container), 50 + i * 20);
                } else {
                    thumb = {
                        container: null,
                        image: null
                    };
                }
                $(thumb.container).add(o.keepSource && o.linkSourceImages ? data.original : null).data("index", i).on(o.thumbEventType, onThumbEvent).data("thumbload", onThumbLoad);
                if (active === src) {
                    $(thumb.container).addClass("active");
                }
                this._thumbnails.push(thumb);
            }
            thumbchunk = this._thumbnails.slice(chunk);
            return this;
        },
        lazyLoad: function(index, complete) {
            var arr = index.constructor == Array ? index : [ index ], self = this, loaded = 0;
            $.each(arr, function(i, ind) {
                if (ind > self._thumbnails.length - 1) {
                    return;
                }
                var thumb = self._thumbnails[ind], data = thumb.data, callback = function() {
                    if (++loaded == arr.length && typeof complete == "function") {
                        complete.call(self);
                    }
                }, thumbload = $(thumb.container).data("thumbload");
                if (thumbload) {
                    if (thumb.video) {
                        thumbload.call(self, thumb, callback);
                    } else {
                        thumb.load(data.src, function(thumb) {
                            thumbload.call(self, thumb, callback);
                        });
                    }
                }
            });
            return this;
        },
        lazyLoadChunks: function(size, delay) {
            var len = this.getDataLength(), i = 0, n = 0, arr = [], temp = [], self = this;
            delay = delay || 0;
            for (;i < len; i++) {
                temp.push(i);
                if (++n == size || i == len - 1) {
                    arr.push(temp);
                    n = 0;
                    temp = [];
                }
            }
            var init = function(wait) {
                var a = arr.shift();
                if (a) {
                    window.setTimeout(function() {
                        self.lazyLoad(a, function() {
                            init(true);
                        });
                    }, delay && wait ? delay : 0);
                }
            };
            init(false);
            return this;
        },
        _run: function() {
            var self = this;
            self._createThumbnails();
            Utils.wait({
                timeout: 1e4,
                until: function() {
                    if (Galleria.OPERA) {
                        self.$("stage").css("display", "inline-block");
                    }
                    self._stageWidth = self.$("stage").width();
                    self._stageHeight = self.$("stage").height();
                    return self._stageWidth && self._stageHeight > 50;
                },
                success: function() {
                    _galleries.push(self);
                    if (self._options.swipe) {
                        var $images = self.$("images").width(self.getDataLength() * self._stageWidth);
                        $.each(new Array(self.getDataLength()), function(i) {
                            var image = new Galleria.Picture(), data = self.getData(i);
                            $(image.container).css({
                                position: "absolute",
                                top: 0,
                                left: self._stageWidth * i
                            }).prepend(self._layers[i] = $(Utils.create("galleria-layer")).css({
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                zIndex: 2
                            })[0]).appendTo($images);
                            if (data.video) {
                                _playIcon(image.container);
                            }
                            self._controls.slides.push(image);
                            var frame = new Galleria.Picture();
                            frame.isIframe = true;
                            $(frame.container).attr("class", "galleria-frame").css({
                                position: "absolute",
                                top: 0,
                                left: 0,
                                zIndex: 4,
                                background: "#000",
                                display: "none"
                            }).appendTo(image.container);
                            self._controls.frames.push(frame);
                        });
                        self.finger.setup();
                    }
                    Utils.show(self.get("counter"));
                    if (self._options.carousel) {
                        self._carousel.bindControls();
                    }
                    if (self._options.autoplay) {
                        self.pause();
                        if (typeof self._options.autoplay === "number") {
                            self._playtime = self._options.autoplay;
                        }
                        self._playing = true;
                    }
                    if (self._firstrun) {
                        if (self._options.autoplay) {
                            self.trigger(Galleria.PLAY);
                        }
                        if (typeof self._options.show === "number") {
                            self.show(self._options.show);
                        }
                        return;
                    }
                    self._firstrun = true;
                    if (Galleria.History) {
                        Galleria.History.change(function(value) {
                            if (isNaN(value)) {
                                window.history.go(-1);
                            } else {
                                self.show(value, undef, true);
                            }
                        });
                    }
                    self.trigger(Galleria.READY);
                    self.theme.init.call(self, self._options);
                    $.each(Galleria.ready.callbacks, function(i, fn) {
                        if (typeof fn == "function") {
                            fn.call(self, self._options);
                        }
                    });
                    self._options.extend.call(self, self._options);
                    if (/^[0-9]{1,4}$/.test(HASH) && Galleria.History) {
                        self.show(HASH, undef, true);
                    } else if (self._data[self._options.show]) {
                        self.show(self._options.show);
                    }
                    if (self._options.autoplay) {
                        self.trigger(Galleria.PLAY);
                    }
                },
                error: function() {
                    Galleria.raise("Stage width or height is too small to show the gallery. Traced measures: width:" + self._stageWidth + "px, height: " + self._stageHeight + "px.", true);
                }
            });
        },
        load: function(source, selector, config) {
            var self = this, o = this._options;
            this._data = [];
            this._thumbnails = [];
            this.$("thumbnails").empty();
            if (typeof selector === "function") {
                config = selector;
                selector = null;
            }
            source = source || o.dataSource;
            selector = selector || o.dataSelector;
            config = config || o.dataConfig;
            if ($.isPlainObject(source)) {
                source = [ source ];
            }
            if ($.isArray(source)) {
                if (this.validate(source)) {
                    this._data = source;
                } else {
                    Galleria.raise("Load failed: JSON Array not valid.");
                }
            } else {
                selector += ",.video,.iframe";
                $(source).find(selector).each(function(i, elem) {
                    elem = $(elem);
                    var data = {}, parent = elem.parent(), href = parent.attr("href"), rel = parent.attr("rel");
                    if (href && (elem[0].nodeName == "IMG" || elem.hasClass("video")) && _videoTest(href)) {
                        data.video = href;
                    } else if (href && elem.hasClass("iframe")) {
                        data.iframe = href;
                    } else {
                        data.image = data.big = href;
                    }
                    if (rel) {
                        data.big = rel;
                    }
                    $.each("big title description link layer image".split(" "), function(i, val) {
                        if (elem.data(val)) {
                            data[val] = elem.data(val).toString();
                        }
                    });
                    if (!data.big) {
                        data.big = data.image;
                    }
                    self._data.push($.extend({
                        title: elem.attr("title") || "",
                        thumb: elem.attr("src"),
                        image: elem.attr("src"),
                        big: elem.attr("src"),
                        description: elem.attr("alt") || "",
                        link: elem.attr("longdesc"),
                        original: elem.get(0)
                    }, data, config(elem)));
                });
            }
            if (typeof o.dataSort == "function") {
                protoArray.sort.call(this._data, o.dataSort);
            } else if (o.dataSort == "random") {
                this._data.sort(function() {
                    return M.round(M.random()) - .5;
                });
            }
            if (this.getDataLength()) {
                this._parseData(function() {
                    this.trigger(Galleria.DATA);
                });
            }
            return this;
        },
        _parseData: function(callback) {
            var self = this, current, ready = false, onload = function() {
                var complete = true;
                $.each(self._data, function(i, data) {
                    if (data.loading) {
                        complete = false;
                        return false;
                    }
                });
                if (complete && !ready) {
                    ready = true;
                    callback.call(self);
                }
            };
            $.each(this._data, function(i, data) {
                current = self._data[i];
                if ("thumb" in data === false) {
                    current.thumb = data.image;
                }
                if (!data.big) {
                    current.big = data.image;
                }
                if ("video" in data) {
                    var result = _videoTest(data.video);
                    if (result) {
                        current.iframe = new Video(result.provider, result.id).embed() + function() {
                            if (typeof self._options[result.provider] == "object") {
                                var str = "?", arr = [];
                                $.each(self._options[result.provider], function(key, val) {
                                    arr.push(key + "=" + val);
                                });
                                if (result.provider == "youtube") {
                                    arr = [ "wmode=opaque" ].concat(arr);
                                }
                                return str + arr.join("&");
                            }
                            return "";
                        }();
                        if (!current.thumb || !current.image) {
                            $.each([ "thumb", "image" ], function(i, type) {
                                if (type == "image" && !self._options.videoPoster) {
                                    current.image = undef;
                                    return;
                                }
                                var video = new Video(result.provider, result.id);
                                if (!current[type]) {
                                    current.loading = true;
                                    video.getMedia(type, function(current, type) {
                                        return function(src) {
                                            current[type] = src;
                                            if (type == "image" && !current.big) {
                                                current.big = current.image;
                                            }
                                            delete current.loading;
                                            onload();
                                        };
                                    }(current, type));
                                }
                            });
                        }
                    }
                }
            });
            onload();
            return this;
        },
        destroy: function() {
            this.$("target").data("galleria", null);
            this.$("container").off("galleria");
            this.get("target").innerHTML = this._original.html;
            this.clearTimer();
            Utils.removeFromArray(_instances, this);
            Utils.removeFromArray(_galleries, this);
            if (Galleria._waiters !== undefined && Galleria._waiters.length) {
                $.each(Galleria._waiters, function(i, w) {
                    if (w) window.clearTimeout(w);
                });
            }
            return this;
        },
        splice: function() {
            var self = this, args = Utils.array(arguments);
            window.setTimeout(function() {
                protoArray.splice.apply(self._data, args);
                self._parseData(function() {
                    self._createThumbnails();
                });
            }, 2);
            return self;
        },
        push: function() {
            var self = this, args = Utils.array(arguments);
            if (args.length == 1 && args[0].constructor == Array) {
                args = args[0];
            }
            window.setTimeout(function() {
                protoArray.push.apply(self._data, args);
                self._parseData(function() {
                    self._createThumbnails(args);
                });
            }, 2);
            return self;
        },
        _getActive: function() {
            return this._controls.getActive();
        },
        validate: function(data) {
            return true;
        },
        bind: function(type, fn) {
            type = _patchEvent(type);
            this.$("container").on(type, this.proxy(fn));
            return this;
        },
        unbind: function(type) {
            type = _patchEvent(type);
            this.$("container").off(type);
            return this;
        },
        trigger: function(type) {
            type = typeof type === "object" ? $.extend(type, {
                scope: this
            }) : {
                type: _patchEvent(type),
                scope: this
            };
            this.$("container").trigger(type);
            return this;
        },
        addIdleState: function(elem, styles, from, hide) {
            this._idle.add.apply(this._idle, Utils.array(arguments));
            return this;
        },
        removeIdleState: function(elem) {
            this._idle.remove.apply(this._idle, Utils.array(arguments));
            return this;
        },
        enterIdleMode: function() {
            this._idle.hide();
            return this;
        },
        exitIdleMode: function() {
            this._idle.showAll();
            return this;
        },
        enterFullscreen: function(callback) {
            this._fullscreen.enter.apply(this, Utils.array(arguments));
            return this;
        },
        exitFullscreen: function(callback) {
            this._fullscreen.exit.apply(this, Utils.array(arguments));
            return this;
        },
        toggleFullscreen: function(callback) {
            this._fullscreen[this.isFullscreen() ? "exit" : "enter"].apply(this, Utils.array(arguments));
            return this;
        },
        bindTooltip: function(elem, value) {
            this._tooltip.bind.apply(this._tooltip, Utils.array(arguments));
            return this;
        },
        defineTooltip: function(elem, value) {
            this._tooltip.define.apply(this._tooltip, Utils.array(arguments));
            return this;
        },
        refreshTooltip: function(elem) {
            this._tooltip.show.apply(this._tooltip, Utils.array(arguments));
            return this;
        },
        openLightbox: function() {
            this._lightbox.show.apply(this._lightbox, Utils.array(arguments));
            return this;
        },
        closeLightbox: function() {
            this._lightbox.hide.apply(this._lightbox, Utils.array(arguments));
            return this;
        },
        hasVariation: function(variation) {
            return $.inArray(variation, this._options.variation.split(/\s+/)) > -1;
        },
        getActiveImage: function() {
            var active = this._getActive();
            return active ? active.image : undef;
        },
        getActiveThumb: function() {
            return this._thumbnails[this._active].image || undef;
        },
        getMousePosition: function(e) {
            return {
                x: e.pageX - this.$("container").offset().left,
                y: e.pageY - this.$("container").offset().top
            };
        },
        addPan: function(img) {
            if (this._options.imageCrop === false) {
                return;
            }
            img = $(img || this.getActiveImage());
            var self = this, x = img.width() / 2, y = img.height() / 2, destX = parseInt(img.css("left"), 10), destY = parseInt(img.css("top"), 10), curX = destX || 0, curY = destY || 0, distX = 0, distY = 0, active = false, ts = Utils.timestamp(), cache = 0, move = 0, position = function(dist, cur, pos) {
                if (dist > 0) {
                    move = M.round(M.max(dist * -1, M.min(0, cur)));
                    if (cache !== move) {
                        cache = move;
                        if (IE === 8) {
                            img.parent()["scroll" + pos](move * -1);
                        } else {
                            var css = {};
                            css[pos.toLowerCase()] = move;
                            img.css(css);
                        }
                    }
                }
            }, calculate = function(e) {
                if (Utils.timestamp() - ts < 50) {
                    return;
                }
                active = true;
                x = self.getMousePosition(e).x;
                y = self.getMousePosition(e).y;
            }, loop = function(e) {
                if (!active) {
                    return;
                }
                distX = img.width() - self._stageWidth;
                distY = img.height() - self._stageHeight;
                destX = x / self._stageWidth * distX * -1;
                destY = y / self._stageHeight * distY * -1;
                curX += (destX - curX) / self._options.imagePanSmoothness;
                curY += (destY - curY) / self._options.imagePanSmoothness;
                position(distY, curY, "Top");
                position(distX, curX, "Left");
            };
            if (IE === 8) {
                img.parent().scrollTop(curY * -1).scrollLeft(curX * -1);
                img.css({
                    top: 0,
                    left: 0
                });
            }
            this.$("stage").off("mousemove", calculate).on("mousemove", calculate);
            this.addTimer("pan" + self._id, loop, 50, true);
            return this;
        },
        proxy: function(fn, scope) {
            if (typeof fn !== "function") {
                return F;
            }
            scope = scope || this;
            return function() {
                return fn.apply(scope, Utils.array(arguments));
            };
        },
        getThemeName: function() {
            return this.theme.name;
        },
        removePan: function() {
            this.$("stage").off("mousemove");
            this.clearTimer("pan" + this._id);
            return this;
        },
        addElement: function(id) {
            var dom = this._dom;
            $.each(Utils.array(arguments), function(i, blueprint) {
                dom[blueprint] = Utils.create("galleria-" + blueprint);
            });
            return this;
        },
        attachKeyboard: function(map) {
            this._keyboard.attach.apply(this._keyboard, Utils.array(arguments));
            return this;
        },
        detachKeyboard: function() {
            this._keyboard.detach.apply(this._keyboard, Utils.array(arguments));
            return this;
        },
        appendChild: function(parentID, childID) {
            this.$(parentID).append(this.get(childID) || childID);
            return this;
        },
        prependChild: function(parentID, childID) {
            this.$(parentID).prepend(this.get(childID) || childID);
            return this;
        },
        remove: function(elemID) {
            this.$(Utils.array(arguments).join(",")).remove();
            return this;
        },
        append: function(data) {
            var i, j;
            for (i in data) {
                if (data.hasOwnProperty(i)) {
                    if (data[i].constructor === Array) {
                        for (j = 0; data[i][j]; j++) {
                            this.appendChild(i, data[i][j]);
                        }
                    } else {
                        this.appendChild(i, data[i]);
                    }
                }
            }
            return this;
        },
        _scaleImage: function(image, options) {
            image = image || this._controls.getActive();
            if (!image) {
                return;
            }
            var complete, scaleLayer = function(img) {
                $(img.container).children(":first").css({
                    top: M.max(0, Utils.parseValue(img.image.style.top)),
                    left: M.max(0, Utils.parseValue(img.image.style.left)),
                    width: Utils.parseValue(img.image.width),
                    height: Utils.parseValue(img.image.height)
                });
            };
            options = $.extend({
                width: this._stageWidth,
                height: this._stageHeight,
                crop: this._options.imageCrop,
                max: this._options.maxScaleRatio,
                min: this._options.minScaleRatio,
                margin: this._options.imageMargin,
                position: this._options.imagePosition,
                iframelimit: this._options.maxVideoSize
            }, options);
            if (this._options.layerFollow && this._options.imageCrop !== true) {
                if (typeof options.complete == "function") {
                    complete = options.complete;
                    options.complete = function() {
                        complete.call(image, image);
                        scaleLayer(image);
                    };
                } else {
                    options.complete = scaleLayer;
                }
            } else {
                $(image.container).children(":first").css({
                    top: 0,
                    left: 0
                });
            }
            image.scale(options);
            return this;
        },
        updateCarousel: function() {
            this._carousel.update();
            return this;
        },
        resize: function(measures, complete) {
            if (typeof measures == "function") {
                complete = measures;
                measures = undef;
            }
            measures = $.extend({
                width: 0,
                height: 0
            }, measures);
            var self = this, $container = this.$("container");
            $.each(measures, function(m, val) {
                if (!val) {
                    $container[m]("auto");
                    measures[m] = self._getWH()[m];
                }
            });
            $.each(measures, function(m, val) {
                $container[m](val);
            });
            return this.rescale(complete);
        },
        rescale: function(width, height, complete) {
            var self = this;
            if (typeof width === "function") {
                complete = width;
                width = undef;
            }
            var scale = function() {
                self._stageWidth = width || self.$("stage").width();
                self._stageHeight = height || self.$("stage").height();
                if (self._options.swipe) {
                    $.each(self._controls.slides, function(i, img) {
                        self._scaleImage(img);
                        $(img.container).css("left", self._stageWidth * i);
                    });
                    self.$("images").css("width", self._stageWidth * self.getDataLength());
                } else {
                    self._scaleImage();
                }
                if (self._options.carousel) {
                    self.updateCarousel();
                }
                var frame = self._controls.frames[self._controls.active];
                if (frame) {
                    self._controls.frames[self._controls.active].scale({
                        width: self._stageWidth,
                        height: self._stageHeight,
                        iframelimit: self._options.maxVideoSize
                    });
                }
                self.trigger(Galleria.RESCALE);
                if (typeof complete === "function") {
                    complete.call(self);
                }
            };
            scale.call(self);
            return this;
        },
        refreshImage: function() {
            this._scaleImage();
            if (this._options.imagePan) {
                this.addPan();
            }
            return this;
        },
        _preload: function() {
            if (this._options.preload) {
                var p, i, n = this.getNext(), ndata;
                try {
                    for (i = this._options.preload; i > 0; i--) {
                        p = new Galleria.Picture();
                        ndata = this.getData(n);
                        p.preload(this.isFullscreen() && ndata.big ? ndata.big : ndata.image);
                        n = this.getNext(n);
                    }
                } catch (e) {}
            }
        },
        show: function(index, rewind, _history) {
            var swipe = this._options.swipe;
            if (!swipe && (this._queue.length > 3 || index === false || !this._options.queue && this._queue.stalled)) {
                return;
            }
            index = M.max(0, M.min(parseInt(index, 10), this.getDataLength() - 1));
            rewind = typeof rewind !== "undefined" ? !!rewind : index < this.getIndex();
            _history = _history || false;
            if (!_history && Galleria.History) {
                Galleria.History.set(index.toString());
                return;
            }
            if (this.finger && index !== this._active) {
                this.finger.to = -(index * this.finger.width);
                this.finger.index = index;
            }
            this._active = index;
            if (swipe) {
                var data = this.getData(index), self = this;
                if (!data) {
                    return;
                }
                var src = this.isFullscreen() && data.big ? data.big : data.image || data.iframe, image = this._controls.slides[index], cached = image.isCached(src), thumb = this._thumbnails[index];
                var evObj = {
                    cached: cached,
                    index: index,
                    rewind: rewind,
                    imageTarget: image.image,
                    thumbTarget: thumb.image,
                    galleriaData: data
                };
                this.trigger($.extend(evObj, {
                    type: Galleria.LOADSTART
                }));
                self.$("container").removeClass("videoplay");
                var complete = function() {
                    self._layers[index].innerHTML = self.getData().layer || "";
                    self.trigger($.extend(evObj, {
                        type: Galleria.LOADFINISH
                    }));
                    self._playCheck();
                };
                self._preload();
                window.setTimeout(function() {
                    if (!image.ready || $(image.image).attr("src") != src) {
                        if (data.iframe && !data.image) {
                            image.isIframe = true;
                        }
                        image.load(src, function(image) {
                            evObj.imageTarget = image.image;
                            self._scaleImage(image, complete).trigger($.extend(evObj, {
                                type: Galleria.IMAGE
                            }));
                            complete();
                        });
                    } else {
                        self.trigger($.extend(evObj, {
                            type: Galleria.IMAGE
                        }));
                        complete();
                    }
                }, 100);
            } else {
                protoArray.push.call(this._queue, {
                    index: index,
                    rewind: rewind
                });
                if (!this._queue.stalled) {
                    this._show();
                }
            }
            return this;
        },
        _show: function() {
            var self = this, queue = this._queue[0], data = this.getData(queue.index);
            if (!data) {
                return;
            }
            var src = this.isFullscreen() && data.big ? data.big : data.image || data.iframe, active = this._controls.getActive(), next = this._controls.getNext(), cached = next.isCached(src), thumb = this._thumbnails[queue.index], mousetrigger = function() {
                $(next.image).trigger("mouseup");
            };
            self.$("container").toggleClass("iframe", !!data.isIframe).removeClass("videoplay");
            var complete = function(data, next, active, queue, thumb) {
                return function() {
                    var win;
                    _transitions.active = false;
                    Utils.toggleQuality(next.image, self._options.imageQuality);
                    self._layers[self._controls.active].innerHTML = "";
                    $(active.container).css({
                        zIndex: 0,
                        opacity: 0
                    }).show();
                    $(active.container).find("iframe, .galleria-videoicon").remove();
                    $(self._controls.frames[self._controls.active].container).hide();
                    $(next.container).css({
                        zIndex: 1,
                        left: 0,
                        top: 0
                    }).show();
                    self._controls.swap();
                    if (self._options.imagePan) {
                        self.addPan(next.image);
                    }
                    if (data.iframe && data.image || data.link || self._options.lightbox || self._options.clicknext) {
                        $(next.image).css({
                            cursor: "pointer"
                        }).on("mouseup", function(e) {
                            if (typeof e.which == "number" && e.which > 1) {
                                return;
                            }
                            if (data.iframe) {
                                if (self.isPlaying()) {
                                    self.pause();
                                }
                                var frame = self._controls.frames[self._controls.active], w = self._stageWidth, h = self._stageHeight;
                                $(frame.container).css({
                                    width: w,
                                    height: h,
                                    opacity: 0
                                }).show().animate({
                                    opacity: 1
                                }, 200);
                                window.setTimeout(function() {
                                    frame.load(data.iframe + (data.video ? "&autoplay=1" : ""), {
                                        width: w,
                                        height: h
                                    }, function(frame) {
                                        self.$("container").addClass("videoplay");
                                        frame.scale({
                                            width: self._stageWidth,
                                            height: self._stageHeight,
                                            iframelimit: data.video ? self._options.maxVideoSize : undef
                                        });
                                    });
                                }, 100);
                                return;
                            }
                            if (self._options.clicknext && !Galleria.TOUCH) {
                                if (self._options.pauseOnInteraction) {
                                    self.pause();
                                }
                                self.next();
                                return;
                            }
                            if (data.link) {
                                if (self._options.popupLinks) {
                                    win = window.open(data.link, "_blank");
                                } else {
                                    window.location.href = data.link;
                                }
                                return;
                            }
                            if (self._options.lightbox) {
                                self.openLightbox();
                            }
                        });
                    }
                    self._playCheck();
                    self.trigger({
                        type: Galleria.IMAGE,
                        index: queue.index,
                        imageTarget: next.image,
                        thumbTarget: thumb.image,
                        galleriaData: data
                    });
                    protoArray.shift.call(self._queue);
                    self._queue.stalled = false;
                    if (self._queue.length) {
                        self._show();
                    }
                };
            }(data, next, active, queue, thumb);
            if (this._options.carousel && this._options.carouselFollow) {
                this._carousel.follow(queue.index);
            }
            self._preload();
            Utils.show(next.container);
            next.isIframe = data.iframe && !data.image;
            $(self._thumbnails[queue.index].container).addClass("active").siblings(".active").removeClass("active");
            self.trigger({
                type: Galleria.LOADSTART,
                cached: cached,
                index: queue.index,
                rewind: queue.rewind,
                imageTarget: next.image,
                thumbTarget: thumb.image,
                galleriaData: data
            });
            self._queue.stalled = true;
            next.load(src, function(next) {
                var layer = $(self._layers[1 - self._controls.active]).html(data.layer || "").hide();
                self._scaleImage(next, {
                    complete: function(next) {
                        if ("image" in active) {
                            Utils.toggleQuality(active.image, false);
                        }
                        Utils.toggleQuality(next.image, false);
                        self.removePan();
                        self.setInfo(queue.index);
                        self.setCounter(queue.index);
                        if (data.layer) {
                            layer.show();
                            if (data.iframe && data.image || data.link || self._options.lightbox || self._options.clicknext) {
                                layer.css("cursor", "pointer").off("mouseup").mouseup(mousetrigger);
                            }
                        }
                        if (data.video && data.image) {
                            _playIcon(next.container);
                        }
                        var transition = self._options.transition;
                        $.each({
                            initial: active.image === null,
                            touch: Galleria.TOUCH,
                            fullscreen: self.isFullscreen()
                        }, function(type, arg) {
                            if (arg && self._options[type + "Transition"] !== undef) {
                                transition = self._options[type + "Transition"];
                                return false;
                            }
                        });
                        if (transition in _transitions.effects === false) {
                            complete();
                        } else {
                            var params = {
                                prev: active.container,
                                next: next.container,
                                rewind: queue.rewind,
                                speed: self._options.transitionSpeed || 400
                            };
                            _transitions.active = true;
                            _transitions.init.call(self, transition, params, complete);
                        }
                        self.trigger({
                            type: Galleria.LOADFINISH,
                            cached: cached,
                            index: queue.index,
                            rewind: queue.rewind,
                            imageTarget: next.image,
                            thumbTarget: self._thumbnails[queue.index].image,
                            galleriaData: self.getData(queue.index)
                        });
                    }
                });
            });
        },
        getNext: function(base) {
            base = typeof base === "number" ? base : this.getIndex();
            return base === this.getDataLength() - 1 ? 0 : base + 1;
        },
        getPrev: function(base) {
            base = typeof base === "number" ? base : this.getIndex();
            return base === 0 ? this.getDataLength() - 1 : base - 1;
        },
        next: function() {
            if (this.getDataLength() > 1) {
                this.show(this.getNext(), false);
            }
            return this;
        },
        prev: function() {
            if (this.getDataLength() > 1) {
                this.show(this.getPrev(), true);
            }
            return this;
        },
        get: function(elemId) {
            return elemId in this._dom ? this._dom[elemId] : null;
        },
        getData: function(index) {
            return index in this._data ? this._data[index] : this._data[this._active];
        },
        getDataLength: function() {
            return this._data.length;
        },
        getIndex: function() {
            return typeof this._active === "number" ? this._active : false;
        },
        getStageHeight: function() {
            return this._stageHeight;
        },
        getStageWidth: function() {
            return this._stageWidth;
        },
        getOptions: function(key) {
            return typeof key === "undefined" ? this._options : this._options[key];
        },
        setOptions: function(key, value) {
            if (typeof key === "object") {
                $.extend(this._options, key);
            } else {
                this._options[key] = value;
            }
            return this;
        },
        play: function(delay) {
            this._playing = true;
            this._playtime = delay || this._playtime;
            this._playCheck();
            this.trigger(Galleria.PLAY);
            return this;
        },
        pause: function() {
            this._playing = false;
            this.trigger(Galleria.PAUSE);
            return this;
        },
        playToggle: function(delay) {
            return this._playing ? this.pause() : this.play(delay);
        },
        isPlaying: function() {
            return this._playing;
        },
        isFullscreen: function() {
            return this._fullscreen.active;
        },
        _playCheck: function() {
            var self = this, played = 0, interval = 20, now = Utils.timestamp(), timer_id = "play" + this._id;
            if (this._playing) {
                this.clearTimer(timer_id);
                var fn = function() {
                    played = Utils.timestamp() - now;
                    if (played >= self._playtime && self._playing) {
                        self.clearTimer(timer_id);
                        self.next();
                        return;
                    }
                    if (self._playing) {
                        self.trigger({
                            type: Galleria.PROGRESS,
                            percent: M.ceil(played / self._playtime * 100),
                            seconds: M.floor(played / 1e3),
                            milliseconds: played
                        });
                        self.addTimer(timer_id, fn, interval);
                    }
                };
                self.addTimer(timer_id, fn, interval);
            }
        },
        setPlaytime: function(delay) {
            this._playtime = delay;
            return this;
        },
        setIndex: function(val) {
            this._active = val;
            return this;
        },
        setCounter: function(index) {
            if (typeof index === "number") {
                index++;
            } else if (typeof index === "undefined") {
                index = this.getIndex() + 1;
            }
            this.get("current").innerHTML = index;
            if (IE) {
                var count = this.$("counter"), opacity = count.css("opacity");
                if (parseInt(opacity, 10) === 1) {
                    Utils.removeAlpha(count[0]);
                } else {
                    this.$("counter").css("opacity", opacity);
                }
            }
            return this;
        },
        setInfo: function(index) {
            var self = this, data = this.getData(index);
            $.each([ "title", "description" ], function(i, type) {
                var elem = self.$("info-" + type);
                if (!!data[type]) {
                    elem[data[type].length ? "show" : "hide"]().html(data[type]);
                } else {
                    elem.empty().hide();
                }
            });
            return this;
        },
        hasInfo: function(index) {
            var check = "title description".split(" "), i;
            for (i = 0; check[i]; i++) {
                if (!!this.getData(index)[check[i]]) {
                    return true;
                }
            }
            return false;
        },
        jQuery: function(str) {
            var self = this, ret = [];
            $.each(str.split(","), function(i, elemId) {
                elemId = $.trim(elemId);
                if (self.get(elemId)) {
                    ret.push(elemId);
                }
            });
            var jQ = $(self.get(ret.shift()));
            $.each(ret, function(i, elemId) {
                jQ = jQ.add(self.get(elemId));
            });
            return jQ;
        },
        $: function(str) {
            return this.jQuery.apply(this, Utils.array(arguments));
        }
    };
    $.each(_events, function(i, ev) {
        var type = /_/.test(ev) ? ev.replace(/_/g, "") : ev;
        Galleria[ev.toUpperCase()] = "galleria." + type;
    });
    $.extend(Galleria, {
        IE9: IE === 9,
        IE8: IE === 8,
        IE7: IE === 7,
        IE6: IE === 6,
        IE: IE,
        WEBKIT: /webkit/.test(NAV),
        CHROME: /chrome/.test(NAV),
        SAFARI: /safari/.test(NAV) && !/chrome/.test(NAV),
        QUIRK: IE && doc.compatMode && doc.compatMode === "BackCompat",
        MAC: /mac/.test(navigator.platform.toLowerCase()),
        OPERA: !!window.opera,
        IPHONE: /iphone/.test(NAV),
        IPAD: /ipad/.test(NAV),
        ANDROID: /android/.test(NAV),
        TOUCH: "ontouchstart" in doc && MOBILE
    });
    Galleria.addTheme = function(theme) {
        if (!theme.name) {
            Galleria.raise("No theme name specified");
        }
        if (!theme.version || parseInt(Galleria.version * 10) > parseInt(theme.version * 10)) {
            Galleria.raise("This version of Galleria requires " + theme.name + " theme version " + parseInt(Galleria.version * 10) / 10 + " or later", true);
        }
        if (typeof theme.defaults !== "object") {
            theme.defaults = {};
        } else {
            theme.defaults = _legacyOptions(theme.defaults);
        }
        var css = false, reg, reg2;
        if (typeof theme.css === "string") {
            $("link").each(function(i, link) {
                reg = new RegExp(theme.css);
                if (reg.test(link.href)) {
                    css = true;
                    _themeLoad(theme);
                    return false;
                }
            });
            if (!css) {
                $(function() {
                    var retryCount = 0;
                    var tryLoadCss = function() {
                        $("script").each(function(i, script) {
                            reg = new RegExp("galleria\\." + theme.name.toLowerCase() + "\\.");
                            reg2 = new RegExp("galleria\\.io\\/theme\\/" + theme.name.toLowerCase() + "\\/(\\d*\\.*)?(\\d*\\.*)?(\\d*\\/)?js");
                            if (reg.test(script.src) || reg2.test(script.src)) {
                                css = script.src.replace(/[^\/]*$/, "") + theme.css;
                                window.setTimeout(function() {
                                    Utils.loadCSS(css, "galleria-theme-" + theme.name, function() {
                                        _themeLoad(theme);
                                    });
                                }, 1);
                            }
                        });
                        if (!css) {
                            if (retryCount++ > 5) {
                                Galleria.raise("No theme CSS loaded");
                            } else {
                                window.setTimeout(tryLoadCss, 500);
                            }
                        }
                    };
                    tryLoadCss();
                });
            }
        } else {
            _themeLoad(theme);
        }
        return theme;
    };
    Galleria.loadTheme = function(src, options) {
        if ($("script").filter(function() {
            return $(this).attr("src") == src;
        }).length) {
            return;
        }
        var loaded = false, err;
        $(window).on("load", function() {
            if (!loaded) {
                err = window.setTimeout(function() {
                    if (!loaded) {
                        Galleria.raise("Galleria had problems loading theme at " + src + ". Please check theme path or load manually.", true);
                    }
                }, 2e4);
            }
        });
        Utils.loadScript(src, function() {
            loaded = true;
            window.clearTimeout(err);
        });
        return Galleria;
    };
    Galleria.get = function(index) {
        if (!!_instances[index]) {
            return _instances[index];
        } else if (typeof index !== "number") {
            return _instances;
        } else {
            Galleria.raise("Gallery index " + index + " not found");
        }
    };
    Galleria.configure = function(key, value) {
        var opts = {};
        if (typeof key == "string" && value) {
            opts[key] = value;
            key = opts;
        } else {
            $.extend(opts, key);
        }
        Galleria.configure.options = opts;
        $.each(Galleria.get(), function(i, instance) {
            instance.setOptions(opts);
        });
        return Galleria;
    };
    Galleria.configure.options = {};
    Galleria.on = function(type, callback) {
        if (!type) {
            return;
        }
        callback = callback || F;
        var hash = type + callback.toString().replace(/\s/g, "") + Utils.timestamp();
        $.each(Galleria.get(), function(i, instance) {
            instance._binds.push(hash);
            instance.bind(type, callback);
        });
        Galleria.on.binds.push({
            type: type,
            callback: callback,
            hash: hash
        });
        return Galleria;
    };
    Galleria.on.binds = [];
    Galleria.run = function(selector, options) {
        if ($.isFunction(options)) {
            options = {
                extend: options
            };
        }
        $(selector || "#galleria").galleria(options);
        return Galleria;
    };
    Galleria.addTransition = function(name, fn) {
        _transitions.effects[name] = fn;
        return Galleria;
    };
    Galleria.utils = Utils;
    Galleria.log = function() {
        var args = Utils.array(arguments);
        if ("console" in window && "log" in window.console) {
            try {
                return window.console.log.apply(window.console, args);
            } catch (e) {
                $.each(args, function() {
                    window.console.log(this);
                });
            }
        } else {
            return window.alert(args.join("<br>"));
        }
    };
    Galleria.ready = function(fn) {
        if (typeof fn != "function") {
            return Galleria;
        }
        $.each(_galleries, function(i, gallery) {
            fn.call(gallery, gallery._options);
        });
        Galleria.ready.callbacks.push(fn);
        return Galleria;
    };
    Galleria.ready.callbacks = [];
    Galleria.raise = function(msg, fatal) {
        var type = fatal ? "Fatal error" : "Error", css = {
            color: "#fff",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 1e5
        }, echo = function(msg) {
            var html = '<div style="padding:4px;margin:0 0 2px;background:#' + (fatal ? "811" : "222") + ';">' + (fatal ? "<strong>" + type + ": </strong>" : "") + msg + "</div>";
            $.each(_instances, function() {
                var cont = this.$("errors"), target = this.$("target");
                if (!cont.length) {
                    target.css("position", "relative");
                    cont = this.addElement("errors").appendChild("target", "errors").$("errors").css(css);
                }
                cont.append(html);
            });
            if (!_instances.length) {
                $("<div>").css($.extend(css, {
                    position: "fixed"
                })).append(html).appendTo(DOM().body);
            }
        };
        if (DEBUG) {
            echo(msg);
            if (fatal) {
                throw new Error(type + ": " + msg);
            }
        } else if (fatal) {
            if (_hasError) {
                return;
            }
            _hasError = true;
            fatal = false;
            echo("Gallery could not load.");
        }
    };
    Galleria.version = VERSION;
    Galleria.getLoadedThemes = function() {
        return $.map(_loadedThemes, function(theme) {
            return theme.name;
        });
    };
    Galleria.requires = function(version, msg) {
        msg = msg || "You need to upgrade Galleria to version " + version + " to use one or more components.";
        if (Galleria.version < version) {
            Galleria.raise(msg, true);
        }
        return Galleria;
    };
    Galleria.Picture = function(id) {
        this.id = id || null;
        this.image = null;
        this.container = Utils.create("galleria-image");
        $(this.container).css({
            overflow: "hidden",
            position: "relative"
        });
        this.original = {
            width: 0,
            height: 0
        };
        this.ready = false;
        this.isIframe = false;
    };
    Galleria.Picture.prototype = {
        cache: {},
        show: function() {
            Utils.show(this.image);
        },
        hide: function() {
            Utils.moveOut(this.image);
        },
        clear: function() {
            this.image = null;
        },
        isCached: function(src) {
            return !!this.cache[src];
        },
        preload: function(src) {
            $(new Image()).on("load", function(src, cache) {
                return function() {
                    cache[src] = src;
                };
            }(src, this.cache)).attr("src", src);
        },
        load: function(src, size, callback) {
            if (typeof size == "function") {
                callback = size;
                size = null;
            }
            if (this.isIframe) {
                var id = "if" + new Date().getTime();
                var iframe = this.image = $("<iframe>", {
                    src: src,
                    frameborder: 0,
                    id: id,
                    allowfullscreen: true,
                    css: {
                        visibility: "hidden"
                    }
                })[0];
                if (size) {
                    $(iframe).css(size);
                }
                $(this.container).find("iframe,img").remove();
                this.container.appendChild(this.image);
                $("#" + id).on("load", function(self, callback) {
                    return function() {
                        window.setTimeout(function() {
                            $(self.image).css("visibility", "visible");
                            if (typeof callback == "function") {
                                callback.call(self, self);
                            }
                        }, 10);
                    };
                }(this, callback));
                return this.container;
            }
            this.image = new Image();
            if (Galleria.IE8) {
                $(this.image).css("filter", "inherit");
            }
            if (!Galleria.IE && !Galleria.CHROME && !Galleria.SAFARI) {
                $(this.image).css("image-rendering", "optimizequality");
            }
            var reload = false, resort = false, $container = $(this.container), $image = $(this.image), onerror = function() {
                if (!reload) {
                    reload = true;
                    window.setTimeout(function(image, src) {
                        return function() {
                            image.attr("src", src + (src.indexOf("?") > -1 ? "&" : "?") + Utils.timestamp());
                        };
                    }($(this), src), 50);
                } else {
                    if (DUMMY) {
                        $(this).attr("src", DUMMY);
                    } else {
                        Galleria.raise("Image not found: " + src);
                    }
                }
            }, onload = function(self, callback, src) {
                return function() {
                    var complete = function() {
                        $(this).off("load");
                        self.original = size || {
                            height: this.height,
                            width: this.width
                        };
                        if (Galleria.HAS3D) {
                            this.style.MozTransform = this.style.webkitTransform = "translate3d(0,0,0)";
                        }
                        $container.append(this);
                        self.cache[src] = src;
                        if (typeof callback == "function") {
                            window.setTimeout(function() {
                                callback.call(self, self);
                            }, 1);
                        }
                    };
                    if (!this.width || !this.height) {
                        (function(img) {
                            Utils.wait({
                                until: function() {
                                    return img.width && img.height;
                                },
                                success: function() {
                                    complete.call(img);
                                },
                                error: function() {
                                    if (!resort) {
                                        $(new Image()).on("load", onload).attr("src", img.src);
                                        resort = true;
                                    } else {
                                        Galleria.raise("Could not extract width/height from image: " + img.src + ". Traced measures: width:" + img.width + "px, height: " + img.height + "px.");
                                    }
                                },
                                timeout: 100
                            });
                        })(this);
                    } else {
                        complete.call(this);
                    }
                };
            }(this, callback, src);
            $container.find("iframe,img").remove();
            $image.css("display", "block");
            Utils.hide(this.image);
            $.each("minWidth minHeight maxWidth maxHeight".split(" "), function(i, prop) {
                $image.css(prop, /min/.test(prop) ? "0" : "none");
            });
            $image.on("load", onload).on("error", onerror).attr("src", src);
            return this.container;
        },
        scale: function(options) {
            var self = this;
            options = $.extend({
                width: 0,
                height: 0,
                min: undef,
                max: undef,
                margin: 0,
                complete: F,
                position: "center",
                crop: false,
                canvas: false,
                iframelimit: undef
            }, options);
            if (this.isIframe) {
                var cw = options.width, ch = options.height, nw, nh;
                if (options.iframelimit) {
                    var r = M.min(options.iframelimit / cw, options.iframelimit / ch);
                    if (r < 1) {
                        nw = cw * r;
                        nh = ch * r;
                        $(this.image).css({
                            top: ch / 2 - nh / 2,
                            left: cw / 2 - nw / 2,
                            position: "absolute"
                        });
                    } else {
                        $(this.image).css({
                            top: 0,
                            left: 0
                        });
                    }
                }
                $(this.image).width(nw || cw).height(nh || ch).removeAttr("width").removeAttr("height");
                $(this.container).width(cw).height(ch);
                options.complete.call(self, self);
                try {
                    if (this.image.contentWindow) {
                        $(this.image.contentWindow).trigger("resize");
                    }
                } catch (e) {}
                return this.container;
            }
            if (!this.image) {
                return this.container;
            }
            var width, height, $container = $(self.container), data;
            Utils.wait({
                until: function() {
                    width = options.width || $container.width() || Utils.parseValue($container.css("width"));
                    height = options.height || $container.height() || Utils.parseValue($container.css("height"));
                    return width && height;
                },
                success: function() {
                    var newWidth = (width - options.margin * 2) / self.original.width, newHeight = (height - options.margin * 2) / self.original.height, min = M.min(newWidth, newHeight), max = M.max(newWidth, newHeight), cropMap = {
                        true: max,
                        width: newWidth,
                        height: newHeight,
                        false: min,
                        landscape: self.original.width > self.original.height ? max : min,
                        portrait: self.original.width < self.original.height ? max : min
                    }, ratio = cropMap[options.crop.toString()], canvasKey = "";
                    if (options.max) {
                        ratio = M.min(options.max, ratio);
                    }
                    if (options.min) {
                        ratio = M.max(options.min, ratio);
                    }
                    $.each([ "width", "height" ], function(i, m) {
                        $(self.image)[m](self[m] = self.image[m] = M.round(self.original[m] * ratio));
                    });
                    $(self.container).width(width).height(height);
                    if (options.canvas && _canvas) {
                        _canvas.elem.width = self.width;
                        _canvas.elem.height = self.height;
                        canvasKey = self.image.src + ":" + self.width + "x" + self.height;
                        self.image.src = _canvas.cache[canvasKey] || function(key) {
                            _canvas.context.drawImage(self.image, 0, 0, self.original.width * ratio, self.original.height * ratio);
                            try {
                                data = _canvas.elem.toDataURL();
                                _canvas.length += data.length;
                                _canvas.cache[key] = data;
                                return data;
                            } catch (e) {
                                return self.image.src;
                            }
                        }(canvasKey);
                    }
                    var pos = {}, mix = {}, getPosition = function(value, measure, margin) {
                        var result = 0;
                        if (/\%/.test(value)) {
                            var flt = parseInt(value, 10) / 100, m = self.image[measure] || $(self.image)[measure]();
                            result = M.ceil(m * -1 * flt + margin * flt);
                        } else {
                            result = Utils.parseValue(value);
                        }
                        return result;
                    }, positionMap = {
                        top: {
                            top: 0
                        },
                        left: {
                            left: 0
                        },
                        right: {
                            left: "100%"
                        },
                        bottom: {
                            top: "100%"
                        }
                    };
                    $.each(options.position.toLowerCase().split(" "), function(i, value) {
                        if (value === "center") {
                            value = "50%";
                        }
                        pos[i ? "top" : "left"] = value;
                    });
                    $.each(pos, function(i, value) {
                        if (positionMap.hasOwnProperty(value)) {
                            $.extend(mix, positionMap[value]);
                        }
                    });
                    pos = pos.top ? $.extend(pos, mix) : mix;
                    pos = $.extend({
                        top: "50%",
                        left: "50%"
                    }, pos);
                    $(self.image).css({
                        position: "absolute",
                        top: getPosition(pos.top, "height", height),
                        left: getPosition(pos.left, "width", width)
                    });
                    self.show();
                    self.ready = true;
                    options.complete.call(self, self);
                },
                error: function() {
                    Galleria.raise("Could not scale image: " + self.image.src);
                },
                timeout: 1e3
            });
            return this;
        }
    };
    $.extend($.easing, {
        galleria: function(_, t, b, c, d) {
            if ((t /= d / 2) < 1) {
                return c / 2 * t * t * t + b;
            }
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        },
        galleriaIn: function(_, t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        galleriaOut: function(_, t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        }
    });
    Galleria.Finger = function() {
        var abs = M.abs;
        var has3d = Galleria.HAS3D = function() {
            var el = doc.createElement("p"), has3d, t = [ "webkit", "O", "ms", "Moz", "" ], s, i = 0, a = "transform";
            DOM().html.insertBefore(el, null);
            for (;t[i]; i++) {
                s = t[i] ? t[i] + "Transform" : a;
                if (el.style[s] !== undefined) {
                    el.style[s] = "translate3d(1px,1px,1px)";
                    has3d = $(el).css(t[i] ? "-" + t[i].toLowerCase() + "-" + a : a);
                }
            }
            DOM().html.removeChild(el);
            return has3d !== undefined && has3d.length > 0 && has3d !== "none";
        }();
        var requestFrame = function() {
            var r = "RequestAnimationFrame";
            return window.requestAnimationFrame || window["webkit" + r] || window["moz" + r] || window["o" + r] || window["ms" + r] || function(callback) {
                window.setTimeout(callback, 1e3 / 60);
            };
        }();
        var Finger = function(elem, options) {
            this.config = {
                start: 0,
                duration: 500,
                onchange: function() {},
                oncomplete: function() {},
                easing: function(x, t, b, c, d) {
                    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
                }
            };
            this.easeout = function(x, t, b, c, d) {
                return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
            };
            if (!elem.children.length) {
                return;
            }
            var self = this;
            $.extend(this.config, options);
            this.elem = elem;
            this.child = elem.children[0];
            this.to = this.pos = 0;
            this.touching = false;
            this.start = {};
            this.index = this.config.start;
            this.anim = 0;
            this.easing = this.config.easing;
            if (!has3d) {
                this.child.style.position = "absolute";
                this.elem.style.position = "relative";
            }
            $.each([ "ontouchstart", "ontouchmove", "ontouchend", "setup" ], function(i, fn) {
                self[fn] = function(caller) {
                    return function() {
                        caller.apply(self, arguments);
                    };
                }(self[fn]);
            });
            this.setX = function() {
                var style = self.child.style;
                if (!has3d) {
                    style.left = self.pos + "px";
                    return;
                }
                style.MozTransform = style.webkitTransform = style.transform = "translate3d(" + self.pos + "px,0,0)";
                return;
            };
            $(elem).on("touchstart", this.ontouchstart);
            $(window).on("resize", this.setup);
            $(window).on("orientationchange", this.setup);
            this.setup();
            (function animloop() {
                requestFrame(animloop);
                self.loop.call(self);
            })();
        };
        Finger.prototype = {
            constructor: Finger,
            setup: function() {
                this.width = $(this.elem).width();
                this.length = M.ceil($(this.child).width() / this.width);
                if (this.index !== 0) {
                    this.index = M.max(0, M.min(this.index, this.length - 1));
                    this.pos = this.to = -this.width * this.index;
                }
            },
            setPosition: function(pos) {
                this.pos = pos;
                this.to = pos;
            },
            ontouchstart: function(e) {
                var touch = e.originalEvent.touches;
                this.start = {
                    pageX: touch[0].pageX,
                    pageY: touch[0].pageY,
                    time: +new Date()
                };
                this.isScrolling = null;
                this.touching = true;
                this.deltaX = 0;
                $doc.on("touchmove", this.ontouchmove);
                $doc.on("touchend", this.ontouchend);
            },
            ontouchmove: function(e) {
                var touch = e.originalEvent.touches;
                if (touch && touch.length > 1 || e.scale && e.scale !== 1) {
                    return;
                }
                this.deltaX = touch[0].pageX - this.start.pageX;
                if (this.isScrolling === null) {
                    this.isScrolling = !!(this.isScrolling || M.abs(this.deltaX) < M.abs(touch[0].pageY - this.start.pageY));
                }
                if (!this.isScrolling) {
                    e.preventDefault();
                    this.deltaX /= !this.index && this.deltaX > 0 || this.index == this.length - 1 && this.deltaX < 0 ? M.abs(this.deltaX) / this.width + 1.8 : 1;
                    this.to = this.deltaX - this.index * this.width;
                }
                e.stopPropagation();
            },
            ontouchend: function(e) {
                this.touching = false;
                var isValidSlide = +new Date() - this.start.time < 250 && M.abs(this.deltaX) > 40 || M.abs(this.deltaX) > this.width / 2, isPastBounds = !this.index && this.deltaX > 0 || this.index == this.length - 1 && this.deltaX < 0;
                if (!this.isScrolling) {
                    this.show(this.index + (isValidSlide && !isPastBounds ? this.deltaX < 0 ? 1 : -1 : 0));
                }
                $doc.off("touchmove", this.ontouchmove);
                $doc.off("touchend", this.ontouchend);
            },
            show: function(index) {
                if (index != this.index) {
                    this.config.onchange.call(this, index);
                } else {
                    this.to = -(index * this.width);
                }
            },
            moveTo: function(index) {
                if (index != this.index) {
                    this.pos = this.to = -(index * this.width);
                    this.index = index;
                }
            },
            loop: function() {
                var distance = this.to - this.pos, factor = 1;
                if (this.width && distance) {
                    factor = M.max(.5, M.min(1.5, M.abs(distance / this.width)));
                }
                if (this.touching || M.abs(distance) <= 1) {
                    this.pos = this.to;
                    distance = 0;
                    if (this.anim && !this.touching) {
                        this.config.oncomplete(this.index);
                    }
                    this.anim = 0;
                    this.easing = this.config.easing;
                } else {
                    if (!this.anim) {
                        this.anim = {
                            start: this.pos,
                            time: +new Date(),
                            distance: distance,
                            factor: factor,
                            destination: this.to
                        };
                    }
                    var elapsed = +new Date() - this.anim.time;
                    var duration = this.config.duration * this.anim.factor;
                    if (elapsed > duration || this.anim.destination != this.to) {
                        this.anim = 0;
                        this.easing = this.easeout;
                        return;
                    }
                    this.pos = this.easing(null, elapsed, this.anim.start, this.anim.distance, duration);
                }
                this.setX();
            }
        };
        return Finger;
    }();
    $.fn.galleria = function(options) {
        var selector = this.selector;
        if (!$(this).length) {
            $(function() {
                if ($(selector).length) {
                    $(selector).galleria(options);
                } else {
                    Galleria.utils.wait({
                        until: function() {
                            return $(selector).length;
                        },
                        success: function() {
                            $(selector).galleria(options);
                        },
                        error: function() {
                            Galleria.raise('Init failed: Galleria could not find the element "' + selector + '".');
                        },
                        timeout: 5e3
                    });
                }
            });
            return this;
        }
        return this.each(function() {
            if ($.data(this, "galleria")) {
                $.data(this, "galleria").destroy();
                $(this).find("*").hide();
            }
            $.data(this, "galleria", new Galleria().init(this, options));
        });
    };
    if (typeof module === "object" && module && typeof module.exports === "object") {
        module.exports = Galleria;
    } else {
        window.Galleria = Galleria;
        if (typeof define === "function" && define.amd) {
            define("galleria", [ "jquery" ], function() {
                return Galleria;
            });
        }
    }
})(jQuery, this);
//# sourceMappingURL=galleria.js.map

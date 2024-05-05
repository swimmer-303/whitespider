/*!
 * visibly - v0.7 Page Visibility API Polyfill
 * http://github.com/addyosmani
 * Copyright (c) 2011-2014 Addy Osmani
 * Dual licensed under the MIT and GPL licenses.
 *
 * Methods supported:
 * visibly.onVisible(callback)
 * visibly.onHidden(callback)
 * visibly.hidden()
 * visibly.visibilityState()
 * visibly.visibilitychange(callback(state));
 */

;(function () {

    window.visibly = {
        q: document,
        prefixes: ['webkit', 'ms', 'o', 'moz', 'khtml'],
        props: ['VisibilityState', 'visibilitychange', 'Hidden'],
        m: ['focus', 'blur'],
        visibleCallbacks: {},
        hiddenCallbacks: {},
        cachedPrefix: "",

        onVisible: function (callback) {
            if (typeof callback === 'function') {
                this.visibleCallbacks['visible'] = this.visibleCallbacks['visible'] || [];
                this.visibleCallbacks['visible'].push(callback);
            }
        },
        onHidden: function (callback) {
            if (typeof callback === 'function') {
                this.hiddenCallbacks['hidden'] = this.hiddenCallbacks['hidden'] || [];
                this.hiddenCallbacks['hidden'].push(callback);
            }
        },
        getPrefix: function () {
            if (!this.cachedPrefix) {
                for (var l = 0, b; b = this.prefixes[l++];) {
                    if (b + this.props[2] in this.q) {
                        this.cachedPrefix = b;
                        return this.cachedPrefix;
                    }
                }
            }
        },
        visibilityState: function () {
            return this._getProp(0);
        },
        hidden: function () {
            return this._getProp(2);
        },
        visibilitychange: function (callback, eventType) {
            eventType = eventType || this.visibilityState();

            if (typeof callback === 'function') {
                this.genericCallbacks = this.genericCallbacks || function () {
                    return [];
                };
                this.genericCallbacks().push(callback);
            }

            var n = this.genericCallbacks().length;
            if (n) {
                if (this.cachedPrefix) {
                    while (n--) {
                        this.genericCallbacks()[n].call(this, eventType);
                    }
                } else {
                    while (n--) {
                        this.genericCallbacks()[n].call(this, eventType);
                    }
                }
            }
        },
        isSupported: function (index) {
            return ((this._getPropName(2)) in this.q);
        },
        _getPropName: function (index) {
            return (this.cachedPrefix == "" ? this.props[index].substring(0, 1).toLowerCase() + this.props[index].substring(1) : this.cachedPrefix + this.props[index]);
        },
        _getProp: function (index) {
            return this.q[this._getPropName(index)];
        },
        callCallbacks: function (eventType) {
            var callbacks = this[eventType];
            if (callbacks) {
                var n = callbacks.length;
                while (n--) {
                    callbacks[n]();
                }
            }
        },
        _execute: function (eventType) {
            this.callCallbacks(eventType);
            this._onVisibilityChange(eventType);
        },
        _onVisibilityChange: function (eventType) {
            this.visibilitychange.call(this, function (state) {
                return function (e) {
                    state(e.state);
                };
            }(this._onStateChange), eventType);
        },
        _onStateChange: function (state) {
            return function (newState) {
                if (state !== newState) {
                    this._onVisibilityChange(newState);
                }
            };
        },
        _nativeSwitch: function () {
            this[this._getProp(2) ? '_hidden' : '_visible']();
        },
        _listen: function () {
            try {
                if (!this.isSupported()) {
                    if (this.q.addEventListener) {
                        window.addEventListener(this.m[0], this._visible, 1);
                        window.addEventListener(this.m[1], this._hidden, 1);
                    } else {
                        this.q.attachEvent('onfocusin', this._visible);
                        this.q.attachEvent('onfocusout', this._hidden);
                    }
                } else {
                    this.q.addEventListener(this._getPropName(1), function (e) {
                        window.visibly._nativeSwitch.apply(window.visibly, [e]);
                    }, 1);
                }
            } catch (e) {}
        },
        init: function () {
            this.getPrefix();
            this._listen();
        }
    };

    this.visibly.init();
})();

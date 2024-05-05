/**
 * SoundManager 2: JavaScript Sound for the Web
 * http://schillmania.com/projects/soundmanager2/
 *
 * Copyright (c) 2007, Scott Schiller. All rights reserved.
 * Code provided under the BSD License:
 * http://schillmania.com/projects/soundmanager2/license.txt
 *
 * V2.97a.20130101
 */
(function (i, g) {
  // SoundManager object constructor
  function R(R, fa) {
    // Private helper functions
    function S(b) {
      return c.preferFlash && A && c.flash[b] !== g && c.flash[b];
    }
    function m(b) {
      return function (c) {
        var d = this._s;
        return !d || !d._a ? null : b.call(this, c);
      };
    }

    // Object instance properties
    this.setupOptions = {
      url: R || null,
      flashVersion: 8,
      debugMode: true,
      debugFlash: false,
      useConsole: true,
      consoleOnly: true,
      waitForWindowLoad: false,
      bgColor: "#ffffff",
      useHighPerformance: false,
      flashPollingInterval: null,
      html5PollingInterval: null,
      flashLoadTimeout: 1000,
      wmode: null,
      allowScriptAccess: "always",
      useFlashBlock: false,
      useHTML5Audio: true,
      html5Test: /^(probably|maybe)$/i,
      preferFlash: true,
      noSWFCache: false
    };
    this.defaultOptions = {
      autoLoad: false,
      autoPlay: false,
      from: null,
      loops: 1,
      onid3: null,
      onload: null,
      whileloading: null,
      onplay: null,
      onpause: null,
      onresume: null,
      whileplaying: null,
      onposition: null,
      onstop: null,
      onfailure: null,
      onfinish: null,
      multiShot: true,
      multiShotEvents: true,
      position: null,
      pan: 0,
      stream: true,
      to: null,
      type: null,
      usePolicyFile: false,
      volume: 100
    };
    this.flash9Options = {
      isMovieStar: null,
      usePeakData: false,
      useWaveformData: false,
      useEQData: false,
      onbufferchange: null,
      ondataerror: null
    };
    this.movieStarOptions = {
      bufferTime: 3,
      serverURL: null,
      onconnect: null,
      duration: null
    };
    this.audioFormats = {
      mp3: {
        type: ['audio/mpeg; codecs="mp3"', 'audio/mpeg', 'audio/mp3', 'audio/MPA', 'audio/mpa-robust'],
        required: true
      },
      mp4: {
        related: ['aac', 'm4a', 'm4b'],
        type: ['audio/mp4; codecs="mp4a.40.2"', 'audio/aac', 'audio/x-m4a', 'audio/MP4A-LATM', 'audio/mpeg4-generic'],
        required: false
      },
      ogg: {
        type: ['audio/ogg; codecs=vorbis'],
        required: false
      },
      wav: {
        type: ['audio/wav; codecs="1"', 'audio/wav', 'audio/wave', 'audio/x-wav'],
        required: false
      }
    };
    this.movieID = "sm2-container";
    this.id = fa || "sm2movie";
    this.debugID = "soundmanager-debug";
    this.debugURLParam = /([#?&])debug=1/i;
    this.versionNumber = "V2.97a.20130101";
    this.altURL = this.movieURL = this.version = null;
    this.enabled = this.swfLoaded = false;
    this.oMC = null;
    this.sounds = {};
    this.soundIDs = [];
    this.didFlashBlock = this.muted = false;
    this.filePattern = null;
    this.filePatterns = {
      flash8: /\.mp3(\?.*)?$/i,
      flash9: /\.mp3(\?.*)?$/i
    };
    this.features = {
      buffering: false,
      peakData: false,
      waveformData: false,
      eqData: false,
      movieStar: false
    };
    this.sandbox = {};
    this.html5 = {
      usingFlash: null
    };
    this.flash = {};
    this.ignoreFlash = this.html5Only = false;
    var Ga, c = this,
      Ha = null,
      h = null,
      T, q = navigator.userAgent,
      ga = i.location.href.toString(),
      ha, Ia, ia, k, r = [],
      J = false,
      K = false,
      j = false,
      s = false,
      ja = false,
      L, t, ka, U, la, B, C, D, Ja, ma, V, na, W, oa, E, pa, M, qa, X, F, Ka, ra, La, sa, Ma, N = null,
      ta = null, v, ua, G, Y, Z, H, p, O = false,
      va = false, Na, Oa, Pa, $ = 0,
      P = null, aa, Qa = [], u = null, Ra, ba, Q, y, wa, xa, Sa, n, db = Array.prototype.slice, w = false,
      ya, A, za, Ta, x, ca = q.match(/(ipad|iphone|ipod)/i), Ua = q.match(/android/i), z = q.match(/msie/i),
      eb = q.match(/webkit/i), Aa = q.match(/safari/i) && !q.match(/chrome/i), Ba = q.match(/opera/i), Ca = q.match(/(mobile|pre\/|xoom)/i) || ca || Ua, Va = !ga.match(/usehtml5audio/i) && !ga.match(/sm2\-ignorebadua/i) && Aa && !q.match(/silk/i) && q.match(/OS X 10_6_([3-7])/i), Da = l.hasFocus !== g ? l.hasFocus() : null, da = Aa && (l.hasFocus === g || !l.hasFocus()), Wa = !da, Xa = new RegExp(/(mp3|mp4|mpa|m4a|m4b)/i), Ea = l.location ? l.location.protocol.match(/http/i) : null, Ya = !Ea ? "http://" : "", Za = /^\s*audio\/(?:x-)?(?:mpeg4|aac|flv|mov|mp4||m4v|m4a|m4b|mp4v|3gp|3g2)\s*(?:$|;)/i, $a = "mpeg4 aac flv mov mp4 m4v f4v m4a m4b mp4v 3gp 3g2".split(" "), fb = new RegExp("\\.(" + $a.join("|") + ")(\\?.*)?$", "i");

    // Check for HTML5 audio support
    this.hasHTML5 = !!Audio && (Ba && opera !== g && 10 > opera.version() ? new Audio(null) : new Audio).canPlayType !== g;

    // SoundManager methods
    this.setup = function (b) {
      var e = !c.url;
      b !== g && (j && u && c.ok() && (b.flashVersion !== g || b.url !== g || b.html5Test !== g)) && H(v("setupLate"));
      ka(b);
      e && (M && b.url !== g) && c.beginDelayedInit();
      return c;
    };

    this.supported = this.ok = function () {
      return u ? j && !s : c.useHTML5Audio && c.hasHTML5;
    };

    // ... rest of the code

  }

  // ... rest of the code

})(window);

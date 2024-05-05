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
      noSWFCache: false,
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
      volume: 100,
    };
    this.flash9Options = {
      isMovieStar: null,
      usePeakData: false,
      useWaveformData: false,
      useEQData: false,
      onbufferchange: null,
      ondataerror: null,
    };
    this.movieStarOptions = {
      bufferTime: 3,
      serverURL: null,
      onconnect: null,
      duration: null,
    };
    this.audioFormats = {
      mp3: {
        type: [
          'audio/mpeg; codecs="mp3"',
          "audio/mpeg",
          "audio/mp3",
          "audio/MPA",
          "audio/mpa-robust",
        ],
        required: false,
      },
      mp4: {
        related: ["aac", "m4a", "m4b"],
        type: [
          'audio/mp4; codecs="mp4a.40.2"',
          "audio/aac",
          "audio/x-m4a",
          "audio/MP4A-LATM",
          "audio/mpeg4-generic",
        ],
        required: false,
      },
      ogg: {
        type: ["audio/ogg; codecs=vorbis"],
        required: false,
      },
      wav: {
        type: ['audio/wav; codecs="1"', "audio/wav", "audio/wave", "audio/x-wav"],
        required: true,
      },
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
      flash9: /\.mp3(\?.*)?$/i,
    };
    this.features = {
      buffering: false,
      peakData: false,
      waveformData: false,
      eqData: false,
      movieStar: false,
    };
    this.sandbox = {};
    this.html5 = {
      usingFlash: null,
    };
    this.flash = {};
    this.ignoreFlash = this.html5Only = false;
    var Ga,
      c = this,
      Ha = null,
      h = null,
      T,
      q = navigator.userAgent,
      ga = i.location.href.toString(),
      ha,
      Ia,
      ia,
      k,
      r = [],
      J = false,
      K = false,
      j = false,
      s = false,
      ja = false,
      L,
      t,
      ka,
      U,
      la,
      B,
      C,
      D,
      Ja,
      ma,
      V,
      na,
      W,
      oa,
      E,
      pa,
      M,
      qa,
      X,
      F,
      Ka,
      ra,
      La,
      sa,
      Ma,
      N = null,
      ta = null,
      v,
      ua,
      G,
      Y,
      Z,
      H,
      p,
      O = false,
      va = false,
      Na,
      Oa,
      Pa,
      $ = 0,
      P = null,
      aa,
      Qa = [],
      u = null,
      Ra,
      ba,
      Q,
      y,
      wa,
      xa,
      Sa,
      n,
      db = Array.prototype.slice,
      w = false,
      ya,
      A,
      za,
      Ta,
      x,
      ca = q.match(/(ipad|iphone|ipod)/i),
      Ua = q.match(/android/i),
      z = q.match(/msie/i),
      eb = q.match(/webkit/i),
      Aa = q.match(/safari/i) && !q.match(/chrome/i),
      Ba = q.match(/opera/i),
      Ca =
        q.match(/(mobile|pre\/|xoom)/i) || ca || Ua,
      Va = !ga.match(/usehtml5audio/i) && !ga.match(/sm2\-ignorebadua/i) && Aa && !q.match(/silk/i) && q.match(/OS X 10_6_([3-7])/i),
      Da = l.hasFocus !== g ? l.hasFocus() : null,
      da = Aa && (l.hasFocus === g || !l.hasFocus()),
      Wa = !da,
      Xa = /(mp3|mp4|mpa|m4a|m4b)/i,
      Ea = l.location ? l.location.protocol.match(/http/i) : null,
      Ya = !Ea ? "http://" : "",
      Za = /^\s*audio\/(?:x-)?(?:mpeg4|aac|flv|mov|mp4||m4v|m4a|m4b|mp4v|3gp|3g2)\s*(?:$|;)/i,
      $a = "mpeg4 aac flv mov mp4 m4v f4v m4a m4b mp4v 3gp 3g2".split(" "),
      fb = RegExp("\\.(" + $a.join("|") + ")(\\?.*)?$", "i");

    // Utility functions
    this.mimePattern = /^\s*audio\/(?:x-)?(?:mp(?:eg|3))\s*(?:$|;)/i;
    this.useAltURL = !Ea;
    var Fa;
    try {
      Fa = Audio !== g && (Ba && opera !== g && 10 > opera.version() ? new Audio(null) : new Audio).canPlayType !== g;
    } catch (hb) {
      Fa = false;
    }
    this.hasHTML5 = Fa;
    this.setup = function (b) {
      var e = !c.url;
      b !== g && ka(b);
      e && (M && b.url !== g) && c.beginDelayedInit();
      return c;
    };
    this.supported = this.ok = function () {
      return u ? j && !s : c.useHTML5Audio && c.hasHTML5;
    };
    this.getMovie = function (b) {
      return T(b) || l[b] || i[b];
    };
    this.createSound = function (b, e) {
      // ... rest of the code
    };
    this.destroySound = function (b, e) {
      // ... rest of the code
    };
    this.load = function (b, e) {
      // ... rest of the code
    };
    this.unload = function (b) {
      // ... rest of the code
    };
    this.onposition = this.onPosition = function (b, e, d, a) {
      // ... rest of the code
    };
    this.clearOnPosition = function (b, e, d) {
      // ... rest of the code
    };
    this.start = this.play = function (b, e) {
      // ... rest of the code
    };
    this.setPosition = function (b, e) {
      // ... rest of the code
    };
    this.stop = function (b) {
      // ... rest of the code
    };
    this.stopAll = function () {
      // ... rest of the code
    };
    this.pause = function (b) {
      // ... rest of the code
    };
    this.pauseAll = function () {
      // ... rest of the code
    };
    this.resume = function (b) {
      // ... rest of the code
    };
    this.resumeAll = function () {
      // ... rest of the code
    };
    this.togglePause = function (b) {
      // ... rest of the code
    };
    this.setPan = function (b, e) {
      // ... rest of the code
    };
    this.setVolume = function (b, e) {
      // ... rest of the code
    };
    this.mute = function (b) {
      // ... rest of the code
    };
    this.muteAll = function () {
      // ... rest of the code
    };
    this.unmute = function (b) {
      // ... rest of the code
    };
    this.unmuteAll = function () {
      // ... rest of the code
    };
    this.toggleMute = function (b) {
      // ... rest of the code
    };
    this.getMemoryUse = function () {
      // ... rest of the code
    };
    this.disable = function (b) {
      // ... rest of the code
    };
    this.canPlayMIME = function (b) {
      // ... rest of the code
    };
    this.canPlayURL = function (b) {
      // ... rest of the code
    };
    this.canPlayLink = function (b) {
      // ... rest of the code
    };
    this.getSoundById = function (b) {
      // ... rest of the code
    };
    this.onready = function (b, c) {
      // ... rest of the code
    };
    this.ontimeout = function (b, c) {
      // ... rest of the code
    };
    this._wD = this._writeDebug = function () {
      // ... rest of the code
    };
    this._debug = function () {
      // ... rest of the code
    };
    this.reboot = function (b, e) {
      // ... rest of the code
    };
    this.reset = function () {
      // ... rest of the code
    };
    this.getMoviePercent = function () {
      // ... rest of the code
    };
    this.beginDelayedInit = function () {
      // ... rest of the code
    };
    this.destruct = function () {
      // ... rest of the code
    };
    Ga = function (b) {
      // ... rest of the code
    };
  }

  // Initialize the SoundManager object
  var fa = null;
  if (typeof i.SM2_DEFER === "undefined" || !SM2_DEFER) fa = new R();
  i.SoundManager = R;
  i.soundManager = fa;
})(window);

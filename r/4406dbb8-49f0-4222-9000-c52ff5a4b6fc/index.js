(function() {
  // Function to check if the DOM is ready
  const domReady = function(win, fn) {
    const done = false,
      top = true,
      doc = win.document,
      root = doc.documentElement,
      modern = doc.addEventListener,
      add = modern ? 'addEventListener' : 'attachEvent',
      rem = modern ? 'removeEventListener' : 'detachEvent',
      pre = modern ? '' : 'on';

    const init = function(e) {
      if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
      (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
      if (!done && (done = true)) fn.call(win, e.type || e);
    };

    const poll = function() {
      try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
      init('poll');
    };

    if (doc.readyState == 'complete') fn.call(win, 'lazy');
    else {
      if (!modern && root.doScroll) {
        try { top = !win.frameElement; } catch(e) { }
        if (top) poll();
      }
      doc[add](pre + 'DOMContentLoaded', init, false);
      doc[add](pre + 'readystatechange', init, false);
      win[add](pre + 'load', init, false);
    }
  };

  // Function to load CSS and JS files
  const loadFiles = function() {
    const raf = window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      function(cb) { setTimeout(cb, 16); };

    const css = [
      {
        href: 'bundle.css',
        media: 'all'
      }
    ];

    const hideSplash = function() {
      const splash = document.getElementById('splash');
      if (splash) splash.parentNode.removeChild(splash);
    };

    const bootstrapped = false;

    const bootstrap = function() {
      if (bootstrapped) return;
      bootstrapped = true;

      console.log('bootstrap');

      const head = document.getElementsByTagName('head')[0];
      const isAndroid = /Android/g.test(navigator.userAgent) ? true : false;

      const loadJs = function() {
        const el = document.createElement("script");
        el.onload = hideSplash;
        el.src = 'bundle.js';
        head.appendChild(el);
      };

      const setScaleLoaded = function(data) {
        if (data.loaded) return;

        data.loaded = true;
        console.log('css loaded ' + data.href);

        const loaded = Object.keys(css).filter(key => !css[key].loaded).length === 0;

        if (!loaded) return;

        loadJs();
      };

      css.forEach(data => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.media = data.media;
        link.href = data.href;

        if (isAndroid || !('onload' in link)) {
          raf(() => {
            setScaleLoaded(data)
          });
        }

        link.onload = function() {
          setScaleLoaded(data);
        };

        head.appendChild(link);
      });

      if (css.length === 0) loadJs();
    };

    if (typeof window !== 'undefined' && !!window.cordova) {
      // wait for cordova
      document.addEventListener('deviceready', () => {
        console.warn('index cordova deviceready');
        raf(bootstrap);
      }, false);
    } else {
      domReady(window, () => {
        raf(bootstrap);
        setTimeout(bootstrap, 500);
      });
    }
  };

  loadFiles();
})();

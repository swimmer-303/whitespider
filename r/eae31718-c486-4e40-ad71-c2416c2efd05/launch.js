(function() {
  'use strict';

  const $ = id => document.getElementById(id);

  const init = (controlType, quality, hud, godmode) => {
    const hexGL = new bkcore.hexgl.HexGL({
      document,
      width: window.innerWidth,
      height: window.innerHeight,
      container: $('main'),
      overlay: $('overlay'),
      gameover: $('step-5'),
      quality,
      difficulty: 0,
      hud,
      controlType,
      godmode,
      track: 'Cityscape'
    });

    const progressbar = $('progressbar');

    return hexGL.load({
      onLoad: () => {
        console.log('LOADED.');
        hexGL.init();
        $('step-3').style.display = 'none';
        $('step-4').style.display = 'block';
        return hexGL.start();
      },
      onError: s => {
        return console.error(`Error loading ${s}.`);
      },
      onProgress: (p, t, n) => {
        console.log(`LOADED ${t} : ${n} ( ${p.loaded} / ${p.total} ).`);
        return progressbar.style.width = `${(p.loaded / p.total * 100)}%`;
      }
    });
  };

  const getURLParameter = name => {
    const search = window.location.search;
    const regex = new RegExp(`[?&]${name}=([^&#]*)`);
    const results = regex.exec(search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  const defaultControls = bkcore.Utils.isTouchDevice() ? 1 : 0;

  const settings = [
    ['controlType', ['KEYBOARD', 'TOUCH', 'LEAP MOTION CONTROLLER', 'GAMEPAD'], defaultControls, defaultControls, 'Controls: '],
    ['quality', ['LOW', 'MID', 'HIGH', 'VERY HIGH'], 3, 3, 'Quality: '],
    ['hud', ['OFF', 'ON'], 1, 1, 'HUD: '],
    ['godmode', ['OFF', 'ON'], 0, 1, 'Godmode: ']
  ];

  const setSetting = setting => {
    const [id, values, defaultValue, currentValue, label] = setting;
    const elem = $(`s-${id}`);
    const updateLabel = () => {
      elem.innerHTML = `${label} ${values[currentValue]}`;
    };
    updateLabel();
    elem.onclick = () => {
      currentValue = (currentValue + 1) % values.length;
      return updateLabel();
    };
    return currentValue = getURLParameter(id) || defaultValue;
  };

  for (const setting of settings) {
    setSetting(setting);
  }

  $('step-2').onclick = () => {
    $('step-2').style.display = 'none';
    $('step-3').style.display = 'block';
    return init(
      ...settings.map(([id]) => getURLParameter(id) || settings[0][2])
    );
  };

  $('step-5').onclick = () => {
    return window.location.reload();
  };

  $('s-credits').onclick = () => {
    $('step-1').style.display = 'none';
    return $('credits').style.display = 'block';
  };

  $('credits').onclick = () => {
    $('step-1').style.display = 'block';
    return $('credits').style.display = 'none';
  };

  const hasWebGL = () => {
    const canvas = document.createElement('canvas');
    let gl;
    try {
      gl = canvas.getContext('webgl');
    } catch (e) {}
    if (!gl) {
      try {
        gl = canvas.getContext('experimental-webgl');
      } catch (e) {}
    }
    return Boolean(gl);
  };

  if (!hasWebGL()) {
    const getWebGL = $('start');
    getWebGL.innerHTML = 'WebGL is not supported!';
    getWebGL.onclick = () => {
      return window.location.href = 'http://get.webgl.org/';
    };
  } else {
    $('start').onclick = () => {
      $('step-1').style.display = 'none';
      $('step-2').style.display = 'block';
      return $('step-2').style.backgroundImage = `url(css/help-${settings[0][3]}.png)`;
    };
  }

}).call(this);

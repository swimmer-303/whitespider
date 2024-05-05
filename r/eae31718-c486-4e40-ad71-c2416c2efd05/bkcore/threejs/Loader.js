'use strict';

class bkcore.threejs.Loader {
  /**
   * Loads multiple resources, gets progress, and is callback-friendly.
   * Supports textures, texturesCube, geometries, analysers, images.
   *
   * @author Thibaut 'BKcore' Despoulain <http://bkcore.com>
   */

  constructor(opts = {}) {
    this.jsonLoader = new THREE.JSONLoader();

    this.onError = opts.onError || function(s) {
      console.warn(`Error while loading ${s}.`);
    };
    this.onLoad = opts.onLoad || function() {
      console.log('Loaded.');
    };
    this.onProgress = opts.onProgress || function(progress, type, name) {
      /**/
    };

    this.types = {
      textures: null,
      texturesCube: null,
      geometries: null,
      analysers: null,
      images: null,
      sounds: null
    };

    this.states = {};
    this.data = {};

    for (const t in this.types) {
      this.data[t] = {};
      this.states[t] = {};
    }

    this.progress = {
      total: 0,
      remaining: 0,
      loaded: 0,
      finished: false
    };
  }

  load(data) {
    if (!THREE) {
      console.error('THREE.js library not found.');
      return;
    }

    for (const k in this.types) {
      if (k in data) {
        const size = Object.keys(data[k]).length;
        this.progress.total += size;
        this.progress.remaining += size;
      }
    }

    for (const t in data.textures) {
      this.loadTexture(t, data.textures[t]);
    }

    for (const c in data.texturesCube) {
      this.loadTextureCube(c, data.texturesCube[c]);
    }

    for (const g in data.geometries) {
      this.loadGeometry(g, data.geometries[g]);
    }

    for (const a in data.analysers) {
      this.loadAnalyser(a, data.analysers[a]);
    }

    for (const i in data.images) {
      this.loadImage(i, data.images[i]);
    }

    for (const s in data.sounds) {
      this.loadSound(data.sounds[s].src, s, data.sounds[s].loop, data.sounds[s].usePanner);
    }

    this.progressCallback.call(this, this.progress);
  }

  updateState(type, name, state) {
    if (!(type in this.types)) {
      console.warn("Unkown loader type.");
      return;
    }

    if (!(name in this.data[type])) {
      console.warn("Unkown file.");
      return;
    }

    if (state === true) {
      this.progress.remaining--;
      this.progress.loaded++;
      this.progressCallback.call(this, this.progress, type, name);
    }

    this.states[type][name] = state;

    if (this.progress.loaded === this.progress.total) {
      this.loadCallback.call(this);
    }
  }

  get(type, name) {
    if (!(type in this.types)) {
      console.warn("Unkown loader type.");
      return null;
    }
    if (!(name in this.data[type])) {
      console.warn("Unkown file.");
      return null;
    }

    return this.data[type][name];
  }

  loaded(type, name) {
    if (!(type in this.types)) {
      console.warn("Unkown loader type.");
      return null;
    }
    if (!(name in this.states[type])) {
      console.warn("Unkown file.");
      return null;
    }

    return this.states[type][name];
  }

  loadTexture(name, url) {
    this.updateState("textures", name, false);
    this.data.textures[name] = THREE.ImageUtils.loadTexture(
      url,
      undefined,
      () => {
        this.updateState("textures", name, true);
      },
      () => {
        this.onError(name);
      }
    );
  }

  loadTextureCube(name, url) {
    const urls = [
      url.replace('%1', 'px'), url.replace('%1', 'nx'),
      url.replace('%1', 'py'), url.replace('%1', 'ny'),
      url.replace('%1', 'pz'), url.replace('%1', 'nz')
    ];

    this.updateState("texturesCube", name, false);
    this.data.texturesCube[name] = THREE.ImageUtils.loadTextureCube(
      urls,
      new THREE.CubeRefractionMapping(),
      () => {
        this.updateState("texturesCube", name, true);
      }
    );
  }

  loadGeometry(name, url) {
    this.updateState("geometries", name, false);
    this.jsonLoader.load(
      url,
      (a) => {
        this.data.geometries[name] = a;
        this.updateState("geometries", name, true);
      }
    );
  }

  loadAnalyser(name, url) {
    this.updateState("analysers", name, false);
    this.data.analysers[name] = new bkcore.ImageData(
      url,
      () => {
        this.updateState("analysers", name, true);
      }
    );
  }

  loadImage(name, url) {
    this.updateState("images", name, false);
    const e = new Image();
    e.onload = () => {
      this.updateState("images", name, true);
    };
    e.crossOrigin = "anonymous";
    e.src = url;
    this.data.images[name] = e;
  }

  loadSound(src, name, loop, usePanner) {
    this.updateState("sounds", name, false);

    bkcore.Audio.addSound(
      src,
      name,
      loop,
      () => {
        this.updateState("sounds", name, true);
      }
    );

    this.data.sounds[name] = {
      play: () => {
        bkcore.Audio.play(name);
      },
      stop: () => {
        bkcore.Audio.stop(name);
      },
      volume: (vol) => {
        bkcore.Audio.volume(name, vol);
      }
    };
  }
}

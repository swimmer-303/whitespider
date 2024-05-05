class Storage {
  constructor() {
    this._data = {};
  }

  setItem(id, val) {
    this._data[id] = String(val);
  }

  getItem(id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  }

  removeItem(id) {
    delete this._data[id];
  }

  clear() {
    this._data = {};
  }
}

class LocalScoreManager {
  constructor() {
    this.key = "bestScore_9007199254740992";
    this.storage = this.checkLocalStorageSupport() ? window.localStorage : new Storage();
  }

  checkLocalStorageSupport() {
    return typeof window.localStorage !== "undefined" && window.localStorage !== null;
  }

  get() {
    return this.storage.getItem(this.key) || 0;
  }

  set(score) {
    this.storage.setItem(this.key, score);
  }
}

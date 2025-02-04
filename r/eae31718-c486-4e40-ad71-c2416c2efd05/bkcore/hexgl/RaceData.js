/**
 * HexGL
 * @author Thibaut 'BKcore' Despoulain <http://bkcore.com>
 * @license This work is licensed under the Creative Commons Attribution-NonCommercial 3.0 Unported License. 
 *          To view a copy of this license, visit <http://creativecommons.org/licenses/by-nc/3.0/>.
 */

class RaceData {
  constructor(track, mode, shipControls) {
    this.track = track;
    this.mode = mode;
    this.shipControls = shipControls;

    this.rate = 2; // 1 / rate
    this.rateState = 1;

    this.data = [];
    this.last = -1;
    this.seek = 0;

    this._p = new THREE.Vector3();
    this._pp = new THREE.Vector3();
    this._np = new THREE.Vector3();
    this._q = new THREE.Quaternion();
    this._pq = new THREE.Quaternion();
    this._nq = new THREE.Quaternion();
  }

  setRate(rate, rateState) {
    this.rate = rate;
    this.rateState = rateState;
  }

  setTrackAndMode(track, mode) {
    this.track = track;
    this.mode = mode;
  }

  tick(time) {
    if (this.rateState == 1) {
      const p = this.shipControls.getPosition();
      const q = this.shipControls.getQuaternion();
      this.data.push([
        time,
        p.x, p.y, p.z,
        q.x, q.y, q.z, q.w
      ]);
      ++this.last;
    } else if (this.rateState == this.rate) {
      this.rateState = 0;
    }

    this.rate++;
  }

  applyInterpolated(time) {
    while (this.seek < this.last && this.data[this.seek + 1][0] < time)
      ++this.seek;

    const prev = this.data[this.seek];
    this._pp.set(prev[1], prev[2], prev[3]);
    this._pq.set(prev[4], prev[5], prev[6], prev[7]);

    if (this.seek < 0) {
      console.warn('Bad race data.');
      return;
    }

    // no interpolation
    if (this.seek == this.last || this.seek == 0)
      this.shipControls.teleport(this._pp, this._pq);

    // interpolation
    const next = this.data[this.seek + 1];
    this._np.set(next[1], next[2], next[3]);
    this._nq.set(next[4], next[5], next[6], next[7]);

    const t = (time - prev[0]) / (next[0] - prev[0]);
    this._p.copy(this._pp).lerpSelf(this._np, t);
    this._q.copy(this._pq).slerpSelf(this._nq, t);

    this.shipControls.teleport(this._p, this._q);
  }

  reset() {
    this.seek = 0;
  }

  export() {
    return this.data;
  }

  import(imp) {
    if (!Array.isArray(imp)) {
      throw new Error('Imp parameter must be an array');
    }

    this.data = imp;
    this.last = this.data.length - 1;
    console.log(this.data);
  }
}

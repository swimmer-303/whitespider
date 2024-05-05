/*!
 * @package bkcore
 *
 * A simple timer class for measuring elapsed time.
 *
 * @author Thibaut 'BKcore' Despoulain <http://bkcore.com>
 */

/**
 * RAF shim
 */
const requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

const bkcore = bkcore || {};

class Timer {
  /**
   * Creates a new timer, inactive by default.
   * Call Timer.start() to activate.
   */
  constructor() {
    this.time = {
      start: 0,
      current: 0,
      previous: 0,
      elapsed: 0,
      delta: 0,
    };

    this.active = false;
  }

  /**
   * Starts/restarts the timer.
   */
  start() {
    const now = new Date().getTime();

    this.time.start = now;
    this.time.current = now;
    this.time.previous = now;
    this.time.elapsed = 0;
    this.time.delta = 0;

    this.active = true;
  }

  /**
   * Restarts timer, returning last ms tick
   *
   * @returns {number} The elapsed time in milliseconds.
   */
  restart() {
    const now = new Date().getTime();
    const elapsed = now - this.time.start;

    this.start();

    return elapsed;
  }

  /**
   * Pauses(true)/Unpauses(false) the timer.
   *
   * @param {boolean} pause - Whether to pause the timer.
   */
  pause(pause) {
    this.active = !pause;
  }

  /**
   * Update method to be called inside a RAF loop
   *
   * @returns {number} The elapsed time in milliseconds.
   */
  update() {
    if (!this.active) return;

    const now = new Date().getTime();

    this.time.current = now;
    this.time.elapsed = this.time.current - this.time.start;
    this.time.delta = now - this.time.previous;
    this.time.previous = now;

    return this.time.elapsed;
  }

  /**
   * Returns elapsed milliseconds
   *
   * @returns {number} The elapsed time in milliseconds.
   */
  getElapsed() {
    return this.time.elapsed;
  }

  /**
   * Returns a formatted version of the current elapsed time using msToTime().
   *
   * @param {string} [format='h:m:s:ms'] - The format string for the output.
   *                                       Supported placeholders: h, m, s, ms.
   *
   * @returns {string} The formatted elapsed time.
   */
  getElapsedTime(format = 'h:m:s:ms') {
    const time = this.msToTime(this.time.elapsed);

    return format
      .replace('h', time.h.toString().padStart(2, '0'))
      .replace('m', time.m.toString().padStart(2, '0'))
      .replace('s', time.s.toString().padStart(2, '0'))
      .replace('ms', time.ms.toString().padStart(3, '0'));
  }

  /**
   * Formats a millisecond integer into a h/m/s/ms object
   *
   * @param {number} x - The time in milliseconds.
   *
   * @returns {Object} An object with h, m, s, and ms properties.
   */
  msToTime(t) {
    const ms = t % 1000;
    const s = Math.floor((t / 1000) % 60);
    const m = Math.floor((t / 60000) % 60);
    const h = Math.floor(t / 3600000);

    return { h, m, s, ms };
  }

  /**
   * Formats a millisecond integer into a h/m/s/ms object with prefix zeros
   *
   * @param {number} x - The time in milliseconds.
   *
   * @returns {Object<string>} An object with h, m, s, and ms properties.
   */
  msToTimeString(t) {
    const ms = (t % 1000)

// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * @fileoverview This file defines a singleton which provides access to all data
 * that is available as soon as the page's resources are loaded (before DOM
 * content has finished loading). This data includes both localized strings and
 * any data that is important to have ready from a very early stage (e.g. things
 * that must be displayed right away).
 *
 * Note that loadTimeData is not guaranteed to be consistent between page
 * refreshes (https://crbug.com/740629) and should not contain values that might
 * change if the page is re-opened later.
 */

/** @type {LoadTimeData} */
let loadTimeData;

export class LoadTimeData {
  constructor() {
    /** @type {Object<string, *>} */
    this.data_ = {};
  }

  /**
   * Sets the backing object.
   *
   * Note that there is no getter for |data_| to discourage abuse of the form:
   *
   *     var value = loadTimeData.data()['key'];
   *
   * @param {Object<string, *>} value The de-serialized page data.
   */
  set data(value) {
    expect(!this.data_, 'Re-setting data.');
    this.data_ = value;
  }

  /**
   * @param {string} id An ID of a value that might exist.
   * @return {boolean} True if |id| is a key in the dictionary.
   */
  valueExists(id: string): boolean {
    return id in this.data_;
  }

  /**
   * Fetches a value, expecting that it exists.
   * @param {string} id The key that identifies the desired value.
   * @return {*} The corresponding value.
   */
  getValue(id: string): any {
    expect(this.data_, 'No data. Did you remember to include strings.js?');
    const value = this.data_[id];
    expect(typeof value !== 'undefined', 'Could not find value for ' + id);
    return value;
  }

  /**
   * As above, but also makes sure that the value is a string.
   * @param {string} id The key that identifies the desired string.
   * @return {string} The corresponding string value.
   */
  getString(id: string): string {
    const value = this.getValue(id);
    expectIsType(id, value, 'string');
    return value;
  }

  /**
   * Returns a formatted localized string where $1 to $9 are replaced by the
   * second to the tenth argument.
   * @param {string} id The ID of the string we want.
   * @param {...(string|number)} var_args The extra values to include in the
   *     formatted output.
   * @return {string} The formatted string.
   */
  getStringF(id: string, ...var_args: (string|number)[]): string {
    const value = this.getString(id);
    if (!value) {
      return '';
    }

    const args = [...arguments];
    args[0] = value;
    return this.substituteString.apply(this, args);
  }

  /**
   * Returns a formatted localized string where $1 to $9 are replaced by the
   * second to the tenth argument. Any standalone $ signs must be escaped as
   * $$.
   * @param {string} label The label to substitute through.
   *     This is not an resource ID.
   * @param {...(string|number)} var_args The extra values to include in the
   *     formatted output.
   * @return {string} The formatted string.
   */
  substituteString(label: string, ...var_args: (string|number)[]): string {
    const varArgs = arguments;
    return label.replace(/\$(.|$|\n)/g, (m) => {
      expect(m.match(/\$[$1-9]/), 'Unescaped $ found in localized string.');
      return m === '$$' ? '$' : varArgs[m[1]];
    });
  }

  /**
   * Returns a formatted string where $1 to $9 are replaced by the second to
   * tenth argument, split apart into a list of pieces describing how the
   * substitution was performed. Any standalone $ signs must be escaped as $$.
   * @param {string} label A localized string to substitute through.
   *     This is not an resource ID.
   * @param {...(string|number)} var_args The extra values to include in the
   *     formatted output.
   * @return {!Array<!{value: string, arg: (null|string)}>} The formatted
   *     string pieces.
   */
  getSubstitutedStringPieces(label: string, ...var_args: (string|number)[]): {value: string, arg: string|null}[] {
    const varArgs = arguments;
    // Split the string by separately matching all occurrences of $1-9 and of
    // non $1-9 pieces.
    const pieces = (label.match(/(\$[1-9])|(([^$]|\$([^1-9]|$))+)/g) ||
                    []).map((p) => {
      // Pieces that are not $1-9 should be returned after replacing $$
      // with $.
      if (!p.match(/^\$[1-9]$/)) {
        expect(
            (p.match(/\$/g) || []).length % 2 === 0,
            'Unescaped $ found in localized string.');
        return {value: p.replace(/\$\$/g, '$'), arg: null};
      }

      // Otherwise, return the substitution value.
      return {value: varArgs[p[1]], arg: p};
    });

    return pieces;
  }

  /**
   * As above, but also makes sure that the value is a boolean.
   * @param {string} id The key that identifies the desired boolean.
   * @return {boolean} The corresponding boolean value.
   */
  getBoolean(id: string): boolean {
    const value = this.getValue(id);
    expectIsType(id, value, 'boolean');
    return value;
  }

  /**
   * As above, but also makes sure that the value is an integer.
   * @param {string} id The key that identifies the desired number.
   * @return {number} The corresponding number value.
   */
  getInteger(id: string): number {
    const value = this.getValue(id);
    expectIsType(id, value, 'number');
    expect(value === Math.floor(value), 'Number isn\'t integer: ' + value);
    return value;
  }

  /**
   * Override values in loadTimeData with the values found in |replacements|.
   * @param {Object<string, *>} replacements The dictionary object of keys to replace.
   */
  overrideValues(replacements: {[key: string]: any}) {
    expect(
        typeof replacements === 'object',
        'Replacements must be a dictionary object.');
    for (const key in replacements) {
      this.data_[key] = replacements[key];
    }
  }

  /** Reset loadTimeData's data to empty. Should only be used in tests. */
  resetForTesting() {
    this.data_ = {};
  }
}

/**
 * Checks condition, throws error message if expectation fails.
 * @param {*} condition The condition to check for truthiness.
 * @param {string} message The message to display if the check fails.
 */
function expect(condition: any, message: string) {
  if (!condition) {
    throw new Error(
        'Unexpected condition on ' + document.location.href + ': ' + message);
  }
}

/**
 * Checks that the given value has the given type.
 * @param {string} id The id of the value (only used for error message).
 * @param {*} value The value to check the type on.
 * @param {string} type The type we expect |value| to be.
 */
function expectIsType(id: string, value: any, type: string) {
  expect(
      typeof value === type, '[' + value + '] (' + id + ') is not a ' + type);
}

expect(!loadTimeData, 'should only include this file once');
loadTimeData = new LoadTimeData;

// Expose |loadTimeData| directly on |window|, since within a JS module the
// scope is local and not all files have been updated to import the exported
// |loadTimeData| explicitly.
(window as any).loadTimeData = loadTimeData;

// console.warn('crbug/1173575, non-JS module files deprecated.');

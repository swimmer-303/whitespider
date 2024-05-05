/**
 * Copyright 2010 Tim Down.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Author: Tim Down <tim@timdown.co.uk>
 * Version: 2.1
 * Build date: 21 March 2010
 * Website: http://www.timdown.co.uk/jshashtable
 *
 * (Slight mod to add to gamecore namespace -- martin@playcraftlabs.com)
 */

/**
 * jshashtable
 *
 * jshashtable is a JavaScript implementation of a hash table. It creates a single constructor function called Hashtable
 * in the global scope.
 * Example:
 * <code>
 *     var map = new gamecore.Hashtable();
 *     map.put('test1', obj);
 *     var obj = map.get('test1');
 * </code>
 */

(function () {
    'use strict';

    function hashObject(obj) {
        if (typeof obj === 'string') {
            return obj;
        } else if (typeof obj.hashCode === 'function') {
            return obj.hashCode();
        } else if (typeof obj.toString === 'function') {
            return obj.toString();
        } else {
            try {
                return String(obj);
            } catch (ex) {
                return Object.prototype.toString.call(obj);
            }
        }
    }

    function equals_fixedValueHasEquals(fixedValue, variableValue) {
        return fixedValue.equals(variableValue);
    }

    function equals_fixedValueNoEquals(fixedValue, variableValue) {
        return typeof variableValue.equals === 'function' ?
            variableValue.equals(fixedValue) : (fixedValue === variableValue);
    }

    function Bucket(hash, firstKey, firstValue, equalityFunction) {
        this[0] = hash;
        this.entries = [];
        this.addEntry(firstKey, firstValue);

        if (equalityFunction !== null) {
            this.getEqualityFunction = function () {
                return equalityFunction;
            };
        }
    }

    Bucket.prototype = {
        getEqualityFunction: function (searchValue) {
            return typeof searchValue.equals === 'function' ?
                equals_fixedValueHasEquals : equals_fixedValueNoEquals;
        },

        getEntryForKey: function (key) {
            for (var i = 0, len = this.entries.length; i < len; ++i) {
                if (this.getEqualityFunction(key)(key, this.entries[i][0])) {
                    return this.entries[i];
                }
            }
            return null;
        },

        getEntryAndIndexForKey: function (key) {
            for (var i = 0, len = this.entries.length; i < len; ++i) {
                if (this.getEqualityFunction(key)(key, this.entries[i][0])) {
                    return [i, this.entries[i][1]];
                }
            }
            return null;
        },

        removeEntryForKey: function (key) {
            var result = this.getEntryAndIndexForKey(key);
            if (result) {
                this.entries.splice(result[0], 1);
                return result[1];
            }
            return null;
        },

        addEntry: function (key, value) {
            this.entries.push([key, value]);
        },

        keys: function (aggregatedArr) {
            if (!aggregatedArr) {
                aggregatedArr = [];
            }
            for (var i = 0, len = this.entries.length; i < len; ++i) {
                aggregatedArr.push(this.entries[i][0]);
            }
            return aggregatedArr;
        },

        values: function (aggregatedArr) {
            if (!aggregatedArr) {
                aggregatedArr = [];
            }
            for (var i = 0, len = this.entries.length; i < len; ++i) {
                aggregatedArr.push(this.entries[i][1]);
            }
            return aggregatedArr;
        },

        getEntries: function (entries) {
            if (!entries) {
                entries = [];
            }
            for (var i = 0, len = this.entries.length; i < len; ++i) {
                entries.push(this.entries[i].slice(0));
            }
            return entries;
        },

        containsKey: function (key) {
            return !!this.getEntryForKey(key);
        },

        containsValue: function (value) {
            for (var i = 0, len = this.entries.length; i < len; ++i) {
                if (value === this.entries[i][1]) {
                    return true;
                }
            }
            return false;
        },

        hashCode: function () {
            return hashObject(this.entries[0][0]);
        },

        get: function (key) {
            var entry = this.getEntryForKey(key);
            return entry ? entry[1] : null;
        }
    };

    function searchBuckets(buckets, hash) {
        for (var i = 0, len = buckets.length; i < len; ++i) {
            if (buckets[i][0] === hash) {
                return i;
            }
        }
        return null;
    }

    function getBucketForHash(bucketsByHash, hash) {
        return bucketsByHash[hash] || null;
    }

    function Hashtable(hashingFunctionParam, equalityFunctionParam) {
        var buckets = [];
        var bucketsByHash = {};

        var hashingFunction = hashingFunctionParam || hashObject;
        var equalityFunction = equalityFunctionParam || null;

        this.put = function (key, value) {
            if (key === null || typeof key === 'undefined') {
                throw new Error("null is not a valid key");
            }
            if (value === null || typeof value === 'undefined') {
                throw new Error("value must not be undefined");
            }
            var hash = hashingFunction(key), bucket, bucketEntry, oldValue = null;

            bucket = getBucketForHash(bucketsByHash, hash);
            if (bucket) {
                bucketEntry = bucket.getEntryForKey(key);
                if (bucketEntry) {
                    oldValue = bucketEntry[1];
                    bucketEntry[1] = value;
                } else {
                    bucket.addEntry(key, value);
                }
            } else {
                bucket = new Bucket(hash, key, value, equalityFunction);
                buckets[buckets.length] = bucket;
                bucketsByHash[hash] = bucket;
            }
            return oldValue;
        };

        this.get = function (key) {
            if (key === null || typeof key === 'undefined') {
                throw new Error("null is not a valid key");
            }
            var hash = hashingFunction(key);
            var bucket = getBucketForHash(bucketsByHash, hash);
            if (bucket) {
                var bucketEntry = bucket.getEntryForKey(key);
                if (bucketEntry) {
                    return bucketEntry[1];
                }
            }
            return null;
        };

        this.containsKey = function (key) {
            if (key === null || typeof key === 'undefined') {
                throw new Error("null is not a valid key");
            }
            var hash = hashingFunction(key);
            var bucket = getBucketForHash(bucketsByHash, hash);
            return bucket ? bucket.containsKey(key) : false;
        };

        this.containsValue = function (value) {
            var i = buckets.length;
            while (i--) {
                if (buckets[i].containsValue(value)) {
                    return true;
                }
            }
            return false;
        };

        this.clear = function () {
            buckets.length = 0;
            bucketsByHash = {};
        };

        this.isEmpty = function () {
            return !buckets.length;
        };

        var createBucketAggregator = function (bucketFuncName) {
            return function () {
                var aggregated = [], i = buckets.length;
                while (i--) {
                    buckets[i][bucketFuncName](aggregated);
                }
                return aggregated;
            };
        };

        this.keys = createBucketAggregator("keys");
        this.values = createBucketAggregator("values");
        this.entries = createBucketAggregator("getEntries");

        this.remove = function (key) {
            if (key === null || typeof key === 'undefined') {
                throw new Error("null is not a valid key");
            }
            var hash = hashingFunction(key);
            var bucketIndex, oldValue = null;

            var bucket = getBucketForHash(bucketsByHash, hash);

            if (bucket) {
                oldValue = bucket.removeEntryForKey(key);
                if (!bucket.entries.length) {
                    bucketIndex = searchBuckets(buckets, hash);
                    buckets.splice(bucketIndex, 1);
                    delete bucketsByHash[hash];
                }
            }
            return oldValue;
        };

        this.size = function () {
            var total = 0, i = buckets.length;
            while (i--) {
                total += buckets[i].entries.length;
            }
            return total;
        };

        this.each = function (callback) {
            var entries = this.entries(), i = entries.length, entry;
            while (i--) {
                entry = entries[i];
                callback(entry[0], entry[1]);
            }
        };

        this.putAll = function (hashtable, conflictCallback) {
            var entries = hashtable.entries();
            var entry, key, value, thisValue, i = entries.length;
            var hasConflictCallback = typeof conflictCallback === 'function';
            while (i--) {
                entry = entries[i];
                key = entry[0];
                value = entry[1];

                if (hasConflictCallback && (thisValue = this.get(key))) {
                    value = conflictCallback(key, thisValue, value);
                }
                this.put(key, value);
            }
        };

        this.clone = function () {
            var clone = new Hashtable(hashingFunctionParam, equalityFunctionParam);
            clone.putAll(this);
            return clone;
        };

        /**
         * Added by martin@playcratlabs.com to support debug dumping of hash arrays
         */
        this.toString = function () {
            var result = '';
            var keys = this.keys();
            for (var i = 0; i < keys.length; i++) {
                var obj = this.get(keys[i]);
                result += keys[i].toString() + ' = ' + obj.toString() + '\n';
            }

            return result;
        }
    }

    gamecore.Hashtable = Hashtable;
})();

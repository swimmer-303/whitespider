/**
 * A class to help manage and draw a collection of sprites.
 * Code by Rob Kleffner, 2011
 */
Enjine.DrawableManager = function () {
  this.unsorted = true;
  this.objects = [];
};

/**
 * Adds an object to the manager.
 * @param {Object} object - The object to add.
 */
Enjine.DrawableManager.prototype.add = function (object) {
  this.objects.push(object);
  this.unsorted = true;
};

/**
 * Adds a range of objects to the manager.
 * @param {Array<Object>} objects - The objects to add.
 */
Enjine.DrawableManager.prototype.addRange = function (objects) {
  this.objects = this.objects.concat(objects);
  this.unsorted = true;
};

/**
 * Clears all objects from the manager.
 */
Enjine.DrawableManager.prototype.clear = function () {
  this.objects.length = 0;
};

/**
 * Checks if an object is in the manager.
 * @param {Object} obj - The object to check.
 * @return {boolean} True if the object is in the manager, false otherwise.
 */
Enjine.DrawableManager.prototype.contains = function (obj) {
  for (let i = this.objects.length - 1; i >= 0; i--) {
    if (this.objects[i] === obj) {
      return true;
    }
  }
  return false;
};

/**
 * Removes an object from the manager.
 * @param {Object} object - The object to remove.
 */
Enjine.DrawableManager.prototype.remove = function (object) {
  const index = this.linearSearch(object);
  if (index !== -1) {
    this.objects.splice(index, 1);
  }
};

/**
 * Removes an object at a specific index.
 * @param {number} index - The index of the object to remove.
 */
Enjine.DrawableManager.prototype.removeAt = function (index) {
  this.objects.splice(index, 1);
};

/**
 * Removes a range of objects from the manager.
 * @param {number} index - The index of the first object to remove.
 * @param {number} length - The number of objects to remove.
 */
Enjine.DrawableManager.prototype.removeRange = function (index, length) {
  this.objects.splice(index, length);
};

/**
 * Removes a list of objects from the manager.
 * @param {Array<Object>} items - The objects to remove.
 */
Enjine.DrawableManager.prototype.removeList = function (items) {
  if (!Array.isArray(items)) {
    throw new Error('Items must be an array');
  }
  for (let i = 0, j = 0; i < this.objects.length && j < items.length; ) {
    if (this.objects[i] === items[j]) {
      this.objects.splice(i, 1);
      items.splice(j, 1);
      i--;
      j--;
    } else if (i < this.objects.length - 1) {
      i++;
    } else {
      break;
    }
    j++;
  }
};

/**
 * Updates all objects in the manager.
 * @param {number} delta - The time since the last frame.
 */
Enjine.DrawableManager.prototype.update = function (delta) {
  for (let i = 0; i < this.objects.length; i++) {
    const obj = this.objects[i];
    if (obj.update) {
      obj.update(delta);
    }
  }
};

/**
 * Draws all objects in the manager.
 * @param {CanvasRenderingContext2D} context - The canvas context to draw on.
 * @param {Object} camera - The camera object.
 */
Enjine.DrawableManager.prototype.draw = function (context, camera) {
  // sort the sprites based on their 'z depth' to get the correct drawing order
  if (this.unsorted) {
    this.unsorted = false;
    this.objects.sort((x1, x2) => x1.zOrder - x2.zOrder);
  }

  for (let i = 0; i < this.objects.length; i++) {
    const obj = this.objects[i];
    if (obj.draw) {
      obj.draw(context, camera);
    }
  }
};

/**
 * Linear searches for an object in the array.
 * @param {Object} obj - The object to search for.
 * @return {number} The index of the object, or -1 if not found.
 */
Enjine.DrawableManager.prototype.linearSearch = function (obj) {
  for (let i = 0; i < this.objects.length; i++) {
    if (this.objects[i] === obj) {
      return i;
    }
  }
  return -1;
};

Mario.SpriteCuts = {

  /********************\
   * Utility functions
   ********************/
  validateResource: function (resourceName) {
    if (!Enjine.Resources.Images.hasOwnProperty(resourceName)) {
      throw new Error(`Image resource "${resourceName}" not found.`);
    }
  },

  createSpriteFont: function (charArrayStartIndex, spriteWidth, spriteHeight, image) {
    this.validateResource(image);
    const letters = [];
    const i = 0;
    for (i = 32; i < 127; i++) {
      letters[i] = { X: (i - 32) * spriteWidth, Y: charArrayStartIndex };
    }
    return new Enjine.SpriteFont([], image, spriteWidth, spriteHeight, letters);
  },

  /********************\
   * Spritesheet related
   ********************/
  getSpriteSheet: function (image, spriteWidth, spriteHeight, width, height) {
    this.validateResource(image);
    const sheet = [];
    let x = 0, y = 0;
    for (x = 0; x < width; x++) {
      sheet[x] = [];
      for (y = 0; y < height; y++) {
        sheet[x][y] = { X: x * spriteWidth, Y: y * spriteHeight, Width: spriteWidth, Height: spriteHeight };
      }
    }
    return sheet;
  },

  getBackgroundSheet: function () {
    const width = Enjine.Resources.Images["background"].width / 32;
    const height = Enjine.Resources.Images["background"].height / 32;
    return this.getSpriteSheet("background", 32, 32, width, height);
  },

  getLevelSheet: function () {
    const width = Enjine.Resources.Images["map"].width / 16;
    const height = Enjine.Resources.Images["map"].height / 16;
    return this.getSpriteSheet("map", 16, 16, width, height);
  },

  /********************\
   * Font related
   ********************/
  CreateBlackFont: function () {
    return this.createSpriteFont(0, 8, 8, Enjine.Resources.Images["font"]);
  },

  CreateRedFont: function () {
    return this.createSpriteFont(8, 8, 8, Enjine.Resources.Images["font"]);
  },

  CreateGreenFont: function () {
    return this.createSpriteFont(16, 8, 8, Enjine.Resources.Images["font"]);
  },

  CreateBlueFont: function () {
    return this.createSpriteFont(24, 8, 8, Enjine.Resources.Images["font"]);
  },

  CreateYellowFont: function () {
    return this.createSpriteFont(32, 8, 8, Enjine.Resources.Images["font"]);
  },

  CreatePinkFont: function () {
    return this.createSpriteFont(40, 8, 8, Enjine.Resources.Images["font"]);
  },

  CreateCyanFont: function () {
    return this.createSpriteFont(48, 8, 8, Enjine.Resources.Images["font"]);
  },

  CreateWhiteFont: function () {
    return this.createSpriteFont(56, 8, 8, Enjine.Resources.Images["font"]);
  }
};

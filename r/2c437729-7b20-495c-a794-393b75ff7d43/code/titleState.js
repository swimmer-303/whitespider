// Displays the title screen and menu.
// Code by Rob Kleffner, 2011

Mario.TitleState = function() {
  this.drawManager = null;
  this.camera = null;
  this.logoY = null;
  this.bounce = null;
  this.font = null;
  this.titleImage = null;
  this.logoImage = null;
};

Mario.TitleState.prototype = new Enjine.GameState();

Mario.TitleState.prototype.initializeResources = function() {
  Enjine.Resources.Images.initialize({
    title: 'path/to/title',
    logo: 'path/to/logo',
    smallMario: 'path/to/smallMario'
  });
};

Mario.TitleState.prototype.releaseResources = function() {
  Enjine.Resources.Images.release('title');
  Enjine.Resources.Images.release('logo');
  Enjine.Resources.Images.release('smallMario');
};

Mario.TitleState.prototype.enter = function(drawManager, camera, titleImage, logoImage) {
  this.drawManager = drawManager;
  this.camera = camera;
  this.titleImage = titleImage;
  this.logoImage = logoImage;

  this.drawManager.Add(new Mario.BackgroundGenerator(2048, 15, true, Mario.LevelType.Overground));
  this.drawManager.Add(new Mario.BackgroundRenderer(bgGenerator.CreateLevel(), 320, 240, 2));
  bgGenerator.SetValues(2048, 15, false, Mario.LevelType.Overground);
  this.drawManager.Add(new Mario.BackgroundRenderer(bgGenerator.CreateLevel(), 320, 240, 1));

  this.title = new Enjine.Sprite();
  this.title.Image = this.titleImage;
  this.title.X = 0;
  this.title.Y = 120;

  this.logo = new Enjine.Sprite();
  this.logo.Image = this.logoImage;
  this.logo.X = 0;
  this.logo.Y = 0;

  this.font = Mario.SpriteCuts.CreateRedFont();
  this.font.Strings[0] = { String: "Press S to Start", X: 96, Y: 120};

  this.logoY = 20;

  this.drawManager.Add(this.title);
  this.drawManager.Add(this.logo);

  this.bounce = 0;

  Mario.GlobalMapState = new Mario.MapState();
  Mario.MarioCharacter = new Mario.Character();
  Mario.MarioCharacter.Image = Enjine.Resources.Images["smallMario"];

  Mario.PlayTitleMusic();
};

Mario.TitleState.prototype.exit = function() {
  Mario.StopMusic();
  this.drawManager.Clear();
};

Mario.TitleState.prototype.handleInput = function(keyboardInput) {
  if (keyboardInput.IsKeyDown(Enjine.Keys.S)) {
    this.context.ChangeState(Mario.GlobalMapState);
  }
};

Mario.TitleState.prototype.update = function(delta) {
  this.bounce += delta * 2;
  this.logoY = 20 + Math.sin(this.bounce) * 10;

  this.camera.X += delta * 25;

  this.drawManager.Update(delta);
};

Mario.TitleState.prototype.draw = function(context) {
  this.drawManager.Draw(context, this.camera);

  context.drawImage(this.titleImage, 0, 120);
  context.drawImage(this.logoImage, 0, this.logoY);

  this.font.Draw(context, this.camera);
};

class Mario {
  static MapTile = {
    Grass: 0,
    Water: 1,
    Level: 2,
    Road: 3,
    Decoration: 4,
  };

  constructor() {
    this.camera = new Enjine.Camera();

    this.Level = [];
    this.Data = [];
    this.XMario = 0;
    this.YMario = 0;
    this.XMarioA = 0;
    this.YMarioA = 0;
    this.MoveTime = 0;
    this.LevelId = 0;
    this.Farthest = 0;
    this.XFarthestCap = 0;
    this.YFarthestCap = 0;
    this.MapImage = document.createElement("canvas");
    this.MapImage.width = 320;
    this.MapImage.height = 240;
    this.MapContext = this.MapImage.getContext("2d");
    this.MapContext.fillStyle = "white";
    this.CanEnterLevel = false;
    this.EnterLevel = false;
    this.LevelDifficulty = 0;
    this.LevelType = 0;

    this.WorldNumber = -1;
    this.NextWorld = null;
  }

  // ... rest of the code
}

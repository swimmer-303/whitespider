/**
 * Generates a pseudo-random procedural level.
 * Code by Rob Kleffner, 2011
 */

class MarioLevelGenerator {
    /**
     * Create a new level generator.
     * @param {number} width - The width of the level.
     * @param {number} height - The height of the level.
     */
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.odds = [];
        this.totalOdds = 0;
        this.difficulty = 0;
        this.type = 0;
    }

    /**
     * Create a new level with the given type and difficulty.
     * @param {number} type - The type of the level.
     * @param {number} difficulty - The difficulty of the level.
     * @return {MarioLevel} The generated level.
     */
    createLevel(type, difficulty) {
        this.type = type;
        this.difficulty = difficulty;
        this.odds[Mario.Odds.Straight] = 20;
        this.odds[Mario.Odds.HillStraight] = 10;
        this.odds[Mario.Odds.Tubes] = 2 + difficulty;
        this.odds[Mario.Odds.Jump] = 2 * difficulty;
        this.odds[Mario.Odds.Cannon] = -10 + 5 * difficulty;

        if (this.type !== Mario.LevelType.Overground) {
            this.odds[Mario.Odds.HillStraight] = 0;
        }

        this.totalOdds = this.odds.reduce((sum, odd) => sum + odd, 0);

        for (let i = 0; i < this.odds.length; i++) {
            this.odds[i] = this.totalOdds - this.odds[i];
        }

        const level = new Mario.Level(this.width, this.height);
        let length = this.buildStraight(level, 0, level.width, true);

        while (length < level.width - 64) {
            length += this.buildZone(level, length, level.width - length);
        }

        const floor = this.height - 1 - (Math.random() * 4) | 0;
        level.exitX = length + 8;
        level.exitY = floor;

        for (let x = length; x < level.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (y >= floor) {
                    level.setBlock(x, y, 1 + 9 * 16);
                }
            }
        }

        if (type === Mario.LevelType.Castle || type === Mario.LevelType.Underground) {
            for (let x = 0; x < level.width; x++) {
                if (run-- <= 0 && x > 4) {
                    const ceiling = (Math.random() * 4) | 0;
                    run = ((Math.random() * 4) | 0) + 4;
                }
                for (let y = 0; y < level.height; y++) {
                    if ((x > 4 && y <= ceiling) || x < 1) {
                        level.setBlock(x, y, 1 + 9 * 16);
                    }
                }
            }
        }

        this.fixWalls(level);

        return level;
    }

    // ... rest of the methods
}

/**
 * Represents a very basic game timer.
 * Code by Rob Kleffner, 2011, with improvements by AI.
 */

Enjine.GameTimer = function () {
    this.framesPerSecond = 1000 / 30;
    this.lastTime = 0;
    this.intervalFunc = null;
    this.updateObject = null;
    this.deltaThreshold = 0.1; // added to avoid huge delta values when the game is paused for a long time
};

Enjine.GameTimer.prototype = {
    start: function () {
        this.lastTime = new Date().getTime();
        this.intervalFunc = setInterval(this.tick.bind(this), this.framesPerSecond);
    },

    tick: function () {
        if (this.updateObject != null) {
            const newTime = new Date().getTime();
            const delta = Math.min(this.deltaThreshold, (newTime - this.lastTime) / 1000); // limit delta to avoid huge values
            this.lastTime = newTime;

            this.updateObject.update(delta);
        }
    },

    stop: function () {
        clearInterval(this.intervalFunc);
    }
};

/**
 * Simple State pattern implementation for game states.
 * Code by Rob Kleffner, 2011
 */

const EventEmitter = require('events');

class Enjine {
  static GameStateContext = class GameStateContext extends EventEmitter {
    constructor(defaultState) {
      super();
      this.State = null;

      if (defaultState != null) {
        this.State = defaultState;
        this.State.Enter();
      }
    }

    ChangeState(newState) {
      if (this.State != null) {
        this.State.Exit();
      }
      this.State = newState;
      this.State.Enter();

      // Emit a changeState event
      this.emit('changeState', this.State);
    }

    Update(delta) {
      this.State.CheckForChange(this, delta);
      this.State.Update(delta);
    }

    Draw(delta) {
      this.State.Draw(delta);
    }
  };

  /**
   * Base game state class to at least ensure that all the functions exist.
   */
  static GameState = class GameState {
    constructor() {}

    Enter() {}
    Exit() {}
    Update(delta) {}
    Draw(context) {}
    CheckForChange(context, delta) {}
  };
}

module.exports = Enjine;

class FSM {

  constructor(config) {
    this._previousStates = [];
    this._futureState = [];
    this._initial = config.initial;
    this._currentState = config.initial;
    this._states = config.states;
  }

  getState() {
    return this._currentState;
  }

  changeState(state) {
    if (this._states[state]) {
      this._previousStates.push(this._currentState);
      this._currentState = state;
      this._futureState = [];
    } else {
      throw new Error();
    }
  }

  trigger(event) {
    this._previousStates.push(this._currentState);
    this._currentState = this._states[this._currentState].transitions[event];
    this._futureState = [];
    if (this._currentState == undefined) {
      throw new Error();
    }
  }

  reset() {
    this._currentState = this._initial;
  }

  getStates(event) {
    if (event) {
      const statesArray = [];
      for (let state in this._states) {
        if (this._states[state].transitions[event]) statesArray.push(state);
      }
      return statesArray;
    }
    const statesArray = [];
    for (let state in this._states) {
      if (statesArray.indexOf(state) < 0) statesArray.push(state);
    }
    return statesArray;
  }

  undo() {
    if (this._previousStates.length) {
      this._futureState.unshift(this._currentState);
      this._currentState = this._previousStates.pop();
      return true;
    }
    return false;
  }

  redo() {
    if (this._futureState.length) {
      this._currentState = this._futureState.shift();
      return true;
    }
    return false;
  }

  clearHistory() {
    this._previousStates.length = 0;
  }
}

module.exports = FSM;

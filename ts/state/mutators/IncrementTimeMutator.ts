import GameState from "../GameState";
import GameStateMutator from "../GameStateMutator";

class IncrementTimeMutator implements GameStateMutator {
	constructor(public time: number = 1) {
	}

	public applyTo(state: GameState): GameState {
		if (this.time === 0) {
			return state;
		}

		var time = state.getTime();
		if (time === null) {
			time = 0;
		}
		else {
			time += this.time;
		}

		return new GameState(state.getEntities(), state.getEntityTree(), state.getOptions(), state.getOptionTree(), time);
	}
}

export default IncrementTimeMutator;

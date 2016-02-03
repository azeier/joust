import GameState from '../GameState';
import GameStateMutator from '../GameStateMutator';
import Entity from '../../Entity';
import BaseMutator from "./BaseMutator";

class ReplaceEntityMutator extends BaseMutator implements GameStateMutator {
	constructor(public entity:Entity) {
		super();
	}

	public applyTo(state:GameState):GameState {
		var newEntity = this.entity;
		if (!newEntity) {
			console.error('Cannot replace null entity');
			return state;
		}

		var id = this.entity.getId();
		var oldEntity = state.getEntity(id);
		if (!oldEntity) {
			console.error('Cannot update non-existent entity #' + id);
			return state;
		}

		// verify entity has actually changed
		if (newEntity === oldEntity) {
			console.warn('Update has no effect on entity #' + id);
			return state;
		}

		var entities = state.getEntities();
		entities = entities.set(id, newEntity);

		var entityTree = state.getEntityTree();
		entityTree = entityTree.withMutations(function (map) {
			map.deleteIn([oldEntity.getController(), oldEntity.getZone(), id])
				.setIn([newEntity.getController(), newEntity.getZone(), id], newEntity);
		});

		return new GameState(entities, entityTree, state.getOptions(), state.getOptionTree(), this.time || state.getTime());
	}
}

export default ReplaceEntityMutator;
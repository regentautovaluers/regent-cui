import { type TrackedVehicles } from '~/types/regent-tracking/tracked-vehicles';

export const { state, getter, mutation, action, ...store } = createStore('activeTrackedVehicle', {
	activeTrackedVehicle: null as TrackedVehicles | null,
});

export const getTrackedVehicle = getter(
	'getRoadsideIncidents',
	(state) => state.activeTrackedVehicle,
);

export const setTrackedVehicle = mutation(
	'setRoadsideIncidents',
	(state, activeTrackedVehicle: TrackedVehicles) => {
		state.activeTrackedVehicle = activeTrackedVehicle;
	},
);

export const cleanTrackedVehicle = mutation('cleanTrackedVehicle', (state) => {
	state.activeTrackedVehicle = null;
});

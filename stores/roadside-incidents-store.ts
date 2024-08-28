export const { state, getter, mutation, action, ...store } = createStore('roadsideIncidents', {
	roadsideIncidents: [] as any[],
});

export const getRoadsideIncidents = getter(
	'getRoadsideIncidents',
	(state) => state.roadsideIncidents,
);

export const setRoadsideIncidents = mutation(
	'setRoadsideIncidents',
	(state, roadsideIncidents: any[]) => {
		state.roadsideIncidents = roadsideIncidents;
	},
);

export const cleanRoadsideIncidents = mutation('cleanRoadsideIncidents', (state) => {
	state.roadsideIncidents = [];
});

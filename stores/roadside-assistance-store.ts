// Roadside Assistance Incidents Analytics
import { type RoadsideAssistanceAnalytics } from '~/types';

export const { state, getter, mutation, action, ...store } = createStore('ra-and-memberships-chart-store', {
	raAnalytics: {} as RoadsideAssistanceAnalytics,
	totalCompleted: 0,
});

export const getRAAnalytics = getter('getRAAnalytics', (state) => state.raAnalytics);

export const getTotalCompleted = getter('getTotalCompleted', (state) => state.totalCompleted);

export const setRAAnalytics = mutation(
	'setRAAnalytics',
	(state, raAnalytics: RoadsideAssistanceAnalytics) => {
		state.raAnalytics = raAnalytics;
	},
);

export const setTotalCompleted = mutation('setTotalCompleted', (state, totalReq: number) => {
	state.totalCompleted = totalReq;
});

export const cleanRAAnalytics = mutation('cleanRAAnalytics', (state) => {
	state.raAnalytics = {} as RoadsideAssistanceAnalytics;
});

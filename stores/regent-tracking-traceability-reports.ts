import { type Report } from '~/types/regent-tracking/trace-report';

const { state, getter, mutation, action, ...store } = createStore('activeTrackedVehicle', {
	deviceReports: null as Report[] | null,
});

export const getDeviceReports = getter('getDeviceReports', (state) => state.deviceReports);

export const setDeviceReports = mutation('setDeviceReports', (state, devices: Report[] | null) => {
	state.deviceReports = devices;
});

export const cleanDeviceReports = mutation('cleanDeviceReports', (state) => {
	state.deviceReports = null;
});

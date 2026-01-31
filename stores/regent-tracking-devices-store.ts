import type { DriverRiskScore } from '~/types/insurance-telematics/driver-behaviour';
import { type TrackedVehicles } from '~/types/regent-tracking/tracked-vehicles';
import type { AccidentAnalytics } from '~/types/insurance-telematics/accident-record';

const { state, getter, mutation, action, ...store } = createStore('activeTrackedVehicle', {
	clientDevices: null as TrackedVehicles[] | null,
	activeTrackedVehicle: null as TrackedVehicles | null,
	activeTrackedVehicleLocation: null as string | null,
	computingFor: 0 as number,
	totalDone: 0 as number,
});

// all tracked vehicles
export const getClientDevices = getter('getClientDevices', (state) => state.clientDevices);

export const getComputingAnalyticsFor = getter(
	'getComputingAnalyticsFor',
	(state) => state.computingFor,
);

export const setComputingAnalyticsFor = mutation(
	'setComputingAnalyticsFor',
	(state, target: number) => {
		state.computingFor = target;
	},
);

export const getTotalAnalyticsDone = mutation('getTotalAnalyticsDone', (state) => state.totalDone);

export const setTotalAnalyticsDone = mutation(
	'setTotalAnalyticsDone',
	(state) => (state.totalDone += 1),
);

// tracked device by some id
export const setDeviceDriverBehaviour = action(
	'setDeviceDriverBehaviour',
	async (driverBehaviour: DriverRiskScore, mutate) => {
		const deviceId = driverBehaviour.deviceId;
		mutate((state) => {
			let toEdit = state.clientDevices?.findIndex((e) => e.id == deviceId)!;
			(state.clientDevices as TrackedVehicles[])[toEdit] = {
				...(state.clientDevices as TrackedVehicles[])[toEdit],
				driverRiskScore: driverBehaviour,
			};
		});
	},
);

export const setLastDeviceAccident = action(
	'setLastDeviceAccient',
	async (accidentRecord: AccidentAnalytics, mutate) => {
		const deviceId = accidentRecord.deviceId;
		mutate((state) => {
			let toEdit = state.clientDevices?.findIndex((e) => e.id == deviceId)!;
			(state.clientDevices as TrackedVehicles[])[toEdit] = {
				...(state.clientDevices as TrackedVehicles[])[toEdit],
				latestAccident: accidentRecord,
			};
		});
	},
);

export const setClientDevices = mutation(
	'setClientDevices',
	(state, devices: TrackedVehicles[] | null) => {
		state.clientDevices = devices;
	},
);

export const cleanClientDevices = mutation('cleanClientDevices', (state) => {
	state.clientDevices = null;
});

// single tracked vehicle
export const getTrackedVehicle = getter('getTrackedVehicle', (state) => state.activeTrackedVehicle);

export const setTrackedVehicle = mutation(
	'setTrackedVehicle',
	(state, activeTrackedVehicle: TrackedVehicles) => {
		state.activeTrackedVehicle = activeTrackedVehicle;
	},
);

export const cleanTrackedVehicle = mutation('cleanTrackedVehicle', (state) => {
	state.activeTrackedVehicle = null;
});

// tracked vehicle location
export const getTrackedVehicleLocation = getter(
	'getTrackedVehicleLocation',
	(state) => state.activeTrackedVehicleLocation,
);

export const setTrackedVehicleLocation = mutation(
	'setTrackedVehicleLocation',
	(state, newLocation: string) => {
		state.activeTrackedVehicleLocation = newLocation;
	},
);

export const cleanTrackedVehicleLocation = mutation('cleanTrackedVehicleLocation', (state) => {
	state.activeTrackedVehicleLocation = null;
});

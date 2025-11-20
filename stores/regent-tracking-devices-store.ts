import type { DriverRiskScore } from '~/types/insurance-telematics/driver-behaviour';
import { type TrackedVehicles } from '~/types/regent-tracking/tracked-vehicles';

const { state, getter, mutation, action, ...store } = createStore('activeTrackedVehicle', {
	clientDevices: null as TrackedVehicles[] | null,
	activeTrackedVehicle: null as TrackedVehicles | null,
	activeTrackedVehicleLocation: null as string | null,
});

// all tracked vehicles
export const getClientDevices = getter('getClientDevices', (state) => state.clientDevices);

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

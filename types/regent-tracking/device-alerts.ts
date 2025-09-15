export interface DeviceAlerts {
	id: number;
	user_id: number;
	active: number;
	name: string;
	type: string;
	for_all_user_devices: number;
	overspeed: number;
	time_duration: number;
	stop_duration: number;
	offline_duration: number;
	move_duration: number;
	min_parking_duration: number;
	idle_duration: number;
	ignition_duration: number;
	state: number;
	authorized: boolean;
	continuous_duration: number;
	distance: number;
	period: number;
	distance_tolerance: number;
	task_status: number[];
	created_at: string;
	updated_at: string;
	devices: number[];
	drivers: number[];
	geofences: number[];
	events_custom: number[];
	pois: number[];
	zone: number;
	zones: Zone[];
	schedule: boolean;
	schedules: Schedule[];
	notifications: Notifications;
	command: Command;
}

export interface Zone {}

export interface Schedule {
	id: string;
	title: string;
	items: Item[];
}

export interface Item {}

export interface Notifications {
	sound: Sound;
	push: Push;
	email: Email;
	sms: Sms;
	webhook: Webhook;
}

export interface Sound {
	active: boolean;
}

export interface Push {
	active: boolean;
}

export interface Email {
	active: boolean;
	input: string;
}

export interface Sms {
	active: boolean;
	input: string;
}

export interface Webhook {
	active: boolean;
	input: string;
}

export interface Command {
	active: boolean;
	type: string;
	key: string;
}

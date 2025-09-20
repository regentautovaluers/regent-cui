// for location analysis
export interface VehiclePing {
	lat: number;
	lng: number;
	time_recorded: string; // ISO 8601 string, e.g., '2025-09-15 00:06:35'
}

export interface VehicleMovement {
	startedAt: string;
	startAtLat: number;
	startAtLng: number;
	stoppedAt: string | null;
	stoppedAtLat: number | null;
	stoppedAtLng: number | null;
	totalDistance: number;
	averageSpeed: number;
	drivingDuration: string | null;
	totalIdleDuration: string | null;
	idlePeriods: IdlePeriods[];
}

export interface IdlePeriods {
	startedAt: string;
	stoppedAt: string;
	durationInMinutes: number;
}

export interface DayMovement {
	date: string;
	movement: VehicleMovement[];
	pingHistory: { lat: number; lng: number }[];
}

// Interface for the final output object
export interface AnalyzedLocation {
	representative_lat: number;
	representative_lng: number;
	location_time_hours: number;
	location_time_hours_fraction: number;
	appearances: number;
}

// from the API
export interface DeviceHistory {
	items: Item[];
	device: Device;
	distance_sum: string;
	top_speed: string;
	move_duration: string;
	stop_duration: string;
	engine_hours: string;
	engine_idle: string;
	engine_work: string;
	fuel_consumption: any;
	sensors: Sensor2[];
	fuel_consumption_arr: any[];
	item_class: ItemClass[];
	images: Image[];
	status: number;
}

export interface Item {
	status: number;
	time?: string;
	show: string;
	raw_time: string;
	distance: number;
	driver: any;
	items: Item2[];
	index?: number;
	left?: string;
	time_seconds?: number;
	engine_work?: number;
	engine_idle?: number;
	engine_hours?: number;
	fuel_consumption: any;
	top_speed?: number;
	average_speed?: number;
	message?: string;
}

export interface Item2 {
	id?: number;
	device_id?: number;
	item_id?: string;
	time: string;
	raw_time: string;
	altitude?: number;
	course?: number;
	speed: number;
	latitude?: number;
	longitude?: number;
	lat: any;
	lng: any;
	distance?: number;
	other: string;
	color?: string;
	valid?: number;
	device_time?: string;
	server_time?: string;
	other_arr?: string[];
	sensors_data?: SensorsDaum[];
}

export interface SensorsDaum {
	id: string;
	value: number;
}

export interface Device {
	id: number;
	user_id: any;
	current_driver_id: any;
	current_driver_rfid: any;
	timezone_id: any;
	traccar_device_id: number;
	icon_id: number;
	model_id: any;
	icon_colors: IconColors;
	active: any;
	kind: number;
	deleted: number;
	name: string;
	imei: string;
	fuel_measurement_id: number;
	fuel_quantity: string;
	fuel_price: string;
	fuel_per_km: string;
	fuel_per_h: string;
	sim_number: string;
	msisdn: any;
	device_model: string;
	plate_number: string;
	vin: string;
	registration_number: string;
	object_owner: string;
	additional_notes: string;
	authentication: any;
	comment: string;
	expiration_date: any;
	sim_expiration_date: any;
	sim_activation_date: any;
	installation_date: any;
	tail_color: string;
	tail_length: number;
	engine_hours: string;
	detect_engine: string;
	detect_speed: any;
	detect_distance: any;
	min_moving_speed: number;
	min_fuel_fillings: number;
	min_fuel_thefts: number;
	snap_to_road: number;
	gprs_templates_only: number;
	valid_by_avg_speed: number;
	max_speed: any;
	parameters: string;
	currents: any;
	created_at: string;
	updated_at: string;
	forward: any;
	device_type_id: any;
	app_tracker_login: number;
	fuel_detect_sec_after_stop: any;
	lbs: any;
	fuel_type: any;
	fuel_emissions: any;
	custom_data: any;
	sensors: Sensor[];
	traccar: Traccar;
}

export interface IconColors {
	moving: string;
	stopped: string;
	offline: string;
	engine: string;
}

export interface Sensor {
	id: number;
	user_id: number;
	device_id: number;
	icon_id: any;
	name: string;
	type: string;
	tag_name: string;
	add_to_history: number;
	add_to_graph: number;
	on_value: any;
	off_value: any;
	shown_value_by: any;
	fuel_tank_name: any;
	full_tank: any;
	full_tank_value: any;
	min_value: any;
	max_value: any;
	formula: any;
	odometer_value_by: any;
	odometer_value: any;
	odometer_value_unit: string;
	value: string;
	value_formula: number;
	show_in_popup: number;
	unit_of_measurement: string;
	unit_type: any;
	on_tag_value: string;
	off_tag_value: string;
	on_type: number;
	off_type: number;
	data: any;
	calibrations: any;
	skip_calibration: any;
	skip_empty: any;
	decbin: number;
	hexbin: number;
	bitcut: any;
	ascii: any;
	mappings: any;
	value_set_at: string;
	value_changed_at: string;
	created_at: any;
	updated_at: any;
	reset_blank: any;
}

export interface Traccar {
	id: number;
	name: string;
	uniqueId: string;
	latestPosition_id: number;
	lastValidLatitude: number;
	lastValidLongitude: number;
	other: string;
	speed: string;
	time: string;
	device_time: string;
	server_time: string;
	ack_time: string;
	altitude: number;
	course: number;
	power: any;
	address: any;
	protocol: string;
	latest_positions: string;
	moved_at: string;
	stoped_at: string;
	move_begin_at: string;
	stop_begin_at: string;
	parked_end_at: string;
	engine_on_at: string;
	engine_off_at: string;
	engine_changed_at: string;
	updated_at: string;
	database_id: any;
}

export interface Sensor2 {
	id: string;
	name: string;
	sufix: string;
}

export interface ItemClass {
	id: number;
	value: string;
	title: string;
}

export interface Image {
	id: number;
	value: string;
	title: string;
}

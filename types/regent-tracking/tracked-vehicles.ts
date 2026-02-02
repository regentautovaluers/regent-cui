import { type Comments } from '~/types/regent-tracking/trace-report';
import { type DriverRiskScore } from '../insurance-telematics/driver-behaviour';
import type { AccidentAnalytics } from '~/types/insurance-telematics/accident-record';

export interface TrackedVehicles {
	id: number;
	alarm: number;
	name: string;
	online: Online;
	time: Date | TimeEnum;
	timestamp: number;
	acktimestamp: number;
	lat: number;
	lng: number;
	course: number;
	speed: number;
	altitude: number;
	icon_type: Type;
	icon_color: IconColor;
	icon_colors: IconColors;
	icon: Icon;
	power: Address;
	address: Address;
	protocol: Address;
	driver: Address;
	driver_data: DriverData;
	sensors: Sensor[] | null;
	services: Service[] | null;
	tail: Tail[];
	distance_unit_hour: DistanceUnitHour;
	unit_of_distance: UnitOfDistance;
	unit_of_altitude: UnitOfAltitude;
	unit_of_capacity: UnitOfCapacity;
	stop_duration: string;
	stop_duration_sec: number;
	moved_timestamp: number;
	engine_status: boolean | null;
	detect_engine: DetectEngine;
	engine_hours: DetectEngine;
	total_distance: number;
	inaccuracy: null;
	sim_expiration_date: null;
	device_data: DeviceData;
	comment: Comments[];
	on_watchlist: boolean;

	// for driver behaviour
	driverRiskScore?: DriverRiskScore | null;

	// for latest recorded accident
	latestAccident?: AccidentAnalytics | null;
}

export enum Address {
	Empty = '-',
	Off = 'Off',
	On = 'On',
}

export enum DetectEngine {
	Acc = 'acc',
	Gps = 'gps',
	Ignition = 'ignition',
}

export interface DeviceData {
	id: number;
	user_id: number;
	current_driver_id: null;
	current_driver_rfid: null;
	timezone_id: number | null;
	traccar_device_id: number;
	icon_id: number;
	model_id: null;
	icon_colors: IconColors;
	active: number;
	kind: number;
	deleted: number;
	name: string;
	imei: null;
	fuel_measurement_id: number;
	fuel_quantity: string;
	fuel_price: string;
	fuel_per_km: string;
	fuel_per_h: string;
	sim_number: null;
	msisdn: null;
	device_model: null;
	plate_number: string;
	vin: null;
	registration_number: string;
	object_owner: string;
	additional_notes: string;
	authentication: null;
	comment: string;
	expiration_date: Date | null;
	sim_expiration_date: null;
	sim_activation_date: null;
	installation_date: null;
	tail_color: TailColor;
	tail_length: number;
	engine_hours: DetectEngine;
	detect_engine: DetectEngine;
	detect_speed: DetectEngine | null;
	detect_distance: null;
	min_moving_speed: number;
	min_fuel_fillings: number;
	min_fuel_thefts: number;
	snap_to_road: number;
	gprs_templates_only: number;
	valid_by_avg_speed: number;
	max_speed: null;
	parameters: null | string;
	currents: null;
	created_at: Date;
	updated_at: Date;
	forward: null;
	device_type_id: null;
	app_tracker_login: number;
	fuel_detect_sec_after_stop: number | null;
	lbs: null;
	fuel_type: null | string;
	fuel_emissions: number | null;
	users: User[];
	pivot: Pivot;
	icon: Icon;
	traccar: Traccar;
	lastValidLatitude: number;
	lastValidLongitude: number;
	latest_positions: null | string;
	icon_type: Type;
	enable: number;
	group_id: number;
	user_timezone_id: null;
	time: Date | null;
	course: number;
	speed: number;
}

export interface Icon {
	id: number;
	user_id: null;
	type: Type;
	order: number;
	width: number;
	height: number;
	path: Path;
	by_status: number;
}

export enum Path {
	AssetsImagesArrowACKPNG = 'assets/images/arrow-ack.png',
	ImagesDeviceIconsRotating1PNG = 'images/device_icons/rotating/1.png',
	ImagesDeviceIconsRotating2PNG = 'images/device_icons/rotating/2.png',
	ImagesDeviceIconsRotating3PNG = 'images/device_icons/rotating/3.png',
	ImagesDeviceIconsRotating5PNG = 'images/device_icons/rotating/5.png',
	ImagesDeviceIconsRotating7PNG = 'images/device_icons/rotating/7.png',
	ImagesDeviceIconsRotating8PNG = 'images/device_icons/rotating/8.png',
}

export enum Type {
	Arrow = 'arrow',
	Rotating = 'rotating',
}

export interface IconColors {
	moving: IconColor;
	stopped: IconColor;
	offline: IconColor;
	engine: IconColor;
	blocked?: Blocked;
}

export enum Blocked {
	Black = 'black',
}

export enum IconColor {
	Blue = 'blue',
	Green = 'green',
	Red = 'red',
	Yellow = 'yellow',
}

export interface Pivot {
	user_id: number;
	device_id: number;
	group_id: number;
	active: number;
	current_driver_id: null;
	timezone_id: null;
}

export enum TailColor {
	Ff1B99 = '#ff1b99',
	The33Cc33 = '#33cc33',
}

export interface Traccar {
	id: number;
	name: string;
	uniqueId: string;
	latestPosition_id: number | null;
	lastValidLatitude: number | null;
	lastValidLongitude: number | null;
	other: null | string;
	speed: null | string;
	time: Date | null;
	device_time: Date | null;
	server_time: Date | null;
	ack_time: Date | null;
	altitude: number | null;
	course: number | null;
	power: null;
	address: null;
	protocol: Protocol | null;
	latest_positions: null | string;
	moved_at: Date | null;
	stoped_at: Date | null;
	move_begin_at: Date | null;
	stop_begin_at: Date | null;
	parked_end_at: Date | null;
	engine_on_at: Date | null;
	engine_off_at: Date | null;
	engine_changed_at: Date | null;
	updated_at: Date | null;
	database_id: null;
}

export enum Protocol {
	Gps103 = 'gps103',
	Gt06 = 'gt06',
	Meiligao = 'meiligao',
	Ruptela = 'ruptela',
	Teltonika = 'teltonika',
}

export interface User {
	id: number;
	email: Email;
}

export enum Email {
	Demo3GmailCOM = 'demo3@gmail.com',
}

export enum DistanceUnitHour {
	Kph = 'kph',
}

export interface DriverData {
	id: null;
	user_id: null;
	device_id: null;
	name: string | null;
	rfid: null;
	phone: string | null;
	email: null;
	description: null;
	created_at: null;
	updated_at: null;
}

export type Online =
	| 'ack'
	| 'engine'
	| 'online' /* these means the tracker is ok */
	| 'offline'
	| 'expired';

export interface Sensor {
	id: number;
	type: DetectEngine;
	name: Name;
	show_in_popup: number;
	value: Address;
	val: boolean | null | string;
	scale_value: null;
	tag_name: TagName;
}

export enum Name {
	Ignition = 'Ignition',
	Igniton = 'Igniton',
	NameIGNITION = 'IGNITION',
	NameIgnition = 'ignition',
	PurpleIgnition = 'Ignition ',
}

export enum TagName {
	Batterylevel = 'batterylevel',
	Ignition = 'ignition',
	Motion = 'motion',
	TagNameIgnition = 'Ignition',
}

export interface Service {
	id: number;
	name: string;
	value: string;
	expiring: boolean;
	expiration_by: string;
}

export interface Tail {
	lat: string;
	lng: string;
}

export enum TimeEnum {
	Expired = 'Expired',
	NotConnected = 'Not connected',
}

export enum UnitOfAltitude {
	M = 'm',
}

export enum UnitOfCapacity {
	L = 'L',
}

export enum UnitOfDistance {
	KM = 'Km',
}

export type ForReport = Pick<
	TrackedVehicles,
	| 'name'
	| 'comment'
	| 'online'
	| 'tail'
	| 'lat'
	| 'lng'
	| 'stop_duration_sec'
	| 'moved_timestamp'
	| 'total_distance'
	| 'protocol'
> & {
	driver: Pick<DriverData, 'phone' | 'name'>;
} & { device_data: Pick<DeviceData, 'expiration_date' | 'created_at'> } & {
	traccar: Pick<
		Traccar,
		| 'moved_at'
		| 'stoped_at'
		| 'move_begin_at'
		| 'stop_begin_at'
		| 'parked_end_at'
		| 'engine_on_at'
		| 'engine_off_at'
		| 'engine_changed_at'
		| 'updated_at'
		| 'course'
		| 'speed'
	>;
} & { wrapped_status: TrackerStatusWrapperName };

// custom wrapper type for a wrapped tracker status
export type TrackerStatusWrapperName = 'Online' | 'Expired' | 'Offline';

export interface TrackerStatusMetaWrapper {
	proper_status: TrackerStatusWrapperName;
	prefered_color: 'green' | 'red' | 'yellow';
}

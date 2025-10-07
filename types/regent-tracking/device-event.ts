export interface DeviceEvent {
	id: number;
	user_id: number;
	device_id: number;
	geofence_id: any;
	poi_id: any;
	position_id: number;
	alert_id: number;
	type: string;
	message: string;
	address: any;
	altitude: number;
	course: number;
	latitude: number;
	longitude: number;
	power: any;
	speed: number;
	time: string;
	deleted: number;
	created_at: string;
	updated_at: string;
	additional: any;
	silent: any;
	name: string;
	detail: any;
	geofence: any;
	device_name: string;
}

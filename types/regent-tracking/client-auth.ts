export interface RegentTrackingLoginResponse {
	status: number;
	user_api_hash: string;
	permissions?: Permissions;
}

export interface Permissions {
	devices: Devices;
	beacons: Beacons;
	alerts: Alerts;
	events: Events;
	geofences: Geofences;
	routes: Routes;
	poi: Poi;
	reports: Reports;
	drivers: Drivers;
	custom_events: CustomEvents;
	user_gprs_templates: UserGprsTemplates;
	user_sms_templates: UserSmsTemplates;
	sms_gateway: SmsGateway;
	send_command: SendCommand;
	history: History;
	maintenance: Maintenance;
	camera: Camera;
	device_camera: DeviceCamera;
	tasks: Tasks;
	task_sets: TaskSets;
	chat: Chat;
	media_categories: MediaCategories;
	forwards: Forwards;
	'device.imei': DeviceImei;
	'device.sim_number': DeviceSimNumber;
	'device.forward': DeviceForward;
	'device.protocol': DeviceProtocol;
	'device.expiration_date': DeviceExpirationDate;
	'device.installation_date': DeviceInstallationDate;
	'device.sim_activation_date': DeviceSimActivationDate;
	'device.sim_expiration_date': DeviceSimExpirationDate;
	'device.msisdn': DeviceMsisdn;
	'device.device_model': DeviceDeviceModel;
	'device.plate_number': DevicePlateNumber;
	'device.registration_number': DeviceRegistrationNumber;
	'device.object_owner': DeviceObjectOwner;
	'device.vin': DeviceVin;
	'device.additional_notes': DeviceAdditionalNotes;
	'device.comment': DeviceComment;
	'device.custom_fields': DeviceCustomFields;
	'device.device_type_id': DeviceDeviceTypeId;
	'device.authentication': DeviceAuthentication;
	'device.model_id': DeviceModelId;
	'device.max_speed': DeviceMaxSpeed;
	'device.lbs': DeviceLbs;
	'device.tags': DeviceTags;
	sharing: Sharing;
	checklist_template: ChecklistTemplate;
	checklist: Checklist;
	checklist_activity: ChecklistActivity;
	checklist_qr_code: ChecklistQrCode;
	checklist_qr_pre_start_only: ChecklistQrPreStartOnly;
	checklist_optional_image: ChecklistOptionalImage;
	flights_info: FlightsInfo;
	device_configuration: DeviceConfiguration;
	device_route_types: DeviceRouteTypes;
	device_expenses: DeviceExpenses;
	call_actions: CallActions;
	tags: Tags;
	widget_template_webhook: WidgetTemplateWebhook;
	custom_device_add: CustomDeviceAdd;
	external_url: ExternalUrl;
	users: Users;
	'user.login_token': UserLoginToken;
	'user.client_id': UserClientId;
	'user.login_periods': UserLoginPeriods;
	'user.only_one_session': UserOnlyOneSession;
}

export interface Devices {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface Beacons {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface Alerts {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface Events {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface Geofences {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface Routes {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface Poi {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface Reports {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface Drivers {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface CustomEvents {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface UserGprsTemplates {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface UserSmsTemplates {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface SmsGateway {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface SendCommand {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface History {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface Maintenance {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface Camera {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceCamera {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface Tasks {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface TaskSets {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface Chat {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface MediaCategories {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface Forwards {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceImei {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceSimNumber {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceForward {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceProtocol {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceExpirationDate {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceInstallationDate {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceSimActivationDate {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceSimExpirationDate {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceMsisdn {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceDeviceModel {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DevicePlateNumber {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceRegistrationNumber {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceObjectOwner {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceVin {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceAdditionalNotes {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceComment {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceCustomFields {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceDeviceTypeId {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceAuthentication {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceModelId {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceMaxSpeed {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceLbs {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceTags {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface Sharing {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface ChecklistTemplate {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface Checklist {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface ChecklistActivity {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface ChecklistQrCode {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface ChecklistQrPreStartOnly {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface ChecklistOptionalImage {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface FlightsInfo {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceConfiguration {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceRouteTypes {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface DeviceExpenses {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface CallActions {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface Tags {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface WidgetTemplateWebhook {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface CustomDeviceAdd {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface ExternalUrl {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface Users {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface UserLoginToken {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface UserClientId {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface UserLoginPeriods {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

export interface UserOnlyOneSession {
	view: boolean;
	edit: boolean;
	remove: boolean;
}

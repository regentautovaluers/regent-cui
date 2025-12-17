export type AccidentSeverity = 'Minor' | 'Moderate' | 'Severe';

export interface AccidentAnalytics {
	deviceId: number;
	coords: AccidentLocationCoords | null;
	geoCodeLocation: string | null;
	time: string | null;
	speedBeforeCrash: number | null;
	speedUnits: 'Km/h' | 'Mi/h' | null;
	impactForce: number | null;
	severity: AccidentSeverity | null;
	weather?: string;
	harshBrakingBeforeCrash: boolean;
}

export interface AccidentLocationCoords {
	lat: number;
	lng: number;
}

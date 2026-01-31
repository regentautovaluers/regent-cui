import type { ValuationBooking } from '~/types/corporate-valuations/valuation-report';

export type FetchMode = 'SEARCH' | 'LIST';

export interface PaginationData {
	total_records?: string;
	total_pages?: number;
	current_page?: number;
	results_per_page?: number;
}

export type CleanedRearangedAndMapped = {
	paginationData: PaginationData;
	valuationData: ValuationBooking[];
};

export interface ValuationData {
	vehicle: Vehicle;
	client: Client;
	inspection: Inspection;
	valuation: Valuation;
	tyres: Tyres;
	extra_fittings: ExtraFittings;
	administration: Administration;
	bank: Bank;
	documents: Documents;
}

export interface Vehicle {
	registration_number: string;
	make: string;
	model: string;
	alternative_model: string;
	chassis_number: string;
	engine_number: string;
	colour: string;
	year_of_manufacture: string;
	engine_capacity: string;
	fuel_type: string;
	transmission: string;
	vehicle_type: string;
	vehicle_special_type: string;
	vehicle_usage: any;
	seats: any;
	rim_type: any;
	entry_year: any;
	country_of_origin: string;
	registration_date: string;
	serial_no: string;
	anti_theft: string;
	lights: string;
	airbags: string;
}

export interface Client {
	client_name: string;
	customer_name: string;
	id_no: string;
	kra_pin: string;
	email: string;
	policy_no: string;
	insurer: string;
	broker: string;
}

export interface Inspection {
	inspection_date: string;
	inspection_location: string;
	valuer_name: string;
	overall_condition: string;
	mechanical: string;
	electrical: string;
	coachwork: string;
	mechanical_notes: any;
	pre_accident_condition: string;
	remarks: string;
	remedy: string;
}

export interface Valuation {
	assessed_value: string;
	market_value: string;
	market_value_raw: string;
	forced_value: string;
	confirm_bank: string;
	confirm_bank_label: string;
	qc_manager_approval: string;
	branch_manager_approval: string;
	assess_count: string;
	valuer: string;
}

export interface Tyres {
	tyre_size: any;
	tyre_condition: string;
	tyre_wear_percent: any;
}

export interface ExtraFittings {
	extras: string;
	extra_fittings: any;
	extra_fittings_value: any;
	radio_value: string;
	radio_estimate: any;
	windscreen_value: string;
	windscreen_estimate: any;
}

export interface Administration {
	booking_no: string;
	record_id: string;
	branch: string;
	regent_branch: string;
	cross_branch: string;
	pending: string;
	fleet_id: string;
	add_date: string;
	box_no: string;
	nb: string;
	authority: string;
	secretary_approved: string;
}

export interface Bank {
	bank_officer: string;
	bank_officer_phone: string;
	bank_officer_email: string;
	corp_ref: string;
}

export interface Documents {
	valuation_pdf: string;
}

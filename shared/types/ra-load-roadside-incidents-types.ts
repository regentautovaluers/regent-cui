export interface IndividualRequestTypeSharedResponse {
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface GetIncidentsWrapper {
  towing: IndividualRequestTypeSharedResponse & {
    data: TowingEntry[];
  };
  fueldelivey: IndividualRequestTypeSharedResponse & {
    data: FuelDeliveryEntry[];
  };
  tyrechange: IndividualRequestTypeSharedResponse & {
    data: TyreChangeEntry[];
  };
  jumpstarting: IndividualRequestTypeSharedResponse & {
    data: FuelDeliveryEntry[];
  };
}

export type GetRoadsideRequestsServiceType =
  | "towing"
  | "fueldelivery"
  | "tyrechange"
  | "jumpstarting";

export type GetRoadsideRequestsServiceStatus =
  | "pending"
  | "completed"
  | "dispatched";

export interface SharedEntryDetails {
  id: number;
  user_id: string | null;
  user_name: string | null;
  user_phone: string | null;
  user_email: string | null;
  corporate_client: string;
  registration_no: string;
  vehicle_make: string | null;
  vehicle_model: string | null;
  remarks: string | null;
  date_created: string;
  driver_name_snapshot: string | null;
  driver_phone_snapshot: string | null;
  driver_vehicle_registration_snapshot: string | null;
  driver_vehicle_make_snapshot: string | null;
  driver_vehicle_model_snapshot: string | null;
  driver_photo_snapshot: string | null;
  confirmation_call_time: string | null;
  dispatch_time: string | null;
  arrival_time: string | null;
  completed: boolean;
  completion_time: string | null;
  reportLink: string | null;
  driver_rating: string | number | null;
  allocation_status: boolean;
  service_status: GetRoadsideRequestsServiceStatus;
  tracking_code: string;
  service: GetRoadsideRequestsServiceType;
  job_handled: boolean;
  duration: string | null;
  distance: number | null;
  cost: number | null;
  cost_fee: number | null;
  total_cost: number | null;
  extra_charges: number | null;
  payment_time: string | null;
}

export type IncidentLocation = {
  pickup_location: string;
  pickup_cordinates: CoordinatesPair;
};

export type DropoffDestination = {
  dropoff_location: string;
  dropoff_cordinates: CoordinatesPair;
};

export type TowingEntry = SharedEntryDetails &
  IncidentLocation &
  DropoffDestination & {
    current_free_distance: number;
    vehicle_class: string;
    vehicle_drop_off_time: any;
    billable_distance: any;
    driver_rating: any;
    payment: any;
    received_by: any;
  };

export type FuelDeliveryEntry = SharedEntryDetails &
  IncidentLocation & {
    fuel_type: any;
    fuel_amount: any;
    payment: any;
  };

export type TyreChangeEntry = SharedEntryDetails &
  IncidentLocation & {
    vehicle_class: string | number;
    tyre_type: string;
    has_spare: boolean;
    payment: any;
  };

export type JumpstartingEntry = SharedEntryDetails &
  IncidentLocation & {
    payment: any;
  };

export interface CoordinatesPair {
  latitude: number;
  longitude: number;
}

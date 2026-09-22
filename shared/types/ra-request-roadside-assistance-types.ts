export interface AvaVehicleTypes {
  id: number;
  description: string;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
  towingRate: TowingRate;
}

export interface TowingRate {
  id: number;
  freeDistance: number;
  threshHoldDistance: number;
  withinThreshHoldPrice: number;
  overThreshHoldPriceMembers: number;
  overThreshHoldPriceNonMembers: number;
  recordedBy: string;
  createdAt: string;
  updatedAt: string;
}

export type RoadsideAssistanceFixedServiceChargesServices =
  | "Jumpstarting"
  | "Fuel Delivery"
  | "Tyre Change";

export interface RoadsideAssistanceFixedServiceCharges {
  id: number;
  service_name: RoadsideAssistanceFixedServiceChargesServices;
  charge: string;
  createdAt: string;
  updatedAt: string;
  recordedBy: string;
}

export type SlimmedAvaVehicleTypes = {
  id: AvaVehicleTypes["id"];
  description: AvaVehicleTypes["description"];
  towingRateWithinThresholdPrice: TowingRate["withinThreshHoldPrice"];
  towingRateOverThresholdPriceNonMembers: TowingRate["overThreshHoldPriceNonMembers"];
  towingRateOverThresholdPriceMembers: TowingRate["overThreshHoldPriceMembers"];
  towingRateThresholdDistance: TowingRate["threshHoldDistance"];
};

export type RequestRoadsideAssistanceBackendServiceName =
  | "Tow"
  | "Fuel Delivery"
  | "Jumpstart"
  | "Tyre";

export interface RequestRoadsideAssitanceBase {
  appUserName: string;
  corporate_client: string;
  appUserPhone: string | null;
  appUserEmail: string | null;
  appServiceType: RequestRoadsideAssistanceBackendServiceName;
  appRegistration: string;
  vehicleMake: string;
  vehicleModel: string;
  appDuration: number;
  appCost: number;
  appPickupPoint: string;
  appPickupLat: number;
  requestRemarks: string;
}

export interface RequestRoadsideAssitanceSometimesVTC {
  vehicleType: number;
  vehicleClass: number;
}

export type RequestRoadsideAssitanceTowing = RequestRoadsideAssitanceBase & {
  appPickupLon: number;
  appDestinationPoint: string;
  appDestinationLat: number;
  appDestinationLon: number;
  appDistance: number;
  currentFreeDistance: number;
} & RequestRoadsideAssitanceSometimesVTC;

export type RequestRoadsideAssitanceFuelDelivery =
  RequestRoadsideAssitanceBase & {
    fuelType: string;
    fuelAmount: string;
  };

export type RequestRoadsideAssitanceTyreChange =
  RequestRoadsideAssitanceBase & {
    tyreType: string | null;
    hasSpareTyre: boolean | null;
  };

export type RequestRoadsideAssitanceJumpstarting =
  RequestRoadsideAssitanceBase & RequestRoadsideAssitanceSometimesVTC;

export type RequestRoadsideAssistanceMerged = RequestRoadsideAssitanceBase &
  RequestRoadsideAssitanceTowing &
  RequestRoadsideAssitanceFuelDelivery &
  RequestRoadsideAssitanceTyreChange &
  RequestRoadsideAssitanceJumpstarting;

export type PlaceCallback = (data: {
  id: number;
  label: string;
  lat: number;
  lng: number;
  name: string;
}) => void;

export type RoadRescueModes = "tow" | "fd" | "jstart" | "tyrec";
export type ActiveRequestMode = "tow" | "fd" | "jstart" | "tyrec";
export type TyreTypes = "tube" | "tubeless" | "unknown";
export type FuelTypes = "Diesel" | "Petrol";
export interface RoadRescueModesSelector {
  short: RoadRescueModes;
  long: String;
}

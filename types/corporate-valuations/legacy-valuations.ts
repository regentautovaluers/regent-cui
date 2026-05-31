export interface LegacyValuation {
  valuation_id: string
  booking_no: string
  booking_date: string
  inspection_date: string
  approval_date: string
  reg_no: string
  valuation_location: string
  inspection_note: any
  corp_org: CorpOrg
  regent_branch: RegentBranch | null
  valuation_type: ValuationType | null
  vehicle_value: VehicleValue
  vehicleMake: string
  vehicleType: string
  vehicleColor: string
  yearOfManufacture: string
  chassisNumber: string
  engineNumber: string
}

export interface CorpOrg {
  corp_id: string
  corp_name: string
  corp_class: string
  corp_email: string
  corp_phone: string
}

export interface RegentBranch {
  branch_id: string
  branch_name: string
}

export interface ValuationType {
  id: number
  valuation_type_name: string
}

export interface VehicleValue {
  market_value: any
  assessed_value: string
  forced_sale_value: any
  windscreen_value: string
  radio_value: any
  extras_value: string[]
  auction_value: any
}

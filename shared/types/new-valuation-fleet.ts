export interface FleetEntry {
  id: number;
  dateCreated?: string;
  bookedBy?: RegentUser & { phoneNumber: string };
  fleetName: string;
  startDate: string;
  endDate: string;
  fleetContactName?: string;
  fleetContactPhone?: string;
  corporateOrganization?: CorporateOrganization;
  policyNumber?: string;
  corporateContactName?: string;
  corporateContactPhone?: string;
  brokerOrganization?: CorporateOrganization;
  brokerContactName?: string;
  brokerContactPhone?: string;
  completionDate: any;
  vehiclesIssued?: any;
  vehiclesInProgress?: number;
  vehiclesCompleted: any;
  valuationType: ValuationType;
  assignedValuers?: RegentUser & { phoneNumber: string }[];
}

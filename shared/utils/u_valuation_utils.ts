import { censorString } from "./u_string";

export function cleanValuations(vb: ValuationBooking) {
  delete vb.bookingReversed;
  delete vb.draftCreationDate;
  delete vb.vehicleOwnership;
  delete vb.clientNatIdNumber;
  delete vb.kraPin;
  delete vb.vehicleType;
  delete vb.serviceCharge;
  delete vb.paymentMethod;
  delete vb.valuationLocation;
  delete vb.uploadedDocuments;
  delete vb.proposedValuationDate;
  delete vb.onBehalfOfRegentBranch;
  delete vb.onBehalfOfRegentBranch;
  delete vb.regentValuer;
  delete vb.regentBooker;
  delete vb.approvedByManager;
  delete vb.approvedByQc;
  delete vb.approvedBySecretary;
  delete vb.reportValidationToken;
  delete vb.inspectionFnl;

  // censor critical paths
  vb.clientEmail = censorString(vb.clientEmail, "CENTER");
}

export function cleanRegentBranches(rb: RegentBranch) {
  delete rb.branchEmail;
  delete rb.branchPhone;
  delete rb.branchLocation;
  delete rb.branchCode;
  delete rb.paymentPool;
  delete rb.paymentPoolType;
  delete rb.regentBranchCluster;
}

export function normalizeValuationBookingSource(
  source: ValuationBookingSource,
): string {
  if (source == "AUTHORITY_LETTER") {
    return "Authority Letter";
  }

  if (source == "FLEET_JOB") {
    return "Fleets";
  }

  if (source == "AVA") {
    return "AVA";
  }

  if (source == "GUEST") {
    return "Guest Platform";
  }

  if (
    ["SCHEDULE", "DUPLICATION", "CONTROL_ROOM", "ONE_HOUR_REQUEST"].includes(
      source,
    )
  ) {
    return "General Request";
  }

  return "-";
}

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

export function normalizeValuationStage(stage: ValuationStages | null): {
  wrapperName: string;
  wrapperStage: number;
} {
  const ret: {
    wrapperName: string;
    wrapperStage: number;
  } = { wrapperName: "Received", wrapperStage: 0 };

  if (!stage || stage == "SCHEDULED") return ret;

  if (["AWAITING_ASSESSMENT", "VALUER_DRAFT"].includes(stage)) {
    ((ret.wrapperName = "Awaiting Assessment"), (ret.wrapperStage = 1));
  }

  if (stage == "PENDING") {
    ((ret.wrapperName = "Validating KYCs"), (ret.wrapperStage = 2));
  }

  if (stage == "AWAITING_MANAGER_APPROVAL") {
    ((ret.wrapperName = "Computing Values"), (ret.wrapperStage = 3));
  }

  if (stage == "AWAITING_MANAGER_APPROVAL") {
    ((ret.wrapperName = "Proof-reading Report"), (ret.wrapperStage = 4));
  }

  if (["PENDING_REPORT", "INVOICING", "COMPLETED"].includes(stage)) {
    ((ret.wrapperName = "Proof-reading Report"), (ret.wrapperStage = 5));
  }

  return ret;
}

export function calculateTowingChargeNonMember(
  basePrice: number,
  distance: number,
  chargePerExtraKm: number,
): number {
  if (distance < 10) {
    return basePrice;
  }

  return Math.ceil(basePrice + (distance - 10) * chargePerExtraKm);
}

export function calculateTowingChargeMember(
  basePrice: number,
  distance: number,
  chargePerExtraKm: number,
  freeDistanceBenefit: number,
  thresholdDistance: number,
): number {
  if (freeDistanceBenefit <= 0) {
    if (distance < thresholdDistance) {
      return basePrice;
    } else {
      return Math.ceil(
        basePrice + (distance - thresholdDistance) * chargePerExtraKm,
      );
    }
  }

  const distanceAboveBenefit = distance - freeDistanceBenefit;
  if (distanceAboveBenefit >= 0) {
    return Math.ceil(0 + distanceAboveBenefit * chargePerExtraKm);
  } else {
    return 0;
  }
}

export function pickFixedServiceCharge(
  fixedCharges: RoadsideAssistanceFixedServiceCharges[],
  fixedServiceType: RoadsideAssistanceFixedServiceChargesServices,
) {
  return fixedCharges.find(
    (service) => service.service_name == fixedServiceType,
  )!;
}

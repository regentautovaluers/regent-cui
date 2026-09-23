import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import type { PublicRuntimeConfig } from "nuxt/schema";

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

export async function bindToLocation(
  pubConf: PublicRuntimeConfig,
  inputId: string,
  id: number,
  label: string,
  callback?: PlaceCallback,
) {
  setOptions({
    key: pubConf.GOOGLE_MAPS_API_KEY,
    v: "weekly",
  });

  const { Autocomplete } = await importLibrary("places");
  const input = document.getElementById(inputId) as HTMLInputElement;

  const options = {
    componentRestrictions: {
      country: pubConf.GOOGLE_MAPS_GEOFENCING_COUNTRY,
    },
    fields: ["address_components", "geometry", "name"],
    strictBounds: false,
  };

  const autocomplete = new Autocomplete(input, options);

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    const lat = place.geometry?.location?.lat()!;
    const lng = place.geometry?.location?.lng()!;
    const name = `${place.address_components![0].short_name} ${
      place.address_components![1].short_name
    }, ${place.address_components![2].short_name}`;

    if (callback) {
      callback({ id, label, lat, lng, name });
    }
  });
}

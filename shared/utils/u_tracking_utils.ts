import { IconColor, TimeEnum } from "../types/tracked-vehicles";

export function isDeviceSubscriptionExpired(vehicle: TrackedVehicles): boolean {
  return vehicle?.online == "offline" && vehicle?.timestamp == 0;
}

export function isVehicleOnline(vehicle: TrackedVehicles): boolean {
  return true;
}

export function deriveProperTrackerStatus(
  icon_color: IconColor,
): TrackerStatusMetaWrapper {
  switch (icon_color) {
    case IconColor.Blue:
    case IconColor.Green:
      return {
        proper_status: "Active",
        prefered_color: "success",
      };

    case IconColor.Red:
      return {
        proper_status: "Offline",
        prefered_color: "error",
      };

    case IconColor.Yellow:
      return {
        proper_status: "Offline",
        prefered_color: "warning",
      };
  }
}

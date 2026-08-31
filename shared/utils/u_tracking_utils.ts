import { IconColor, TimeEnum } from "../types/tracked-vehicles";

export function isDeviceSubscriptionExpired(vehicle: TrackedVehicles): boolean {
  return vehicle?.online == "offline" && vehicle?.timestamp == 0;
}

export function isVehicleOnline(vehicle: TrackedVehicles): boolean {
  return true;
}

export function deriveProperTrackerStatus(
  tracker_status: VehicleOnlineStatus,
  device_exp_date: string | null,
): TrackerStatusWrapperName {
  // check for expired ones first
  if (device_exp_date) {
    if (isExpired(device_exp_date)) return "Expired";
  }

  // check for online ones
  if (["ack", "engine", "online"].includes(tracker_status)) return "Online";

  return "Offline";
}

function isExpired(input: string | null): boolean {
  // specific to tracking
  if (input === null) return false;

  // "YYYY-MM-DD HH:mm:ss" → Date
  const [datePart, timePart] = input.split(" ");
  const [y, m, d] = datePart!.split("-").map(Number);
  const [hh, mm, ss] = timePart!.split(":").map(Number);

  const inputDate = new Date(y as number, (m as number) - 1, d, hh, mm, ss);

  const today = new Date();
  const normalizedToday = new Date(today.setHours(0, 0, 0, 0));
  const normalizedInput = new Date(inputDate.setHours(0, 0, 0, 0));

  return normalizedToday > normalizedInput;
}

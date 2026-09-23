export function determineEndpointSuffix(
  requestType: RequestRoadsideAssistanceBackendServiceName,
) {
  switch (requestType) {
    case "Tow":
      return "towingRequest";
    case "Jumpstart":
      return "jumpstartingRequest";
    case "Fuel Delivery":
      return "fuelDeliveryRequest";
    case "Tyre":
      return "tyreChangeRequest";
    default:
      return "";
  }
}

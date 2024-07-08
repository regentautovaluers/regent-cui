export default function () {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const route = useRoute();
	const { openToast } = useToast();

	const determineEndpointVar = (): string => {
		if (route.name === "ava-towing") {
			return "towingRequest";
		} else if (route.name === "ava-jumpstarting") {
			return "jumpstartingRequest";
		} else if (route.name === "ava-fuel-delivery") {
			return "fuelDeliveryRequest";
		} else if (route.name === "ava-tyre-change") {
			return "tyreChangeRequest";
		}
		return "";
	};

	const makeServiceRequest = async (
		userName: string,
		userPhoneNumber: string,
		userEmail: string,
		serviceType: string,
		vehicleRegistration: string,
		vehicleMake: string,
		vehicleModel: string,
		arrivalDuration: number,
		arrivalDistance: number,
		serviceCost: number,
		pickupPoint: string,
		pickupLatitude: number,
		pickupLongitude: number,
		destinationPoint: string,
		destinationLongitude: number,
		destinationLatitude: number,
		requestRemarks: string | null,
		vehicleClass: string | null,
		fuelType: string | null,
		fuelAmount: number | null,
		tyreType: string | null,
		hasSpareTyre: boolean | null
	) => {
		try {
			await $fetch(`/api/v1/mobile/${determineEndpointVar()}`, {
				baseURL: runtimeConfig.public.AVA_BASE_URL,
				method: "POST",
				body: JSON.stringify({
					appUserName: userName,
					corporate_client: getPrincipal.value.corpId,
					appUserPhone: userPhoneNumber,
					...(userEmail !== undefined
						? { appUserEmail: userEmail }
						: {}),
					appServiceType: serviceType,
					appRegistration: vehicleRegistration,
					vehicle_make: vehicleMake,
					vehicle_model: vehicleModel,
					appDuration: arrivalDuration,
					appDistance: arrivalDistance,
					appCost: serviceCost,
					appPickupPoint: pickupPoint,
					appPickupLat: pickupLatitude,
					appPickupLon: pickupLongitude,
					appDestinationPoint: destinationPoint,
					appDestinationLat: destinationLatitude,
					appDestinationLon: destinationLongitude,
					...(vehicleClass !== null
						? { vehicleClass: vehicleClass }
						: {}),
					...(requestRemarks !== null
						? { appRemarks: requestRemarks }
						: {}),
					...(fuelType !== null ? { appFuelType: fuelType } : {}),
					...(fuelAmount !== null
						? { appFuelAmount: fuelAmount }
						: {}),
					...(tyreType !== null ? { tyreType: tyreType } : {}),
					...(hasSpareTyre !== null
						? { hasSpareTyre: hasSpareTyre }
						: {}),
				}),

				async onResponse({ response }) {
					if (response.status !== 201) {
						throw new Error("Request failed to go through!");
					} else {
						openToast(
							`${serviceType} request succesfully went through!`,
							"success"
						);
					}
				},
			});
		} catch (error) {
			console.log("Service request error encountered. Reason: ", error);
			openToast(`${serviceType} request failed to go thorugh!`, "danger");
		}
	};

	return { makeServiceRequest, determineEndpointVar };
}

export default function () {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const route = useRoute();
	async function makeServiceRequest(
		endpointVarName: string,
		userName: string,
		userPhoneNumber: string,
		userEmail: string,
		serviceType: string,
		vehicleRegistration: string,
		vehicleMake: string,
		vehicleModel: string,
		category: number,
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
	) {
		try {
			await $fetch(`/api/v1/mobile/${endpointVarName}`, {
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
					appCategory: category,
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
						throw new Error("Member details not updated.");
					} else {
						return;
					}
				},
			});
		} catch (error) {
			console.log("Service request error encountered. Reason: ", error);
			throw new Error("Service request not made!");
		}
	}

	function determineEndpointVar(): string {
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
	}

	return { makeServiceRequest, determineEndpointVar };
}

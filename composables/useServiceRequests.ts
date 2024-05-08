export default function () {
	const runtimeConfig = useRuntimeConfig();
	const { getDetails } = usePrincipal();
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
			await $fetch(
				`${runtimeConfig.public.DEV_TIME_HOST}/api/v1/mobile/${endpointVarName}`,
				{
					method: "POST",
					body: JSON.stringify({
						appUserName: userName,
						corporate_client: getDetails.company,
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
							console.log("Making duplicate request...");
							await $fetch(
								`${runtimeConfig.public.AVA_BASE_URL}/Dispatch/websiteCreate`,
								{
									method: "POST",
									headers: {
										"Content-Type":
											"application/x-www-form-urlencoded",
									},
									query: {
										appUserName: userName,
										corporate_client: getDetails.company,
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
										...(fuelType !== null
											? { appFuelType: fuelType }
											: {}),
										...(fuelAmount !== null
											? { appFuelAmount: fuelAmount }
											: {}),
										...(tyreType !== null
											? { tyreType: tyreType }
											: {}),
										...(hasSpareTyre !== null
											? { hasSpareTyre: hasSpareTyre }
											: {}),
									},

									async onResponse({ response }) {
										if (response.status == 200) {
											return;
										}
									},
								}
							);
						}
					},
				}
			);
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

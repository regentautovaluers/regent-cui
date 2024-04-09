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
		fuelAmount: number | null
	) {
		console.log(
			"Provided data: ",
			JSON.stringify(
				{
					appUserName: userName,
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
					appRemarks: requestRemarks,
					...(vehicleClass !== null
						? { vehicleClass: vehicleClass }
						: {}),
					...(fuelType !== undefined
						? { appFuelType: fuelType }
						: {}),
					...(fuelAmount !== undefined
						? { appFuelAmount: fuelAmount }
						: {}),
				},
				null,
				2
			)
		);

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
					}),

					async onResponse({ response }) {
						console.log(
							"Make service response body: ",
							response._data
						);
						console.log(
							"Make service response status: ",
							response.status
						);
						if (response.status !== 200) {
							throw new Error("Member details not updated.");
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
		}

		return "";
	}

	return { makeServiceRequest, determineEndpointVar };
}

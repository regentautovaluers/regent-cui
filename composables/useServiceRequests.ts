export default function () {
	const runtimeConfig = useRuntimeConfig();
	async function makeServiceRequest(
		userName: string,
		userPhoneNumber: string,
		userEmail: string,
		serviceType: string,
		vehicleRegistration: string,
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
		fuelType: string | null,
		fuelAmount: number | null
	) {
		/*
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
					appCategory: category,
					appDuration: `${arrivalDuration} mins`,
					appDistance: `${arrivalDistance} km`,
					appCost: serviceCost,
					appPickupPoint: pickupPoint,
					appPickupLat: pickupLatitude,
					appPickupLon: pickupLongitude,
					appDestinationPoint: destinationPoint,
					appDestinationLat: destinationLatitude,
					appDestinationLon: destinationLongitude,
					appRemarks: requestRemarks,
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
		*/

		try {
			await $fetch(
				`${runtimeConfig.public.AVA_BASE_URL}/Dispatch/websiteCreate`,
				{
					method: "POST",
					query: {
						appUserName: userName,
						appUserPhone: userPhoneNumber,
						...(userEmail !== undefined
							? { appUserEmail: userEmail }
							: {}),
						appServiceType: serviceType,
						appRegistration: vehicleRegistration,
						appCategory: category,
						appDuration: `${arrivalDuration} mins`,
						appDistance: `${arrivalDistance} km`,
						appCost: serviceCost,
						appPickupPoint: pickupPoint,
						appPickupLat: pickupLatitude,
						appPickupLon: pickupLongitude,
						appDestinationPoint: destinationPoint,
						appDestinationLat: destinationLatitude,
						appDestinationLon: destinationLongitude,
						...(requestRemarks !== null
							? { appRemarks: requestRemarks }
							: {}),
						...(fuelType !== null ? { appFuelType: fuelType } : {}),
						...(fuelAmount !== null
							? { appFuelAmount: fuelAmount }
							: {}),
					},

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

	return { makeServiceRequest };
}

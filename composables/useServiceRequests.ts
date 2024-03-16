export default function () {
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
		try {
			await $fetch("https://app.ava.ke/Dispatch/websiteCreate", {
				method: "POST",
				query: {
					appUserName: userName,
					appUserPhone: userPhoneNumber,
					appUserEmail: userEmail,
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
					...(requestRemarks !== null ? { appRemarks: requestRemarks } : {}),
					...(fuelType !== null
						? { appFuelType: fuelType }
						: {}),
					...(fuelAmount !== null
						? { appFuelAmount: fuelAmount }
						: {}),
				},

				async onResponse({ response }) {
					console.log("Make service response body: ", response._data);
					console.log(
						"Make service response status: ",
						response.status
					);
					// if (response.status !== 200) {
					// 	throw new Error("Member details not updated.");
					// }

					// TODO: Return user back to the page they were on before they came here
				},
			});
		} catch (error) {
			console.log("Error encountered. Reason: ", error);
		}
		*/
		console.log(
			"Provided data: ",
			JSON.stringify(
				{
					appUserName: userName,
					appUserPhone: userPhoneNumber,
					appUserEmail: userEmail,
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
	}

	return { makeServiceRequest };
}

export default function () {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const route = useRoute();
	const { openToast } = useToast();
	const formSubmissionLoading = ref(false);
	const vehicleSearchLoading: Ref<boolean> = ref(false);

	// fields related to the service request
	const freeDistanceLeftForTowing: Ref<number> = ref(0);
	const vehicleRegistration: Ref<string> = ref("");
	const vehicleMake: Ref<string> = ref("");
	const vehicleModel: Ref<string> = ref("");
	const vehicleTypeIndex: Ref<number> = ref(0);
	const userName: Ref<string> = ref("");
	const userPhoneNumber: Ref<string> = ref("");
	const userEmail: Ref<string | null> = ref(null);
	const requestRemarks: Ref<string | null> = ref(null);
	const arrivalDuration: Ref<number> = ref(10);
	const vehicleClass: Ref<string | null> = ref(null);
	const fuelType: Ref<string | null> = ref(null);
	const fuelAmount: Ref<number | null> = ref(null);
	const haveSpareTyre: Ref<boolean> = ref(true);
	const tyreType: Ref<string> = ref("");
	const staticServiceCost: ComputedRef<number> = computed(() => {
		if (serviceCharges.value) {
			switch (route.name) {
				case "ava-jumpstarting":
					return pickServiceToSourceCharge(
						serviceCharges.value,
						"Jumpstarting"
					).charge;
				case "ava-fuel-delivery":
					return pickServiceToSourceCharge(
						serviceCharges.value,
						"Fuel Delivery"
					).charge;
				case "ava-tyre-change":
					return pickServiceToSourceCharge(
						serviceCharges.value,
						"Tyre Change"
					).charge;
			}
		} else {
			return 0;
		}
	});
	const {
		pickupLatitude,
		pickupLongitude,
		destinationLongitude,
		destinationLatitude,
		pickupPointName,
		dropOffPointName,
	} = useLocationUtils();
	const currentPercentage: ComputedRef<number> = computed(() => {
		return (freeDistanceLeftForTowing.value * 100) / 20;
	});

	// load the towing price charges
	const {
		pending: loadingVehicleTypes,
		error: loadVehicleTypesError,
		data: vehicleTypes,
		refresh: refreshVehicleTypes,
	} = useFetch("/api/v1/control-unit/vehicle-types", {
		baseURL: runtimeConfig.public.AVA_BASE_URL,
		method: "GET",
		headers: {
			Accept: "application/json",
		},
		server: false,
		lazy: true,
	}) as any;

	// load the charges for other services
	const { data: serviceCharges } = useFetch("/api/v1/control-unit/services", {
		baseURL: runtimeConfig.public.AVA_BASE_URL,
		method: "GET",
		headers: {
			Accept: "application/json",
		},
		server: false,
		lazy: false,
	}) as any;

	const searchVehicleRegistration = async (): Promise<void> => {
		try {
			vehicleSearchLoading.value = true;

			await $fetch("/api/v1/bookings", {
				baseURL: runtimeConfig.public.AVA_BASE_URL,
				method: "GET",
				query: {
					registration: vehicleRegistration.value,
					corporateId: getPrincipal.value.corpId,
				},
				async onResponse({ response }) {
					if (response.status === 404) {
						openToast("Registration not found!", "warning");
						vehicleRegistration.value = "";
						return;
					}

					const registrationDetails = response._data;
					vehicleRegistration.value =
						registrationDetails.membershipVehicle.registration;
					userName.value = registrationDetails.membership.full_name;
					userPhoneNumber.value =
						registrationDetails.membership.phone_number;
					userEmail.value = registrationDetails.membership.userEmail;
					vehicleMake.value =
						registrationDetails.membershipVehicle.make;
					vehicleModel.value =
						registrationDetails.membershipVehicle.model;
					freeDistanceLeftForTowing.value = registrationDetails
						.membershipVehicle.available_free_distance
						? 20
						: (registrationDetails.membershipVehicle
								.available_free_distance as number);
				},
			});
		} catch (error) {
			console.log("An error occured: ", error);
			openToast("Search failed. Please try again!", "danger");
		} finally {
			vehicleSearchLoading.value = false;
		}
	};

	const makeServiceRequest = async (
		serviceCost: number,
		backendServiceName: string,
		towingDistance?: number
	) => {
		try {
			await $fetch(`/api/v1/mobile/${determineEndpointVar()}`, {
				baseURL: runtimeConfig.public.AVA_BASE_URL,
				method: "POST",
				body: JSON.stringify({
					appUserName: userName.value,
					corporate_client: getPrincipal.value.corpId,
					appUserPhone: userPhoneNumber.value,
					...(userEmail.value !== undefined
						? { appUserEmail: userEmail.value }
						: {}),
					appServiceType: backendServiceName,
					appRegistration: vehicleRegistration.value,
					vehicle_make: vehicleMake.value,
					vehicle_model: vehicleModel.value,
					appDuration: arrivalDuration.value,
					appDistance: towingDistance,
					appCost: serviceCost,
					appPickupPoint: pickupPointName.value,
					appPickupLat: pickupLatitude.value,
					appPickupLon: pickupLongitude.value,
					appDestinationPoint: dropOffPointName.value,
					appDestinationLat: destinationLatitude.value,
					appDestinationLon: destinationLongitude.value,
					...(vehicleClass.value !== null
						? { vehicleClass: vehicleClass.value }
						: {}),
					...(requestRemarks.value !== null
						? { appRemarks: requestRemarks.value }
						: {}),
					...(fuelType.value !== null
						? { appFuelType: fuelType.value }
						: {}),
					...(fuelAmount.value !== null
						? { appFuelAmount: fuelAmount.value }
						: {}),
					...(tyreType.value !== null
						? { tyreType: tyreType.value }
						: {}),
					...(haveSpareTyre !== null
						? { hasSpareTyre: haveSpareTyre.value }
						: {}),
				}),

				async onResponse({ response }) {
					if (response.status !== 201) {
						throw new Error("Request failed to go through!");
					} else {
						openToast(
							`${backendServiceName} request succesfully went through!`,
							"success"
						);
					}
				},
			});
		} catch (error) {
			console.log("Service request error encountered. Reason: ", error);
			openToast(
				`${backendServiceName} request failed to go thorugh!`,
				"danger"
			);
		}
	};

	const determineEndpointVar = (): string => {
		switch (route.name) {
			case "ava-towing":
				return "towingRequest";
			case "ava-jumpstarting":
				return "jumpstartingRequest";
			case "ava-fuel-delivery":
				return "fuelDeliveryRequest";
			case "ava-tyre-change":
				return "tyreChangeRequest";
			default:
				return "";
		}
	};

	const pickServiceToSourceCharge: any = (
		services: any[],
		searchKey: string
	) => {
		const foundService = services.find((service) => {
			service.service_name = searchKey;
			return service;
		});
		return foundService;
	};

	return {
		vehicleRegistration,
		vehicleMake,
		vehicleModel,
		vehicleTypeIndex,
		userName,
		userPhoneNumber,
		userEmail,
		formSubmissionLoading,
		vehicleSearchLoading,
		loadingVehicleTypes,
		currentPercentage,
		freeDistanceLeftForTowing,
		vehicleTypes,
		pickupLatitude,
		pickupLongitude,
		destinationLongitude,
		destinationLatitude,
		pickupPointName,
		dropOffPointName,
		requestRemarks,
		arrivalDuration,
		vehicleClass,
		fuelType,
		fuelAmount,
		haveSpareTyre,
		tyreType,
		staticServiceCost,
		makeServiceRequest,
		searchVehicleRegistration,
	};
}

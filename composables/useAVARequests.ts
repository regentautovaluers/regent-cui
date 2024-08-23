import { useGeolocation } from '@vueuse/core';
import { type LocationCoords, type MapCoordsMarker } from '~/types';
import { Loader } from '@googlemaps/js-api-loader';

export const useClientGeolocation = () => {
	const { coords, locatedAt, error } = useGeolocation();
	const route = useRoute();
	const clientCoordinates: LocationCoords = reactive({
		lat: Number(route.query.client_lat),
		lng: Number(route.query.client_lng),
	});

	return {
		coords,
		locatedAt,
		error,
		clientCoordinates,
	};
};

export const useRoadsideAssistanceRequests = (callback?: (pinCoords: MapCoordsMarker) => void) => {
	const runtimeConfig = useRuntimeConfig();
	const { getPrincipal } = useAuth();
	const route = useRoute();
	// const { openToast } = useToast();
	const formSubmissionLoading = ref(false);
	const vehicleSearchLoading: Ref<boolean> = ref(false);

	// fields related to the service request
	const freeDistanceLeftForTowing: Ref<number> = ref(0);
	const isMemberUnderEA: Ref<boolean | null> = ref(null);
	const vehicleRegistration: Ref<string> = ref('');
	const vehicleMake: Ref<string> = ref('');
	const vehicleModel: Ref<string> = ref('');
	const vehicleTypeIndex: Ref<number> = ref(0);
	const userName: Ref<string> = ref('');
	const userPhoneNumber: Ref<string> = ref('');
	const userEmail: Ref<string | null> = ref(null);
	const requestRemarks: Ref<string | null> = ref(null);
	const arrivalDuration: Ref<number> = ref(10);
	const vehicleClass: Ref<number | null> = ref(null);
	const fuelType: Ref<string | null> = ref(null);
	const fuelAmount: Ref<number | null> = ref(null);
	const haveSpareTyre: Ref<boolean> = ref(true);
	const tyreType: Ref<string> = ref('');
	const staticServiceCost: ComputedRef<number> = computed(() => {
		if (serviceCharges.value) {
			switch (route.name) {
				case 'ra-jumpstarting-request':
					return pickServiceToSourceCharge(serviceCharges.value, 'Jumpstarting').charge;
				case 'ra-fueldelivery-request':
					return pickServiceToSourceCharge(serviceCharges.value, 'Fuel Delivery').charge;
				case 'ra-tyrechange-request':
					return pickServiceToSourceCharge(serviceCharges.value, 'Tyre Change').charge;
			}
		} else {
			return 0;
		}
	});
	const pickupPointName = ref('');
	const dropOffPointName = ref('');
	const pickupLatitude: Ref<number> = ref(Number.NEGATIVE_INFINITY);
	const pickupLongitude: Ref<number> = ref(Number.NEGATIVE_INFINITY);
	const destinationLatitude: Ref<number> = ref(Number.NEGATIVE_INFINITY);
	const destinationLongitude: Ref<number> = ref(Number.NEGATIVE_INFINITY);
	const currentPercentage: ComputedRef<number> = computed(() => {
		return (freeDistanceLeftForTowing.value * 100) / 20;
	});

	// load the towing price charges
	const {
		pending: loadingVehicleTypes,
		error: loadVehicleTypesError,
		data: vehicleTypes,
		refresh: refreshVehicleTypes,
	} = useFetch('/api/v1/control-unit/vehicle-types', {
		baseURL: runtimeConfig.public.AVA_BASE_URL,
		method: 'GET',
		headers: {
			Accept: 'application/json',
		},
		server: false,
		lazy: true,
	}) as any;

	// load the charges for other services
	const { data: serviceCharges } = useFetch('/api/v1/control-unit/services', {
		baseURL: runtimeConfig.public.AVA_BASE_URL,
		method: 'GET',
		headers: {
			Accept: 'application/json',
		},
		server: false,
		lazy: false,
	}) as any;

	const bindToDropOffLocation = async () => {
		const loader = new Loader({
			apiKey: runtimeConfig.app.GOOGLE_MAPS_APIKEY,
			version: 'weekly',
		});

		const Places = await loader.importLibrary('places');
		const input = document.getElementById('dropoff-location') as HTMLInputElement;
		const options = {
			// types: ["establishment"],
			componentRestrictions: {
				country: runtimeConfig.public.GOOGLE_MAPS_GEOFENCING_COUNTRY as string,
			},
			fields: ['address_components', 'geometry', 'name'],
			strictBounds: false,
		};
		const autocomplete = new Places.Autocomplete(input, options);
		autocomplete.addListener('place_changed', () => {
			const place = autocomplete.getPlace();
			destinationLatitude.value = place.geometry?.location?.lat()!;
			destinationLongitude.value = place.geometry?.location?.lng()!;
			dropOffPointName.value = `${
				place.address_components![0].short_name
			} ${place.address_components![1].short_name}, ${
				place.address_components![2].short_name
			}`;

			if (callback) {
				callback({
					id: 2,
					label: "Client's Destination",
					lat: destinationLatitude.value,
					lng: destinationLongitude.value,
				});
			}
		});
	};

	const bindToPickUpLocation = async () => {
		const loader = new Loader({
			apiKey: runtimeConfig.app.GOOGLE_MAPS_APIKEY,
			version: 'weekly',
		});
		const Places = await loader.importLibrary('places');
		const input = document.getElementById('client-location') as HTMLInputElement;
		const options = {
			// types: ["establishment"],
			componentRestrictions: {
				country: runtimeConfig.public.GOOGLE_MAPS_GEOFENCING_COUNTRY as string,
			},
			fields: ['address_components', 'geometry', 'name'],
			strictBounds: false, //optional
		};
		const autocomplete = new Places.Autocomplete(input, options);

		autocomplete.addListener('place_changed', () => {
			const place = autocomplete.getPlace();

			pickupLatitude.value = place.geometry?.location?.lat()!;
			pickupLongitude.value = place.geometry?.location?.lng()!;

			pickupPointName.value = `${
				place.address_components![0].short_name
			} ${place.address_components![1].short_name}, ${
				place.address_components![2].short_name
			}`;

			if (callback) {
				callback({
					id: 1,
					label: "Client's Location",
					lat: pickupLatitude.value,
					lng: pickupLongitude.value,
				});
			}
		});
	};

	const searchVehicleRegistration = async (): Promise<void> => {
		try {
			vehicleSearchLoading.value = true;

			await $fetch('/api/v1/bookings', {
				baseURL: runtimeConfig.public.AVA_BASE_URL,
				method: 'GET',
				query: {
					registration: vehicleRegistration.value,
					corporateId: getPrincipal.value.corpId,
				},
				async onResponse({ response }) {
					if (response.status === 404) {
						// openToast('Registration not found!', 'warning');
						vehicleRegistration.value = '';
						return;
					}

					const registrationDetails = response._data;
					vehicleRegistration.value = registrationDetails.membershipVehicle.registration;
					userName.value = registrationDetails.membership.full_name;
					userPhoneNumber.value = registrationDetails.membership.phone_number;
					userEmail.value = registrationDetails.membership.userEmail;
					vehicleMake.value = registrationDetails.membershipVehicle.make;
					vehicleModel.value = registrationDetails.membershipVehicle.model;

					// if there is a non-null free distance
					if (registrationDetails.membershipVehicle.available_free_distance) {
						freeDistanceLeftForTowing.value = registrationDetails.membershipVehicle
							.available_free_distance as number;
						// and that the request is for a member who is under roadside assistance
						isMemberUnderEA.value = false;
					} else {
						freeDistanceLeftForTowing.value = 0;

						// the request is for a member but is under emergency evacuation
						isMemberUnderEA.value = true;
					}
				},
			});
		} catch (error) {
			console.log('An error occured: ', error);
			// openToast('Search failed. Please try again!', 'danger');
		} finally {
			vehicleSearchLoading.value = false;
		}
	};

	const makeServiceRequest = async (
		serviceCost: number,
		backendServiceName: string,
		towingDistance?: number,
	) => {
		try {
			await $fetch(`/api/v1/mobile/${determineEndpointVar()}`, {
				baseURL: runtimeConfig.public.AVA_BASE_URL,
				method: 'POST',
				body: JSON.stringify({
					appUserName: userName.value,
					corporate_client: getPrincipal.value.corpId,
					appUserPhone: userPhoneNumber.value,
					...(userEmail.value !== undefined ? { appUserEmail: userEmail.value } : {}),
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
					currentFreeDistance: freeDistanceLeftForTowing.value,
					...(vehicleTypeIndex.value !== null
						? {
								vehicleType: vehicleTypeIndex.value,
							}
						: {}),
					...(vehicleClass.value !== null
						? { vehicleClass: `${vehicleClass.value}` }
						: {}),
					...(requestRemarks.value !== null ? { appRemarks: requestRemarks.value } : {}),
					...(fuelType.value !== null ? { appFuelType: fuelType.value } : {}),
					...(fuelAmount.value !== null ? { appFuelAmount: fuelAmount.value } : {}),
					...(tyreType.value !== null ? { tyreType: tyreType.value } : {}),
					...(haveSpareTyre !== null ? { hasSpareTyre: haveSpareTyre.value } : {}),
				}),

				async onResponse({ response }) {
					if (response.status !== 201) {
						throw new Error('Request failed to go through!');
					} else {
						// openToast(
						// 	`${backendServiceName} request succesfully went through!`,
						// 	'success',
						// );
					}
				},
			});
		} catch (error) {
			console.log('Service request error encountered. Reason: ', error);
			// openToast(`${backendServiceName} request failed to go thorugh!`, 'danger');
		}
	};

	const determineEndpointVar = (): string => {
		switch (route.name) {
			case 'ra-towing-request':
				return 'towingRequest';
			case 'ra-jumpstarting-request':
				return 'jumpstartingRequest';
			case 'ra-fueldelivery-request':
				return 'fuelDeliveryRequest';
			case 'ra-tyrechange-request':
				return 'tyreChangeRequest';
			default:
				return '';
		}
	};

	const pickServiceToSourceCharge: any = (services: any[], searchKey: string) => {
		return services.find((service) => service.service_name === searchKey);
	};

	const calculateTowingChargeNonMember = (
		basePrice: number,
		distance: number,
		chargePerExtraKm: number,
	): number => {
		if (distance < 10) {
			return basePrice;
		}

		return Math.ceil(basePrice + (distance - 10) * chargePerExtraKm);
	};

	const calculateTowingChargeMember = (
		basePrice: number,
		distance: number,
		chargePerExtraKm: number,
		freeDistanceBenefit: number,
		thresholdDistance: number,
	): number => {
		if (freeDistanceBenefit <= 0) {
			if (distance < thresholdDistance) {
				return basePrice;
			} else {
				return Math.ceil(basePrice + (distance - thresholdDistance) * chargePerExtraKm);
			}
		}

		const distanceAboveBenefit = distance - freeDistanceBenefit;
		if (distanceAboveBenefit >= 0) {
			return Math.ceil(0 + distanceAboveBenefit * chargePerExtraKm);
		} else {
			return 0;
		}
	};

	const renderElementForService = (currentRouteName: string): boolean => {
		return currentRouteName === route.name;
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
		isMemberUnderEA,
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
		calculateTowingChargeMember,
		calculateTowingChargeNonMember,
		renderElementForService,
		bindToDropOffLocation,
		bindToPickUpLocation,
	};
};

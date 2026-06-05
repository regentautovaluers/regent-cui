import type { IndividualMemberRegistrationRequest } from '~/types/ava-roadside-assistance/member-registration';

export default defineEventHandler(async (event) => {
	const { AVA_BASE_URL } = useRuntimeConfig();

	const body: IndividualMemberRegistrationRequest = await readBody(event);
	// extract the vehicles
	const vehicles = body.vehicles;
	try {
		// start by registering the user
		const registerUserEndpoint = `${AVA_BASE_URL}/api/v1/memberships`;
		delete body.vehicles;
		const registerUserResponse = await makeProxyRequest<{ id: number }>(
			registerUserEndpoint,
			{
				method: 'POST',
				body,
			},
			event,
		);

		// then registering the vehicles
		const registerVehiclesEndpoint = `${AVA_BASE_URL}/api/v1/membershipVehicles`;
		await makeProxyRequest(
			registerVehiclesEndpoint,
			{
				method: 'POST',
				body: {
					membershipId: registerUserResponse.id,
					vehicles,
				},
			},
			event,
		);

		// return a success response
		return sendSuccessResponse(event, null);
	} catch (err) {
		return sendErrorResponse(event, err);
	}
});

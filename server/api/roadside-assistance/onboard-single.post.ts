export default defineEventHandler(async (event) => {
  const { AVA_BASE_URL } = useRuntimeConfig();
  const body: SingleAVAMemberRegistration = await readBody(event);

  /**
   * Two endpoints are called when registering members - one for saving the member
   * and another for saving the member's vehicles, called in-order
   */

  const registerMemberURL = `${AVA_BASE_URL}/api/v1/memberships`; // endpoint to register member
  const registerVehiclesURL = `${AVA_BASE_URL}/api/v1/membershipVehicles`;

  try {
    /**
     * Endpoint call 1: register member
     */
    const membershipId = await makeProxyRequest<{ id: number }>(
      registerMemberURL,
      event,
      {
        method: "POST",
        body: JSON.stringify(body.member),
      },
    );

    /**
     * Endpoint call 2: register vehicles
     */
    await makeProxyRequest(registerVehiclesURL, event, {
      method: "POST",
      body: JSON.stringify({
        membershipId: membershipId.id,
        vehicles: body.vehicles,
      }),
    });
  } catch (err) {
    return sendErrorResponse(event);
  }
});

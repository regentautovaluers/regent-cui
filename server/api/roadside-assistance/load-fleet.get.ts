export default defineEventHandler(async (event) => {
  const { AVA_BASE_URL } = useRuntimeConfig();
  const cookies = parseCookies(event);
  const data: LoginResponse = await inflatePrincipal(cookies);
  const requestURL = `${AVA_BASE_URL}/api/v1/fleets/corporate/${data.corpId}`;

  try {
    let response = await makeProxyRequest<AVAAvailableFleets[]>(
      requestURL,
      event,
    );

    // delete unused keys
    response.forEach((e) => {
      delete e.createdAt;
      delete e.memberCount;
      delete e.corporate;
    });

    return sendSuccessResponse(response);
  } catch (err) {
    console.log(err);
    return sendErrorResponse(err);
  }
});

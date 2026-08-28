export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const { VALUATION_BASE_URL } = useRuntimeConfig();
  const data: LoginResponse = await inflatePrincipal(cookies);

  let endpoint = `${VALUATION_BASE_URL}/api/v1/corporate-organization/get-all?`;

  if (!data.isBroker) {
    endpoint = endpoint + `&isBroker=${false}`;
  } else {
    endpoint = endpoint + `&isBroker=${true}`;
  }

  try {
    const response = await makeProxyRequest<GenericResponse<CorporateClient[]>>(
      endpoint,
      event,
    );
    return sendSuccessResponse(response.data);
  } catch (err) {
    console.log(err);
    return sendErrorResponse(err);
  }
});

export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const config = useRuntimeConfig();
  const data: LoginResponse = await inflatePrincipal(cookies);

  let endpoint = `${config.public.VALUATION_BASE_URL}/api/v1/corporate-organization/get-all?isBroker=${data.isBroker}`;

  try {
    const response = await makeProxyRequest<GenericResponse<CorporateClient[]>>(
      endpoint,
      event,
    );
    return sendSuccessResponse(response.data);
  } catch (err) {
    return sendErrorResponse(err);
  }
});

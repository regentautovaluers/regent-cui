export default defineEventHandler(async (event) => {
  const { IPRS_BASE_URL } = useRuntimeConfig();
  const cookies = parseCookies(event);
  const data: LoginResponse = await inflatePrincipal(cookies);
  const query: { idNumber: string } = getQuery(event);

  const requestURL = `${IPRS_BASE_URL}/api/v1/iprs/id-card`;

  try {
    let response = await makeProxyRequest<
      GenericIPRSQueryResponse<IPRSIDCheckData>
    >(requestURL, event, {
      method: "POST",
      body: JSON.stringify({
        corporateId: data.corpId,
        idNumber: query.idNumber,
      }),
    });

    return sendSuccessResponse(response);
  } catch (err) {
    console.log(err);
    return sendErrorResponse(err);
  }
});

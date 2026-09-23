export default defineEventHandler(async (event) => {
  const { COLV_BASE_URL } = useRuntimeConfig();
  const cookies = parseCookies(event);
  const data: LoginResponse = await inflatePrincipal(cookies);
  const requestData = await readBody(event);

  requestData.corporateClientId = data.corpId;
  requestData.corporateClientName = data.corpName;
  requestData.corpClientRepName = data.username;
  requestData.corpClientEmail = data.email;
  requestData.corpClientPhoneNumber = data.phoneNumber;

  try {
    await makeProxyRequest<null>(
      `${COLV_BASE_URL}/api/v1/fraud/create`,
      event,
      {
        body: requestData,
        method: "POST",
      },
    );
  } catch (err) {
    console.log(err);
    return sendErrorResponse(err);
  }
});

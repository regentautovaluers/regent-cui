export default defineEventHandler(async (event) => {
  const { COLV_BASE_URL } = useRuntimeConfig();
  const cookies = parseCookies(event);
  const data: LoginResponse = await inflatePrincipal(cookies);
  const vehicleDetails: CollateralVerification[] = await readBody(event);
  const clientDetails: CollateralVerificationCreator = {
    corporateClientId: data.corpId,
    corporateClientName: data.corpName,
    corpClientRepName: data.username,
    corpClientEmail: data.email,
    corpClientPhoneNumber: data.phoneNumber,
  };

  try {
    await makeProxyRequest<null>(
      `${COLV_BASE_URL}/api/v1/fraud/create`,
      event,
      {
        body: {
          clientDetails,
          vehicleDetails,
        },
        method: "POST",
      },
    );
  } catch (err) {
    console.log(err);
    return sendErrorResponse(err);
  }
});

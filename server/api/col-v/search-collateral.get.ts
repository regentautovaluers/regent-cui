export default defineEventHandler(async (event) => {
  const { COLV_BASE_URL } = useRuntimeConfig();
  const cookies = parseCookies(event);
  const data: LoginResponse = await inflatePrincipal(cookies);
  const query: { searchTerms: string } = getQuery(event);

  let requestURL = `${COLV_BASE_URL}/api/v1/fraud/search?searchType=valuation&searcherEmail=${data.email}&searcherPhone=${data.phoneNumber}&searcherName=${data.username}&searcherOrganisation=${data.corpName}`;

  // attatch the searchTerms
  const searchTerms = query.searchTerms
    .split(",")
    .filter((sp) => sp.length > 0);

  let index = 1;
  for (; index <= searchTerms.length; index++) {
    requestURL += `&searchQuery${index}=${searchTerms[index - 1]}`;
  }

  try {
    let response = await makeProxyRequest<GenericCollateralVerificationResponse<CollateralVerificationEntry[]>>(requestURL, event);

    return sendSuccessResponse(response);
  } catch (err) {
    console.log(err);
    return sendErrorResponse(err);
  }
});

export default defineEventHandler(async (event) => {
  const { AVA_BASE_URL } = useRuntimeConfig();
  const query: {
    userEmail: string | null;
    userPhone: string | null;
    searchReg: string | null;
    page: number;
    size: number;
  } = getQuery(event);
  let requestURL = `${AVA_BASE_URL}/api/v1/mobile/user-memberships?page=${query.page}&size=${query.size}`;

  if (query.userEmail) {
    requestURL += `&userEmail=${query.userEmail}`;
  }

  if (query.userPhone) {
    requestURL += `&phoneNumber=${query.userPhone}`;
  }

  if (query.searchReg) {
    requestURL += `&serchTerm=${query.searchReg}`;
  }

  try {
    let response = await makeProxyRequest<GetCorporateAVAMemberVehicles>(
      requestURL,
      event,
    );
    if (response.memberships[0] && response.memberships[0].membershipVehicles) {
      if (response.memberships[0].membershipVehicles.length > 0) {
        return sendSuccessResponse({
          membershipVehicles: response.memberships[0].membershipVehicles,
          pagination: response.pagination,
        } as SlimmedGetCorporateAVAMemberVehicles);
      }
    }

    return sendSuccessResponse({
      membershipVehicles: [],
      pagination: null,
    } as SlimmedGetCorporateAVAMemberVehicles);
  } catch (err) {
    console.log(err);
    return sendErrorResponse(err);
  }
});

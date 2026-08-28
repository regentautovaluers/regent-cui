export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const { VALUATION_BASE_URL } = useRuntimeConfig();
  const data: LoginResponse = await inflatePrincipal(cookies);

  const {
    startDate,
    endDate,
    bookingSource,
    completed,
  }: {
    startDate: string;
    endDate: string;
    bookingSource?: string;
    completed?: boolean;
    corpBranchId?: string;
  } = await readBody(event);

  let endpoint = `${VALUATION_BASE_URL}/api/v1/valuation/utils/export-report?startDate=${startDate}&endDate=${endDate}&corpId=${data.corpId}`;

  if (bookingSource) {
    endpoint = endpoint + `&bookingSource=${bookingSource}`;
  }

  if (completed) {
    endpoint = endpoint + `&completed=${completed}`;
  }

  if (!data.userRoles.includes("ROLE_CORP_ADMIN")) {
    if (data.branchId) {
      endpoint = endpoint + `&corpBranchId=${data.branchId}`;
    }
  }

  try {
    const response = await makeProxyRequest<ArrayBuffer>(endpoint, event, {
      responseType: "arrayBuffer",
    });
    // 2. Set the appropriate headers so the browser knows it's a PDF
    setResponseHeaders(event, {
      "Content-Type": "application/vnd.ms-excel",
      "Content-Disposition": 'attachment; filename="export.xls"',
    });

    // 3. Return the buffer directly
    return Buffer.from(response);
  } catch (err) {
    console.log(err);
    return sendErrorResponse(err);
  }
});

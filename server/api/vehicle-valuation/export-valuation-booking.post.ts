export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const cookies = parseCookies(event);

	const {
		startDate,
		endDate,
		corpId,
		bookingSource,
		completed,
		corpBranchId,
	}: {
		startDate: string;
		endDate: string;
		corpId: string;
		bookingSource?: string;
		completed?: boolean;
		corpBranchId?: string;
	} = await readBody(event);

	let endpoint = `http://localhost:8080/api/v1/valuation/utils/export-report?startDate=${startDate}&endDate=${endDate}&corpId=${corpId}`;

	if (bookingSource) {
		endpoint = endpoint + `&bookingSource=${bookingSource}`;
	}

	if (completed) {
		endpoint = endpoint + `&completed=${completed}`;
	}

	if (corpBranchId) {
		endpoint = endpoint + `&corpBranchId=${corpBranchId}`;
	}

	try {
		const response = await makeProxyRequest<ArrayBuffer>(endpoint, {
			responseType: 'arrayBuffer',
			headers: {
				Authorization: `Bearer ${cookies.valuation_auth_token}`,
			},
		});
		// 2. Set the appropriate headers so the browser knows it's a PDF
		setResponseHeaders(event, {
			'Content-Type': 'application/vnd.ms-excel',
			'Content-Disposition': 'attachment; filename="export.xls"',
		});

		// 3. Return the buffer directly
		return Buffer.from(response);
	} catch (err) {
		console.log(err);
		return sendErrorResponse(event, err);
	}
});

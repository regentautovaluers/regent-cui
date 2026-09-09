import type {
	ValuationBooking,
	PaymentMethod,
	PaymentStatus,
} from '~/types/corporate-valuations/valuation-report';
import type { GenericResponse } from '~/types/corporate-valuations/generic-response-type';
import { cleanValuations } from '~/server/utils/valuation-utils';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const query: {
		isVehicleTampered?: boolean;
		corpId?: string;
		regNo?: string;
		completed?: boolean;
		startDate?: string;
		endDate?: string;
		paymentStatus?: PaymentStatus;
		paymentMethod?: PaymentMethod;
		corpBranchId?: string;
		page?: number;
		size: number;
	} = getQuery(event);
	const cookies = parseCookies(event);

	let requestURL = `${config.VALUATION_BASE_URL}/api/v1/valuation/booking/get-all?`;

	if (query.page) {
		requestURL = requestURL + `&page=${query.page}`;
	}

	if (query.size) {
		requestURL = requestURL + `&size=${query.size}`;
	}

	if (query.corpId) {
		requestURL = requestURL + `&corpId=${query.corpId}`;
	}

	if (query.regNo) {
		requestURL = requestURL + `&regNo=${query.regNo}`;
	}

	// rendering completed or pending requests
	if (query.completed) {
		requestURL = requestURL + `&completed=${query.completed}`;
	}

	if (query.startDate) {
		requestURL = requestURL + `&startDate=${query.startDate}`;
	}

	if (query.endDate) {
		requestURL = requestURL + `&endDate=${query.endDate}`;
	}

	if (query.paymentStatus) {
		requestURL = requestURL + `&paymentStatus=${query.paymentStatus}`;
	}

	if (query.isVehicleTampered) {
		requestURL = requestURL + `&isVehicleTampered=${query.isVehicleTampered}`;
	}

	if (query.paymentMethod) {
		requestURL = requestURL + `&paymentMethod=${query.paymentMethod}`;
	}

	if (query.corpBranchId) {
		requestURL = requestURL + `&corpBranchId=${query.corpBranchId}`;
	}

	try {
		let response = await makeProxyRequest<GenericResponse<ValuationBooking[]>>(
			requestURL,
			undefined,
			event,
		);

		if (response.data) {
			response.data.forEach((vb) => cleanValuations(vb));
		}

		return sendSuccessResponse(event, response);
	} catch (err) {
		console.log(err);
		return sendErrorResponse(event, err);
	}
});

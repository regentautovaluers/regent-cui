import { ProxyError, StandardErrorResponse } from '~/types/proxy-types';

const getErrorType = (error: ProxyError): string => {
	if (error.type) return error.type;
	if (
		error.cause &&
		typeof error.cause === 'object' &&
		(error.cause as any).code === 'NETWORK_ERROR'
	)
		return 'network_error';
	if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500)
		return 'validation_error';
	if (error.statusCode && error.statusCode >= 500) return 'remote_api_error';
	return 'internal_error';
};

export default defineNitroPlugin((nitroApp) => {
	nitroApp.hooks.hook('error', (error: ProxyError, { event }) => {
		// Determine appropriate status code
		let statusCode = 500;
		let errorMessage = 'Internal Server Error';
		let errorCode = 'INTERNAL_ERROR';

		const errorType = getErrorType(error);

		switch (errorType) {
			case 'network_error':
				statusCode = 503;
				errorMessage = 'Remote service unavailable';
				errorCode = 'SERVICE_UNAVAILABLE';
				break;

			case 'remote_api_error':
				statusCode = error.statusCode || 502;
				errorMessage = error.statusMessage || 'Remote API error';
				errorCode = 'REMOTE_API_ERROR';
				break;

			case 'validation_error':
				statusCode = error.statusCode || 400;
				errorMessage = error.statusMessage || error.message || 'Validation failed';
				errorCode = 'VALIDATION_ERROR';
				break;

			case 'authentication_error':
				statusCode = error.statusCode || 401;
				errorMessage = error.statusMessage || error.message || 'Authentication failed';
				errorCode = 'AUTHENTICATION_ERROR';
				break;

			case 'authorization_error':
				statusCode = error.statusCode || 403;
				errorMessage = error.statusMessage || error.message || 'Authorization failed';
				errorCode = 'AUTHORIZATION_ERROR';
				break;

			case 'internal_error':
			default:
				statusCode = error.statusCode || 500;
				errorMessage = error.statusMessage || 'Internal server error';
				errorCode = 'INTERNAL_ERROR';
				break;
		}

		// Build standardized error response
		const errorResponse: StandardErrorResponse = {
			metadata: {
				message: errorMessage,
				code: errorCode,
				timestamp: new Date().toISOString(),
				type: errorType,
			},
			success: false,
		};

		// Set response
		if (event?.node?.res && !event.node.res.headersSent) {
			event.node.res.statusCode = statusCode;
			event.node.res.setHeader('Content-Type', 'application/json');
			event.node.res.end(JSON.stringify(errorResponse));
		}
	});
});

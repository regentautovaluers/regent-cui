import { StandardSuccessResponse } from '~/types/proxy-types';

export default defineNitroPlugin((nitroApp) => {
	// Handle successful responses - wrap them in standard format
	nitroApp.hooks.hook('beforeResponse', async (event, { body }) => {
		// Skip if already an error response or if body is not an object
		if (!body || typeof body !== 'object' || body.error || event.node.res.statusCode >= 400) {
			return;
		}

		// Wrap successful responses in standard format
		const standardResponse: StandardSuccessResponse = {
			data: body,
			success: true,
			metadata: {
				message: "Request handled successfully!",
				timestamp: new Date().toISOString(),
				source: event.context.source || 'api',
			},
		};

		// Replace the response body
		event.node.res.setHeader('Content-Type', 'application/json');
		event.node.res.end(JSON.stringify(standardResponse));
	});
});

export default defineEventHandler(async (event) => {
  const { AVA_BASE_URL } = useRuntimeConfig();
  const body: AVACreateFleet = await readBody(event);
  const endpoint = `${AVA_BASE_URL}/api/v1/fleets`;

  try {
    await makeProxyRequest(endpoint, event, {
      method: "POST",
      body,
    });

    // return a success response
    return sendSuccessResponse(event);
  } catch (err) {
    return sendErrorResponse(event);
  }
});

export default defineEventHandler(async (event) => {
  const {
    REGENT_TRACKING_BASE_URL,
    REGENT_TRACKING_CERTIFICATES_BASE_URL,
    REGENT_TRACKING_CERTIFICATES_API_KEY,
  } = useRuntimeConfig();
  const query = getQuery(event);
  const cookies = parseCookies(event);
  let endpoint = `${REGENT_TRACKING_BASE_URL}/api/get_devices?lang=en&user_api_hash=${cookies.tracking_auth_token}`;

  if (query.page) {
    endpoint = endpoint + `&page=${query.page}`;
  }

  if (query.limit) {
    endpoint = endpoint + `&limit=${query.limit}`;
  }

  try {
    const vehicleData = await makeProxyRequest<
      { id: number; title: string; items: TrackedVehicles[] }[]
    >(endpoint, event);

    let combinedVehicleData = vehicleData.flatMap(
      (vehicle) => vehicle.items as TrackedVehicles[],
    );

    // we have to load the client details here to reduce complicated calls on the front-end
    if (combinedVehicleData.length > 0) {
      const deviceIds: number[] = combinedVehicleData.map((v) => {
        return v.device_data.id;
      });

      try {
        const results = await makeProxyRequest<TraceabilityReport>(
          `${REGENT_TRACKING_CERTIFICATES_BASE_URL}/tracking/traceabilityC.php?`,
          event,
          {
            method: "POST",
            body: JSON.stringify({
              api_key: REGENT_TRACKING_CERTIFICATES_API_KEY,
              tracker_id: deviceIds,
            }),
          },
        );
        results.results.forEach((r) => {
          let entry = combinedVehicleData.find(
            (e) => e.id == r.tracker_id,
          ) as TrackedVehicles;

          // trace whether vehicle is on watchlist
          if (r.comments.length > 0) {
            const latest_comment = r.comments[0];
            entry.on_watchlist =
              latest_comment!.watchlist == "Y" ? true : false;
          } else {
            entry.on_watchlist = false;
          }

          // set the comment, and driver name and phone number
          entry.comment = r.comments;

          entry.driver_data.name = r.clientName;
          entry.driver_data.phone = r.clientNo;
        });
      } catch (error) {
        console.error("Failed to fetch traceability details. Cause: ", error);
      }

      return sendSuccessResponse(combinedVehicleData);
    } else {
      return sendSuccessResponse([] as TrackedVehicles[]);
    }
  } catch (err) {
    console.log(err);
    return sendErrorResponse(err);
  }
});

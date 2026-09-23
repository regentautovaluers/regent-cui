import { type MultiPartData } from "h3";

export default defineEventHandler(async (event) => {
  const cookies = parseCookies(event);
  const { VALUATION_BASE_URL } = useRuntimeConfig();
  const requestData: MultiPartData[] | undefined =
    await readMultipartFormData(event);
  const formData = new FormData();
  const blackListedKeys: string[] = [
    "authorizedByUsername",
    "authorizedByPhoneNumber",
    "isCreatedByBroker",
    "corporateName",
    "agentName",
  ];
  const data: LoginResponse = await inflatePrincipal(cookies);

  // Check if requestData exists and iterate using for...of
  if (requestData) {
    // attach the userId
    formData.append("authorizedBy", data.userId);

    for (const e of requestData) {
      const name = e.name as string;

      if (name !== "files") {
        if (!blackListedKeys.includes(name)) {
          // append to the form
          formData.append(name, e.data.toString());
        }
      } else {
        if (e.filename) {
          // append the files
          formData.append(
            "files",
            new Blob([e.data] as BlobPart[], { type: e.type }),
            e.filename,
          );
        }
      }
    }
  }

  try {
    const endpoint = `${VALUATION_BASE_URL}/api/v1/authority-letter/corp/create-authority-letter`;
    await makeProxyRequest<GenericResponse<any>>(endpoint, event, {
      body: formData,
      method: "POST",
    });

    return sendSuccessResponse(null);
  } catch (err) {
    console.log(err);
    return sendErrorResponse(err);
  }
});

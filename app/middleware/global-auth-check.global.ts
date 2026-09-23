export default defineNuxtRouteMiddleware(async (to) => {
  // Only run auth logic on client during initial hydration or navigation
  if (import.meta.server) {
    return;
  }

  const store = usePrincipalStore();
  const valuation_auth_token = useCookie("valuation_auth_token");
  const ava_basic_auth_token = useCookie("ava_basic_auth_token");
  const tracking_auth_token = useCookie("tracking_auth_token");
  const ava_api_key = useCookie("ava_api_key");
  const app_principal = useCookie("app_principal");

  // unref the tokens - we don't care about reactivity here - tokens are in scope
  const urfdTokens = [
    unref(valuation_auth_token),
    unref(ava_basic_auth_token),
    unref(ava_api_key),
    unref(app_principal),
  ];

  // check if any of them is undefined or null
  if (urfdTokens.includes(undefined) || urfdTokens.includes(null)) {
    // nuke all of them
    valuation_auth_token.value = undefined;
    ava_basic_auth_token.value = undefined;
    tracking_auth_token.value = undefined;
    ava_api_key.value = undefined;
    app_principal.value = undefined;
    localStorage.removeItem("principal_obj");

    // reset the store -> sets the isLoggedIn to false
    store.$reset;
    store.isLoggedIn = false;
    return;
  }

  // we inflate the data stored in local storage
  const data: LoginResponse = JSON.parse(
    await decompress(base64ToArrayBuffer(app_principal.value!), "deflate"),
  );

  // set the correct values in store
  store.$patch({
    userId: data.userId,
    username: data.username,
    email: data.email,
    phoneNumber: data.phoneNumber,
    isAdmin: data.userRoles.includes("ROLE_CORP_ADMIN"),
    corpName: data.corpName,
    corpId: data.corpId,
    branchId: data.branchId,
    isBroker: data.isBroker,
    isLoggedIn: true,
    isTrackingLoggedIn: tracking_auth_token.value == undefined ? false : true,
  });
});

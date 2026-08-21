export default defineNuxtRouteMiddleware(async (to) => {
  // Only run auth logic on client during initial hydration or navigation
  if (import.meta.server) {
    return;
  }

  const store = usePrincipalStore();
  const valuation_auth_token = useCookie("valuation_auth_token");
  const ava_basic_auth_token = useCookie("ava_basic_auth_token");
  const ava_api_key = useCookie("ava_api_key");
  const principal_obj = localStorage.getItem("principal_obj");

  // unref the tokens - we don't care about reactivity here - tokens are in scope
  const urfdTokens = [
    unref(valuation_auth_token),
    unref(ava_basic_auth_token),
    unref(ava_api_key),
  ];

  // check if any of them is undefined or null
  if (
    urfdTokens.includes(undefined) ||
    urfdTokens.includes(null) ||
    !principal_obj
  ) {
    // nuke all of them
    valuation_auth_token.value = undefined;
    ava_basic_auth_token.value = undefined;
    ava_api_key.value = undefined;
    localStorage.removeItem("principal_obj");

    // reset the store -> sets the isLoggedIn to false
    store.$reset;
    store.isLoggedIn = false;
    return;
  }

  // we inflate the data stored in local storage
  const data: LoginResponse = JSON.parse(
    await decompress(base64ToArrayBuffer(principal_obj), "deflate"),
  );

  // set the correct values in store
  store.$patch({
    userId: data.userId,
    username: data.username,
    email: data.email,
    phoneNumber: data.phoneNumber,
    isAdmin: data.userRoles.includes("ROLE_CORP_ADMIN"),
    corpName: data.corpName,
    isLoggedIn: true,
  });
});

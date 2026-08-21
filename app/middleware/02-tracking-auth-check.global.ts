export default defineNuxtRouteMiddleware(async (to) => {
  // Only run auth logic on client during initial hydration or navigation
  if (import.meta.server) {
    return;
  }

  const store = usePrincipalStore();
  const tracking_auth_token = useCookie("tracking_auth_token");
  const toRoutePath = to.path as string;

  if (toRoutePath.includes("/regent-tracking")) {
    if (tracking_auth_token.value == undefined) {
      store.isTrackingLoggedIn = false;
    }
  }
});

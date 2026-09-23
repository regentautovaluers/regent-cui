const useAuthn = () => {
  const authnLoading = ref(false);
  const { post } = useStandardizedApi();
  const store = usePrincipalStore();
  const { $showToast } = useNuxtApp();

  async function attemptLogin(payload: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) {
    try {
      authnLoading.value = true;
      const response = await post<LoginResponse>(
        "/api/app-security/login-valuation-principal",
        payload,
      );
      if (response.success) {
        const data = (response as StandardSuccessResponse<LoginResponse>).data;
        store.$patch({
          userId: data.userId,
          username: data.username,
          email: data.email,
          phoneNumber: data.phoneNumber,
          isAdmin: data.userRoles.includes("ROLE_CORP_ADMIN"),
          corpId: data.corpId,
          branchId: data.branchId,
          corpName: data.corpName,
          isLoggedIn: true,
          isTrackingLoggedIn: true,
        });

        // set the remember me state
        data.rememberMe = payload.rememberMe;

        $showToast({
          title: "Success!",
          description: "Login successful!",
          color: "error",
        });
      }
    } catch (ex) {
      $showToast({
        title: "Failed!",
        description: "Invalid credentials!",
        color: "error",
      });
    } finally {
      authnLoading.value = false;
    }
  }

  function attemptLogout() {
    // load all cookies
    const valuation_auth_token = useCookie("valuation_auth_token");
    const ava_basic_auth_token = useCookie("ava_basic_auth_token");
    const tracking_auth_token = useCookie("tracking_auth_token");
    const ava_api_key = useCookie("ava_api_key");
    const app_principal = useCookie("app_principal");
    app_principal.value = undefined;

    // delete everything
    valuation_auth_token.value = undefined;
    ava_basic_auth_token.value = undefined;
    tracking_auth_token.value = undefined;
    ava_api_key.value = undefined;
    localStorage.removeItem("principal_obj");

    // reset the store
    store.$reset;
    store.isLoggedIn = false;

    // navigate to /home
    navigateTo("/");
  }

  return {
    authnLoading,
    attemptLogin,
    attemptLogout,
  };
};

export default useAuthn;

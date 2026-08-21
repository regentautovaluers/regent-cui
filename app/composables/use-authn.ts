const useAuthn = () => {
  const authnLoading = ref(false);
  const { post } = useStandardizedApi();
  const store = usePrincipalStore();

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

        // serialize the user object and set it in local storage
        const asCompressedString = arrayBufferToBase64(
          await compress(JSON.stringify(data), "deflate"),
        );

        localStorage.setItem("principal_obj", asCompressedString);
      }
    } catch (ex) {
    } finally {
      authnLoading.value = false;
    }
  }

  return {
    authnLoading,
    attemptLogin,
  };
};

export default useAuthn;

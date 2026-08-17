const useAuthn = () => {
  const authnLoading = ref(false);
  const { post } = useStandardizedApi();
  const store = usePrincipalStore();

  async function attemptLogin(payload: { email: string; password: string }) {
    try {
      authnLoading.value = true;
      const response = await post<LoginResponse>(
        "/api/app-security/login-valuation-principal",
        payload,
      );
      if (response.success) {
        const data = (response as StandardSuccessResponse<LoginResponse>).data;
        store.$patch({
          username: data.username,
          email: data.email,
          phoneNumber: data.phoneNumber,
          isAdmin: data.userRoles.includes("ROLE_CORP_ADMIN"),
          corpName: data.corpName,
        });
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

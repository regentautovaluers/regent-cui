import { defineStore } from "pinia";

export const usePrincipalStore = defineStore("principleStore", {
  state: (): SlimmedLoginReponse & { isLoggedIn: boolean } => {
    return {
      userId: "",
      username: "",
      email: "",
      phoneNumber: "",
      isAdmin: false,
      corpId: "",
      branchId: "",
      isBroker: false,
      corpName: "",
      isLoggedIn: true,
      isTrackingLoggedIn: true,

      rememberMe: false,
    };
  },
  getters: {
    loadUserIdentifiers: (state) => {
      return {
        username: state.username,
        email: state.email,
        corporate: state.corpName,
        corporateId: state.corpId,
        corporateName: state.corpName,
      };
    },
  },
  actions: {},
});

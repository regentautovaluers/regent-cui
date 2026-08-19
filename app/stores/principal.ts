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
      corpName: "",
      isLoggedIn: true,
      rememberMe: false,
    };
  },
  getters: {
    loadUserIdentifiers: (state) => {
      return {
        username: state.username,
        email: state.email,
        corporate: state.corpName,
      };
    },
  },
  actions: {},
});

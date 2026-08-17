import { defineStore } from "pinia";

export const usePrincipalStore = defineStore("principleStore", {
  state: (): SlimmedLoginReponse => {
    return {
      username: "",
      email: "",
      phoneNumber: "",
      isAdmin: false,
      corpName: "",
    };
  },
  getters: {
    loadUserIdentifiers: (state) => {
      return { username: state.username, email: state.email, corporate: state.corpName };
    },
  },
  actions: {},
});

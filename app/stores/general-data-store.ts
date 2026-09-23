import { defineStore } from "pinia";

export const useGeneralDataStore = defineStore("generalDataStore", {
  state: (): {
    regentBranches: RegentBranch[];
    loadingRegentBranches: boolean;
    corporateBranches: CorporateBranch[];
    loadingCorporateBranches: boolean;
    corporateOrganizations: CorporateClient[];
    loadingCorporateOrganizations: boolean;
  } => ({
    regentBranches: [],
    loadingRegentBranches: false,
    corporateBranches: [],
    loadingCorporateBranches: false,
    corporateOrganizations: [],
    loadingCorporateOrganizations: false,
  }),
  getters: {
    getRegentBranches(state) {
      return state.regentBranches;
    },
    getCorporateBranches(state) {
      return state.corporateBranches;
    },
    getCorporateOrganzations(state) {
      return state.corporateOrganizations;
    },
  },
  actions: {
    async loadRegentBranches() {
      if (this.regentBranches.length > 0) return;

      try {
        this.loadingRegentBranches = true;
        const { data, status } = await useApiData<RegentBranch[]>(
          "regent-branch",
          "/api/utils/get-regent-branches",
        );

        const rawList = data.value!;
        this.regentBranches = rawList;
      } catch (err) {
        // TODO: Show error here
      } finally {
        this.loadingRegentBranches = false;
      }
    },

    async loadCorporateBranches() {
      if (this.corporateBranches.length > 0) return;

      try {
        this.loadingCorporateBranches = true;
        const { data, status } = await useApiData<CorporateBranch[]>(
          "corporate-branch",
          `/api/utils/load-corporate-branches`,
        );

        const rawList = data.value!;
        this.corporateBranches = rawList;
      } catch (err) {
        // TODO: Show error here
      } finally {
        this.loadingCorporateBranches = false;
      }
    },

    async loadCorporateOrganizations() {
      if (this.corporateOrganizations.length > 0) return;

      try {
        this.loadingCorporateOrganizations = true;
        const { data, status } = await useApiData<CorporateClient[]>(
          "corporate-organizations",
          `/api/utils/load-corporate-clients`,
        );

        const rawList = data.value!;
        this.corporateOrganizations = rawList;
      } catch (err) {
        // TODO: Show error here
      } finally {
        this.loadingCorporateOrganizations = false;
      }
    },
  },
});

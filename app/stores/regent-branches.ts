import { defineStore } from "pinia";

export const useGeneralDataStore = defineStore("generalDataStore", {
  state: (): {
    regentBranches: RegentBranch[];
    loadingRegentBranches: boolean;
    corporateBranches: CorporateBranch[];
    loadingCorporateBranches: boolean;
  } => ({
    regentBranches: [],
    loadingRegentBranches: false,
    corporateBranches: [],
    loadingCorporateBranches: false,
  }),
  getters: {
    getBranches(state) {
      return state.regentBranches;
    },
  },
  actions: {
    async loadRegentBranches() {
      if (this.regentBranches.length > 0) return;

      try {
        this.loadingRegentBranches = true;
        const { data, status } = await useApiData<
          GenericResponse<RegentBranch[]>
        >("regent-branch", "/api/vehicle-valuation/get-regent-branches");

        const rawList = data.value!.data;
        this.regentBranches = rawList;
      } catch (err) {
        // TODO: Show error here
      } finally {
        this.loadingRegentBranches = false;
      }
    },

    async loadCorporateBranches() {
      if (this.corporateBranches.length > 0) return;
      const store = usePrincipalStore();

      try {
        this.loadingCorporateBranches = true;
        const { data, status } = await useApiData<
          GenericResponse<CorporateBranch[]>
        >(
          "corporate-branch",
          `/api/utils/load-corporate-branches?corpId=${store.userId}`,
        );

        const rawList = data.value!.data;
        this.corporateBranches = rawList;
      } catch (err) {
        // TODO: Show error here
      } finally {
        this.loadingCorporateBranches = false;
      }
    },
  },
});

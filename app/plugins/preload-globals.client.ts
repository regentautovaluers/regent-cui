export default defineNuxtPlugin(async () => {
  const generalDataStore = useGeneralDataStore();

  // Fire and forget, or await if critical for initial render
  generalDataStore.loadRegentBranches();
  generalDataStore.loadCorporateBranches();
  generalDataStore.loadCorporateOrganizations();
});

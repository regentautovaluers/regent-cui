export default defineNuxtPlugin(async () => {
  const branchesStore = useGeneralDataStore();

  // Fire and forget, or await if critical for initial render
  branchesStore.loadRegentBranches();
  branchesStore.loadCorporateBranches();
});

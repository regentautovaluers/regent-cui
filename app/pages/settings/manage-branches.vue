<script setup lang="ts">
definePageMeta({
  name: "settings-manage-branches",
  displayName: "Manage Branches",
});

const generalDataStore = useGeneralDataStore();
</script>

<template>
  <GenericTable
    :headers="['Name', 'Location']"
    :dataLoading="generalDataStore.loadingCorporateBranches"
  >
    <template v-if="generalDataStore.corporateBranches.length">
      <tr
        v-for="branch in generalDataStore.corporateBranches"
        :key="branch.branchId"
      >
        <td class="font-semibold">
          {{ branch.branchName }}
        </td>
        <td>
          {{ branch.branchLocation }}
        </td>
      </tr>
    </template>
  </GenericTable>
</template>

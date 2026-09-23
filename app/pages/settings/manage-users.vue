<script setup lang="ts">
definePageMeta({
  name: "settings-manage-users",
  displayName: "Manage Users",
});

const config = useRuntimeConfig();
const size = config.public.PAGE_SIZE;
const page = ref(0);
const store = usePrincipalStore();
const searchTerm = ref(null);
const query = computed(() => {
  if (!store.corpId) return null; // Guard against unhydrated state

  return {
    size,
    page: page.value,
    corpId: store.corpId,
  };
});

const { data, status, refresh } = useApiData<
  GenericResponse<ValuationPrincipal[]>
>(`load-users-${store.corpId}`, "/api/app-security/load-users", {
  query,
  lazy: false,
  // Keep previous data visible while fetching the next page for seamless UX
  dedupe: "defer",
  watch: [query],
});

const paginationInfo = computed(() => ({
  totalPages: data.value?.requestExtras?.totalPages || 1,
  totalItems: data.value?.requestExtras?.totalItems || 0,
  currentPage: data.value?.requestExtras?.currentPage || 0,
}));

function handlePageChange(newPage: number) {
  const maxPages = paginationInfo.value.totalPages;
  if (newPage >= 0 && newPage < maxPages) {
    page.value = newPage;
  }
}
</script>

<template>
  <div class="h-full min-h-full">
    <GrowableCard
      ><template #no-padding
        ><GenericTable
          :headers="['Name', 'Phone', 'Last Login', 'Status', 'Privilege', '']"
          :dataLoading="status == 'pending'"
        >
          <template v-if="data?.data.length">
            <tr v-for="user in data.data" :key="user.userId">
              <td class="space-y-1 flex flex-col">
                <span class="font-semibold">
                  {{ user.username }}
                </span>
                <div class="badge badge-soft badge-success">
                  {{ censorString(user.email, "START") }}
                </div>
              </td>
              <td>{{ censorString(user.phoneNumber, "CENTER") }}</td>
              <td>
                {{
                  user.lastLogin ? getTimeAgo(new Date(user.lastLogin)) : "-"
                }}
              </td>
              <td>
                <div
                  :class="[
                    'badge badge-soft ',
                    user.accountEnabled ? 'badge-success' : 'badge-error',
                  ]"
                >
                  {{ user.accountEnabled ? "Enabled" : "Disabled" }}
                </div>
              </td>
              <td class="font-semibold">
                {{
                  user.userRoles.includes("ROLE_CORP_ADMIN")
                    ? "Admin"
                    : "Normal"
                }}
              </td>
              <td>
                <GenericTableActionButton
                  :action-id="`u-${user.userId}-action`"
                >
                  <li>
                    <button class="dropdown-item">Edit</button>
                  </li>
                </GenericTableActionButton>
              </td>
            </tr>
          </template>
        </GenericTable></template
      ></GrowableCard
    >
  </div>

  <GenericTablePageSwitcher
    :current-page="paginationInfo.currentPage"
    :total-pages="paginationInfo.totalPages"
    :total-items="paginationInfo.totalItems"
    :scroll-back-disabled="page <= 0 || status === 'pending'"
    :scroll-forward-disabled="
      page >= paginationInfo.totalPages - 1 || status === 'pending'
    "
    @page-change-clicked="
      (page) => {
        handlePageChange(page);
      }
    "
  ></GenericTablePageSwitcher>
</template>

<script setup lang="ts">
definePageMeta({
  name: "settings-add-user",
});

const createUserLoading = ref(false);
const store = usePrincipalStore();
const accountDetails = reactive({
  username: "",
  email: "",
  phoneNumber: "",
  password: "",
  corpBranchId: "",
  roleInOrganization: "",
  userRoles: "role_corp_norm",
  corporateId: store.corpId,
});
const generalDataStore = useGeneralDataStore();
const { post } = useStandardizedApi();

watch(
  () => accountDetails.phoneNumber,
  (newNumber: string) => {
    if (newNumber.startsWith("0") || newNumber.startsWith("+254")) {
      accountDetails.phoneNumber = newNumber.replace(/^(\+254|0)/, "254");
    }
  },
);

async function createNewUser() {
  try {
    createUserLoading.value = true;
    await post<null>("/api/app-security/create-account", {
      ...accountDetails,
      userRoles: [accountDetails.userRoles],
    });

    // TODO: Add a success toast here
  } catch (ex) {
    // TODO: Add an error toast here
  } finally {
    createUserLoading.value = false;
  }
}
</script>

<template>
  <GrowableCard card-title="Add New User">
    <form class="space-y-8" @submit.prevent="createNewUser()">
      <div class="flex items-center">
        <div class="w-1/4">
          <span class="label-text text-base">Full Name</span>
        </div>
        <div class="grow">
          <InputsGenericInput
            input-id="add-user-fname"
            input-place-holder="e.g Jane Doe"
            :input-required="true"
            input-helpertext="at least two formal names"
            v-model="accountDetails.username"
          ></InputsGenericInput>
        </div>
      </div>

      <div class="flex items-center">
        <div class="w-1/4">
          <span class="label-text text-base">Email</span>
        </div>
        <div class="grow">
          <InputsGenericInput
            input-id="add-user-email"
            input-type="email"
            input-place-holder="johndoe123@gmail.com"
            :input-required="true"
            v-model="accountDetails.email"
          ></InputsGenericInput>
        </div>
      </div>

      <div class="flex items-center">
        <div class="w-1/4">
          <span class="label-text text-base">Phone</span>
        </div>
        <div class="grow">
          <InputsGenericInput
            input-id="add-user-phone"
            input-type="text"
            input-helpertext="start with 254"
            input-place-holder="e.g. 254712345678"
            :input-required="true"
            v-model="accountDetails.phoneNumber"
          ></InputsGenericInput>
        </div>
      </div>

      <div class="flex items-center">
        <div class="w-1/4">
          <span class="label-text text-base">Organization Role</span>
        </div>
        <div class="grow">
          <InputsGenericInput
            input-id="add-user-org-role"
            input-type="text"
            input-helpertext="can be left blank"
            input-place-holder="e.g. Underwriter"
            v-model="accountDetails.roleInOrganization"
          ></InputsGenericInput>
        </div>
      </div>

      <div class="flex items-center">
        <div class="w-1/4">
          <span class="label-text text-base">Select User's Branch</span>
        </div>
        <div class="grow">
          <!-- preffered regent branch -->
          <InputsGenericInputSearchBox
            input-id="add-user-branch"
            :input-dropdown-options="
              generalDataStore.getCorporateBranches.map((e) => ({
                id: e.branchId,
                text: e.branchName,
              }))
            "
            input-helpertext="can be left blank"
            @value-selected="(id) => (accountDetails.corpBranchId = id)"
          >
          </InputsGenericInputSearchBox>
        </div>
      </div>

      <div class="flex items-center">
        <div class="w-1/4">
          <span class="label-text text-base">Privilege</span>
        </div>
        <div class="grow">
          <ul
            class="border-base-content/25 divide-base-content/25 rounded-box flex w-full flex-col border *:w-full *:cursor-pointer max-sm:divide-y sm:flex-row sm:divide-x"
          >
            <li>
              <label class="flex items-center gap-2 p-3">
                <input
                  type="radio"
                  name="user-privielege"
                  class="radio radio-primary ms-3"
                  value="role_corp_admin"
                  v-model="accountDetails.userRoles"
                />
                <span class="label-text text-base">Admin</span>
              </label>
            </li>
            <li>
              <label class="flex items-center gap-2 p-3">
                <input
                  type="radio"
                  name="user-privielege"
                  class="radio radio-primary ms-3"
                  value="role_corp_norm"
                  v-model="accountDetails.userRoles"
                  checked
                />
                <span class="label-text text-base">Normal User</span>
              </label>
            </li>
          </ul>
        </div>
      </div>

      <div class="flex items-center">
        <div class="w-1/4">
          <span class="label-text text-base">Password</span>
        </div>
        <div class="grow">
          <InputsGenericInput
            input-id="add-user-org-role"
            input-type="password"
            input-helpertext="can be left blank"
            input-place-holder="e.g. Underwriter"
            v-model="accountDetails.password"
            :input-required="true"
          ></InputsGenericInput>
        </div>
      </div>

      <InputsGenericSubmitButton
        button-text="Add New User"
        :submit-loading="createUserLoading"
      >
      </InputsGenericSubmitButton>
    </form>
  </GrowableCard>
</template>

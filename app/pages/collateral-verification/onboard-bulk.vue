<script setup lang="ts">
import { readSheet } from "read-excel-file/browser";

definePageMeta({
  name: "cv-onboard-bulk",
  displayName: "Onboard Collateral - Bulk",
});
const { post } = useStandardizedApi();
const uploadTarget: Ref<CollateralVerification[]> = ref([]);
const parsingData = ref(false);
const uploadingData = ref(false);
const disableUploadButton = computed(() => {
  return parsingData.value == true || uploadingData.value == true;
});
const { $showToast } = useNuxtApp();

async function uploadBulkCollateral() {
  try {
    uploadingData.value = true;
    await post("/api/col-v/onboard-collateral-bulk", uploadTarget.value);
    $showToast({
      title: "Success!",
      description: `${uploadTarget.value} Cases onboard successfully!`,
      color: "success",
    });
  } catch (ex) {
    $showToast({
      title: "Failed!",
      description: `Uploading ${uploadTarget.value} failed. Try again!`,
      color: "error",
    });
  } finally {
    uploadingData.value = false;
  }
}

async function processUploadedFile(uploadEvent: any) {
  try {
    const data = await readSheet(uploadEvent.target.files[0]);
    let row = 1;

    parsingData.value = true;
    for (; row < data.length; row++) {
      uploadTarget.value.push(
        parseToCollateralVerification(row, data[row] as string[]),
      );
    }
  } catch (ex: unknown) {
    if (ex instanceof Error) {
      $showToast({
        title: "Invalid File Input!",
        description: ex.message,
        color: "error",
      });
    } else {
      $showToast({
        title: "Invalid File Input!",
        description: "Unable to parse file. Please try again!",
        color: "error",
      });
    }
  } finally {
    parsingData.value = false;
  }
}

function parseToCollateralVerification(
  rowNum: number,
  row: string[],
): CollateralVerification {
  if (row.length < 10 || row.length > 10) {
    throw new Error("Entries on row: " + rowNum + " must be exactly 10");
  }

  const ret: CollateralVerification = {
    registrationNumber: "",
    chassisNumber: "",
    color: "",
    engineNumber: "",
    make: "",
    model: "",
    yearOfManufacture: 0,
    description: "",
    dateOfIncident: "",
    amountDefaulted: "",
    relevantLinks: [],
  };
  for (const [index, value] of row.entries()) {
    // registration number
    switch (index) {
      case 0: {
        // registration number
        ret.registrationNumber = value;
        break;
      }
      case 1: {
        ret.chassisNumber = value;
        break;
      }
      case 2: {
        ret.color = value;
        break;
      }
      case 3: {
        ret.engineNumber = value;
        break;
      }
      case 4: {
        ret.make = value;
        break;
      }
      case 5: {
        ret.model = value;
        break;
      }
      case 6: {
        ret.yearOfManufacture = !value ? 0 : Number(value);
        break;
      }
      case 7: {
        ret.description = value;
        break;
      }
      case 8: {
        ret.dateOfIncident = !value ? "" : extractDate(value);
        break;
      }
      case 9: {
        ret.amountDefaulted = value;
        break;
      }
    }
  }

  return ret;
}
</script>

<template>
  <div>
    <HeadboardAnnouncer
      announcer-title="Onboard In Bulk"
      highlight-text="About Onboarding Template"
    >
      <template #description
        ><p class="text-base-content/80 mt-2 text-base font-normal">
          You can quickly onboard a group of users at once by providing an Excel
          document written in a specific format. Download our template using the
          option to the right and fill it then re-upload it using the form
          below.
          <span class="font-semibold"
            >Kindly refrain from changing any of the column structure and leave
            blank where you don't have input data.</span
          >
        </p></template
      >

      <template #aside>
        <div
          class="flex grow items-center justify-center max-sm:mt-5 max-sm:justify-start"
        >
          <a
            href="https://media.regentautovaluers.com/media/download/utility-media/collateral-verification/onboarding_template.xlsx"
            target="_blank"
            class="inline-flex items-center flex-col space-y-1 text-primary"
          >
            <span
              class="icon-[material-symbols--downloading-rounded] size-12"
            ></span>
            <span class="font-semibold text-lg">Download Template</span>
          </a>
        </div>
      </template>
    </HeadboardAnnouncer>

    <ul
      class="timeline timeline-snap-icon timeline-compact timeline-vertical w-full"
    >
      <!-- timeline item 1-->
      <li>
        <div class="timeline-middle">
          <span class="badge badge-primary size-4.5 rounded-full p-0">
            <span
              class="icon-[tabler--check] text-primary-content size-3.5"
            ></span>
          </span>
        </div>
        <div class="timeline-end ms-2 m-3 w-full rounded-lg">
          <div
            class="text-base-content pt-0.5 mb-3 flex gap-2 font-bold max-sm:flex-col-reverse sm:items-center sm:justify-between"
          >
            Upload Your Populated File
            <span class="text-base-content/50 text-sm font-normal">Step 1</span>
          </div>
          <p class="mb-2">
            Click the button below to select the populated Excel from your
            computer.
          </p>
          <div class="btn btn-soft btn-secondary">
            <input
              type="file"
              id="file-input"
              class="hidden"
              @change="processUploadedFile($event)"
            />
            <label class="inline-flex items-center space-x-1" for="file-input">
              <span
                class="icon-[material-symbols--drive-file-move-rounded] size-5"
              ></span>
              <span>Pick Populated Excel</span>
            </label>
          </div>
        </div>
        <hr class="bg-primary" />
      </li>
      <!-- /timeline item 1-->

      <!-- timeline item 2-->
      <li>
        <hr class="bg-primary" />
        <div class="timeline-middle">
          <span class="badge badge-primary size-4.5 rounded-full p-0">
            <span
              class="icon-[tabler--check] text-primary-content size-3.5"
            ></span>
          </span>
        </div>
        <div class="timeline-end ms-2 m-3 w-full rounded-lg">
          <div
            class="text-base-content pt-0.5 mb-3 flex gap-2 font-bold max-sm:flex-col-reverse sm:items-center sm:justify-between"
          >
            Verify Data & Correctness
            <span class="text-base-content/50 text-sm font-normal">Step 2</span>
          </div>
          <p class="mb-2">
            Before uploading, we check the validity of your data and tell you
            what's wrong before the upload.
          </p>
        </div>
        <hr class="bg-primary" />
      </li>
      <!-- /timeline item 2-->

      <!-- timeline item 3-->
      <li>
        <hr class="bg-primary" />
        <div class="timeline-middle">
          <span
            class="bg-secondary/20 flex size-4.5 items-center justify-center rounded-full"
          >
            <span class="badge badge-secondary size-3 rounded-full p-0"></span>
          </span>
        </div>
        <div class="timeline-end ms-2 m-3 w-full rounded-lg">
          <div
            class="text-base-content pt-0.5 mb-3 flex gap-2 font-bold max-sm:flex-col-reverse sm:items-center sm:justify-between"
          >
            Upload And Save
            <span class="text-base-content/50 text-sm font-normal">Step 3</span>
          </div>
          <p class="mb-2">
            {{ uploadTarget.length }} users will be uploaded to the DB!
          </p>
          <form @submit.prevent="uploadBulkCollateral()">
            <button
              type="submit"
              :disabled="disableUploadButton"
              class="btn btn-soft btn-success inline-flex items-center space-x-1"
            >
              <template v-if="uploadingData">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1em"
                  height="1em"
                  viewBox="0 0 24 24"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <g stroke="currentColor">
                    <circle
                      cx="12"
                      cy="12"
                      r="9.5"
                      fill="none"
                      stroke-linecap="round"
                      stroke-width="3"
                    >
                      <animate
                        attributeName="stroke-dasharray"
                        calcMode="spline"
                        dur="1.5s"
                        keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                        keyTimes="0;0.475;0.95;1"
                        repeatCount="indefinite"
                        values="0 150;42 150;42 150;42 150"
                      />
                      <animate
                        attributeName="stroke-dashoffset"
                        calcMode="spline"
                        dur="1.5s"
                        keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1"
                        keyTimes="0;0.475;0.95;1"
                        repeatCount="indefinite"
                        values="0;-16;-59;-59"
                      />
                    </circle>
                    <animateTransform
                      attributeName="transform"
                      dur="2s"
                      repeatCount="indefinite"
                      type="rotate"
                      values="0 12 12;360 12 12"
                    />
                  </g>
                </svg>
              </template>
              <template v-else
                ><span
                  class="icon-[material-symbols--arrow-upload-progress-rounded] size-5"
                ></span
              ></template>

              <span>Upload to Database</span>
            </button>
          </form>
        </div>
        <hr />
      </li>
      <!-- /timeline item 3-->
    </ul>
  </div>
</template>

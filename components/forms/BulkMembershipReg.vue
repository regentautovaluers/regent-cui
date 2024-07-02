<template>
	<form @submit.prevent="registerBulkMember">
		<div
			class="flex flex-col lg:flex-row items-center justify-between space-y-3 lg:space-y-0 space-x-0 lg:space-x-3">
			<!-- Full Name Field -->
			<div class="w-full">
				<label
					for="fleet-name"
					class="block font-medium mb-2 dark:text-white"
					>Client Fleet</label
				>
				<div class="relative">
					<select
						class="generic-input"
						id="fleet-name"
						v-model="selectedFleetId">
						<option :value="0">Select the Designated Fleet</option>
						<option
							v-for="(fleet, index) in availableFleets"
							:key="index"
							:value="fleet.id">
							{{ fleet.fleetname }}
						</option>
					</select>
					<div
						v-if="retrievingFleetList"
						class="absolute top-[38%] right-8 animate-spin inline-block size-5 border-[2px] border-gray-500 border-current border-t-transparent rounded-full"
						role="status"
						aria-label="loading" />
				</div>
			</div>
		</div>
		<div
			class="flex flex-col lg:flex-row items-center justify-between space-y-3 lg:space-y-0 space-x-0 lg:space-x-3 mt-7">
			<!-- Full Name Field -->
			<div class="w-full lg:w-1/3">
				<label
					for="contact-person-name"
					class="block font-medium mb-2 dark:text-white"
					>Contact Person Name</label
				>
				<input
					type="text"
					id="contact-person-name"
					disabled
					v-model="contactFullName"
					class="generic-input"
					placeholder="Client Name as On Their National ID" />
			</div>

			<!-- Phone Field -->
			<div class="w-full lg:w-1/3">
				<label
					for="contact-person-phone"
					class="block font-medium mb-2 dark:text-white"
					>Contact Person Phone</label
				>
				<input
					type="text"
					id="contact-person-phone"
					disabled
					v-model="contactPhoneNumber"
					class="generic-input"
					placeholder="254704080056" />
			</div>

			<!-- Email field -->
			<div class="w-full lg:w-1/3">
				<label
					for="contact-person-email"
					class="block font-medium mb-2 dark:text-white"
					>Contact Person Email</label
				>
				<input
					type="email"
					id="contact-person-email"
					disabled
					v-model="contactEmail"
					class="generic-input"
					placeholder="youremail@co.ke" />
			</div>
		</div>

		<!-- Download Excel document -->
		<h1 class="mt-16 text-2xl antialiased">Download Excel Template</h1>
		<div class="flex flex-col">
			<span class="text-lg text-gray-500"
				>Kindly download our Excel template and complete all columns
				exactly as provided. Please refrain from altering the column
				structure or their sequence.</span
			>
			<button
				type="button"
				class="py-3 px-4 w-full mt-3 h-16 items-center rounded-lg border-2 border-dotted text-white disabled:opacity-50 disabled:pointer-events-none inline-flex justify-between bg-pink-400 bg-opacity-50">
				<span class="text-pink-500">
					Click here to intiate excel template download
				</span>
				<Icon
					name="material-symbols-light:cloud-download"
					class="text-pink-400"
					size="38" />
			</button>
		</div>

		<!-- upload Excel document -->
		<h1 class="mt-10 text-2xl antialiased">Upload Excel Document</h1>
		<div class="flex flex-col">
			<span class="text-lg text-gray-500"
				>Please upload the completed document to proceed with your
				submission.</span
			>

			<div class="w-full">
				<label
					for="dropzone-file"
					class="mt-3 flex flex-col items-center justify-between border-[1.9px] border-gray-400 border-dashed cursor-pointer h-16 rounded-lg py-3 px-4 bg-blue-400 bg-opacity-50">
					<div class="flex items-center justify-between w-full">
						<span class="text-blue-500">
							Click here to upload the completed Excel document
						</span>
						<Icon
							name="material-symbols-light:cloud-upload"
							class="text-blue-400"
							size="38" />
					</div>
					<input
						id="dropzone-file"
						type="file"
						accept=".xlsx"
						class="hidden"
						@change="parseUploadedExcelFile" />
				</label>
			</div>
		</div>

		<div class="mt-3">
			<span
				class="font-medium"
				:class="
					errorMessage.type === 'error'
						? 'text-red-500'
						: 'text-green-500'
				"
				v-if="errorMessage"
				>{{ errorMessage.message }}</span
			>
			<div
				class="flex w-full h-3 bg-gray-200 rounded-full overflow-hidden"
				role="progressbar"
				aria-valuenow="1"
				aria-valuemin="0"
				aria-valuemax="100">
				<div
					class="flex flex-col justify-center rounded-full overflow-hidden bg-blue-600 text-xs text-white text-center whitespace-nowrap transition duration-500"
					:style="{ width: currentProgress }" />
			</div>
			<div
				class="flex items-center justify-between w-full text-end text-lg text-gray-500 antialiased">
				<span>PARSING PROGRESS</span>
				<span>{{ currentProgress }}</span>
			</div>
		</div>

		<button
			type="submit"
			:disabled="errorMessage !== null && errorMessage.type === 'error'"
			class="py-3 px-4 w-full mt-7 lg:w-1/2 text-lg h-16 items-center gap-x-2 font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none disabled:bg-gray-500">
			<span v-if="!formSubmissionLoading">Create Membership</span>
			<div
				v-if="formSubmissionLoading"
				class="animate-spin inline-block size-5 border-[3px] border-white border-current border-t-transparent text-gray-800 rounded-full"
				role="status"
				aria-label="loading" />
		</button>
	</form>
</template>

<script setup lang="ts">
	import readXlsxFile from "read-excel-file";
	import { type bulkProcessedType } from "~/types/types";
	import { type excelUploadErrMess } from "~/types/types";

	const formSubmissionLoading = ref(false);
	const { getPrincipal } = useAuth();
	const processedFleetData: Ref<bulkProcessedType[]> = ref([]);
	const route = useRoute();
	const currentPercentage = ref(0);
	const availableFleets: Ref<any[]> = ref([]);
	const { openToast } = useToast();
	const selectedFleetId: Ref<number> = ref(0);
	const retrievingFleetList: Ref<boolean> = ref(false);
	const contactFullName: Ref<string> = ref("");
	const contactPhoneNumber: Ref<string> = ref("");
	const contactEmail: Ref<string> = ref("");
	const runtimeConfig = useRuntimeConfig();
	const totalSize = ref(0);
	const currentProgress = ref("0%");
	const reader = new FileReader();
	const errorMessage: Ref<excelUploadErrMess | null> = ref(null);

	watch(selectedFleetId, (newFleetId) => {
		const fleetDetails: any = availableFleets.value.find(
			(fleet: any) => fleet.id === newFleetId
		);

		contactFullName.value = fleetDetails.contact_full_name;
		contactPhoneNumber.value = fleetDetails.contact_phone_number;
		contactEmail.value = fleetDetails.contact_email;
	});

	const registerBulkMember = async (): Promise<void> => {
		formSubmissionLoading.value = true;
		try {
			await $fetch("/api/v1/memberships/bulk", {
				baseURL: runtimeConfig.public.AVA_BASE_URL,
				method: "POST",
				body: JSON.stringify(processedFleetData.value),
				async onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error("Failed to create bulk memberships");
					}

					openToast("Memberships created successfully.", "success");
				},
			});
		} catch (error) {
			console.log("An error occured: ", error);
			openToast("Operation failed. Please try again!", "danger");
		} finally {
			formSubmissionLoading.value = false;
		}
	};

	const parseUploadedExcelFile = async (e: any): Promise<void> => {
		const selectedFile = e.target.files[0];

		if (selectedFile) {
			addListeners(reader);
			reader.readAsDataURL(selectedFile);
		}

		try {
			const data = await readXlsxFile(selectedFile);
			validateUploadedDataIntegrity(data);
			pushFleetDataPostValidation(data);
			const errorMss: excelUploadErrMess = {
				message: "File validation passed successfully",
				type: "success",
			};
			errorMessage.value = errorMss;
		} catch (err) {
			console.log("An error has occured: ", err);
			const errorMss: excelUploadErrMess = {
				message: err,
				type: "error",
			};
			errorMessage.value = errorMss;
			processedFleetData.value = [];
		}
	};

	function validateUploadedDataIntegrity(data: Object[]): void {
		// each item here is the individual row in the excel converted to an arrat
		data.forEach((item: any, index: number) => {
			if (index === 0) return;

			// check for client name
			if (item[0] === null)
				throw new Error(
					`Name of client on row ${index + 1} is missing`
				);

			// check for client phone number
			if (item[1] === null)
				throw new Error(
					`Phone of client number on row ${index + 1} is missing`
				);

			// check for vehicle registration
			if (item[3] === null)
				throw new Error(
					`Vehicle of client registration on row ${
						index + 1
					} is missing`
				);

			// check for start date
			if (item[4] === null)
				throw new Error(
					`Start date of client insurance on row ${
						index + 1
					} is missing`
				);

			// check for end date
			if (item[5] === null)
				throw new Error(
					`End date of client insurance on row ${
						index + 1
					} is missing`
				);
		});
	}

	function pushFleetDataPostValidation(data: Object[]) {
		data.forEach((item: any, index: number) => {
			if (index === 0) return;
			processedFleetData.value.push({
				full_name: toTitleCase(item[0]),
				phone_number: `254${item[1]}`,
				userEmail: item[2],
				corporateId: getPrincipal.value.corpId,
				membershipTypeId: Number(route.query.membershipTypeId),
				available_free_distance: route.query.freeDistance,
				registration: item[3],
				start_date: item[4],
				end_date: item[5],
				make: "N/A",
				model: "N/A",
				color: "N/A",
				payment_status: "paid",
				membership_status: "active",
				recordedBy: getPrincipal.value.userId,
				category: "corporate",
				fleetId: selectedFleetId.value,
			});
		});

		console.log("Processed fleet data: ", processedFleetData.value);
	}

	onMounted(async () => {
		retrievingFleetList.value = true;
		try {
			await $fetch(
				`/api/v1/fleets/corporate/${getPrincipal.value.corpId}`,
				{
					baseURL: runtimeConfig.public.AVA_BASE_URL,
					method: "GET",
					async onResponse({ response }) {
						if (response.status !== 200) {
							throw new Error("Failed to retrieve fleets");
						}
						availableFleets.value = response._data;
						console.log(
							"Available fleets: ",
							availableFleets.value
						);
						retrievingFleetList.value = false;
					},
				}
			);
		} catch (error) {
			console.log("An error occured: ", error);
			retrievingFleetList.value = false;
			openToast("Failed to retrieve fleets! Reload page!", "danger");
		}
	});

	// Handle the file reading events
	function handleEvent(event: any) {
		if (event.type === "progress") {
			currentProgress.value = `${
				(event.loaded / totalSize.value).toFixed(2) * 100
			}%`;
		}
		if (event.type === "loadstart") {
			totalSize.value = event.total;
		}
	}

	// Attach event listeners to the reader
	function addListeners(reader: any) {
		reader.addEventListener("loadstart", handleEvent);
		reader.addEventListener("load", handleEvent);
		reader.addEventListener("loadend", handleEvent);
		reader.addEventListener("progress", handleEvent);
		reader.addEventListener("error", handleEvent);
		reader.addEventListener("abort", handleEvent);
	}
</script>

<style>
	.progressbar {
		width: v-bind(currentPercentage.value) %;
	}
</style>

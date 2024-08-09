<template>
	<form @submit.prevent="registerBulkMember">
		<div
			class="flex flex-col items-center justify-between space-x-0 space-y-3 lg:flex-row lg:space-x-3 lg:space-y-0">
			<!-- Full Name Field -->
			<div class="w-full">
				<label
					for="fleet-name"
					class="mb-2 block font-medium dark:text-white"
					>Client Fleet</label
				>
				<div class="relative">
					<select
						class="generic-input"
						id="fleet-name"
						v-model="selectedFleetId"
						required>
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
						class="absolute right-8 top-[38%] inline-block size-5 animate-spin rounded-full border-[2px] border-current border-gray-500 border-t-transparent"
						role="status"
						aria-label="loading" />
				</div>
			</div>
		</div>
		<div
			class="mt-7 flex flex-col items-center justify-between space-x-0 space-y-3 lg:flex-row lg:space-x-3 lg:space-y-0">
			<!-- Full Name Field -->
			<div class="w-full lg:w-1/3">
				<label
					for="contact-person-name"
					class="mb-2 block font-medium dark:text-white"
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
					class="mb-2 block font-medium dark:text-white"
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
					class="mb-2 block font-medium dark:text-white"
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
		<h1 class="mt-5 text-2xl antialiased">Download Excel Template</h1>
		<div class="flex flex-col">
			<span class="text-lg text-gray-500"
				>Kindly download our Excel template and complete all columns exactly as provided.
				Kindly refrain from altering the column structure or their sequence.</span
			>
			<a
				href="https://drive.google.com/uc?export=download&id=17h3Nh3de8p4bQvxjgkEWnsfozGsIqG1p"
				target="_top"
				type="button"
				class="mt-3 inline-flex h-16 w-full items-center justify-between rounded-lg border-[1.9px] border-dashed bg-pink-400 bg-opacity-50 px-4 py-3 text-white disabled:pointer-events-none disabled:opacity-50">
				<span class="text-pink-500"> Click here to intiate excel template download </span>
				<Icon
					name="material-symbols-light:cloud-download"
					class="text-pink-400"
					size="38" />
			</a>
		</div>

		<!-- upload Excel document -->
		<h1 class="mt-5 text-2xl antialiased">Upload Excel Document</h1>
		<div class="flex flex-col">
			<span class="text-lg text-gray-500"
				>Please upload the completed document to proceed with your submission.</span
			>

			<div class="w-full">
				<label
					for="dropzone-file"
					class="mt-3 flex h-16 cursor-pointer flex-col items-center justify-between rounded-lg border-[1.9px] border-dashed border-gray-400 bg-blue-400 bg-opacity-50 px-4 py-3">
					<div class="flex w-full items-center justify-between">
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
				:class="errorMessage.type === 'error' ? 'text-red-500' : 'text-green-500'"
				v-if="errorMessage"
				>{{ errorMessage.message }}</span
			>
			<div
				class="flex h-3 w-full overflow-hidden rounded-full bg-gray-200"
				role="progressbar"
				aria-valuenow="1"
				aria-valuemin="0"
				aria-valuemax="100">
				<div
					class="flex flex-col justify-center overflow-hidden whitespace-nowrap rounded-full bg-blue-600 text-center text-xs text-white transition duration-500"
					:style="{ width: currentProgress }" />
			</div>
			<div
				class="flex w-full items-center justify-between text-end text-lg text-gray-500 antialiased">
				<span>PARSING PROGRESS</span>
				<span>{{ currentProgress }}</span>
			</div>
		</div>

		<button
			type="submit"
			:disabled="errorMessage !== null && errorMessage.type === 'error'"
			class="mt-7 h-16 w-full items-center gap-x-2 rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-lg font-semibold text-white hover:bg-blue-700 disabled:pointer-events-none disabled:bg-gray-500 disabled:opacity-50 lg:w-1/2">
			<span v-if="!formSubmissionLoading">Create Membership</span>
			<div
				v-if="formSubmissionLoading"
				class="inline-block size-5 animate-spin rounded-full border-[3px] border-current border-white border-t-transparent text-gray-800"
				role="status"
				aria-label="loading" />
		</button>
	</form>
</template>

<script setup lang="ts">
	import readXlsxFile from 'read-excel-file';
	import { type bulkProcessedType } from '~/types/types';
	import { type excelUploadErrMess } from '~/types/types';

	const formSubmissionLoading = ref(false);
	const { getPrincipal } = useAuth();
	const processedFleetData: Ref<bulkProcessedType[]> = ref([]);
	const route = useRoute();
	const currentPercentage = ref(0);
	const { openToast } = useToast();
	const selectedFleetId: Ref<number> = ref(0);
	const contactFullName: Ref<string> = ref('');
	const contactPhoneNumber: Ref<string> = ref('');
	const contactEmail: Ref<string> = ref('');
	const runtimeConfig = useRuntimeConfig();
	const totalSize = ref(0);
	const currentProgress = ref('0%');
	const reader = new FileReader();
	const errorMessage: Ref<excelUploadErrMess | null> = ref(null);

	const { data: availableFleets, pending: retrievingFleetList } = useFetch(
		`/api/v1/fleets/corporate/${getPrincipal.value.corpId}`,
		{
			baseURL: runtimeConfig.public.AVA_BASE_URL,
			method: 'GET',
			onRequestError() {
				openToast('Failed to retrieve fleets! Reload page!', 'danger');
			},
		},
	) as any;

	watch(selectedFleetId, (newFleetId) => {
		const fleetDetails: any = availableFleets.value.find(
			(fleet: any) => fleet.id === newFleetId,
		);

		contactFullName.value = fleetDetails.contact_full_name;
		contactPhoneNumber.value = fleetDetails.contact_phone_number;
		contactEmail.value = fleetDetails.contact_email;
	});

	const registerBulkMember = async (): Promise<void> => {
		formSubmissionLoading.value = true;
		try {
			await $fetch('/api/v1/memberships/bulk', {
				baseURL: runtimeConfig.public.AVA_BASE_URL,
				method: 'POST',
				body: JSON.stringify(processedFleetData.value),
				async onResponse({ response }) {
					if (response.status !== 200) {
						throw new Error('Failed to create bulk memberships');
					}

					openToast('Memberships created successfully.', 'success');
				},
			});
		} catch (error) {
			console.log('An error occured: ', error);
			openToast('Operation failed. Please try again!', 'danger');
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
				message: 'File validation passed successfully',
				type: 'success',
			};
			errorMessage.value = errorMss;
		} catch (err) {
			console.log('An error has occured: ', err);
			const errorMss: excelUploadErrMess = {
				message: err,
				type: 'error',
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
			if (item[0] === null) throw new Error(`Name of client on row ${index + 1} is missing`);

			// check for client phone number
			if (item[1] === null)
				throw new Error(`Phone of client number on row ${index + 1} is missing`);

			// check for vehicle registration
			if (item[3] === null)
				throw new Error(`Vehicle of client on row ${index + 1} is missing`);

			// check for start date
			if (item[4] === null)
				throw new Error(`Start date of client on row ${index + 1} is missing`);

			// check for end date
			if (item[5] === null)
				throw new Error(`End date of client on row ${index + 1} is missing`);
		});
	}

	function pushFleetDataPostValidation(data: Object[]) {
		data.forEach((item: any, index: number) => {
			if (index === 0) return;
			processedFleetData.value.push({
				corpName: getPrincipal.value.corpName,
				full_name: toTitleCase(item[0]),
				phone_number: `254${item[1]}`,
				userEmail: item[2],
				corporateId: getPrincipal.value.corpId,
				membershipTypeId: Number(route.query.membershipTypeId),
				available_free_distance: route.query.freeDistance,
				registration: item[3],
				start_date: item[4],
				end_date: item[5],
				make: 'N/A',
				model: 'N/A',
				color: 'N/A',
				payment_status: 'paid',
				membership_status: 'active',
				recordedBy: getPrincipal.value.userId,
				category: 'corporate',
				fleetId: selectedFleetId.value,
			});
		});

		console.log('Processed fleet data: ', processedFleetData.value);
	}

	// Handle the file reading events
	function handleEvent(event: any) {
		if (event.type === 'progress') {
			currentProgress.value = `${(event.loaded / totalSize.value).toFixed(2) * 100}%`;
		}
		if (event.type === 'loadstart') {
			totalSize.value = event.total;
		}
	}

	// Attach event listeners to the reader
	function addListeners(reader: any) {
		reader.addEventListener('loadstart', handleEvent);
		reader.addEventListener('load', handleEvent);
		reader.addEventListener('loadend', handleEvent);
		reader.addEventListener('progress', handleEvent);
		reader.addEventListener('error', handleEvent);
		reader.addEventListener('abort', handleEvent);
	}
</script>

<style>
	.progressbar {
		width: v-bind(currentPercentage);
	}
</style>

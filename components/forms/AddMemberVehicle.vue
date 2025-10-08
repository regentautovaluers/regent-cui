<template>
	<form @submit.prevent="addMemberVehicles(props.membershipId, [userVehicles])">
		<label
			class="generic-input-label"
			for="membership-type"
			>Select Membership Type</label
		>

		<div class="relative">
			<select
				class="generic-input"
				id="membership-type"
				required
				v-model="userVehicles.membershipTypeId">
				<option
					v-for="(type, index) in membershipTypes"
					:key="index"
					:value="type.id">
					{{ type.membership_name }}
				</option>
			</select>
			<FormSubmissionLoader
				class="absolute top-[34%] right-6 mr-2 size-5 animate-spin text-gray-500"
				v-if="fetchmembershipTypesStatus === 'pending'" />
		</div>
		<div class="mt-2">
			<!-- this field is hidden. it holds the data for membershipTypeId -->
			<input
				type="text"
				hidden
				v-model="userVehicles.membershipTypeId" />
			<div
				class="mt-2 flex flex-col items-center justify-between space-y-3 space-x-0 lg:flex-row lg:space-y-0 lg:space-x-3">
				<!-- Vehicle Make -->
				<div class="w-full lg:w-1/2">
					<label
						for="vehicle-make"
						class="generic-input-label"
						>Vehicle Make</label
					>
					<input
						type="text"
						id="vehicle-make"
						class="generic-input"
						placeholder="e.g Toyota"
						required
						v-model="userVehicles.make" />
				</div>

				<!-- Vehicle Model -->
				<div class="w-full lg:w-1/2">
					<label
						for="vehicle-model"
						class="generic-input-label"
						>Vehicle Model</label
					>
					<input
						type="text"
						id="vehicle-model"
						class="generic-input"
						placeholder="e.g Corolla"
						required
						v-model="userVehicles.model" />
				</div>
			</div>
			<div class="my-2 flex items-center justify-between space-x-2">
				<!--Vehicle Color Field -->
				<div class="w-1/2">
					<label
						for="full-name"
						class="generic-input-label"
						>Vehicle Color</label
					>
					<input
						type="text"
						id="full-name"
						class="generic-input"
						placeholder="e.g Red"
						required
						v-model="userVehicles.color" />
				</div>

				<div class="w-1/2">
					<label
						for="vehicle-registration-number"
						class="generic-input-label"
						>Registration Number</label
					>
					<input
						type="text"
						id="vehicle-registration-number"
						class="generic-input"
						placeholder="KCD 345G"
						required
						v-model="userVehicles.registration" />
				</div>
			</div>

			<div class="mt-2 flex items-center justify-between space-x-2">
				<!-- Payment Status Field -->
				<div class="w-full">
					<label
						for="payment-status"
						class="generic-input-label"
						>Payment Status</label
					>
					<select
						class="generic-input"
						id="payment-status"
						required
						v-model="userVehicles.payment_status">
						<option value="">Select a Payment Status</option>
						<option
							v-for="(status, index) in ['Paid', 'Not Paid']"
							:key="index"
							:value="status.toLocaleLowerCase()">
							{{ status }}
						</option>
					</select>
				</div>
				<!-- Payment Status Field -->
				<div class="w-full">
					<label
						for="membership-status"
						class="generic-input-label"
						>Membership Status</label
					>
					<select
						class="generic-input"
						id="membership-status"
						required
						v-model="userVehicles.membership_status">
						<option value="">Select a Membership Status</option>
						<option
							v-for="(status, index) in ['Active', 'Inactive']"
							:key="index"
							:value="status.toLocaleLowerCase()">
							{{ status }}
						</option>
					</select>
				</div>
			</div>
			<!-- Cover Period -->
			<div class="mt-3 flex items-center justify-between space-x-3">
				<!-- Starting date Field -->
				<div class="w-1/2">
					<label
						for="cover-period-starts"
						class="generic-input-label"
						>Cover Period Starts</label
					>
					<input
						type="date"
						id="cover-period-starts"
						class="generic-input"
						placeholder="Enter Customer Name as Seen In Their National ID"
						pattern="\d{4}-\d{2}-\d{2}"
						required
						v-model="userVehicles.start_date" />
				</div>

				<!-- Ending date Field -->
				<div class="w-1/2">
					<label
						for="cover-period-ends"
						class="generic-input-label"
						>Cover Period Ends</label
					>
					<input
						type="date"
						id="cover-period-ends"
						class="generic-input"
						placeholder="Enter Customer Name as Seen In Their National ID"
						pattern="\d{4}-\d{2}-\d{2}"
						required
						v-model="userVehicles.end_date" />
				</div>
			</div>
		</div>

		<!-- submit button -->
		<button
			type="submit"
			:class="[
				'generic-form-submit mt-4',
				addMemberVehicleLoading && 'skeleton skeleton-animated',
			]">
			{{ addMemberVehicleLoading ? 'Please Wait...' : 'Add Vehicle' }}
		</button>
	</form>
</template>

<script setup lang="ts">
	import { type IndividuaProcessedMembershipType } from '~/types';

	const props = defineProps({
		membershipId: { required: true, type: Number },
	});
	const { getPrincipal } = useAuth();
	const { fetchmembershipTypesStatus, membershipTypes } = useAVAMembershipTypes();
	const { addMemberVehicleLoading, addMemberVehicles } = useAVAMemberships();

	const userVehicles: IndividuaProcessedMembershipType = reactive({
		corpName: getPrincipal.value?.corpName,
		membershipTypeId: 0,
		registration: '',
		make: '',
		model: '',
		color: '',
		payment_status: '',
		membership_status: '',
		start_date: '',
		end_date: '',
	});
</script>

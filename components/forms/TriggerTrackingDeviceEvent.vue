<template>
	<form @submit.prevent="triggerDeviceCommand(props.deviceId)">
		<!-- Full Name Field -->
		<div class="relative">
			<label
				for="fleet-name"
				class="generic-input-label"
				>Event Category</label
			>
			<select
				class="generic-input h-[60px]"
				id="fleet-name"
				v-model="selectedCommand"
				required>
				<option :value="0">Select the Command to Trigger</option>
				<option
					v-for="(command, index) in enabledDeviceCommands"
					:key="index"
					:value="command">
					{{ command.title }}
				</option>
			</select>
			<FormSubmissionLoader
				class="mr-2 absolute top-[52%] right-6 size-5 animate-spin text-gray-500"
				v-if="getDeviceCommandsLoading" />
		</div>

		<!-- submit button -->
		<button
			type="submit"
			:class="[
				'generic-form-submit mt-3 w-full',
				triggerDeviceCommandLoading && 'skeleton skeleton-animated',
			]">
			{{ triggerDeviceCommandLoading ? 'Please Wait...' : 'Trigger' }}
		</button>
	</form>
</template>

<script setup lang="ts">
	import { useTrackedDeviceCommandsAndHistory } from '~/composables/useRegentTracking';

	const {
		selectedCommand,
		enabledDeviceCommands,
		triggerDeviceCommandLoading,
		triggerDeviceCommand,
		getDeviceCommandsLoading,
		getEnabledDeviceCommands,
	} = useTrackedDeviceCommandsAndHistory();

	const props = defineProps({
		deviceId: {
			required: true,
			type: Number,
		},
	});

	onMounted(async () => {
		await getEnabledDeviceCommands(props.deviceId);
	});
</script>

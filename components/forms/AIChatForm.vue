<template>
	<form
		@submit.prevent="handleConvFormSubmitted"
		class="w-full">
		<div class="flex items-center space-x-3">
			<input
				type="text"
				placeholder="Say hi or hello or konichiwa..."
				class="w-3/4 rounded-full border border-gray-600 px-5 py-4 text-gray-500 outline-none ring-1 ring-gray-600 transition-all duration-200 ease-in-out focus:border-gray-700 focus:ring-2 focus:ring-gray-700"
				v-model="userInput" />
			<button
				type="submit"
				data-drawer-target="dashboard-chat-window"
				data-drawer-show="dashboard-chat-window"
				data-drawer-placement="right"
				data-drawer-backdrop="false"
				aria-controls="dashboard-chat-window"
				class="generic-form-submit mb-0 w-1/4 rounded-full bg-blue-600 shadow-md">
				Send Request
			</button>
		</div>
	</form>
</template>

<script setup lang="ts">
	const userInput: Ref<string> = ref('');

	const { appendTextTypeNode, sendBotpressMessage } = useAssistantConversation();
	const handleConvFormSubmitted = () => {
		sendBotpressMessage(userInput.value);
		appendTextTypeNode(userInput.value, 'Human');
		userInput.value = '';
	};
</script>

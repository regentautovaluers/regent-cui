<template>
	<form
		@submit.prevent="handleConvFormSubmitted"
		class="tablet:flex-row tablet:space-x-3 tablet:space-y-0 tablet:justify-center tablet:w-[60%] flex w-full flex-col items-center space-y-3 space-x-0 px-2">
		<input
			type="text"
			placeholder="Say hi or hello or konichiwa..."
			class="tablet:w-3/6 w-full rounded-full border border-gray-600 px-5 py-4 text-gray-500 ring-1 ring-gray-600 transition-all duration-200 ease-in-out outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-700"
			v-model="userInput" />
		<button
			type="submit"
			data-drawer-target="dashboard-chat-window"
			data-drawer-show="dashboard-chat-window"
			data-drawer-placement="right"
			data-drawer-backdrop="false"
			aria-controls="dashboard-chat-window"
			class="generic-form-submit tablet:w-1/4 mb-0 w-full rounded-full bg-blue-600 whitespace-nowrap shadow-md">
			Send Request
		</button>
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

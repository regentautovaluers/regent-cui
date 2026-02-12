import { defineStore } from 'pinia';
import type { ChatResponse, ExistingSessionSlim } from '~/types/ava-ai-chat-types';

export const useAVAAiChatStore = defineStore('useAVAAiChatStore', () => {
	const ongoingSessions: Ref<
		{
			sessionId: string;
			messages: ChatResponse[];
		}[]
	> = ref([]);
	const existingSessions: Ref<ExistingSessionSlim[]> = ref([]);

	function getChatMessages(sessionId: string): ChatResponse[] {
		return ongoingSessions.value.find((e) => e.sessionId == sessionId)
			?.messages as ChatResponse[];
	}

	function pushChatMessage(sessionId: string, message: ChatResponse[]) {
		const index = ongoingSessions.value.findIndex((e) => e.sessionId == sessionId);
		if (index >= 0) {
			message.forEach((e) => ongoingSessions.value[index].messages.push(e));
			return;
		}

		ongoingSessions.value.push({
			sessionId,
			messages: message,
		});
	}

	function ongoingSessionContains(sessionId: string): boolean {
		const index = ongoingSessions.value.findIndex((e) => e.sessionId == sessionId);

		if (index >= 0) {
			return true;
		}
		return false;
	}

	function setExistingSessions(sessions: ExistingSessionSlim[]) {
		existingSessions.value = [...existingSessions.value, ...sessions];
	}

	function getExistingSessions() {
		return existingSessions.value;
	}

	return {
		getChatMessages,
		pushChatMessage,
		setExistingSessions,
		getExistingSessions,
		ongoingSessionContains,
	};
});

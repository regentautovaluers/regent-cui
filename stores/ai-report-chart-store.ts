import { defineStore } from 'pinia';
import type { ChatMessage, InitializeChatReponseStruct } from '~/types/ai-reports-chat-types';

export const useAiReportChatStore = defineStore('ai-report-chat-store', () => {
	const chatMessages = ref<{ sessionId: string; bookingId: string; messages: ChatMessage[] }[]>(
		[],
	);

	function setSessionContext(newSession: InitializeChatReponseStruct) {
		chatMessages.value.push({
			sessionId: newSession.session_id,
			bookingId: newSession.booking_id,
			messages: [],
		});
	}

	function getSessionContext(report_id: string) {
		return chatMessages.value.find((e) => e.bookingId === report_id);
	}

	function setChatMessage(session_id: string, newMessage: ChatMessage) {
		const session = chatMessages.value.find((e) => e.sessionId === session_id);
		if (session) {
			session.messages.push(newMessage);
		}
	}

	function cleanChatMessages() {
		chatMessages.value = [];
	}

	function cleanChatMessage(session_id: string) {
		const index = chatMessages.value.findIndex((e) => e.sessionId === session_id);
		if (index !== -1) {
			chatMessages.value[index].messages = [];
		}
	}

	return {
		chatMessages,
		setSessionContext,
		getSessionContext,
		setChatMessage,
		cleanChatMessages,
		cleanChatMessage,
	};
});

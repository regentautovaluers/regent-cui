import { defineStore } from 'pinia';
import type { ChatMessage, InitializeChatReponseStruct } from '~/types/ai-reports-chat-types';

export const useAiReportChatStore = defineStore('ai-report-chat-store', () => {
	const chatMessages = ref<
		{ sessionId: string; bookingId: string; isVisible: boolean; messages: ChatMessage[] }[]
	>([]);

	function setSessionContext(newSession: InitializeChatReponseStruct) {
		chatMessages.value.push({
			sessionId: newSession.session_id,
			bookingId: newSession.booking_id,
			isVisible: true,
			messages: newSession.history as ChatMessage[],
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

	function deleteChatSession(session_id: string, bookingId: string) {
		const index = chatMessages.value.findIndex(
			(e) => e.sessionId === session_id && e.bookingId == bookingId,
		);
		if (index !== -1) {
			chatMessages.value.splice(index, 1);
		}
	}

	function markSessionAsHidden(session_id: string, report_id: string) {
		const index = chatMessages.value.findIndex(
			(e) => e.sessionId === session_id && e.bookingId == report_id,
		);
		if (index !== -1) {
			chatMessages.value[index].isVisible = false;
		}
	}

	function markSessionAsVisible(report_id: string): boolean {
		const index = chatMessages.value.findIndex((e) => e.bookingId == report_id);
		if (index !== -1) {
			chatMessages.value[index].isVisible = true;
			return true;
		}

		return false;
	}

	return {
		chatMessages,
		setSessionContext,
		getSessionContext,
		setChatMessage,
		deleteChatSession,
		markSessionAsHidden,
		markSessionAsVisible,
	};
});

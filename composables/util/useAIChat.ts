import type {
	InitializeChatReponseStruct,
	GetChatSessionStatusStruct,
	ChatMessage,
} from '~/types/ai-reports-chat-types';
import type { StandardSuccessResponse } from '~/types/proxy-types';
import * as aiChatStore from '~/stores/ai-report-chart-store';

export default function () {
	const sampleQuestions: readonly string[] = [
		'When was this report produced?',
		'Who is the owner of the vehicle in this report?',
		'Summarize for me the values awarded for this vehicle.',
		'Does the vehicle have any defects of concern?',
		'Is the vehicle interior in good condition?',
	];
	const { post, get } = useStandardizedApi();
	const initializingChatOrAwaitingAnswer: Ref<boolean> = ref(false);
	const userQuery: Ref<string | null> = ref(null);
	const isChatOpen: Ref<boolean> = ref(false);

	const computedSessionId: ComputedRef<string | undefined> = computed(
		() => aiChatStore.getSessionContext.value?.session_id,
	);

	// const getConversation = computed(() => aiChatStore.getMessagesBySession.value.)

	async function initializeChat(report_url: string, booking_id: string, report_type: string) {
		const endpoint = '/api/ai-reports-chat/initialize-chat';

		initializingChatOrAwaitingAnswer.value = true;
		try {
			let response = await post<InitializeChatReponseStruct>(endpoint, {
				report_url,
				booking_id,
				report_type,
			});

			if (response.success) {
				const data = (response as StandardSuccessResponse<InitializeChatReponseStruct>)
					.data;
				aiChatStore.setSessionContext(data);
			}
		} catch (ex) {
			useToast('Failed to start chat! Try Again!', {
				type: 'error',
				title: 'Error',
			});
		} finally {
			initializingChatOrAwaitingAnswer.value = false;
		}
	}

	async function getChatSession() {
		const endpoint = '/api/ai-reports-chat/read-session-status';

		try {
			let response = await get(endpoint, {
				session_id: computedSessionId.value,
			});

			if (response.success) {
				const data = (response as StandardSuccessResponse<GetChatSessionStatusStruct>).data;
			}
		} catch (ex) {
			useToast('Failed to verify session!!', {
				type: 'error',
				title: 'Error',
			});
		}
	}

	async function requestAnswer(question?: string) {
		const endpoint = '/api/ai-reports-chat/ask-question';
		initializingChatOrAwaitingAnswer.value = true;
		try {
			let response = await post(endpoint, {
				session_id: computedSessionId.value,
				question: !question ? (userQuery.value as string) : question,
			});

			if (response.success) {
				const data = (response as StandardSuccessResponse<ChatMessage>).data;
				aiChatStore.setChatMessage({
					session_id: computedSessionId.value as string,
					newMessage: data,
				});
			}
		} catch (ex) {
			useToast('Failed get answer! Try again!', {
				type: 'error',
				title: 'Error',
			});
		} finally {
			initializingChatOrAwaitingAnswer.value = false;
		}
	}

	return {
		isChatOpen,
		sampleQuestions,
		userQuery,
		initializingChatOrAwaitingAnswer,
		computedSessionId,
		initializeChat,
		getChatSession,
		requestAnswer,
	};
}

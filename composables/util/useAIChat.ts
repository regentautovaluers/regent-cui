import type {
	InitializeChatReponseStruct,
	GetChatSessionStatusStruct,
	ChatMessage,
} from '~/types/ai-reports-chat-types';
import type { StandardSuccessResponse } from '~/types/proxy-types';
import { useAiReportChatStore } from '~/stores/ai-report-chart-store';
import { marked } from 'marked';

export default function (reportId: string) {
	const sampleQuestions: readonly string[] = [
		'When was this report produced?',
		'Who is the owner of the vehicle in this report?',
		'Summarize for me the values awarded for this vehicle.',
		'Does the vehicle have any defects of concern?',
		'Is the vehicle interior in good condition?',
	];
	const { post, get, delete: del } = useStandardizedApi();
	const initializingChat: Ref<boolean> = ref(false);
	const awaitingAnswer: Ref<boolean> = ref(false);
	const userQuery: Ref<string | null> = ref(null);
	const isChatOpen: Ref<boolean> = ref(false);
	const {
		setSessionContext,
		getSessionContext,
		setChatMessage,
		deleteChatSession,
		markSessionAsHidden,
		markSessionAsVisible,
	} = useAiReportChatStore();
	const { getPrincipal } = useAuth();
	const deleteChatRequestLoading: Ref<boolean> = ref(false);

	const computedChatSession = computed(() => {
		let context = getSessionContext(reportId);
		return context;
	});

	async function initializeChat(report_url: string, booking_id: string, report_type: string) {
		const endpoint = '/api/ai-reports-chat/initialize-chat';

		initializingChat.value = true;
		try {
			if (!markSessionAsVisible(booking_id)) {
				let response = await post<InitializeChatReponseStruct>(endpoint, {
					report_url,
					booking_id,
					report_type,
					user_id: getPrincipal.value?.userId,
				});

				if (response.success) {
					const data = (response as StandardSuccessResponse<InitializeChatReponseStruct>)
						.data;
					setSessionContext(data);
				}
			}

			isChatOpen.value = true;
		} catch (ex) {
			useToast('Failed to start chat! Try Again!', {
				type: 'error',
				title: 'Error',
			});
		} finally {
			initializingChat.value = false;
		}
	}

	async function getChatSession() {
		const endpoint = '/api/ai-reports-chat/read-session-status';

		try {
			let response = await get(endpoint, {
				session_id: computedChatSession.value?.sessionId,
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
		awaitingAnswer.value = true;

		try {
			// set the user's question into the chat
			setChatMessage(computedChatSession.value?.sessionId as string, {
				role: 'user',
				question: !question ? (userQuery.value as string) : question,
				timestamp: new Date().toISOString(),
			});

			let response = await post(endpoint, {
				session_id: computedChatSession.value?.sessionId,
				question: !question ? (userQuery.value as string) : question,
			});

			if (response.success) {
				userQuery.value = null;
				const data = (response as StandardSuccessResponse<ChatMessage>).data;
				setChatMessage(computedChatSession.value?.sessionId as string, data);
			}
		} catch (ex) {
			useToast('Failed get answer! Try again!', {
				type: 'error',
				title: 'Error',
			});
		} finally {
			awaitingAnswer.value = false;
		}
	}

	async function deleteChat() {
		const endpoint = `/api/ai-reports-chat/drop-session?session_id=${computedChatSession.value?.sessionId as string}`;

		deleteChatRequestLoading.value = true;
		try {
			const response = await del<null>(endpoint);
			if (response.success) {
				// client-side cleanup
				isChatOpen.value = false;
				deleteChatSession(computedChatSession.value?.sessionId as string, reportId);

				useToast('Successfully purged session!', {
					type: 'success',
					title: 'Succesfully Deleted Session!',
				});
			}
		} catch (ex) {
			useToast('Request failed! Try Again!', {
				type: 'error',
				title: 'Error',
			});
		} finally {
			deleteChatRequestLoading.value = false;
		}
	}

	function renderMarkdown(mdtext: string) {
		if (!mdtext) return '';
		// 'marked.parse' converts the markdown string to HTML
		return marked.parse(mdtext);
	}

	function renderSessionAsHidden() {
		markSessionAsHidden(computedChatSession.value?.sessionId as string, reportId);
		isChatOpen.value = false;
	}

	return {
		isChatOpen,
		sampleQuestions,
		userQuery,
		initializingChat,
		awaitingAnswer,
		computedChatSession,
		deleteChatRequestLoading,
		initializeChat,
		getChatSession,
		requestAnswer,
		renderMarkdown,
		deleteChat,
		renderSessionAsHidden,
	};
}

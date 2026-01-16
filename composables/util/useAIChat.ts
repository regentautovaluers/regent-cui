import type {
	InitializeChatReponseStruct,
	GetChatSessionStatusStruct,
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
	const initializingChat: Ref<boolean> = ref(false);

	const computedSessionId: ComputedRef<string | undefined> = computed(
		() => aiChatStore.getSessionContext.value?.session_id,
	);

	async function initializeChat(report_url: string, booking_id: string, report_type: string) {
		const endpoint = '/api/ai-reports-chat/initialize-chat';

		initializingChat.value = true;
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
			initializingChat.value = false;
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

	return {
		sampleQuestions,
		initializeChat,
		getChatSession,
	};
}

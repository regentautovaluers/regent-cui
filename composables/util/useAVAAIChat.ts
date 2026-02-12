import type { ChatResponse } from '~/types/ava-ai-chat-types';
import type { StandardSuccessResponse } from '~/types/proxy-types';

export default function () {
	const sampleQuestions: readonly string[] = [
		'Which vehicles usually fetch a value above 2 million shillings?',
		'How far back does your data set reach?',
		'What is the average market value of a Mercedes?',
		'Which Toyota car fetches the highest market value?',
		'Compare the market value of a Toyota versus a Mercedes',
	];
	const { getChatMessages, pushChatMessage } = useAVAAiChatStore();
	const { post, get, delete: del } = useStandardizedApi();
	const { getPrincipal } = useAuth();
	const awaitingAnswer: Ref<boolean> = ref(false);
	const userQuery: Ref<string | null> = ref(null);
	const activeSessionId: Ref<string | null> = ref('sess_7e27f29732a64817b4ebbd030635d694');

	async function submitQuestion() {
		const endpoint = '/api/ava-chat/request-answer';
		awaitingAnswer.value = true;

		try {
			const user = getPrincipal();
			const response = await post<ChatResponse>(endpoint, {
				session_id: !activeSessionId ? null : activeSessionId.value,
				message: userQuery.value,
				user_id: user?.userId,
				corp_id: user?.corpOrganization.corpId,
			});

			if (response.success) {
				const data: ChatResponse = (response as StandardSuccessResponse<ChatResponse>).data;
				const toAdd: ChatResponse[] = [
					{
						origin: 'user',
						response: userQuery.value,
						response_status: 'successful',
					},
					data,
				];

				// add in the chat message
				pushChatMessage(data.session_id as string, toAdd);

				// reset the user query
				userQuery.value = null;

				// set session id to the received one
				activeSessionId.value = data.session_id as string;
			}
		} catch (ex) {
			if (activeSessionId.value) {
				const toAdd: ChatResponse[] = [
					{
						origin: 'user',
						response: userQuery.value,
						response_status: 'successful',
					},
					{
						origin: 'user',
						response: 'Something went wrong. Kindly repeat the question :(',
						response_status: 'error',
					},
				];

				// add in the chat message
				pushChatMessage(activeSessionId.value as string, toAdd);
				return;
			}

			useToast('Failed get answer! Try again!', {
				type: 'error',
				title: 'Error',
			});
		} finally {
			// stop the loading
			awaitingAnswer.value = false;
		}
	}

	return {
		userQuery,
		awaitingAnswer,
		sampleQuestions,
		submitQuestion,
		activeSessionId,
		getChatMessages,
	};
}

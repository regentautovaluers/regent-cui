import type { StandardSuccessResponse } from '~/types/proxy-types';
import type { ExistingSessionSlim, ChatResponse, SessionHistory } from '~/types/ava-ai-chat-types';

export default function () {
	const sampleQuestions: readonly string[] = [
		'Which vehicles usually fetch a value above 2 million shillings?',
		'How far back does your data set reach?',
		'What is the average market value of a Mercedes?',
		'Which Toyota car fetches the highest market value?',
		'Compare the market value of a Toyota versus a Mercedes',
	];
	const { query } = useRoute();
	const {
		getChatMessages,
		pushChatMessage,
		setExistingSessions,
		getExistingSessions,
		ongoingSessionContains,
	} = useAVAAiChatStore();
	const { post, get, delete: del } = useStandardizedApi();
	const { getPrincipal } = useAuth();
	const awaitingAnswer: Ref<boolean> = ref(false);
	const userQuery: Ref<string | null> = ref((query.uq as string) || null);
	const activeSessionId: Ref<string | null> = ref(null);

	const { status: fetchChatSessionsStatus, error: fetchChatSessionsError } = useApiData<
		ExistingSessionSlim[],
		ExistingSessionSlim[]
	>(
		'user-ai-sessions',
		computed(() => `/api/ava-chat/get-existing-sessions?user_id=${getPrincipal()?.userId}`),
		{
			method: 'GET',
			server: false,
			lazy: true,
			getCachedData(_key) {
				const cached = getExistingSessions();
				if (cached.length > 0) {
					return cached as ExistingSessionSlim[];
				}
			},
			onResponse: ({ response }) => {
				let existingSessions = response._data.data as ExistingSessionSlim[];
				if (existingSessions.length > 0) {
					setExistingSessions(existingSessions);
				}
			},
		},
	);

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
						origin: 'assistant',
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

	async function retrieveSessionChats(session_id: string) {
		activeSessionId.value = session_id;

		if (!ongoingSessionContains(session_id)) {
			try {
				awaitingAnswer.value = true;
				const response = await get<SessionHistory>(
					`/api/ava-chat/get-session-messages?session_id=${session_id}`,
				);

				if (response.success) {
					const history = (response as StandardSuccessResponse<SessionHistory>).data;
					if (history.history.length > 0) {
						const toAdd: ChatResponse[] = history.history.map((e) => {
							return {
								origin: e.role,
								response: e.content,
								response_status: 'successful',
							} as ChatResponse;
						});

						pushChatMessage(session_id, toAdd);
						return;
					}

					pushChatMessage(activeSessionId.value as string, [
						{
							origin: 'assistant',
							response: 'Seems like you have no chats! Ask away...',
							response_status: 'error',
						},
					]);
				}
			} catch (ex) {
				useToast('Failed to get chats! Try Again!', {
					type: 'error',
					title: 'Chats Error!',
				});
			} finally {
				awaitingAnswer.value = false;
			}
		}
	}

	return {
		userQuery,
		awaitingAnswer,
		sampleQuestions,
		submitQuestion,
		activeSessionId,
		getChatMessages,
		getExistingSessions,
		retrieveSessionChats,
	};
}

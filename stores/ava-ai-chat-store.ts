import { defineStore } from 'pinia';
import type { ChatResponse } from '~/types/ava-ai-chat-types';

export const useAVAAiChatStore = defineStore('useAVAAiChatStore', () => {
	const chatSessions: Ref<
		{
			sessionId: string;
			messages: ChatResponse[];
		}[]
	> = ref([
		{
			sessionId: 'sess_7e27f29732a64817b4ebbd030635d694',
			messages: [
				{
					origin: 'user',
					response: 'Which vehicles usually fetch a value above 2 million shillings?',
					response_status: 'successful',
				},
				{
					session_id: 'sess_7e27f29732a64817b4ebbd030635d694',
					response:
						'Based on the provided valuations, the following vehicles fetch a market value above KES 2,000,000:\n\n1. **TOYOTA LANDCRUISER PRADO VX KZJ120R**\n - Market Value: KES 48,600,000\n - Forced Sale Value: KES 41,300,000\n\n2. **TOYOTA URBAN CRUISER (CD12724U)**\n - Market Value: KES 53,200,000\n - Forced Sale Value: KES 45,220,000\n\n3. **TOYOTA URBAN CRUISER (CD12723U)**\n - Market Value: KES 53,200,000\n - Forced Sale Value: KES 45,220,000\n\n4. **TOYOTA LANDCRUISER PRADO TRJ150W**\n - Market Value: KES 3,700,000\n - Forced Sale Value: KES 2,950,000\n\n5. **TOYOTA LANDCRUISER PRADO KDJ150R**\n - Market Value: KES 3,200,000\n - Forced Sale Value: KES 2,600,000\n\n6. **TOYOTA LANDCRUISER PRADO GRJ151**\n - Market Value: KES 3,200,000\n - Forced Sale Value: KES 2,720,000\n\n7. **TOYOTA LANDCRUISER V8 URJ202**\n - Assessed Value: KES 4,800,000\n - Forced Sale Value: KES 4,080,000\n\n8. **TOYOTA LANDCRUISER PRADO GDJ150 TX-L**\n - Market Value: KES 9,200,000\n - Forced Sale Value: KES 8,280,000\n\n9. **TOYOTA PRADO LANDCRUISER TRJ150W**\n - Market Value: KES 4,600,000\n - Forced Sale Value: KES 3,680,000\n\nIn total, there are 9 vehicles that fetch a market value above KES 2,000,000, indicating a strong demand for these models.',
					visualization: null,
					origin: 'assistant',
				},
			],
		},
	]);

	function getChatMessages(sessionId: string): ChatResponse[] {
		return chatSessions.value.find((e) => e.sessionId == sessionId)?.messages as ChatResponse[];
	}

	function pushChatMessage(sessionId: string, message: ChatResponse[]) {
		const index = chatSessions.value.findIndex((e) => e.sessionId == sessionId);
		if (index >= 0) {
			message.forEach((e) => chatSessions.value[index].messages.push(e));
			return;
		}

		chatSessions.value.push({
			sessionId,
			messages: message,
		});
	}

	return {
		getChatMessages,
		pushChatMessage,
	};
});

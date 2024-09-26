import { type SelectedCorpOrBroker } from '~/types';

export const { state, getter, mutation, action, ...store } = createStore('selectedCorpOrBroker', {
	selectedCorpOrBroker: {
		name: '',
		id: '',
	} as SelectedCorpOrBroker,
});

export const getSelectedCorpOrBroker = getter(
	'getSelectedCorpOrBroker',
	(state) => state.selectedCorpOrBroker,
);

export const setSelectedCorpOrBroker = mutation(
	'setSelectedCorpOrBroker',
	(state, choice: SelectedCorpOrBroker) => {
		state.selectedCorpOrBroker = choice;
	},
);

export const cleanSelectedCorpOrBroker = mutation('cleanSelectedCorpOrBroker', (state) => {
	state.selectedCorpOrBroker = {
		name: '',
		id: '',
	};
});

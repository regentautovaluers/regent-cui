import * as flowbite from 'flowbite';
import { initFlowbite } from 'flowbite';

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.mixin({
		mounted() {
			initFlowbite();
		},
	});
});

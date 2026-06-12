import { useClipboard } from '@vueuse/core';

interface ToastProps {
	type: 'warn' | 'success' | 'error';
	title?: string;
}

function deriveTitle(toastType: 'warn' | 'success' | 'error'): string | undefined {
	switch (toastType) {
		case 'success':
			return 'Success';
		case 'error':
			return 'Error';
		case 'warn':
			return 'Warning';
		default:
			return undefined;
	}
}

export function useToast(message: string, { type, title }: ToastProps) {
	const { notify } = useNotification();

	notify({
		type: type,
		title: title || deriveTitle(type),
		text: message,
	});
}

export function useCopyToClipboard(input: string[]) {
	const { copy } = useClipboard();
	const toCopy = input.join('/n/n');
	copy(toCopy).then(() => useToast('Text copied!', { type: 'success' }));
}

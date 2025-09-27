interface ToastProps {
	type: 'warn' | 'success' | 'error';
	title?: string;
}

const useToast = (message: string, { type, title }: ToastProps) => {
	const { notify } = useNotification();

	notify({
		type: type,
		title: title || deriveTitle(type),
		text: message,
	});
};

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

export default useToast;

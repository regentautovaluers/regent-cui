import { createToast, type ToastType } from 'mosha-vue-toastify';
import 'mosha-vue-toastify/dist/style.css';

export default function () {
	// types- default, info, warning, success, danger
	function openToast(message: string, type: string, description?: string): void {
		createToast(
			{
				title: message,
				description: description,
			},
			{
				timeout: 3000,
				type: type as ToastType,
				showCloseButton: false,
				transition: 'bounce',
				hideProgressBar: true,
				showIcon: false,
				position: 'top-center',
			},
		);
	}

	return { openToast };
}

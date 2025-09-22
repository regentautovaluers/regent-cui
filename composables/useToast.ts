// import { createToast, type ToastType } from 'mosha-vue-toastify';
// import 'mosha-vue-toastify/dist/style.css';
import { type ToastConfigOptions } from '~/types';

const useToast = (
	message: string,
	{
		timeout,
		type,
		showCloseButton,
		transition,
		hideProgressBar,
		showIcon,
		position,
	}: ToastConfigOptions,
) => {
	// createToast(
	// 	{
	// 		title: message,
	// 	},
	// 	{
	// 		timeout: timeout ?? 3000,
	// 		type: type as ToastType,
	// 		showCloseButton: showCloseButton ?? false,
	// 		transition: transition ?? 'slide',
	// 		hideProgressBar: hideProgressBar ?? true,
	// 		showIcon: showIcon ?? false,
	// 		position: position ?? 'top-center',
	// 	},
	// );
};

export default useToast;

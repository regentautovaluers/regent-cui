import type { AuthorityLetter } from '~/types/corporate-valuations/authority-letters';

function useExportValuationAssets() {
	const generateAuthorizationLetterLoading: Ref<boolean> = ref(false);
	const exportBookingsLoading: Ref<boolean> = ref(false);
	const { getBlob } = useStandardizedApi();

	async function generateAuthorityLetter(t: AuthorityLetter) {
		try {
			generateAuthorizationLetterLoading.value = true;
			const blob = await getBlob('/api/vehicle-valuation/generate-authority-letter', {
				method: 'POST',
				body: t,
			});

			useToast('Success! Downloading Shortly!', {
				type: 'success',
			});

			downloadReport(blob, `authority-letter-${t.registrationNumber}.pdf`);
		} catch (ex) {
			useToast('File generation failed! Try Again!', {
				type: 'warn',
				title: 'Unexpected Error!',
			});
		} finally {
			generateAuthorizationLetterLoading.value = false;
		}
	}

	async function exportBookings(
		startDate: string,
		endDate: string,
		corpId: string,
		bookingSource: 'AUTHORITY_LETTER' | null,
		completed: boolean | null,
		corpBranchId: string | null,
	) {
		const body: {
			startDate: string;
			endDate: string;
			corpId: string;
			bookingSource: 'AUTHORITY_LETTER' | null;
			completed: boolean | null;
			corpBranchId: string | null;
		} = {
			startDate,
			endDate,
			corpId,
			bookingSource,
			completed,
			corpBranchId,
		};

		try {
			exportBookingsLoading.value = true;
			const blob = await getBlob('/api/vehicle-valuation/export-valuation-booking', {
				method: 'POST',
				body,
			});

			useToast('Success! Downloading Shortly!', {
				type: 'success',
			});

			downloadReport(blob, `reports-${startDate}-${endDate}.xls`);
		} catch (ex) {
			useToast('Export failed! Try Again!', {
				type: 'warn',
				title: 'Unexpected Error!',
			});
		} finally {
			exportBookingsLoading.value = false;
		}
	}

	return {
		generateAuthorizationLetterLoading,
		exportBookingsLoading,
		generateAuthorityLetter,
		exportBookings,
	};
}

export default useExportValuationAssets;

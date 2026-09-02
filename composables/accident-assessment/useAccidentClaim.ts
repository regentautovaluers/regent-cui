/**
 * One accident claim for the insurer's detail view.
 *
 * `server: false` for the same reason as everywhere else in this console: the
 * auth cookie is client-set, so an SSR fetch would go out unauthenticated.
 */
export const useAccidentClaim = (claimId: Ref<string> | ComputedRef<string>) => {
	const endpoint = computed(
		() =>
			`/api/accident-assessment/get-claim?claimId=${encodeURIComponent(claimId.value)}`,
	);

	const {
		data: claim,
		status: fetchClaimStatus,
		error: fetchClaimError,
		execute: executeFetchClaim,
	} = useApiData<Record<string, any>, Record<string, any>>(null, endpoint, {
		method: 'GET',
		server: false,
		transform: (response) => response.data,
		watch: [claimId],
	});

	return { claim, fetchClaimStatus, fetchClaimError, executeFetchClaim };
};

import type { AccidentClaimPage } from '~/types/accident-assessment/accident-claim';

/**
 * The insurer's accident claims.
 *
 * Follows the house shape: filter refs, a computed endpoint so changing a
 * filter changes the URL, and `server: false` because the auth cookie is
 * client-set and an SSR fetch would go out unauthenticated.
 *
 * Filtering and paging are done upstream by the accident service. Nothing here
 * fetches a page and slices it, because a slice silently loses whatever falls
 * past its edge and the total stops agreeing with the rows.
 */
export const useAccidentClaims = () => {
	const page = ref<number>(1);
	const pageSize = ref<number>(20);
	const searchTerm = ref<string>('');
	const status = ref<string>('');

	const endpoint = computed(() => {
		let url = `/api/accident-assessment/list-claims?page=${page.value}&size=${pageSize.value}`;

		if (searchTerm.value) {
			url = url + `&q=${encodeURIComponent(searchTerm.value)}`;
		}

		if (status.value) {
			url = url + `&status=${encodeURIComponent(status.value)}`;
		}

		return url;
	});

	const {
		data: claimPage,
		status: fetchClaimsStatus,
		error: fetchClaimsError,
		execute: executeFetchClaims,
	} = useApiData<AccidentClaimPage, AccidentClaimPage>(null, endpoint, {
		method: 'GET',
		server: false,
		transform: (response) => response.data,
		watch: [page, status],
	});

	const claims = computed(() => claimPage.value?.items ?? []);
	const totalClaims = computed(() => claimPage.value?.total ?? 0);
	const totalPages = computed(() =>
		Math.max(1, Math.ceil(totalClaims.value / pageSize.value)),
	);

	const clearFilters = () => {
		searchTerm.value = '';
		status.value = '';
		page.value = 1;
		executeFetchClaims();
	};

	/** A new search always restarts at page one; page 4 of a new query is nothing. */
	const applySearch = () => {
		page.value = 1;
		executeFetchClaims();
	};

	return {
		page,
		pageSize,
		searchTerm,
		status,
		claims,
		totalClaims,
		totalPages,
		fetchClaimsStatus,
		fetchClaimsError,
		executeFetchClaims,
		applySearch,
		clearFilters,
	};
};

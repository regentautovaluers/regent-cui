import { type CoreRoute } from '~/types';
import navigationRoutes from '~/config/system-routes';

const useNavigationRoutes = () => {
	const route = useRoute();
	const currentScreenName: ComputedRef<string> = computed(() => {
		const routeName: string = route.name as string;
		let screenName: string = '';

		for (const routeObject of navigationRoutes) {
			if (routeObject.routeName === routeName) {
				screenName = routeObject.screenName;
				break;
			}
			if (routeObject.childRoutes) {
				for (const childRouteObject of routeObject.childRoutes) {
					if (childRouteObject.routeName === routeName) {
						screenName = childRouteObject.screenName;
						break;
					}
				}
			}
		}

		return screenName;
	});

	const doesRouteNameMatch = (routeName: string): boolean => {
		return route.name === routeName;
	};

	function doesRoutePathInclude(substring: string): boolean {
		return route.path.includes(substring);
	}

	const fuzzyRouteNameMatch = (routeName: string, coreRoute: CoreRoute): boolean => {
		if ((route.name as string) == routeName) return true;

		if (coreRoute.childRoutes) {
			for (const childRoute of coreRoute.childRoutes) {
				if ((route.name as string) == childRoute.routeName) return true;
			}
		}
		return false;
	};

	return {
		navigationRoutes,
		currentScreenName,
		doesRouteNameMatch,
		doesRoutePathInclude,
		fuzzyRouteNameMatch,
	};
};

export default useNavigationRoutes;

import { ref, onMounted } from 'vue';
import {
	onAuthStateChanged,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth';
import {
	ref as dbRef,
	push,
	set,
	remove,
	query,
	limitToLast,
	orderByKey,
	endBefore,
	onChildAdded,
	orderByChild,
	startAt,
} from 'firebase/database';
import { type GeneralNotificationType } from '~/types';

function useFirebaseRTDB() {
	const { $auth, $db } = useNuxtApp();
	const user = ref(null);
	const isAuthenticated = ref(false);
	const dataList: Ref<GeneralNotificationType[]> = ref([]);
	const authError: Ref<string | null> = ref(null);
	const dataError: Ref<string | null> = ref(null);
	const lastAddedKey: Ref<string | null> = ref(null);
	const { executeFetchCollateralVerificationTokenStatus } =
		useCollateralVerificationTokensManagement();

	const signIn = async (email: string, password: string) => {
		authError.value = null;
		try {
			await signInWithEmailAndPassword($auth, email, password);
		} catch (error: any) {
			authError.value = error.message;
		}
	};

	const logOut = async () => {
		authError.value = null;
		try {
			await signOut($auth);
		} catch (error: any) {
			authError.value = error.message;
		}
	};

	// Database Functions
	const fetchData = (path: string) => {
		const twoMonthsAgo = Date.now() - 1000 * 60 * 60 * 24 * 60; // 60 days
		const dataRef = dbRef($db, path);
		const recentDataQuery = query(dataRef, orderByChild('timestamp'), startAt(twoMonthsAgo));

		// Clear the list before listening to prevent duplicate entries
		dataList.value = [];
		onChildAdded(
			recentDataQuery,
			(snapshot) => {
				const newData: GeneralNotificationType = { id: snapshot.key, ...snapshot.val() };

				// interceptor to reload IPRS check tokens
				if (newData.data?.mpesaReceipt && Date.now() - Number(newData.timestamp) < 5000) {
					executeFetchCollateralVerificationTokenStatus();
				}

				dataList.value.push(newData);
				lastAddedKey.value = snapshot.key;
			},
			(error) => {
				dataError.value = error.message;
			},
		);
	};

	// const writeData = (path, newData) => {
	// 	const dataRef = dbRef($db, path);
	// 	const newEntryRef = push(dataRef);
	// 	set(newEntryRef, newData);
	// };

	const deleteData = (path: string) => {
		const dataRef = dbRef($db, path);
		remove(dataRef);
	};

	// Auth State Listener
	onMounted(() => {
		onAuthStateChanged($auth, (authUser) => {
			user.value = authUser;
			isAuthenticated.value = !!authUser;
		});
	});

	return {
		user,
		isAuthenticated,
		dataList,
		authError,
		dataError,
		signIn,
		logOut,
		fetchData,
		// writeData,
		deleteData,
	};
}

export default useFirebaseRTDB;

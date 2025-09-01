import { ref, onMounted } from 'vue';
import {
	onAuthStateChanged,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth';
import { ref as dbRef, onValue, push, set, remove } from 'firebase/database';
import { type GeneralNotificationType } from '~/types';

function useFirebaseRTDB() {
	const { $auth, $db } = useNuxtApp();
	const user = ref(null);
	const isAuthenticated = ref(false);
	const dataList: Ref<GeneralNotificationType[]> = ref([]);
	const authError = ref(null);
	const dataError = ref(null);

	const signIn = async (email: string, password: string) => {
		authError.value = null;
		try {
			await signInWithEmailAndPassword($auth, email, password);
		} catch (error) {
			authError.value = error.message;
		}
	};

	const logOut = async () => {
		authError.value = null;
		try {
			await signOut($auth);
		} catch (error) {
			authError.value = error.message;
		}
	};

	// Database Functions
	const fetchData = (path: string) => {
		const dataRef = dbRef($db, path);
		onValue(
			dataRef,
			(snapshot) => {
				const data = snapshot.val();
				if (data) {
					dataList.value = Object.keys(data).map((key) => ({
						id: key,
						...data[key],
					}));
				} else {
					dataList.value = [];
				}
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

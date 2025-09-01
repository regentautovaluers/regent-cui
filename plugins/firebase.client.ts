import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

export default defineNuxtPlugin((nuxtApp) => {
	// Get Firebase configuration from Nuxt runtime config
	const config = useRuntimeConfig();

	// Your web app's Firebase configuration
	const firebaseConfig = {
		apiKey: config.public.FIREBASE_API_KEY,
		authDomain: config.public.FIREBASE_AUTH_DOMAIN,
		databaseURL: config.public.FIREBASE_DATABASE_URL,
		projectId: config.public.FIREBASE_PROJECT_ID,
		storageBucket: config.public.FIREBASE_STORAGE_BUCKET,
		messagingSenderId: config.public.FIREBASE_MESSAGING_SENDER_ID,
		appId: config.public.FIREBASE_APP_ID,
	};

	// Initialize Firebase
	const app = initializeApp(firebaseConfig);

	// Initialize Firebase services
	const auth = getAuth(app);
	const database = getDatabase(app);

	// Provide Firebase services to the Nuxt app instance
	return {
		provide: {
			auth: auth,
			db: database,
		},
	};
});

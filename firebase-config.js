// Читаем настройки из localStorage для динамической синхронизации
const STORAGE_CONFIG_KEY = 'ch_firebase_config';
const savedConfig = localStorage.getItem(STORAGE_CONFIG_KEY);

const firebaseConfig = savedConfig ? JSON.parse(savedConfig) : {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
let db = null;
let useFirebase = false;

try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        // Test if config is valid (not placeholder)
        if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
            useFirebase = true;
        }
    }
} catch (e) {
    console.warn('Firebase init skipped:', e.message);
}

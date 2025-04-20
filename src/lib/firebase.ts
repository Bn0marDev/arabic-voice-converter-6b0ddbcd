
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// سيتم استبدال هذه القيم بقيم التكوين الخاصة بك
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تصدير خدمات Firebase
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// إضافة نطاقات إضافية لمزود Google (اختياري)
googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');

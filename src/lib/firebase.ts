
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { supabase } from "@/integrations/supabase/client";

// Get Firebase config from Supabase secrets
const firebaseConfig = {
  apiKey: "AIzaSyDe6iUh7nc2UW0LDGzmUvAD5N2lDshz1Ms",
  authDomain: "solider110-3ef7f.firebaseapp.com",
  projectId: "solider110-3ef7f",
  storageBucket: "solider110-3ef7f.appspot.com",
  messagingSenderId: "662380580355",
  appId: "1:662380580355:web:YOUR_WEB_APP_ID" // You'll need to provide this
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تصدير خدمات Firebase
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// إضافة نطاقات إضافية لمزود Google
googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');

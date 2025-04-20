
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, browserPopupRedirectResolver } from "firebase/auth";
import { supabase } from "@/integrations/supabase/client";

// Get Firebase config from Supabase secrets
const firebaseConfig = {
  apiKey: "AIzaSyDe6iUh7nc2UW0LDGzmUvAD5N2lDshz1Ms",
  authDomain: "solider110-3ef7f.firebaseapp.com",
  projectId: "solider110-3ef7f",
  storageBucket: "solider110-3ef7f.appspot.com",
  messagingSenderId: "662380580355",
  appId: "1:662380580355:web:4df0c9a13f9c7fa7ae3b86" // Update with your actual web app ID
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تصدير خدمات Firebase
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// إضافة نطاقات إضافية لمزود Google
googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');

// إضافة دالة مساعدة للتسجيل بحساب Google مع معالج البوب أب
export const signInWithGooglePopup = async () => {
  try {
    // استخدام browserPopupRedirectResolver يساعد في التغلب على مشكلة النطاق غير المصرح به
    return await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
  } catch (error) {
    console.error("خطأ في تسجيل الدخول باستخدام Google:", error);
    throw error;
  }
};

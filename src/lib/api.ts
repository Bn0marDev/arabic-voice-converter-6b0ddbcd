
// هنا سنقوم بإعداد واجهة API الجديدة عندما يتم توفيرها
import { auth } from './firebase';

// أساسيات الـ API
const API_URL = 'YOUR_NEW_API_ENDPOINT';

// دالة مساعدة للحصول على رمز المصادقة
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  throw new Error('المستخدم غير مسجل الدخول');
};

// دالة تحويل النص إلى كلام باستخدام API الجديد
export const textToSpeech = async (text: string, voiceId: string) => {
  try {
    // في حالة كان API الجديد يتطلب مصادقة
    // const token = await getAuthToken();
    
    const response = await fetch(`${API_URL}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}` // أضف هذا إذا كان API يتطلب مصادقة
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail?.message || 'فشل في تحويل النص إلى كلام');
    }

    return await response.blob();
  } catch (error) {
    console.error('خطأ في تحويل النص إلى كلام:', error);
    throw error;
  }
};

// دالة الحصول على قائمة الأصوات
export const getVoices = async () => {
  try {
    // const token = await getAuthToken();
    
    const response = await fetch(`${API_URL}/voices`, {
      headers: {
        // 'Authorization': `Bearer ${token}` // أضف هذا إذا كان API يتطلب مصادقة
      }
    });

    if (!response.ok) {
      throw new Error('فشل في جلب الأصوات');
    }

    return await response.json();
  } catch (error) {
    console.error('خطأ في جلب الأصوات:', error);
    throw error;
  }
};

// دالة معالجة التسجيل الصوتي
export const processVoiceRecording = async (audioBlob: Blob, voiceId: string) => {
  try {
    // const token = await getAuthToken();
    
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('model_id', 'eleven_multilingual_v2');

    const response = await fetch(`${API_URL}/voice-generation/${voiceId}`, {
      method: 'POST',
      headers: {
        // 'Authorization': `Bearer ${token}` // أضف هذا إذا كان API يتطلب مصادقة
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail?.message || 'فشل في معالجة التسجيل الصوتي');
    }

    return await response.blob();
  } catch (error) {
    console.error('خطأ في معالجة التسجيل الصوتي:', error);
    throw error;
  }
};

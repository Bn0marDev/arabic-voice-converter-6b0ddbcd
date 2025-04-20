
import { useEffect, useState } from 'react';
import { useToast } from './use-toast';
import { supabase } from "@/integrations/supabase/client";

const WELCOME_MESSAGE = "مرحباً بك في محول النص إلى كلام. يمكنك استخدام هذه الخدمة لتحويل النصوص العربية إلى ملفات صوتية.";
const VOICES = [
  "9BWtsMINqrJLrRacOk9x",
  "CwhRBWXzGAHq8TQ4Fs17",
  "EXAVITQu4vr4xnSDxMaL",
];

export const useWelcomeMessage = () => {
  const [hasPlayed, setHasPlayed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const hasWelcomePlayed = localStorage.getItem('welcomePlayed');
    if (!hasWelcomePlayed && !hasPlayed) {
      const playWelcome = async () => {
        try {
          // Get API key from Supabase secrets
          const { data: { ELEVEN_LABS_API_KEY } } = await supabase.functions.invoke('get-secret', {
            body: { secret_name: 'ELEVEN_LABS_API_KEY' }
          });
          
          const randomVoice = VOICES[Math.floor(Math.random() * VOICES.length)];
          const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${randomVoice}`, {
            method: 'POST',
            headers: {
              'Accept': 'audio/mpeg',
              'xi-api-key': ELEVEN_LABS_API_KEY,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              text: WELCOME_MESSAGE,
              model_id: "eleven_multilingual_v2",
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.5
              }
            })
          });

          if (!response.ok) {
            // فحص خطأ تجاوز الحصة
            const errorData = await response.json();
            if (errorData.detail?.status === "quota_exceeded") {
              console.warn("تم تجاوز الحصة المخصصة لمفتاح API عند تشغيل رسالة الترحيب");
              localStorage.setItem('welcomePlayed', 'true'); // تخطي محاولة التشغيل مستقبلاً
              setHasPlayed(true);
              return;
            }
            throw new Error('فشل في تشغيل رسالة الترحيب');
          }

          const audioBlob = await response.blob();
          const audio = new Audio(URL.createObjectURL(audioBlob));
          await audio.play();
          
          localStorage.setItem('welcomePlayed', 'true');
          setHasPlayed(true);
        } catch (error) {
          console.error('Error playing welcome message:', error);
          toast({
            title: "تنبيه",
            description: "تعذر تشغيل رسالة الترحيب",
          });
        }
      };

      playWelcome();
    }
  }, [hasPlayed, toast]);
};

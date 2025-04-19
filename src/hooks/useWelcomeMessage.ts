
import { useEffect, useState } from 'react';
import { useToast } from './use-toast';

const WELCOME_MESSAGE = "مرحباً بك في محول النص إلى كلام. يمكنك استخدام هذه الخدمة لتحويل النصوص العربية إلى ملفات صوتية.";
const VOICES = [
  "9BWtsMINqrJLrRacOk9x", // Aria
  "CwhRBWXzGAHq8TQ4Fs17", // Roger
  "EXAVITQu4vr4xnSDxMaL", // Sarah
];

export const useWelcomeMessage = () => {
  const [hasPlayed, setHasPlayed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const hasWelcomePlayed = localStorage.getItem('welcomePlayed');
    if (!hasWelcomePlayed && !hasPlayed) {
      const playWelcome = async () => {
        try {
          const randomVoice = VOICES[Math.floor(Math.random() * VOICES.length)];
          const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${randomVoice}`, {
            method: 'POST',
            headers: {
              'Accept': 'audio/mpeg',
              'xi-api-key': 'sk_53335c6f855ee582fac086690b4c039d3e100fbd2992c3a9',
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

          if (!response.ok) throw new Error('فشل في تشغيل رسالة الترحيب');

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

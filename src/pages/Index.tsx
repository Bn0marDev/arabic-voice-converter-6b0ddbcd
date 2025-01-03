import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Volume2 } from "lucide-react";
import { VoiceCard } from "@/components/VoiceCard";
import { VoiceRecorder } from "@/components/VoiceRecorder";

interface Voice {
  name: string;
  voice_id: string;
  labels?: {
    language?: string;
    accent?: string;
  };
  description?: string;
  preview_url?: string;
}

const API_KEY = 'sk_53335c6f855ee582fac086690b4c039d3e100fbd2992c3a9';

const Index = () => {
  const [text, setText] = useState('');
  const [voiceId, setVoiceId] = useState('');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [filteredVoices, setFilteredVoices] = useState<Voice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filter, setFilter] = useState<'all' | 'arabic' | 'other'>('all');
  
  const { toast } = useToast();

  useEffect(() => {
    fetchVoices();
  }, []);

  useEffect(() => {
    filterVoices(filter);
  }, [voices, filter]);

  const fetchVoices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': API_KEY
        }
      });

      if (!response.ok) {
        throw new Error(response.status === 401 ? 'مفتاح API غير صالح' : 'فشل في جلب الأصوات');
      }

      const data = await response.json();
      setVoices(data.voices);
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : 'حدث خطأ',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterVoices = (filterType: 'all' | 'arabic' | 'other') => {
    let filtered = voices;
    if (filterType === 'arabic') {
      filtered = voices.filter(voice => 
        voice.labels?.language?.toLowerCase() === 'arabic' || 
        voice.labels?.language?.toLowerCase() === 'ar'
      );
    } else if (filterType === 'other') {
      filtered = voices.filter(voice => 
        voice.labels?.language?.toLowerCase() !== 'arabic' && 
        voice.labels?.language?.toLowerCase() !== 'ar'
      );
    }
    setFilteredVoices(filtered);
  };

  const playVoiceSample = async (previewUrl: string) => {
    try {
      const audio = new Audio(previewUrl);
      await audio.play();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تشغيل عينة الصوت",
        variant: "destructive"
      });
    }
  };

  const handleRecordingComplete = async (audioBlob: Blob) => {
    if (!selectedVoiceId) {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار صوت أولاً",
        variant: "destructive"
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('model_id', 'eleven_multilingual_v2');

      const response = await fetch(`https://api.elevenlabs.io/v1/voice-generation/${selectedVoiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': API_KEY,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('فشل في معالجة التسجيل الصوتي');
      }

      toast({
        title: "تم بنجاح",
        description: "تم معالجة التسجيل الصوتي بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : 'حدث خطأ أثناء معالجة التسجيل',
        variant: "destructive"
      });
    }
  };

  const convertTextToSpeech = async () => {
    if (!text) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال نص أولاً",
        variant: "destructive"
      });
      return;
    }

    if (!selectedVoiceId) {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار صوت",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsPlaying(true);
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': API_KEY,
          'Content-Type': 'application/json'
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
        throw new Error('خطأ في الخادم');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsPlaying(false);
      };
      
      await audio.play();
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : 'حدث خطأ',
        variant: "destructive"
      });
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white animate-fade-in">
            محول النص إلى كلام
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            حول النص إلى كلام باستخدام تقنية ElevenLabs
          </p>
        </div>

        <div className="space-y-6 backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 animate-scale-in">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="أدخل النص هنا..."
            className="min-h-[120px] text-right glass"
            dir="rtl"
          />

          <VoiceRecorder onRecordingComplete={handleRecordingComplete} />

          <Button 
            onClick={convertTextToSpeech} 
            disabled={isPlaying} 
            className="w-full glass"
          >
            {isPlaying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جاري التشغيل...
              </>
            ) : (
              <>
                <Volume2 className="mr-2 h-4 w-4" />
                تشغيل الصوت
              </>
            )}
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center gap-2">
            {(['all', 'arabic', 'other'] as const).map((filterType) => (
              <Button
                key={filterType}
                onClick={() => setFilter(filterType)}
                variant={filter === filterType ? "default" : "outline"}
                className="glass"
              >
                {filterType === 'all' ? 'الكل' : filterType === 'arabic' ? 'العربية' : 'لغات أخرى'}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVoices.map((voice) => (
                <VoiceCard
                  key={voice.voice_id}
                  voice={voice}
                  isSelected={selectedVoiceId === voice.voice_id}
                  onSelect={setSelectedVoiceId}
                  onPlaySample={playVoiceSample}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
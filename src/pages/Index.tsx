import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { TextToSpeechForm } from "@/components/TextToSpeechForm";
import { FavoriteVoices } from "@/components/FavoriteVoices";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Clock, Volume2, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useWelcomeMessage } from "@/hooks/useWelcomeMessage";
import { MainLayout } from "@/components/MainLayout";
import { VoicesList } from "@/components/VoicesList";
import { SelectedVoiceInfo } from "@/components/SelectedVoiceInfo";
import { ConversionOverlay } from "@/components/ConversionOverlay";
import { supabase } from "@/integrations/supabase/client";

export interface Voice {
  name: string;
  voice_id: string;
  labels?: {
    language?: string;
    accent?: string;
    gender?: string;
  };
  description?: string;
  preview_url?: string;
}

const Index = () => {
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const { toast } = useToast();
  
  useWelcomeMessage();

  useEffect(() => {
    fetchVoices();
  }, []);

  const fetchVoices = async () => {
    try {
      const { data: { ELEVEN_LABS_API_KEY } } = await supabase.functions.invoke('get-secret', {
        body: { secret_name: 'ELEVEN_LABS_API_KEY' }
      });
      
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': ELEVEN_LABS_API_KEY
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
    }
  };

  const handleTextToSpeech = async (text: string) => {
    try {
      if (!selectedVoiceId) {
        toast({
          title: "تنبيه",
          description: "الرجاء اختيار صوت أولاً",
          variant: "destructive"
        });
        return;
      }
      
      setIsConverting(true);
      
      toast({
        title: "جاري التحويل...",
        description: "يرجى الانتظار بينما نقوم بتحويل النص إلى كلام",
      });
      
      const { data: { ELEVEN_LABS_API_KEY } } = await supabase.functions.invoke('get-secret', {
        body: { secret_name: 'ELEVEN_LABS_API_KEY' }
      });
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': ELEVEN_LABS_API_KEY,
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
        const errorData = await response.json();
        
        if (errorData.detail?.status === "quota_exceeded") {
          throw new Error('تم تجاوز الحصة المخصصة لمفتاح API. يرجى استخدام مفتاح آخر أو ترقية الخطة الحالية.');
        }
        
        throw new Error(errorData.detail?.message || 'خطأ في الخادم');
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      
      toast({
        title: "تم التحويل بنجاح",
        description: "يمكنك الآن الاستماع إلى الصوت أو تحميله",
      });
      
    } catch (error) {
      toast({
        title: "خطأ",
        description: error instanceof Error ? error.message : 'حدث خطأ',
        variant: "destructive"
      });
      console.error("خطأ في تحويل النص إلى كلام:", error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = 'audio.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "تم التنزيل",
        description: "تم تنزيل الملف الصوتي بنجاح",
      });
    }
  };

  return (
    <MainLayout>
      <div className="container py-6 md:py-10">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
              <Volume2 className="h-8 w-8 text-primary" />
              محول النص إلى كلام
            </h1>
            <p className="text-muted-foreground">
              حول النصوص إلى كلام طبيعي عالي الجودة
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <Tabs defaultValue="text" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="text" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        تحويل النص
                      </TabsTrigger>
                      <TabsTrigger value="favorites" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        الأصوات المفضلة
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="text">
                      <TextToSpeechForm
                        selectedVoiceId={selectedVoiceId}
                        onConvert={handleTextToSpeech}
                        isLoading={isConverting}
                      />
                    </TabsContent>
                    
                    <TabsContent value="favorites">
                      <FavoriteVoices />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-4">
              <SelectedVoiceInfo selectedVoiceId={selectedVoiceId} voices={voices} />

              {audioUrl && (
                <div className="space-y-4 animate-scale-in sticky top-6">
                  <Card className="overflow-hidden">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Volume2 className="h-5 w-5 text-primary" />
                        الصوت المحول
                      </h3>
                      <AudioPlayer audioUrl={audioUrl} onDownload={handleDownload} />
                      <Button onClick={handleDownload} variant="outline" className="w-full gap-2">
                        <Download className="h-4 w-4" />
                        تحميل الملف الصوتي
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>

          <VoicesList 
            onVoiceSelect={setSelectedVoiceId}
            selectedVoiceId={selectedVoiceId}
          />
        </div>
      </div>
      
      <ConversionOverlay isConverting={isConverting} />
    </MainLayout>
  );
};

export default Index;

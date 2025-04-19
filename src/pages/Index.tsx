import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { VoiceCard } from "@/components/VoiceCard";
import { TextToSpeechForm } from "@/components/TextToSpeechForm";
import { FavoriteVoices } from "@/components/FavoriteVoices";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, ChevronUp, Download, Languages, Search, FileText, Volume2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useWelcomeMessage } from "@/hooks/useWelcomeMessage";
import { MainLayout } from "@/components/MainLayout";

interface Voice {
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

const API_KEY = 'sk_53335c6f855ee582fac086690b4c039d3e100fbd2992c3a9';

const Index = () => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [filteredVoices, setFilteredVoices] = useState<Voice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'arabic' | 'other'>('all');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  
  const { toast } = useToast();
  
  // Use the welcome message hook
  useWelcomeMessage();

  useEffect(() => {
    fetchVoices();
  }, []);

  useEffect(() => {
    filterAndSearchVoices();
  }, [voices, filter, searchQuery]);

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

  const filterAndSearchVoices = () => {
    let result = voices;
    
    if (filter === 'arabic') {
      result = result.filter(voice => 
        voice.labels?.language?.toLowerCase() === 'arabic' || 
        voice.labels?.language?.toLowerCase() === 'ar'
      );
    } else if (filter === 'other') {
      result = result.filter(voice => 
        voice.labels?.language?.toLowerCase() !== 'arabic' && 
        voice.labels?.language?.toLowerCase() !== 'ar'
      );
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(voice => 
        voice.name.toLowerCase().includes(query) || 
        voice.description?.toLowerCase().includes(query) ||
        voice.labels?.language?.toLowerCase().includes(query) ||
        voice.labels?.accent?.toLowerCase().includes(query)
      );
    }
    
    setFilteredVoices(result);
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
      setIsLoading(true);
      
      toast({
        title: "جاري التحويل...",
        description: "يرجى الانتظار بينما نقوم بتحويل النص إلى كلام",
      });
      
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
    } finally {
      setIsLoading(false);
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
                        isLoading={isLoading}
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
              <Card className="overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-primary" />
                    الصوت المحدد
                  </h2>
                  
                  {selectedVoiceId ? (
                    <div className="space-y-3">
                      {voices.find(v => v.voice_id === selectedVoiceId)?.name && (
                        <p className="text-lg font-semibold text-primary">
                          {voices.find(v => v.voice_id === selectedVoiceId)?.name}
                        </p>
                      )}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-accent/50 rounded-lg p-2">
                          <span className="font-medium block">اللغة</span>
                          <span>{voices.find(v => v.voice_id === selectedVoiceId)?.labels?.language || 'غير معروف'}</span>
                        </div>
                        <div className="bg-accent/50 rounded-lg p-2">
                          <span className="font-medium block">اللهجة</span>
                          <span>{voices.find(v => v.voice_id === selectedVoiceId)?.labels?.accent || 'غير معروف'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">الرجاء اختيار صوت من القائمة</p>
                    </div>
                  )}
                </CardContent>
              </Card>

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

          <Card className="overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Languages className="h-5 w-5 text-primary" />
                  الأصوات المتاحة
                </h2>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  فلترة
                  <ChevronUp className={`h-3 w-3 transition-transform ${!showFilters ? 'rotate-180' : ''}`} />
                </Button>
              </div>
              
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-2 pb-4 border-b animate-fade-in">
                  <div className="col-span-2">
                    <div className="relative">
                      <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="ابحث عن صوت..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 pr-10"
                      />
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex gap-2">
                    {(['all', 'arabic', 'other'] as const).map((filterType) => (
                      <Button
                        key={filterType}
                        onClick={() => setFilter(filterType)}
                        variant={filter === filterType ? "default" : "outline"}
                        size="sm"
                        className="flex-1"
                      >
                        {filterType === 'all' ? 'الكل' : filterType === 'arabic' ? 'العربية' : 'لغات أخرى'}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Voice cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-1">
                {filteredVoices.length > 0 ? (
                  filteredVoices.map((voice) => (
                    <VoiceCard
                      key={voice.voice_id}
                      voice={voice}
                      isSelected={selectedVoiceId === voice.voice_id}
                      onSelect={setSelectedVoiceId}
                      onPlaySample={(url) => {}}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    {isLoading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                        <p>جاري تحميل الأصوات...</p>
                      </div>
                    ) : (
                      <p>لا توجد أصوات متطابقة مع معايير البحث</p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex justify-between text-sm text-muted-foreground pt-4 border-t">
                <span>إجمالي الأصوات: {filteredVoices.length}</span>
                <Badge variant="outline">
                  {filter === 'all' ? 'كل الأصوات' : filter === 'arabic' ? 'العربية فقط' : 'لغات أخرى'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {isConverting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-background p-8 rounded-xl shadow-xl flex flex-col items-center gap-4">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-lg font-medium">جاري تحويل النص إلى صوت...</p>
            <p className="text-sm text-muted-foreground">يرجى الانتظار قليلاً</p>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Index;

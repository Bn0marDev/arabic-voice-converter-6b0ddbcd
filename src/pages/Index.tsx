
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { VoiceCard } from "@/components/VoiceCard";
import { TextToSpeechForm } from "@/components/TextToSpeechForm";
import { PDFUploader } from "@/components/PDFUploader";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, ChevronUp, Download, Languages, Search, FileText, Volume2, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

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
  const [themePattern, setThemePattern] = useState<'default' | 'libya' | 'naari'>('default');
  
  const { toast } = useToast();

  useEffect(() => {
    fetchVoices();
  }, []);

  useEffect(() => {
    filterAndSearchVoices();
  }, [voices, filter, searchQuery]);

  useEffect(() => {
    // تطبيق النمط على الصفحة الرئيسية
    const body = document.body;
    body.classList.remove('libya-pattern-1', 'naari-pattern-1');
    
    if (themePattern === 'libya') {
      body.classList.add('libya-pattern-1');
    } else if (themePattern === 'naari') {
      body.classList.add('naari-pattern-1');
    }
  }, [themePattern]);

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
    
    // تطبيق فلتر اللغة
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
    
    // تطبيق البحث
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
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 font-sans ${themePattern !== 'default' ? '' : ''}`} dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-end space-x-2 rtl:space-x-reverse mb-4">
          <Button 
            variant={themePattern === 'default' ? 'default' : 'outline'} 
            onClick={() => setThemePattern('default')}
            className="text-sm"
            size="sm"
          >
            النمط الافتراضي
          </Button>
          <Button 
            variant={themePattern === 'libya' ? 'default' : 'outline'} 
            onClick={() => setThemePattern('libya')}
            className="text-sm"
            size="sm"
          >
            النمط الليبي
          </Button>
          <Button 
            variant={themePattern === 'naari' ? 'default' : 'outline'} 
            onClick={() => setThemePattern('naari')}
            className="text-sm"
            size="sm"
          >
            النمط النعاري
          </Button>
        </div>

        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center">
            <Megaphone className="h-10 w-10 ml-2 text-primary animate-gentle-pulse" />
            محول النص إلى كلام
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            حول النص إلى كلام باستخدام تقنية ElevenLabs - لصناع المحتوى
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* الجانب الأيمن - معلومات الصوت المختار والصور */}
          <div className="md:col-span-1 space-y-6">
            <Card className="overflow-hidden border-primary/20 animate-scale-in shadow-lg">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold flex items-center">
                  <Volume2 className="h-5 w-5 ml-2 text-primary" />
                  الصوت المحدد
                </h2>
                
                {selectedVoiceId ? (
                  <div className="space-y-2">
                    {voices.find(v => v.voice_id === selectedVoiceId)?.name && (
                      <p className="text-lg font-semibold text-primary">
                        {voices.find(v => v.voice_id === selectedVoiceId)?.name}
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-primary/5 rounded-lg p-2">
                        <span className="font-medium block">اللغة:</span>
                        <span>{voices.find(v => v.voice_id === selectedVoiceId)?.labels?.language || 'غير معروف'}</span>
                      </div>
                      <div className="bg-primary/5 rounded-lg p-2">
                        <span className="font-medium block">اللهجة:</span>
                        <span>{voices.find(v => v.voice_id === selectedVoiceId)?.labels?.accent || 'غير معروف'}</span>
                      </div>
                      <div className="bg-primary/5 rounded-lg p-2 col-span-2">
                        <span className="font-medium block">الجنس:</span>
                        <span>{voices.find(v => v.voice_id === selectedVoiceId)?.labels?.gender || 'غير معروف'}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-primary/5 rounded-xl">
                    <p className="text-muted-foreground">الرجاء اختيار صوت من القائمة</p>
                    <span className="block mt-2 text-primary animate-pulse text-xl">⬅️</span>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* مساحة للصور */}
            <div className="glass rounded-2xl border border-primary/20 overflow-hidden shadow-lg animate-fade-in animation-delay-500">
              <div className="aspect-square bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 flex items-center justify-center p-4">
                <div className="text-center space-y-3">
                  <div className="w-24 h-24 bg-white/30 dark:bg-white/10 rounded-full mx-auto flex items-center justify-center">
                    <Volume2 className="h-10 w-10 text-primary/70" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">صناعة المحتوى الصوتي</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">أنشئ مقاطع صوتية بجودة عالية لمحتواك</p>
                </div>
              </div>
            </div>
            
            <div className="glass rounded-2xl border border-primary/20 overflow-hidden shadow-lg animate-fade-in animation-delay-1000">
              <div className="aspect-video bg-gradient-to-r from-blue-100 to-teal-100 dark:from-blue-900/30 dark:to-teal-900/30 flex items-center justify-center p-4">
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 bg-white/30 dark:bg-white/10 rounded-full mx-auto flex items-center justify-center">
                    <Megaphone className="h-8 w-8 text-primary/70" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">وصول أوسع للمحتوى</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">اجعل محتواك في متناول الجميع</p>
                </div>
              </div>
            </div>
            
            {audioUrl && (
              <div className="space-y-4 animate-scale-in sticky top-6">
                <h3 className="text-lg font-semibold flex items-center">
                  <Volume2 className="h-5 w-5 ml-2 text-primary" />
                  الصوت المحول
                </h3>
                <AudioPlayer audioUrl={audioUrl} onDownload={handleDownload} />
                
                <Button onClick={handleDownload} variant="outline" className="w-full group transition-all">
                  <Download className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  تحميل الملف الصوتي
                </Button>
              </div>
            )}
          </div>
          
          {/* الجانب الأيسر - أدوات التحويل */}
          <div className="md:col-span-2 space-y-6">
            <Card className="overflow-hidden border-primary/20 animate-scale-in shadow-lg">
              <CardContent className="p-6 space-y-6">
                <Tabs defaultValue="text" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="text" className="flex items-center">
                      <FileText className="h-4 w-4 ml-2" />
                      تحويل النص
                    </TabsTrigger>
                    <TabsTrigger value="pdf" className="flex items-center">
                      <FileText className="h-4 w-4 ml-2" />
                      تحويل PDF
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="text" className="space-y-4">
                    <TextToSpeechForm
                      selectedVoiceId={selectedVoiceId}
                      onConvert={handleTextToSpeech}
                      isLoading={isLoading}
                    />
                  </TabsContent>
                  
                  <TabsContent value="pdf" className="space-y-4">
                    <PDFUploader onTextExtracted={handleTextToSpeech} audioUrl={audioUrl} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-primary/20 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">
                    <Languages className="inline ml-2 h-5 w-5 text-primary" />
                    الأصوات المتاحة
                  </h2>
                  
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center"
                    >
                      <Filter className="ml-1 h-4 w-4" />
                      فلترة
                      <ChevronUp className={`mr-1 h-3 w-3 transition-transform ${!showFilters ? 'rotate-180' : ''}`} />
                    </Button>
                  </div>
                </div>
                
                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2 pt-2 pb-4 border-b animate-fade-in">
                    <div className="col-span-2 md:col-span-2">
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
                
                {filteredVoices.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto p-1">
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
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {isLoading ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin h-8 w-8 mb-2 border-4 border-primary border-t-transparent rounded-full"></div>
                        <p>جاري تحميل الأصوات...</p>
                      </div>
                    ) : (
                      <p>لا توجد أصوات متطابقة مع معايير البحث</p>
                    )}
                  </div>
                )}
                
                <div className="flex justify-between text-sm text-muted-foreground pt-2 border-t">
                  <span>إجمالي الأصوات: {filteredVoices.length}</span>
                  <Badge variant="outline">{filter === 'all' ? 'كل الأصوات' : filter === 'arabic' ? 'العربية فقط' : 'لغات أخرى'}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {isConverting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl flex flex-col items-center">
            <div className="animate-spin h-12 w-12 mb-4 border-4 border-primary border-t-transparent rounded-full"></div>
            <p className="text-lg font-medium">جاري تحويل النص إلى صوت...</p>
            <p className="text-sm text-muted-foreground mt-2">يرجى الانتظار قليلاً</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;

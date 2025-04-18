
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { VoiceCard } from "@/components/VoiceCard";
import { TextToSpeechForm } from "@/components/TextToSpeechForm";
import { PDFUploader } from "@/components/PDFUploader";
import { AudioPlayer } from "@/components/AudioPlayer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, ChevronUp, Download, Languages, Search, FileText, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 font-sans" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            محول النص إلى كلام
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            حول النص إلى كلام باستخدام تقنية ElevenLabs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* الجانب الأيمن - معلومات الصوت المختار والصور */}
          <div className="md:col-span-1 space-y-6">
            <div className="glass rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <h2 className="text-xl font-bold flex items-center">
                <Volume2 className="h-5 w-5 ml-2" />
                الصوت المحدد
              </h2>
              
              {selectedVoiceId ? (
                <div className="space-y-2">
                  {voices.find(v => v.voice_id === selectedVoiceId)?.name && (
                    <p className="text-lg font-semibold text-primary">
                      {voices.find(v => v.voice_id === selectedVoiceId)?.name}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">اللغة: </span>
                    {voices.find(v => v.voice_id === selectedVoiceId)?.labels?.language || 'غير معروف'}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground italic">لم يتم اختيار صوت</p>
              )}
            </div>
            
            {/* مساحة للصور */}
            <div className="glass rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="aspect-square bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">صورة</span>
              </div>
            </div>
            
            <div className="glass rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="aspect-video bg-gradient-to-r from-purple-200 to-blue-200 dark:from-purple-900 dark:to-blue-900 flex items-center justify-center">
                <span className="text-gray-700 dark:text-gray-300">رسم توضيحي</span>
              </div>
            </div>
          </div>
          
          {/* الجانب الأيسر - أدوات التحويل */}
          <div className="md:col-span-2 space-y-6">
            <div className="glass rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-6 animate-scale-in">
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
              
              {audioUrl && (
                <div className="space-y-4 animate-fade-in">
                  <AudioPlayer audioUrl={audioUrl} />
                  
                  <Button onClick={handleDownload} variant="outline" className="w-full">
                    <Download className="ml-2 h-4 w-4" />
                    تحميل الملف الصوتي
                  </Button>
                </div>
              )}
              
              {isConverting && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl flex flex-col items-center">
                    <div className="animate-spin h-12 w-12 mb-4 border-4 border-primary border-t-transparent rounded-full"></div>
                    <p className="text-lg font-medium">جاري تحويل النص إلى صوت...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="glass rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  <Languages className="inline ml-2 h-5 w-5" />
                  الأصوات المتاحة
                </h2>
                
                <div className="flex space-x-2">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto p-1">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;


import { useState, useEffect } from 'react';
import { VoiceCard } from "./VoiceCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Filter, ChevronUp, Languages, Search } from "lucide-react";
import { useToast } from "./ui/use-toast";

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

interface VoicesListProps {
  onVoiceSelect: (voiceId: string) => void;
  selectedVoiceId: string | null;
}

export const VoicesList = ({ onVoiceSelect, selectedVoiceId }: VoicesListProps) => {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [filteredVoices, setFilteredVoices] = useState<Voice[]>([]);
  const [filter, setFilter] = useState<'all' | 'arabic' | 'other'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
          'xi-api-key': 'sk_53335c6f855ee582fac086690b4c039d3e100fbd2992c3a9'
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

  return (
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-1">
          {filteredVoices.length > 0 ? (
            filteredVoices.map((voice) => (
              <VoiceCard
                key={voice.voice_id}
                voice={voice}
                isSelected={selectedVoiceId === voice.voice_id}
                onSelect={onVoiceSelect}
                onPlaySample={() => {}}
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
  );
};

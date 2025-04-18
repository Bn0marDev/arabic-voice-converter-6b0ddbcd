
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { VoicePreview } from "./VoicePreview";
import { Badge } from "./ui/badge";
import { User, Star } from "lucide-react";

interface Voice {
  name: string;
  voice_id: string;
  labels?: {
    language?: string;
    accent?: string;
    gender?: string;
    age?: string;
  };
  description?: string;
  preview_url?: string;
}

interface VoiceCardProps {
  voice: Voice;
  isSelected: boolean;
  onSelect: (voiceId: string) => void;
  onPlaySample: (previewUrl: string) => void;
}

export const VoiceCard = ({ voice, isSelected, onSelect, onPlaySample }: VoiceCardProps) => {
  // تحديد لون بناءً على اللغة
  const getLanguageColor = (language?: string) => {
    if (!language) return "bg-gray-500";
    
    switch (language.toLowerCase()) {
      case "arabic":
      case "ar":
        return "bg-green-500";
      case "english":
      case "en":
        return "bg-blue-500";
      case "french":
      case "fr":
        return "bg-indigo-500";
      case "spanish":
      case "es":
        return "bg-amber-500";
      default:
        return "bg-purple-500";
    }
  };

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all duration-300 hover:scale-105 relative overflow-hidden",
        isSelected ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md",
        "glass"
      )}
      onClick={() => onSelect(voice.voice_id)}
    >
      {isSelected && (
        <div className="absolute top-0 right-0 bg-primary text-white px-2 py-1 text-xs font-bold">
          تم الاختيار
        </div>
      )}

      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg flex items-center">
          <User className="h-4 w-4 mr-1 text-primary" />
          {voice.name}
        </h3>
        <VoicePreview 
          previewUrl={voice.preview_url} 
          onPlay={onPlaySample}
        />
      </div>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {voice.labels?.language && (
          <Badge variant="outline" className={cn("text-white", getLanguageColor(voice.labels.language))}>
            {voice.labels.language}
          </Badge>
        )}
        {voice.labels?.accent && (
          <Badge variant="outline">
            {voice.labels.accent}
          </Badge>
        )}
        {voice.labels?.gender && (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            {voice.labels.gender}
          </Badge>
        )}
      </div>

      <div className="text-sm text-muted-foreground space-y-1">
        <div className="flex items-center">
          <Star className="h-3 w-3 text-yellow-500 mr-1" />
          <span className="font-medium">الصوت:</span>
          <span className="mr-1 text-xs opacity-80">{voice.voice_id.substring(0, 8)}...</span>
        </div>
      </div>

      {voice.description && (
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
          {voice.description}
        </p>
      )}
    </Card>
  );
};

import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { VoicePreview } from "./VoicePreview";

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

interface VoiceCardProps {
  voice: Voice;
  isSelected: boolean;
  onSelect: (voiceId: string) => void;
  onPlaySample: (previewUrl: string) => void;
}

export const VoiceCard = ({ voice, isSelected, onSelect, onPlaySample }: VoiceCardProps) => {
  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all duration-300 hover:scale-105 relative",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={() => onSelect(voice.voice_id)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg">{voice.name}</h3>
        <VoicePreview 
          previewUrl={voice.preview_url} 
          onPlay={onPlaySample}
        />
      </div>
      <p className="text-sm text-muted-foreground">
        <strong>المعرف:</strong> {voice.voice_id}
      </p>
      <p className="text-sm text-muted-foreground">
        <strong>اللغة:</strong> {voice.labels?.language || 'غير معروف'}
      </p>
      <p className="text-sm text-muted-foreground">
        <strong>النوع:</strong> {voice.labels?.accent || 'غير معروف'}
      </p>
      {voice.description && (
        <p className="text-sm text-muted-foreground mt-2">
          {voice.description}
        </p>
      )}
    </Card>
  );
};
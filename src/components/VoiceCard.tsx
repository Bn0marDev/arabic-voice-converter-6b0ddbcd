import { Play, Mic } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

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
        {voice.preview_url && (
          <Button
            variant="ghost"
            size="icon"
            className="animate-pulse hover:animate-none"
            onClick={(e) => {
              e.stopPropagation();
              onPlaySample(voice.preview_url!);
            }}
          >
            <Play className="h-4 w-4" />
          </Button>
        )}
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
import { Play } from "lucide-react";
import { Button } from "./ui/button";

interface VoicePreviewProps {
  previewUrl?: string;
  onPlay: (url: string) => void;
}

export const VoicePreview = ({ previewUrl, onPlay }: VoicePreviewProps) => {
  if (!previewUrl) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="animate-pulse hover:animate-none"
      onClick={() => onPlay(previewUrl)}
    >
      <Play className="h-4 w-4" />
    </Button>
  );
};
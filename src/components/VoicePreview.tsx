import { useState } from "react";
import { Play, Pause, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface VoicePreviewProps {
  previewUrl?: string;
  onPlay: (url: string) => void;
}

// Keep track of current audio element globally to avoid multiple playbacks
let currentAudio: HTMLAudioElement | null = null;

export const VoicePreview = ({ previewUrl, onPlay }: VoicePreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!previewUrl) return null;

  const handlePlay = async () => {
    if (isPlaying) {
      // Stop current playback
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    try {
      // Stop any other playing audio first
      if (currentAudio) {
        currentAudio.pause();
      }

      // Create new audio element
      const audio = new Audio(previewUrl);
      currentAudio = audio;
      
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        currentAudio = null;
      });
      
      await audio.play();
      setIsPlaying(true);
      onPlay(previewUrl);
    } catch (error) {
      console.error("Error playing audio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "rounded-full h-8 w-8 transition-all",
        isPlaying ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
      )}
      onClick={(e) => {
        e.stopPropagation();
        handlePlay();
      }}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isPlaying ? (
        <Pause className="h-4 w-4" />
      ) : (
        <Play className="h-4 w-4" />
      )}
    </Button>
  );
};

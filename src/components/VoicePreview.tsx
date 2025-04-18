
import { useState } from "react";
import { Play, Pause, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface VoicePreviewProps {
  previewUrl?: string;
  onPlay: (url: string) => void;
}

export const VoicePreview = ({ previewUrl, onPlay }: VoicePreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!previewUrl) return null;

  const handlePlay = async () => {
    if (isPlaying) {
      // إيقاف الصوت الحالي
      const audio = document.querySelector("audio");
      if (audio) {
        audio.pause();
      }
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    try {
      // إيقاف أي صوت آخر قيد التشغيل
      const playingAudio = document.querySelector("audio");
      if (playingAudio) {
        playingAudio.pause();
      }

      // إنشاء عنصر صوت جديد
      const audio = new Audio(previewUrl);
      audio.addEventListener("ended", () => setIsPlaying(false));
      audio.addEventListener("play", () => setIsPlaying(true));
      await audio.play();
      
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

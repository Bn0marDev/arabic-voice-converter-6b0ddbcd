import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
}

export const VoiceRecorder = ({ onRecordingComplete }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcesing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في الوصول إلى الميكروفون",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  return (
    <div className="flex justify-center gap-2">
      <Button
        variant={isRecording ? "destructive" : "default"}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcesing}
      >
        {isRecording ? (
          <>
            <Square className="mr-2 h-4 w-4" />
            إيقاف التسجيل
          </>
        ) : (
          <>
            <Mic className="mr-2 h-4 w-4" />
            بدء التسجيل
          </>
        )}
      </Button>
      {isProcesing && (
        <div className="flex items-center">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="mr-2">جاري المعالجة...</span>
        </div>
      )}
    </div>
  );
};
import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  selectedVoiceId: string | null;
}

export const VoiceRecorder = ({ onRecordingComplete, selectedVoiceId }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    if (!selectedVoiceId) {
      toast({
        title: "تنبيه",
        description: "الرجاء اختيار صوت أولاً",
        variant: "destructive",
      });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
        setIsProcessing(true);
        
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob);
          formData.append('model_id', 'eleven_multilingual_v2');

          const response = await fetch(`https://api.elevenlabs.io/v1/voice-generation/${selectedVoiceId}`, {
            method: 'POST',
            headers: {
              'xi-api-key': 'sk_53335c6f855ee582fac086690b4c039d3e100fbd2992c3a9',
            },
            body: formData
          });

          if (!response.ok) {
            throw new Error('فشل في معالجة التسجيل الصوتي');
          }

          const resultBlob = await response.blob();
          onRecordingComplete(resultBlob);
          
          toast({
            title: "تم بنجاح",
            description: "تم معالجة التسجيل الصوتي بنجاح",
          });
        } catch (error) {
          toast({
            title: "خطأ",
            description: error instanceof Error ? error.message : 'حدث خطأ أثناء معالجة التسجيل',
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
        }
        
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
    }
  };

  return (
    <div className="flex justify-center gap-2">
      <Button
        variant={isRecording ? "destructive" : "default"}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        className="glass-button"
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
      {isProcessing && (
        <div className="flex items-center">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="mr-2">جاري المعالجة...</span>
        </div>
      )}
    </div>
  );
};
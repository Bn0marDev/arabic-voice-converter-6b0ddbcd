import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Volume2 } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface TextToSpeechFormProps {
  selectedVoiceId: string | null;
  onConvert: (text: string) => Promise<void>;
  isLoading: boolean;
}

export const TextToSpeechForm = ({ selectedVoiceId, onConvert, isLoading }: TextToSpeechFormProps) => {
  const [text, setText] = useState("");
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!text) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال نص أولاً",
        variant: "destructive"
      });
      return;
    }

    if (!selectedVoiceId) {
      toast({
        title: "خطأ",
        description: "الرجاء اختيار صوت",
        variant: "destructive"
      });
      return;
    }

    await onConvert(text);
  };

  return (
    <div className="space-y-4">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="أدخل النص هنا..."
        className="min-h-[120px] text-right glass"
        dir="rtl"
      />
      <Button 
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full"
      >
        <Volume2 className="mr-2 h-4 w-4" />
        تحويل النص إلى كلام
      </Button>
    </div>
  );
};

import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Volume2, Loader2, MessageSquare } from "lucide-react";
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

  // أمثلة من النصوص
  const textExamples = [
    "مرحباً بك في محول النص إلى كلام. يمكنك استخدام هذه الخدمة لتحويل النصوص العربية إلى ملفات صوتية.",
    "السلام عليكم ورحمة الله وبركاته، أهلاً بكم في هذا البرنامج المميز لتحويل النصوص إلى أصوات طبيعية.",
    "يعد التعلم المستمر أحد أهم مفاتيح النجاح في العصر الحديث، حيث تتسارع التغيرات التكنولوجية بشكل غير مسبوق."
  ];

  const setExampleText = (example: string) => {
    setText(example);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="أدخل النص هنا..."
          className="min-h-[150px] text-right resize-none pr-4 pt-4"
          dir="rtl"
        />
        
        <div className="absolute top-2 left-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-2">
        <div className="text-xs text-muted-foreground mb-1 w-full">أمثلة نصية:</div>
        {textExamples.map((example, index) => (
          <button
            key={index}
            onClick={() => setExampleText(example)}
            className="text-xs bg-accent hover:bg-accent/80 dark:bg-accent dark:hover:bg-accent/80 px-2 py-1 rounded text-accent-foreground transition-colors truncate max-w-[180px]"
          >
            {example.substring(0, 25)}...
          </button>
        ))}
      </div>
      
      <Button 
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all duration-300"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            جاري التحويل...
          </>
        ) : (
          <>
            <Volume2 className="mr-2 h-4 w-4" />
            تحويل النص إلى كلام
          </>
        )}
      </Button>
    </div>
  );
};

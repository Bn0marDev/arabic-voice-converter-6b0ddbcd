
import { Card, CardContent } from "./ui/card";
import { Volume2 } from "lucide-react";

interface Voice {
  name: string;
  labels?: {
    language?: string;
    accent?: string;
  };
}

interface SelectedVoiceInfoProps {
  selectedVoiceId: string | null;
  voices: Voice[];
}

export const SelectedVoiceInfo = ({ selectedVoiceId, voices }: SelectedVoiceInfoProps) => {
  const selectedVoice = voices.find(v => v.voice_id === selectedVoiceId);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-primary" />
          الصوت المحدد
        </h2>
        
        {selectedVoice ? (
          <div className="space-y-3">
            <p className="text-lg font-semibold text-primary">
              {selectedVoice.name}
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-accent/50 rounded-lg p-2">
                <span className="font-medium block">اللغة</span>
                <span>{selectedVoice.labels?.language || 'غير معروف'}</span>
              </div>
              <div className="bg-accent/50 rounded-lg p-2">
                <span className="font-medium block">اللهجة</span>
                <span>{selectedVoice.labels?.accent || 'غير معروف'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">الرجاء اختيار صوت من القائمة</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

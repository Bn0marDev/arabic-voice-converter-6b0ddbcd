
import { Loader2 } from "lucide-react";

interface ConversionOverlayProps {
  isConverting: boolean;
}

export const ConversionOverlay = ({ isConverting }: ConversionOverlayProps) => {
  if (!isConverting) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-background p-8 rounded-xl shadow-xl flex flex-col items-center gap-4">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
        <p className="text-lg font-medium">جاري تحويل النص إلى صوت...</p>
        <p className="text-sm text-muted-foreground">يرجى الانتظار قليلاً</p>
      </div>
    </div>
  );
};

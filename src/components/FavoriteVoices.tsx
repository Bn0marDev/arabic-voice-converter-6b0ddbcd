
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface FavoriteVoice {
  id: string;
  name: string;
  timestamp: Date;
}

export const FavoriteVoices = () => {
  const favorites: FavoriteVoice[] = []; // سيتم ربطها لاحقاً بالتخزين المحلي

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>الأصوات المفضلة</span>
      </div>
      
      {favorites.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">
          لم تقم بإضافة أي صوت للمفضلة بعد
        </p>
      ) : (
        <div className="space-y-2">
          {favorites.map((voice) => (
            <Card key={voice.id} className="hover:bg-accent/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span>{voice.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(voice.timestamp).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

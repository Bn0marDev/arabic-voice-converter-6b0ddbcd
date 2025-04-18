
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const LandingPage = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen relative overflow-hidden bg-background font-cairo">
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="rounded-full"
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>
      
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              حول النصوص إلى كلام طبيعي
            </h1>
            <p className="text-xl text-muted-foreground">
              استخدم أفضل الأصوات الاصطناعية لتحويل المحتوى النصي إلى صوت واقعي، دون الحاجة لتسجيل صوتك.
            </p>
            <Button asChild size="lg" className="rounded-xl">
              <Link to="/app" className="inline-flex items-center">
                ابدأ الآن
                <ArrowLeft className="mr-2 h-4 w-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
          
          <div className="flex justify-center">
            <img
              src="/lovable-uploads/043bbd74-e203-4dfb-ab25-2e508102fd8c.png"
              alt="AI Voice Assistant"
              className="w-full h-auto object-contain max-w-xl rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>
      
      <footer className="absolute bottom-0 w-full py-4 text-center text-muted-foreground">
        <p>© 2025 محول النص إلى كلام. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

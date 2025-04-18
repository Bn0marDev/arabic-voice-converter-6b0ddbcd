
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-5xl font-bold leading-tight">
              حول النصوص إلى كلام طبيعي
            </h1>
            <p className="text-xl text-gray-300">
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
              className="max-w-full h-auto animate-fade-in animation-delay-300"
            />
          </div>
        </div>
      </div>
      
      <footer className="absolute bottom-0 w-full py-4 text-center text-gray-400">
        <p>© 2025 محول النص إلى كلام. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

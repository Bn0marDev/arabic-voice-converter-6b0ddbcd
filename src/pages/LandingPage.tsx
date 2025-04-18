
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Headphones, FileText, Download, Mic, Volume2 } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* خلفية متدرجة */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-100 to-indigo-200 dark:from-violet-950 dark:to-indigo-900 -z-10"></div>
      
      {/* زخارف مع تأثيرات حركية */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-r from-orange-300 to-rose-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float dark:mix-blend-overlay"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-300 to-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-2000 dark:mix-blend-overlay"></div>
      
      {/* المحتوى */}
      <div className="container mx-auto px-4 py-20">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center">
            <Volume2 className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-3xl font-bold text-primary">محول النص إلى كلام</h1>
          </div>
          <Button asChild variant="ghost" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-primary">
            <Link to="/app">
              ابدأ الآن
              <ArrowLeft className="mr-2 h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-5xl font-bold text-primary leading-tight">حول النصوص إلى كلام عربي طبيعي</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              استخدم أفضل الأصوات الاصطناعية لتحويل المحتوى النصي إلى صوت واقعي، دون الحاجة لتسجيل صوتك.
            </p>
            <div className="flex gap-4 pt-6">
              <Button asChild size="lg" className="rounded-xl">
                <Link to="/app">جرب الآن مجانًا</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl">
                <a href="#features">تعرف على المزيد</a>
              </Button>
            </div>
          </div>
          <div className="glass rounded-3xl overflow-hidden p-8 shadow-xl animate-scale-in">
            {/* مساحة للصورة */}
            <div className="aspect-video bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center">
              <Headphones className="h-20 w-20 text-gray-400 dark:text-gray-600" />
              <span className="text-gray-500 dark:text-gray-400 text-lg mr-3">صورة توضيحية</span>
            </div>
          </div>
        </div>

        <section id="features" className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">المميزات الرئيسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass rounded-2xl p-6 text-center hover:scale-105 transition-transform">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">تحويل ملفات PDF</h3>
              <p className="text-gray-600 dark:text-gray-300">حمّل ملفات PDF واستخرج النصوص منها وحولها إلى كلام بسهولة.</p>
            </div>
            
            <div className="glass rounded-2xl p-6 text-center hover:scale-105 transition-transform">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Volume2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">أصوات متنوعة</h3>
              <p className="text-gray-600 dark:text-gray-300">اختر من بين تشكيلة واسعة من الأصوات العربية وغيرها من اللغات.</p>
            </div>
            
            <div className="glass rounded-2xl p-6 text-center hover:scale-105 transition-transform">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">تنزيل الملفات الصوتية</h3>
              <p className="text-gray-600 dark:text-gray-300">احفظ المقاطع الصوتية كملفات MP3 واستخدمها في مشاريعك المختلفة.</p>
            </div>
          </div>
        </section>

        <footer className="mt-24 pt-10 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-400">© 2025 محول النص إلى كلام. جميع الحقوق محفوظة.</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;

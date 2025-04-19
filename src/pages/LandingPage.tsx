
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Volume2, Megaphone, Check } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";

const LandingPage = () => {
  return (
    <MainLayout>
      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary mb-2">
                <Megaphone className="h-4 w-4 ml-1" />
                تحويل النص إلى كلام
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tighter">
                حول النصوص إلى كلام طبيعي بجودة عالية
              </h1>
              
              <p className="text-lg text-muted-foreground">
                استخدم أفضل الأصوات الاصطناعية لتحويل المحتوى النصي إلى صوت واقعي، دون الحاجة لتسجيل صوتك.
              </p>
              
              <div className="space-y-4">
                <ul className="space-y-2">
                  {[
                    "مجموعة متنوعة من الأصوات باللغة العربية",
                    "سهولة استخدام واجهة بسيطة",
                    "تحميل الملفات الصوتية بعد التحويل"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-5 w-5 ml-2 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="rounded-xl">
                  <Link to="/app" className="inline-flex items-center">
                    ابدأ الآن
                    <ArrowLeft className="mr-2 h-4 w-4 rtl:rotate-180" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="rounded-xl">
                  <a href="#features" className="inline-flex items-center">
                    تعرف على المزيد
                  </a>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10 rounded-xl overflow-hidden border shadow-lg aspect-square md:aspect-auto md:h-[500px]">
                <img
                  src="/lovable-uploads/043bbd74-e203-4dfb-ab25-2e508102fd8c.png"
                  alt="محول النص إلى كلام"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="features" className="py-12 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">المميزات الرئيسية</h2>
            <p className="text-muted-foreground">
              استفد من أحدث تقنيات الذكاء الاصطناعي لتحويل النصوص إلى أصوات طبيعية
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card rounded-xl overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">صناعة المحتوى الصوتي</h3>
                <p className="text-muted-foreground mb-4">أنشئ مقاطع صوتية بجودة عالية لمحتواك</p>
              </div>
              <div className="aspect-video h-[350px] flex items-center justify-center p-4 relative">
                <img 
                  src="/lovable-uploads/04cece51-8bad-4144-81ad-c0a1a8f3f43c.png" 
                  alt="صناعة المحتوى الصوتي"
                  className="max-h-full object-contain"
                />
              </div>
            </div>
            
            <div className="bg-card rounded-xl overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">وصول أوسع للمحتوى</h3>
                <p className="text-muted-foreground mb-4">اجعل محتواك في متناول الجميع</p>
              </div>
              <div className="aspect-video h-[350px] flex items-center justify-center p-4">
                <img 
                  src="/lovable-uploads/69fc8222-f52c-43f1-89be-3c4804a534e8.png" 
                  alt="وصول أوسع"
                  className="max-h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12 md:py-20">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">ابدأ الآن مجاناً</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            انضم إلى آلاف المستخدمين الذين يستفيدون من خدمة تحويل النص إلى كلام
          </p>
          <Button asChild size="lg">
            <Link to="/app">
              <Volume2 className="mr-2 h-5 w-5" />
              جرّب محول النص إلى كلام
            </Link>
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};

export default LandingPage;

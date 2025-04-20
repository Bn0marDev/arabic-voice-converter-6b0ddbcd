
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Volume2, LogIn } from "lucide-react";

const LoginPage = () => {
  const { user, loading, signInWithGoogle } = useAuth();

  // إذا كان المستخدم مسجل الدخول بالفعل، توجيهه إلى الصفحة الرئيسية
  if (user && !loading) {
    return <Navigate to="/app" replace />;
  }

  return (
    <MainLayout>
      <div className="container py-10 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <Volume2 className="h-6 w-6 text-primary" />
              محول النص إلى كلام
            </CardTitle>
            <CardDescription>
              سجل الدخول للوصول إلى خدمات محول النص إلى كلام
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={signInWithGoogle}
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  جاري التحميل...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  تسجيل الدخول باستخدام Google
                </span>
              )}
            </Button>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            بتسجيل الدخول، أنت توافق على سياسة الخصوصية وشروط الخدمة
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default LoginPage;

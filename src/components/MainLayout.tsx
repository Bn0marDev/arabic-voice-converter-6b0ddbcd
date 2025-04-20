
import { Link } from "react-router-dom";
import { Home, Volume2, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfileButton } from "./UserProfileButton";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-background font-cairo relative">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link to="/" className="flex items-center gap-2">
              <Volume2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg hidden md:inline-block">محول النص إلى كلام</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              الرئيسية
            </Link>
            <Link to="/app" className="text-sm font-medium transition-colors hover:text-primary">
              محول النص
            </Link>
          </nav>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <UserProfileButton />
            ) : (
              <Button asChild size="sm" className="hidden md:flex">
                <Link to="/login">تسجيل الدخول</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 md:hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <nav className="container grid gap-2 p-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-5 w-5" />
              <span>الرئيسية</span>
            </Link>
            <Link 
              to="/app" 
              className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              <Volume2 className="h-5 w-5" />
              <span>محول النص</span>
            </Link>
            {!user && (
              <Link 
                to="/login" 
                className="flex items-center gap-2 p-2 rounded-md hover:bg-accent mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>تسجيل الدخول</span>
              </Link>
            )}
          </nav>
        </div>
      )}
      
      <main className={cn("flex-1", isMenuOpen && "h-screen overflow-hidden md:overflow-auto")}>
        {children}
      </main>
      
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-14">
          <p className="text-sm text-muted-foreground">
            © 2025 محول النص إلى كلام
          </p>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </footer>
    </div>
  );
};

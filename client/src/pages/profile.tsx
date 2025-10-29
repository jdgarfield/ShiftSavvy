import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LogOut, Globe, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    toast({
      title: t('common.success'),
      description: "Language updated successfully",
    });
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="container max-w-screen-md mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-heading font-semibold">{t('profile.title')}</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container max-w-screen-md mx-auto px-4 py-6 space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.profileImageUrl || ''} />
              <AvatarFallback className="text-2xl font-heading bg-primary text-primary-foreground">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-heading font-semibold">
                {user?.firstName || user?.lastName
                  ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                  : 'User'}
              </h2>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-heading font-semibold mb-4">{t('profile.settings')}</h3>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4" />
              {t('profile.language')}
            </Label>
            <Select
              value={i18n.language}
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger data-testid="select-language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Moon className="h-4 w-4" />
              {t('profile.theme')}
            </Label>
            <Select
              value={theme}
              onValueChange={(value: 'light' | 'dark') => setTheme(value)}
            >
              <SelectTrigger data-testid="select-theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{t('profile.light')}</SelectItem>
                <SelectItem value="dark">{t('profile.dark')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Button
          variant="destructive"
          onClick={handleLogout}
          data-testid="button-logout"
          className="w-full hover-elevate active-elevate-2"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t('profile.logout')}
        </Button>
      </main>

      <BottomNav />
    </div>
  );
}

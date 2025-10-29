import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LogOut, Globe, Moon, DollarSign } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
];

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  
  const [state, setState] = useState(user?.state || '');
  const [localTaxRate, setLocalTaxRate] = useState(user?.localTaxRate ? (parseFloat(user.localTaxRate) * 100).toFixed(2) : '');

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

  const updateTaxSettingsMutation = useMutation({
    mutationFn: async (data: { state?: string; localTaxRate?: number }) => {
      return await apiRequest('PATCH', '/api/auth/user/tax-settings', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: t('common.success'),
        description: "Tax settings updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update tax settings",
        variant: "destructive",
      });
    },
  });

  const handleSaveTaxSettings = () => {
    const localRate = localTaxRate ? parseFloat(localTaxRate) / 100 : undefined;
    updateTaxSettingsMutation.mutate({
      state: state || undefined,
      localTaxRate: localRate,
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
          <div>
            <h1 className="text-lg font-heading font-semibold">ShiftSavvy</h1>
            <p className="text-xs text-muted-foreground">{t('profile.title')}</p>
          </div>
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

        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Tax Settings
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Set your state and local tax rate for accurate tax estimates on your earnings.
          </p>

          <div>
            <Label htmlFor="state" className="mb-2">State</Label>
            <Select
              value={state}
              onValueChange={setState}
            >
              <SelectTrigger id="state" data-testid="select-state">
                <SelectValue placeholder="Select your state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map(s => (
                  <SelectItem key={s.code} value={s.code}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="localTaxRate" className="mb-2">Local Tax Rate (%)</Label>
            <Input
              id="localTaxRate"
              type="number"
              step="0.01"
              min="0"
              max="20"
              placeholder="2.00"
              value={localTaxRate}
              onChange={(e) => setLocalTaxRate(e.target.value)}
              data-testid="input-local-tax-rate"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter as percentage (e.g., 2.00 for 2%)
            </p>
          </div>

          <Button
            onClick={handleSaveTaxSettings}
            disabled={updateTaxSettingsMutation.isPending}
            data-testid="button-save-tax-settings"
            className="w-full hover-elevate active-elevate-2"
          >
            {updateTaxSettingsMutation.isPending ? 'Saving...' : 'Save Tax Settings'}
          </Button>
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

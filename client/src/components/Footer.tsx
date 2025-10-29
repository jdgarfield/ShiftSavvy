import { Mail, MapPin, Shield } from "lucide-react";
import { SiInstagram, SiFacebook, SiTiktok } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface FooterProps {
  isAuthenticated?: boolean;
}

export function Footer({ isAuthenticated = false }: FooterProps) {
  const { i18n } = useTranslation();
  const { toast } = useToast();

  const changeLanguage = useMutation({
    mutationFn: async (lng: string) => {
      await i18n.changeLanguage(lng);
      // Only save to server if user is authenticated
      if (isAuthenticated) {
        return await apiRequest('PATCH', '/api/auth/user/profile', { language: lng });
      }
    },
    onSuccess: () => {
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      }
    },
    onError: () => {
      // Only show error toast for authenticated users
      if (isAuthenticated) {
        toast({
          title: "Error",
          description: "Failed to update language preference",
          variant: "destructive",
        });
      }
    },
  });

  const currentLanguage = i18n.language || 'en';

  return (
    <footer role="contentinfo" className="w-full border-t bg-card border-border mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand / Blurb */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary" aria-hidden="true" />
              <span className="text-xl font-heading font-bold text-primary">ShiftSavvy</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Tools for tipped pros to track earnings, shifts, and taxes—clearly and securely.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              <span>Louisville, KY 40206</span>
            </div>
            <a 
              href="mailto:contact@shiftsavvy.app" 
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              data-testid="link-footer-contact"
            >
              <Mail className="h-4 w-4" aria-hidden="true" /> Contact Us
            </a>
          </div>

          {/* Product */}
          <nav aria-label="Product" className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <ul className="space-y-3 text-sm">
              <li><Link className="text-muted-foreground hover:text-foreground transition-colors" href="/" data-testid="link-footer-dashboard">Dashboard</Link></li>
              <li><Link className="text-muted-foreground hover:text-foreground transition-colors" href="/calendar" data-testid="link-footer-calendar">Calendar</Link></li>
              <li><Link className="text-muted-foreground hover:text-foreground transition-colors" href="/reports" data-testid="link-footer-reports">Reports</Link></li>
              <li><Link className="text-muted-foreground hover:text-foreground transition-colors" href="/jobs" data-testid="link-footer-jobs">Jobs</Link></li>
            </ul>
          </nav>

          {/* Legal */}
          <nav aria-label="Legal" className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><a className="text-muted-foreground hover:text-foreground transition-colors" href="/legal/terms" data-testid="link-footer-terms">Terms of Service</a></li>
              <li><a className="text-muted-foreground hover:text-foreground transition-colors" href="/legal/privacy" data-testid="link-footer-privacy">Privacy Policy</a></li>
              <li><a className="text-muted-foreground hover:text-foreground transition-colors" href="/legal/security" data-testid="link-footer-security">Security</a></li>
            </ul>
          </nav>

          {/* Language & Security */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Language</h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={currentLanguage === 'en' ? 'default' : 'outline'}
                  onClick={() => changeLanguage.mutate('en')}
                  disabled={changeLanguage.isPending}
                  data-testid="button-language-en"
                  className="hover-elevate active-elevate-2"
                >
                  EN
                </Button>
                <Button
                  size="sm"
                  variant={currentLanguage === 'es' ? 'default' : 'outline'}
                  onClick={() => changeLanguage.mutate('es')}
                  disabled={changeLanguage.isPending}
                  data-testid="button-language-es"
                  className="hover-elevate active-elevate-2"
                >
                  ES
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Shield className="h-4 w-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>Secured with Replit Auth. Data protected with PostgreSQL encryption.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-border" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ShiftSavvy. All rights reserved.
          </p>

          <div className="flex items-center gap-2" aria-label="Social links">
            <a 
              aria-label="ShiftSavvy on Instagram" 
              className="p-2 rounded-md hover-elevate active-elevate-2 text-muted-foreground hover:text-foreground transition-colors" 
              href="https://instagram.com/shiftsavvy"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-footer-instagram"
            >
              <SiInstagram className="h-4 w-4" />
            </a>
            <a 
              aria-label="ShiftSavvy on TikTok" 
              className="p-2 rounded-md hover-elevate active-elevate-2 text-muted-foreground hover:text-foreground transition-colors" 
              href="https://tiktok.com/@shiftsavvy"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-footer-tiktok"
            >
              <SiTiktok className="h-4 w-4" />
            </a>
            <a 
              aria-label="ShiftSavvy on Facebook" 
              className="p-2 rounded-md hover-elevate active-elevate-2 text-muted-foreground hover:text-foreground transition-colors" 
              href="https://facebook.com/shiftsavvy"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-footer-facebook"
            >
              <SiFacebook className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

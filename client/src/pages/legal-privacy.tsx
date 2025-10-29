import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";

export default function PrivacyPolicy() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Link href={isAuthenticated ? "/" : "/"}>
            <Button variant="ghost" size="sm" className="mb-6 hover-elevate active-elevate-2" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-heading font-bold">Privacy Policy</h1>
              </div>
              
              <div className="space-y-6 text-muted-foreground">
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
                  <p>ShiftSavvy collects information you provide directly, including your email address, name, work shifts, earnings data, employer information, and tax settings. We use Replit Authentication for secure login.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
                  <p>Your data is used to provide shift tracking, earnings calculations, tax estimates, and reports. We do not sell or share your personal information with third parties for marketing purposes.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">3. Data Security</h2>
                  <p>We store your data securely using PostgreSQL with encryption. Authentication is handled through Replit Auth using industry-standard OAuth 2.0 protocols.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">4. Your Rights</h2>
                  <p>You have the right to access, update, or delete your personal information at any time through your profile settings. You may also request a full export of your data.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">5. Cookies and Tracking</h2>
                  <p>ShiftSavvy uses essential cookies for authentication and session management. We do not use third-party tracking or advertising cookies.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">6. Contact</h2>
                  <p>Questions about this Privacy Policy should be sent to <a href="mailto:contact@shiftsavvy.app" className="text-primary hover:underline">contact@shiftsavvy.app</a></p>
                </section>

                <p className="text-sm pt-4 border-t">Last updated: October 2025</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      {isAuthenticated && <BottomNav />}
      <Footer isAuthenticated={isAuthenticated} />
    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock } from "lucide-react";
import { Link } from "wouter";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";

export default function Security() {
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
                <Lock className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-heading font-bold">Security</h1>
              </div>
              
              <div className="space-y-6 text-muted-foreground">
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">1. Authentication</h2>
                  <p>ShiftSavvy uses Replit Auth, a secure OAuth 2.0 authentication provider. Your credentials are never stored by ShiftSavvy directly.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">2. Data Encryption</h2>
                  <p>All data transmitted between your device and our servers is encrypted using HTTPS/TLS. Your data is stored in a secure PostgreSQL database with encryption at rest.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">3. Session Management</h2>
                  <p>Sessions are managed using secure, HTTP-only cookies with a 7-day expiration. Sessions are stored in the database and can be revoked at any time by logging out.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Access</h2>
                  <p>Your financial data is private and only accessible to you when logged in. We implement row-level security to ensure users can only access their own data.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">5. Best Practices</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Always log out when using shared devices</li>
                    <li>Keep your device and browser updated</li>
                    <li>Report suspicious activity to <a href="mailto:contact@shiftsavvy.app" className="text-primary hover:underline">contact@shiftsavvy.app</a></li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">6. Security Incidents</h2>
                  <p>In the unlikely event of a security breach, we will notify affected users within 72 hours and provide guidance on protective measures.</p>
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

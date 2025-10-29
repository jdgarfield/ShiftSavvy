import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Scale } from "lucide-react";
import { Link } from "wouter";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";

export default function TermsOfService() {
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
                <Scale className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-heading font-bold">Terms of Service</h1>
              </div>
              
              <div className="space-y-6 text-muted-foreground">
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
                  <p>By accessing and using ShiftSavvy, you accept and agree to be bound by the terms and provision of this agreement.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">2. Use License</h2>
                  <p>Permission is granted to use ShiftSavvy for personal, non-commercial tracking of work shifts, tips, and earnings. This is the grant of a license, not a transfer of title.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">3. Data Accuracy</h2>
                  <p>You are responsible for the accuracy of all data entered into ShiftSavvy. Tax estimates provided are for planning purposes only and should not be considered professional tax advice. Consult with a qualified tax professional for tax filing guidance.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">4. Service Modifications</h2>
                  <p>ShiftSavvy reserves the right to modify or discontinue the service at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">5. Contact</h2>
                  <p>Questions about the Terms of Service should be sent to <a href="mailto:contact@shiftsavvy.app" className="text-primary hover:underline">contact@shiftsavvy.app</a></p>
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

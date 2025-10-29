import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Scale } from "lucide-react";
import { Link } from "wouter";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

export default function TermsOfService() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="container max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={isAuthenticated ? "/" : "/"}>
              <Button variant="ghost" size="icon" className="hover-elevate active-elevate-2" data-testid="button-back" aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-heading font-bold">Terms of Service</h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              
              <div className="space-y-6 text-muted-foreground">
                <section>
                  <p className="text-sm font-medium text-foreground">Effective Date: October 29, 2025</p>
                  <p className="mt-2">Welcome to ShiftSavvy! These Terms of Service ("Terms") govern your access to and use of the ShiftSavvy web application ("Service"), owned and operated by ShiftSavvy LLC, a company based in Louisville, Kentucky, USA.</p>
                  <p className="mt-2">By accessing or using ShiftSavvy, you agree to be bound by these Terms. If you do not agree, do not use the Service.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">1. Eligibility</h2>
                  <p>To use ShiftSavvy, you must:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Be at least 16 years old</li>
                    <li>Be legally permitted to work in a restaurant, bar, or adult establishment that serves alcohol</li>
                  </ul>
                  <p className="mt-2">By using the Service, you confirm that you meet these eligibility requirements.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">2. Service Overview</h2>
                  <p>ShiftSavvy is a web-based tool designed to help service industry professionals:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Track tips and earnings</li>
                    <li>Log and manage work shifts</li>
                    <li>Estimate taxes and retirement withholdings</li>
                  </ul>
                  <p className="mt-2 font-medium">Important: All financial figures provided by ShiftSavvy are estimates for planning purposes only. ShiftSavvy does not provide financial, tax, or legal advice. You should consult a licensed tax or financial advisor before making any financial decisions.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">3. Account Registration and Deletion</h2>
                  <p>You may create an account by providing your:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>First name</li>
                    <li>Last name</li>
                    <li>Email address</li>
                    <li>Zip code</li>
                  </ul>
                  <p className="mt-2">You are responsible for keeping your login information secure.</p>
                  <p className="mt-2">You may delete your account at any time. Deletion is permanent and will remove your data from our active systems.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">4. Privacy</h2>
                  <p>Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.</p>
                  <p className="mt-2">We collect limited personal data (name, email, zip code) solely for the purpose of operating the Service.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">5. Acceptable Use</h2>
                  <p>You agree not to:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Use ShiftSavvy for any illegal or unauthorized purpose</li>
                    <li>Attempt to access accounts or data that do not belong to you</li>
                    <li>Distribute, copy, or reverse-engineer any part of the Service without written permission</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">6. Disclaimer of Warranties</h2>
                  <p>The Service is provided "as is" and "as available". ShiftSavvy LLC makes no warranties regarding:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>The accuracy or completeness of estimated financial data</li>
                    <li>Availability or uninterrupted use of the Service</li>
                  </ul>
                  <p className="mt-2">You agree to use all data and tools at your own risk and solely for planning purposes.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">7. Limitation of Liability</h2>
                  <p>To the fullest extent permitted by law, ShiftSavvy LLC will not be liable for any:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Indirect or consequential damages</li>
                    <li>Loss of income, tips, or financial data</li>
                    <li>Decisions made based on estimated figures provided by the Service</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">8. Changes to the Service or Terms</h2>
                  <p>ShiftSavvy LLC may update or discontinue parts of the Service at any time, with or without notice.</p>
                  <p className="mt-2">We may also update these Terms. When we do, we'll update the effective date at the top of this page. Continued use of the Service means you accept the new Terms.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">9. Governing Law</h2>
                  <p>These Terms are governed by the laws of the Commonwealth of Kentucky and the United States of America, without regard to conflict of law principles.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">10. Contact Us</h2>
                  <p>For questions about these Terms, contact:</p>
                  <p className="mt-2">
                    ShiftSavvy LLC<br />
                    Louisville, KY, USA<br />
                    Email: <a href="mailto:contact@goshiftsavvy.com" className="text-primary hover:underline">contact@goshiftsavvy.com</a>
                  </p>
                </section>

                <section className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Summary</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>You must be 16+ and legally eligible to work in your industry</li>
                    <li>ShiftSavvy provides estimates only — no tax or financial advice</li>
                    <li>You can create and delete your account freely</li>
                    <li>Your data is protected under our Privacy Policy</li>
                    <li>Use is at your own risk, and we are not liable for financial outcomes</li>
                  </ul>
                </section>

                <section className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Disclaimer</h3>
                  <p className="text-sm">This is a general-purpose template and not a substitute for legal advice. You should have a qualified attorney review and adapt this Terms of Service to ensure full legal compliance — especially before launching a paid version or collecting more personal data.</p>
                </section>
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

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

export default function PrivacyPolicy() {
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
              <ShieldCheck className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-heading font-bold">Privacy Policy</h1>
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
                  <p className="text-sm font-medium text-foreground">Last Updated: October 29, 2025</p>
                  <p className="mt-2">ShiftSavvy LLC ("we", "our", or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you use our web-based app (the "Service").</p>
                  <p className="mt-2">By using ShiftSavvy, you agree to the terms of this Privacy Policy.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">1. What Information We Collect</h2>
                  <p>We collect only the information necessary to operate and improve our Service:</p>
                  <p className="mt-2 font-medium">Information You Provide:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>First Name and Last Name</li>
                    <li>Email Address</li>
                    <li>Zip Code</li>
                  </ul>
                  <p className="mt-2">We do not collect sensitive personal information such as Social Security numbers, financial account details, or government-issued IDs.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
                  <p>We use your personal information to:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Create and manage your account</li>
                    <li>Provide personalized features (e.g. shift tracking, earnings summaries)</li>
                    <li>Improve our tools and user experience</li>
                    <li>Communicate essential updates or changes to the Service</li>
                  </ul>
                  <p className="mt-2">We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Store and Protect Your Information</h2>
                  <p>We take reasonable measures to protect your information, including:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Secure transmission (SSL encryption)</li>
                    <li>Access control to internal systems</li>
                    <li>Data backups and storage best practices</li>
                  </ul>
                  <p className="mt-2">However, no system is completely secure. By using our Service, you understand that your information is provided at your own risk.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Retention and Account Deletion</h2>
                  <p>You may delete your account at any time. Once deleted:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Your personal data is permanently removed from our active systems</li>
                    <li>We may retain anonymized or aggregated usage data for analytics purposes</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">5. Children's Privacy</h2>
                  <p>ShiftSavvy is not intended for children under the age of 16. We do not knowingly collect personal data from anyone under this age. If we become aware that we've inadvertently collected data from a minor, we will delete it immediately.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">6. Cookies and Tracking</h2>
                  <p>We may use cookies or similar technologies to:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>Maintain your session while using the app</li>
                    <li>Collect anonymous usage data to improve performance</li>
                  </ul>
                  <p className="mt-2">You can disable cookies in your browser settings, but some features of the Service may not work properly as a result.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">7. Third-Party Services</h2>
                  <p>Currently, ShiftSavvy does not integrate with any third-party services or platforms. If this changes, we will update this Privacy Policy to reflect what is shared and why.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">8. Your Rights and Choices</h2>
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>View or correct your personal information</li>
                    <li>Delete your account and associated data</li>
                    <li>Opt out of non-essential communications</li>
                  </ul>
                  <p className="mt-2">To exercise any of these rights, contact us at the email below.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">9. Changes to This Policy</h2>
                  <p>We may update this Privacy Policy from time to time. If we make changes, we'll update the "Effective Date" at the top of this page and notify users where appropriate.</p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">10. Contact Us</h2>
                  <p>For questions or concerns about this Privacy Policy:</p>
                  <p className="mt-2">
                    ShiftSavvy LLC<br />
                    Louisville, KY, USA<br />
                    Email: <a href="mailto:contact@goshiftsavvy.com" className="text-primary hover:underline">contact@goshiftsavvy.com</a>
                  </p>
                </section>

                <section className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Summary</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>We collect minimal personal data (name, email, zip)</li>
                    <li>Your data is used only to provide the service — not sold or shared</li>
                    <li>You can delete your data anytime</li>
                    <li>We do not provide tax or financial advice</li>
                    <li>No third-party integrations (yet)</li>
                  </ul>
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

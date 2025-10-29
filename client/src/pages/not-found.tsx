import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { Link } from "wouter";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h1 className="text-2xl font-heading font-bold mb-2">404 - Page Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The page you're looking for doesn't exist.
            </p>
            <Link href="/">
              <Button data-testid="button-home" className="hover-elevate active-elevate-2">
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
      
      <BottomNav />
      <Footer isAuthenticated={true} />
    </div>
  );
}

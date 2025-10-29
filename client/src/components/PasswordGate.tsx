import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import logoUrl from "@assets/ShiftSavvy - FINAL_1761769622129.png";

interface PasswordGateProps {
  children: React.ReactNode;
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if already authenticated in this session
    const siteAuth = sessionStorage.getItem("site_authenticated");
    if (siteAuth === "true") {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/verify-site-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        sessionStorage.setItem("site_authenticated", "true");
        setIsAuthenticated(true);
      } else if (response.status === 401) {
        setError("Incorrect password. Please try again.");
        setPassword("");
      } else {
        setError("Server error. Please try again later.");
      }
    } catch (err) {
      setError("Connection error. Please check your internet and try again.");
    }
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md p-8">
          <div className="flex flex-col items-center mb-8">
            <img 
              src={logoUrl} 
              alt="ShiftSavvy" 
              className="h-10 mb-4"
            />
            <h1 className="text-2xl font-heading font-bold text-center mb-2">
              Site Access Required
            </h1>
            <p className="text-sm text-muted-foreground text-center">
              This site is currently in private testing. Please enter the access password to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-password">Access Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="site-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="pl-10"
                  data-testid="input-site-password"
                  autoFocus
                />
              </div>
              {error && (
                <p className="text-sm text-destructive" data-testid="text-password-error">
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              data-testid="button-submit-password"
            >
              Access Site
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Don't have access? Contact the site administrator.
          </p>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

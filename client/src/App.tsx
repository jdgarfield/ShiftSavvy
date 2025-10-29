import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import "./lib/i18n";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import ShiftForm from "@/pages/shift-form";
import Reports from "@/pages/reports";
import Profile from "@/pages/profile";
import Calendar from "@/pages/calendar";
import NotFound from "@/pages/not-found";
import TermsOfService from "@/pages/legal-terms";
import PrivacyPolicy from "@/pages/legal-privacy";
import Security from "@/pages/legal-security";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/legal/terms" component={TermsOfService} />
          <Route path="/legal/privacy" component={PrivacyPolicy} />
          <Route path="/legal/security" component={Security} />
          <Route path="/:rest*">
            {() => {
              window.location.href = '/api/login';
              return null;
            }}
          </Route>
        </>
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/shift/new" component={ShiftForm} />
          <Route path="/shift/:id">
            {(params) => {
              if (params.id === 'new') return null;
              return <ShiftForm />;
            }}
          </Route>
          <Route path="/reports" component={Reports} />
          <Route path="/profile" component={Profile} />
          <Route path="/calendar" component={Calendar} />
          <Route path="/legal/terms" component={TermsOfService} />
          <Route path="/legal/privacy" component={PrivacyPolicy} />
          <Route path="/legal/security" component={Security} />
          <Route path="/:rest*" component={NotFound} />
        </>
      )}
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

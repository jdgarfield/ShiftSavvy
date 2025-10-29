import { Home, PlusCircle, FileText, Briefcase, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";

export function BottomNav() {
  const [location] = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { path: "/", icon: Home, label: t('nav.dashboard'), testId: "nav-dashboard" },
    { path: "/shift/new", icon: PlusCircle, label: t('nav.addShift'), testId: "nav-add-shift" },
    { path: "/reports", icon: FileText, label: t('nav.reports'), testId: "nav-reports" },
    { path: "/jobs", icon: Briefcase, label: t('nav.jobs'), testId: "nav-jobs" },
    { path: "/profile", icon: User, label: t('nav.profile'), testId: "nav-profile" },
  ];

  return (
    <nav className="w-full bg-card border-t border-card-border">
      <div className="flex items-center justify-around h-16 max-w-screen-md mx-auto">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path}>
              <a
                data-testid={item.testId}
                className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon 
                  className={`h-6 w-6 transition-transform ${isActive ? "-translate-y-0.5" : ""}`} 
                />
                <span className="text-xs font-medium">{item.label}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

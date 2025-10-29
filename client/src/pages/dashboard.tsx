import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BottomNav } from "@/components/BottomNav";
import { StatCard } from "@/components/StatCard";
import { ShiftCard } from "@/components/ShiftCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Calendar, Plus } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { Shift, Job } from "@shared/schema";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: shifts = [], isLoading: shiftsLoading } = useQuery<Shift[]>({
    queryKey: ["/api/shifts"],
    enabled: isAuthenticated,
  });

  const { data: jobs = [] } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
    enabled: isAuthenticated,
  });

  if (isLoading || shiftsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const today = new Date().toISOString().split('T')[0];
  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
  const thisMonthStart = new Date();
  thisMonthStart.setDate(1);

  const calculateEarnings = (shift: Shift) => {
    const totalTips = parseFloat(shift.cashTips || '0') + parseFloat(shift.creditTips || '0');
    const tipOutAmount = totalTips * (parseFloat(shift.tipOut || '0') / 100);
    return (
      parseFloat(shift.hourlyWage) * parseFloat(shift.hoursWorked) +
      totalTips -
      tipOutAmount
    );
  };

  const todayShifts = shifts.filter(s => s.date === today);
  const weekShifts = shifts.filter(s => new Date(s.date) >= thisWeekStart);
  const monthShifts = shifts.filter(s => new Date(s.date) >= thisMonthStart);

  const todayEarnings = todayShifts.reduce((sum, s) => sum + calculateEarnings(s), 0);
  const weekEarnings = weekShifts.reduce((sum, s) => sum + calculateEarnings(s), 0);
  const monthEarnings = monthShifts.reduce((sum, s) => sum + calculateEarnings(s), 0);
  const avgPerShift = shifts.length > 0 ? shifts.reduce((sum, s) => sum + calculateEarnings(s), 0) / shifts.length : 0;

  const recentShifts = [...shifts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="container max-w-screen-md mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-primary">ShiftSavvy</h1>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.welcome')}{user && `, ${user.firstName || user.email}`}
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container max-w-screen-md mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title={t('dashboard.stats.todayEarnings')}
            value={`$${todayEarnings.toFixed(2)}`}
            icon={DollarSign}
            testId="stat-today"
          />
          <StatCard
            title={t('dashboard.stats.weekEarnings')}
            value={`$${weekEarnings.toFixed(2)}`}
            icon={Calendar}
            testId="stat-week"
          />
          <StatCard
            title={t('dashboard.stats.monthEarnings')}
            value={`$${monthEarnings.toFixed(2)}`}
            icon={TrendingUp}
            testId="stat-month"
          />
          <StatCard
            title={t('dashboard.stats.avgPerShift')}
            value={`$${avgPerShift.toFixed(2)}`}
            icon={DollarSign}
            testId="stat-avg"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold">
              {t('dashboard.recentShifts')}
            </h2>
            <Link href="/shift/new">
              <Button
                size="sm"
                data-testid="button-add-shift-header"
                className="hover-elevate active-elevate-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Shift
              </Button>
            </Link>
          </div>

          {recentShifts.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-heading font-semibold mb-2">
                {t('dashboard.noShifts')}
              </h3>
              <p className="text-muted-foreground mb-6">
                {t('dashboard.addFirstShift')}
              </p>
              <Link href="/shift/new">
                <Button data-testid="button-add-first-shift">
                  <Plus className="h-4 w-4 mr-2" />
                  Log Your First Shift
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {recentShifts.map((shift) => {
                const job = jobs.find(j => j.id === shift.jobId);
                return (
                  <ShiftCard
                    key={shift.id}
                    shift={shift}
                    job={job}
                    onClick={() => setLocation(`/shift/${shift.id}`)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

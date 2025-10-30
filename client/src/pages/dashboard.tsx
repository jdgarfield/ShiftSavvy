import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { StatCard } from "@/components/StatCard";
import { ShiftCard } from "@/components/ShiftCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Calendar, Plus } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { Shift } from "@shared/schema";
import { parseLocalDate, formatLocalDate } from "@/lib/dateUtils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import logoUrl from "@assets/ShiftSavvy - FINAL_1761769622129.png";

type PeriodFilter = 'TODAY' | 'WEEK' | 'MONTH' | 'AVG' | null;

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>(null);

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
  const now = new Date();
  const today = formatLocalDate(now);
  
  const thisWeekStart = new Date(now);
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
  thisWeekStart.setHours(0, 0, 0, 0);
  
  const thisWeekEnd = new Date(thisWeekStart);
  thisWeekEnd.setDate(thisWeekEnd.getDate() + 6);
  thisWeekEnd.setHours(23, 59, 59, 999);
  
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

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
  const weekShifts = shifts.filter(s => {
    const shiftDate = parseLocalDate(s.date);
    return shiftDate >= thisWeekStart && shiftDate <= thisWeekEnd;
  });
  const monthShifts = shifts.filter(s => {
    const shiftDate = parseLocalDate(s.date);
    return shiftDate >= thisMonthStart && shiftDate <= thisMonthEnd;
  });

  const todayEarnings = todayShifts.reduce((sum, s) => sum + calculateEarnings(s), 0);
  const weekEarnings = weekShifts.reduce((sum, s) => sum + calculateEarnings(s), 0);
  const monthEarnings = monthShifts.reduce((sum, s) => sum + calculateEarnings(s), 0);
  const avgPerShift = shifts.length > 0 ? shifts.reduce((sum, s) => sum + calculateEarnings(s), 0) / shifts.length : 0;

  // Filter shifts based on selected period
  const getDisplayedShifts = () => {
    let filtered: Shift[];
    
    if (selectedPeriod === 'TODAY') {
      filtered = todayShifts;
    } else if (selectedPeriod === 'WEEK') {
      filtered = weekShifts;
    } else if (selectedPeriod === 'MONTH') {
      filtered = monthShifts;
    } else if (selectedPeriod === 'AVG') {
      // Don't show shift list when viewing the rolling average graph
      return [];
    } else {
      // Default: show recent 5 shifts - sort first, then slice
      filtered = [...shifts].sort((a, b) => parseLocalDate(b.date).getTime() - parseLocalDate(a.date).getTime()).slice(0, 5);
      return filtered;
    }
    
    return [...filtered].sort((a, b) => parseLocalDate(b.date).getTime() - parseLocalDate(a.date).getTime());
  };

  const displayedShifts = getDisplayedShifts();

  const getPeriodTitle = () => {
    if (selectedPeriod === 'TODAY') return "Today's Shifts";
    if (selectedPeriod === 'WEEK') return "This Week's Shifts";
    if (selectedPeriod === 'MONTH') return "This Month's Shifts";
    return t('dashboard.recentShifts');
  };

  const handleTodayClick = () => {
    setSelectedPeriod(selectedPeriod === 'TODAY' ? null : 'TODAY');
  };

  const handleWeekClick = () => {
    setSelectedPeriod(selectedPeriod === 'WEEK' ? null : 'WEEK');
  };

  const handleAvgClick = () => {
    setSelectedPeriod(selectedPeriod === 'AVG' ? null : 'AVG');
  };

  const handleMonthClick = () => {
    setSelectedPeriod(selectedPeriod === 'MONTH' ? null : 'MONTH');
  };

  // Calculate 14-day rolling averages
  const calculate14DayRollingAverage = () => {
    if (shifts.length === 0) return [];
    
    // Get all shifts sorted by date
    const sortedShifts = [...shifts].sort((a, b) => 
      parseLocalDate(a.date).getTime() - parseLocalDate(b.date).getTime()
    );
    
    const result = [];
    const today = new Date();
    
    // Go back 30 days to have enough data to show
    for (let i = 29; i >= 0; i--) {
      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() - i);
      
      // Get shifts from the last 14 days relative to target date
      const startDate = new Date(targetDate);
      startDate.setDate(startDate.getDate() - 13);
      
      const relevantShifts = sortedShifts.filter(s => {
        const shiftDate = parseLocalDate(s.date);
        return shiftDate >= startDate && shiftDate <= targetDate;
      });
      
      const avgEarnings = relevantShifts.length > 0
        ? relevantShifts.reduce((sum, s) => sum + calculateEarnings(s), 0) / relevantShifts.length
        : 0;
      
      result.push({
        date: format(targetDate, 'MMM d'),
        fullDate: formatLocalDate(targetDate),
        average: parseFloat(avgEarnings.toFixed(2)),
        shiftCount: relevantShifts.length,
      });
    }
    
    return result;
  };

  const rollingAverageData = calculate14DayRollingAverage();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="container max-w-screen-md mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <img 
              src={logoUrl} 
              alt="ShiftSavvy" 
              className="h-8"
              data-testid="logo-header"
            />
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
            onClick={handleTodayClick}
            isActive={selectedPeriod === 'TODAY'}
          />
          <StatCard
            title={t('dashboard.stats.weekEarnings')}
            value={`$${weekEarnings.toFixed(2)}`}
            icon={Calendar}
            testId="stat-week"
            onClick={handleWeekClick}
            isActive={selectedPeriod === 'WEEK'}
          />
          <StatCard
            title={t('dashboard.stats.monthEarnings')}
            value={`$${monthEarnings.toFixed(2)}`}
            icon={TrendingUp}
            testId="stat-month"
            onClick={handleMonthClick}
            isActive={selectedPeriod === 'MONTH'}
          />
          <StatCard
            title={t('dashboard.stats.avgPerShift')}
            value={`$${avgPerShift.toFixed(2)}`}
            icon={DollarSign}
            testId="stat-avg"
            onClick={handleAvgClick}
            isActive={selectedPeriod === 'AVG'}
          />
        </div>

        {selectedPeriod === 'AVG' && rollingAverageData.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-heading font-semibold mb-4">14-Day Rolling Average</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Each point shows the average earnings per shift over the previous 14 days
            </p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={rollingAverageData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tick={{ fontSize: 11 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'average') return [`$${value.toFixed(2)}`, '14-Day Avg'];
                    return [value, name];
                  }}
                  labelFormatter={(label) => {
                    const data = rollingAverageData.find(d => d.date === label);
                    return data ? `${label} (${data.shiftCount} shifts)` : label;
                  }}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="average" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {selectedPeriod === 'MONTH' && (
          <Card className="p-6">
            <h2 className="text-lg font-heading font-semibold mb-4">This Month's Summary</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-muted rounded-lg p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Earnings</p>
                <p className="text-2xl font-heading font-bold tabular-nums">${monthEarnings.toFixed(2)}</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Shifts</p>
                <p className="text-2xl font-heading font-bold tabular-nums">{monthShifts.length}</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Avg per Shift</p>
                <p className="text-2xl font-heading font-bold tabular-nums">
                  ${monthShifts.length > 0 ? (monthEarnings / monthShifts.length).toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Hours</p>
                <p className="text-2xl font-heading font-bold tabular-nums">
                  {monthShifts.reduce((sum, s) => sum + parseFloat(s.hoursWorked), 0).toFixed(1)}
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <Link href="/calendar">
                <Button variant="outline" size="sm" className="hover-elevate active-elevate-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Full Calendar
                </Button>
              </Link>
            </div>
          </Card>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-semibold">
              {getPeriodTitle()}
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

          {displayedShifts.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-heading font-semibold mb-2">
                {selectedPeriod ? `No shifts for ${selectedPeriod === 'TODAY' ? 'today' : 'this week'}` : t('dashboard.noShifts')}
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
              {displayedShifts.map((shift: Shift) => (
                <ShiftCard
                  key={shift.id}
                  shift={shift}
                  onClick={() => setLocation(`/shift/${shift.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
      <Footer isAuthenticated={true} />
    </div>
  );
}

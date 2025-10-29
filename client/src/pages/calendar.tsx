import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { Shift } from "@shared/schema";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, startOfWeek, endOfWeek } from "date-fns";
import { parseLocalDate } from "@/lib/dateUtils";

export default function Calendar() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

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

  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const calculateEarnings = (shift: Shift) => {
    const totalTips = parseFloat(shift.cashTips || '0') + parseFloat(shift.creditTips || '0');
    const tipOutAmount = totalTips * (parseFloat(shift.tipOut || '0') / 100);
    return (
      parseFloat(shift.hourlyWage) * parseFloat(shift.hoursWorked) +
      totalTips -
      tipOutAmount
    );
  };

  const getDayShifts = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return shifts.filter(s => s.date === dayStr);
  };

  const getDayEarnings = (day: Date) => {
    const dayShifts = getDayShifts(day);
    return dayShifts.reduce((sum, s) => sum + calculateEarnings(s), 0);
  };

  const isToday = (day: Date) => isSameDay(day, today);
  const isCurrentMonth = (day: Date) => day.getMonth() === today.getMonth();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="container max-w-screen-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button 
                variant="ghost" 
                size="icon"
                data-testid="button-back"
                className="hover-elevate active-elevate-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-heading font-bold text-primary">Calendar</h1>
              <p className="text-xs text-muted-foreground">
                {format(today, 'MMMM yyyy')}
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container max-w-screen-md mx-auto px-4 py-6 space-y-6">
        <Card className="p-4">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div 
                key={day} 
                className="text-center text-xs font-semibold text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              const dayShifts = getDayShifts(day);
              const dayEarnings = getDayEarnings(day);
              const hasShifts = dayShifts.length > 0;
              const todayClass = isToday(day);
              const currentMonthClass = isCurrentMonth(day);

              return (
                <div
                  key={idx}
                  data-testid={`calendar-day-${format(day, 'yyyy-MM-dd')}`}
                  className={`
                    min-h-[80px] p-2 rounded-md border
                    ${!currentMonthClass ? 'opacity-40' : ''}
                    ${todayClass ? 'border-primary bg-primary/5' : 'border-border'}
                    ${hasShifts ? 'hover-elevate cursor-pointer' : ''}
                  `}
                >
                  <div className="flex flex-col h-full">
                    <div className={`
                      text-sm font-semibold mb-1
                      ${todayClass ? 'text-primary' : currentMonthClass ? 'text-foreground' : 'text-muted-foreground'}
                    `}>
                      {format(day, 'd')}
                    </div>
                    {hasShifts && (
                      <div className="mt-auto">
                        <div 
                          className="text-xs font-semibold text-chart-2 tabular-nums"
                          data-testid={`day-earnings-${format(day, 'yyyy-MM-dd')}`}
                        >
                          ${dayEarnings.toFixed(0)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {dayShifts.length} shift{dayShifts.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Month summary */}
        <Card className="p-6">
          <h3 className="text-lg font-heading font-semibold mb-4">
            {format(today, 'MMMM')} Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
              <p className="text-2xl font-heading font-bold tabular-nums" data-testid="month-total-earnings">
                ${shifts
                  .filter(s => {
                    const shiftDate = parseLocalDate(s.date);
                    return shiftDate >= monthStart && shiftDate <= monthEnd;
                  })
                  .reduce((sum, s) => sum + calculateEarnings(s), 0)
                  .toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Shifts</p>
              <p className="text-2xl font-heading font-bold tabular-nums" data-testid="month-total-shifts">
                {shifts.filter(s => {
                  const shiftDate = parseLocalDate(s.date);
                  return shiftDate >= monthStart && shiftDate <= monthEnd;
                }).length}
              </p>
            </div>
          </div>
        </Card>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, FileSpreadsheet, DollarSign, Clock, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, startOfWeek, startOfMonth, startOfYear, endOfWeek, endOfMonth, endOfYear } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Shift } from "@shared/schema";

type Period = 'week' | 'month' | 'year';

export default function Reports() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [period, setPeriod] = useState<Period>('month');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: shifts = [], isLoading: shiftsLoading } = useQuery<Shift[]>({
    queryKey: ["/api/shifts"],
    enabled: isAuthenticated,
  });

  if (authLoading || shiftsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const calculateEarnings = (shift: Shift) => {
    return (
      parseFloat(shift.hourlyWage) * parseFloat(shift.hoursWorked) +
      parseFloat(shift.cashTips || '0') +
      parseFloat(shift.creditTips || '0') -
      parseFloat(shift.tipOut || '0')
    );
  };

  const calculateWageEarnings = (shift: Shift) => {
    return parseFloat(shift.hourlyWage) * parseFloat(shift.hoursWorked);
  };

  const calculateTipEarnings = (shift: Shift) => {
    return (
      parseFloat(shift.cashTips || '0') +
      parseFloat(shift.creditTips || '0') -
      parseFloat(shift.tipOut || '0')
    );
  };

  const now = new Date();
  let startDate: Date, endDate: Date;

  if (period === 'week') {
    startDate = startOfWeek(now);
    endDate = endOfWeek(now);
  } else if (period === 'month') {
    startDate = startOfMonth(now);
    endDate = endOfMonth(now);
  } else {
    startDate = startOfYear(now);
    endDate = endOfYear(now);
  }

  const filteredShifts = shifts.filter(s => {
    const shiftDate = new Date(s.date);
    return shiftDate >= startDate && shiftDate <= endDate;
  });

  const totalEarnings = filteredShifts.reduce((sum, s) => sum + calculateEarnings(s), 0);
  const wageEarnings = filteredShifts.reduce((sum, s) => sum + calculateWageEarnings(s), 0);
  const tipEarnings = filteredShifts.reduce((sum, s) => sum + calculateTipEarnings(s), 0);
  const cashTips = filteredShifts.reduce((sum, s) => sum + parseFloat(s.cashTips || '0'), 0);
  const creditTips = filteredShifts.reduce((sum, s) => sum + parseFloat(s.creditTips || '0'), 0);
  const totalHours = filteredShifts.reduce((sum, s) => sum + parseFloat(s.hoursWorked), 0);
  const avgPerHour = totalHours > 0 ? totalEarnings / totalHours : 0;

  const federalTaxRate = 0.22;
  const stateTaxRate = 0.05;
  const localTaxRate = 0.02;

  const federalTax = totalEarnings * federalTaxRate;
  const stateTax = totalEarnings * stateTaxRate;
  const localTax = totalEarnings * localTaxRate;
  const totalTax = federalTax + stateTax + localTax;
  const takeHome = totalEarnings - totalTax;

  const chartData = filteredShifts
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-10)
    .map(shift => ({
      date: format(new Date(shift.date), 'MMM d'),
      earnings: calculateEarnings(shift),
    }));

  const handleExportCSV = () => {
    const headers = ['Date', 'Hours', 'Wage', 'Cash Tips', 'Credit Tips', 'Tip Out', 'Total'];
    const rows = filteredShifts.map(s => [
      s.date,
      s.hoursWorked,
      s.hourlyWage,
      s.cashTips || '0',
      s.creditTips || '0',
      s.tipOut || '0',
      calculateEarnings(s).toFixed(2),
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shiftsavvy-${period}-report.csv`;
    a.click();

    toast({
      title: t('common.success'),
      description: "CSV exported successfully",
    });
  };

  const handleExportPDF = () => {
    if (filteredShifts.length === 0) {
      toast({
        title: "No Data",
        description: "No shifts found for the selected period",
        variant: "destructive",
      });
      return;
    }

    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.text('ShiftSavvy Earnings Report', 14, 20);
      
      // Period info
      doc.setFontSize(12);
      doc.text(`Period: ${period.charAt(0).toUpperCase() + period.slice(1)}`, 14, 30);
      doc.text(`Generated: ${format(new Date(), 'MMM d, yyyy')}`, 14, 37);
      
      // Summary section
      doc.setFontSize(14);
      doc.text('Summary', 14, 50);
      doc.setFontSize(10);
      doc.text(`Total Earnings: $${totalEarnings.toFixed(2)}`, 14, 58);
      doc.text(`Total Shifts: ${filteredShifts.length}`, 14, 64);
      doc.text(`Wage Earnings: $${wageEarnings.toFixed(2)}`, 14, 70);
      doc.text(`Tip Earnings: $${tipEarnings.toFixed(2)}`, 14, 76);
      doc.text(`Total Hours: ${totalHours.toFixed(2)}`, 14, 82);
      doc.text(`Avg Per Hour: $${avgPerHour.toFixed(2)}`, 14, 88);
      
      // Tax estimates section
      doc.setFontSize(14);
      doc.text('Tax Estimates', 14, 100);
      doc.setFontSize(10);
      doc.text(`Federal Tax (22%): $${federalTax.toFixed(2)}`, 14, 108);
      doc.text(`State Tax (5%): $${stateTax.toFixed(2)}`, 14, 114);
      doc.text(`Local Tax (2%): $${localTax.toFixed(2)}`, 14, 120);
      doc.text(`Total Tax: $${totalTax.toFixed(2)}`, 14, 126);
      doc.text(`Take Home: $${takeHome.toFixed(2)}`, 14, 132);
      
      // Shifts table
      const tableData = filteredShifts.map(s => [
        format(new Date(s.date), 'MMM d, yyyy'),
        s.hoursWorked,
        `$${s.hourlyWage}`,
        `$${s.cashTips || '0'}`,
        `$${s.creditTips || '0'}`,
        `$${s.tipOut || '0'}`,
        `$${calculateEarnings(s).toFixed(2)}`,
      ]);
      
      autoTable(doc, {
        startY: 145,
        head: [['Date', 'Hours', 'Wage', 'Cash Tips', 'Credit Tips', 'Tip Out', 'Total']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 8 },
      });
      
      // Save PDF
      doc.save(`shiftsavvy-${period}-report.pdf`);
      
      toast({
        title: t('common.success'),
        description: "PDF exported successfully",
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="container max-w-screen-md mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-heading font-semibold">{t('reports.title')}</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="container max-w-screen-md mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={(value: Period) => setPeriod(value)}>
            <SelectTrigger data-testid="select-period" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">{t('reports.thisWeek')}</SelectItem>
              <SelectItem value="month">{t('reports.thisMonth')}</SelectItem>
              <SelectItem value="year">{t('reports.thisYear')}</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex-1"></div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            data-testid="button-export-csv"
            className="hover-elevate active-elevate-2"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPDF}
            data-testid="button-export-pdf"
            className="hover-elevate active-elevate-2"
          >
            <FileDown className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-heading font-semibold mb-4">{t('reports.summary.title')}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t('reports.summary.totalEarnings')}</p>
              <p className="text-2xl font-heading font-bold tabular-nums text-chart-2" data-testid="total-earnings">
                ${totalEarnings.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('reports.summary.totalShifts')}</p>
              <p className="text-2xl font-heading font-bold tabular-nums">
                {filteredShifts.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('reports.summary.wageEarnings')}</p>
              <p className="text-xl font-heading font-semibold tabular-nums">
                ${wageEarnings.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('reports.summary.tipEarnings')}</p>
              <p className="text-xl font-heading font-semibold tabular-nums">
                ${tipEarnings.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('reports.summary.totalHours')}</p>
              <p className="text-xl font-heading font-semibold tabular-nums">
                {totalHours.toFixed(1)}h
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('reports.summary.avgPerHour')}</p>
              <p className="text-xl font-heading font-semibold tabular-nums">
                ${avgPerHour.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-heading font-semibold mb-4">{t('reports.tax.title')}</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t('reports.tax.federal')} (22%)</span>
              <span className="font-semibold tabular-nums">${federalTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t('reports.tax.state')} (5%)</span>
              <span className="font-semibold tabular-nums">${stateTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t('reports.tax.local')} (2%)</span>
              <span className="font-semibold tabular-nums">${localTax.toFixed(2)}</span>
            </div>
            <div className="pt-3 border-t border-border flex justify-between items-center">
              <span className="font-heading font-semibold">{t('reports.tax.total')}</span>
              <span className="font-heading font-bold tabular-nums text-destructive">
                ${totalTax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-heading font-semibold">{t('reports.tax.takeHome')}</span>
              <span className="font-heading font-bold text-2xl tabular-nums text-chart-2">
                ${takeHome.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        {chartData.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-heading font-semibold mb-4">Earnings Trend</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                />
                <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

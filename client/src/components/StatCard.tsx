import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  testId?: string;
}

export function StatCard({ title, value, icon: Icon, trend, testId }: StatCardProps) {
  return (
    <Card className="p-6 hover-elevate" data-testid={testId}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            {title}
          </p>
          <p className="text-2xl font-heading font-bold tabular-nums" data-testid={`${testId}-value`}>
            {value}
          </p>
          {trend && (
            <p
              className={`text-sm mt-2 ${
                trend.positive ? "text-chart-2" : "text-destructive"
              }`}
              data-testid={`${testId}-trend`}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className="rounded-xl bg-primary/10 p-3">
          <Icon className="h-8 w-8 text-primary" />
        </div>
      </div>
    </Card>
  );
}

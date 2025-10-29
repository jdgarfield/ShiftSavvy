import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign, Users } from "lucide-react";
import { format } from "date-fns";
import type { Shift, Job } from "@shared/schema";

interface ShiftCardProps {
  shift: Shift;
  job?: Job;
  onClick?: () => void;
}

export function ShiftCard({ shift, job, onClick }: ShiftCardProps) {
  const totalEarnings = 
    parseFloat(shift.hourlyWage) * parseFloat(shift.hoursWorked) +
    parseFloat(shift.cashTips || '0') +
    parseFloat(shift.creditTips || '0') -
    parseFloat(shift.tipOut || '0');

  return (
    <Card
      className="p-5 hover-elevate active-elevate-2 cursor-pointer"
      onClick={onClick}
      data-testid={`shift-card-${shift.id}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-heading font-semibold text-lg" data-testid="shift-date">
            {format(new Date(shift.date), "EEE, MMM d")}
          </h3>
          {job && (
            <Badge
              style={{ backgroundColor: job.color + '20', color: job.color, borderColor: job.color }}
              className="mt-1"
              data-testid="shift-job-badge"
            >
              {job.name}
            </Badge>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-heading font-bold tabular-nums text-chart-2" data-testid="shift-total">
            ${totalEarnings.toFixed(2)}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span className="tabular-nums">{shift.hoursWorked}h</span>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign className="h-4 w-4" />
          <span className="tabular-nums">${shift.hourlyWage}/hr</span>
        </div>
        {shift.coversServed && shift.coversServed > 0 && (
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="tabular-nums">{shift.coversServed}</span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-sm">
        <div>
          <span className="text-muted-foreground">Tips: </span>
          <span className="font-semibold tabular-nums">
            ${(parseFloat(shift.cashTips || '0') + parseFloat(shift.creditTips || '0')).toFixed(2)}
          </span>
        </div>
        {parseFloat(shift.tipOut || '0') > 0 && (
          <div>
            <span className="text-muted-foreground">Tip Out: </span>
            <span className="font-semibold tabular-nums text-destructive">
              -${parseFloat(shift.tipOut).toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}

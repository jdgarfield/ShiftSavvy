import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Edit, Plus } from "lucide-react";
import { Link } from "wouter";
import type { Job } from "@shared/schema";

interface JobCardProps {
  job: Job;
  onEdit?: () => void;
  shiftsCount?: number;
}

export function JobCard({ job, onEdit, shiftsCount = 0 }: JobCardProps) {
  return (
    <Card className="p-4 hover-elevate" data-testid={`job-card-${job.id}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div
            className="rounded-xl p-3"
            style={{ backgroundColor: job.color + '20' }}
          >
            <Briefcase className="h-6 w-6" style={{ color: job.color }} />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-base" data-testid="job-name">
              {job.name}
            </h3>
            {job.description && (
              <p className="text-sm text-muted-foreground mt-0.5" data-testid="job-description">
                {job.description}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {shiftsCount} {shiftsCount === 1 ? 'shift' : 'shifts'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              data-testid={`button-edit-job-${job.id}`}
              className="hover-elevate active-elevate-2"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          <Link href="/shift/new">
            <Button
              size="icon"
              variant="default"
              data-testid={`button-add-shift-${job.id}`}
              className="hover-elevate active-elevate-2"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

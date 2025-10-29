import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Briefcase } from "lucide-react";
import { insertJobSchema, type InsertJob, type Job, type Shift } from "@shared/schema";

export default function Jobs() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

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

  const { data: jobs = [], isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
    enabled: isAuthenticated,
  });

  const { data: shifts = [] } = useQuery<Shift[]>({
    queryKey: ["/api/shifts"],
    enabled: isAuthenticated,
  });

  const form = useForm<InsertJob>({
    resolver: zodResolver(insertJobSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#3B82F6",
      isActive: 1,
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: InsertJob) => {
      if (editingJob) {
        return await apiRequest('PATCH', `/api/jobs/${editingJob.id}`, data);
      } else {
        return await apiRequest('POST', '/api/jobs', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      toast({
        title: t('common.success'),
        description: editingJob ? "Job updated successfully" : "Job created successfully",
      });
      setDialogOpen(false);
      setEditingJob(null);
      form.reset();
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleOpenDialog = (job?: Job) => {
    if (job) {
      setEditingJob(job);
      form.reset({
        name: job.name,
        description: job.description || "",
        color: job.color || "#3B82F6",
        isActive: job.isActive,
      });
    } else {
      setEditingJob(null);
      form.reset({
        name: "",
        description: "",
        color: "#3B82F6",
        isActive: 1,
      });
    }
    setDialogOpen(true);
  };

  const onSubmit = (data: InsertJob) => {
    saveMutation.mutate(data);
  };

  const getShiftsCount = (jobId: string) => {
    return shifts.filter(s => s.jobId === jobId).length;
  };

  if (authLoading || jobsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="container max-w-screen-md mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-primary">ShiftSavvy</h1>
            <p className="text-xs text-muted-foreground">{t('jobs.title')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => handleOpenDialog()}
              data-testid="button-add-job"
              className="hover-elevate active-elevate-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('jobs.add')}
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container max-w-screen-md mx-auto px-4 py-6">
        {jobs.length === 0 ? (
          <Card className="p-12 text-center">
            <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-heading font-semibold mb-2">
              {t('jobs.noJobs')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t('jobs.addFirst')}
            </p>
            <Button onClick={() => handleOpenDialog()} data-testid="button-add-first-job">
              <Plus className="h-4 w-4 mr-2" />
              {t('jobs.add')}
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={() => handleOpenDialog(job)}
                shiftsCount={getShiftsCount(job.id)}
              />
            ))}
          </div>
        )}
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-testid="dialog-job-form">
          <DialogHeader>
            <DialogTitle>
              {editingJob ? t('jobs.edit') : t('jobs.add')}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">{t('jobs.name')} *</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                {['Server', 'Bartender', 'Expo', 'Busser', 'Host'].map((jobType) => (
                  <Button
                    key={jobType}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => form.setValue('name', jobType)}
                    data-testid={`button-preset-${jobType.toLowerCase()}`}
                    className="hover-elevate active-elevate-2"
                  >
                    {jobType}
                  </Button>
                ))}
              </div>
              <Input
                id="name"
                data-testid="input-job-name"
                {...form.register("name")}
                placeholder="Or enter a custom job name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">{t('jobs.description')}</Label>
              <Textarea
                id="description"
                data-testid="input-job-description"
                {...form.register("description")}
                className="mt-2 resize-none"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="color">{t('jobs.color')}</Label>
              <Input
                id="color"
                type="color"
                data-testid="input-job-color"
                {...form.register("color")}
                className="mt-2 h-12"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                data-testid="button-cancel-job"
                className="flex-1 hover-elevate active-elevate-2"
              >
                {t('jobs.cancel')}
              </Button>
              <Button
                type="submit"
                data-testid="button-save-job"
                className="flex-1 hover-elevate active-elevate-2"
                disabled={saveMutation.isPending}
              >
                {saveMutation.isPending ? t('common.loading') : t('jobs.save')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}

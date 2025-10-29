import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Trash } from "lucide-react";
import { insertShiftSchema, type InsertShift, type Job, type Shift, type Employer } from "@shared/schema";

export default function ShiftForm() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, params] = useRoute("/shift/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();

  const shiftId = params?.id === 'new' ? null : params?.id;
  const isEditing = !!shiftId;
  const [hasAttemptedCreate, setHasAttemptedCreate] = useState(false);

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

  const { data: employers = [] } = useQuery<Employer[]>({
    queryKey: ["/api/employers"],
    enabled: isAuthenticated,
  });

  const createPresetJobsMutation = useMutation({
    mutationFn: async (currentJobs: Job[]) => {
      const presetJobs = ['Server', 'Bartender', 'Expo', 'Busser', 'Host'];
      const existingJobNames = currentJobs.map(j => j.name);
      const jobsToCreate = presetJobs.filter(name => !existingJobNames.includes(name));
      
      if (jobsToCreate.length === 0) {
        return [];
      }

      const results = [];
      for (const name of jobsToCreate) {
        try {
          const result = await apiRequest('POST', '/api/jobs', {
            name,
            description: '',
            color: '#3B82F6',
            isActive: 1,
          });
          results.push(result);
        } catch (error) {
          console.error(`Error creating job ${name}:`, error);
        }
      }
      return results;
    },
    onSuccess: (results) => {
      if (results.length > 0) {
        queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      }
    },
    onError: (error: Error) => {
      console.error("Error creating preset jobs:", error);
    },
  });

  // Auto-create missing preset jobs whenever we visit and jobs are loaded
  useEffect(() => {
    if (isAuthenticated && !jobsLoading && !hasAttemptedCreate && !createPresetJobsMutation.isPending) {
      const presetJobs = ['Server', 'Bartender', 'Expo', 'Busser', 'Host'];
      const existingJobNames = jobs.map(j => j.name);
      const missingJobs = presetJobs.filter(name => !existingJobNames.includes(name));
      
      if (missingJobs.length > 0) {
        setHasAttemptedCreate(true);
        createPresetJobsMutation.mutate(jobs);
      }
    }
  }, [isAuthenticated, jobsLoading, hasAttemptedCreate, createPresetJobsMutation, jobs]);

  const { data: shift } = useQuery<Shift>({
    queryKey: ["/api/shifts", shiftId],
    enabled: isAuthenticated && isEditing,
  });

  const form = useForm<InsertShift>({
    resolver: zodResolver(insertShiftSchema),
    defaultValues: {
      jobId: "",
      employerId: "",
      date: new Date().toISOString().split('T')[0],
      hoursWorked: 0,
      hourlyWage: 0,
      cashTips: 0,
      creditTips: 0,
      coversServed: 0,
      tipOut: 0,
      notes: "",
    },
  });

  useEffect(() => {
    if (shift) {
      form.reset({
        jobId: shift.jobId,
        employerId: shift.employerId || "",
        date: shift.date,
        hoursWorked: parseFloat(shift.hoursWorked),
        hourlyWage: parseFloat(shift.hourlyWage),
        cashTips: parseFloat(shift.cashTips || '0'),
        creditTips: parseFloat(shift.creditTips || '0'),
        coversServed: shift.coversServed || 0,
        tipOut: parseFloat(shift.tipOut || '0'),
        notes: shift.notes || "",
      });
    }
  }, [shift, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: InsertShift) => {
      if (isEditing) {
        return await apiRequest('PATCH', `/api/shifts/${shiftId}`, data);
      } else {
        return await apiRequest('POST', '/api/shifts', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shifts"] });
      toast({
        title: t('common.success'),
        description: isEditing ? "Shift updated successfully" : "Shift created successfully",
      });
      setLocation("/");
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

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('DELETE', `/api/shifts/${shiftId}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shifts"] });
      toast({
        title: t('common.success'),
        description: "Shift deleted successfully",
      });
      setLocation("/");
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

  const onSubmit = (data: InsertShift) => {
    saveMutation.mutate(data);
  };

  if (authLoading) {
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
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/")}
              data-testid="button-back"
              className="hover-elevate active-elevate-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-heading font-bold text-primary">ShiftSavvy</h1>
              <p className="text-xs text-muted-foreground">
                {isEditing ? t('shift.edit') : t('shift.add')}
              </p>
            </div>
          </div>
          {isEditing && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteMutation.mutate()}
              data-testid="button-delete-shift"
              className="text-destructive hover-elevate active-elevate-2"
              disabled={deleteMutation.isPending}
            >
              <Trash className="h-5 w-5" />
            </Button>
          )}
        </div>
      </header>

      <main className="container max-w-screen-md mx-auto px-4 py-6">
        {createPresetJobsMutation.isPending && (
          <Card className="p-6 mb-6 bg-muted">
            <div className="flex items-center gap-3">
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
              <p className="text-sm font-medium">Setting up your jobs...</p>
            </div>
          </Card>
        )}
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6 space-y-6">
            <div>
              <Label htmlFor="jobId">{t('shift.job')} *</Label>
              <Select
                value={form.watch("jobId")}
                onValueChange={(value) => form.setValue("jobId", value)}
                disabled={jobs.length === 0}
              >
                <SelectTrigger id="jobId" data-testid="select-job" className="mt-2">
                  <SelectValue placeholder={jobs.length === 0 ? "No jobs available" : t('shift.selectJob')} />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id} data-testid={`job-option-${job.id}`}>
                      {job.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.jobId && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.jobId.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="employerId">Employer</Label>
              <Select
                value={form.watch("employerId") || ""}
                onValueChange={(value) => form.setValue("employerId", value || undefined)}
              >
                <SelectTrigger id="employerId" data-testid="select-employer" className="mt-2">
                  <SelectValue placeholder={employers.length === 0 ? "No employers added" : "Select employer (optional)"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {employers.map((employer) => (
                    <SelectItem key={employer.id} value={employer.id} data-testid={`employer-option-${employer.id}`}>
                      {employer.businessName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">{t('shift.date')} *</Label>
              <Input
                id="date"
                type="date"
                data-testid="input-date"
                {...form.register("date")}
                className="mt-2"
              />
              {form.formState.errors.date && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.date.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hoursWorked">{t('shift.hours')} *</Label>
                <Input
                  id="hoursWorked"
                  type="number"
                  step="0.25"
                  data-testid="input-hours"
                  {...form.register("hoursWorked")}
                  className="mt-2"
                />
                {form.formState.errors.hoursWorked && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.hoursWorked.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="hourlyWage">{t('shift.wage')} *</Label>
                <Input
                  id="hourlyWage"
                  type="number"
                  step="0.01"
                  data-testid="input-wage"
                  {...form.register("hourlyWage")}
                  className="mt-2"
                />
                {form.formState.errors.hourlyWage && (
                  <p className="text-sm text-destructive mt-1">{form.formState.errors.hourlyWage.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cashTips">{t('shift.cashTips')}</Label>
                <Input
                  id="cashTips"
                  type="number"
                  step="0.01"
                  data-testid="input-cash-tips"
                  {...form.register("cashTips")}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="creditTips">{t('shift.creditTips')}</Label>
                <Input
                  id="creditTips"
                  type="number"
                  step="0.01"
                  data-testid="input-credit-tips"
                  {...form.register("creditTips")}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="coversServed">{t('shift.covers')}</Label>
                <Input
                  id="coversServed"
                  type="number"
                  data-testid="input-covers"
                  {...form.register("coversServed")}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="tipOut">Tip Out (%)</Label>
                <Input
                  id="tipOut"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="0.00"
                  data-testid="input-tip-out"
                  {...form.register("tipOut")}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Percentage of tips shared with others
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">{t('shift.notes')}</Label>
              <Textarea
                id="notes"
                data-testid="input-notes"
                {...form.register("notes")}
                className="mt-2 resize-none"
                rows={3}
              />
            </div>
          </Card>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/")}
              data-testid="button-cancel"
              className="flex-1 hover-elevate active-elevate-2"
            >
              {t('shift.cancel')}
            </Button>
            <Button
              type="submit"
              data-testid="button-save-shift"
              className="flex-1 hover-elevate active-elevate-2"
              disabled={saveMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {saveMutation.isPending ? t('common.loading') : t('shift.save')}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

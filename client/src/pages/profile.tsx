import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { LogOut, Globe, DollarSign, Building2, Plus, Edit, Trash2 } from "lucide-react";
import type { Employer } from "@shared/schema";

const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
];

export default function Profile() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  
  const [state, setState] = useState(user?.state || '');
  const [localTaxRate, setLocalTaxRate] = useState(user?.localTaxRate ? (parseFloat(user.localTaxRate) * 100).toFixed(2) : '');
  
  // Profile fields
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [zipCode, setZipCode] = useState(user?.zipCode || '');

  // Profile edit mode state
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Employer dialog state
  const [isEmployerDialogOpen, setIsEmployerDialogOpen] = useState(false);
  const [editingEmployer, setEditingEmployer] = useState<Employer | null>(null);
  const [employerForm, setEmployerForm] = useState({
    businessName: '',
    address: '',
    phone: '',
    managerName: '',
    managerPhone: '',
  });

  const { data: employers = [], isLoading: employersLoading } = useQuery<Employer[]>({
    queryKey: ['/api/employers'],
    enabled: isAuthenticated,
  });

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

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setUsername(user.username || '');
      setZipCode(user.zipCode || '');
      setState(user.state || '');
      setLocalTaxRate(user.localTaxRate ? (parseFloat(user.localTaxRate) * 100).toFixed(2) : '');
      
      // Show edit form if profile is incomplete
      if (!user.firstName || !user.lastName) {
        setIsEditingProfile(true);
      }
    }
  }, [user]);

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

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    toast({
      title: t('common.success'),
      description: "Language updated successfully",
    });
  };

  const updateTaxSettingsMutation = useMutation({
    mutationFn: async (data: { state?: string; localTaxRate?: number }) => {
      return await apiRequest('PATCH', '/api/auth/user/tax-settings', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: t('common.success'),
        description: "Tax settings updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update tax settings",
        variant: "destructive",
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string; username: string; zipCode: string }) => {
      return await apiRequest('PATCH', '/api/auth/user/profile', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      toast({
        title: t('common.success'),
        description: "Profile updated successfully",
      });
    },
    onError: (error: any) => {
      const message = error?.message || "Failed to update profile";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  const createEmployerMutation = useMutation({
    mutationFn: async (employer: typeof employerForm) => {
      return await apiRequest('POST', '/api/employers', employer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/employers'] });
      setIsEmployerDialogOpen(false);
      resetEmployerForm();
      toast({
        title: t('common.success'),
        description: "Employer added successfully",
      });
    },
    onError: (error: any) => {
      const message = error?.message || "Failed to add employer";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  const updateEmployerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof employerForm }) => {
      return await apiRequest('PATCH', `/api/employers/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/employers'] });
      setIsEmployerDialogOpen(false);
      setEditingEmployer(null);
      resetEmployerForm();
      toast({
        title: t('common.success'),
        description: "Employer updated successfully",
      });
    },
    onError: (error: any) => {
      const message = error?.message || "Failed to update employer";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  const deleteEmployerMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/employers/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/employers'] });
      toast({
        title: t('common.success'),
        description: "Employer deleted successfully",
      });
    },
    onError: (error: any) => {
      const message = error?.message || "Failed to delete employer";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    },
  });

  const handleSaveTaxSettings = () => {
    const localRate = localTaxRate ? parseFloat(localTaxRate) / 100 : undefined;
    updateTaxSettingsMutation.mutate({
      state: state || undefined,
      localTaxRate: localRate,
    });
  };

  const handleSaveProfile = () => {
    updateProfileMutation.mutate({
      firstName,
      lastName,
      username,
      zipCode,
    });
    setIsEditingProfile(false);
  };

  const resetEmployerForm = () => {
    setEmployerForm({
      businessName: '',
      address: '',
      phone: '',
      managerName: '',
      managerPhone: '',
    });
  };

  const openEmployerDialog = (employer?: Employer) => {
    if (employer) {
      setEditingEmployer(employer);
      setEmployerForm({
        businessName: employer.businessName || '',
        address: employer.address || '',
        phone: employer.phone || '',
        managerName: employer.managerName || '',
        managerPhone: employer.managerPhone || '',
      });
    } else {
      setEditingEmployer(null);
      resetEmployerForm();
    }
    setIsEmployerDialogOpen(true);
  };

  const handleSaveEmployer = () => {
    // Validate business name is not empty
    if (!employerForm.businessName.trim()) {
      toast({
        title: "Validation Error",
        description: "Business name is required",
        variant: "destructive",
      });
      return;
    }

    if (editingEmployer) {
      updateEmployerMutation.mutate({ id: editingEmployer.id, data: employerForm });
    } else {
      createEmployerMutation.mutate(employerForm);
    }
  };

  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card border-b border-card-border">
        <div className="container max-w-screen-md mx-auto px-4 h-16 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-bold text-primary">ShiftSavvy</h1>
            <p className="text-xs text-muted-foreground">{t('profile.title')}</p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container max-w-screen-md mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <Card className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl font-heading bg-primary text-primary-foreground">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-heading font-semibold mb-1">
                {firstName || lastName
                  ? `${firstName || ''} ${lastName || ''}`.trim()
                  : 'User'}
              </h2>
              <p className="text-muted-foreground text-sm">{user?.email}</p>
              {username && <p className="text-muted-foreground text-sm">@{username}</p>}
              {zipCode && <p className="text-muted-foreground text-sm">{zipCode}</p>}
              <p className="text-muted-foreground text-sm">Language: {i18n.language === 'en' ? 'English' : 'Español'}</p>
              {state && <p className="text-muted-foreground text-sm">Tax State: {US_STATES.find(s => s.code === state)?.name}</p>}
              {localTaxRate && <p className="text-muted-foreground text-sm">Local Tax Rate: {localTaxRate}%</p>}
              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="text-xs text-primary hover:underline mt-2"
                  data-testid="link-edit-profile"
                >
                  Edit Profile Information
                </button>
              )}
            </div>
          </div>

          {isEditingProfile && (
            <div className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="mb-2">First Name</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="mb-2">Last Name</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    data-testid="input-last-name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="username" className="mb-2">
                  Username {user?.username && <span className="text-xs text-muted-foreground">(cannot be changed)</span>}
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="@username"
                  disabled={!!user?.username}
                  data-testid="input-username"
                />
              </div>

              <div>
                <Label htmlFor="zipCode" className="mb-2">Zip Code</Label>
                <Input
                  id="zipCode"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="12345"
                  maxLength={10}
                  data-testid="input-zip-code"
                />
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4" />
                  Language
                </Label>
                <Select
                  value={i18n.language}
                  onValueChange={handleLanguageChange}
                >
                  <SelectTrigger data-testid="select-language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Tax Settings
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="state" className="mb-2">State</Label>
                    <Select
                      value={state}
                      onValueChange={setState}
                    >
                      <SelectTrigger id="state" data-testid="select-state">
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map(s => (
                          <SelectItem key={s.code} value={s.code}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="localTaxRate" className="mb-2">Local Tax Rate (%)</Label>
                    <Input
                      id="localTaxRate"
                      type="number"
                      step="0.01"
                      min="0"
                      max="20"
                      placeholder="2.00"
                      value={localTaxRate}
                      onChange={(e) => setLocalTaxRate(e.target.value)}
                      data-testid="input-local-tax-rate"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter as percentage (e.g., 2.00 for 2%)
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    handleSaveProfile();
                    handleSaveTaxSettings();
                  }}
                  disabled={updateProfileMutation.isPending || updateTaxSettingsMutation.isPending}
                  data-testid="button-save-profile"
                  className="flex-1 hover-elevate active-elevate-2"
                >
                  {updateProfileMutation.isPending || updateTaxSettingsMutation.isPending ? 'Saving...' : 'Save Profile'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditingProfile(false);
                    setFirstName(user?.firstName || '');
                    setLastName(user?.lastName || '');
                    setUsername(user?.username || '');
                    setZipCode(user?.zipCode || '');
                    setState(user?.state || '');
                    setLocalTaxRate(user?.localTaxRate ? (parseFloat(user.localTaxRate) * 100).toFixed(2) : '');
                  }}
                  data-testid="button-cancel-profile"
                  className="hover-elevate active-elevate-2"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Employers Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Employers
            </h3>
            <Button
              size="sm"
              onClick={() => openEmployerDialog()}
              data-testid="button-add-employer"
              className="hover-elevate active-elevate-2"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Employer
            </Button>
          </div>

          {employersLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : employers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No employers added yet. Click "Add Employer" to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {employers.map((employer) => (
                <Card key={employer.id} className="p-4 hover-elevate" data-testid={`employer-card-${employer.id}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-base mb-1" data-testid={`employer-name-${employer.id}`}>
                        {employer.businessName}
                      </h4>
                      {employer.address && (
                        <p className="text-sm text-muted-foreground truncate">{employer.address}</p>
                      )}
                      {employer.phone && (
                        <p className="text-sm text-muted-foreground">{employer.phone}</p>
                      )}
                      {employer.managerName && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <span className="font-medium">Manager:</span> {employer.managerName}
                          {employer.managerPhone && ` • ${employer.managerPhone}`}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEmployerDialog(employer)}
                        data-testid={`button-edit-employer-${employer.id}`}
                        className="hover-elevate active-elevate-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteEmployerMutation.mutate(employer.id)}
                        data-testid={`button-delete-employer-${employer.id}`}
                        className="hover-elevate active-elevate-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        <Button
          variant="destructive"
          onClick={handleLogout}
          data-testid="button-logout"
          className="w-full hover-elevate active-elevate-2"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t('profile.logout')}
        </Button>
      </main>

      {/* Employer Dialog */}
      <Dialog open={isEmployerDialogOpen} onOpenChange={setIsEmployerDialogOpen}>
        <DialogContent data-testid="dialog-employer">
          <DialogHeader>
            <DialogTitle>{editingEmployer ? 'Edit Employer' : 'Add Employer'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="businessName">Business Name *</Label>
              <Input
                id="businessName"
                value={employerForm.businessName}
                onChange={(e) => setEmployerForm({ ...employerForm, businessName: e.target.value })}
                placeholder="Restaurant Name"
                data-testid="input-business-name"
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={employerForm.address}
                onChange={(e) => setEmployerForm({ ...employerForm, address: e.target.value })}
                placeholder="123 Main St, City, State 12345"
                data-testid="input-address"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={employerForm.phone}
                onChange={(e) => setEmployerForm({ ...employerForm, phone: e.target.value })}
                placeholder="(555) 123-4567"
                data-testid="input-phone"
              />
            </div>
            <div>
              <Label htmlFor="managerName">Manager's Name</Label>
              <Input
                id="managerName"
                value={employerForm.managerName}
                onChange={(e) => setEmployerForm({ ...employerForm, managerName: e.target.value })}
                placeholder="John Doe"
                data-testid="input-manager-name"
              />
            </div>
            <div>
              <Label htmlFor="managerPhone">Manager's Phone</Label>
              <Input
                id="managerPhone"
                value={employerForm.managerPhone}
                onChange={(e) => setEmployerForm({ ...employerForm, managerPhone: e.target.value })}
                placeholder="(555) 987-6543"
                data-testid="input-manager-phone"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEmployerDialogOpen(false)}
              data-testid="button-cancel-employer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEmployer}
              disabled={!employerForm.businessName || createEmployerMutation.isPending || updateEmployerMutation.isPending}
              data-testid="button-save-employer"
            >
              {createEmployerMutation.isPending || updateEmployerMutation.isPending ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}

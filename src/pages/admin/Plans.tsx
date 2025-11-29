// src/pages/admin/Plans.tsx
import { api } from "@/api/apiClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useEffect, useState } from "react";
// ------------------- Types -------------------
interface SubscriptionPlan {
  id: string;
  name: string;
  minimumInvestment: string;
  roiPerMonth: string;
  durationInMonths: number;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
interface Pagination {
  total: number;
  totalPages: number;
  current: number;
  count: number;
}
// ------------------- Component -------------------
const Plans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const limit = 6; // 2x3 grid
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Dialogs
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  // Form states
  const [form, setForm] = useState({
    name: "",
    minimumInvestment: "",
    roiPerMonth: "",
    durationInMonths: "",
    description: "",
    isActive: true,
  });
  const { toast } = useToast();
  // ------------------- API Calls -------------------
  const fetchPlans = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/subscription/all", {
        params: { page, limit },
      });
      setPlans(data.data);
      // If backend doesn't return pagination, mock it
      setPagination({
        total: data.data.length,
        totalPages: 1,
        current: page,
        count: data.data.length,
      });
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setError(msg);
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  const createPlan = async () => {
    try {
      const payload = {
        ...form,
        minimumInvestment: parseFloat(form.minimumInvestment),
        roiPerMonth: parseFloat(form.roiPerMonth) / 100, // 10% → 0.10
        durationInMonths: parseInt(form.durationInMonths),
      };
      await api.post("/subscription/create", payload);
      toast({ title: "Success", description: "Plan created!" });
      setCreateOpen(false);
      resetForm();
      fetchPlans(page);
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to create plan",
        variant: "destructive",
      });
    }
  };
  const updatePlan = async () => {
    if (!selectedPlan) return;
    try {
      const payload = {
        ...form,
        minimumInvestment: parseFloat(form.minimumInvestment),
        roiPerMonth: parseFloat(form.roiPerMonth) / 100,
        durationInMonths: parseInt(form.durationInMonths),
      };
      await api.put(`/subscription/${selectedPlan.id}`, payload);
      toast({ title: "Success", description: "Plan updated!" });
      setEditOpen(false);
      fetchPlans(page);
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to update plan",
        variant: "destructive",
      });
    }
  };
  const deletePlan = async (id: string) => {
    if (!confirm("Delete this plan?")) return;
    try {
      await api.delete(`/subscription/${id}`);
      toast({ title: "Success", description: "Plan deleted!" });
      fetchPlans(page);
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.error || "Cannot delete: has investments",
        variant: "destructive",
      });
    }
  };
  // ------------------- Helpers -------------------
  const resetForm = () => {
    setForm({
      name: "",
      minimumInvestment: "",
      roiPerMonth: "",
      durationInMonths: "",
      description: "",
      isActive: true,
    });
  };
  const openEdit = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setForm({
      name: plan.name,
      minimumInvestment: plan.minimumInvestment,
      roiPerMonth: (parseFloat(plan.roiPerMonth) * 100).toFixed(2), // 0.10 → 10.00
      durationInMonths: plan.durationInMonths.toString(),
      description: plan.description || "",
      isActive: plan.isActive,
    });
    setEditOpen(true);
  };
  // ------------------- Effects -------------------
  useEffect(() => {
    fetchPlans(page);
  }, [page]);
  // ------------------- Render -------------------
  return (
    <>
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #9ca3af #1f2937;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 7px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: #1f2937;
        }
        .custom-scrollbar::-ms-scrollbar-track {
          background: #1f2937;
          border-radius: 10px;
        }
        .custom-scrollbar::-ms-scrollbar-thumb {
          background: #6b7280;
          border-radius: 10px;
        }
        .custom-scrollbar::-ms-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Subscription Plans</h1>
            <p className="text-muted-foreground mt-1">Manage investment plans</p>
          </div>
          <Button onClick={() => { resetForm(); setCreateOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Plan
          </Button>
        </div>
        {/* Loading / Error */}
        {loading && <p className="text-center text-muted-foreground ">Loading plans...</p>}
        {error && <p className="text-center text-destructive">{error}</p>}
        {/* Plans Grid */}
        {!loading && !error && (
          <>
          <div>
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar ">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {plans.map((plan) => (
                  <Card key={plan.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <Badge variant={plan.isActive ? "default" : "secondary"}>
                          {plan.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">ROI per Month</p>
                        <p className="text-2xl font-bold text-primary">
                          {(parseFloat(plan.roiPerMonth) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="text-lg font-semibold">{plan.durationInMonths} months</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Min Investment</p>
                        <p className="text-lg font-semibold">
                          ${parseFloat(plan.minimumInvestment).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => openEdit(plan)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1"
                          onClick={() => deletePlan(plan.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            </div>
            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
        {/* Create Dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Plan</DialogTitle>
              <DialogDescription>Add a new subscription plan</DialogDescription>
            </DialogHeader>
            <PlanForm form={form} setForm={setForm} onSubmit={createPlan} onCancel={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
        {/* Edit Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Plan</DialogTitle>
              <DialogDescription>Update plan details</DialogDescription>
            </DialogHeader>
            <PlanForm form={form} setForm={setForm} onSubmit={updatePlan} onCancel={() => setEditOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
// ------------------- Reusable Form -------------------
const PlanForm = ({
  form,
  setForm,
  onSubmit,
  onCancel,
}: {
  form;
  setForm: (f) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Plan Name</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Premium Plan"
        />
      </div>
      <div className="space-y-2">
        <Label>ROI per Month (%)</Label>
        <Input
          type="number"
          step="0.01"
          value={form.roiPerMonth}
          onChange={(e) => setForm({ ...form, roiPerMonth: e.target.value })}
          placeholder="15"
        />
      </div>
      <div className="space-y-2">
        <Label>Duration (months)</Label>
        <Input
          type="number"
          value={form.durationInMonths}
          onChange={(e) => setForm({ ...form, durationInMonths: e.target.value })}
          placeholder="12"
        />
      </div>
      <div className="space-y-2">
        <Label>Minimum Investment ($)</Label>
        <Input
          type="number"
          step="0.01"
          value={form.minimumInvestment}
          onChange={(e) => setForm({ ...form, minimumInvestment: e.target.value })}
          placeholder="5000"
        />
      </div>
      <div className="space-y-2">
        <Label>Description (optional)</Label>
        <Input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="High-return plan..."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="plan-status">Status</Label>
        <select
          id="plan-status"
          aria-label="Plan status"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          value={form.isActive ? "true" : "false"}
          onChange={(e) => setForm({ ...form, isActive: e.target.value === "true" })}
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={onSubmit}>Save</Button>
      </div>
    </div>
  );
};
export default Plans;
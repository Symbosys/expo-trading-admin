import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const plans = [
  {
    id: 1,
    name: 'Basic Plan',
    roi: '10%',
    duration: '6 months',
    minInvestment: '$1,000',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Pro Plan',
    roi: '15%',
    duration: '12 months',
    minInvestment: '$5,000',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Elite Plan',
    roi: '20%',
    duration: '12 months',
    minInvestment: '$10,000',
    status: 'Active',
  },
];

const Plans = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const { toast } = useToast();

  const handleCreatePlan = () => {
    toast({
      title: "Plan Created",
      description: "New subscription plan has been created successfully.",
    });
    setCreateDialogOpen(false);
  };

  const handleEditPlan = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    setEditDialogOpen(true);
  };

  const handleUpdatePlan = () => {
    toast({
      title: "Plan Updated",
      description: "Subscription plan has been updated successfully.",
    });
    setEditDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subscription Plans</h1>
          <p className="text-muted-foreground mt-1">Manage investment plans</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Plan
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <Badge variant={plan.status === 'Active' ? 'default' : 'secondary'}>
                  {plan.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">ROI per Month</p>
                <p className="text-2xl font-bold text-primary">{plan.roi}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-lg font-semibold">{plan.duration}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Min Investment</p>
                <p className="text-lg font-semibold">{plan.minInvestment}</p>
              </div>
              <Button variant="outline" className="w-full" onClick={() => handleEditPlan(plan)}>Edit Plan</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Plan Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Plan</DialogTitle>
            <DialogDescription>Add a new subscription plan to the platform</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Plan Name</Label>
              <Input placeholder="e.g., Premium Plan" />
            </div>
            <div className="space-y-2">
              <Label>ROI per Month (%)</Label>
              <Input type="number" placeholder="e.g., 15" />
            </div>
            <div className="space-y-2">
              <Label>Duration (months)</Label>
              <Input type="number" placeholder="e.g., 12" />
            </div>
            <div className="space-y-2">
              <Label>Minimum Investment ($)</Label>
              <Input type="number" placeholder="e.g., 5000" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreatePlan}>Create Plan</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
            <DialogDescription>Update subscription plan details</DialogDescription>
          </DialogHeader>
          {selectedPlan && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Plan Name</Label>
                <Input defaultValue={selectedPlan.name} />
              </div>
              <div className="space-y-2">
                <Label>ROI per Month (%)</Label>
                <Input type="number" defaultValue={selectedPlan.roi} />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input defaultValue={selectedPlan.duration} />
              </div>
              <div className="space-y-2">
                <Label>Minimum Investment</Label>
                <Input defaultValue={selectedPlan.minInvestment} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={selectedPlan.status}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleUpdatePlan}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Plans;

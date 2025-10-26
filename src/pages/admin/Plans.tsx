import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';

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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subscription Plans</h1>
          <p className="text-muted-foreground mt-1">Manage investment plans</p>
        </div>
        <Button>
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
              <Button variant="outline" className="w-full">Edit Plan</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Plans;

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { investments } from '@/data/mockData';

const planData = [
  { plan: 'Basic', amount: 45000 },
  { plan: 'Pro', amount: 78000 },
  { plan: 'Elite', amount: 125000 },
];

const Investments = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Investments Management</h1>
        <p className="text-muted-foreground mt-1">Monitor all platform investments</p>
      </div>

      {/* Investment Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Total Invested Per Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={planData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="plan" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar 
                dataKey="amount" 
                fill="hsl(var(--primary))" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Investments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Investments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Investment ID</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">User</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Plan</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Amount</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">ROI %</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Duration</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Start Date</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">End Date</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {investments.map((investment) => (
                  <tr key={investment.id} className="border-b border-border last:border-0">
                    <td className="py-4 text-sm">#{investment.id}</td>
                    <td className="py-4 text-sm font-medium">{investment.user}</td>
                    <td className="py-4 text-sm">{investment.plan}</td>
                    <td className="py-4 text-sm font-semibold text-primary">{investment.amount}</td>
                    <td className="py-4 text-sm text-accent font-semibold">{investment.roi}</td>
                    <td className="py-4 text-sm">{investment.duration}</td>
                    <td className="py-4 text-sm text-muted-foreground">{investment.startDate}</td>
                    <td className="py-4 text-sm text-muted-foreground">{investment.endDate}</td>
                    <td className="py-4">
                      <Badge variant={
                        investment.status === 'Active' ? 'default' : 
                        investment.status === 'Completed' ? 'outline' : 
                        'destructive'
                      }>
                        {investment.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Investments;

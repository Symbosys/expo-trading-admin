import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { Badge } from '@/components/ui/badge';
import { Percent, DollarSign, TrendingUp, RefreshCw } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { roiData, weeklyRoiData } from '@/data/mockData';

const ROI = () => {
  const totalRoiPaid = roiData.reduce((sum, r) => sum + parseFloat(r.roiAmount.replace(/[$,]/g, '')), 0);
  const totalReferralBonus = roiData
    .filter(r => r.referralBonus === 'Yes')
    .reduce((sum, r) => sum + parseFloat(r.roiAmount.replace(/[$,]/g, '')) * 0.15, 0);
  const activeRoiCycles = roiData.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">ROI & Earnings</h1>
        <p className="text-muted-foreground mt-1">Monitor weekly ROI distributions and earnings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total ROI Paid"
          value={`$${totalRoiPaid.toLocaleString()}`}
          change="+18.5%"
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Referral Bonus"
          value={`$${totalReferralBonus.toLocaleString()}`}
          change="+24.2%"
          icon={Percent}
          trend="up"
        />
        <StatCard
          title="Active ROI Cycles"
          value={activeRoiCycles.toString()}
          icon={RefreshCw}
        />
        <StatCard
          title="Weekly Average"
          value={`$${(weeklyRoiData.reduce((sum, w) => sum + w.amount, 0) / weeklyRoiData.length).toLocaleString()}`}
          icon={TrendingUp}
        />
      </div>

      {/* Weekly ROI Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly ROI Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyRoiData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="week" 
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
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="hsl(var(--accent))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--accent))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ROI Table */}
      <Card>
        <CardHeader>
          <CardTitle>ROI Distribution Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">User</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Investment</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">ROI Amount</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Week #</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Referral Bonus</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {roiData.map((roi) => (
                  <tr key={roi.id} className="border-b border-border last:border-0">
                    <td className="py-4 text-sm font-medium">{roi.user}</td>
                    <td className="py-4 text-sm">{roi.investment}</td>
                    <td className="py-4 text-sm font-semibold text-primary">{roi.roiAmount}</td>
                    <td className="py-4 text-sm">Week {roi.week}</td>
                    <td className="py-4">
                      <Badge variant={roi.referralBonus === 'Yes' ? 'default' : 'outline'}>
                        {roi.referralBonus}
                      </Badge>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">{roi.date}</td>
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

export default ROI;

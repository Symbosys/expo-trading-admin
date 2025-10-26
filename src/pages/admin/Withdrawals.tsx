import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowDownToLine, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';
import { withdrawals } from '@/data/mockData';
import { toast } from 'sonner';

const Withdrawals = () => {
  const pendingAmount = withdrawals
    .filter(w => w.status === 'Pending')
    .reduce((sum, w) => sum + parseFloat(w.amount.replace(/[$,]/g, '')), 0);
  
  const totalPaid = withdrawals
    .filter(w => w.status === 'Approved')
    .reduce((sum, w) => sum + parseFloat(w.amount.replace(/[$,]/g, '')), 0);

  const handleApprove = (id: number, user: string) => {
    toast.success(`Withdrawal #${id} approved for ${user}`);
  };

  const handleReject = (id: number, user: string) => {
    toast.error(`Withdrawal #${id} rejected for ${user}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Withdrawals Management</h1>
        <p className="text-muted-foreground mt-1">Review and process withdrawal requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Amount"
          value={`$${pendingAmount.toLocaleString()}`}
          icon={Clock}
        />
        <StatCard
          title="Total Paid"
          value={`$${totalPaid.toLocaleString()}`}
          change="+15.3%"
          icon={CheckCircle}
          trend="up"
        />
        <StatCard
          title="Total Requests"
          value={withdrawals.length.toString()}
          icon={ArrowDownToLine}
        />
        <StatCard
          title="Pending Requests"
          value={withdrawals.filter(w => w.status === 'Pending').length.toString()}
          icon={DollarSign}
        />
      </div>

      {/* Withdrawals Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Withdrawal Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Request ID</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">User</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Amount</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Destination Address</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Date</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Status</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="border-b border-border last:border-0">
                    <td className="py-4 text-sm">#{withdrawal.id}</td>
                    <td className="py-4 text-sm font-medium">{withdrawal.user}</td>
                    <td className="py-4 text-sm font-semibold text-primary">{withdrawal.amount}</td>
                    <td className="py-4">
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {withdrawal.destination.slice(0, 20)}...
                      </code>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">{withdrawal.date}</td>
                    <td className="py-4">
                      <Badge variant={
                        withdrawal.status === 'Approved' ? 'default' : 
                        withdrawal.status === 'Pending' ? 'secondary' : 
                        'destructive'
                      }>
                        {withdrawal.status}
                      </Badge>
                    </td>
                    <td className="py-4">
                      {withdrawal.status === 'Pending' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleApprove(withdrawal.id, withdrawal.user)}
                            className="h-8"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleReject(withdrawal.id, withdrawal.user)}
                            className="h-8"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
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

export default Withdrawals;

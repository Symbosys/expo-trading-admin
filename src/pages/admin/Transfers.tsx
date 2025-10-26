import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftRight, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { transfers } from '@/data/mockData';

const Transfers = () => {
  const totalTransfers = transfers.length;
  const successfulTransfers = transfers.filter(t => t.status === 'Successful').length;
  const failedTransfers = transfers.filter(t => t.status === 'Failed').length;
  const totalAmount = transfers
    .filter(t => t.status === 'Successful')
    .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[$,]/g, '')), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Transfers Management</h1>
        <p className="text-muted-foreground mt-1">Track user-to-user transfers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Transfers"
          value={totalTransfers.toString()}
          icon={ArrowLeftRight}
        />
        <StatCard
          title="Successful"
          value={successfulTransfers.toString()}
          change="+95.2%"
          icon={CheckCircle}
          trend="up"
        />
        <StatCard
          title="Failed"
          value={failedTransfers.toString()}
          icon={XCircle}
        />
        <StatCard
          title="Total Volume"
          value={`$${totalAmount.toLocaleString()}`}
          change="+22.4%"
          icon={DollarSign}
          trend="up"
        />
      </div>

      {/* Transfers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Transfers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Transfer ID</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Sender</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Receiver</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Amount</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Date</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((transfer) => (
                  <tr key={transfer.id} className="border-b border-border last:border-0">
                    <td className="py-4 text-sm">#{transfer.id}</td>
                    <td className="py-4 text-sm font-medium">{transfer.sender}</td>
                    <td className="py-4 text-sm font-medium">{transfer.receiver}</td>
                    <td className="py-4 text-sm font-semibold text-primary">{transfer.amount}</td>
                    <td className="py-4 text-sm text-muted-foreground">{transfer.date}</td>
                    <td className="py-4">
                      <Badge variant={transfer.status === 'Successful' ? 'default' : 'destructive'}>
                        {transfer.status}
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

export default Transfers;

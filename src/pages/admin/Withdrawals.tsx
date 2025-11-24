/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/Withdrawals.tsx (full updated component)

import { api } from '@/api/apiClient';
import { StatCard } from '@/components/dashboard/StatCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowDownToLine, CheckCircle, ChevronLeft, ChevronRight, Clock, DollarSign, Search, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from "sonner";

type TransactionStatus = 'PENDING' | 'SUCCESS' | 'FAILED'; // Matches Prisma enum

// Types
interface User {
  id: string;
  name: string | null;
  email: string;
}

interface Transaction {
  id: string;
  user: User;
  type: string;
  amount: string;
  currency: string;
  status: TransactionStatus;
  description: string | null;
  meta: any; // JSON with destination, etc.
  createdAt: string;
}

interface Pagination {
  total: number;
  totalPages: number;
  current: number;
  count: number;
}

const Withdrawals = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [withdrawals, setWithdrawals] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);

  // Fetch Withdrawals
  const fetchWithdrawals = async (pageNum: number, search = '') => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page: pageNum, limit };
      if (search) params.search = search;
      params.type = 'WITHDRAW'; // Fixed: Matches Prisma TransactionType enum (WITHDRAW, not WITHDRAWAL)

      const { data } = await api.get('/transaction/all', { params }); // Fixed: Plural route
      const transactions = data.data.transactions || [];
      setWithdrawals(transactions);
      setPagination(data.data.pagination || null);

      // Calculate stats (using SUCCESS for approved/paid)
      const pending = transactions.filter((t: Transaction) => t.status === 'PENDING');
      const approved = transactions.filter((t: Transaction) => t.status === 'SUCCESS');
      setPendingAmount(pending.reduce((sum: number, t: Transaction) => sum + parseFloat(t.amount), 0));
      setTotalPaid(approved.reduce((sum: number, t: Transaction) => sum + parseFloat(t.amount), 0));
      setTotalRequests(data.data.pagination?.total || 0);
      setPendingRequests(pending.length);
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message;
      setError(msg);
      toast.error('Failed to fetch withdrawals');
      setWithdrawals([]);
    } finally {
      setLoading(false);
    }
  };

  // Approve/Reject
  const handleApprove = async (id: string, userName: string) => {
    try {
      await api.put(`/transactions/${id}`, { status: 'SUCCESS' }); // Fixed: Matches Prisma TransactionStatus
      toast.success(`Withdrawal #${id.slice(-6)} approved for ${userName}`);
      fetchWithdrawals(page, searchQuery); // Refresh
    } catch (err: any) {
      toast.error('Failed to approve withdrawal');
    }
  };

  const handleReject = async (id: string, userName: string) => {
    try {
      await api.put(`/transactions/${id}`, { status: 'FAILED' }); // Fixed: Matches Prisma TransactionStatus
      toast.error(`Withdrawal #${id.slice(-6)} rejected for ${userName}`);
      fetchWithdrawals(page, searchQuery); // Refresh
    } catch (err: any) {
      toast.error('Failed to reject withdrawal');
    }
  };

  // Effects
  useEffect(() => {
    fetchWithdrawals(page);
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchWithdrawals(1, searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Withdrawals Management</h1>
        <p className="text-muted-foreground mt-1">Review and process withdrawal requests</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by user, email, or description..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

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
          value={totalRequests.toString()}
          icon={ArrowDownToLine}
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequests.toString()}
          icon={DollarSign}
        />
      </div>

      {/* Withdrawals Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Withdrawal Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-8 text-muted-foreground">Loading withdrawals...</p>
          ) : error ? (
            <p className="text-center py-8 text-destructive">{error}</p>
          ) : withdrawals.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No withdrawals found.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 font-semibold text-sm text-muted-foreground">Request ID</th>
                      <th className="pb-3 font-semibold text-sm text-muted-foreground">User</th>
                      <th className="pb-3 font-semibold text-sm text-muted-foreground">Amount</th>
                      <th className="pb-3 font-semibold text-sm text-muted-foreground">Destination</th>
                      <th className="pb-3 font-semibold text-sm text-muted-foreground">Date</th>
                      <th className="pb-3 font-semibold text-sm text-muted-foreground">Status</th>
                      <th className="pb-3 font-semibold text-sm text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map((withdrawal) => (
                      <tr key={withdrawal.id} className="border-b border-border last:border-0">
                        <td className="py-4 text-sm">#{withdrawal.id.slice(-6)}</td>
                        <td className="py-4 text-sm font-medium">
                          {withdrawal.user.name || withdrawal.user.email}
                        </td>
                        <td className="py-4 text-sm font-semibold text-primary">
                          ${parseFloat(withdrawal.amount).toFixed(2)} {withdrawal.currency}
                        </td>
                        <td className="py-4">
                          <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                            {withdrawal.meta?.destination ? 
                              `${withdrawal.meta.destination.slice(0, 20)}...` : 
                              'N/A'
                            }
                          </code>
                        </td>
                        <td className="py-4 text-sm text-muted-foreground">
                          {new Date(withdrawal.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <Badge
                            variant={
                              withdrawal.status === 'SUCCESS' ? 'default' : // Fixed: SUCCESS for approved
                              withdrawal.status === 'PENDING' ? 'secondary' :
                              'destructive'
                            }
                          >
                            {withdrawal.status}
                          </Badge>
                        </td>
                        <td className="py-4">
                          {withdrawal.status === 'PENDING' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApprove(withdrawal.id, withdrawal.user.name || withdrawal.user.email)}
                                className="h-8"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(withdrawal.id, withdrawal.user.name || withdrawal.user.email)}
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

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} requests
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Prev
                    </Button>
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
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Withdrawals;
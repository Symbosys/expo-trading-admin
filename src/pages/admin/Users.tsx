import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Edit, Trash2 } from 'lucide-react';
import { users } from '@/data/mockData';

const Users = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
        <p className="text-muted-foreground mt-1">Manage all platform users</p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, email, or referral code..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">User ID</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Name</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Email</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Balance (USDT)</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Level</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Referrals</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Status</th>
                  <th className="pb-3 font-semibold text-sm text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0">
                    <td className="py-4 text-sm">#{user.id}</td>
                    <td className="py-4 text-sm font-medium">{user.name}</td>
                    <td className="py-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="py-4 text-sm font-semibold text-primary">${user.balance}</td>
                    <td className="py-4">
                      <Badge variant="outline" className="font-medium">
                        {user.level}
                      </Badge>
                    </td>
                    <td className="py-4 text-sm">{user.referrals}</td>
                    <td className="py-4">
                      <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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

export default Users;

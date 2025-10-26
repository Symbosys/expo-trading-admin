import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Eye, Edit, Trash2 } from 'lucide-react';
import { users } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const Users = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const { toast } = useToast();

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (user: typeof users[0]) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleEdit = (user: typeof users[0]) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDelete = (user: typeof users[0]) => {
    toast({
      title: "User Deleted",
      description: `${user.name} has been deleted from the system.`,
    });
  };

  const handleSaveEdit = () => {
    toast({
      title: "User Updated",
      description: "User information has been updated successfully.",
    });
    setEditDialogOpen(false);
  };

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
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleView(user)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleEdit(user)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive" onClick={() => handleDelete(user)}>
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

      {/* View User Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Complete information about the user</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">User ID</Label>
                  <p className="font-semibold">#{selectedUser.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Badge variant={selectedUser.status === 'Active' ? 'default' : 'destructive'}>
                    {selectedUser.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="font-semibold">{selectedUser.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-semibold">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Balance (USDT)</Label>
                  <p className="font-semibold text-primary">${selectedUser.balance}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Level</Label>
                  <Badge variant="outline">{selectedUser.level}</Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Referrals</Label>
                  <p className="font-semibold">{selectedUser.referrals}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Referral Code</Label>
                  <p className="font-semibold">{selectedUser.referralCode}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input defaultValue={selectedUser.name} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue={selectedUser.email} />
                </div>
                <div className="space-y-2">
                  <Label>Balance (USDT)</Label>
                  <Input type="number" defaultValue={selectedUser.balance} />
                </div>
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Input defaultValue={selectedUser.level} />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue={selectedUser.status}>
                    <option value="Active">Active</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;

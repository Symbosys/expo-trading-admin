import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Save, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { toast } from 'sonner';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [platformName, setPlatformName] = useState('CryptoAdmin');
  const [minWithdrawal, setMinWithdrawal] = useState('10');
  const [supportEmail, setSupportEmail] = useState('support@cryptoadmin.com');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  
  const [adminName, setAdminName] = useState('Admin User');
  const [adminEmail, setAdminEmail] = useState('admin@cryptoadmin.com');

  const handleSaveGeneral = () => {
    toast.success('General settings saved successfully');
  };

  const handleSaveProfile = () => {
    toast.success('Admin profile updated successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure platform and admin preferences</p>
      </div>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Theme Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark mode
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* General Site Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Site Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="platformName">Platform Name</Label>
            <Input
              id="platformName"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              placeholder="Enter platform name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minWithdrawal">Minimum Withdrawal (USDT)</Label>
            <Input
              id="minWithdrawal"
              type="number"
              value={minWithdrawal}
              onChange={(e) => setMinWithdrawal(e.target.value)}
              placeholder="10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supportEmail">Support Email</Label>
            <Input
              id="supportEmail"
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              placeholder="support@example.com"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="space-y-1">
              <Label htmlFor="maintenance">Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable to temporarily disable user access
              </p>
            </div>
            <Switch
              id="maintenance"
              checked={maintenanceMode}
              onCheckedChange={setMaintenanceMode}
            />
          </div>

          <Button onClick={handleSaveGeneral} className="w-full mt-6">
            <Save className="w-4 h-4 mr-2" />
            Save General Settings
          </Button>
        </CardContent>
      </Card>

      {/* Admin Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adminName">Name</Label>
            <Input
              id="adminName"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminEmail">Email</Label>
            <Input
              id="adminEmail"
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
            />
          </div>

          <Button onClick={handleSaveProfile} className="w-full mt-6">
            <Save className="w-4 h-4 mr-2" />
            Update Profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;

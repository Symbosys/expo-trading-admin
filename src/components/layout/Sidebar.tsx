import { cn } from '@/lib/utils';
import {
  ArrowDownToLine,
  ArrowLeftRight,
  BedDouble,
  Coins,
  Headphones,
  LogOut,
  Package,
  Percent,
  QrCode,
  TrendingUp,
  Users,
  X,
  Bell
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  // { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/users', icon: Users, label: 'Users' },
  // { path: '/admin/investments', icon: TrendingUp, label: 'Investments' },
  { path: '/admin/plans', icon: Package, label: 'Plans' },
  // { path: '/admin/referrals', icon: GitBranch, label: 'Referrals' },
  { path: '/admin/withdrawals', icon: ArrowDownToLine, label: 'Withdrawals' },
  // { path: '/admin/transfers', icon: ArrowLeftRight, label: 'Transfers' },
  // { path: '/admin/roi', icon: Percent, label: 'ROI & Earnings' },
  // { path: '/admin/settings', icon: Settings, label: 'Settings' },
  { path: '/admin/support', icon: Headphones, label: 'Support' },
  { path: '/admin/qr-code', icon: QrCode, label: 'QR Code' },
  { path: '/admin/notifications', icon: Bell, label: 'Notifications' },
  { path: '/admin/AdminInvestmentPage', icon: Coins, label: "User-Investment" },
  { path: '/admin/SettingsPage', icon: BedDouble, label: "SettingsPage" }
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">CryptoAdmin</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 hover:bg-sidebar-accent rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-sidebar-foreground" />
          </button>

        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={() => {
              // TODO: Implement logout logic (e.g., clear auth, redirect to login)
              console.log('Logout clicked');
              localStorage.removeItem('admin_token');
              window.location.href = '/admin/login';
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors"

          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
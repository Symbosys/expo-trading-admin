import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Login from "./pages/admin/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/Users";
import Investments from "./pages/admin/Investments";
import Plans from "./pages/admin/Plans";
import Wallets from "./pages/admin/Wallets";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="investments" element={<Investments />} />
              <Route path="plans" element={<Plans />} />
              <Route path="wallets" element={<Wallets />} />
              <Route path="referrals" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Referrals Page - Coming Soon</h2></div>} />
              <Route path="withdrawals" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Withdrawals Page - Coming Soon</h2></div>} />
              <Route path="transfers" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Transfers Page - Coming Soon</h2></div>} />
              <Route path="roi" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">ROI & Earnings Page - Coming Soon</h2></div>} />
              <Route path="settings" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Settings Page - Coming Soon</h2></div>} />
              <Route path="support" element={<div className="text-center py-12"><h2 className="text-2xl font-bold">Support Page - Coming Soon</h2></div>} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

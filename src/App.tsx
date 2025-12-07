import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
// import Investment from "./pages/admin/Investment";


import Investments from "./pages/admin/Investments";
import Login from "./pages/admin/Login";
import Plans from "./pages/admin/Plans";
import Referrals from "./pages/admin/Referrals";
import ROI from "./pages/admin/ROI";
// import Settings from "./pages/admin/Settings";
import ProtectedRoute from "./components/protectedRoute";
import Support from "./pages/admin/Support";
import Transfers from "./pages/admin/Transfers";
import Users from "./pages/admin/Users";


import { WalletCards } from "lucide-react";
import SettingsPage from "./pages/admin/active.js";
import QrCode from "./pages/admin/QrCode";
import AdminInvestmentPage from "./pages/admin/useerinvestment";
import Withdrawals from "./pages/admin/Withdrawals";
import Notifications from "./pages/admin/Notifications";
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
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<Users />} />
              <Route path="users" element={<Users />} />
              <Route path="investments" element={<Investments />} />
              <Route path="plans" element={<Plans />} />
              <Route path="wallets" element={<WalletCards />} />
              <Route path="referrals" element={<Referrals />} />
              <Route path="withdrawals" element={<Withdrawals />} />
              <Route path="transfers" element={<Transfers />} />
              <Route path="qr-code" element={<QrCode />} />
              <Route path="roi" element={<ROI />} />
              {/* <Route path="settings" element={<Settings />} /> */}
              <Route path="support" element={<Support />} />

              <Route path="AdminInvestmentPage" element={<AdminInvestmentPage />} />
              <Route path="SettingsPage" element={<SettingsPage />} />
              <Route path="notifications" element={<Notifications />} />
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

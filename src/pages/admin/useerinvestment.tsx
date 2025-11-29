import {
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  FileText,
  Filter,
  MoreHorizontal,
  Search,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  User,
  Wallet,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  getAllInvestments,
  updateInvestmentStatus,
} from "../../service/investmentService";

// --- Detail Modal Component (UNCHANGED logic, but included for completeness) ---
const DetailModal = ({ isOpen, onClose, data, onApprove, onReject }) => {
  if (!isOpen || !data) return null;

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(val || 0));
  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : "N/A";
  const truncateWallet = (address) =>
    address
      ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
      : "N/A";

  const isPending = data.status === "PENDING";

  const handleActionClick = (action) => {
    action(data.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Investment Details
            </h3>
            <p className="text-xs text-gray-500 font-mono mt-1">
              ID: {data.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          <div
            className={`flex items-center p-4 rounded-lg border ${
              data.status === "ACTIVE" || data.status === "COMPLETED"
                ? "bg-green-50 border-green-100 text-green-800"
                : data.status === "PENDING"
                ? "bg-yellow-50 border-yellow-100 text-yellow-800"
                : "bg-red-50 border-red-100 text-red-800"
            }`}
          >
            {data.status === "ACTIVE" || data.status === "COMPLETED" ? (
              <CheckCircle className="mr-3" size={24} />
            ) : data.status === "PENDING" ? (
              <Clock className="mr-3" size={24} />
            ) : (
              <X className="mr-3" size={24} />
            )}
            <div>
              <p className="font-bold text-sm uppercase tracking-wide">
                Status: {data.status}
              </p>
              <p className="text-xs opacity-90">
                {data.status === "ACTIVE"
                  ? "Investment is currently active and generating returns."
                  : data.status === "PENDING"
                  ? "Investment is pending approval."
                  : data.status === "COMPLETED"
                  ? "Investment has been completed successfully."
                  : data.status === "CANCELLED"
                  ? "Investment has been cancelled."
                  : "Investment has been rejected."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-900 font-semibold border-b pb-2">
                <User size={18} className="text-blue-500" />
                <h4>Investor Profile</h4>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name:</span>{" "}
                  <span className="font-medium">{data.user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>{" "}
                  <span className="font-medium">{data.user.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Wallet size={14} /> Wallet Address:
                  </span>
                  <span className="font-mono text-xs text-gray-700 p-1 bg-white rounded-md border border-gray-200">
                    {/* Assuming you add walletAddress to your backend response for this to work */}
                    {truncateWallet(data.user.walletAddress || "N/A")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">User ID:</span>{" "}
                  <span className="font-mono text-xs text-gray-400">
                    {data.user.id}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-900 font-semibold border-b pb-2">
                <FileText size={18} className="text-purple-500" />
                <h4>Subscription Plan</h4>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Plan Name:</span>{" "}
                  <span className="font-medium text-purple-700">
                    {data.plan.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ROI Per Month:</span>{" "}
                  <span className="font-medium">
                    {(Number(data.plan.roiPerMonth || 0) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Min. Entry:</span>{" "}
                  <span className="font-medium">
                    {formatCurrency(data.plan.minimumInvestment)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-900 font-semibold border-b pb-2">
              <CreditCard size={18} className="text-green-500" />
              <h4>Financial Overview</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-600 mb-1 font-medium">
                  Invested Amount
                </p>
                <p className="font-bold text-gray-900 text-lg">
                  {formatCurrency(data.amountInvested)}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                <p className="text-xs text-green-600 mb-1 font-medium">
                  ROI Percentage
                </p>
                <p className="font-bold text-gray-900 text-lg">
                  {Number(data.roiPercentage || 0)}%
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1 font-medium">
                  Start Date
                </p>
                <p className="font-semibold text-gray-700">
                  {formatDate(data.startDate)}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1 font-medium">
                  Est. End Date
                </p>
                <p className="font-semibold text-gray-700">
                  {/* Note: Backend needs to calculate/return this, or you calculate it based on plan duration */}
                  {formatDate(data.endDate)} 
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-between">
          {isPending ? (
            <div className="flex space-x-3">
              <button
                onClick={() => handleActionClick(onReject)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                <ThumbsDown size={16} /> Reject
              </button>
              <button
                onClick={() => handleActionClick(onApprove)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                <ThumbsUp size={16} /> Approve
              </button>
            </div>
          ) : (
            <div className="w-1/3"></div>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
// --- END Detail Modal Component ---

const LIMIT = 10; // Items per page constant

export default function AdminInvestmentPage() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: LIMIT,
    total: 0,
    totalPages: 1,
  });

  // State for dropdowns and modals
  const [openStatusDropdownId, setOpenStatusDropdownId] = useState(null);
  const [openActionDropdownId, setOpenActionDropdownId] = useState(null);
  const [selectedInvestment, setSelectedInvestment] = useState(null);

  // Function to fetch data from the backend
  const fetchInvestments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllInvestments(pagination.page, pagination.limit);
      setInvestments(result.data || []);
      setPagination(result.pagination || {
        page: pagination.page || 1,
        limit: pagination.limit || LIMIT,
        total: result.data?.length || 0,
        totalPages: 1,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load investments. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [pagination?.page, pagination?.limit]); // Depend on page and limit

  // Initial load and page changes
  useEffect(() => {
    fetchInvestments();
  }, [fetchInvestments]);

  // Handler to change the status, now calling the backend
  const handleStatusChange = async (id, newStatus) => {
    try {
      const updatedInvestment = await updateInvestmentStatus(id, newStatus);
      // Replace the old investment with the updated one
      setInvestments((prev) =>
        prev.map((inv) => (inv.id === id ? updatedInvestment : inv))
      );
      setNotification({ show: true, message: `Status updated to ${newStatus.toLowerCase()} successfully.`, type: 'success' });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
      setOpenStatusDropdownId(null);
      setOpenActionDropdownId(null);
    } catch (err) {
      console.error(`Failed to update status for ${id}:`, err);
      setNotification({ show: true, message: `Failed to update status to ${newStatus.toLowerCase()}.`, type: 'error' });
      setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    }
  };

  const handleApprove = (id) => {
    handleStatusChange(id, "ACTIVE");
  };

  const handleReject = (id) => {
    handleStatusChange(id, "REJECTED");
  };

  // --- UI/Helper Handlers (Mostly unchanged) ---

  const toggleStatusDropdown = (e, id) => {
    e.stopPropagation();
    setOpenActionDropdownId(null);
    setOpenStatusDropdownId(openStatusDropdownId === id ? null : id);
  };

  const toggleActionDropdown = (e, id) => {
    e.stopPropagation();
    setOpenStatusDropdownId(null);
    setOpenActionDropdownId(openActionDropdownId === id ? null : id);
  };

  const handleViewDetails = (investment) => {
    setSelectedInvestment(investment);
    setOpenActionDropdownId(null);
  };

  const closeDropdowns = () => {
    setOpenStatusDropdownId(null);
    setOpenActionDropdownId(null);
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0, // Assuming whole dollars for display
    }).format(Number(val || 0));

  const getStatusColors = (status) => {
    // ... (Your getStatusColors logic here, unchanged)
    switch (status) {
      case "ACTIVE":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          hover: "hover:bg-green-100",
          dot: "bg-green-500",
          label: "Active",
        };
      case "PENDING":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          border: "border-yellow-200",
          hover: "hover:bg-yellow-100",
          dot: "bg-yellow-500",
          label: "Pending",
        };
      case "COMPLETED":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          hover: "hover:bg-blue-100",
          dot: "bg-blue-500",
          label: "Completed",
        };
      case "CANCELLED":
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          hover: "hover:bg-gray-100",
          dot: "bg-gray-500",
          label: "Cancelled",
        };
      case "REJECTED":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          hover: "hover:bg-red-100",
          dot: "bg-red-500",
          label: "Rejected",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          border: "border-gray-200",
          hover: "hover:bg-gray-100",
          dot: "bg-gray-500",
          label: "Unknown",
        };
    }
  };
  
  // Client-side search filtering (since backend /all doesn't support it yet)
  const filteredInvestments = investments.filter(
    (inv) =>
      inv.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.plan?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // --- UI Render ---

  return (
    <div
      className="min-h-screen bg-gray-50 p-6 md:p-8 font-sans text-gray-800"
      onClick={closeDropdowns}
    >
      {/* Notification Banner */}
      {notification.show && (
        <div className={`mb-4 p-4 rounded-lg shadow-md flex items-center justify-between animate-in slide-in-from-top duration-200 ${
          notification.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          <span className="text-sm">{notification.message}</span>
          <button
            onClick={() => setNotification({ show: false, message: '', type: '' })}
            className="ml-4 text-current opacity-70 hover:opacity-100"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Investments</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage investment statuses and track active plans.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2">
            <span className="text-sm text-gray-500">Total Records:</span>
            <span className="font-bold text-gray-900">
              {(pagination?.total || investments.length).toLocaleString()}
            </span>
          </div>
          {/* Note: Total Invested calculation should ideally be a separate, optimized backend query */}
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm flex items-center gap-2">
            <span className="text-sm text-gray-500">Total Invested (Page):</span>
            <span className="font-bold text-gray-900">
              {formatCurrency(
                investments.reduce((acc, curr) => acc + Number(curr.amountInvested || 0), 0)
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Toolbar */}
      <div className="bg-white p-4 rounded-t-xl border-b border-gray-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by user or plan name..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium">
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
        {loading && (
          <div className="p-12 text-center text-blue-500">Loading investments...</div>
        )}
        {error && (
          <div className="p-12 text-center text-red-500 bg-red-50">
            Error: {error}
          </div>
        )}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-200">
                  <th className="px-6 py-4">Investor</th>
                  <th className="px-6 py-4">Plan Details</th>
                  <th className="px-6 py-4">Amount & ROI</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInvestments.length > 0 ? (
                  filteredInvestments.map((inv) => {
                    const statusColors = getStatusColors(inv.status);

                    return (
                      <tr
                        key={inv.id}
                        className="hover:bg-gray-50 transition-colors group"
                      >
                        {/* User Column */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                              {inv.user?.name.charAt(0) || "U"}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">
                                {inv.user?.name}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {inv.user?.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Plan Column */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 text-sm">
                              {inv.plan?.name}
                            </span>
                            <span className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                              <TrendingUp size={12} />{" "}
                              {(Number(inv.plan?.roiPerMonth || 0) * 100).toFixed(1)}% / Mo
                            </span>
                          </div>
                        </td>

                        {/* Amount Column */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 text-sm flex items-center gap-1">
                              <DollarSign size={14} className="text-gray-400" />
                              {Number(inv.amountInvested || 0).toLocaleString()}
                            </span>
                            <span className="text-green-600 text-xs flex items-center gap-1 mt-0.5 font-medium">
                              <TrendingUp size={12} /> {Number(inv.roiPercentage || 0)}% ROI
                            </span>
                          </div>
                        </td>

                        {/* Date Column */}
                        <td className="px-6 py-4">
                          <span className="text-gray-600 text-sm flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            {new Date(inv.createdAt).toLocaleDateString()}
                          </span>
                        </td>

                        {/* Status Column with Dropdown (Unchanged logic) */}
                        <td className="px-6 py-4 relative">
                          <div className="relative inline-block text-left">
                            <button
                              onClick={(e) => toggleStatusDropdown(e, inv.id)}
                              className={`
                                flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                                ${statusColors.bg} ${statusColors.text} ${statusColors.border} ${statusColors.hover}
                              `}
                            >
                              {inv.status === "ACTIVE" ||
                              inv.status === "COMPLETED" ||
                              inv.status === "REJECTED" ? (
                                <>
                                  <CheckCircle size={12} />
                                  {statusColors.label}
                                </>
                              ) : inv.status === "CANCELLED" ? (
                                <>
                                  <X size={12} /> {statusColors.label}
                                </>
                              ) : (
                                <>
                                  <Clock size={12} /> {statusColors.label}
                                </>
                              )}
                              {inv.status !== "REJECTED" && inv.status !== "COMPLETED" && inv.status !== "CANCELLED" && (
                                <ChevronDown
                                  size={12}
                                  className={`transition-transform duration-200 ${
                                    openStatusDropdownId === inv.id
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                />
                              )}
                            </button>

                            {/* Status Dropdown Menu */}
                            {openStatusDropdownId === inv.id && (
                              <div
                                className="absolute left-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 z-20 animate-in fade-in zoom-in-95 duration-100 overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="py-1">
                                  <button
                                    onClick={() =>
                                      handleStatusChange(inv.id, "PENDING")
                                    }
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 flex items-center gap-2"
                                  >
                                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                    Pending
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleStatusChange(inv.id, "ACTIVE")
                                    }
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 flex items-center gap-2"
                                  >
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    Active
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleStatusChange(inv.id, "COMPLETED")
                                    }
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
                                  >
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    Completed
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleStatusChange(inv.id, "CANCELLED")
                                    }
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-700 flex items-center gap-2"
                                  >
                                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                    Cancelled
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleStatusChange(inv.id, "REJECTED")
                                    }
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-2"
                                  >
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    Rejected
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Actions Column with Approve/Reject/More (Unchanged logic) */}
                        <td className="px-6 py-4 text-center relative">
                          <div className="flex items-center justify-end space-x-2">
                            {/* Direct Approve/Reject buttons for PENDING status */}
                            {inv.status === "PENDING" && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApprove(inv.id);
                                  }}
                                  title="Approve Investment"
                                  className="p-2 rounded-full text-white bg-green-500 hover:bg-green-600 transition-colors shadow-md"
                                >
                                  <ThumbsUp size={16} />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReject(inv.id);
                                  }}
                                  title="Reject Investment"
                                  className="p-2 rounded-full text-white bg-red-500 hover:bg-red-600 transition-colors shadow-md"
                                >
                                  <ThumbsDown size={16} />
                                </button>
                              </>
                            )}

                            {/* More Options Dropdown */}
                            <button
                              onClick={(e) => toggleActionDropdown(e, inv.id)}
                              title="More Actions"
                              className={`p-2 rounded-full transition-colors ${
                                openActionDropdownId === inv.id
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              <MoreHorizontal size={18} />
                            </button>

                            {/* Action Dropdown Menu */}
                            {openActionDropdownId === inv.id && (
                              <div
                                className="absolute right-0 top-14 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-30 animate-in fade-in zoom-in-95 duration-100 overflow-hidden text-left"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="py-1">
                                  <button
                                    onClick={() => handleViewDetails(inv)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-2"
                                  >
                                    <Eye size={16} />
                                    View Details
                                  </button>

                                  <div className="border-t border-gray-100 my-1"></div>
                                  <span className="block px-4 py-2 text-xs text-gray-400 uppercase font-semibold tracking-wider">
                                    Management
                                  </span>
                                  {inv.status === "PENDING" && (
                                    <>
                                      <button
                                        onClick={() => handleApprove(inv.id)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-2"
                                      >
                                        <ThumbsUp size={16} />
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => handleReject(inv.id)}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-2"
                                      >
                                        <ThumbsDown size={16} />
                                        Reject
                                      </button>
                                      <div className="border-t border-gray-100 my-1"></div>
                                    </>
                                  )}
                                  <button
                                    disabled
                                    className="w-full text-left px-4 py-2 text-sm text-gray-400 cursor-not-allowed flex items-center gap-2"
                                  >
                                    Edit Investment
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-400 bg-gray-50/50"
                    >
                      No investments found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls (New) */}
        <div className="p-4 flex justify-between items-center border-t border-gray-200 bg-white">
          <p className="text-sm text-gray-600">
            Page {(pagination?.page || 1)} of {(pagination?.totalPages || 1)}. Showing{" "}
            {filteredInvestments.length} results.
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() =>
                setPagination((p) => ({ ...p, page: Math.max(1, (p?.page || 1) - 1) }))
              }
              disabled={((pagination?.page || 1) === 1) || loading}
              className="px-3 py-1 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setPagination((p) => ({
                  ...p,
                  page: Math.min((p?.totalPages || 1), (p?.page || 1) + 1),
                }))
              }
              disabled={((pagination?.page || 1) >= (pagination?.totalPages || 1)) || loading}
              className="px-3 py-1 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <DetailModal
        isOpen={!!selectedInvestment}
        onClose={() => setSelectedInvestment(null)}
        data={selectedInvestment}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
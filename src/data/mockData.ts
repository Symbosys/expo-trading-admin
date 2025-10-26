export const investmentTrendData = [
  { month: 'Jan', amount: 45000 },
  { month: 'Feb', amount: 52000 },
  { month: 'Mar', amount: 48000 },
  { month: 'Apr', amount: 61000 },
  { month: 'May', amount: 68000 },
  { month: 'Jun', amount: 75000 },
];

export const investmentDistribution = [
  { name: 'Active', value: 65, fill: 'hsl(var(--primary))' },
  { name: 'Completed', value: 35, fill: 'hsl(var(--accent))' },
];

export const recentActivities = [
  { id: 1, user: 'John Doe', type: 'Investment', amount: '$5,000', date: '2024-01-15', status: 'Active' },
  { id: 2, user: 'Jane Smith', type: 'Withdrawal', amount: '$2,500', date: '2024-01-15', status: 'Pending' },
  { id: 3, user: 'Mike Johnson', type: 'Referral Bonus', amount: '$150', date: '2024-01-14', status: 'Completed' },
  { id: 4, user: 'Sarah Wilson', type: 'Investment', amount: '$10,000', date: '2024-01-14', status: 'Active' },
  { id: 5, user: 'Tom Brown', type: 'ROI Payout', amount: '$750', date: '2024-01-13', status: 'Completed' },
];

export const users = [
  { 
    id: 1, 
    name: 'John Doe', 
    email: 'john@example.com', 
    balance: '12,450', 
    level: 'Gold', 
    referrals: 15, 
    status: 'Active' 
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    email: 'jane@example.com', 
    balance: '8,320', 
    level: 'Silver', 
    referrals: 8, 
    status: 'Active' 
  },
  { 
    id: 3, 
    name: 'Mike Johnson', 
    email: 'mike@example.com', 
    balance: '25,100', 
    level: 'Platinum', 
    referrals: 32, 
    status: 'Active' 
  },
  { 
    id: 4, 
    name: 'Sarah Wilson', 
    email: 'sarah@example.com', 
    balance: '5,670', 
    level: 'Bronze', 
    referrals: 4, 
    status: 'Active' 
  },
  { 
    id: 5, 
    name: 'Tom Brown', 
    email: 'tom@example.com', 
    balance: '18,900', 
    level: 'Gold', 
    referrals: 21, 
    status: 'Blocked' 
  },
];

export const investments = [
  {
    id: 1,
    user: 'John Doe',
    plan: 'Basic Plan',
    amount: '$5,000',
    roi: '10%',
    duration: '6 months',
    status: 'Active',
    startDate: '2024-01-01',
    endDate: '2024-07-01'
  },
  {
    id: 2,
    user: 'Jane Smith',
    plan: 'Pro Plan',
    amount: '$10,000',
    roi: '15%',
    duration: '12 months',
    status: 'Active',
    startDate: '2024-01-05',
    endDate: '2025-01-05'
  },
  {
    id: 3,
    user: 'Mike Johnson',
    plan: 'Elite Plan',
    amount: '$25,000',
    roi: '20%',
    duration: '12 months',
    status: 'Active',
    startDate: '2023-12-15',
    endDate: '2024-12-15'
  },
  {
    id: 4,
    user: 'Sarah Wilson',
    plan: 'Basic Plan',
    amount: '$3,000',
    roi: '10%',
    duration: '6 months',
    status: 'Completed',
    startDate: '2023-07-01',
    endDate: '2024-01-01'
  },
  {
    id: 5,
    user: 'Tom Brown',
    plan: 'Pro Plan',
    amount: '$15,000',
    roi: '15%',
    duration: '12 months',
    status: 'Active',
    startDate: '2023-11-01',
    endDate: '2024-11-01'
  },
];

export const wallets = [
  {
    id: 1,
    user: 'John Doe',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    balance: '$12,450',
  },
  {
    id: 2,
    user: 'Jane Smith',
    address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    balance: '$8,320',
  },
  {
    id: 3,
    user: 'Mike Johnson',
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    balance: '$25,100',
  },
  {
    id: 4,
    user: 'Sarah Wilson',
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    balance: '$5,670',
  },
];

export const transactions = [
  {
    id: 1,
    user: 'John Doe',
    type: 'Deposit',
    amount: '$5,000',
    status: 'Completed',
    date: '2024-01-15',
  },
  {
    id: 2,
    user: 'Jane Smith',
    type: 'Withdrawal',
    amount: '$2,500',
    status: 'Pending',
    date: '2024-01-15',
  },
  {
    id: 3,
    user: 'Mike Johnson',
    type: 'ROI',
    amount: '$1,200',
    status: 'Completed',
    date: '2024-01-14',
  },
  {
    id: 4,
    user: 'Sarah Wilson',
    type: 'Referral Bonus',
    amount: '$150',
    status: 'Completed',
    date: '2024-01-14',
  },
  {
    id: 5,
    user: 'Tom Brown',
    type: 'Transfer',
    amount: '$500',
    status: 'Completed',
    date: '2024-01-13',
  },
];

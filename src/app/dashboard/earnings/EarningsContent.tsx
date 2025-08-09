'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  reference: string;
}

interface EarningsData {
  totalEarnings: number;
  availableBalance: number;
  pendingPayout: number;
  lifetimeEarnings: number;
  transactions: Transaction[];
}

export default function EarningsContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [data, setData] = useState<EarningsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!session) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        const response = await fetch(`/api/user/earnings?period=${selectedPeriod}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch earnings data');
        }
        
        const earningsData = await response.json();
        setData(earningsData);
      } catch (err) {
        console.error('Failed to fetch earnings data:', err);
        setError('Failed to load earnings data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarnings();
  }, [session, selectedPeriod]);

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!withdrawalAmount || isNaN(Number(withdrawalAmount)) || Number(withdrawalAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsWithdrawing(true);
    setError('');
    
    try {
      const response = await fetch('/api/user/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: Number(withdrawalAmount) }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to process withdrawal');
      }
      
      // Show success message
      alert('Withdrawal request submitted successfully!');
      setWithdrawalAmount('');
      
      // Refresh the data
      const updatedResponse = await fetch(`/api/user/earnings?period=${selectedPeriod}`);
      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json();
        setData(updatedData);
      }
    } catch (err) {
      console.error('Withdrawal error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process withdrawal');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading || !data) {
    return <EarningsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Earnings Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your earnings and request payouts
          </p>
        </div>
        <div className="mt-4 flex-shrink-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {error}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Available Balance */}
        <StatCard
          title="Available Balance"
          value={formatCurrency(data.availableBalance / 100)}
          icon={
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          action={
            <button
              onClick={() => {
                setWithdrawalAmount((data.availableBalance / 100).toString());
                document.getElementById('withdraw-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Withdraw
            </button>
          }
        />

        {/* Pending Payout */}
        <StatCard
          title="Pending Payout"
          value={formatCurrency(data.pendingPayout / 100)}
          icon={
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          subtitle={`Next payout: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
        />

        {/* Lifetime Earnings */}
        <StatCard
          title="Lifetime Earnings"
          value={formatCurrency(data.lifetimeEarnings / 100)}
          icon={
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          action={
            <button className="font-medium text-indigo-600 hover:text-indigo-500">
              View all time stats
            </button>
          }
        />

        {/* Total Points */}
        <StatCard
          title="Total Points"
          value={data.totalEarnings.toLocaleString()}
          icon={
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
          subtitle={`≈ ${formatCurrency(data.totalEarnings * 0.01)}`}
          action={
            <button className="font-medium text-indigo-600 hover:text-indigo-500">
              How to earn more
            </button>
          }
        />
      </div>

      {/* Withdraw Form */}
      <div id="withdraw-form" className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Withdraw Funds</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Request a withdrawal to your bank account or PayPal</p>
          </div>
          <form className="mt-5 sm:flex sm:items-center" onSubmit={handleWithdrawal}>
            <div className="w-full sm:max-w-xs">
              <label htmlFor="amount" className="sr-only">
                Amount
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="text"
                  name="amount"
                  id="amount"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  disabled={isWithdrawing}
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <span className="text-gray-500 sm:text-sm pr-3">USD</span>
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isWithdrawing || !withdrawalAmount || Number(withdrawalAmount) <= 0 || Number(withdrawalAmount) > (data.availableBalance / 100)}
              className={`mt-3 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${
                (isWithdrawing || !withdrawalAmount || Number(withdrawalAmount) <= 0 || Number(withdrawalAmount) > (data.availableBalance / 100)) 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
              }`}
            >
              {isWithdrawing ? 'Processing...' : 'Request Withdrawal'}
            </button>
          </form>
          <div className="mt-3 text-sm text-gray-500">
            <p>
              Available: {formatCurrency(data.availableBalance / 100)} • Minimum withdrawal: $10.00
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Transactions</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Your recent earnings and withdrawals
          </p>
        </div>
        <div className="bg-white overflow-hidden">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transaction
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.description}
                            </div>
                            <div className="text-sm text-gray-500">
                              {transaction.reference}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(transaction.date)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatTime(transaction.date)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              transaction.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : transaction.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </span>
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${
                            transaction.type === 'credit' ? 'text-green-600' : 'text-gray-900'
                          }`}>
                            {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount / 100)}
                          </td>
                        </tr>
                      ))}
                      {data.transactions.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                            No transactions found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// StatCard component for displaying stats
function StatCard({ title, value, icon, subtitle, action }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
              </dd>
              {subtitle && (
                <dd className="text-sm text-gray-500">{subtitle}</dd>
              )}
            </dl>
          </div>
        </div>
      </div>
      {action && (
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            {action}
          </div>
        </div>
      )}
    </div>
  );
}

// Import the skeleton loader at the bottom to avoid circular imports
import EarningsSkeleton from '@/components/skeletons/EarningsSkeleton';

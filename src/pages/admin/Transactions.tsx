import { useState, useMemo } from 'react';
import { Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StatusBadge, Pagination } from '@/components/ui';
import { mockTransactions, mockGyms, mockUsers } from '@/data/mockData';

export default function TransactionsPage() {
  const [gymFilter, setGymFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const limit = 8;

  const filtered = useMemo(() => {
    return mockTransactions.filter(t => {
      const matchesGym = gymFilter === 'all' || t.gymId === gymFilter;
      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchesGym && matchesType && matchesStatus;
    });
  }, [gymFilter, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / limit);
  const paged = filtered.slice((page - 1) * limit, page * limit);

  const totalAmount = filtered.filter(t => t.status === 'completed' && t.type !== 'refund').reduce((s, t) => s + t.amount, 0);
  const refundAmount = filtered.filter(t => t.status === 'completed' && t.type === 'refund').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Financial Transactions</h1>
        <p className="text-gray-500 mt-1">View and manage all financial transactions.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-gray-400 mt-1">{filtered.filter(t => t.type !== 'refund').length} transactions</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5">
          <p className="text-sm text-gray-500">Total Refunds</p>
          <p className="text-2xl font-bold text-red-600 mt-1">${refundAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-gray-400 mt-1">{filtered.filter(t => t.type === 'refund').length} refunds</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200/80 p-5">
          <p className="text-sm text-gray-500">Net Revenue</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">${(totalAmount - refundAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-gray-400 mt-1">After refunds</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <select value={gymFilter} onChange={e => { setGymFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value="all">All Gyms</option>
            {mockGyms.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value="all">All Types</option>
            <option value="subscription">Subscription</option>
            <option value="trainerPayment">Trainer Payment</option>
            <option value="refund">Refund</option>
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <span className="text-sm text-gray-500 ml-auto">{filtered.length} transactions</span>
          <button className="flex items-center gap-1.5 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200/80">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Transaction</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">User</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Gym</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Type</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Amount</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map(tx => (
                <tr key={tx.transactionId} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {tx.type === 'refund'
                        ? <ArrowDownRight size={16} className="text-red-500" />
                        : <ArrowUpRight size={16} className="text-emerald-500" />
                      }
                      <span className="text-sm font-mono text-gray-600">{tx.transactionId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{tx.userName}</p>
                      <p className="text-xs text-gray-400">{mockUsers.find(u => u.id === tx.userId)?.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{tx.gymName}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                      tx.type === 'subscription' ? 'bg-blue-50 text-blue-700' :
                      tx.type === 'trainerPayment' ? 'bg-purple-50 text-purple-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {tx.type === 'trainerPayment' ? 'Trainer Pmt' : tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-sm font-semibold ${tx.type === 'refund' ? 'text-red-600' : 'text-gray-900'}`}>
                      {tx.type === 'refund' ? '-' : ''}${tx.amount.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">{tx.currency}</span>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={tx.status} /></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(tx.timestamp).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 border-t border-gray-100">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}

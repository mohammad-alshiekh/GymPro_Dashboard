import { useNavigate } from 'react-router-dom';
import { Users, Building2, DollarSign, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { StatCard } from '@/components/ui';
import { mockUsers, mockGyms, mockTransactions, mockTrainerApplications, mockGymApplications } from '@/data/mockData';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const totalUsers = mockUsers.length;
  const activeGyms = mockGyms.filter(g => g.status === 'active').length;
  const totalRevenue = mockTransactions
    .filter(t => t.status === 'completed' && t.type !== 'refund')
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingApps = mockTrainerApplications.filter(t => t.status === 'pending').length +
    mockGymApplications.filter(g => g.status === 'pending').length;

  const recentTransactions = mockTransactions.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, Super Administrator. Here's your overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users" value={totalUsers} icon={<Users size={22} />} color="indigo" change="+3 this week" />
        <StatCard title="Active Gyms" value={activeGyms} icon={<Building2 size={22} />} color="emerald" change="of 5 total" />
        <StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} icon={<DollarSign size={22} />} color="blue" change="+12% from last month" />
        <StatCard title="Pending Applications" value={pendingApps} icon={<Clock size={22} />} color="amber" change="Requires review" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Transactions</h2>
            <button
              onClick={() => navigate('/admin/transactions')}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentTransactions.map(tx => (
              <div key={tx.transactionId} className="flex items-center justify-between px-6 py-3.5 hover:bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    tx.type === 'subscription' ? 'bg-blue-50 text-blue-600' :
                    tx.type === 'trainerPayment' ? 'bg-purple-50 text-purple-600' :
                    'bg-red-50 text-red-600'
                  }`}>
                    {tx.type === 'refund' ? <span className="text-sm font-bold">↩</span> : <DollarSign size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tx.userName}</p>
                    <p className="text-xs text-gray-500">{tx.gymName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${tx.type === 'refund' ? 'text-red-600' : 'text-gray-900'}`}>
                    {tx.type === 'refund' ? '-' : '+'}${tx.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">{new Date(tx.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-200/80">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-4 space-y-2">
            {[
              { label: 'Manage Users', desc: `${totalUsers} total users`, path: '/admin/users', icon: <Users size={18} />, color: 'bg-indigo-50 text-indigo-600' },
              { label: 'Review Trainers', desc: `${mockTrainerApplications.filter(t => t.status === 'pending').length} pending`, path: '/admin/trainers', icon: <TrendingUp size={18} />, color: 'bg-emerald-50 text-emerald-600' },
              { label: 'Manage Gyms', desc: `${activeGyms} active gyms`, path: '/admin/gyms', icon: <Building2 size={18} />, color: 'bg-blue-50 text-blue-600' },
              { label: 'View Transactions', desc: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })} total`, path: '/admin/transactions', icon: <DollarSign size={18} />, color: 'bg-purple-50 text-purple-600' },
            ].map(action => (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{action.label}</p>
                  <p className="text-xs text-gray-500">{action.desc}</p>
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gym Overview */}
      <div className="bg-white rounded-2xl border border-gray-200/80">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Gym Overview</h2>
          <button
            onClick={() => navigate('/admin/gyms')}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            Manage <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {mockGyms.map(gym => (
            <div key={gym.id} className="px-6 py-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-900 truncate">{gym.name}</span>
                <span className={`w-2 h-2 rounded-full shrink-0 ${gym.status === 'active' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
              </div>
              <p className="text-xs text-gray-500">{gym.memberCount} members</p>
              <p className="text-xs text-gray-400 truncate">{gym.location}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { BarChart3, Users, CreditCard, Activity, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/ui';

interface ReportData {
  summary: { label: string; value: string; change?: string; sub?: string }[];
  details: { label: string; value: string | number; sub?: string }[];
}

const reportTypes = [
  { key: 'users', label: 'Users Report', icon: <Users size={20} />, color: 'indigo' as const },
  { key: 'subscriptions', label: 'Subscriptions Report', icon: <CreditCard size={20} />, color: 'emerald' as const },
  { key: 'activity', label: 'Activity Report', icon: <Activity size={20} />, color: 'amber' as const },
  { key: 'financial', label: 'Financial Report', icon: <TrendingUp size={20} />, color: 'blue' as const },
];

const mockReports: Record<string, ReportData> = {
  users: {
    summary: [
      { label: 'Total Users', value: '20', change: '+5 this month' },
      { label: 'Active Users', value: '16', change: '80% of total' },
      { label: 'New Signups', value: '5', change: '+25% from last month' },
      { label: 'Churn Rate', value: '3.2%', change: '-0.5% from last month' },
    ],
    details: [
      { label: 'Trainees', value: 15, sub: '75% of users' },
      { label: 'Trainers', value: 5, sub: '25% of users' },
      { label: 'Male Users', value: 12, sub: '60%' },
      { label: 'Female Users', value: 8, sub: '40%' },
      { label: 'Avg. Age', value: '28.5', sub: 'Range: 18-45' },
      { label: 'Avg. Fitness Level', value: 'Intermediate', sub: 'Based on self-report' },
    ],
  },
  subscriptions: {
    summary: [
      { label: 'Active Subscriptions', value: '42', change: '+8 this month' },
      { label: 'Revenue', value: '$4,250', change: '+15% MoM' },
      { label: 'Avg. Plan Value', value: '$101.19', change: '+$5 from last month' },
      { label: 'Renewal Rate', value: '87%', change: '+2% from last month' },
    ],
    details: [
      { label: 'Monthly Plans', value: 24, sub: '57% of total' },
      { label: 'Annual Plans', value: 12, sub: '29% of total' },
      { label: 'VIP Plans', value: 6, sub: '14% of total' },
      { label: 'Expired', value: 8, sub: 'Last 30 days' },
      { label: 'Cancelled', value: 3, sub: 'Last 30 days' },
      { label: 'Upcoming Renewals', value: 11, sub: 'Next 7 days' },
    ],
  },
  activity: {
    summary: [
      { label: 'Total Workouts', value: '342', change: '+18% this week' },
      { label: 'Active Users Today', value: '28', change: '+5 from yesterday' },
      { label: 'Avg. Session Duration', value: '52 min', change: '+3 min' },
      { label: 'Calories Burned', value: '125K', change: 'Team total this week' },
    ],
    details: [
      { label: 'Strength Training', value: 145, sub: '42% of workouts' },
      { label: 'Cardio', value: 98, sub: '29% of workouts' },
      { label: 'Group Classes', value: 67, sub: '20% of workouts' },
      { label: 'Yoga/Pilates', value: 32, sub: '9% of workouts' },
      { label: 'Meals Logged', value: 189, sub: 'This week' },
      { label: 'Challenges Completed', value: 24, sub: 'This week' },
    ],
  },
  financial: {
    summary: [
      { label: 'Total Revenue', value: '$12,450', change: '+22% this month' },
      { label: 'Expenses', value: '$3,200', change: 'Trainer payments' },
      { label: 'Net Profit', value: '$9,250', change: '+18% MoM' },
      { label: 'Pending', value: '$1,065', sub: '2 transactions' },
    ],
    details: [
      { label: 'Subscription Revenue', value: '$9,850', sub: '79% of total' },
      { label: 'Trainer Payments', value: '$3,200', sub: 'Expense' },
      { label: 'Refunds', value: '$49.99', sub: '1 refund' },
      { label: 'Avg. Transaction', value: '$83.33', sub: 'Per transaction' },
      { label: 'Completed', value: 13, sub: 'Transactions' },
      { label: 'Failed', value: 1, sub: 'Transactions' },
    ],
  },
};

export default function ReportsPage() {
  const [reportType, setReportType] = useState('users');
  const [generated, setGenerated] = useState(false);
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-01-31');

  const handleGenerate = () => { setGenerated(true); };

  const report = mockReports[reportType];
  const currentType = reportTypes.find(t => t.key === reportType);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500 mt-1">Generate and view system-wide reports.</p>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {reportTypes.map(type => (
          <button
            key={type.key}
            onClick={() => { setReportType(type.key); setGenerated(false); }}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              reportType === type.key
                ? 'border-indigo-500 bg-indigo-50/50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
              reportType === type.key ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'
            }`}>
              {type.icon}
            </div>
            <p className={`text-sm font-semibold ${reportType === type.key ? 'text-indigo-700' : 'text-gray-700'}`}>{type.label}</p>
          </button>
        ))}
      </div>

      {/* Date Range & Generate */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">From:</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">To:</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <button onClick={handleGenerate} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
            <BarChart3 size={16} /> Generate Report
          </button>
        </div>
      </div>

      {/* Report Display */}
      {generated && report && currentType && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200/80 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{currentType.label}</h2>
                <p className="text-sm text-gray-500">{startDate} — {endDate} • Generated just now</p>
              </div>
              <span className="text-xs font-mono text-gray-400 bg-gray-50 px-3 py-1 rounded-lg">RPT-{Date.now().toString(36).toUpperCase()}</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {report.summary.map((s, i) => (
                <StatCard key={i} title={s.label} value={s.value} icon={currentType.icon} color={currentType.color} change={s.change} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200/80 p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Detailed Breakdown</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {report.details.map((d, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">{d.label}</p>
                    <p className="text-lg font-bold text-gray-900">{d.value}</p>
                  </div>
                  {d.sub && <p className="text-xs text-gray-400 mt-1">{d.sub}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!generated && (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-16 text-center">
          <BarChart3 size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-1">No Report Generated</h3>
          <p className="text-gray-400">Select a report type and date range, then click Generate.</p>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { CheckCircle, XCircle, Award, Briefcase } from 'lucide-react';
import { StatusBadge, SearchInput } from '@/components/ui';
import { mockTrainerApplications } from '@/data/mockData';
import type { TrainerApplication } from '@/types';

export default function TrainersPage() {
  const [applications, setApplications] = useState<TrainerApplication[]>(mockTrainerApplications);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const filtered = applications.filter(a => {
    const matchesSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' as const, reason: undefined } : a));
    setSuccessMsg('Trainer application approved successfully.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleReject = () => {
    if (!rejectId) return;
    setApplications(prev => prev.map(a => a.id === rejectId ? { ...a, status: 'rejected' as const, reason: rejectReason } : a));
    setRejectId(null);
    setRejectReason('');
    setSuccessMsg('Trainer application rejected.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const pendingCount = applications.filter(a => a.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Trainer Applications</h1>
        <p className="text-gray-500 mt-1">Review and manage trainer registration applications.</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">
          {successMsg}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending', count: pendingCount, color: 'bg-amber-50 text-amber-700 border-amber-200' },
          { label: 'Approved', count: applications.filter(a => a.status === 'approved').length, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
          { label: 'Rejected', count: applications.filter(a => a.status === 'rejected').length, color: 'bg-red-50 text-red-700 border-red-200' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-xl border p-4 text-center`}>
            <p className="text-3xl font-bold">{s.count}</p>
            <p className="text-sm font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="w-72">
            <SearchInput value={search} onChange={setSearch} placeholder="Search trainers..." />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center">
            <p className="text-gray-500">No applications found.</p>
          </div>
        ) : filtered.map(app => (
          <div key={app.id} className="bg-white rounded-2xl border border-gray-200/80 p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
                <span className="text-indigo-600 font-bold text-xl">{app.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
                  <StatusBadge status={app.status} />
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{app.email}</p>
                <div className="flex flex-wrap gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Award size={14} className="text-gray-400" />
                    {app.specialization}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Briefcase size={14} className="text-gray-400" />
                    {app.experience}
                  </div>
                  <div className="text-sm text-gray-400">
                    Applied: {new Date(app.appliedDate).toLocaleDateString()}
                  </div>
                </div>
                {app.reason && (
                  <div className="mt-3 p-3 bg-red-50 rounded-xl">
                    <p className="text-sm text-red-700"><span className="font-medium">Rejection reason:</span> {app.reason}</p>
                  </div>
                )}
              </div>
              {app.status === 'pending' && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(app.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
                  >
                    <CheckCircle size={16} /> Approve
                  </button>
                  <button
                    onClick={() => setRejectId(app.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors border border-red-200"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reject Modal */}
      {rejectId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setRejectId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Application</h3>
            <p className="text-sm text-gray-500 mb-4">Please provide a reason for rejecting this application.</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
              rows={3}
              placeholder="Enter rejection reason..."
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setRejectId(null)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectReason.trim()}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-40"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

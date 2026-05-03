import { useState, useMemo } from 'react';
import { Eye, RefreshCw, Bell, UserPlus } from 'lucide-react';
import { Modal, StatusBadge, SearchInput, Pagination } from '@/components/ui';
import { mockMembers, mockSubscriptionPlans } from '@/data/mockData';
import type { GymMember } from '@/types';

export default function MembersPage() {
  const [members, setMembers] = useState<GymMember[]>(mockMembers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [detailMember, setDetailMember] = useState<GymMember | null>(null);
  const [subModal, setSubModal] = useState<{ open: boolean; member: GymMember | null }>({ open: false, member: null });
  const [notifModal, setNotifModal] = useState<{ open: boolean; memberIds: string[] }>({ open: false, memberIds: [] });
  const [notifForm, setNotifForm] = useState({ title: '', message: '' });
  const [successMsg, setSuccessMsg] = useState('');

  const limit = 8;
  const filtered = useMemo(() => members.filter(m => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || m.subscriptionStatus === statusFilter;
    return matchSearch && matchStatus;
  }), [members, search, statusFilter]);

  const totalPages = Math.ceil(filtered.length / limit);
  const paged = filtered.slice((page - 1) * limit, page * limit);
  const plans = mockSubscriptionPlans.filter(p => p.gymId === 'g1');

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const handleSubAction = (action: string) => {
    if (!subModal.member) return;
    const newStatus = action === 'deactivate' ? 'cancelled' : 'active';
    setMembers(prev => prev.map(m => m.id === subModal.member!.id ? {
      ...m,
      subscriptionStatus: newStatus as GymMember['subscriptionStatus'],
      subscriptionEndDate: action !== 'deactivate' ? '2025-03-01' : m.subscriptionEndDate,
    } : m));
    setSubModal({ open: false, member: null });
    showSuccess(`Subscription ${action}d successfully.`);
  };

  const handleSendNotif = () => {
    setNotifModal({ open: false, memberIds: [] });
    setNotifForm({ title: '', message: '' });
    showSuccess(`Notification sent to ${notifModal.memberIds.length === members.length ? 'all members' : `${notifModal.memberIds.length} member(s)`}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-500 mt-1">Manage gym members and subscriptions.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setNotifModal({ open: true, memberIds: members.map(m => m.id) })} className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">
            <Bell size={16} /> Notify All
          </button>
        </div>
      </div>

      {successMsg && <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">{successMsg}</div>}

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="w-72"><SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search members..." /></div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <span className="text-sm text-gray-500 ml-auto">{filtered.length} members</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200/80">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Member</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Email</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Sub End Date</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map(member => (
                <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center"><span className="text-indigo-600 font-semibold text-sm">{member.name.charAt(0)}</span></div>
                      <span className="font-medium text-gray-900 text-sm">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.email}</td>
                  <td className="px-6 py-4"><StatusBadge status={member.subscriptionStatus} /></td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.subscriptionEndDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setDetailMember(member)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-indigo-600" title="View"><Eye size={16} /></button>
                      <button onClick={() => setSubModal({ open: true, member })} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-emerald-600" title="Manage Subscription"><RefreshCw size={16} /></button>
                      <button onClick={() => { setNotifModal({ open: true, memberIds: [member.id] }); }} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-amber-600" title="Send Notification"><Bell size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 border-t border-gray-100"><Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} /></div>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={!!detailMember} onClose={() => setDetailMember(null)} title="Member Details" size="lg">
        {detailMember && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center"><span className="text-indigo-600 font-bold text-2xl">{detailMember.name.charAt(0)}</span></div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{detailMember.name}</h3>
                <p className="text-gray-500">{detailMember.email}</p>
                <div className="mt-1"><StatusBadge status={detailMember.subscriptionStatus} /></div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Subscriptions</h4>
              {detailMember.subscriptionDetails.length > 0 ? (
                <div className="space-y-2">
                  {detailMember.subscriptionDetails.map(sub => (
                    <div key={sub.subscriptionId} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{sub.planName}</p>
                        <p className="text-xs text-gray-500">{sub.startDate} → {sub.endDate}</p>
                      </div>
                      <StatusBadge status={sub.status} />
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-400">No subscriptions found.</p>}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Attendance Log</h4>
              {detailMember.attendanceLog.length > 0 ? (
                <div className="space-y-2">
                  {detailMember.attendanceLog.map((entry, i) => (
                    <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                      <span className="text-sm text-gray-600">
                        {new Date(entry.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {entry.exitTime && ` → ${new Date(entry.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                      </span>
                      <span className="text-xs text-gray-400">{new Date(entry.entryTime).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-gray-400">No attendance records.</p>}
            </div>
          </div>
        )}
      </Modal>

      {/* Subscription Management Modal */}
      <Modal isOpen={subModal.open} onClose={() => setSubModal({ open: false, member: null })} title="Manage Subscription" size="sm">
        {subModal.member && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Managing subscription for <span className="font-semibold">{subModal.member.name}</span></p>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500">Current Status</p>
              <StatusBadge status={subModal.member.subscriptionStatus} />
              <p className="text-xs text-gray-500 mt-1">End Date: {subModal.member.subscriptionEndDate}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Plan</label>
              <select className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                {plans.map(p => <option key={p.id} value={p.id}>{p.name} — ${p.price} ({p.durationDays} days)</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleSubAction('renew')} className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700">
                <UserPlus size={16} /> Renew
              </button>
              <button onClick={() => handleSubAction('activate')} className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
                Activate
              </button>
              <button onClick={() => handleSubAction('deactivate')} className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 border border-red-200">
                Deactivate
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Notification Modal */}
      <Modal isOpen={notifModal.open} onClose={() => setNotifModal({ open: false, memberIds: [] })} title="Send Notification">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Sending to {notifModal.memberIds.length === members.length ? 'all members' : `${notifModal.memberIds.length} member(s)`}</p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input value={notifForm.title} onChange={e => setNotifForm(f => ({ ...f, title: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Notification title" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea value={notifForm.message} onChange={e => setNotifForm(f => ({ ...f, message: e.target.value }))} rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="Write your message..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setNotifModal({ open: false, memberIds: [] })} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button onClick={handleSendNotif} disabled={!notifForm.title.trim() || !notifForm.message.trim()} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-40">Send</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

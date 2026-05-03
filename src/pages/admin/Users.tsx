import { useState, useMemo } from 'react';
import { Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { Modal, StatusBadge, SearchInput, Pagination } from '@/components/ui';
import { mockUsers, mockUserDetails } from '@/data/mockData';
import type { User, UserDetail } from '@/types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const limit = 8;

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / limit);
  const paged = filtered.slice((page - 1) * limit, page * limit);

  const handleViewDetail = (user: User) => {
    const detail = mockUserDetails[user.id] || {
      ...user,
      personalInfo: {
        gender: user.name.endsWith('a') || user.name.endsWith('e') ? 'Female' : 'Male',
        weightKg: 70 + Math.floor(Math.random() * 20),
        heightCm: 165 + Math.floor(Math.random() * 20),
        age: 22 + Math.floor(Math.random() * 15),
        fitnessLevel: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
        fitnessGoal: ['Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility'][Math.floor(Math.random() * 4)],
        equipment: ['Dumbbells', 'Treadmill', 'Barbell'].slice(0, 1 + Math.floor(Math.random() * 3)),
      },
      activityLog: [
        { type: 'workout', timestamp: '2025-01-14T08:30:00Z', details: 'Completed workout session' },
        { type: 'meal', timestamp: '2025-01-13T12:00:00Z', details: 'Logged daily meals' },
      ],
      subscriptions: user.role === 'trainee' ? [{
        subscriptionId: `sub-${user.id}`,
        type: 'Monthly',
        startDate: '2025-01-01',
        endDate: '2025-02-01',
        status: user.status,
      }] : [],
    };
    setSelectedUser(detail);
    setDetailOpen(true);
  };

  const toggleStatus = (userId: string) => {
    setUsers(prev => prev.map(u =>
      u.id === userId
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500 mt-1">Manage trainees and trainers across the platform.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="w-72">
            <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by name or email..." />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="all">All Roles</option>
            <option value="trainee">Trainee</option>
            <option value="trainer">Trainer</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <span className="text-sm text-gray-500 ml-auto">{filtered.length} users found</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200/80">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">User</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Email</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Role</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map(user => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold text-sm">{user.name.charAt(0)}</span>
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                      user.role === 'trainer' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleViewDetail(user)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-indigo-600 transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        {user.status === 'active'
                          ? <ToggleRight size={18} className="text-emerald-500" />
                          : <ToggleLeft size={18} className="text-gray-400" />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 border-t border-gray-100">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {/* Detail Modal */}
      <Modal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title="User Details" size="lg">
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
                <span className="text-indigo-600 font-bold text-2xl">{selectedUser.name.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                <p className="text-gray-500">{selectedUser.email}</p>
                <div className="flex gap-2 mt-1">
                  <StatusBadge status={selectedUser.status} />
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                    selectedUser.role === 'trainer' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>
            </div>

            {selectedUser.personalInfo && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Personal Information</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Gender', value: selectedUser.personalInfo.gender },
                    { label: 'Age', value: `${selectedUser.personalInfo.age} yrs` },
                    { label: 'Weight', value: `${selectedUser.personalInfo.weightKg} kg` },
                    { label: 'Height', value: `${selectedUser.personalInfo.heightCm} cm` },
                    { label: 'Level', value: selectedUser.personalInfo.fitnessLevel },
                    { label: 'Goal', value: selectedUser.personalInfo.fitnessGoal },
                  ].map(item => (
                    <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="text-sm font-medium text-gray-900 mt-0.5">{item.value}</p>
                    </div>
                  ))}
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500">Equipment</p>
                    <p className="text-sm font-medium text-gray-900 mt-0.5">{selectedUser.personalInfo.equipment.join(', ')}</p>
                  </div>
                </div>
              </div>
            )}

            {selectedUser.subscriptions.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Subscriptions</h4>
                <div className="space-y-2">
                  {selectedUser.subscriptions.map(sub => (
                    <div key={sub.subscriptionId} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{sub.type}</p>
                        <p className="text-xs text-gray-500">{sub.startDate} → {sub.endDate}</p>
                      </div>
                      <StatusBadge status={sub.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedUser.activityLog.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  {selectedUser.activityLog.map((log, i) => (
                    <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        log.type === 'workout' ? 'bg-blue-500' : 'bg-emerald-500'
                      }`} />
                      <div>
                        <p className="text-sm text-gray-900">{log.details}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(log.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

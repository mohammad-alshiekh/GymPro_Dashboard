import { useState } from 'react';
import { Plus, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Modal, StatusBadge, SearchInput, Pagination } from '@/components/ui';
import { mockGyms, mockGymApplications } from '@/data/mockData';
import type { Gym, GymApplication } from '@/types';

const defaultHours = {
  monday: '5:00 AM - 11:00 PM', tuesday: '5:00 AM - 11:00 PM', wednesday: '5:00 AM - 11:00 PM',
  thursday: '5:00 AM - 11:00 PM', friday: '5:00 AM - 10:00 PM', saturday: '6:00 AM - 9:00 PM', sunday: '7:00 AM - 8:00 PM',
};

export default function GymsPage() {
  const [gyms, setGyms] = useState<Gym[]>(mockGyms);
  const [applications, setApplications] = useState<GymApplication[]>(mockGymApplications);
  const [tab, setTab] = useState<'gyms' | 'applications'>('gyms');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [successMsg, setSuccessMsg] = useState('');

  // Gym form modal
  const [gymModal, setGymModal] = useState<{ open: boolean; mode: 'add' | 'edit'; gym?: Gym }>({ open: false, mode: 'add' });
  const [form, setForm] = useState({ name: '', location: '', services: '', contactEmail: '', contactPhone: '', hours: { ...defaultHours } });

  // Delete modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Reject application modal
  const [rejectApp, setRejectApp] = useState<{ id: string; reason: string } | null>(null);

  const limit = 6;
  const filteredGyms = gyms.filter(g =>
    !search || g.name.toLowerCase().includes(search.toLowerCase()) || g.location.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredGyms.length / limit);
  const pagedGyms = filteredGyms.slice((page - 1) * limit, page * limit);

  const openAdd = () => {
    setForm({ name: '', location: '', services: '', contactEmail: '', contactPhone: '', hours: { ...defaultHours } });
    setGymModal({ open: true, mode: 'add' });
  };

  const openEdit = (gym: Gym) => {
    setForm({
      name: gym.name, location: gym.location, services: gym.services.join(', '),
      contactEmail: gym.contactEmail, contactPhone: gym.contactPhone, hours: { ...gym.operatingHours },
    });
    setGymModal({ open: true, mode: 'edit', gym });
  };

  const handleSaveGym = () => {
    const services = form.services.split(',').map(s => s.trim()).filter(Boolean);
    if (gymModal.mode === 'add') {
      const newGym: Gym = {
        id: `g${Date.now()}`, name: form.name, location: form.location, services,
        operatingHours: form.hours, images: [], contactEmail: form.contactEmail,
        contactPhone: form.contactPhone, status: 'active', memberCount: 0,
      };
      setGyms(prev => [...prev, newGym]);
      setSuccessMsg('Gym added successfully.');
    } else if (gymModal.gym) {
      setGyms(prev => prev.map(g => g.id === gymModal.gym!.id ? {
        ...g, name: form.name, location: form.location, services,
        operatingHours: form.hours, contactEmail: form.contactEmail, contactPhone: form.contactPhone,
      } : g));
      setSuccessMsg('Gym updated successfully.');
    }
    setGymModal({ open: false, mode: 'add' });
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleDelete = () => {
    if (deleteId) {
      setGyms(prev => prev.filter(g => g.id !== deleteId));
      setDeleteId(null);
      setSuccessMsg('Gym deleted successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleApproveApp = (id: string) => {
    const app = applications.find(a => a.id === id);
    if (app) {
      const newGym: Gym = {
        id: `g${Date.now()}`, name: app.gymName, location: app.location, services: [],
        operatingHours: { ...defaultHours }, images: [], contactEmail: app.email,
        contactPhone: '', status: 'active', memberCount: 0,
      };
      setGyms(prev => [...prev, newGym]);
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' as const } : a));
      setSuccessMsg('Gym application approved and gym added.');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleRejectApp = () => {
    if (!rejectApp) return;
    setApplications(prev => prev.map(a => a.id === rejectApp.id ? { ...a, status: 'rejected' as const, reason: rejectApp.reason } : a));
    setRejectApp(null);
    setSuccessMsg('Gym application rejected.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gym Management</h1>
          <p className="text-gray-500 mt-1">Manage gyms and review applications.</p>
        </div>
        {tab === 'gyms' && (
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Plus size={16} /> Add Gym
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">{successMsg}</div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button onClick={() => setTab('gyms')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'gyms' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
          Gyms ({gyms.length})
        </button>
        <button onClick={() => setTab('applications')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'applications' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}>
          Applications ({applications.filter(a => a.status === 'pending').length} pending)
        </button>
      </div>

      {tab === 'gyms' && (
        <>
          <div className="bg-white rounded-2xl border border-gray-200/80 p-4">
            <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search gyms..." />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {pagedGyms.map(gym => (
              <div key={gym.id} className="bg-white rounded-2xl border border-gray-200/80 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{gym.name}</h3>
                      <StatusBadge status={gym.status} />
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">{gym.location}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(gym)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors"><Pencil size={16} /></button>
                    <button onClick={() => setDeleteId(gym.id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {gym.services.slice(0, 4).map(s => (
                    <span key={s} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium">{s}</span>
                  ))}
                  {gym.services.length > 4 && <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs">+{gym.services.length - 4}</span>}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                  <span>{gym.memberCount} members</span>
                  <span>{gym.contactEmail}</span>
                </div>
              </div>
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {tab === 'applications' && (
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center text-gray-500">No applications found.</div>
          ) : applications.map(app => (
            <div key={app.id} className="bg-white rounded-2xl border border-gray-200/80 p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center shrink-0">
                  <span className="text-blue-600 font-bold text-xl">{app.gymName.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-gray-900">{app.gymName}</h3>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="text-sm text-gray-500">Owner: {app.ownerName} • {app.email}</p>
                  <p className="text-sm text-gray-500">{app.location}</p>
                  <p className="text-xs text-gray-400 mt-1">Applied: {new Date(app.appliedDate).toLocaleDateString()}</p>
                  {app.reason && (
                    <div className="mt-2 p-3 bg-red-50 rounded-xl">
                      <p className="text-sm text-red-700"><span className="font-medium">Rejection reason:</span> {app.reason}</p>
                    </div>
                  )}
                </div>
                {app.status === 'pending' && (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleApproveApp(app.id)} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700"><CheckCircle size={16} /> Approve</button>
                    <button onClick={() => setRejectApp({ id: app.id, reason: '' })} className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 border border-red-200"><XCircle size={16} /> Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Gym Modal */}
      <Modal isOpen={gymModal.open} onClose={() => setGymModal({ open: false, mode: 'add' })} title={gymModal.mode === 'add' ? 'Add New Gym' : 'Edit Gym'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gym Name</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Services (comma-separated)</label>
            <input value={form.services} onChange={e => setForm(f => ({ ...f, services: e.target.value }))} placeholder="Weight Training, Cardio, Pool" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input value={form.contactEmail} onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
              <input value={form.contactPhone} onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Operating Hours</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {days.map(day => (
                <div key={day} className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-500 w-20 capitalize">{day}</span>
                  <input value={form.hours[day]} onChange={e => setForm(f => ({ ...f, hours: { ...f.hours, [day]: e.target.value } }))} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => setGymModal({ open: false, mode: 'add' })} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button onClick={handleSaveGym} disabled={!form.name.trim()} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-40">
              {gymModal.mode === 'add' ? 'Add Gym' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Gym" size="sm">
        <p className="text-gray-600 mb-6">Are you sure you want to delete this gym? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700">Delete</button>
        </div>
      </Modal>

      {/* Reject Application Modal */}
      {rejectApp && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setRejectApp(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Gym Application</h3>
            <textarea value={rejectApp.reason} onChange={e => setRejectApp({ ...rejectApp, reason: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" rows={3} placeholder="Enter rejection reason..." />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setRejectApp(null)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleRejectApp} disabled={!rejectApp.reason.trim()} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-40">Confirm Reject</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Users, UserCheck, ScanLine, DollarSign, Plus, Pencil, Trash2, Tag } from 'lucide-react';
import { StatCard, Modal } from '@/components/ui';
import { mockMembers, mockAttendanceRecords, mockTransactions, mockGyms, mockOffers } from '@/data/mockData';
import type { Offer } from '@/types';

export default function GymDashboard() {
  const gym = mockGyms[0]; // FitZone Downtown
  const gymMembers = mockMembers;
  const activeMembers = gymMembers.filter(m => m.subscriptionStatus === 'active').length;
  const todayAttendance = mockAttendanceRecords.filter(a => a.entryTime.startsWith('2025-01-14')).length;
  const gymRevenue = mockTransactions.filter(t => t.gymId === 'g1' && t.status === 'completed' && t.type !== 'refund').reduce((s, t) => s + t.amount, 0);

  // Offers
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [offerModal, setOfferModal] = useState<{ open: boolean; mode: 'add' | 'edit'; offer?: Offer }>({ open: false, mode: 'add' });
  const [offerForm, setOfferForm] = useState({ title: '', description: '', discountPercentage: 0, startDate: '', endDate: '' });
  const [deleteOfferId, setDeleteOfferId] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const openAddOffer = () => {
    setOfferForm({ title: '', description: '', discountPercentage: 0, startDate: '', endDate: '' });
    setOfferModal({ open: true, mode: 'add' });
  };

  const openEditOffer = (offer: Offer) => {
    setOfferForm({ title: offer.title, description: offer.description, discountPercentage: offer.discountPercentage, startDate: offer.startDate, endDate: offer.endDate });
    setOfferModal({ open: true, mode: 'edit', offer });
  };

  const handleSaveOffer = () => {
    if (offerModal.mode === 'add') {
      setOffers(prev => [...prev, { id: `of${Date.now()}`, ...offerForm }]);
      showSuccess('Offer added successfully.');
    } else if (offerModal.offer) {
      setOffers(prev => prev.map(o => o.id === offerModal.offer!.id ? { ...o, ...offerForm } : o));
      showSuccess('Offer updated successfully.');
    }
    setOfferModal({ open: false, mode: 'add' });
  };

  const handleDeleteOffer = () => {
    if (deleteOfferId) { setOffers(prev => prev.filter(o => o.id !== deleteOfferId)); setDeleteOfferId(null); showSuccess('Offer deleted.'); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{gym.name} Dashboard</h1>
        <p className="text-gray-500 mt-1">{gym.location}</p>
      </div>

      {successMsg && <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">{successMsg}</div>}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Members" value={gymMembers.length} icon={<Users size={22} />} color="indigo" change={`${activeMembers} active`} />
        <StatCard title="Active Subscriptions" value={activeMembers} icon={<UserCheck size={22} />} color="emerald" change={`${Math.round(activeMembers / gymMembers.length * 100)}% of members`} />
        <StatCard title="Today's Attendance" value={todayAttendance} icon={<ScanLine size={22} />} color="blue" change="Check-ins today" />
        <StatCard title="Total Revenue" value={`$${gymRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`} icon={<DollarSign size={22} />} color="purple" change="All time" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gym Info */}
        <div className="bg-white rounded-2xl border border-gray-200/80">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Gym Profile</h2>
            <button onClick={() => setProfileOpen(true)} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              <Pencil size={14} /> Edit
            </button>
          </div>
          <div className="p-5 space-y-3">
            <div><p className="text-xs text-gray-500">Name</p><p className="text-sm font-medium text-gray-900">{gym.name}</p></div>
            <div><p className="text-xs text-gray-500">Location</p><p className="text-sm font-medium text-gray-900">{gym.location}</p></div>
            <div><p className="text-xs text-gray-500">Contact</p><p className="text-sm text-gray-900">{gym.contactEmail}</p><p className="text-sm text-gray-600">{gym.contactPhone}</p></div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Services</p>
              <div className="flex flex-wrap gap-1">
                {gym.services.map(s => <span key={s} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-xs font-medium">{s}</span>)}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Hours</p>
              <div className="space-y-0.5">
                {Object.entries(gym.operatingHours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between text-xs"><span className="text-gray-500 capitalize">{day}</span><span className="text-gray-700">{hours}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Offers */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Tag size={18} className="text-amber-500" /> Promotional Offers</h2>
            <button onClick={openAddOffer} className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              <Plus size={14} /> Add Offer
            </button>
          </div>
          <div className="p-4 space-y-3">
            {offers.map(offer => (
              <div key={offer.id} className="flex items-start gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-amber-700 font-bold text-sm">-{offer.discountPercentage}%</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900">{offer.title}</h4>
                  <p className="text-sm text-gray-600 mt-0.5">{offer.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{offer.startDate} → {offer.endDate}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => openEditOffer(offer)} className="p-1.5 rounded-lg hover:bg-amber-100 text-amber-600"><Pencil size={14} /></button>
                  <button onClick={() => setDeleteOfferId(offer.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="bg-white rounded-2xl border border-gray-200/80">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Attendance</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {mockAttendanceRecords.slice(0, 6).map(rec => (
            <div key={rec.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-sm font-bold">{rec.memberName.charAt(0)}</div>
                <span className="text-sm font-medium text-gray-900">{rec.memberName}</span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  {new Date(rec.entryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {rec.exitTime && ` → ${new Date(rec.exitTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                </p>
                <p className="text-xs text-gray-400">{new Date(rec.entryTime).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Modal (read-only preview) */}
      <Modal isOpen={profileOpen} onClose={() => setProfileOpen(false)} title="Edit Gym Profile" size="lg">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Gym profile editing is available. Update your gym's public information below.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Gym Name</label><input defaultValue={gym.name} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label><input defaultValue={gym.location} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label><input defaultValue={gym.contactEmail} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label><input defaultValue={gym.contactPhone} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => setProfileOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button onClick={() => { setProfileOpen(false); showSuccess('Profile updated successfully.'); }} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">Save Changes</button>
          </div>
        </div>
      </Modal>

      {/* Offer Modal */}
      <Modal isOpen={offerModal.open} onClose={() => setOfferModal({ open: false, mode: 'add' })} title={offerModal.mode === 'add' ? 'Add Offer' : 'Edit Offer'}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input value={offerForm.title} onChange={e => setOfferForm(f => ({ ...f, title: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea value={offerForm.description} onChange={e => setOfferForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" /></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label><input type="number" value={offerForm.discountPercentage} onChange={e => setOfferForm(f => ({ ...f, discountPercentage: Number(e.target.value) }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label><input type="date" value={offerForm.startDate} onChange={e => setOfferForm(f => ({ ...f, startDate: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">End Date</label><input type="date" value={offerForm.endDate} onChange={e => setOfferForm(f => ({ ...f, endDate: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => setOfferModal({ open: false, mode: 'add' })} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button onClick={handleSaveOffer} disabled={!offerForm.title.trim()} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-40">{offerModal.mode === 'add' ? 'Add Offer' : 'Save'}</button>
          </div>
        </div>
      </Modal>

      {/* Delete Offer Modal */}
      <Modal isOpen={!!deleteOfferId} onClose={() => setDeleteOfferId(null)} title="Delete Offer" size="sm">
        <p className="text-gray-600 mb-6">Are you sure you want to delete this offer?</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteOfferId(null)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button onClick={handleDeleteOffer} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700">Delete</button>
        </div>
      </Modal>
    </div>
  );
}

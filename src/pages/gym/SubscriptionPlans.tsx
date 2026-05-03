import { useState } from 'react';
import { Plus, Pencil, Trash2, Crown, Clock, Check } from 'lucide-react';
import { Modal } from '@/components/ui';
import { mockSubscriptionPlans } from '@/data/mockData';
import type { SubscriptionPlan } from '@/types';

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(mockSubscriptionPlans.filter(p => p.gymId === 'g1'));
  const [planModal, setPlanModal] = useState<{ open: boolean; mode: 'add' | 'edit'; plan?: SubscriptionPlan }>({ open: false, mode: 'add' });
  const [form, setForm] = useState({ name: '', durationDays: 30, price: 0, features: '' });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const openAdd = () => {
    setForm({ name: '', durationDays: 30, price: 0, features: '' });
    setPlanModal({ open: true, mode: 'add' });
  };

  const openEdit = (plan: SubscriptionPlan) => {
    setForm({ name: plan.name, durationDays: plan.durationDays, price: plan.price, features: plan.features.join(', ') });
    setPlanModal({ open: true, mode: 'edit', plan });
  };

  const handleSave = () => {
    const features = form.features.split(',').map(f => f.trim()).filter(Boolean);
    if (planModal.mode === 'add') {
      const newPlan: SubscriptionPlan = { id: `sp${Date.now()}`, gymId: 'g1', name: form.name, durationDays: form.durationDays, price: form.price, features };
      setPlans(prev => [...prev, newPlan]);
      showSuccess('Subscription plan created.');
    } else if (planModal.plan) {
      setPlans(prev => prev.map(p => p.id === planModal.plan!.id ? { ...p, name: form.name, durationDays: form.durationDays, price: form.price, features } : p));
      showSuccess('Subscription plan updated.');
    }
    setPlanModal({ open: false, mode: 'add' });
  };

  const handleDelete = () => {
    if (deleteId) { setPlans(prev => prev.filter(p => p.id !== deleteId)); setDeleteId(null); showSuccess('Plan deleted.'); }
  };

  const planColors = ['from-indigo-500 to-indigo-600', 'from-blue-500 to-blue-600', 'from-purple-500 to-purple-600', 'from-emerald-500 to-emerald-600'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscription Plans</h1>
          <p className="text-gray-500 mt-1">Create and manage subscription plans for your gym.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
          <Plus size={16} /> Add Plan
        </button>
      </div>

      {successMsg && <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">{successMsg}</div>}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.map((plan, i) => (
          <div key={plan.id} className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden hover:shadow-lg transition-shadow group">
            <div className={`bg-gradient-to-r ${planColors[i % planColors.length]} p-5 text-white`}>
              <div className="flex items-center justify-between">
                <Crown size={20} className="opacity-80" />
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(plan)} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30"><Pencil size={14} /></button>
                  <button onClick={() => setDeleteId(plan.id)} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30"><Trash2 size={14} /></button>
                </div>
              </div>
              <h3 className="text-lg font-bold mt-3">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-sm opacity-80">/plan</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-sm opacity-80">
                <Clock size={14} />
                {plan.durationDays} days
              </div>
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Features</p>
              <ul className="space-y-2">
                {plan.features.map(feature => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {plans.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200/80 p-16 text-center">
          <Crown size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">No Plans Yet</h3>
          <p className="text-gray-400 mt-1">Create your first subscription plan.</p>
        </div>
      )}

      {/* Plan Modal */}
      <Modal isOpen={planModal.open} onClose={() => setPlanModal({ open: false, mode: 'add' })} title={planModal.mode === 'add' ? 'Create Plan' : 'Edit Plan'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g., Monthly, Annual, VIP" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
              <input type="number" value={form.durationDays} onChange={e => setForm(f => ({ ...f, durationDays: Number(e.target.value) }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
            <textarea value={form.features} onChange={e => setForm(f => ({ ...f, features: e.target.value }))} rows={3} placeholder="Gym Access, Group Classes, Pool" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => setPlanModal({ open: false, mode: 'add' })} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button onClick={handleSave} disabled={!form.name.trim()} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-40">
              {planModal.mode === 'add' ? 'Create Plan' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Plan" size="sm">
        <p className="text-gray-600 mb-6">Are you sure you want to delete this plan? Members on this plan won't be affected immediately.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700">Delete</button>
        </div>
      </Modal>
    </div>
  );
}

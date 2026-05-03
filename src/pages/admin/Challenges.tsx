import { useState } from 'react';
import { Plus, Pencil, Trash2, Zap, Award } from 'lucide-react';
import { Modal } from '@/components/ui';
import { mockChallenges, mockPointRules, mockLevelThresholds } from '@/data/mockData';
import type { Challenge, PointRule, LevelThreshold } from '@/types';

export default function ChallengesPage() {
  const [tab, setTab] = useState<'challenges' | 'gamification'>('challenges');
  const [challenges, setChallenges] = useState<Challenge[]>(mockChallenges);
  const [pointRules, setPointRules] = useState<PointRule[]>(mockPointRules);
  const [levelThresholds, setLevelThresholds] = useState<LevelThreshold[]>(mockLevelThresholds);
  const [successMsg, setSuccessMsg] = useState('');

  // Challenge form
  const [challengeModal, setChallengeModal] = useState<{ open: boolean; mode: 'add' | 'edit'; challenge?: Challenge }>({ open: false, mode: 'add' });
  const [cForm, setCForm] = useState({ name: '', description: '', type: 'training' as Challenge['type'], startDate: '', endDate: '', points: 0, badges: '' });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Gamification editing
  const [editingRule, setEditingRule] = useState<number | null>(null);
  const [editingLevel, setEditingLevel] = useState<number | null>(null);

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  const openAddChallenge = () => {
    setCForm({ name: '', description: '', type: 'training', startDate: '', endDate: '', points: 0, badges: '' });
    setChallengeModal({ open: true, mode: 'add' });
  };

  const openEditChallenge = (c: Challenge) => {
    setCForm({
      name: c.name, description: c.description, type: c.type, startDate: c.startDate, endDate: c.endDate,
      points: c.rewards.points, badges: c.rewards.badges.join(', '),
    });
    setChallengeModal({ open: true, mode: 'edit', challenge: c });
  };

  const handleSaveChallenge = () => {
    const rewards = { points: cForm.points, badges: cForm.badges.split(',').map(b => b.trim()).filter(Boolean) };
    if (challengeModal.mode === 'add') {
      const newChallenge: Challenge = {
        id: `ch${Date.now()}`, name: cForm.name, description: cForm.description, type: cForm.type,
        startDate: cForm.startDate, endDate: cForm.endDate, rewards, participantCount: 0,
      };
      setChallenges(prev => [...prev, newChallenge]);
      showSuccess('Challenge created successfully.');
    } else if (challengeModal.challenge) {
      setChallenges(prev => prev.map(c => c.id === challengeModal.challenge!.id ? { ...c, name: cForm.name, description: cForm.description, type: cForm.type, startDate: cForm.startDate, endDate: cForm.endDate, rewards } : c));
      showSuccess('Challenge updated successfully.');
    }
    setChallengeModal({ open: false, mode: 'add' });
  };

  const handleDeleteChallenge = () => {
    if (deleteId) { setChallenges(prev => prev.filter(c => c.id !== deleteId)); setDeleteId(null); showSuccess('Challenge deleted.'); }
  };

  const typeColors: Record<string, string> = { training: 'bg-blue-50 text-blue-700', calorieBurn: 'bg-orange-50 text-orange-700', commitment: 'bg-purple-50 text-purple-700' };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Challenges & Gamification</h1>
        <p className="text-gray-500 mt-1">Create challenges and configure gamification rules.</p>
      </div>

      {successMsg && <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">{successMsg}</div>}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button onClick={() => setTab('challenges')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'challenges' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}>
          Challenges ({challenges.length})
        </button>
        <button onClick={() => setTab('gamification')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'gamification' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}>
          Gamification Rules
        </button>
      </div>

      {tab === 'challenges' && (
        <>
          <div className="flex justify-end">
            <button onClick={openAddChallenge} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">
              <Plus size={16} /> Create Challenge
            </button>
          </div>
          <div className="space-y-4">
            {challenges.map(c => (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-200/80 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{c.name}</h3>
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-medium ${typeColors[c.type]}`}>{c.type}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{c.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="text-gray-500">{c.startDate} → {c.endDate}</span>
                      <span className="text-gray-500">{c.participantCount} participants</span>
                      <span className="text-amber-600 font-medium flex items-center gap-1"><Zap size={14} /> {c.rewards.points} pts</span>
                      {c.rewards.badges.length > 0 && (
                        <span className="text-indigo-600 font-medium flex items-center gap-1"><Award size={14} /> {c.rewards.badges.join(', ')}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0 ml-4">
                    <button onClick={() => openEditChallenge(c)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600"><Pencil size={16} /></button>
                    <button onClick={() => setDeleteId(c.id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'gamification' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Point Rules */}
          <div className="bg-white rounded-2xl border border-gray-200/80">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Zap size={18} className="text-amber-500" /> Point Rules</h2>
            </div>
            <div className="p-4 space-y-2">
              {pointRules.map((rule, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  {editingRule === i ? (
                    <>
                      <input value={rule.activity} onChange={e => setPointRules(prev => prev.map((r, j) => j === i ? { ...r, activity: e.target.value } : r))} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                      <input type="number" value={rule.pointsAwarded} onChange={e => setPointRules(prev => prev.map((r, j) => j === i ? { ...r, pointsAwarded: Number(e.target.value) } : r))} className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                      <button onClick={() => { setEditingRule(null); showSuccess('Point rules updated.'); }} className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm">Save</button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm text-gray-900">{rule.activity}</span>
                      <span className="text-sm font-semibold text-amber-600">{rule.pointsAwarded} pts</span>
                      <button onClick={() => setEditingRule(i)} className="p-1 rounded hover:bg-gray-200 text-gray-400"><Pencil size={14} /></button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Level Thresholds */}
          <div className="bg-white rounded-2xl border border-gray-200/80">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2"><Award size={18} className="text-indigo-500" /> Level Thresholds</h2>
            </div>
            <div className="p-4 space-y-2">
              {levelThresholds.map((lt, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  {editingLevel === i ? (
                    <>
                      <span className="w-8 text-sm font-bold text-indigo-600">Lvl {lt.level}</span>
                      <input value={lt.title} onChange={e => setLevelThresholds(prev => prev.map((l, j) => j === i ? { ...l, title: e.target.value } : l))} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                      <input type="number" value={lt.minPoints} onChange={e => setLevelThresholds(prev => prev.map((l, j) => j === i ? { ...l, minPoints: Number(e.target.value) } : l))} className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500" />
                      <button onClick={() => { setEditingLevel(null); showSuccess('Level thresholds updated.'); }} className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm">Save</button>
                    </>
                  ) : (
                    <>
                      <span className="w-8 text-sm font-bold text-indigo-600">Lvl {lt.level}</span>
                      <span className="flex-1 text-sm text-gray-900">{lt.title}</span>
                      <span className="text-sm text-gray-500">{lt.minPoints}+ pts</span>
                      <button onClick={() => setEditingLevel(i)} className="p-1 rounded hover:bg-gray-200 text-gray-400"><Pencil size={14} /></button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Challenge Modal */}
      <Modal isOpen={challengeModal.open} onClose={() => setChallengeModal({ open: false, mode: 'add' })} title={challengeModal.mode === 'add' ? 'Create Challenge' : 'Edit Challenge'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Challenge Name</label>
            <input value={cForm.name} onChange={e => setCForm(f => ({ ...f, name: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={cForm.description} onChange={e => setCForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={cForm.type} onChange={e => setCForm(f => ({ ...f, type: e.target.value as Challenge['type'] }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="training">Training</option>
                <option value="calorieBurn">Calorie Burn</option>
                <option value="commitment">Commitment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="date" value={cForm.startDate} onChange={e => setCForm(f => ({ ...f, startDate: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="date" value={cForm.endDate} onChange={e => setCForm(f => ({ ...f, endDate: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reward Points</label>
              <input type="number" value={cForm.points} onChange={e => setCForm(f => ({ ...f, points: Number(e.target.value) }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Badges (comma-separated)</label>
              <input value={cForm.badges} onChange={e => setCForm(f => ({ ...f, badges: e.target.value }))} placeholder="Champion, Warrior" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => setChallengeModal({ open: false, mode: 'add' })} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button onClick={handleSaveChallenge} disabled={!cForm.name.trim()} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-40">
              {challengeModal.mode === 'add' ? 'Create Challenge' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Challenge" size="sm">
        <p className="text-gray-600 mb-6">Are you sure you want to delete this challenge?</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button onClick={handleDeleteChallenge} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700">Delete</button>
        </div>
      </Modal>
    </div>
  );
}

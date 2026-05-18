import { useState, useMemo } from 'react';
import {
  Plus, Pencil, Trash2, Eye, CalendarDays, ChevronDown, ChevronUp,
  GripVertical, Copy, Dumbbell,
} from 'lucide-react';
import { Modal, SearchInput, Pagination } from '@/components/ui';
import { mockWorkoutPlans, mockExercises } from '@/data/mockData';
import type { WorkoutPlan, WorkoutDay, WorkoutExercise } from '@/types';

const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const allDays = dayOrder;
const levels = ['beginner', 'intermediate', 'advanced'] as const;

const levelColors: Record<string, string> = {
  beginner: 'bg-green-50 text-green-700',
  intermediate: 'bg-amber-50 text-amber-700',
  advanced: 'bg-red-50 text-red-700',
};

const statusColors: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  draft: 'bg-gray-50 text-gray-600 ring-gray-200',
  archived: 'bg-slate-50 text-slate-500 ring-slate-200',
};

export default function WorkoutPlansPage() {
  const [plans, setPlans] = useState<WorkoutPlan[]>(mockWorkoutPlans);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const limit = 6;

  // View detail — derive from plans so edits always reflect
  const [viewPlanId, setViewPlanId] = useState<string | null>(null);
  const viewPlan = viewPlanId ? plans.find(p => p.id === viewPlanId) ?? null : null;
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  // Plan CRUD
  const [planModal, setPlanModal] = useState<{ open: boolean; mode: 'add' | 'edit'; plan?: WorkoutPlan }>({ open: false, mode: 'add' });
  const [planForm, setPlanForm] = useState({ name: '', description: '', level: 'beginner' as WorkoutPlan['level'], goal: '', daysPerWeek: 3, status: 'draft' as WorkoutPlan['status'] });
  const [deletePlanId, setDeletePlanId] = useState<string | null>(null);

  // Day CRUD
  const [dayModal, setDayModal] = useState<{ open: boolean; planId: string; mode: 'add' | 'edit'; day?: WorkoutDay }>({ open: false, planId: '', mode: 'add' });
  const [dayForm, setDayForm] = useState({ day: 'Monday', focus: '' });
  const [deleteDayId, setDeleteDayId] = useState<{ planId: string; dayId: string } | null>(null);

  // Exercise CRUD
  const [exModal, setExModal] = useState<{ open: boolean; planId: string; dayId: string; mode: 'add' | 'edit'; exercise?: WorkoutExercise }>({ open: false, planId: '', dayId: '', mode: 'add' });
  const [exForm, setExForm] = useState({ name: '', sets: '3', reps: '10-12', rest: '60s' });
  const [deleteExId, setDeleteExId] = useState<{ planId: string; dayId: string; exerciseId: string } | null>(null);

  const [successMsg, setSuccessMsg] = useState('');
  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  // Filter
  const filtered = useMemo(() => plans.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()) || p.goal.toLowerCase().includes(search.toLowerCase());
    const matchLevel = levelFilter === 'all' || p.level === levelFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchLevel && matchStatus;
  }), [plans, search, levelFilter, statusFilter]);

  const totalPages = Math.ceil(filtered.length / limit);
  const paged = filtered.slice((page - 1) * limit, page * limit);

  // Plan helpers
  const openAddPlan = () => {
    setPlanForm({ name: '', description: '', level: 'beginner', goal: '', daysPerWeek: 3, status: 'draft' });
    setPlanModal({ open: true, mode: 'add' });
  };
  const openEditPlan = (p: WorkoutPlan) => {
    setPlanForm({ name: p.name, description: p.description, level: p.level, goal: p.goal, daysPerWeek: p.daysPerWeek, status: p.status });
    setPlanModal({ open: true, mode: 'edit', plan: p });
  };
  const savePlan = () => {
    if (planModal.mode === 'add') {
      const np: WorkoutPlan = { id: `wp${Date.now()}`, ...planForm, days: [], createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0] };
      setPlans(prev => [...prev, np]);
      showSuccess('Workout plan created.');
    } else if (planModal.plan) {
      setPlans(prev => prev.map(p => p.id === planModal.plan!.id ? { ...p, ...planForm, updatedAt: new Date().toISOString().split('T')[0] } : p));
      showSuccess('Workout plan updated.');
    }
    setPlanModal({ open: false, mode: 'add' });
  };
  const deletePlan = () => {
    if (deletePlanId) { setPlans(prev => prev.filter(p => p.id !== deletePlanId)); setDeletePlanId(null); if (viewPlanId === deletePlanId) setViewPlanId(null); showSuccess('Plan deleted.'); }
  };

  // Day helpers
  const openAddDay = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    const usedDays = new Set(plan?.days.map(d => d.day));
    const nextDay = allDays.find(d => !usedDays.has(d)) || 'Monday';
    setDayForm({ day: nextDay, focus: '' });
    setDayModal({ open: true, planId, mode: 'add' });
  };
  const openEditDay = (planId: string, day: WorkoutDay) => {
    setDayForm({ day: day.day, focus: day.focus });
    setDayModal({ open: true, planId, mode: 'edit', day });
  };
  const saveDay = () => {
    const plan = plans.find(p => p.id === dayModal.planId);
    if (!plan) return;
    const newDay: WorkoutDay = { id: dayModal.mode === 'edit' && dayModal.day ? dayModal.day.id : `wd${Date.now()}`, day: dayForm.day, focus: dayForm.focus, exercises: dayModal.mode === 'edit' && dayModal.day ? dayModal.day.exercises : [] };
    if (dayModal.mode === 'add') {
      const newDays = [...plan.days, newDay].sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
      setPlans(prev => prev.map(p => p.id === dayModal.planId ? { ...p, days: newDays, daysPerWeek: newDays.length, updatedAt: new Date().toISOString().split('T')[0] } : p));
      showSuccess('Day added to plan.');
    } else {
      const newDays = plan.days.map(d => d.id === newDay.id ? newDay : d).sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
      setPlans(prev => prev.map(p => p.id === dayModal.planId ? { ...p, days: newDays, updatedAt: new Date().toISOString().split('T')[0] } : p));
      showSuccess('Day updated.');
    }
    setDayModal({ open: false, planId: '', mode: 'add' });
  };
  const confirmDeleteDay = () => {
    if (!deleteDayId) return;
    setPlans(prev => prev.map(p => {
      if (p.id !== deleteDayId.planId) return p;
      const newDays = p.days.filter(d => d.id !== deleteDayId.dayId);
      return { ...p, days: newDays, daysPerWeek: newDays.length, updatedAt: new Date().toISOString().split('T')[0] };
    }));
    setDeleteDayId(null);
    showSuccess('Day removed.');
  };

  // Exercise helpers
  const openAddEx = (planId: string, dayId: string) => {
    setExForm({ name: '', sets: '3', reps: '10-12', rest: '60s' });
    setExModal({ open: true, planId, dayId, mode: 'add' });
  };
  const openEditEx = (planId: string, dayId: string, ex: WorkoutExercise) => {
    setExForm({ name: ex.name, sets: ex.sets, reps: ex.reps, rest: ex.rest });
    setExModal({ open: true, planId, dayId, mode: 'edit', exercise: ex });
  };
  const saveEx = () => {
    const newEx: WorkoutExercise = { id: exModal.mode === 'edit' && exModal.exercise ? exModal.exercise.id : `we${Date.now()}`, name: exForm.name, sets: exForm.sets, reps: exForm.reps, rest: exForm.rest };
    setPlans(prev => prev.map(p => {
      if (p.id !== exModal.planId) return p;
      return { ...p, days: p.days.map(d => {
        if (d.id !== exModal.dayId) return d;
        if (exModal.mode === 'add') return { ...d, exercises: [...d.exercises, newEx] };
        return { ...d, exercises: d.exercises.map(e => e.id === newEx.id ? newEx : e) };
      }), updatedAt: new Date().toISOString().split('T')[0] };
    }));
    showSuccess(exModal.mode === 'add' ? 'Exercise added.' : 'Exercise updated.');
    setExModal({ open: false, planId: '', dayId: '', mode: 'add' });
  };
  const confirmDeleteEx = () => {
    if (!deleteExId) return;
    setPlans(prev => prev.map(p => {
      if (p.id !== deleteExId.planId) return p;
      return { ...p, days: p.days.map(d => {
        if (d.id !== deleteExId.dayId) return d;
        return { ...d, exercises: d.exercises.filter(e => e.id !== deleteExId.exerciseId) };
      }), updatedAt: new Date().toISOString().split('T')[0] };
    }));
    setDeleteExId(null);
    showSuccess('Exercise removed.');
  };

  const duplicatePlan = (plan: WorkoutPlan) => {
    const dup: WorkoutPlan = {
      ...plan,
      id: `wp${Date.now()}`,
      name: `${plan.name} (Copy)`,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      days: plan.days.map(d => ({ ...d, id: `wd${Date.now()}${Math.random().toString(36).slice(2, 6)}`, exercises: d.exercises.map(e => ({ ...e, id: `we${Date.now()}${Math.random().toString(36).slice(2, 6)}` })) })),
    };
    setPlans(prev => [...prev, dup]);
    showSuccess('Plan duplicated as draft.');
  };

  const toggleDay = (dayId: string) => {
    setExpandedDays(prev => {
      const next = new Set(prev);
      if (next.has(dayId)) next.delete(dayId); else next.add(dayId);
      return next;
    });
  };



  const getTotalExercises = (p: WorkoutPlan) => p.days.reduce((s, d) => s + d.exercises.length, 0);

  return (
    <div className="space-y-6">
      {/* ═══════════════ LIST VIEW ═══════════════ */}
      {!viewPlan && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Workout Plans</h1>
              <p className="text-gray-500 mt-1">Manage standard workout schedule templates for all gyms.</p>
            </div>
            <button onClick={openAddPlan} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shrink-0">
              <Plus size={16} /> Create Plan
            </button>
          </div>

          {successMsg && <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">{successMsg}</div>}

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Plans', value: plans.length, color: 'text-gray-900' },
              { label: 'Active', value: plans.filter(p => p.status === 'active').length, color: 'text-emerald-600' },
              { label: 'Drafts', value: plans.filter(p => p.status === 'draft').length, color: 'text-gray-500' },
              { label: 'Total Exercises', value: plans.reduce((s, p) => s + getTotalExercises(p), 0), color: 'text-indigo-600' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-200/80 p-4 text-center">
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-4">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="w-72"><SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search plans..." /></div>
              <select value={levelFilter} onChange={e => { setLevelFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="all">All Levels</option>
                {levels.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
              </select>
              <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              <span className="text-sm text-gray-500 ml-auto">{filtered.length} plans</span>
            </div>
          </div>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {paged.map(plan => (
              <div key={plan.id} className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-gray-900 truncate">{plan.name}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${levelColors[plan.level]}`}>
                          {plan.level.charAt(0).toUpperCase() + plan.level.slice(1)}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset ${statusColors[plan.status]}`}>
                          {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{plan.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-3 text-sm">
                    <span className="flex items-center gap-1.5 text-gray-600">
                      <CalendarDays size={14} className="text-indigo-500" /> {plan.daysPerWeek} days/week
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-600">
                      <Dumbbell size={14} className="text-orange-500" /> {getTotalExercises(plan)} exercises
                    </span>
                    <span className="text-gray-400">Goal: {plan.goal}</span>
                  </div>

                  {/* Day pills */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {plan.days.map(d => (
                      <span key={d.id} className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium">
                        {d.day} <span className="text-indigo-400">({d.exercises.length})</span>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">Updated: {plan.updatedAt}</span>
                    <div className="flex gap-1">
                      <button onClick={() => { setViewPlanId(plan.id); setExpandedDays(new Set(plan.days.map(d => d.id))); }} className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600" title="View Schedule"><Eye size={16} /></button>
                      <button onClick={() => openEditPlan(plan)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600" title="Edit"><Pencil size={16} /></button>
                      <button onClick={() => duplicatePlan(plan)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600" title="Duplicate"><Copy size={16} /></button>
                      <button onClick={() => setDeletePlanId(plan.id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* ═══════════════ DETAIL VIEW ═══════════════ */}
      {viewPlan && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setViewPlanId(null)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-gray-900">{viewPlan.name}</h1>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${levelColors[viewPlan.level]}`}>{viewPlan.level}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset ${statusColors[viewPlan.status]}`}>{viewPlan.status}</span>
                </div>
                <p className="text-gray-500 mt-0.5">{viewPlan.description}</p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => openAddDay(viewPlan.id)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
                <Plus size={16} /> Add Day
              </button>
              <button onClick={() => openEditPlan(viewPlan)} className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">
                <Pencil size={16} /> Edit Plan
              </button>
            </div>
          </div>

          {successMsg && <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">{successMsg}</div>}

          {/* Plan Meta */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Goal', value: viewPlan.goal },
              { label: 'Days / Week', value: viewPlan.daysPerWeek },
              { label: 'Total Exercises', value: getTotalExercises(viewPlan) },
              { label: 'Last Updated', value: viewPlan.updatedAt },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-200/80 p-4 text-center">
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-lg font-bold text-gray-900 mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>

          {/* ═══ Day Schedule Tables ═══ */}
          {viewPlan.days.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200/80 p-16 text-center">
              <CalendarDays size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-1">No Days Added Yet</h3>
              <p className="text-gray-400 mb-4">Start building your schedule by adding workout days.</p>
              <button onClick={() => openAddDay(viewPlan.id)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">
                <Plus size={16} /> Add First Day
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {viewPlan.days.map((day, dayIdx) => (
                <div key={day.id} className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden">
                  {/* Day Header */}
                  <div
                    className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-50/80 to-purple-50/50 cursor-pointer select-none"
                    onClick={() => toggleDay(day.id)}
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical size={18} className="text-gray-300" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-indigo-700">Day {dayIdx + 1}</span>
                          <span className="text-lg font-bold text-gray-900">{day.day}</span>
                        </div>
                        <p className="text-sm text-gray-500">{day.focus} • {day.exercises.length} exercises</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={e => { e.stopPropagation(); openAddEx(viewPlan.id, day.id); }} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700">
                        <Plus size={12} /> Exercise
                      </button>
                      <button onClick={e => { e.stopPropagation(); openEditDay(viewPlan.id, day); }} className="p-1.5 rounded-lg hover:bg-white/60 text-gray-500 hover:text-indigo-600"><Pencil size={14} /></button>
                      <button onClick={e => { e.stopPropagation(); setDeleteDayId({ planId: viewPlan.id, dayId: day.id }); }} className="p-1.5 rounded-lg hover:bg-white/60 text-gray-500 hover:text-red-600"><Trash2 size={14} /></button>
                      {expandedDays.has(day.id) ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                    </div>
                  </div>

                  {/* Exercise Table */}
                  {expandedDays.has(day.id) && (
                    <div className="overflow-x-auto">
                      {day.exercises.length > 0 ? (
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-2.5 w-10">#</th>
                              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2.5">Exercise</th>
                              <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2.5 w-24">Sets</th>
                              <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2.5 w-24">Reps</th>
                              <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-2.5 w-24">Rest</th>
                              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-2.5 w-24">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {day.exercises.map((ex, exIdx) => (
                              <tr key={ex.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-3 text-sm text-gray-400 font-medium">{exIdx + 1}</td>
                                <td className="px-4 py-3">
                                  <span className="text-sm font-semibold text-gray-900">{ex.name}</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="inline-flex items-center justify-center w-10 h-8 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-bold">{ex.sets}</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="inline-flex items-center justify-center px-3 h-8 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold">{ex.reps}</span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="inline-flex items-center justify-center px-3 h-8 bg-amber-50 text-amber-700 rounded-lg text-sm font-bold">{ex.rest}</span>
                                </td>
                                <td className="px-6 py-3">
                                  <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEditEx(viewPlan.id, day.id, ex)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600"><Pencil size={14} /></button>
                                    <button onClick={() => setDeleteExId({ planId: viewPlan.id, dayId: day.id, exerciseId: ex.id })} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600"><Trash2 size={14} /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          {/* Totals row */}
                          <tfoot>
                            <tr className="border-t border-gray-200 bg-gray-50/30">
                              <td colSpan={2} className="px-6 py-2.5 text-xs font-semibold text-gray-500 uppercase">Total: {day.exercises.length} exercises</td>
                              <td className="px-4 py-2.5 text-center text-xs font-bold text-indigo-600">{day.exercises.reduce((s, e) => s + Number(e.sets), 0)} sets</td>
                              <td colSpan={3}></td>
                            </tr>
                          </tfoot>
                        </table>
                      ) : (
                        <div className="py-8 text-center">
                          <Dumbbell size={32} className="mx-auto text-gray-300 mb-2" />
                          <p className="text-sm text-gray-400">No exercises added to this day yet.</p>
                          <button onClick={() => openAddEx(viewPlan.id, day.id)} className="mt-3 inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                            <Plus size={14} /> Add Exercise
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* JSON Preview */}
          <div className="bg-gray-900 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-gray-800/50">
              <span className="text-sm font-medium text-gray-300">JSON Preview — workout_plan</span>
              <button
                onClick={() => {
                  const json = JSON.stringify({ workout_plan: viewPlan.days.map(d => ({ day: d.day, focus: d.focus, exercises: d.exercises.map(e => ({ name: e.name, sets: e.sets, reps: e.reps, rest: e.rest })) })) }, null, 2);
                  navigator.clipboard.writeText(json).catch(() => {});
                  showSuccess('JSON copied to clipboard.');
                }}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
              >
                <Copy size={12} /> Copy JSON
              </button>
            </div>
            <pre className="p-5 text-sm text-green-400 overflow-x-auto max-h-80 font-mono leading-relaxed">
{JSON.stringify({
  workout_plan: viewPlan.days.map(d => ({
    day: d.day,
    focus: d.focus,
    exercises: d.exercises.map(e => ({ name: e.name, sets: e.sets, reps: e.reps, rest: e.rest })),
  })),
}, null, 2)}
            </pre>
          </div>
        </>
      )}

      {/* ═══════════════ MODALS ═══════════════ */}

      {/* Plan Create/Edit Modal */}
      <Modal isOpen={planModal.open} onClose={() => setPlanModal({ open: false, mode: 'add' })} title={planModal.mode === 'add' ? 'Create Workout Plan' : 'Edit Workout Plan'} size="lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name <span className="text-red-500">*</span></label>
            <input value={planForm.name} onChange={e => setPlanForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g., Full Body Strength Builder" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={planForm.description} onChange={e => setPlanForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select value={planForm.level} onChange={e => setPlanForm(f => ({ ...f, level: e.target.value as WorkoutPlan['level'] }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                {levels.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
              <input value={planForm.goal} onChange={e => setPlanForm(f => ({ ...f, goal: e.target.value }))} placeholder="e.g., Strength, Fat Loss" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={planForm.status} onChange={e => setPlanForm(f => ({ ...f, status: e.target.value as WorkoutPlan['status'] }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => setPlanModal({ open: false, mode: 'add' })} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button onClick={savePlan} disabled={!planForm.name.trim()} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-40">
              {planModal.mode === 'add' ? 'Create Plan' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Plan */}
      <Modal isOpen={!!deletePlanId} onClose={() => setDeletePlanId(null)} title="Delete Workout Plan" size="sm">
        <p className="text-gray-600 mb-2">Are you sure you want to delete this workout plan?</p>
        <p className="text-sm text-gray-400 mb-6">This will permanently remove the plan and all its scheduled days and exercises.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeletePlanId(null)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button onClick={deletePlan} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700">Delete</button>
        </div>
      </Modal>

      {/* Day Add/Edit Modal */}
      <Modal isOpen={dayModal.open} onClose={() => setDayModal({ open: false, planId: '', mode: 'add' })} title={dayModal.mode === 'add' ? 'Add Workout Day' : 'Edit Day'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
            <select value={dayForm.day} onChange={e => setDayForm(f => ({ ...f, day: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
              {allDays.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Focus / Target</label>
            <input value={dayForm.focus} onChange={e => setDayForm(f => ({ ...f, focus: e.target.value }))} placeholder="e.g., Full Body, Push, Legs" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setDayModal({ open: false, planId: '', mode: 'add' })} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button onClick={saveDay} disabled={!dayForm.day} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-40">
              {dayModal.mode === 'add' ? 'Add Day' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Day */}
      <Modal isOpen={!!deleteDayId} onClose={() => setDeleteDayId(null)} title="Remove Day" size="sm">
        <p className="text-gray-600 mb-6">Remove this day and all its exercises from the plan?</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteDayId(null)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button onClick={confirmDeleteDay} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700">Remove</button>
        </div>
      </Modal>

      {/* Exercise Add/Edit Modal */}
      <Modal isOpen={exModal.open} onClose={() => setExModal({ open: false, planId: '', dayId: '', mode: 'add' })} title={exModal.mode === 'add' ? 'Add Exercise' : 'Edit Exercise'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Name <span className="text-red-500">*</span></label>
            <input value={exForm.name} onChange={e => setExForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g., Barbell Deadlift" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            {/* Quick pick from exercise library */}
            <div className="mt-2">
              <p className="text-xs text-gray-400 mb-1.5">Quick pick from library:</p>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                {mockExercises.filter(e => e.nameEn.toLowerCase().includes(exForm.name.toLowerCase()) || !exForm.name).slice(0, 8).map(e => (
                  <button key={e.id} onClick={() => setExForm(f => ({ ...f, name: e.nameEn }))} className="px-2 py-1 bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 text-gray-600 rounded-md text-xs transition-colors">
                    {e.nameEn}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sets</label>
              <input value={exForm.sets} onChange={e => setExForm(f => ({ ...f, sets: e.target.value }))} placeholder="3" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-center" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reps</label>
              <input value={exForm.reps} onChange={e => setExForm(f => ({ ...f, reps: e.target.value }))} placeholder="10-12" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-center" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rest</label>
              <input value={exForm.rest} onChange={e => setExForm(f => ({ ...f, rest: e.target.value }))} placeholder="60s" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-center" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setExModal({ open: false, planId: '', dayId: '', mode: 'add' })} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
            <button onClick={saveEx} disabled={!exForm.name.trim()} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-40">
              {exModal.mode === 'add' ? 'Add Exercise' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Exercise */}
      <Modal isOpen={!!deleteExId} onClose={() => setDeleteExId(null)} title="Remove Exercise" size="sm">
        <p className="text-gray-600 mb-6">Remove this exercise from the day's schedule?</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteExId(null)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
          <button onClick={confirmDeleteEx} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700">Remove</button>
        </div>
      </Modal>
    </div>
  );
}

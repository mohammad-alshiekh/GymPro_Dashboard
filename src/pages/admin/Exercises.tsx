import { useState, useMemo } from 'react';
import {
  Plus, Pencil, Trash2, Eye, Flame, Filter, Dumbbell,
  ChevronUp, ChevronDown,
} from 'lucide-react';
import { Modal, StatusBadge, SearchInput, Pagination } from '@/components/ui';
import { mockExercises } from '@/data/mockData';
import type { Exercise } from '@/types';

const categories: Exercise['category'][] = ['strength', 'cardio', 'flexibility', 'balance', 'plyometrics', 'calisthenics'];
const difficulties: Exercise['difficulty'][] = ['beginner', 'intermediate', 'advanced'];


const categoryColors: Record<string, string> = {
  strength: 'bg-red-50 text-red-700 ring-red-200',
  cardio: 'bg-blue-50 text-blue-700 ring-blue-200',
  flexibility: 'bg-purple-50 text-purple-700 ring-purple-200',
  balance: 'bg-teal-50 text-teal-700 ring-teal-200',
  plyometrics: 'bg-orange-50 text-orange-700 ring-orange-200',
  calisthenics: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
};

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-50 text-green-700',
  intermediate: 'bg-amber-50 text-amber-700',
  advanced: 'bg-red-50 text-red-700',
};

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>(mockExercises);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<'name' | 'category' | 'difficulty' | 'caloriesPerHour' | 'createdAt'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const limit = 8;

  // Detail modal
  const [detailExercise, setDetailExercise] = useState<Exercise | null>(null);

  // Form modal
  const [formModal, setFormModal] = useState<{ open: boolean; mode: 'add' | 'edit'; exercise?: Exercise }>({ open: false, mode: 'add' });
  const [form, setForm] = useState({
    name: '',
    category: 'strength' as Exercise['category'],
    muscleGroups: '',
    equipment: '',
    difficulty: 'beginner' as Exercise['difficulty'],
    description: '',
    instructions: '',
    setsReps: '',
    restPeriod: '',
    caloriesPerHour: 0,
    status: 'active' as Exercise['status'],
  });

  // Delete modal
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  // Filter + sort
  const filtered = useMemo(() => {
    let result = exercises.filter(e => {
      const matchSearch = !search ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.muscleGroups.some(m => m.toLowerCase().includes(search.toLowerCase()));
      const matchCategory = categoryFilter === 'all' || e.category === categoryFilter;
      const matchDifficulty = difficultyFilter === 'all' || e.difficulty === difficultyFilter;
      const matchStatus = statusFilter === 'all' || e.status === statusFilter;
      return matchSearch && matchCategory && matchDifficulty && matchStatus;
    });

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortField === 'category') cmp = a.category.localeCompare(b.category);
      else if (sortField === 'difficulty') cmp = difficulties.indexOf(a.difficulty) - difficulties.indexOf(b.difficulty);
      else if (sortField === 'caloriesPerHour') cmp = a.caloriesPerHour - b.caloriesPerHour;
      else if (sortField === 'createdAt') cmp = a.createdAt.localeCompare(b.createdAt);
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [exercises, search, categoryFilter, difficultyFilter, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / limit);
  const paged = filtered.slice((page - 1) * limit, page * limit);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return <ChevronUp size={14} className="text-gray-300" />;
    return sortDir === 'asc' ? <ChevronUp size={14} className="text-indigo-600" /> : <ChevronDown size={14} className="text-indigo-600" />;
  };

  // CRUD
  const openAdd = () => {
    setForm({
      name: '', category: 'strength', muscleGroups: '', equipment: '',
      difficulty: 'beginner', description: '', instructions: '',
      setsReps: '', restPeriod: '', caloriesPerHour: 0, status: 'active',
    });
    setFormModal({ open: true, mode: 'add' });
  };

  const openEdit = (ex: Exercise) => {
    setForm({
      name: ex.name,
      category: ex.category,
      muscleGroups: ex.muscleGroups.join(', '),
      equipment: ex.equipment.join(', '),
      difficulty: ex.difficulty,
      description: ex.description,
      instructions: ex.instructions.join('\n'),
      setsReps: ex.setsReps,
      restPeriod: ex.restPeriod,
      caloriesPerHour: ex.caloriesPerHour,
      status: ex.status,
    });
    setFormModal({ open: true, mode: 'edit', exercise: ex });
  };

  const handleSave = () => {
    const parsed: Omit<Exercise, 'id' | 'createdAt'> = {
      name: form.name.trim(),
      category: form.category,
      muscleGroups: form.muscleGroups.split(',').map(s => s.trim()).filter(Boolean),
      equipment: form.equipment.split(',').map(s => s.trim()).filter(Boolean),
      difficulty: form.difficulty,
      description: form.description.trim(),
      instructions: form.instructions.split('\n').map(s => s.trim()).filter(Boolean),
      setsReps: form.setsReps.trim(),
      restPeriod: form.restPeriod.trim(),
      caloriesPerHour: form.caloriesPerHour,
      status: form.status,
    };

    if (formModal.mode === 'add') {
      const newExercise: Exercise = {
        ...parsed,
        id: `ex${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setExercises(prev => [...prev, newExercise]);
      showSuccess('Exercise created successfully.');
    } else if (formModal.exercise) {
      setExercises(prev => prev.map(e => e.id === formModal.exercise!.id ? { ...e, ...parsed } : e));
      showSuccess('Exercise updated successfully.');
    }
    setFormModal({ open: false, mode: 'add' });
  };

  const handleDelete = () => {
    if (deleteId) {
      setExercises(prev => prev.filter(e => e.id !== deleteId));
      setDeleteId(null);
      showSuccess('Exercise deleted successfully.');
    }
  };

  const toggleStatus = (id: string) => {
    setExercises(prev => prev.map(e => e.id === id ? { ...e, status: e.status === 'active' ? 'inactive' : 'active' } : e));
    showSuccess('Exercise status updated.');
  };

  // Stats
  const activeCount = exercises.filter(e => e.status === 'active').length;
  const categoryCounts = categories.reduce<Record<string, number>>((acc, c) => {
    acc[c] = exercises.filter(e => e.category === c).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exercise Library</h1>
          <p className="text-gray-500 mt-1">Manage the standard exercise database for all gyms.</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shrink-0">
          <Plus size={16} /> Add Exercise
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">{successMsg}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white rounded-2xl border border-gray-200/80 p-4 text-center col-span-2 sm:col-span-1">
          <p className="text-3xl font-bold text-gray-900">{exercises.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200/80 p-4 text-center">
          <p className="text-3xl font-bold text-emerald-600">{activeCount}</p>
          <p className="text-xs text-gray-500 mt-1">Active</p>
        </div>
        {categories.map(cat => (
          <div key={cat} className="bg-white rounded-2xl border border-gray-200/80 p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{categoryCounts[cat] || 0}</p>
            <p className="text-xs text-gray-500 mt-1 capitalize">{cat}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="w-72">
            <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search exercises, muscles..." />
          </div>
          <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
          <select value={difficultyFilter} onChange={e => { setDifficultyFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value="all">All Difficulties</option>
            {difficulties.map(d => <option key={d} value={d} className="capitalize">{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <span className="text-sm text-gray-500 ml-auto">{filtered.length} exercises</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200/80">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-gray-700">
                    Exercise <SortIcon field="name" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  <button onClick={() => handleSort('category')} className="flex items-center gap-1 hover:text-gray-700">
                    Category <SortIcon field="category" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  <button onClick={() => handleSort('difficulty')} className="flex items-center gap-1 hover:text-gray-700">
                    Difficulty <SortIcon field="difficulty" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Muscle Groups</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Equipment</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  <button onClick={() => handleSort('caloriesPerHour')} className="flex items-center gap-1 hover:text-gray-700 mx-auto">
                    Cal/hr <SortIcon field="caloriesPerHour" />
                  </button>
                </th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Sets × Reps</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paged.map(ex => (
                <tr key={ex.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-3.5">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{ex.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 max-w-[240px] truncate">{ex.description}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset ${categoryColors[ex.category]}`}>
                      {ex.category.charAt(0).toUpperCase() + ex.category.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${difficultyColors[ex.difficulty]}`}>
                      {ex.difficulty.charAt(0).toUpperCase() + ex.difficulty.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {ex.muscleGroups.slice(0, 2).map(m => (
                        <span key={m} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[11px] font-medium">{m}</span>
                      ))}
                      {ex.muscleGroups.length > 2 && (
                        <span className="px-1.5 py-0.5 bg-gray-50 text-gray-400 rounded text-[11px]">+{ex.muscleGroups.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1 max-w-[160px]">
                      {ex.equipment.length > 0 ? (
                        <>
                          {ex.equipment.slice(0, 2).map(eq => (
                            <span key={eq} className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[11px] font-medium">{eq}</span>
                          ))}
                          {ex.equipment.length > 2 && (
                            <span className="px-1.5 py-0.5 bg-indigo-25 text-indigo-400 rounded text-[11px]">+{ex.equipment.length - 2}</span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Bodyweight</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Flame size={12} className="text-orange-400" />
                      <span className="text-sm font-semibold text-gray-700">{ex.caloriesPerHour}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="text-sm text-gray-600 font-mono">{ex.setsReps}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button onClick={() => toggleStatus(ex.id)} title="Toggle status">
                      <StatusBadge status={ex.status} />
                    </button>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center justify-end gap-0.5">
                      <button onClick={() => setDetailExercise(ex)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors" title="View Details">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => openEdit(ex)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors" title="Edit">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setDeleteId(ex.id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {paged.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <Filter size={36} className="mx-auto text-gray-300 mb-3" />
            <p>No exercises match your filters.</p>
          </div>
        )}
        <div className="px-6 border-t border-gray-100">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {/* ───── Detail Modal ───── */}
      <Modal isOpen={!!detailExercise} onClose={() => setDetailExercise(null)} title="Exercise Details" size="lg">
        {detailExercise && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                <Dumbbell className="text-white" size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900">{detailExercise.name}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset ${categoryColors[detailExercise.category]}`}>
                    {detailExercise.category.charAt(0).toUpperCase() + detailExercise.category.slice(1)}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${difficultyColors[detailExercise.difficulty]}`}>
                    {detailExercise.difficulty.charAt(0).toUpperCase() + detailExercise.difficulty.slice(1)}
                  </span>
                  <StatusBadge status={detailExercise.status} />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{detailExercise.description}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Sets × Reps</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{detailExercise.setsReps}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Rest Period</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{detailExercise.restPeriod}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Cal/hr</p>
                <p className="text-sm font-bold text-orange-600 mt-0.5 flex items-center justify-center gap-1"><Flame size={14} /> {detailExercise.caloriesPerHour}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Added</p>
                <p className="text-sm font-bold text-gray-900 mt-0.5">{detailExercise.createdAt}</p>
              </div>
            </div>

            {/* Muscle Groups */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Target Muscle Groups</h4>
              <div className="flex flex-wrap gap-2">
                {detailExercise.muscleGroups.map(mg => (
                  <span key={mg} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">{mg}</span>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Equipment</h4>
              {detailExercise.equipment.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {detailExercise.equipment.map(eq => (
                    <span key={eq} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium">{eq}</span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No equipment needed (bodyweight exercise)</p>
              )}
            </div>

            {/* Instructions */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Instructions</h4>
              <ol className="space-y-2">
                {detailExercise.instructions.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-sm text-gray-600 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </Modal>

      {/* ───── Create / Edit Modal ───── */}
      <Modal isOpen={formModal.open} onClose={() => setFormModal({ open: false, mode: 'add' })} title={formModal.mode === 'add' ? 'Add New Exercise' : 'Edit Exercise'} size="lg">
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Name <span className="text-red-500">*</span></label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g., Barbell Back Squat" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Exercise['category'] }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty <span className="text-red-500">*</span></label>
              <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as Exercise['difficulty'] }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                {difficulties.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Exercise['status'] }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Brief description of the exercise..." className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Muscle Groups <span className="text-gray-400 font-normal">(comma-separated)</span></label>
            <input value={form.muscleGroups} onChange={e => setForm(f => ({ ...f, muscleGroups: e.target.value }))} placeholder="Quadriceps, Glutes, Hamstrings, Core" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Equipment <span className="text-gray-400 font-normal">(comma-separated, leave empty for bodyweight)</span></label>
            <input value={form.equipment} onChange={e => setForm(f => ({ ...f, equipment: e.target.value }))} placeholder="Barbell, Squat Rack" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sets × Reps</label>
              <input value={form.setsReps} onChange={e => setForm(f => ({ ...f, setsReps: e.target.value }))} placeholder="4 × 8-10" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rest Period</label>
              <input value={form.restPeriod} onChange={e => setForm(f => ({ ...f, restPeriod: e.target.value }))} placeholder="2-3 min" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Calories / Hour</label>
              <input type="number" value={form.caloriesPerHour} onChange={e => setForm(f => ({ ...f, caloriesPerHour: Number(e.target.value) }))} placeholder="450" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructions <span className="text-gray-400 font-normal">(one step per line)</span></label>
            <textarea value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} rows={5} placeholder={`Position barbell on upper traps, grip outside shoulders\nUnrack and step back, feet shoulder-width apart\nBrace core, initiate descent by pushing hips back\nLower until thighs are parallel to the ground\nDrive through midfoot to return to standing`} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => setFormModal({ open: false, mode: 'add' })} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={!form.name.trim() || !form.description.trim()} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-40">
              {formModal.mode === 'add' ? 'Create Exercise' : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ───── Delete Modal ───── */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Exercise" size="sm">
        <p className="text-gray-600 mb-2">Are you sure you want to delete this exercise?</p>
        <p className="text-sm text-gray-400 mb-6">This action cannot be undone. Any workouts referencing this exercise will need to be updated.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleDelete} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors">Delete</button>
        </div>
      </Modal>
    </div>
  );
}

import { useState, useMemo, useEffect } from 'react';
import {
  Plus, Pencil, Trash2, Eye, Filter, Dumbbell,
  ChevronUp, ChevronDown
} from 'lucide-react';
import { Modal, StatusBadge, SearchInput, Pagination } from '@/components/ui';
import { CircularProgress, ExerciseStatSkeleton, ExerciseTableSkeleton } from '@/components/skeleton';
import type { Exercise, MuscleGroup } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { apiUrl } from '@/lib/api';

const categories = [
  { id: 1, label: 'Strength' },
  { id: 2, label: 'Cardio' },
  { id: 3, label: 'Flexibility' },
  { id: 4, label: 'Balance' },
  { id: 5, label: 'Plyometrics' },
  { id: 6, label: 'Calisthenics' },
];

const levels = [
  { id: 1, label: 'Beginner' },
  { id: 2, label: 'Intermediate' },
  { id: 3, label: 'Advanced' },
];

const categoryColors: Record<number, string> = {
  1: 'bg-red-50 text-red-700 ring-red-200',
  2: 'bg-blue-50 text-blue-700 ring-blue-200',
  3: 'bg-purple-50 text-purple-700 ring-purple-200',
  4: 'bg-teal-50 text-teal-700 ring-teal-200',
  5: 'bg-orange-50 text-orange-700 ring-orange-200',
  6: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
};

const levelColors: Record<number, string> = {
  1: 'bg-green-50 text-green-700',
  2: 'bg-amber-50 text-amber-700',
  3: 'bg-red-50 text-red-700',
};

export default function ExercisesPage() {
  const { accessToken } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<'nameEn' | 'category' | 'level' | 'isActive'>('nameEn');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const limit = 8;

  useEffect(() => {
    if (!accessToken) {
      setExercises([]);
      setLoading(false);
      return;
    }

    const fetchExercises = async () => {
      setLoading(true);
      try {
        const response = await fetch(apiUrl('/Exercise?pageNumber=1&resultsPerPage=100'), {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'accept': '*/*',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setExercises(data.items ?? []);
        } else {
          setExercises([]);
        }
      } catch (error) {
        console.error('Failed to fetch exercises:', error);
        setExercises([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [accessToken]);

  // Detail modal
  const [detailExercise, setDetailExercise] = useState<Exercise | null>(null);

  // Form modal
  const [formModal, setFormModal] = useState<{ open: boolean; mode: 'add' | 'edit'; exercise?: Exercise }>({ open: false, mode: 'add' });
  const [form, setForm] = useState({
    nameEn: '',
    nameAr: '',
    descriptionEn: '',
    descriptionAr: '',
    instructionsEn: '',
    instructionsAr: '',
    level: 1,
    videoUrl: '',
    imageUrl: '',
    isActive: true,
    force: 1,
    mechanic: 1,
    category: 1,
    equipmentEn: '',
    equipmentAr: '',
    primaryMuscleGroups: '',
    secondaryMuscleGroups: '',
  });

  // Delete modal
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 3000); };

  // Filter + sort
  const filtered = useMemo(() => {
    let result = exercises.filter(e => {
      const matchSearch = !search ||
        e.nameEn.toLowerCase().includes(search.toLowerCase()) ||
        e.nameAr.includes(search) ||
        e.descriptionEn.toLowerCase().includes(search.toLowerCase()) ||
        (e.primaryMuscleGroups ?? []).some(m => m.nameEn.toLowerCase().includes(search.toLowerCase()));
      const matchCategory = categoryFilter === 'all' || e.category === Number(categoryFilter);
      const matchLevel = levelFilter === 'all' || e.level === Number(levelFilter);
      const matchStatus = statusFilter === 'all' || (statusFilter === 'active' ? e.isActive : !e.isActive);
      return matchSearch && matchCategory && matchLevel && matchStatus;
    });

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'nameEn') cmp = a.nameEn.localeCompare(b.nameEn);
      else if (sortField === 'category') cmp = (a.category || 0) - (b.category || 0);
      else if (sortField === 'level') cmp = (a.level || 0) - (b.level || 0);
      else if (sortField === 'isActive') cmp = (a.isActive === b.isActive) ? 0 : a.isActive ? -1 : 1;
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [exercises, search, categoryFilter, levelFilter, statusFilter, sortField, sortDir]);

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
      nameEn: '', nameAr: '', descriptionEn: '', descriptionAr: '',
      instructionsEn: '', instructionsAr: '', level: 1,
      videoUrl: '', imageUrl: '', isActive: true,
      force: 1, mechanic: 1, category: 1,
      equipmentEn: '', equipmentAr: '',
      primaryMuscleGroups: '', secondaryMuscleGroups: '',
    });
    setFormModal({ open: true, mode: 'add' });
  };

  const openEdit = (ex: Exercise) => {
    setForm({
      nameEn: ex.nameEn,
      nameAr: ex.nameAr,
      descriptionEn: ex.descriptionEn,
      descriptionAr: ex.descriptionAr,
      instructionsEn: ex.instructionsEn.join('\n'),
      instructionsAr: ex.instructionsAr.join('\n'),
      level: ex.level || 1,
      videoUrl: ex.videoUrl,
      imageUrl: ex.imageUrl,
      isActive: ex.isActive,
      force: ex.force || 1,
      mechanic: ex.mechanic || 1,
      category: ex.category || 1,
      equipmentEn: ex.equipmentEn,
      equipmentAr: ex.equipmentAr,
      primaryMuscleGroups: ex.primaryMuscleGroups.map(m => m.nameEn).join(', '),
      secondaryMuscleGroups: ex.secondaryMuscleGroups.map(m => m.nameEn).join(', '),
    });
    setFormModal({ open: true, mode: 'edit', exercise: ex });
  };

  const handleSave = () => {
    const parseMuscles = (str: string): MuscleGroup[] =>
      str.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => ({ id: `mg-${Date.now()}-${i}`, nameEn: s, nameAr: s }));

    const parsed: Omit<Exercise, 'id'> = {
      nameEn: form.nameEn.trim(),
      nameAr: form.nameAr.trim(),
      descriptionEn: form.descriptionEn.trim(),
      descriptionAr: form.descriptionAr.trim(),
      instructionsEn: form.instructionsEn.split('\n').map(s => s.trim()).filter(Boolean),
      instructionsAr: form.instructionsAr.split('\n').map(s => s.trim()).filter(Boolean),
      level: form.level,
      videoUrl: form.videoUrl.trim(),
      imageUrl: form.imageUrl.trim(),
      isActive: form.isActive,
      force: form.force,
      mechanic: form.mechanic,
      category: form.category,
      equipmentEn: form.equipmentEn.trim(),
      equipmentAr: form.equipmentAr.trim(),
      primaryMuscleGroups: parseMuscles(form.primaryMuscleGroups),
      secondaryMuscleGroups: parseMuscles(form.secondaryMuscleGroups),
    };

    if (formModal.mode === 'add') {
      const newExercise: Exercise = {
        ...parsed,
        id: `ex${Date.now()}`,
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
    setExercises(prev => prev.map(e => e.id === id ? { ...e, isActive: !e.isActive } : e));
    showSuccess('Exercise status updated.');
  };

  // Stats
  const activeCount = exercises.filter(e => e.isActive).length;
  const categoryCounts = categories.reduce<Record<number, number>>((acc, c) => {
    acc[c.id] = exercises.filter(e => e.category === c.id).length;
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
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {loading ? (
          <>
            <ExerciseStatSkeleton className="col-span-2 sm:col-span-1" />
            <ExerciseStatSkeleton />
            {categories.map((cat) => (
              <ExerciseStatSkeleton key={cat.id} />
            ))}
          </>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-gray-200/80 p-4 text-center col-span-2 sm:col-span-1">
              <p className="text-3xl font-bold text-gray-900">{exercises.length}</p>
              <p className="text-xs text-gray-500 mt-1">Total</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200/80 p-4 text-center">
              <p className="text-3xl font-bold text-emerald-600">{activeCount}</p>
              <p className="text-xs text-gray-500 mt-1">Active</p>
            </div>
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white rounded-2xl border border-gray-200/80 p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{categoryCounts[cat.id] || 0}</p>
                <p className="text-xs text-gray-500 mt-1 capitalize">{cat.label}</p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="w-72">
            <SearchInput value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search exercises, muscles..." />
          </div>
          <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <select value={levelFilter} onChange={e => { setLevelFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value="all">All Levels</option>
            {levels.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
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
                  <button onClick={() => handleSort('nameEn')} className="flex items-center gap-1 hover:text-gray-700">
                    Exercise <SortIcon field="nameEn" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  <button onClick={() => handleSort('category')} className="flex items-center gap-1 hover:text-gray-700">
                    Category <SortIcon field="category" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  <button onClick={() => handleSort('level')} className="flex items-center gap-1 hover:text-gray-700">
                    Level <SortIcon field="level" />
                  </button>
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Muscle Groups</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Equipment</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <ExerciseTableSkeleton rows={limit} />
              ) : paged.map(ex => (
                <tr key={ex.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-3.5">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{ex.nameEn}</p>
                      <p className="text-xs text-gray-400 mt-0.5 max-w-[240px] truncate">{ex.descriptionEn}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset ${ex.category ? categoryColors[ex.category] : 'bg-gray-50 text-gray-600'}`}>
                      {categories.find(c => c.id === ex.category)?.label || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${ex.level ? levelColors[ex.level] : 'bg-gray-50 text-gray-600'}`}>
                      {levels.find(l => l.id === ex.level)?.label || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {(ex.primaryMuscleGroups ?? []).slice(0, 2).map(m => (
                        <span key={m.id} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[11px] font-medium">{m.nameEn}</span>
                      ))}
                      {(ex.primaryMuscleGroups ?? []).length > 2 && (
                        <span className="px-1.5 py-0.5 bg-gray-50 text-gray-400 rounded text-[11px]">+{(ex.primaryMuscleGroups ?? []).length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1 max-w-[160px]">
                      {ex.equipmentEn ? (
                        <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[11px] font-medium truncate max-w-full">{ex.equipmentEn}</span>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Bodyweight</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <button onClick={() => toggleStatus(ex.id)} title="Toggle status">
                      <StatusBadge status={ex.isActive ? 'active' : 'inactive'} />
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
        {!loading && paged.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <Filter size={36} className="mx-auto text-gray-300 mb-3" />
            <p>{exercises.length === 0 ? 'No exercises yet. Add your first exercise to get started.' : 'No exercises match your filters.'}</p>
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
                <h3 className="text-xl font-bold text-gray-900">{detailExercise.nameEn}</h3>
                <p className="text-sm text-gray-500 font-arabic mt-1">{detailExercise.nameAr}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset ${detailExercise.category ? categoryColors[detailExercise.category] : 'bg-gray-50 text-gray-600'}`}>
                    {categories.find(c => c.id === detailExercise.category)?.label || 'Unknown'}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${detailExercise.level ? levelColors[detailExercise.level] : 'bg-gray-50 text-gray-600'}`}>
                    {levels.find(l => l.id === detailExercise.level)?.label || 'Unknown'}
                  </span>
                  <StatusBadge status={detailExercise.isActive ? 'active' : 'inactive'} />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Description (EN)</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{detailExercise.descriptionEn}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Description (AR)</h4>
                <p className="text-sm text-gray-600 leading-relaxed font-arabic">{detailExercise.descriptionAr}</p>
              </div>
            </div>

            {/* Muscle Groups */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Primary Muscle Groups</h4>
                <div className="flex flex-wrap gap-2">
                  {detailExercise.primaryMuscleGroups.map(mg => (
                    <span key={mg.id} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">{mg.nameEn}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Secondary Muscle Groups</h4>
                <div className="flex flex-wrap gap-2">
                  {detailExercise.secondaryMuscleGroups.map(mg => (
                    <span key={mg.id} className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium">{mg.nameEn}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Equipment */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Equipment</h4>
              <p className="text-sm text-gray-600">{detailExercise.equipmentEn || 'Bodyweight'}</p>
              <p className="text-sm text-gray-500 font-arabic mt-1">{detailExercise.equipmentAr}</p>
            </div>

            {/* Instructions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Instructions (EN)</h4>
                <ol className="space-y-2">
                  {detailExercise.instructionsEn.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-sm text-gray-600 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 text-right">Instructions (AR)</h4>
                <ol className="space-y-2 text-right">
                  {detailExercise.instructionsAr.map((step, i) => (
                    <li key={i} className="flex flex-row-reverse items-start gap-3">
                      <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-sm text-gray-600 leading-relaxed font-arabic">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ───── Create / Edit Modal ───── */}
      <Modal isOpen={formModal.open} onClose={() => setFormModal({ open: false, mode: 'add' })} title={formModal.mode === 'add' ? 'Add New Exercise' : 'Edit Exercise'} size="lg">
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name (EN) <span className="text-red-500">*</span></label>
              <input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))} placeholder="e.g., Barbell Back Squat" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">Name (AR) <span className="text-red-500">*</span></label>
              <input value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))} dir="rtl" placeholder="مثلاً: سكوات خلفي بالبار" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-arabic focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: Number(e.target.value) }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level <span className="text-red-500">*</span></label>
              <select value={form.level} onChange={e => setForm(f => ({ ...f, level: Number(e.target.value) }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                {levels.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (EN)</label>
              <textarea value={form.descriptionEn} onChange={e => setForm(f => ({ ...f, descriptionEn: e.target.value }))} rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">Description (AR)</label>
              <textarea value={form.descriptionAr} onChange={e => setForm(f => ({ ...f, descriptionAr: e.target.value }))} rows={3} dir="rtl" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-arabic focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Muscle Groups <span className="text-gray-400 font-normal">(comma-separated)</span></label>
              <input value={form.primaryMuscleGroups} onChange={e => setForm(f => ({ ...f, primaryMuscleGroups: e.target.value }))} placeholder="Quadriceps, Glutes" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Muscle Groups</label>
              <input value={form.secondaryMuscleGroups} onChange={e => setForm(f => ({ ...f, secondaryMuscleGroups: e.target.value }))} placeholder="Hamstrings, Core" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Equipment (EN)</label>
              <input value={form.equipmentEn} onChange={e => setForm(f => ({ ...f, equipmentEn: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">Equipment (AR)</label>
              <input value={form.equipmentAr} onChange={e => setForm(f => ({ ...f, equipmentAr: e.target.value }))} dir="rtl" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-arabic focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructions (EN) <span className="text-gray-400 font-normal">(one per line)</span></label>
              <textarea value={form.instructionsEn} onChange={e => setForm(f => ({ ...f, instructionsEn: e.target.value }))} rows={4} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">Instructions (AR)</label>
              <textarea value={form.instructionsAr} onChange={e => setForm(f => ({ ...f, instructionsAr: e.target.value }))} rows={4} dir="rtl" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-arabic focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setFormModal({ open: false, mode: 'add' })} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors">
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

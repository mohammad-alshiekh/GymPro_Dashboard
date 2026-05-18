import { useCallback, useEffect, useState } from 'react';
import {
  Plus, Pencil, Trash2, Eye, Layers, AlertCircle, RefreshCw,
} from 'lucide-react';
import { Modal, StatusBadge, SearchInput, Pagination, StatCard } from '@/components/ui';
import { CatalogTableSkeleton, CircularProgress, StatCardSkeleton } from '@/components/skeleton';
import { useAuth } from '@/context/AuthContext';
import {
  createMuscleGroup,
  deleteMuscleGroup,
  getMuscleGroup,
  listMuscleGroups,
  updateMuscleGroup,
} from '@/lib/muscleGroupApi';
import type { MuscleGroup, MuscleGroupPayload } from '@/types';

const PAGE_SIZE = 10;

const emptyForm: MuscleGroupPayload = {
  nameEn: '',
  nameAr: '',
  descriptionEn: '',
  descriptionAr: '',
  isActive: true,
};

function formFromMuscleGroup(mg: MuscleGroup): MuscleGroupPayload {
  return {
    nameEn: mg.nameEn,
    nameAr: mg.nameAr,
    descriptionEn: mg.descriptionEn ?? '',
    descriptionAr: mg.descriptionAr ?? '',
    isActive: mg.isActive ?? true,
  };
}

export default function MuscleGroupsPage() {
  const { accessToken } = useAuth();

  const [items, setItems] = useState<MuscleGroup[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [detail, setDetail] = useState<MuscleGroup | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [formModal, setFormModal] = useState<{
    open: boolean;
    mode: 'add' | 'edit';
    id?: string;
  }>({ open: false, mode: 'add' });
  const [form, setForm] = useState<MuscleGroupPayload>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<MuscleGroup | null>(null);
  const [deleting, setDeleting] = useState(false);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [search]);

  const loadList = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listMuscleGroups(accessToken, {
        pageNumber: page,
        resultsPerPage: PAGE_SIZE,
        searchQuery: debouncedSearch || undefined,
      });
      setItems(data.items);
      setTotalCount(data.totalCount);
      setTotalPages(Math.max(data.totalPages, 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load muscle groups');
    } finally {
      setLoading(false);
    }
  }, [accessToken, page, debouncedSearch]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const filteredItems =
    statusFilter === 'all'
      ? items
      : items.filter((mg) =>
          statusFilter === 'active' ? mg.isActive !== false : mg.isActive === false,
        );

  const activeOnPage = items.filter((mg) => mg.isActive !== false).length;

  const openAdd = () => {
    setForm(emptyForm);
    setFormError(null);
    setFormModal({ open: true, mode: 'add' });
  };

  const openEdit = (mg: MuscleGroup) => {
    setForm(formFromMuscleGroup(mg));
    setFormError(null);
    setFormModal({ open: true, mode: 'edit', id: mg.id });
  };

  const openDetail = async (mg: MuscleGroup) => {
    if (!accessToken) return;
    setDetail(mg);
    setDetailLoading(true);
    try {
      const fresh = await getMuscleGroup(accessToken, mg.id);
      setDetail(fresh);
    } catch {
      /* keep list row data if detail fetch fails */
    } finally {
      setDetailLoading(false);
    }
  };

  const validateForm = (): string | null => {
    if (!form.nameEn.trim()) return 'English name is required.';
    if (!form.nameAr.trim()) return 'Arabic name is required.';
    return null;
  };

  const handleSave = async () => {
    const validation = validateForm();
    if (validation) {
      setFormError(validation);
      return;
    }
    if (!accessToken) return;

    const payload: MuscleGroupPayload = {
      nameEn: form.nameEn.trim(),
      nameAr: form.nameAr.trim(),
      descriptionEn: form.descriptionEn.trim(),
      descriptionAr: form.descriptionAr.trim(),
      isActive: form.isActive,
    };

    setSaving(true);
    setFormError(null);
    try {
      if (formModal.mode === 'add') {
        await createMuscleGroup(accessToken, payload);
        showSuccess('Muscle group created successfully.');
        setPage(1);
      } else if (formModal.id) {
        await updateMuscleGroup(accessToken, formModal.id, payload);
        showSuccess('Muscle group updated successfully.');
      }
      setFormModal({ open: false, mode: 'add' });
      await loadList();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!accessToken || !deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMuscleGroup(accessToken, deleteTarget.id);
      showSuccess(`"${deleteTarget.nameEn}" was deleted.`);
      setDeleteTarget(null);
      if (items.length === 1 && page > 1) setPage((p) => p - 1);
      else await loadList();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Muscle Groups</h1>
          <p className="text-gray-500 mt-1">
            Define and maintain muscle groups used across the exercise library.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          disabled={!accessToken}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors shrink-0"
        >
          <Plus size={16} /> Add Muscle Group
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">
          {successMsg}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-medium">Something went wrong</p>
            <p className="mt-0.5 text-red-600/90">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => { setError(null); loadList(); }}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-red-200 text-red-700 hover:bg-red-50 text-xs font-medium"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard title="Total groups" value={totalCount} icon={<Layers size={22} />} color="indigo" />
            <StatCard title="On this page" value={items.length} icon={<Layers size={22} />} color="blue" />
            <StatCard title="Active (page)" value={activeOnPage} icon={<Layers size={22} />} color="emerald" />
          </>
        )}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="w-full sm:w-80">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by name or description..."
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">All statuses</option>
            <option value="active">Active only</option>
            <option value="inactive">Inactive only</option>
          </select>
          <span className="text-sm text-gray-500 sm:ml-auto">
            {totalCount} total · Page {page} of {totalPages}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200/80">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  Muscle group
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                  Description
                </th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Status
                </th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <CatalogTableSkeleton rows={PAGE_SIZE} />
              ) : filteredItems.map((mg) => (
                <tr key={mg.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0">
                        <Layers size={18} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{mg.nameEn}</p>
                        <p className="text-sm text-gray-500 font-arabic mt-0.5" dir="rtl">
                          {mg.nameAr}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell max-w-xs">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {mg.descriptionEn || '—'}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <StatusBadge status={mg.isActive !== false ? 'active' : 'inactive'} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-0.5">
                      <button
                        type="button"
                        onClick={() => openDetail(mg)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors"
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(mg)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(mg)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && filteredItems.length === 0 && (
          <div className="py-16 text-center">
            <Layers size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-600 font-medium">No muscle groups found</p>
            <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
              {debouncedSearch
                ? 'Try a different search term or clear filters.'
                : 'Create your first muscle group to organize exercises.'}
            </p>
            {!debouncedSearch && (
              <button
                type="button"
                onClick={openAdd}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
              >
                <Plus size={16} /> Add Muscle Group
              </button>
            )}
          </div>
        )}

        <div className="px-6 border-t border-gray-100">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Detail modal */}
      <Modal isOpen={!!detail} onClose={() => setDetail(null)} title="Muscle Group Details" size="lg">
        {detail && (
          <div className="space-y-6">
            {detailLoading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CircularProgress size="sm" className="text-indigo-600" /> Refreshing…
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                <Layers className="text-white" size={26} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900">{detail.nameEn}</h3>
                <p className="text-base text-gray-600 font-arabic mt-1" dir="rtl">
                  {detail.nameAr}
                </p>
                <div className="mt-2">
                  <StatusBadge status={detail.isActive !== false ? 'active' : 'inactive'} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Description (EN)</h4>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {detail.descriptionEn || '—'}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2 text-right">Description (AR)</h4>
                <p className="text-sm text-gray-600 leading-relaxed font-arabic whitespace-pre-wrap" dir="rtl">
                  {detail.descriptionAr || '—'}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 font-mono">ID: {detail.id}</p>
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  const d = detail;
                  setDetail(null);
                  openEdit(d);
                }}
                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Form modal */}
      <Modal
        isOpen={formModal.open}
        onClose={() => !saving && setFormModal({ open: false, mode: 'add' })}
        title={formModal.mode === 'add' ? 'Add Muscle Group' : 'Edit Muscle Group'}
        size="lg"
      >
        <div className="space-y-5">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name (EN) <span className="text-red-500">*</span>
              </label>
              <input
                value={form.nameEn}
                onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))}
                placeholder="e.g. Back"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                Name (AR) <span className="text-red-500">*</span>
              </label>
              <input
                value={form.nameAr}
                onChange={(e) => setForm((f) => ({ ...f, nameAr: e.target.value }))}
                dir="rtl"
                placeholder="مثلاً: الظهر"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-arabic focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (EN)</label>
              <textarea
                value={form.descriptionEn}
                onChange={(e) => setForm((f) => ({ ...f, descriptionEn: e.target.value }))}
                rows={4}
                placeholder="Training programs focused on back muscles…"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">
                Description (AR)
              </label>
              <textarea
                value={form.descriptionAr}
                onChange={(e) => setForm((f) => ({ ...f, descriptionAr: e.target.value }))}
                rows={4}
                dir="rtl"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-arabic focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-gray-700">Active — visible in exercise assignments</span>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => setFormModal({ open: false, mode: 'add' })}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-60"
            >
              {saving && <CircularProgress size="sm" className="text-white" />}
              {formModal.mode === 'add' ? 'Create' : 'Save changes'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => !deleting && setDeleteTarget(null)} title="Delete Muscle Group" size="sm">
        {deleteTarget && (
          <>
            <p className="text-gray-600 mb-2">
              Delete <strong>{deleteTarget.nameEn}</strong>?
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Exercises linked to this group may need to be updated. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {deleting && <CircularProgress size="sm" className="text-white" />}
                Delete
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

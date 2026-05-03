import { type ReactNode } from 'react';
import { X } from 'lucide-react';

/* ───── Modal ───── */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;
  const widths = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${widths[size]} max-h-[85vh] flex flex-col`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

/* ───── StatusBadge ───── */
export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    inactive: 'bg-red-50 text-red-700 ring-red-600/20',
    pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    approved: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    rejected: 'bg-red-50 text-red-700 ring-red-600/20',
    completed: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    failed: 'bg-red-50 text-red-700 ring-red-600/20',
    expired: 'bg-gray-50 text-gray-600 ring-gray-500/20',
    cancelled: 'bg-red-50 text-red-700 ring-red-600/20',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ring-1 ring-inset ${colors[status] || 'bg-gray-50 text-gray-600 ring-gray-500/20'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

/* ───── Pagination ───── */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages: (number | string)[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-between py-3">
      <p className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        {pages.map((p, i) =>
          typeof p === 'string' ? (
            <span key={i} className="px-2 py-1.5 text-sm text-gray-400">…</span>
          ) : (
            <button
              key={i}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1.5 text-sm rounded-lg border ${
                p === currentPage
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* ───── StatCard ───── */
interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  color: 'indigo' | 'emerald' | 'amber' | 'blue' | 'purple' | 'rose';
}

export function StatCard({ title, value, icon, change, color }: StatCardProps) {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    rose: 'bg-rose-50 text-rose-600',
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className="mt-1 text-xs text-emerald-600 font-medium">{change}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ───── SearchInput ───── */
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search...' }: SearchInputProps) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
      />
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  );
}

/* ───── EmptyState ───── */
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500">{message}</p>
    </div>
  );
}

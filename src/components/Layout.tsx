import { useState, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserCheck, Building2, CreditCard,
  Trophy, BarChart3, LogOut, Menu, X, ScanLine, Star, Dumbbell, ClipboardList, CalendarDays
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  label: string;
  icon: ReactNode;
  path: string;
}

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
  { label: 'Users', icon: <Users size={20} />, path: '/admin/users' },
  { label: 'Trainers', icon: <UserCheck size={20} />, path: '/admin/trainers' },
  { label: 'Gyms', icon: <Building2 size={20} />, path: '/admin/gyms' },
  { label: 'Exercises', icon: <ClipboardList size={20} />, path: '/admin/exercises' },
  { label: 'Workout Plans', icon: <CalendarDays size={20} />, path: '/admin/workout-plans' },
  { label: 'Transactions', icon: <CreditCard size={20} />, path: '/admin/transactions' },
  { label: 'Challenges', icon: <Trophy size={20} />, path: '/admin/challenges' },
  { label: 'Reports', icon: <BarChart3 size={20} />, path: '/admin/reports' },
];

const gymNavItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/gym/dashboard' },
  { label: 'Members', icon: <Users size={20} />, path: '/gym/members' },
  { label: 'Attendance', icon: <ScanLine size={20} />, path: '/gym/attendance' },
  { label: 'Subscriptions', icon: <CreditCard size={20} />, path: '/gym/subscriptions' },
  { label: 'Reviews', icon: <Star size={20} />, path: '/gym/reviews' },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { role, username, logout, gymName } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = role === 'admin' ? adminNavItems : gymNavItems;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Dumbbell size={18} />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight">GymPro</span>
              <span className="ml-1.5 text-[10px] px-1.5 py-0.5 bg-indigo-500/30 rounded-full text-indigo-300 font-medium uppercase tracking-wider">
                {role === 'admin' ? 'Admin' : 'Manager'}
              </span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="mb-3 px-3 py-2 bg-slate-800/50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400 text-sm font-bold">
                {username?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{username}</p>
                <p className="text-xs text-slate-400 truncate">
                  {role === 'admin' ? 'Super Administrator' : gymName}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200/80 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          >
            <Menu size={22} />
          </button>
          <div className="hidden lg:block">
            <h2 className="text-sm font-medium text-gray-500">
              {role === 'admin' ? 'Super Administrator Portal' : `Gym Management — ${gymName}`}
            </h2>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-semibold text-sm">{username?.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

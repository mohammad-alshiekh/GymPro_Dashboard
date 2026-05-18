import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Dumbbell, Shield, Building2 } from 'lucide-react';

export default function LoginPage() {
  const [role, setRole] = useState<'admin' | 'gym'>('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const email = username || (role === 'admin' ? 'superadmin@gmail.com' : 'gymmanager@fitzone.com');
    const result = await login(email, password, role);
    
    if (result.success) {
      navigate(role === 'admin' ? '/admin/dashboard' : '/gym/dashboard');
    } else {
      setError(result.message || 'Invalid credentials.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mb-5 shadow-2xl shadow-indigo-500/30">
            <Dumbbell className="text-white" size={36} />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">GymPro</h1>
          <p className="text-indigo-300/80 mt-2 text-lg">Management Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Role tabs */}
          <div className="flex gap-1 mb-7 bg-gray-100 rounded-xl p-1">
            <button
              type="button"
           //   onClick={() => { setRole('admin'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                role === 'admin'
                  ? 'bg-white shadow-md text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Shield size={16} />
              Super Admin
            </button>
            <button
              type="button"
            //  onClick={() => { setRole('gym'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                role === 'gym'
                  ? 'bg-white shadow-md text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Building2 size={16} />
              Gym Manager
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder={role === 'admin' ? 'superadmin' : 'gymmanager'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="password"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-center text-xs text-gray-400">
              Demo: any username with password <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">password</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

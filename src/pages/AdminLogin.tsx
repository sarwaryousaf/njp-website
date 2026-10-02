import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isSupabaseConfigured) {
      setError('Admin sign-in is unavailable until Supabase is configured.');
      return;
    }

    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError || data.user?.app_metadata?.role !== 'admin') {
        await supabase.auth.signOut();
        setError('Unable to sign in with these credentials.');
      } else {
        navigate('/admin/dashboard');
      }
    } catch {
      setError('Unable to sign in right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-emerald-500/10 text-emerald-400 rounded-xl mb-3">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">NJP Admin Portal</h2>
          <p className="text-slate-400 text-sm mt-1">Sign in to manage tours, bookings, and site settings</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@njptours.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-semibold rounded-xl transition duration-200 shadow-lg shadow-emerald-600/30 text-sm mt-2"
          >
            {loading ? 'Signing in...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};
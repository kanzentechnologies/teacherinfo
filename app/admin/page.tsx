'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // First let's check if the mock credentials were used so we can show a prompt
    if (email === 'admin@teacherinfo.net' && password === 'admin123') {
      setError('Please use the real admin credentials created in Supabase Authentication.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.session) {
        // Successful login
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="bg-white border border-border-main w-full max-w-md p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary mx-auto flex items-center justify-center text-white font-bold text-xl rounded-sm mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-primary">Admin Login</h1>
          <p className="text-sm text-text-muted mt-2">Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-sm mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-text-main mb-2" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-border-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-text-main mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-border-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white font-bold py-2.5 px-4 rounded-sm hover:bg-secondary transition-colors"
          >
            Login to Dashboard
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-text-muted">
          <p>Login with your Supabase authenticated account.</p>
        </div>
      </div>
    </div>
  );
}

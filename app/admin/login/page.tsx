'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (email.trim() === 'admin@breezy.kz' && password === 'Password123!') {
      localStorage.setItem('breezy_admin_logged', 'true');
      router.push('/admin');
    } else {
      setError('Неверный логин или пароль');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 border border-black/10 shadow-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-black uppercase tracking-wider">Вход в Админку</h1>
          <p className="text-xs text-neutral-500 mt-1">Панель управления BREEZY</p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 text-xs font-semibold rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-black/20 text-sm focus:outline-none focus:border-black"
              placeholder="admin@breezy.kz"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase mb-1">Пароль</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-black/20 text-sm focus:outline-none focus:border-black"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-bold py-3 text-xs uppercase tracking-wider hover:bg-neutral-800 transition disabled:opacity-50"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  );
}
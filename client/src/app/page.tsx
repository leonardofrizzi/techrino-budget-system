'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showModal && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (showModal && countdown === 0) {
      router.push('/dashboard');
    }
    return () => clearTimeout(timer);
  }, [showModal, countdown, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const body: { email: string; password: string; name?: string } = { email, password };
      if (mode === 'signup') body.name = name;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Request failed');

      localStorage.setItem('token', data.token);

      if (mode === 'login') {
        router.push('/dashboard');
      } else {
        setShowModal(true);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      setLoading(false);
    }
  };

  const goNow = () => router.push('/dashboard');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-white p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold"><span className="text-blue-400">Tech</span>rino</h1>
          <p className="text-slate-400 mt-2">Quote Management System</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl p-8 shadow-2xl relative">
          <div className="flex justify-around mb-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`px-4 py-2 font-medium ${mode === 'login' ? 'text-white border-b-2 border-blue-400' : 'text-slate-400'}`}
            >Login</button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); }}
              className={`px-4 py-2 font-medium ${mode === 'signup' ? 'text-white border-b-2 border-blue-400' : 'text-slate-400'}`}
            >Sign Up</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required className="w-full p-3 rounded bg-white/20 placeholder-slate-300" disabled={loading}/>
            )}
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full p-3 rounded bg-white/20 placeholder-slate-300" disabled={loading}/>
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-3 rounded bg-white/20 placeholder-slate-300" disabled={loading}/>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-medium flex items-center justify-center">
              {loading && <Loader2 className="animate-spin mr-2" size={20}/>} {mode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>
        </div>
        <p className="text-center mt-6 text-slate-400 text-sm">&copy; 2025 Techrino. All rights reserved.</p>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg text-center text-slate-800 max-w-sm mx-4">
            <p className="text-lg mb-4">Obrigado por se cadastrar!</p>
            <p className="mb-4">Você será redirecionado ao dashboard em {countdown} segundos.</p>
            <button onClick={goNow} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg">Ir para Dashboard</button>
          </div>
        </div>
      )}
    </div>
  );
}

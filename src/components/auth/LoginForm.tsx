'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', { email, password });

      if (response.data.success) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Inicio de sesión exitoso');

        if (response.data.user.userType === 'professional') {
          router.push('/dashboard/professional');
        } else {
          router.push('/dashboard/patient');
        }
      } else {
        toast.error(response.data.message || 'Error al iniciar sesión');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error del servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-cyan-600 px-4 py-2.5 font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50"
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, RoleType, Gender } from '../types';
import { MOCK_USER } from '../constants';
import { LogIn } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      // 1. Check for specific Admin credentials
      if (identifier === 'art@art') {
        const adminUser: User = {
          ...MOCK_USER,
          id: 'admin-01',
          name: 'Super Admin',
          username: 'art@art',
          email: 'art@art',
          role: RoleType.ADMIN,
          level: 99,
          totalXP: 999999,
          avatarUrl: 'https://ui-avatars.com/api/?name=Admin+Pusat&background=0D8ABC&color=fff'
        };
        onLogin(adminUser);
        navigate('/');
      } 
      // 2. Musyrif Test Account
      else if (identifier === 'musyrif@insan') {
         const musyrifUser: User = {
             ...MOCK_USER,
             id: 'musyrif-01',
             name: 'Ustadz Fulan',
             username: 'musyrif@insan',
             email: 'musyrif@insan',
             role: RoleType.MUSYRIF,
             level: 5,
             totalXP: 3000,
             gender: Gender.IKHWAN,
             avatarUrl: 'https://ui-avatars.com/api/?name=Ustadz+Fulan&background=0D8ABC&color=fff'
         };
         onLogin(musyrifUser);
         navigate('/');
      }
      // 3. Musyrif Muda Test Account (NEW)
      else if (identifier === 'muda@insan') {
         const mudaUser: User = {
             ...MOCK_USER,
             id: 'muda-01',
             name: 'Salman Al-Farisi',
             username: 'muda@insan',
             email: 'muda@insan',
             role: RoleType.MUSYRIF_MUDA,
             level: 4,
             totalXP: 2600,
             gender: Gender.IKHWAN,
             avatarUrl: 'https://ui-avatars.com/api/?name=Salman+Muda&background=random'
         };
         onLogin(mudaUser);
         navigate('/');
      }
      // 4. Demo User (Regular Member)
      else if (identifier === 'demo@insan') {
         onLogin(MOCK_USER);
         navigate('/');
      }
      // 5. Reject all other logins
      else {
        setError('Akun tidak ditemukan. Silakan daftar akun baru.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-12 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                <LogIn className="text-white" size={32} />
            </div>
        </div>
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-slate-900">
          Masuk ke INSAN
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Ecosystem for Productive Muslims
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium leading-6 text-slate-900">
              Username atau Email
            </label>
            <div className="mt-2">
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="block w-full rounded-lg border-0 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                placeholder="Contoh: art@art"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-900">
                Password
              </label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">
                  Lupa password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border-0 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-100 animate-pulse">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-lg bg-blue-600 px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-70 transition-all"
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-slate-500">
          Belum punya akun?{' '}
          <Link to="/register" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
            Daftar sekarang
          </Link>
        </p>

        <div className="mt-6 border-t border-slate-100 pt-4 text-center">
            <p className="text-xs text-slate-400 mb-2">Akun Testing Tersedia:</p>
            <div className="flex flex-wrap justify-center gap-2 text-[10px]">
                <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">art@art (Admin)</span>
                <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">musyrif@insan</span>
                <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">muda@insan</span>
                <span className="bg-slate-100 px-2 py-1 rounded text-slate-600">demo@insan</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

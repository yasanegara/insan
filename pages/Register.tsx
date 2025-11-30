import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, RoleType, Gender } from '../types';
import { UserPlus } from 'lucide-react';

interface RegisterProps {
  onLogin: (user: User) => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [gender, setGender] = useState<Gender>(Gender.IKHWAN); // Default Ikhwan
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    city: '',
    whatsapp: '',
    password: '',
    referralCode: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate registration API call
    setTimeout(() => {
      // Create initial history with 0 XP for past days, and maybe some dummy data for "Starter Pack" context
      const days = ['Sn', 'Sl', 'Rb', 'Km', 'Jm', 'Sb', 'Mg'];
      const initialHistory = days.map(day => ({ day, xp: 0 }));

      const bgColor = gender === Gender.IKHWAN ? '0D8ABC' : 'EC4899'; // Blue for Ikhwan, Pink for Akhwat

      const newUser: User = {
        id: `u-${Date.now()}`,
        name: formData.name,
        username: formData.username.startsWith('@') ? formData.username : `@${formData.username}`,
        email: formData.email,
        city: formData.city,
        whatsapp: formData.whatsapp,
        gender: gender,
        role: RoleType.NEWBIE,
        level: 0,
        totalXP: 0,
        referralCode: `INSAN-${Math.floor(Math.random() * 1000)}`,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=${bgColor}&color=fff`,
        joinDate: new Date().toISOString().split('T')[0],
        streakDays: 0,
        velocityHistory: initialHistory
      };

      onLogin(newUser);
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-8 bg-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-colors duration-300 ${gender === Gender.IKHWAN ? 'bg-slate-900' : 'bg-pink-600'}`}>
                <UserPlus className="text-white" size={32} />
            </div>
        </div>
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-slate-900">
          Daftar Akun Baru
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Mulai perjalanan produktivitasmu
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* Gender Selection */}
          <div className="bg-slate-100 p-1 rounded-lg flex relative">
            <div 
                className={`absolute top-1 bottom-1 w-[48%] bg-white rounded shadow-sm transition-all duration-300 ${gender === Gender.AKHWAT ? 'translate-x-[104%]' : 'translate-x-[1%]'}`} 
            />
            <button
                type="button"
                onClick={() => setGender(Gender.IKHWAN)}
                className={`flex-1 py-2 text-sm font-bold relative z-10 transition-colors ${gender === Gender.IKHWAN ? 'text-blue-700' : 'text-slate-500'}`}
            >
                Ikhwan (Pria)
            </button>
            <button
                type="button"
                onClick={() => setGender(Gender.AKHWAT)}
                className={`flex-1 py-2 text-sm font-bold relative z-10 transition-colors ${gender === Gender.AKHWAT ? 'text-pink-600' : 'text-slate-500'}`}
            >
                Akhwat (Wanita)
            </button>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-3">
             <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                />
             </div>
             <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Username</label>
                <input
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
                />
             </div>
          </div>

          {/* Contact Info */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
            <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full rounded-lg border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Nomor WhatsApp</label>
            <input
                name="whatsapp"
                type="tel"
                required
                placeholder="08xxxxxxxxxx"
                value={formData.whatsapp}
                onChange={handleChange}
                className="block w-full rounded-lg border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Kota Domisili</label>
            <input
                name="city"
                type="text"
                required
                value={formData.city}
                onChange={handleChange}
                className="block w-full rounded-lg border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
            />
          </div>

          {/* Security & Referral */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
            <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded-lg border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Kode Referral (Opsional)</label>
            <input
                name="referralCode"
                type="text"
                value={formData.referralCode}
                onChange={handleChange}
                placeholder="Contoh: INSAN-99X"
                className="block w-full rounded-lg border-0 py-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 px-3 bg-slate-50"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex w-full justify-center rounded-lg px-3 py-3 text-sm font-semibold leading-6 text-white shadow-sm disabled:opacity-70 transition-all ${gender === Gender.IKHWAN ? 'bg-slate-900 hover:bg-slate-800' : 'bg-pink-600 hover:bg-pink-500'}`}
            >
              {isLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Sudah punya akun?{' '}
          <Link to="/login" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
            Masuk disini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
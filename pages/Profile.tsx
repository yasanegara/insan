import React from 'react';
import { User, RoleType } from '../types';
import { Copy, Share2, Award, BookOpen, Settings } from 'lucide-react';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const roles = Object.values(RoleType);
  const currentRoleIndex = roles.indexOf(user.role);

  const copyReferral = () => {
    navigator.clipboard.writeText(user.referralCode);
    alert('Kode Referral disalin!');
  };

  return (
    <div className="pb-24 pt-4 px-4 space-y-6">
      
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center">
        <div className="relative mb-4">
            <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-24 h-24 rounded-full border-4 border-slate-50 object-cover"
            />
            <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white">
                <Award size={16} />
            </div>
        </div>
        <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
        <p className="text-slate-500 text-sm mb-4">{user.username}</p>
        
        <div className="flex gap-2 w-full">
            <button className="flex-1 bg-slate-50 text-slate-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 border border-slate-200">
                <Settings size={16} /> Edit
            </button>
            <button className="flex-1 bg-blue-50 text-blue-700 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 border border-blue-100">
                <BookOpen size={16} /> Report
            </button>
        </div>
      </div>

      {/* Referral System */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-lg">
        <h3 className="font-bold mb-1">Undang Teman</h3>
        <p className="text-slate-300 text-xs mb-4">Dapatkan +500 XP untuk setiap teman aktif.</p>
        
        <div className="bg-white/10 rounded-lg p-1 flex items-center justify-between pl-3 border border-white/10">
            <code className="font-mono font-bold tracking-wider">{user.referralCode}</code>
            <div className="flex">
                <button onClick={copyReferral} className="p-2 hover:bg-white/10 rounded-md transition-colors">
                    <Copy size={18} />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-md transition-colors text-blue-300">
                    <Share2 size={18} />
                </button>
            </div>
        </div>
      </div>

      {/* Career Path (Micro Leveling) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h3 className="font-bold text-slate-800 mb-6">Jenjang Karir</h3>
        <div className="relative pl-4 border-l-2 border-slate-100 space-y-8">
            {roles.map((role, idx) => {
                const isPassed = idx <= currentRoleIndex;
                const isCurrent = idx === currentRoleIndex;

                if (role === RoleType.ADMIN) return null; // Don't show admin in typical path

                return (
                    <div key={role} className="relative">
                        <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 ${
                            isPassed 
                                ? 'bg-blue-600 border-blue-600' 
                                : 'bg-white border-slate-300'
                        }`}></div>
                        
                        <div className={`${!isPassed && 'opacity-50'}`}>
                            <h4 className={`text-sm font-bold ${isCurrent ? 'text-blue-600' : 'text-slate-800'}`}>
                                {role}
                            </h4>
                            {isCurrent && (
                                <p className="text-xs text-slate-500 mt-1">
                                    Posisi Anda saat ini. Pertahankan konsistensi untuk naik tingkat.
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 py-4">
        INSAN Ecosystem v1.0.0
      </div>
    </div>
  );
};

export default Profile;
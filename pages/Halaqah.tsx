
import React from 'react';
import { JALSAH_LEADERBOARD } from '../constants';
import { TrendingUp, TrendingDown, Minus, Trophy, Users, Check, X, Mail } from 'lucide-react';
import { User, JalsahInvitation } from '../types';

interface HalaqahPageProps {
  user?: User; // Optional because Router usage might render it without props if we weren't careful, but we fixed App.tsx
  invitations?: JalsahInvitation[];
  onAcceptInvitation?: (id: string) => void;
  onRejectInvitation?: (id: string) => void;
}

const HalaqahPage: React.FC<HalaqahPageProps> = ({ 
    user, 
    invitations = [], 
    onAcceptInvitation, 
    onRejectInvitation 
}) => {

  // If user has no halaqah, check invitations
  if (user && !user.jalsahId) {
      // Filter invitations for this user (mock logic: assume invites are relevant if pending)
      // In real app, filter by user.id or username
      const myInvitations = invitations.filter(i => 
          (i.targetUsername === user.username || i.targetUsername === user.username.replace('@', '')) && 
          i.status === 'pending'
      );

      return (
        <div className="pb-24 pt-4 px-4 space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Halaqah Virtual</h2>
                <p className="text-slate-500 text-sm">Bergabung dengan lingkaran kebaikan.</p>
            </div>

            {myInvitations.length > 0 ? (
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                        <Mail size={16} /> Undangan Masuk
                    </h3>
                    {myInvitations.map(invite => (
                        <div key={invite.id} className="bg-white p-5 rounded-xl border border-blue-100 shadow-lg shadow-blue-50">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg">{invite.jalsahName}</h4>
                                    <p className="text-sm text-slate-500">Musyrif: {invite.musyrifName}</p>
                                </div>
                                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full border border-blue-100">
                                    Undangan
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mb-4">Dikirim pada: {invite.timestamp}</p>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => onRejectInvitation && onRejectInvitation(invite.id)}
                                    className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium flex items-center justify-center gap-1 hover:bg-slate-50"
                                >
                                    <X size={16} /> Tolak
                                </button>
                                <button 
                                    onClick={() => onAcceptInvitation && onAcceptInvitation(invite.id)}
                                    className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold flex items-center justify-center gap-1 hover:bg-blue-700 shadow-md shadow-blue-200"
                                >
                                    <Check size={16} /> Terima
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-100 border-dashed">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                        <Users size={32} />
                    </div>
                    <h3 className="font-bold text-slate-700">Belum Ada Halaqah</h3>
                    <p className="text-sm text-slate-500 mt-2">
                        Anda belum tergabung dalam halaqah manapun. 
                        Silakan tunggu undangan dari Musyrif atau hubungi admin.
                    </p>
                </div>
            )}
        </div>
      );
  }

  // Active Halaqah View
  return (
    <div className="pb-24 pt-4 px-4 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Halaqah Al-Fatih</h2>
        <p className="text-slate-500 text-sm">Fastabiqul Khairat (Berlomba dalam kebaikan)</p>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white flex items-center justify-between shadow-md">
        <div>
            <p className="text-indigo-100 text-xs font-medium">Jadwal Evaluasi</p>
            <h3 className="font-bold text-lg">Jumat, 20:00 WIB</h3>
            <p className="text-xs text-indigo-100 opacity-80 mt-1">Via Zoom Meeting</p>
        </div>
        <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
            <Users size={24} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-700">Leaderboard Pekanan</h3>
            <span className="text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-500">
                Week 42
            </span>
        </div>
        
        <div className="divide-y divide-slate-50">
            {JALSAH_LEADERBOARD.sort((a,b) => a.rank - b.rank).map((entry) => (
                <div key={entry.id} className="p-4 flex items-center gap-4">
                    <div className="w-8 font-bold text-slate-400 text-center text-sm">
                        {entry.rank === 1 ? <Trophy size={20} className="text-yellow-500 mx-auto" /> : `#${entry.rank}`}
                    </div>
                    
                    <img src={entry.avatarUrl} alt={entry.name} className="w-10 h-10 rounded-full object-cover" />
                    
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-800 text-sm">{entry.name}</h4>
                        <p className="text-xs text-slate-500">{entry.weeklyXP.toLocaleString()} XP</p>
                    </div>

                    <div className="text-xs">
                        {entry.trend === 'up' && <TrendingUp className="text-green-500" size={16} />}
                        {entry.trend === 'down' && <TrendingDown className="text-red-500" size={16} />}
                        {entry.trend === 'stable' && <Minus className="text-slate-400" size={16} />}
                    </div>
                </div>
            ))}
        </div>
      </div>

      <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
        <p className="text-orange-800 text-sm font-medium">
            "Dan berlomba-lombalah kamu dalam kebaikan."
        </p>
        <p className="text-orange-600 text-xs mt-1">(QS. Al-Baqarah: 148)</p>
      </div>
    </div>
  );
};

export default HalaqahPage;

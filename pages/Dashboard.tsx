
import React from 'react';
import { User, Gender, RoleType, MissionItem, PeranType, Kajian, Jalsah, Article, JalsahInvitation } from '../types';
import { getProgressToNextLevel } from '../constants';
import VelocityChart from '../components/VelocityChart';
import AdminDashboard from './AdminDashboard';
import MusyrifDashboard from './MusyrifDashboard';
import { Zap, Target, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  user: User;
  missions: MissionItem[];
  onUpdateMissions: (missions: MissionItem[]) => void;
  roleUnlockConfig: Record<PeranType, number>;
  onUpdateRoleConfig: (config: Record<PeranType, number>) => void;
  
  // New Props for Musyrif/Admin Features
  kajians: Kajian[];
  onUpdateKajianStatus: (id: string, status: 'approved' | 'rejected') => void;
  articles: Article[];
  onCreateArticle: (article: Article) => void;
  onUpdateArticleStatus: (id: string, status: 'approved' | 'rejected') => void;
  jalsahs: Jalsah[];
  onCreateKajian: (kajian: Kajian) => void;
  onCreateJalsah: (jalsah: Jalsah) => void;
  onUpdateJalsah: (jalsah: Jalsah) => void;
  onDeleteJalsah: (id: string) => void;
  onUpdateJalsahStatus: (id: string, status: 'approved' | 'rejected', reason?: string) => void;
  onAddMemberToJalsah: (jalsahId: string, memberId: string) => void;
  onSendInvitation: (invitation: JalsahInvitation) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    user, 
    missions, 
    onUpdateMissions, 
    roleUnlockConfig, 
    onUpdateRoleConfig,
    kajians,
    onUpdateKajianStatus,
    articles,
    onCreateArticle,
    onUpdateArticleStatus,
    jalsahs,
    onCreateKajian,
    onCreateJalsah,
    onUpdateJalsah,
    onDeleteJalsah,
    onUpdateJalsahStatus,
    onAddMemberToJalsah,
    onSendInvitation
}) => {
  const navigate = useNavigate();

  // Redirect to Admin Dashboard if user is Admin
  if (user.role === RoleType.ADMIN) {
    return (
        <AdminDashboard 
            user={user} 
            missions={missions} 
            onUpdateMissions={onUpdateMissions}
            roleUnlockConfig={roleUnlockConfig}
            onUpdateRoleConfig={onUpdateRoleConfig}
            kajians={kajians}
            onUpdateKajianStatus={onUpdateKajianStatus}
            articles={articles}
            onUpdateArticleStatus={onUpdateArticleStatus}
            jalsahs={jalsahs}
            onUpdateJalsahStatus={onUpdateJalsahStatus}
            onDeleteJalsah={onDeleteJalsah}
        />
    );
  }

  // Redirect to Musyrif Dashboard if user is Musyrif or Musyrif Muda
  if (user.role === RoleType.MUSYRIF || user.role === RoleType.MUSYRIF_MUDA) {
      return (
        <MusyrifDashboard 
            user={user} 
            jalsahs={jalsahs}
            kajians={kajians}
            articles={articles}
            onCreateJalsah={onCreateJalsah}
            onUpdateJalsah={onUpdateJalsah}
            onDeleteJalsah={onDeleteJalsah}
            onCreateKajian={onCreateKajian}
            onCreateArticle={onCreateArticle}
            onAddMemberToJalsah={onAddMemberToJalsah}
            onSendInvitation={onSendInvitation}
        />
      );
  }

  const levelProgress = getProgressToNextLevel(user.totalXP, user.level);
  
  // Gender specific styling
  const isIkhwan = user.gender === Gender.IKHWAN;
  const cardGradient = isIkhwan ? 'from-blue-600 to-indigo-700' : 'from-pink-500 to-rose-600';
  const shadowColor = isIkhwan ? 'shadow-blue-200' : 'shadow-pink-200';
  const chartColor = isIkhwan ? '#2563eb' : '#db2777';
  const cardIconColor = isIkhwan ? 'text-indigo-800' : 'text-pink-800';
  const cardBg = isIkhwan ? 'bg-indigo-50 border-indigo-100' : 'bg-pink-50 border-pink-100';

  return (
    <div className="pb-24 pt-4 px-4 space-y-6 animate-fade-in">
      {/* Welcome & Identity */}
      <div className="flex justify-between items-center px-1">
        <div>
           <p className="text-xs text-slate-500">Assalamu'alaikum,</p>
           <h2 className="text-lg font-bold text-slate-800">{user.name}</h2>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${isIkhwan ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-pink-50 text-pink-600 border-pink-100'}`}>
            {user.gender}
        </span>
      </div>

      {/* Level Card */}
      <div className={`bg-gradient-to-br ${cardGradient} rounded-2xl p-5 text-white shadow-lg ${shadowColor} relative overflow-hidden`}>
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Zap size={120} />
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">Status Saat Ini</p>
              <h2 className="text-2xl font-bold">{user.role}</h2>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
              <span className="text-sm font-bold">Level {user.level}</span>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-xs text-white/80 mb-1">
              <span>Progress Level</span>
              <span>{user.totalXP} / {levelProgress.nextXP} XP</span>
            </div>
            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-1000"
                style={{ width: `${levelProgress.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-white/80 mt-2">
              Kurang {levelProgress.needed} XP lagi untuk naik level.
            </p>
          </div>
        </div>
      </div>

      {/* Daily Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div 
            onClick={() => navigate('/missions')}
            className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <Target size={20} />
          </div>
          <div className="text-center">
            <p className="text-slate-500 text-xs">Misi Harian</p>
            {/* Note: This static 4/7 would ideally be dynamic based on Missions.tsx state */}
            <p className="text-slate-800 font-bold text-lg">Active</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
            <Zap size={20} />
          </div>
          <div className="text-center">
            <p className="text-slate-500 text-xs">Streak</p>
            <p className="text-slate-800 font-bold text-lg">{user.streakDays} Hari</p>
          </div>
        </div>
      </div>

      {/* Velocity Graph */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-slate-800">Grafik Velocity</h3>
            <p className="text-xs text-slate-500">Performa XP 7 Hari Terakhir</p>
          </div>
          {/* Simple logic to check trend */}
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
             {user.velocityHistory[user.velocityHistory.length - 1].xp >= user.velocityHistory[user.velocityHistory.length - 2].xp ? 'Naik' : 'Turun'}
          </span>
        </div>
        <VelocityChart data={user.velocityHistory} color={chartColor} />
      </div>

      {/* Next Steps / CTA */}
      <div className={`${cardBg} p-4 rounded-xl border`}>
        <h3 className={`font-bold ${cardIconColor} mb-2 text-sm`}>Target Minggu Ini</h3>
        <ul className="space-y-2">
            <li className={`flex items-center gap-2 text-sm ${cardIconColor}`}>
                <Users size={16} />
                <span>Rekrut 1 member baru (+500 XP)</span>
            </li>
            <li className={`flex items-center gap-2 text-sm ${cardIconColor}`}>
                <Target size={16} />
                <span>Hadir Jalsah Pekanan (+200 XP)</span>
            </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

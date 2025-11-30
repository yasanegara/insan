
import React, { useState } from 'react';
import { User, Gender, RoleType, Jalsah, Kajian, Article, PeranType, JalsahInvitation } from '../types';
import { Users, CheckCircle, MessageCircle, AlertCircle, Clock, Award, Plus, X, UserPlus, Edit, Trash2, PenTool, Layout, Calendar, TrendingUp, Activity, FileText } from 'lucide-react';
import VelocityChart from '../components/VelocityChart';

interface MusyrifDashboardProps {
  user: User;
  jalsahs: Jalsah[];
  kajians: Kajian[];
  articles: Article[];
  onCreateJalsah: (jalsah: Jalsah) => void;
  onUpdateJalsah: (jalsah: Jalsah) => void;
  onDeleteJalsah: (id: string) => void;
  onCreateKajian: (kajian: Kajian) => void;
  onCreateArticle: (article: Article) => void;
  onAddMemberToJalsah: (jalsahId: string, memberId: string) => void;
  onSendInvitation: (invitation: JalsahInvitation) => void;
}

// Enhanced Mock Mentee interface
interface Mentee {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  level: number;
  totalXP: number;
  streak: number;
  joinDate: string;
  lastActive: string;
  status: 'active' | 'warning' | 'dormant';
  attendanceConfirmed: boolean;
  history: { day: string; xp: number }[]; // For Velocity Chart
  missionLog: { date: string; title: string; xp: number }[]; // Recent Activities
}

const MusyrifDashboard: React.FC<MusyrifDashboardProps> = ({ 
    user, 
    jalsahs, 
    kajians, 
    articles,
    onCreateJalsah, 
    onUpdateJalsah,
    onDeleteJalsah,
    onCreateKajian, 
    onCreateArticle,
    onAddMemberToJalsah,
    onSendInvitation
}) => {
  const isIkhwan = user.gender === Gender.IKHWAN;
  const bgColor = isIkhwan ? 'bg-blue-600' : 'bg-pink-600';
  const lightBg = isIkhwan ? 'bg-blue-50' : 'bg-pink-50';
  const textColor = isIkhwan ? 'text-blue-700' : 'text-pink-700';
  const borderColor = isIkhwan ? 'border-blue-100' : 'border-pink-100';
  const chartColor = isIkhwan ? '#2563eb' : '#db2777';

  const [activeTab, setActiveTab] = useState<'jalsah' | 'kajian' | 'tulisan'>('jalsah');

  // Logic for Role-based Targets
  const isMuda = user.role === RoleType.MUSYRIF_MUDA;
  const targetJalsah = isMuda ? 1 : 2;
  const targetKajian = isMuda ? 1 : 2;
  const targetArticle = isMuda ? 1 : 2;

  // Jalsah Creation/Edit State
  const [showCreateJalsah, setShowCreateJalsah] = useState(false);
  const [editingJalsah, setEditingJalsah] = useState<Jalsah | null>(null);
  const [newJalsahName, setNewJalsahName] = useState('');
  const [newJalsahTime, setNewJalsahTime] = useState('');
  const [newJalsahDesc, setNewJalsahDesc] = useState('');
  
  const [inviteUsername, setInviteUsername] = useState('');
  const [activeInviteId, setActiveInviteId] = useState<string | null>(null); 
  
  // Member Detail State
  const [selectedMentee, setSelectedMentee] = useState<Mentee | null>(null);

  // Kajian Creation State
  const [showCreateKajian, setShowCreateKajian] = useState(false);
  const [newKajian, setNewKajian] = useState<{title: string; desc: string; category: PeranType; date: string; isPaid: boolean; price: number}>({
      title: '', desc: '', category: PeranType.MUSLIM, date: '', isPaid: false, price: 0
  });

  // Article Creation State
  const [showCreateArticle, setShowCreateArticle] = useState(false);
  const [newArticle, setNewArticle] = useState<{title: string; category: PeranType; content: string}>({
      title: '', category: PeranType.MUSLIM, content: ''
  });

  // Filter Data
  const myJalsahs = jalsahs.filter(h => h.musyrifId === user.id);
  const myKajians = kajians.filter(k => k.musyrifId === user.id);
  const myArticles = articles.filter(a => a.musyrifId === user.id);

  // Stats for KPI
  const actualJalsah = myJalsahs.length;
  const actualKajian = myKajians.length;
  const actualArticle = myArticles.length;

  // Mock Mentees
  const [mentees, setMentees] = useState<Mentee[]>([
    { 
        id: 'm1', 
        name: 'Ahmad Fulan', 
        username: '@ahmad_f',
        avatarUrl: 'https://ui-avatars.com/api/?name=Ahmad&background=random', 
        level: 2, 
        totalXP: 1250,
        streak: 12,
        joinDate: '2023-10-01',
        lastActive: '2m ago', 
        status: 'active', 
        attendanceConfirmed: true,
        history: [
            { day: 'Sn', xp: 200 }, { day: 'Sl', xp: 450 }, { day: 'Rb', xp: 300 }, 
            { day: 'Km', xp: 400 }, { day: 'Jm', xp: 500 }, { day: 'Sb', xp: 350 }, { day: 'Mg', xp: 600 }
        ],
        missionLog: [
            { date: 'Hari Ini', title: 'Sholat Subuh Berjamaah', xp: 99 },
            { date: 'Hari Ini', title: 'Tilawah 1 Juz', xp: 99 },
            { date: 'Kemarin', title: 'Sedekah Subuh', xp: 20 },
            { date: 'Kemarin', title: 'Hadir Jalsah', xp: 200 },
        ]
    },
    { 
        id: 'm2', 
        name: 'Budi Santoso', 
        username: '@budi_san',
        avatarUrl: 'https://ui-avatars.com/api/?name=Budi&background=random', 
        level: 1, 
        totalXP: 550,
        streak: 3,
        joinDate: '2023-11-15',
        lastActive: '5h ago', 
        status: 'warning', 
        attendanceConfirmed: false,
        history: [
            { day: 'Sn', xp: 100 }, { day: 'Sl', xp: 50 }, { day: 'Rb', xp: 0 }, 
            { day: 'Km', xp: 150 }, { day: 'Jm', xp: 100 }, { day: 'Sb', xp: 200 }, { day: 'Mg', xp: 50 }
        ],
        missionLog: [
            { date: 'Hari Ini', title: 'Sholat Dhuha', xp: 20 },
            { date: 'Kemarin', title: 'Bekerja Profesional', xp: 33 },
        ]
    },
  ]);

  const openCreateJalsah = () => {
    setEditingJalsah(null);
    setNewJalsahName('');
    setNewJalsahTime('');
    setNewJalsahDesc('');
    setShowCreateJalsah(true);
  };

  const openEditJalsah = (jalsah: Jalsah) => {
    setEditingJalsah(jalsah);
    setNewJalsahName(jalsah.name);
    setNewJalsahTime(jalsah.meetingTime);
    setNewJalsahDesc(jalsah.description || '');
    setShowCreateJalsah(true);
  };

  const handleCreateOrUpdateJalsahSubmit = () => {
      if (!newJalsahName) return;
      
      if (editingJalsah) {
        // Update existing
        const updated: Jalsah = {
          ...editingJalsah,
          name: newJalsahName,
          meetingTime: newJalsahTime || 'Belum diatur',
          description: newJalsahDesc,
          status: 'pending' // Re-validate upon edit?
        };
        onUpdateJalsah(updated);
      } else {
        // Create new
        const jalsah: Jalsah = {
            id: `h-${Date.now()}`,
            name: newJalsahName,
            musyrifId: user.id,
            memberIds: [],
            meetingTime: newJalsahTime || 'Belum diatur',
            description: newJalsahDesc,
            status: 'pending'
        };
        onCreateJalsah(jalsah);
      }
      setShowCreateJalsah(false);
  };

  const handleDeleteJalsahClick = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus Jalsah ini?")) {
      onDeleteJalsah(id);
    }
  };

  const handleInviteMember = (jalsah: Jalsah) => {
      if (!inviteUsername) return;
      
      const invitation: JalsahInvitation = {
          id: `invite-${Date.now()}`,
          jalsahId: jalsah.id,
          jalsahName: jalsah.name,
          musyrifName: user.name,
          memberId: `u-${Date.now()}`, // Placeholder ID
          targetUsername: inviteUsername,
          status: 'pending',
          timestamp: new Date().toLocaleDateString()
      };
      
      onSendInvitation(invitation);
      setInviteUsername('');
      setActiveInviteId(null);
      alert(`Undangan dikirim ke ${inviteUsername}. Member harus menyetujui (Login sebagai member terkait untuk melihat invite).`);
  };

  const handleCreateKajianSubmit = () => {
      if (!newKajian.title || !newKajian.date) return;
      const kajian: Kajian = {
          id: `k-${Date.now()}`,
          title: newKajian.title,
          description: newKajian.desc,
          category: newKajian.category,
          musyrifId: user.id,
          musyrifName: user.name,
          date: newKajian.date,
          isPaid: newKajian.isPaid,
          price: newKajian.isPaid ? newKajian.price : 0,
          status: 'pending'
      };
      onCreateKajian(kajian);
      setShowCreateKajian(false);
      setNewKajian({ title: '', desc: '', category: PeranType.MUSLIM, date: '', isPaid: false, price: 0 });
  };

  const handleCreateArticleSubmit = () => {
    if (!newArticle.title || !newArticle.content) return;
    const article: Article = {
        id: `a-${Date.now()}`,
        title: newArticle.title,
        category: newArticle.category,
        content: newArticle.content,
        musyrifId: user.id,
        musyrifName: user.name,
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
    };
    onCreateArticle(article);
    setShowCreateArticle(false);
    setNewArticle({ title: '', category: PeranType.MUSLIM, content: '' });
  };

  const handleSapa = (mentee: Mentee, e: React.MouseEvent) => {
    e.stopPropagation();
    const greeting = isIkhwan ? "Assalamu'alaikum Akhi" : "Assalamu'alaikum Ukhti";
    const message = `${greeting} ${mentee.name}, bagaimana kabarnya hari ini? Jangan lupa isi checklist amal yauminya ya. Semangat!`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleValidateAttendance = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMentees(prev => prev.map(m => 
      m.id === id ? { ...m, attendanceConfirmed: !m.attendanceConfirmed } : m
    ));
  };

  const renderProgressBar = (actual: number, target: number, label: string) => {
      const progress = Math.min((actual / target) * 100, 100);
      return (
          <div className="mb-2">
              <div className="flex justify-between text-[10px] mb-1">
                  <span className="font-bold text-slate-600">{label}</span>
                  <span className={`${actual >= target ? 'text-green-600' : 'text-slate-500'}`}>{actual} / {target}</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${actual >= target ? 'bg-green-500' : 'bg-slate-400'}`} style={{ width: `${progress}%` }}></div>
              </div>
          </div>
      );
  };

  return (
    <div className="pb-24 pt-4 px-4 space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-center px-1">
        <div>
           <p className="text-xs text-slate-500">Dashboard Pembina</p>
           <h2 className={`text-lg font-bold text-slate-800`}>
             {isIkhwan ? 'Musyrif' : 'Musyrifah'} Area
           </h2>
        </div>
        <div className="flex items-center gap-2">
            <span className={`text-[10px] px-3 py-1 rounded-full border ${lightBg} ${textColor} ${borderColor} flex items-center gap-1`}>
                <Award size={12} /> {user.level}
            </span>
        </div>
      </div>

      {/* KPI Stats Card */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Target Bulanan</h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Status: {user.role}</span>
          </div>
          {renderProgressBar(actualJalsah, targetJalsah, "Jalsah Binaan")}
          {renderProgressBar(actualKajian, targetKajian, "Kajian / Kelas")}
          {renderProgressBar(actualArticle, targetArticle, "Tulisan (Artikel)")}
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-100">
        <button 
            onClick={() => setActiveTab('jalsah')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'jalsah' ? `${lightBg} ${textColor} font-bold` : 'text-slate-500'}`}
        >
            Jalsah
        </button>
        <button 
            onClick={() => setActiveTab('kajian')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'kajian' ? `${lightBg} ${textColor} font-bold` : 'text-slate-500'}`}
        >
            Kelas
        </button>
        <button 
            onClick={() => setActiveTab('tulisan')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'tulisan' ? `${lightBg} ${textColor} font-bold` : 'text-slate-500'}`}
        >
            Tulisan
        </button>
      </div>

      {/* --- JALSAH TAB --- */}
      {activeTab === 'jalsah' && (
        <div className="space-y-6">
            <div className={`${lightBg} p-4 rounded-xl border ${borderColor} flex justify-between items-center`}>
                <div>
                    <h3 className={`font-bold ${textColor} text-sm`}>Kelompok Jalsah</h3>
                    <p className={`text-xs ${textColor} opacity-80`}>Kelola kelompok binaan Anda.</p>
                </div>
                <button 
                    onClick={openCreateJalsah}
                    className={`${bgColor} text-white p-2 rounded-lg shadow hover:opacity-90 transition-all active:scale-95`}
                    title="Buat Jalsah Baru"
                >
                    <Plus size={20} />
                </button>
            </div>

            {myJalsahs.length === 0 ? (
                <div className="text-center text-slate-400 text-sm py-8 bg-white rounded-xl border border-slate-200 border-dashed">
                    <div className="mb-2 bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto text-slate-400">
                        <Users size={24} />
                    </div>
                    Belum ada jalsah. Silakan buat baru.
                </div>
            ) : (
                myJalsahs.map(jalsah => (
                <div key={jalsah.id} className="space-y-4">
                    {/* Jalsah Performance Card */}
                    <div className={`${bgColor} rounded-2xl p-5 text-white shadow-lg relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Users size={100} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-white/90 text-sm font-medium mb-1">{jalsah.name}</h3>
                                <div className="flex gap-2">
                                    <button onClick={() => openEditJalsah(jalsah)} className="p-1 bg-white/20 rounded hover:bg-white/30 text-white"><Edit size={14}/></button>
                                    <button onClick={() => handleDeleteJalsahClick(jalsah.id)} className="p-1 bg-white/20 rounded hover:bg-red-500/50 text-white"><Trash2 size={14}/></button>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-end">
                                <span className="text-xs opacity-75">{jalsah.meetingTime}</span>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="bg-white/20 px-2 py-1 rounded text-[10px]">
                                        Code: <span className="font-mono font-bold">JAL-{jalsah.id.slice(-3)}</span>
                                    </div>
                                    <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${
                                        jalsah.status === 'approved' ? 'bg-green-500/20 border-green-200/50 text-green-100' :
                                        jalsah.status === 'rejected' ? 'bg-red-500/20 border-red-200/50 text-red-100' :
                                        'bg-orange-500/20 border-orange-200/50 text-orange-100'
                                    }`}>
                                        {jalsah.status}
                                    </span>
                                </div>
                            </div>

                            {jalsah.description && (
                                <p className="text-xs text-white/80 mt-3 italic line-clamp-2">
                                    "{jalsah.description}"
                                </p>
                            )}
                        </div>
                    </div>

                    {jalsah.status === 'rejected' && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs">
                            <div className="flex items-center gap-2 font-bold mb-1">
                                <AlertCircle size={16} />
                                Jalsah Ditolak
                            </div>
                            <p>Jalsah ini ditolak oleh Admin. Silakan edit atau buat baru.</p>
                            {jalsah.rejectionReason && (
                                <div className="mt-2 p-2 bg-white/50 border border-red-100 rounded text-red-800 italic">
                                    "Alasan: {jalsah.rejectionReason}"
                                </div>
                            )}
                        </div>
                    )}

                    {jalsah.status === 'pending' && (
                        <div className="bg-orange-50 border border-orange-200 text-orange-700 p-3 rounded-xl text-xs flex items-center gap-2">
                            <Clock size={16} />
                            Menunggu persetujuan Admin.
                        </div>
                    )}

                    {/* Invite Section */}
                    {jalsah.status === 'approved' && (
                        <div className="bg-white p-3 rounded-xl border border-slate-200 flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Username target (misal: @abdullah_f)"
                                value={activeInviteId === jalsah.id ? inviteUsername : ''}
                                onChange={(e) => {
                                    setActiveInviteId(jalsah.id);
                                    setInviteUsername(e.target.value);
                                }}
                                className="flex-1 text-sm bg-slate-50 border-none rounded-lg px-3 focus:ring-2 focus:ring-blue-100 outline-none"
                            />
                            <button 
                                onClick={() => handleInviteMember(jalsah)}
                                disabled={activeInviteId !== jalsah.id || !inviteUsername}
                                className={`px-4 py-2 rounded-lg text-white text-xs font-bold ${bgColor} disabled:opacity-50`}
                            >
                                <UserPlus size={16} />
                            </button>
                        </div>
                    )}

                    {/* Mentee List */}
                    <div className="border-t border-slate-100 pt-2">
                        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
                        {mentees.map((mentee) => (
                            <div 
                                key={mentee.id} 
                                className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                                onClick={() => setSelectedMentee(mentee)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img src={mentee.avatarUrl} alt={mentee.name} className="w-8 h-8 rounded-full object-cover border border-slate-100" />
                                        {mentee.status === 'warning' && <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></div>}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-800">{mentee.name}</h4>
                                        <div className="flex items-center gap-2 text-[9px] text-slate-500">
                                            <span className="flex items-center gap-1">Lvl {mentee.level}</span>
                                            <span>•</span>
                                            <span>XP {mentee.totalXP}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={(e) => handleSapa(mentee, e)} className="p-1.5 text-slate-400 hover:text-green-600 bg-slate-50 rounded-lg">
                                        <MessageCircle size={14} />
                                    </button>
                                    <button onClick={(e) => handleValidateAttendance(mentee.id, e)} className={`p-1.5 rounded-lg ${mentee.attendanceConfirmed ? 'bg-green-100 text-green-600' : 'bg-slate-50 text-slate-300'}`}>
                                        <CheckCircle size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        </div>
                        <p className="text-[10px] text-slate-400 text-center mt-2">Ketuk nama member untuk melihat track record detail.</p>
                    </div>
                </div>
                ))
            )}
        </div>
      )}

      {/* ... (Keep existing Kajian and Tulisan tabs and Modals) ... */}
      
      {/* --- KAJIAN TAB --- */}
      {activeTab === 'kajian' && (
        <div className="space-y-6">
             <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-indigo-900 text-sm">Buat Kajian/Kelas</h3>
                    <p className="text-xs text-indigo-700">Berbagi ilmu dengan komunitas.</p>
                </div>
                <button 
                    onClick={() => setShowCreateKajian(true)}
                    className="bg-indigo-600 text-white p-2 rounded-lg shadow hover:bg-indigo-700"
                >
                    <Plus size={20} />
                </button>
             </div>

             <div className="space-y-3">
                {myKajians.length === 0 ? (
                    <div className="text-center text-slate-400 text-sm py-8 bg-white rounded-xl border border-slate-200">
                        Belum ada kajian yang dibuat.
                    </div>
                ) : (
                    myKajians.map(k => (
                        <div key={k.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{k.title}</h4>
                                    <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{k.category}</span>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${
                                    k.status === 'approved' ? 'bg-green-50 text-green-600 border-green-200' :
                                    k.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-200' :
                                    'bg-orange-50 text-orange-600 border-orange-200'
                                }`}>
                                    {k.status}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 mb-3">{k.description}</p>
                        </div>
                    ))
                )}
             </div>
        </div>
      )}

      {/* --- TULISAN TAB --- */}
      {activeTab === 'tulisan' && (
        <div className="space-y-6">
             <div className="bg-teal-50 p-4 rounded-xl border border-teal-100 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-teal-900 text-sm">Tulis Artikel</h3>
                    <p className="text-xs text-teal-700">Mencerahkan dengan pena.</p>
                </div>
                <button 
                    onClick={() => setShowCreateArticle(true)}
                    className="bg-teal-600 text-white p-2 rounded-lg shadow hover:bg-teal-700"
                >
                    <PenTool size={20} />
                </button>
             </div>

             <div className="space-y-3">
                {myArticles.length === 0 ? (
                    <div className="text-center text-slate-400 text-sm py-8 bg-white rounded-xl border border-slate-200">
                        Belum ada tulisan yang dibuat.
                    </div>
                ) : (
                    myArticles.map(a => (
                        <div key={a.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{a.title}</h4>
                                    <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{a.category}</span>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${
                                    a.status === 'approved' ? 'bg-green-50 text-green-600 border-green-200' :
                                    a.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-200' :
                                    'bg-orange-50 text-orange-600 border-orange-200'
                                }`}>
                                    {a.status}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2">{a.content}</p>
                        </div>
                    ))
                )}
             </div>
        </div>
      )}

      {/* --- MODALS --- */}

      {/* MEMBER DETAIL MODAL (TRACK RECORD) */}
      {selectedMentee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                  <div className={`${lightBg} px-4 py-3 border-b ${borderColor} flex justify-between items-center`}>
                      <h3 className={`font-bold ${textColor}`}>Track Record Member</h3>
                      <button onClick={() => setSelectedMentee(null)} className="p-1 rounded-full hover:bg-black/5 text-slate-500"><X size={20} /></button>
                  </div>
                  
                  <div className="overflow-y-auto p-4 space-y-4">
                      {/* Identity */}
                      <div className="flex items-center gap-4">
                          <img src={selectedMentee.avatarUrl} alt={selectedMentee.name} className="w-16 h-16 rounded-full border-2 border-slate-100" />
                          <div>
                              <h2 className="text-lg font-bold text-slate-800">{selectedMentee.name}</h2>
                              <p className="text-sm text-slate-500">{selectedMentee.username}</p>
                              <div className="flex gap-2 mt-1">
                                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">Level {selectedMentee.level}</span>
                                  <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">Joined: {selectedMentee.joinDate}</span>
                              </div>
                          </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3">
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <p className="text-[10px] text-slate-500 uppercase font-bold">Total XP</p>
                              <p className="text-xl font-bold text-slate-800">{selectedMentee.totalXP.toLocaleString()}</p>
                          </div>
                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <p className="text-[10px] text-slate-500 uppercase font-bold">Streak</p>
                              <p className="text-xl font-bold text-slate-800">{selectedMentee.streak} Hari</p>
                          </div>
                      </div>

                      {/* Velocity Chart */}
                      <div className="bg-white rounded-xl border border-slate-200 p-4">
                          <div className="flex items-center gap-2 mb-2">
                              <Activity size={16} className="text-slate-400" />
                              <h4 className="text-xs font-bold text-slate-700">Grafik Konsistensi (7 Hari)</h4>
                          </div>
                          <VelocityChart data={selectedMentee.history} color={chartColor} />
                      </div>

                      {/* Activity Log */}
                      <div>
                          <div className="flex items-center gap-2 mb-2">
                              <FileText size={16} className="text-slate-400" />
                              <h4 className="text-xs font-bold text-slate-700">Riwayat Aktifitas Terakhir</h4>
                          </div>
                          <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden divide-y divide-slate-200">
                              {selectedMentee.missionLog.length === 0 ? (
                                  <div className="p-4 text-center text-xs text-slate-400">Belum ada aktifitas terekam.</div>
                              ) : (
                                  selectedMentee.missionLog.map((log, idx) => (
                                      <div key={idx} className="p-3 flex justify-between items-center">
                                          <div>
                                              <p className="text-xs font-bold text-slate-700">{log.title}</p>
                                              <p className="text-[10px] text-slate-400">{log.date}</p>
                                          </div>
                                          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+{log.xp} XP</span>
                                      </div>
                                  ))
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Create/Edit Jalsah Modal */}
      {showCreateJalsah && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
             <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-5">
                <h3 className="font-bold text-lg mb-4">{editingJalsah ? 'Edit Jalsah' : 'Buat Jalsah Baru'}</h3>
                
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kelompok</label>
                <input 
                    type="text"
                    placeholder="Contoh: Al-Fatih"
                    value={newJalsahName}
                    onChange={(e) => setNewJalsahName(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label className="block text-xs font-bold text-slate-700 mb-1">Waktu Pertemuan</label>
                <input 
                    type="text"
                    placeholder="Contoh: Jumat, 20:00 WIB"
                    value={newJalsahTime}
                    onChange={(e) => setNewJalsahTime(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm mb-4 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi & Tujuan (Untuk Admin)</label>
                <textarea 
                    placeholder="Jelaskan tujuan dan target jalsah ini untuk memudahkan validasi Admin..."
                    value={newJalsahDesc}
                    onChange={(e) => setNewJalsahDesc(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm mb-4 outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                />

                <div className="flex gap-2">
                    <button onClick={() => setShowCreateJalsah(false)} className="flex-1 py-2 text-slate-600 border rounded-lg">Batal</button>
                    <button onClick={handleCreateOrUpdateJalsahSubmit} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold">Simpan</button>
                </div>
             </div>
        </div>
      )}

      {/* Create Kajian Modal */}
      {showCreateKajian && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
             <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-5 space-y-3">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">Buat Kajian Baru</h3>
                    <button onClick={() => setShowCreateKajian(false)}><X size={20} className="text-slate-400" /></button>
                </div>
                
                <input 
                    type="text"
                    placeholder="Judul Kajian"
                    value={newKajian.title}
                    onChange={(e) => setNewKajian({...newKajian, title: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                    value={newKajian.category}
                    onChange={(e) => setNewKajian({...newKajian, category: e.target.value as PeranType})}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                     {Object.values(PeranType)
                        .filter(t => t !== PeranType.SUNNAH)
                        .map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <textarea 
                    placeholder="Deskripsi Singkat"
                    value={newKajian.desc}
                    onChange={(e) => setNewKajian({...newKajian, desc: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 h-20"
                />
                <input 
                    type="date"
                    value={newKajian.date}
                    onChange={(e) => setNewKajian({...newKajian, date: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <div className="flex items-center gap-2">
                    <input 
                        type="checkbox"
                        id="isPaid"
                        checked={newKajian.isPaid}
                        onChange={(e) => setNewKajian({...newKajian, isPaid: e.target.checked})}
                        className="w-4 h-4 accent-blue-600"
                    />
                    <label htmlFor="isPaid" className="text-sm text-slate-700">Kajian Berbayar?</label>
                </div>

                {newKajian.isPaid && (
                    <input 
                        type="number"
                        placeholder="Harga Tiket (Rp)"
                        value={newKajian.price}
                        onChange={(e) => setNewKajian({...newKajian, price: parseInt(e.target.value)})}
                        className="w-full border border-slate-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                )}

                <button onClick={handleCreateKajianSubmit} className="w-full py-2 bg-blue-600 text-white rounded-lg font-bold mt-2">
                    Ajukan Kajian
                </button>
             </div>
        </div>
      )}

      {/* Create Article Modal */}
      {showCreateArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
             <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-5 space-y-3">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">Tulis Artikel Baru</h3>
                    <button onClick={() => setShowCreateArticle(false)}><X size={20} className="text-slate-400" /></button>
                </div>
                
                <input 
                    type="text"
                    placeholder="Judul Tulisan"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
                />

                <select
                    value={newArticle.category}
                    onChange={(e) => setNewArticle({...newArticle, category: e.target.value as PeranType})}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                     {Object.values(PeranType)
                        .filter(t => t !== PeranType.SUNNAH)
                        .map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                <textarea 
                    placeholder="Isi tulisan Anda..."
                    value={newArticle.content}
                    onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-teal-500 h-40"
                />

                <button onClick={handleCreateArticleSubmit} className="w-full py-2 bg-teal-600 text-white rounded-lg font-bold mt-2">
                    Kirim Tulisan
                </button>
             </div>
        </div>
      )}

    </div>
  );
};

export default MusyrifDashboard;

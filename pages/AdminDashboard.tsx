
import React, { useState } from 'react';
import { User, RoleType, Gender, PeranType, MissionItem, Kajian, Jalsah, Article } from '../types';
import { 
    Shield, Users, FileText, AlertTriangle, CheckCircle, 
    XCircle, ChevronRight, Settings, Target, 
    UserX, Search, ArrowLeft, MoreHorizontal,
    Edit2, Trash2, Plus, Flag, Save, X, Lock, Video, Eye, Calendar, Clock, DollarSign, PenTool
} from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  missions: MissionItem[];
  onUpdateMissions: (missions: MissionItem[]) => void;
  roleUnlockConfig: Record<PeranType, number>;
  onUpdateRoleConfig: (config: Record<PeranType, number>) => void;
  kajians: Kajian[];
  onUpdateKajianStatus: (id: string, status: 'approved' | 'rejected') => void;
  articles: Article[];
  onUpdateArticleStatus: (id: string, status: 'approved' | 'rejected') => void;
  jalsahs: Jalsah[];
  onUpdateJalsahStatus: (id: string, status: 'approved' | 'rejected', reason?: string) => void;
  onDeleteJalsah: (id: string) => void;
}

type AdminView = 'dashboard' | 'users' | 'missions' | 'challenges' | 'jalsah' | 'dormant';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    user, 
    missions, 
    onUpdateMissions, 
    roleUnlockConfig, 
    onUpdateRoleConfig,
    kajians,
    onUpdateKajianStatus,
    articles,
    onUpdateArticleStatus,
    jalsahs,
    onUpdateJalsahStatus,
    onDeleteJalsah
}) => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [activeTab, setActiveTab] = useState<'validasi' | 'laporan'>('validasi');

  // --- STATE MANAGEMENT FOR MISSIONS ---
  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [editingMission, setEditingMission] = useState<Partial<MissionItem>>({});

  // --- STATE FOR REJECTION REASON ---
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [targetRejectId, setTargetRejectId] = useState<string | null>(null);

  // --- STATE FOR DETAIL PREVIEW ---
  const [previewItem, setPreviewItem] = useState<{ type: 'kajian' | 'jalsah' | 'article', data: any } | null>(null);

  const pendingKajians = kajians.filter(k => k.status === 'pending');
  const pendingJalsahs = jalsahs.filter(h => h.status === 'pending');
  const pendingArticles = articles.filter(a => a.status === 'pending');
  const totalPending = pendingKajians.length + pendingJalsahs.length + pendingArticles.length;

  const stats = [
    { label: 'Total Member', value: '0', icon: <Users size={16} />, color: 'bg-blue-500' },
    { label: 'Total Musyrif', value: '0', icon: <Shield size={16} />, color: 'bg-indigo-500' },
    { label: 'Pending Validasi', value: totalPending.toString(), icon: <FileText size={16} />, color: 'bg-orange-500' },
    { label: 'Laporan Masuk', value: '0', icon: <AlertTriangle size={16} />, color: 'bg-red-500' },
  ];

  // Empty queues for fresh start
  const reportQueue: any[] = [];
  const mockUsers: any[] = [];

  // Filter out personal user missions
  const systemMissions = missions.filter(m => !m.userId);

  // --- HANDLERS ---
  const handleEditMission = (mission: MissionItem) => {
      setEditingMission({ ...mission });
      setIsMissionModalOpen(true);
  };

  const handleAddNewMission = () => {
      setEditingMission({
          id: '',
          title: '',
          xp: 10,
          type: PeranType.MUSLIM,
          completed: false
      });
      setIsMissionModalOpen(true);
  };

  const handleSaveMission = () => {
      if (!editingMission.title || !editingMission.xp) {
          alert("Judul dan XP Bobot wajib diisi!");
          return;
      }

      if (editingMission.id) {
          onUpdateMissions(missions.map(m => m.id === editingMission.id ? { ...m, ...editingMission } as MissionItem : m));
      } else {
          const newMission: MissionItem = {
              ...(editingMission as MissionItem),
              id: `m-${Date.now()}`,
              completed: false
          };
          onUpdateMissions([...missions, newMission]);
      }
      setIsMissionModalOpen(false);
  };

  const handleDeleteMission = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if (window.confirm('Apakah Anda yakin ingin menghapus misi ini?')) {
          const updatedMissions = missions.filter(m => m.id !== id);
          onUpdateMissions(updatedMissions);
      }
  };

  const handleUpdateLevelConfig = (role: PeranType, newLevel: number) => {
      onUpdateRoleConfig({
          ...roleUnlockConfig,
          [role]: Math.max(0, newLevel)
      });
  };

  const handleDeleteJalsahClick = (id: string) => {
      if(window.confirm("Yakin ingin menghapus jalsah ini? Member akan kehilangan akses.")) {
          onDeleteJalsah(id);
      }
  };

  const handleRejectClick = (id: string) => {
      setTargetRejectId(id);
      setRejectionReason('');
      setIsRejectModalOpen(true);
  };

  const submitRejection = () => {
      if (!targetRejectId) return;
      onUpdateJalsahStatus(targetRejectId, 'rejected', rejectionReason || 'Tidak memenuhi standar.');
      setIsRejectModalOpen(false);
      setTargetRejectId(null);
  };

  // --- RENDER HELPERS ---

  const renderDashboard = () => (
    <div className="space-y-6 animate-fade-in">
       {/* Admin Header & Stats Grid */}
       <div className="flex justify-between items-center px-1">
        <div>
           <p className="text-xs text-slate-500">Control Panel</p>
           <h2 className="text-lg font-bold text-slate-800">Administrator</h2>
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={() => setCurrentView('missions')}
                className="p-2 bg-white text-slate-600 rounded-full border border-slate-200 shadow-sm active:scale-95 transition-transform hover:bg-slate-50"
                title="Settings & Konfigurasi Misi"
            >
                <Settings size={18} />
            </button>
            <span className="text-[10px] px-3 py-1 rounded-full border bg-slate-800 text-white border-slate-900 flex items-center gap-1">
                <Shield size={10} /> Super Admin
            </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center text-white shadow-md`}>
              {stat.icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 leading-none">{stat.value}</h3>
              <p className="text-[10px] text-slate-500 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Action Area (Queue) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[150px]">
        {/* Tabs */}
        <div className="flex border-b border-slate-100">
            <button 
                onClick={() => setActiveTab('validasi')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'validasi' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                Validasi ({totalPending})
            </button>
            <button 
                onClick={() => setActiveTab('laporan')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'laporan' ? 'text-red-600 border-b-2 border-red-600 bg-red-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
                Laporan ({reportQueue.length})
            </button>
        </div>

        {/* Content */}
        <div className="divide-y divide-slate-50 max-h-60 overflow-y-auto">
            {activeTab === 'validasi' && (
                <>
                    {totalPending === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-sm">
                            Tidak ada antrian validasi.
                        </div>
                    ) : (
                        <>
                            {/* Pending Kajian */}
                            {pendingKajians.map(k => (
                                <div key={k.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800 text-sm">{k.title}</h4>
                                        <p className="text-xs text-slate-500">Oleh: {k.musyrifName}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100">Kajian</span>
                                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{k.category}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setPreviewItem({ type: 'kajian', data: k })} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Eye size={18} /></button>
                                        <button onClick={() => onUpdateKajianStatus(k.id, 'rejected')} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><XCircle size={18} /></button>
                                        <button onClick={() => onUpdateKajianStatus(k.id, 'approved')} className="p-1.5 text-green-500 hover:bg-green-50 rounded"><CheckCircle size={18} /></button>
                                    </div>
                                </div>
                            ))}

                            {/* Pending Jalsah */}
                            {pendingJalsahs.map(h => (
                                <div key={h.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800 text-sm">{h.name}</h4>
                                        <p className="text-xs text-slate-500">ID: {h.musyrifId}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded border border-purple-100">Jalsah</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setPreviewItem({ type: 'jalsah', data: h })} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Eye size={18} /></button>
                                        <button onClick={() => handleRejectClick(h.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><XCircle size={18} /></button>
                                        <button onClick={() => onUpdateJalsahStatus(h.id, 'approved')} className="p-1.5 text-green-500 hover:bg-green-50 rounded"><CheckCircle size={18} /></button>
                                    </div>
                                </div>
                            ))}

                            {/* Pending Articles */}
                            {pendingArticles.map(a => (
                                <div key={a.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800 text-sm">{a.title}</h4>
                                        <p className="text-xs text-slate-500">Oleh: {a.musyrifName}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] bg-teal-50 text-teal-600 px-1.5 py-0.5 rounded border border-teal-100">Artikel</span>
                                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{a.category}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => setPreviewItem({ type: 'article', data: a })} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"><Eye size={18} /></button>
                                        <button onClick={() => onUpdateArticleStatus(a.id, 'rejected')} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><XCircle size={18} /></button>
                                        <button onClick={() => onUpdateArticleStatus(a.id, 'approved')} className="p-1.5 text-green-500 hover:bg-green-50 rounded"><CheckCircle size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </>
            )}
        </div>
      </div>

      {/* Tools Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-3">Menu Pengelolaan</h3>
        <div className="grid grid-cols-2 gap-3">
             <button onClick={() => setCurrentView('users')} className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 active:scale-95 transition-all">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><Users size={20} /></div>
                <span className="text-xs font-bold text-slate-700">User Management</span>
            </button>
            <button onClick={() => setCurrentView('missions')} className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 active:scale-95 transition-all">
                <div className="p-2 bg-green-100 text-green-600 rounded-full"><Target size={20} /></div>
                <span className="text-xs font-bold text-slate-700">Misi 7 Peran</span>
            </button>
            <button onClick={() => setCurrentView('challenges')} className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 active:scale-95 transition-all">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-full"><Flag size={20} /></div>
                <span className="text-xs font-bold text-slate-700">Tantangan Khusus</span>
            </button>
            <button onClick={() => setCurrentView('jalsah')} className="p-4 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 active:scale-95 transition-all">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full"><Shield size={20} /></div>
                <span className="text-xs font-bold text-slate-700">Kelola Jalsah</span>
            </button>
            <button onClick={() => setCurrentView('dormant')} className="p-4 bg-white border border-slate-200 rounded-xl col-span-2 flex flex-row items-center justify-center gap-3 hover:bg-slate-50 active:scale-95 transition-all">
                <div className="p-2 bg-red-100 text-red-600 rounded-full"><UserX size={20} /></div>
                <div className="text-left"><span className="block text-xs font-bold text-slate-700">Intervensi Non-Aktif</span><span className="block text-[10px] text-slate-500">Safety Valve System</span></div>
            </button>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => <div className="p-4 text-center text-slate-400">User Management Module</div>;
  const renderMissions = () => (
     <div className="animate-fade-in space-y-6">
        {/* --- LEVEL CONFIGURATION SECTION --- */}
        <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-4">
            <div className="flex items-start gap-3 mb-4">
                <div className="bg-indigo-200 p-2 rounded-lg text-indigo-700"><Lock size={18} /></div>
                <div><h3 className="font-bold text-indigo-900 text-sm">Konfigurasi Level Peran</h3></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {Object.values(PeranType).map(role => (
                    <div key={role} className="bg-white p-2 rounded border border-indigo-100 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-600">{role}</span>
                        <input type="number" min="0" max="100" value={roleUnlockConfig[role]} onChange={(e) => handleUpdateLevelConfig(role, parseInt(e.target.value))} className="w-12 text-center text-xs border border-slate-200 rounded py-1 font-bold" />
                    </div>
                ))}
            </div>
        </div>
        {/* Mission List */}
        <div className="space-y-4">
             <div className="flex justify-between items-center bg-blue-50 p-3 rounded-xl border border-blue-100">
                <div className="flex items-center gap-3"><div className="bg-blue-100 p-2 rounded-full text-blue-600"><Settings size={20} /></div><h3 className="font-bold text-slate-800 text-sm">Daftar Misi & Bobot</h3></div>
                <button onClick={handleAddNewMission} className="bg-blue-600 text-white p-2 rounded-lg shadow-sm"><Plus size={18} /></button>
            </div>
            <div className="space-y-3">
                {Object.values(PeranType).map((type, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 p-3 border-b border-slate-100 flex justify-between items-center"><span className="text-xs font-bold text-slate-600 uppercase">{type}</span><span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">Unlock Lv.{roleUnlockConfig[type]}</span></div>
                        <div className="divide-y divide-slate-50">
                            {systemMissions.filter(m => m.type === type).map(m => (
                                <div key={m.id} className="p-3 flex items-center justify-between group hover:bg-slate-50">
                                    <div className="flex-1 pr-2"><p className="text-sm font-medium text-slate-800">{m.title}</p><div className="flex items-center gap-2 mt-1"><span onClick={() => handleEditMission(m)} className="text-xs font-bold text-slate-700 cursor-pointer hover:text-blue-600">{m.xp} XP <Edit2 size={10} className="inline ml-1"/></span></div></div>
                                    <div className="flex gap-1"><button onClick={() => handleEditMission(m)} className="p-1.5 text-slate-400 hover:text-blue-600"><Edit2 size={14} /></button><button onClick={(e) => handleDeleteMission(m.id, e)} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 size={14} /></button></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
     </div>
  );
  const renderChallenges = () => <div className="p-4 text-center text-slate-400">Challenges Module</div>;
  const renderJalsah = () => (
      <div className="animate-fade-in space-y-4">
        <h3 className="text-sm font-bold text-slate-800">Daftar Semua Jalsah</h3>
        <div className="space-y-3">
             {jalsahs.length === 0 ? <div className="text-center text-slate-400 text-sm">Belum ada jalsah.</div> : 
                jalsahs.map(h => (
                    <div key={h.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
                        <div className="flex justify-between items-start"><div><h4 className="font-bold text-slate-800">{h.name}</h4><p className="text-xs text-slate-500">Musyrif ID: {h.musyrifId}</p></div><span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${h.status === 'approved' ? 'bg-green-50 text-green-600 border-green-200' : h.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>{h.status}</span></div>
                        <div className="flex justify-end pt-2"><button onClick={() => handleDeleteJalsahClick(h.id)} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded border border-red-100"><Trash2 size={12} /> Hapus Permanen</button></div>
                    </div>
                ))
             }
        </div>
    </div>
  );
  const renderDormant = () => <div className="p-4 text-center text-slate-400">Dormant Users Module</div>;

  return (
    <div className="pb-24 pt-4 px-4">
        {currentView !== 'dashboard' && (
            <button onClick={() => setCurrentView('dashboard')} className="mb-4 flex items-center gap-2 text-slate-500 text-sm font-medium hover:text-slate-800"><ArrowLeft size={16} /> Kembali ke Dashboard</button>
        )}

        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'users' && renderUsers()}
        {currentView === 'missions' && renderMissions()}
        {currentView === 'challenges' && renderChallenges()}
        {currentView === 'jalsah' && renderJalsah()}
        {currentView === 'dormant' && renderDormant()}

        {/* --- DETAIL PREVIEW MODAL --- */}
        {previewItem && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                 <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Detail Validasi</h3>
                        <button onClick={() => setPreviewItem(null)} className="p-1 rounded-full hover:bg-slate-200 text-slate-500"><X size={20} /></button>
                    </div>
                    
                    <div className="p-5 space-y-4">
                        {previewItem.type === 'kajian' && (
                            <>
                                <h2 className="text-lg font-bold text-slate-800">{previewItem.data.title}</h2>
                                <p className="text-xs text-slate-500">Kategori: {previewItem.data.category}</p>
                                <div className="bg-slate-50 p-3 rounded-xl text-sm text-slate-600 italic border border-slate-100">"{previewItem.data.description}"</div>
                            </>
                        )}
                        {previewItem.type === 'jalsah' && (
                             <>
                                <h2 className="text-lg font-bold text-slate-800">{previewItem.data.name}</h2>
                                <div className="bg-slate-50 p-3 rounded-xl text-sm text-slate-600 italic border border-slate-100">"{previewItem.data.description}"</div>
                            </>
                        )}
                        {previewItem.type === 'article' && (
                            <>
                                <h2 className="text-lg font-bold text-slate-800">{previewItem.data.title}</h2>
                                <p className="text-xs text-slate-500">Kategori: {previewItem.data.category}</p>
                                <div className="bg-slate-50 p-3 rounded-xl text-sm text-slate-600 italic border border-slate-100 max-h-40 overflow-y-auto">"{previewItem.data.content}"</div>
                            </>
                        )}
                    </div>
                 </div>
             </div>
        )}

        {/* --- REJECT REASON MODAL --- */}
        {isRejectModalOpen && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                 <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
                    <div className="bg-red-50 px-4 py-3 border-b border-red-100 flex justify-between items-center">
                        <h3 className="font-bold text-red-800">Tolak Pengajuan</h3>
                        <button onClick={() => setIsRejectModalOpen(false)} className="p-1 rounded-full hover:bg-red-200 text-red-500"><X size={20} /></button>
                    </div>
                    <div className="p-4"><textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Alasan penolakan..." className="w-full h-24 border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none resize-none" autoFocus /></div>
                    <div className="p-4 border-t border-slate-100 flex gap-3"><button onClick={() => setIsRejectModalOpen(false)} className="flex-1 py-2 text-slate-600 border rounded-lg text-sm">Batal</button><button onClick={submitRejection} className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold text-sm shadow-lg shadow-red-200 hover:bg-red-700">Tolak</button></div>
                 </div>
             </div>
        )}

        {/* --- MISSION CONFIG MODAL --- */}
        {isMissionModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center"><h3 className="font-bold text-slate-800">{editingMission.id ? 'Edit Misi' : 'Tambah Misi'}</h3><button onClick={() => setIsMissionModalOpen(false)} className="p-1 rounded-full hover:bg-slate-200 text-slate-500"><X size={20} /></button></div>
                    <div className="p-4 space-y-4">
                        <div><label className="block text-xs font-bold text-slate-700 mb-1">Judul</label><input type="text" value={editingMission.title || ''} onChange={e => setEditingMission(prev => ({...prev, title: e.target.value}))} className="w-full text-sm border border-slate-300 rounded-lg p-2" /></div>
                        <div className="grid grid-cols-2 gap-3">
                            <div><label className="block text-xs font-bold text-slate-700 mb-1">Kategori</label><select value={editingMission.type} onChange={e => setEditingMission(prev => ({...prev, type: e.target.value as PeranType}))} className="w-full text-xs border border-slate-300 rounded-lg p-2">{Object.values(PeranType).map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                            <div><label className="block text-xs font-bold text-slate-700 mb-1">XP</label><input type="number" value={editingMission.xp || 0} onChange={e => setEditingMission(prev => ({...prev, xp: parseInt(e.target.value) || 0}))} className="w-full text-sm border border-slate-300 rounded-lg p-2" /></div>
                        </div>
                    </div>
                    <div className="p-4 border-t border-slate-100 flex gap-3"><button onClick={() => setIsMissionModalOpen(false)} className="flex-1 py-2 text-slate-600 border rounded-lg">Batal</button><button onClick={handleSaveMission} className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold">Simpan</button></div>
                </div>
            </div>
        )}
    </div>
  );
};

export default AdminDashboard;

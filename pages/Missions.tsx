import React, { useState, useEffect } from 'react';
import { MissionItem, PeranType, User, Gender } from '../types';
import { CATEGORY_XP_WEIGHTS } from '../constants';
import { Check, Hand, Calendar, Save, Plus, X, Heart, Lock } from 'lucide-react';

interface MissionsProps {
  user: User;
  onAddXP: (amount: number) => void;
  globalMissions: MissionItem[];
  onUpdatePlan: (missionIds: string[]) => void;
  onAddMission: (mission: MissionItem) => void;
  roleUnlockConfig: Record<PeranType, number>;
}

const Missions: React.FC<MissionsProps> = ({ user, onAddXP, globalMissions, onUpdatePlan, onAddMission, roleUnlockConfig }) => {
  const [activeTab, setActiveTab] = useState<'today' | 'plan'>('today');
  const [missions, setMissions] = useState<MissionItem[]>([]);
  const [niatSet, setNiatSet] = useState(false);
  const [holding, setHolding] = useState(false);
  
  // Akhwat Specific State
  const [isHaid, setIsHaid] = useState(false);
  
  // Planning State
  const [planSelection, setPlanSelection] = useState<string[]>([]);
  const [isPlanSaved, setIsPlanSaved] = useState(false);

  // Custom Mission Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMissionTitle, setNewMissionTitle] = useState('');
  // Default to BEKERJA as MUSLIM is not allowed for custom
  const [newMissionCategory, setNewMissionCategory] = useState<PeranType>(PeranType.BEKERJA);

  // Sync with global missions and user preference
  useEffect(() => {
    // 1. Filter available missions:
    //    Show System missions (no userId) that match gender
    //    OR User's custom missions (userId matches current user)
    const relevantMissions = globalMissions.filter(m => {
        if (m.userId) {
            return m.userId === user.id;
        }
        if (!m.genderTarget) return true; 
        return m.genderTarget === user.gender; 
    });

    // 2. Set Plan Selection (Load from User or Default to All)
    if (user.plannedMissionIds && user.plannedMissionIds.length > 0) {
        setPlanSelection(user.plannedMissionIds);
    } else {
        // System prepares default (All relevant missions) if no plan
        setPlanSelection(relevantMissions.map(m => m.id));
    }

    // 3. Set Active Missions
    setMissions(prevMissions => {
        return relevantMissions.map(globalM => {
            const existing = prevMissions.find(p => p.id === globalM.id);
            return existing 
                ? { ...globalM, completed: existing.completed } 
                : { ...globalM, completed: false };
        });
    });
  }, [user.gender, globalMissions, user.plannedMissionIds, user.id]);

  const toggleMission = (id: string) => {
    if (!niatSet) return;
    
    setMissions(prev => prev.map(m => {
      if (m.id === id) {
        if (!m.completed) {
            onAddXP(m.xp);
        } else {
            onAddXP(-m.xp);
        }
        return { ...m, completed: !m.completed };
      }
      return m;
    }));
  };

  const togglePlanSelection = (id: string) => {
      setPlanSelection(prev => {
          if (prev.includes(id)) return prev.filter(pid => pid !== id);
          return [...prev, id];
      });
      setIsPlanSaved(false);
  };

  const savePlan = () => {
      onUpdatePlan(planSelection);
      setIsPlanSaved(true);
      setTimeout(() => setActiveTab('today'), 1000);
  };

  const handleCreateMission = () => {
    if (!newMissionTitle) return;
    
    const newMission: MissionItem = {
        id: `custom-${Date.now()}`,
        title: newMissionTitle,
        type: newMissionCategory,
        xp: CATEGORY_XP_WEIGHTS[newMissionCategory],
        completed: false,
        userId: user.id
    };
    
    onAddMission(newMission);
    setNewMissionTitle('');
    setIsModalOpen(false);
  };

  // Group missions by type
  const groupedMissions = missions.reduce((acc, mission) => {
    if (!acc[mission.type]) acc[mission.type] = [];
    acc[mission.type].push(mission);
    return acc;
  }, {} as Record<PeranType, MissionItem[]>);

  // Hold Niat Logic
  const startHold = () => {
    if (niatSet) return;
    setHolding(true);
    setTimeout(() => {
        setNiatSet(true);
        setHolding(false);
    }, 1500);
  };

  const endHold = () => setHolding(false);

  // Theme
  const isIkhwan = user.gender === Gender.IKHWAN;
  const isAkhwat = user.gender === Gender.AKHWAT;
  
  const themeColor = isIkhwan ? 'blue' : 'pink';
  const activeColor = isIkhwan ? 'bg-blue-600 border-blue-600' : 'bg-pink-600 border-pink-600';
  const textXPColor = isIkhwan ? 'text-blue-600 bg-blue-50' : 'text-pink-600 bg-pink-50';
  const handColor = isIkhwan ? 'text-blue-600' : 'text-pink-600';
  const ringColor = isIkhwan ? 'ring-blue-200 bg-blue-100' : 'ring-pink-200 bg-pink-100';

  return (
    <div className="pb-24 pt-4 px-4 space-y-6">
      
      {/* Tabs */}
      <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-100">
        <button 
            onClick={() => setActiveTab('today')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'today' ? `${isIkhwan ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'} font-bold` : 'text-slate-500'}`}
        >
            Hari Ini
        </button>
        <button 
            onClick={() => setActiveTab('plan')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'plan' ? `${isIkhwan ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'} font-bold` : 'text-slate-500'}`}
        >
            <Calendar size={14} /> Rencana Besok
        </button>
      </div>

      {activeTab === 'today' ? (
        <>
            {/* Niat Section */}
            {!niatSet ? (
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 text-center flex flex-col items-center gap-4 animate-fade-in">
                    <h2 className="text-xl font-bold text-slate-800">Mulai Hari Ini</h2>
                    <p className="text-slate-500 text-sm">Luruskan niat karena Allah sebelum memulai aktivitas.</p>
                    <button
                        onMouseDown={startHold}
                        onMouseUp={endHold}
                        onTouchStart={startHold}
                        onTouchEnd={endHold}
                        className={`relative overflow-hidden w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 ${
                            holding ? `scale-95 ${ringColor} ring-4` : 'bg-slate-50 hover:bg-slate-100'
                        }`}
                    >
                        <Hand className={`${handColor} transition-transform ${holding ? 'scale-110' : ''}`} size={40} />
                        {holding && (
                            <div className={`absolute inset-0 border-4 ${isIkhwan ? 'border-blue-600' : 'border-pink-600'} rounded-full animate-ping`}></div>
                        )}
                    </button>
                    <p className={`text-xs font-medium ${isIkhwan ? 'text-blue-600' : 'text-pink-600'} uppercase tracking-wide`}>
                        {holding ? "Tahan..." : "Tahan Tombol untuk Niat"}
                    </p>
                </div>
            ) : (
                <div className="bg-green-50 rounded-xl p-4 flex items-center justify-between border border-green-100 animate-fade-in">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="text-green-600" size={16} />
                        </div>
                        <div>
                            <h3 className="font-bold text-green-900 text-sm">Niat Sudah Terpasang</h3>
                            <p className="text-xs text-green-700">Semoga Allah berkahi harimu.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Mission List */}
            <div className={`space-y-6 transition-opacity duration-500 ${niatSet ? 'opacity-100' : 'opacity-40 pointer-events-none filter blur-sm'}`}>
                {(Object.entries(groupedMissions) as [PeranType, MissionItem[]][]).map(([type, items]) => {
                    const isMuslimCategory = type === PeranType.MUSLIM;
                    const minLevel = roleUnlockConfig[type] || 0;
                    const isLocked = user.level < minLevel;
                    
                    return (
                    <div key={type}>
                        <div className="flex justify-between items-end mb-3 ml-1">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{type}</h3>
                            {isMuslimCategory && isAkhwat && !isLocked && (
                                <div className="flex items-center gap-2">
                                    <label className="flex items-center gap-2 cursor-pointer bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                                        <input 
                                            type="checkbox" 
                                            checked={isHaid} 
                                            onChange={(e) => setIsHaid(e.target.checked)} 
                                            className="accent-pink-600 w-3 h-3"
                                        />
                                        <span className="text-[10px] text-pink-600 font-bold">Sedang Berhalangan (Haid)</span>
                                    </label>
                                </div>
                            )}
                        </div>
                        
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        {isLocked ? (
                            <div className="p-6 flex flex-col items-center justify-center text-center bg-slate-50">
                                <div className="bg-slate-200 p-3 rounded-full mb-2">
                                    <Lock size={20} className="text-slate-400" />
                                </div>
                                <h4 className="text-sm font-bold text-slate-600">Peran Terkunci</h4>
                                <p className="text-xs text-slate-400 mt-1">
                                    Tingkatkan level Anda ke Level <span className="font-bold text-slate-600">{minLevel}</span> untuk membuka peran ini.
                                </p>
                            </div>
                        ) : (
                            <>
                                {isMuslimCategory && isAkhwat && isHaid && (
                                    <div className="bg-pink-50 px-4 py-2 text-[10px] text-pink-600 border-b border-pink-100 flex items-center gap-2">
                                        <Heart size={10} className="fill-pink-600" />
                                        <span>Mode Uzur Syar'i Aktif: Misi tetap dihitung poin sebagai pahala niat/kebiasaan.</span>
                                    </div>
                                )}
                                
                                {items.map((mission, idx) => {
                                    // Determine active state visual for Haid mode
                                    const isHaidActive = isMuslimCategory && isAkhwat && isHaid;
                                    
                                    return (
                                    <div 
                                        key={mission.id}
                                        onClick={() => toggleMission(mission.id)}
                                        className={`p-4 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors ${
                                            idx !== items.length - 1 ? 'border-b border-slate-50' : ''
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                                                mission.completed 
                                                    ? (isHaidActive ? 'bg-pink-400 border-pink-400' : activeColor) 
                                                    : 'bg-white border-slate-300'
                                            }`}>
                                                {mission.completed && (
                                                    isHaidActive ? <Heart size={12} className="text-white fill-white" /> : <Check size={14} className="text-white" />
                                                )}
                                            </div>
                                            <div>
                                                <span className={`text-sm font-medium ${mission.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                                    {mission.title}
                                                </span>
                                                {mission.userId && (
                                                    <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">Personal</span>
                                                )}
                                                {mission.completed && isHaidActive && (
                                                    <span className="ml-2 text-[9px] px-1.5 py-0.5 bg-pink-100 text-pink-600 rounded-full">Uzur</span>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${isHaidActive ? 'text-pink-600 bg-pink-50' : textXPColor}`}>
                                            +{mission.xp} XP
                                        </span>
                                    </div>
                                )})}
                            </>
                        )}
                        </div>
                    </div>
                    );
                })}
            </div>
        </>
      ) : (
        <div className="space-y-6 animate-fade-in">
            <div className={`p-4 rounded-xl border ${isIkhwan ? 'bg-blue-50 border-blue-100' : 'bg-pink-50 border-pink-100'}`}>
                <h3 className={`font-bold text-sm ${isIkhwan ? 'text-blue-800' : 'text-pink-800'}`}>
                    Perencanaan Amal Besok
                </h3>
                <p className={`text-xs mt-1 ${isIkhwan ? 'text-blue-600' : 'text-pink-600'}`}>
                    "Sistem akan menyiapkan misi default jika Anda tidak merencanakan."
                </p>
                {(!user.plannedMissionIds || user.plannedMissionIds.length === 0) && (
                     <div className="mt-2 text-[10px] bg-white/50 inline-block px-2 py-1 rounded">
                        Status: <span className="font-bold">System Default Active</span>
                     </div>
                )}
            </div>

            <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3 bg-white border border-dashed border-slate-300 rounded-xl text-slate-500 font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-400 transition-all"
            >
                <Plus size={18} /> Buat Misi Sendiri
            </button>

            {(Object.entries(groupedMissions) as [PeranType, MissionItem[]][]).map(([type, items]) => {
                const minLevel = roleUnlockConfig[type] || 0;
                const isLocked = user.level < minLevel;

                return (
                <div key={type}>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 ml-1">{type}</h3>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    {isLocked ? (
                        <div className="p-4 flex flex-col items-center justify-center text-center bg-slate-50">
                             <div className="bg-slate-200 p-2 rounded-full mb-1">
                                <Lock size={16} className="text-slate-400" />
                            </div>
                            <p className="text-xs text-slate-400">
                                Terkunci (Perlu Level {minLevel})
                            </p>
                        </div>
                    ) : (
                        items.map((mission, idx) => {
                            const isSelected = planSelection.includes(mission.id);
                            return (
                            <div 
                                key={mission.id}
                                onClick={() => togglePlanSelection(mission.id)}
                                className={`p-4 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors ${
                                    idx !== items.length - 1 ? 'border-b border-slate-50' : ''
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                                        isSelected
                                            ? (isIkhwan ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600')
                                            : 'bg-slate-100 text-slate-300'
                                    }`}>
                                        {isSelected ? <Check size={16} /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                                    </div>
                                    <span className={`text-sm font-medium ${isSelected ? 'text-slate-800' : 'text-slate-400'}`}>
                                        {mission.title}
                                    </span>
                                </div>
                            </div>
                        )})
                    )}
                    </div>
                </div>
            )})}

            <div className="sticky bottom-20">
                <button 
                    onClick={savePlan}
                    className={`w-full py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 ${
                        isPlanSaved 
                        ? 'bg-green-600 shadow-green-200' 
                        : (isIkhwan ? 'bg-blue-600 shadow-blue-200' : 'bg-pink-600 shadow-pink-200')
                    }`}
                >
                    {isPlanSaved ? <><Check size={20} /> Tersimpan!</> : <><Save size={20} /> Simpan Rencana</>}
                </button>
            </div>
        </div>
      )}

      {/* Create Mission Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-bold text-slate-800">Buat Misi Sendiri</h3>
                      <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full hover:bg-slate-200 text-slate-500">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <div className="p-4 space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Judul Misi</label>
                          <input 
                              type="text"
                              value={newMissionTitle}
                              onChange={(e) => setNewMissionTitle(e.target.value)}
                              placeholder="Contoh: Belajar Coding 1 Jam"
                              className="w-full text-sm border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                              autoFocus
                          />
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Peran</label>
                          <select 
                              value={newMissionCategory}
                              onChange={(e) => setNewMissionCategory(e.target.value as PeranType)}
                              className="w-full text-sm border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                          >
                              {Object.values(PeranType)
                                .filter(type => type !== PeranType.MUSLIM) // Exclude Muslim type for custom missions
                                .map(type => (
                                  <option key={type} value={type}>{type}</option>
                              ))}
                          </select>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex justify-between items-center">
                          <span className="text-xs text-blue-700 font-medium">Bobot Otomatis</span>
                          <span className="text-sm font-bold text-blue-800">{CATEGORY_XP_WEIGHTS[newMissionCategory]} XP</span>
                      </div>
                  </div>

                  <div className="p-4 border-t border-slate-100">
                      <button 
                          onClick={handleCreateMission}
                          disabled={!newMissionTitle}
                          className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all"
                      >
                          Tambahkan ke Jadwal
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default Missions;
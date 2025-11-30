
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Missions from './pages/Missions';
import JalsahPage from './pages/Jalsah';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import { calculateLevel, DAILY_MISSIONS, DEFAULT_ROLE_UNLOCKS } from './constants';
import { User, MissionItem, PeranType, Kajian, Jalsah, Article, JalsahInvitation } from './types';

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated }: React.PropsWithChildren<{ isAuthenticated: boolean }>) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Layout for authenticated pages (Header + Content + Nav)
const MainLayout = ({ children, user, onLogout }: React.PropsWithChildren<{ user: User, onLogout: () => void }>) => (
  <div className="min-h-screen bg-slate-50 text-slate-900 max-w-md mx-auto relative shadow-2xl overflow-hidden flex flex-col">
    <Header user={user} onLogout={onLogout} />
    <main className="flex-1 overflow-y-auto no-scrollbar">
      {children}
    </main>
    <Navigation />
  </div>
);

const App: React.FC = () => {
  // Initialize with null to force login
  const [user, setUser] = useState<User | null>(null);
  
  // Global Mission State
  const [globalMissions, setGlobalMissions] = useState<MissionItem[]>(DAILY_MISSIONS);
  
  // Global Role Unlock Configuration
  const [roleUnlockConfig, setRoleUnlockConfig] = useState<Record<PeranType, number>>(DEFAULT_ROLE_UNLOCKS);

  // Global Kajian State
  const [kajians, setKajians] = useState<Kajian[]>([]);

  // Global Article State
  const [articles, setArticles] = useState<Article[]>([]);

  // Global Jalsah State
  const [jalsahs, setJalsahs] = useState<Jalsah[]>([]);

  // Global Invitations State
  const [invitations, setInvitations] = useState<JalsahInvitation[]>([]);
  
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddXP = (amount: number) => {
    if (!user) return;
    setUser(prev => {
      if (!prev) return null;
      
      const newTotalXP = prev.totalXP + amount;
      const newLevel = calculateLevel(newTotalXP);
      
      // Update Velocity History (simulating "Today" is the last entry)
      const newHistory = [...prev.velocityHistory];
      const todayIndex = newHistory.length - 1;
      
      if (todayIndex >= 0) {
        newHistory[todayIndex] = {
            ...newHistory[todayIndex],
            xp: Math.max(0, newHistory[todayIndex].xp + amount)
        };
      }

      return {
        ...prev,
        totalXP: newTotalXP,
        level: newLevel,
        velocityHistory: newHistory
      };
    });
  };

  const handleUpdatePlan = (missionIds: string[]) => {
    if (!user) return;
    setUser(prev => prev ? { ...prev, plannedMissionIds: missionIds } : null);
  };

  const handleAddMission = (newMission: MissionItem) => {
    setGlobalMissions(prev => [...prev, newMission]);
  };

  // Kajian Handlers
  const handleCreateKajian = (newKajian: Kajian) => {
    setKajians(prev => [newKajian, ...prev]);
  };

  const handleUpdateKajianStatus = (id: string, status: 'approved' | 'rejected') => {
    setKajians(prev => prev.map(k => k.id === id ? { ...k, status } : k));
  };

  // Article Handlers
  const handleCreateArticle = (newArticle: Article) => {
    setArticles(prev => [newArticle, ...prev]);
  };

  const handleUpdateArticleStatus = (id: string, status: 'approved' | 'rejected') => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  // Jalsah Handlers
  const handleCreateJalsah = (newJalsah: Jalsah) => {
    setJalsahs(prev => [...prev, newJalsah]);
    if (user && user.id === newJalsah.musyrifId) {
       setUser({ ...user, jalsahId: newJalsah.id });
    }
  };

  const handleUpdateJalsah = (updatedJalsah: Jalsah) => {
    setJalsahs(prev => prev.map(h => h.id === updatedJalsah.id ? updatedJalsah : h));
  };

  const handleDeleteJalsah = (id: string) => {
    setJalsahs(prev => prev.filter(h => h.id !== id));
    if (user && user.jalsahId === id) {
        setUser({ ...user, jalsahId: undefined });
    }
  };

  const handleUpdateJalsahStatus = (id: string, status: 'approved' | 'rejected', reason?: string) => {
    setJalsahs(prev => prev.map(h => h.id === id ? { ...h, status, rejectionReason: reason } : h));
  };

  // Invitation Logic
  const handleSendInvitation = (invitation: JalsahInvitation) => {
    // Check if already invited
    const exists = invitations.find(i => 
      i.jalsahId === invitation.jalsahId && 
      i.targetUsername === invitation.targetUsername &&
      i.status === 'pending'
    );
    if (!exists) {
      setInvitations(prev => [...prev, invitation]);
    }
  };

  const handleAcceptInvitation = (invitationId: string) => {
    const invite = invitations.find(i => i.id === invitationId);
    if (!invite) return;

    // 1. Update Invitation Status
    setInvitations(prev => prev.map(i => i.id === invitationId ? { ...i, status: 'accepted' } : i));

    // 2. Add member to Jalsah
    setJalsahs(prev => prev.map(h => {
        if (h.id === invite.jalsahId) {
            return { ...h, memberIds: [...h.memberIds, user?.id || invite.memberId] };
        }
        return h;
    }));

    // 3. Update User Status
    if (user) {
        setUser({ ...user, jalsahId: invite.jalsahId });
    }
  };

  const handleRejectInvitation = (invitationId: string) => {
     setInvitations(prev => prev.map(i => i.id === invitationId ? { ...i, status: 'rejected' } : i));
  };

  // Deprecated direct add, kept for admin dashboard potentially
  const handleAddMemberToJalsah = (jalsahId: string, memberId: string) => {
    setJalsahs(prev => prev.map(h => {
        if (h.id === jalsahId) {
            return { ...h, memberIds: [...h.memberIds, memberId] };
        }
        return h;
    }));
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/register" 
          element={!user ? <Register onLogin={handleLogin} /> : <Navigate to="/" replace />} 
        />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute isAuthenticated={!!user}>
            <MainLayout user={user!} onLogout={handleLogout}>
              <Dashboard 
                user={user!} 
                missions={globalMissions} 
                onUpdateMissions={setGlobalMissions}
                roleUnlockConfig={roleUnlockConfig}
                onUpdateRoleConfig={setRoleUnlockConfig}
                
                // Props for Admin/Musyrif
                kajians={kajians}
                onUpdateKajianStatus={handleUpdateKajianStatus}
                articles={articles}
                onCreateArticle={handleCreateArticle}
                onUpdateArticleStatus={handleUpdateArticleStatus}
                jalsahs={jalsahs}
                onCreateKajian={handleCreateKajian}
                onCreateJalsah={handleCreateJalsah}
                onUpdateJalsah={handleUpdateJalsah}
                onDeleteJalsah={handleDeleteJalsah}
                onUpdateJalsahStatus={handleUpdateJalsahStatus}
                onAddMemberToJalsah={handleAddMemberToJalsah}
                onSendInvitation={handleSendInvitation}
              />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/missions" element={
          <ProtectedRoute isAuthenticated={!!user}>
            <MainLayout user={user!} onLogout={handleLogout}>
               <Missions 
                  user={user!} 
                  onAddXP={handleAddXP} 
                  globalMissions={globalMissions}
                  onUpdatePlan={handleUpdatePlan}
                  onAddMission={handleAddMission}
                  roleUnlockConfig={roleUnlockConfig}
               />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/jalsah" element={
          <ProtectedRoute isAuthenticated={!!user}>
            <MainLayout user={user!} onLogout={handleLogout}>
              <JalsahPage 
                user={user!}
                invitations={invitations}
                onAcceptInvitation={handleAcceptInvitation}
                onRejectInvitation={handleRejectInvitation}
              />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute isAuthenticated={!!user}>
            <MainLayout user={user!} onLogout={handleLogout}>
              <Profile user={user!} />
            </MainLayout>
          </ProtectedRoute>
        } />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

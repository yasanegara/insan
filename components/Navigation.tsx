
import React from 'react';
import { Home, CheckSquare, Users, UserCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Beranda', icon: <Home size={24} /> },
    { path: '/missions', label: 'Misi', icon: <CheckSquare size={24} /> },
    { path: '/jalsah', label: 'Jalsah', icon: <Users size={24} /> },
    { path: '/profile', label: 'Profil', icon: <UserCircle size={24} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                isActive ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`mb-1 ${isActive ? 'scale-110' : ''} transition-transform`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;

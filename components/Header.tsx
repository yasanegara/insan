import React from 'react';
import { Bell, Trophy, LogOut } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-sm z-40 border-b border-slate-100 px-4 py-3 flex justify-between items-center max-w-md mx-auto w-full">
      <div className="flex items-center gap-3">
        <img 
          src={user.avatarUrl} 
          alt={user.name} 
          className="w-10 h-10 rounded-full border-2 border-blue-100 object-cover"
        />
        <div>
          <h1 className="text-sm font-bold text-slate-800 leading-tight">{user.name}</h1>
          <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
            <Trophy size={12} />
            <span>{user.totalXP.toLocaleString()} XP</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button className="p-2 text-slate-400 hover:text-slate-600 relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
            <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Bell, 
  Settings, 
  LogOut,
  Trophy,
  CreditCard,
  MessageSquare,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-72 bg-white border-r border-slate-200 h-screen flex flex-col transition-all overflow-hidden relative shadow-sm">
      <div className="p-8 border-b border-slate-50 flex items-center justify-between">
        <h1 className="text-xl font-extrabold tracking-tight flex items-center gap-3 text-slate-900">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg shadow-indigo-200">IC</div>
          <span>IDEAL <span className="text-indigo-600">CLASSES</span></span>
        </h1>
        <button onClick={onClose} className="p-2 text-slate-400 lg:hidden hover:bg-slate-50 rounded-lg transition-colors">
          <X size={20} />
        </button>
      </div>
      
      <div className="px-6 py-6 border-b border-slate-50">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">Main Menu</p>
        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`
                flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200
                ${isActive(item.path) 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 ring-4 ring-indigo-50' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'}
              `}
            >
              <div className={isActive(item.path) ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}>
                {item.icon}
              </div>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="mt-auto p-6 border-t border-slate-50 bg-slate-50/50">
        <button 
          onClick={() => { logout(); onClose(); }}
          className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-bold text-sm text-slate-500 hover:text-red-600 hover:bg-red-50/50 transition-all group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

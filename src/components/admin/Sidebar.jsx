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

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <BookOpen size={20} />, label: 'Subjects', path: '/admin/subjects' },
    { icon: <Users size={20} />, label: 'Students', path: '/admin/students' },
    { icon: <CreditCard size={20} />, label: 'Fees', path: '/admin/fees' },
    { icon: <Bell size={20} />, label: 'Broadcast', path: '/admin/broadcast' },
    { icon: <Trophy size={20} />, label: 'Hall of Fame', path: '/admin/hall-of-fame' },
    { icon: <MessageSquare size={20} />, label: 'Doubts', path: '/admin/doubts' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col transition-all overflow-hidden relative">
      <div className="p-8 border-b border-slate-100 flex items-center justify-between">
        <h1 className="text-xl font-black tracking-tight flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white text-xs">IC</div>
          <span>IDEAL CLASSES</span>
        </h1>
        <button onClick={onClose} className="p-2 text-slate-400 lg:hidden">
          <X size={20} />
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all
              ${isActive(item.path) 
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
            `}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-100 bg-white">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-red-500 hover:bg-red-50 transition-all">
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

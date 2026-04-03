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
  MessageSquare
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
    <aside className="w-[280px] bg-white border-r border-slate-200 h-screen flex flex-col transition-all overflow-hidden relative shadow-2xl z-[200]">
      <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white relative z-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-white text-xs font-black shadow-lg shadow-slate-200">IC</div>
          <div>
            <h1 className="text-sm font-black tracking-[0.2em] text-slate-900 leading-none">IDEAL</h1>
            <p className="text-[9px] font-black text-slate-400 tracking-[0.3em] mt-1.5 uppercase leading-none">Protocol</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-black hover:bg-slate-100 lg:hidden transition-all shadow-sm">
          <X size={18} />
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto px-4 py-8 space-y-2 no-scrollbar scroll-smooth">
        {menuItems.map((item, index) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`
              flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 group
              ${isActive(item.path) 
                ? 'bg-slate-900 text-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] -translate-y-0.5' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1'}
            `}
          >
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
              ${isActive(item.path) ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-slate-900 shadow-inner'}
            `}>
              {item.icon}
            </div>
            <span className="flex-1 truncate">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="p-6 border-t border-slate-100 bg-white relative z-20">
        <button className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-red-500 bg-red-50/30 border border-red-100/50 hover:bg-red-500 hover:text-white transition-all duration-300 group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white text-red-500 group-hover:bg-white/20 group-hover:text-white shadow-sm transition-all duration-300">
            <LogOut size={20} />
          </div>
          Sign Out Protocol
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Bell,
  Settings,
  LogOut,
  Trophy,
  CreditCard,
  MessageSquare,
  Layout,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import logo from '../../assets/app-icon.jpg';

const Sidebar = ({ onClose }) => {
  const location = useLocation();

  const menuItems = [
    { icon: <Layout size={18} />, label: 'Curriculum Hub', path: '/admin' },
    { icon: <Users size={18} />, label: 'Scholar Registry', path: '/admin/students' },
    { icon: <CreditCard size={18} />, label: 'Financial Ledger', path: '/admin/fees' },
    { icon: <Bell size={18} />, label: 'Authority Broadcast', path: '/admin/broadcast' },
    { icon: <MessageSquare size={18} />, label: 'Query Resolution', path: '/admin/doubts' },
    { icon: <Trophy size={18} />, label: 'Hall of Fame', path: '/admin/hall-of-fame' },
    { icon: <Settings size={18} />, label: 'System Settings', path: '/admin/settings' },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-72 bg-[#0a1120] min-h-screen flex flex-col transition-all overflow-hidden relative border-r border-white/5 shadow-2xl">
      {/* Visual Atmospheric Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-primary-accent/5 blur-[80px] -translate-y-1/2 rounded-full pointer-events-none"></div>

      <div className="p-10 border-b border-white/5 relative z-10">
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-10 w-auto object-contain drop-shadow-md" />
            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black text-white tracking-tighter italic leading-none">IDEAL <span className="text-primary-accent not-italic">ADMIN</span></h1>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mt-1.5 opacity-60">Executive Portal</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto custom-scrollbar relative z-10">
        <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] mb-6 px-6 italic">Navigator Authority</div>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`
                     w-full group flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 relative overflow-hidden
                     ${active ? 'bg-primary-accent text-white shadow-2xl shadow-primary-accent/10 translate-x-1 italic' : 'text-white/30 hover:text-white hover:bg-white/5'}
                  `}
            >
              <div className={`p-2.5 rounded-xl transition-all duration-300 ${active ? 'bg-white/20 text-white shadow-inner' : 'bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white'}`}>
                {item.icon}
              </div>
              <span className="relative z-10">{item.label}</span>
              {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
              {active && <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full animate-pulse-glow"></div>}
            </Link>
          );
        })}
      </nav>

      <div className="p-8 border-t border-white/5 relative z-10 bg-[#0a1120]/50 backdrop-blur-md">
        <button className="w-full group flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-danger hover:bg-danger/10 transition-all duration-300">
          <div className="p-2.5 bg-white/5 rounded-xl group-hover:bg-danger/20 transition-all">
            <LogOut size={18} />
          </div>
          <span>Terminate Admin</span>
        </button>
      </div>

      <style>{`
         .custom-scrollbar::-webkit-scrollbar { width: 4px; }
         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
         .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
         .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
         
         @keyframes pulse-glow {
            0%, 100% { transform: translateX(-100%); opacity: 0; }
            50% { transform: translateX(100%); opacity: 1; }
         }
         .animate-pulse-glow {
            animation: pulse-glow 3s infinite;
         }
      `}</style>
    </aside>
  );
};

export default Sidebar;

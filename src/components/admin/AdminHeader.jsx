import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = ({ title, actions, onMenuClick }) => {
  const { user } = useAuth();
  
  return (
    <header className="h-[90px] bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 sm:px-10 flex items-center justify-between sticky top-0 z-[150] shadow-sm">
      <div className="flex items-center gap-6 flex-1 min-w-0">
        <button 
          onClick={onMenuClick}
          className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-black hover:bg-slate-100 lg:hidden transition-all shadow-sm"
        >
          <Menu size={22} />
        </button>
        <div className="flex flex-col min-w-0">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase italic leading-none truncate">{title}</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 hidden sm:block">Administrative protocol • Ver: 2.0.4</p>
        </div>
        <div className="h-8 w-[1px] bg-slate-200 mx-4 hidden xl:block"></div>
        <div className="hidden xl:flex items-center gap-4 px-6 py-3 bg-slate-50 border border-slate-200 rounded-[20px] w-96 group focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-100 transition-all duration-300 shadow-inner">
          <Search size={18} className="text-slate-400 group-focus-within:text-black transition-colors" />
          <input 
            type="text" 
            placeholder="Search across repository protocol..." 
            className="bg-transparent border-none outline-none text-[11px] font-black uppercase tracking-widest w-full text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {actions && <div className="flex items-center gap-3 mr-4">{actions}</div>}
        <button className="p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all">
          <Bell size={20} />
        </button>
        <button className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white text-xs font-black">A</div>
          <span className="text-xs font-bold text-slate-900 uppercase tracking-widest hidden sm:block">Admin</span>
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;

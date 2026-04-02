import React from 'react';
import { Search, Bell, User } from 'lucide-react';

const AdminHeader = ({ title, actions }) => {
  return (
    <header className="h-[80px] bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase italic leading-none">{title}</h2>
        <div className="h-4 w-[1px] bg-slate-200 hidden md:block"></div>
        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl w-80">
          <Search size={16} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search across repository..." 
            className="bg-transparent border-none outline-none text-xs font-semibold w-full text-slate-900 placeholder:text-slate-400"
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

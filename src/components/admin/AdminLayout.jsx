import React, { useState } from 'react';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';
import { Menu } from 'lucide-react';

const AdminLayout = ({ children, title, headerActions }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--bg-main)]">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Wrapper */}
      <div className={`
        fixed inset-y-0 left-0 z-[101] lg:relative lg:z-0 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[90px] bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-[90]">
          <div className="flex items-center gap-4 overflow-hidden">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-50 text-slate-500 lg:hidden shrink-0"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl lg:text-2xl font-extrabold tracking-tight text-slate-900 truncate">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-2 lg:gap-4 shrink-0">
            {headerActions}
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 animate-fadeIn">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

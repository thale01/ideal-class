import React, { useState } from 'react';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';
import { Menu } from 'lucide-react';

const AdminLayout = ({ children, title, headerActions }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
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
        <header className="h-[80px] bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-[90]">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-50 text-slate-500 lg:hidden"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg lg:text-xl font-bold tracking-tight text-slate-900 uppercase italic leading-none truncate">{title}</h2>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            {headerActions}
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 animate-fadeIn">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

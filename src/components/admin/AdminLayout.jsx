import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Layout, Bell, ShieldCheck, LogOut, Mail } from 'lucide-react';
import logo from '../../assets/logo-main.png';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children, title, headerActions, hideSidebar = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-main transition-colors duration-500 overflow-x-hidden">
      {/* Visual Atmospheric Elements */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary-accent/5 -translate-y-1/2 translate-x-1/4 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Mobile Sidebar Overlay */}
      {!hideSidebar && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] lg:hidden animate-fadeIn"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Wrapper */}
      {!hideSidebar && (
        <aside className={`
          fixed inset-y-0 left-0 z-[101] w-72 transform transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </aside>
      )}

      <div className={`flex-1 flex flex-col min-w-0 relative z-10 transition-all duration-500 ${hideSidebar ? 'w-full' : ''}`}>
        <header className="h-24 bg-surface/80 backdrop-blur-3xl border-b border-subtle px-6 lg:px-12 flex items-center justify-between sticky top-0 z-[180] overflow-visible">
          <div className="flex items-center gap-6">
            {!hideSidebar && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden w-12 h-12 rounded-2xl bg-white border border-subtle flex items-center justify-center text-primary shadow-sm hover:shadow-md transition-all active:scale-90"
              >
                <Menu size={22} />
              </button>
            )}
            
            {hideSidebar && (
               <div className="flex items-center gap-3 mr-4 border-r border-subtle pr-6">
                  <img src={logo} alt="Logo" className="h-10 w-auto object-contain drop-shadow-sm" />
                  <div className="hidden sm:block">
                     <h1 className="text-xl font-black text-primary tracking-tighter italic leading-none">IDEAL <span className="text-primary-accent not-italic">ADMIN</span></h1>
                     <p className="text-[9px] font-black text-dim uppercase tracking-[0.3em] mt-1.5 opacity-60">Executive Panel</p>
                  </div>
               </div>
            )}

            <div>
               <h2 className="text-xl lg:text-2xl font-black tracking-tighter text-bright uppercase italic leading-none truncate max-w-[200px] lg:max-w-md">{title}</h2>
               <p className="hidden sm:block text-[9px] font-black text-dim uppercase tracking-[0.3em] mt-2 opacity-60">Verified Admin Protocol</p>
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-10">
            <div className="flex items-center gap-6 pr-6 border-r border-subtle">
               {headerActions}
            </div>

            <div className="relative">
               <div 
                 onClick={() => {
                   console.log("Profile Trigger Clicked", !showProfile);
                   setShowProfile(!showProfile);
                 }}
                 className="flex items-center gap-4 cursor-pointer select-none group/avatar relative z-[210]"
               >
                  <div className="hidden lg:text-right">
                     <p className="text-xs font-black text-bright uppercase tracking-tight italic truncate max-w-[150px]">{user?.name || 'Administrator'}</p>
                     <div className="flex items-center gap-1.5 justify-end mt-1 opacity-60 group-hover/avatar:opacity-100 transition-opacity">
                        <ShieldCheck size={10} className="text-primary-accent" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-dim">Authority ID</span>
                     </div>
                  </div>
                  <div className="w-12 h-12 rounded-[18px] bg-[#0a1120] border-2 border-white/5 group-hover/avatar:border-primary-accent/50 flex items-center justify-center font-black text-white text-lg shadow-xl shadow-primary/10 relative overflow-hidden transition-all active:scale-95">
                     <div className="absolute inset-0 bg-primary-accent/20 translate-y-full group-hover/avatar:translate-y-0 transition-transform duration-500"></div>
                     <span className="relative z-10 font-black">{user?.name?.charAt(0) || 'A'}</span>
                  </div>
               </div>

               {/* Profile Dropdown - Modern Cinematic Design */}
               {showProfile && (
                  <>
                     <div className="fixed inset-0 z-[190] bg-transparent" onClick={() => setShowProfile(false)}></div>
                     <div className="absolute top-20 right-0 w-80 bg-surface shadow-[0_32px_100px_rgba(0,0,0,0.8)] rounded-[32px] p-8 border border-subtle z-[200] backdrop-blur-3xl animate-fadeIn">
                        <div className="mb-8">
                           <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em] mb-4 block italic">Authorized User</span>
                           <h3 className="text-xl font-black text-bright tracking-tighter truncate italic">{user?.name || 'Administrator'}</h3>
                           <div className="flex items-center gap-2 mt-2 text-dim">
                              <Mail size={12} className="text-primary-accent" />
                              <p className="text-[10px] font-bold uppercase tracking-widest truncate">{user?.email || (user?.phone ? `+91 ${user.phone}` : 'ADMIN@IDEAL.CLOUD')}</p>
                           </div>
                        </div>

                        <div className="h-px bg-subtle mb-8"></div>

                        <div className="space-y-4">
                           <div className="flex items-center gap-4 p-5 rounded-2xl bg-alt/50 border border-subtle">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                 <ShieldCheck size={20} />
                              </div>
                              <div>
                                 <p className="text-[10px] font-black text-bright uppercase tracking-widest">Admin Role</p>
                                 <p className="text-[9px] font-bold text-dim uppercase tracking-tight">Full Authority Access</p>
                              </div>
                           </div>
                           
                           <button 
                             onClick={handleLogout}
                             className="w-full flex items-center gap-4 p-5 rounded-2xl text-danger hover:bg-danger/10 transition-all group/logout"
                           >
                              <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center group-hover/logout:bg-danger group-hover/logout:text-white transition-all">
                                 <LogOut size={20} />
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-widest word-spacing-tight">Terminate Authority</span>
                           </button>
                        </div>
                     </div>
                  </>
               )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-12 animate-fadeUp relative z-10">
          <div className={`${hideSidebar ? 'max-w-[1400px]' : 'max-w-7xl'} mx-auto`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

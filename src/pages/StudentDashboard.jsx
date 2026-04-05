import React, { useState } from 'react';
import {
   BookOpen, Bell, Layout, MessageSquare, Award,
   CreditCard, Search, ChevronRight, GraduationCap,
   Settings, LogOut, Sun, Moon, CheckCircle2, AlertCircle, FileText, Play, Trophy, Folder, ChevronLeft, ShieldCheck
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import { useUpdate } from '../context/UpdateContext';
import { useFee } from '../context/FeeContext';
import { useDoubt } from '../context/DoubtContext';
import { useTheme } from '../context/ThemeContext';
import { useAnnouncement } from '../context/AnnouncementContext';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const StudentDashboard = () => {
   const { user, logout } = useAuth();
   const { theme, toggleTheme } = useTheme();
   const { subjects, courses } = useCourse();
   const { updates } = useUpdate();
   const { fees } = useFee();
   const { doubts, askDoubt } = useDoubt();
   const { announcements } = useAnnouncement();

   const [activeTab, setActiveTab] = useState('courses');
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedCourseId, setSelectedCourseId] = useState(null);
   const [newDoubt, setNewDoubt] = useState({ subject: '', question: '' });
   const [isSubmitting, setIsSubmitting] = useState(false);

   const myFees = fees.filter(f => f.studentName === user?.name || f.email === user?.email);
   const myDoubts = doubts.filter(d => d.studentName === user?.name || d.email === user?.email);

   const menuItems = [
      { id: 'courses', label: 'My Courses', icon: BookOpen },
      { id: 'queries', label: 'Query Desk', icon: MessageSquare },
      { id: 'financials', label: 'Payments', icon: CreditCard },
      { id: 'notices', label: 'Bulletin', icon: Bell },
      { id: 'achievements', label: 'Hall of Fame', icon: Award },
      { id: 'settings', label: 'Profile', icon: Settings },
   ];

   const handleAskDoubt = async (e) => {
      e.preventDefault();
      if (!newDoubt.subject || !newDoubt.question) return;
      setIsSubmitting(true);
      await askDoubt({
         ...newDoubt,
         studentName: user.name,
         email: user.email
      });
      setNewDoubt({ subject: '', question: '' });
      setIsSubmitting(false);
   };

   return (
      <div className="min-h-screen bg-main flex flex-col md:flex-row transition-colors duration-500 overflow-x-hidden relative">
         {/* Sidebar Navigation - Fixed on Desktop */}
         <aside className={`fixed inset-y-0 left-0 z-[100] w-72 bg-[#0a1120] text-white border-r border-white/5 transition-transform duration-500 md:translate-x-0 ${activeTab === 'menu-open' ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            <div className="p-10 border-b border-white/5">
               <div className="flex items-center gap-4">
                  <img src={logo} alt="Ideal Classes Logo" className="h-10 w-auto object-contain drop-shadow-md" />
                  <div>
                     <h1 className="text-xl font-black text-white tracking-tighter italic leading-none">IDEAL <span className="text-primary-accent not-italic">CLASSES</span></h1>
                     <p className="text-[9px] font-black uppercase tracking-[0.3em] mt-2 text-white/40">Scholar Gateway</p>
                  </div>
               </div>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto no-scrollbar">
               <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-6 px-6">Navigator</div>
               {menuItems.map(item => (
                  <button
                     key={item.id}
                     onClick={() => { setActiveTab(item.id); }}
                     className={`w-full group flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 relative overflow-hidden ${activeTab === item.id ? 'bg-primary-accent text-white shadow-2xl scale-105' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                  >
                     <div className={`p-2.5 rounded-xl transition-all duration-300 ${activeTab === item.id ? 'bg-white/20 text-white shadow-inner' : 'bg-white/5 text-white/40 group-hover:text-white'}`}>
                        <item.icon size={18} />
                     </div>
                     <span className="relative z-10">{item.label}</span>
                     {activeTab === item.id && <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full animate-pulse-glow"></div>}
                  </button>
               ))}
            </nav>

            <div className="p-8 border-t border-white/5">
               <button onClick={logout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-white/40 hover:text-danger hover:bg-danger/10 transition-all duration-300 group">
                  <div className="p-2.5 bg-white/5 rounded-xl group-hover:bg-danger/20 transition-all">
                     <LogOut size={18} />
                  </div>
                  <span>Terminate Session</span>
               </button>
            </div>
         </aside>

         {/* Backdrop for mobile sidebar */}
         {activeTab === 'menu-open' && (
            <div 
               className="fixed inset-0 bg-black/80 backdrop-blur-md z-[90] md:hidden animate-fadeIn"
               onClick={() => setActiveTab('courses')}
            ></div>
         )}

         {/* Main content area */}
         <main className="flex-1 min-h-screen md:ml-72 min-w-0 transition-all duration-300 relative">
            {/* Visual Atmospheric Elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-accent/5 -translate-y-1/2 translate-x-1/4 blur-[140px] rounded-full pointer-events-none"></div>

            <header className="sticky top-0 z-[80] bg-surface/80 backdrop-blur-3xl border-b border-subtle h-24">
               <div className="px-8 lg:px-12 flex items-center justify-between w-full h-full gap-4">
                  <div className="flex items-center gap-6">
                     <button 
                        onClick={() => setActiveTab('menu-open')}
                        className="md:hidden w-12 h-12 rounded-2xl bg-white border border-subtle flex items-center justify-center text-primary shadow-sm"
                     >
                        <Layout size={22} />
                     </button>
                     <div className="hidden sm:block">
                        <h2 className="text-2xl font-black text-primary tracking-tighter uppercase italic leading-none mb-2">{activeTab}</h2>
                        <p className="text-[10px] text-dim font-black uppercase tracking-[0.3em] opacity-60">Verified Educational Protocol</p>
                     </div>
                     <div className="sm:hidden flex items-center gap-3">
                        <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
                        <span className="text-xs font-black italic text-primary uppercase tracking-tighter">IDEAL</span>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-8">
                     <div className="flex items-center gap-2 pr-4 sm:pr-8 border-r border-subtle">
                        <button onClick={toggleTheme} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-alt border border-subtle flex items-center justify-center text-primary hover:bg-white hover:shadow-md transition-all active:scale-90">
                           {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-alt border border-subtle flex items-center justify-center text-primary hover:bg-white hover:shadow-md transition-all active:scale-90 relative group">
                           <Bell size={18} />
                           <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-primary-accent rounded-full ring-2 ring-surface animate-pulse"></div>
                        </button>
                     </div>

                     <div className="flex items-center gap-4">
                        <div className="hidden lg:text-right">
                           <p className="text-xs font-black text-primary uppercase tracking-tight italic truncate max-w-[150px]">{user?.name || 'Scholar'}</p>
                           <span className="badge-premium badge-primary text-[8px] font-black px-2 py-0.5 mt-1">Identity Verified</span>
                        </div>
                        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-[#0a1120] border-2 border-white/10 flex items-center justify-center font-black text-white text-base sm:text-xl shadow-xl shadow-primary/20 relative overflow-hidden group">
                           <div className="absolute inset-0 bg-primary-accent/40 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                           <span className="relative z-10">{user?.name?.charAt(0) || 'S'}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </header>

            <div className="container-premium py-10 animate-fadeUp">
                {activeTab === 'courses' && (
                  <>
                     {!selectedCourseId ? (
                        <div className="space-y-12 animate-fadeIn">
                           <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
                              <div>
                                 <h3 className="text-3xl font-black text-primary tracking-tighter uppercase italic leading-none mb-3">Learning <span className="text-primary-accent not-italic">Vault</span></h3>
                                 <p className="text-[10px] text-dim font-black uppercase tracking-[0.4em] opacity-60">High-Density Academic Hub</p>
                              </div>

                              <div className="relative group w-full sm:w-96">
                                 <input
                                    type="text"
                                    placeholder="SEARCH REPOSITORY..."
                                    className="input-premium py-4 pl-12 bg-white border-subtle text-[10px] font-black tracking-widest"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                 />
                                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-accent" size={18} />
                              </div>
                           </div>

                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                              {courses.filter(c => user?.assignedCourses?.includes(c._id)).map((course, i) => (
                                 <div 
                                    key={course._id || i} 
                                    onClick={() => setSelectedCourseId(course._id)} 
                                    className="card-premium group cursor-pointer hover:border-primary-accent/40 border-slate-100 flex flex-col justify-between h-[280px] p-10 relative overflow-hidden"
                                 >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-accent/5 rounded-bl-[64px] transition-all duration-500 group-hover:scale-125"></div>
                                    
                                    <div className="relative z-10">
                                       <div className="flex items-center justify-between mb-8">
                                          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-4xl shadow-sm group-hover:shadow-lg transition-all duration-500">
                                             {course.icon || '📂'}
                                          </div>
                                          <div className="w-10 h-10 rounded-full bg-alt group-hover:bg-primary-accent group-hover:text-white flex items-center justify-center transition-all duration-500 group-hover:translate-x-1">
                                             <ChevronRight size={18} />
                                          </div>
                                       </div>
                                       <h4 className="text-2xl font-black text-primary mb-1 uppercase tracking-tighter italic group-hover:text-primary-accent transition-colors">{course.name}</h4>
                                       <p className="text-[10px] font-black text-dim uppercase tracking-[0.2em] opacity-60">{course.category || 'Standard Batch'}</p>
                                    </div>

                                    <div className="relative z-10 pt-6 border-t border-slate-100 flex items-center justify-between">
                                       <span className="badge-premium badge-primary px-3 py-1 font-black text-[9px] uppercase tracking-widest">{subjects.filter(s => s.courseId === course._id).length} Active Modules</span>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     ) : (
                        <div className="folder-view animate-fadeIn pb-20">
                           <div className="max-w-[1600px] mx-auto w-full">
                              {/* Header Section */}
                              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
                                 <div className="space-y-10">
                                    <button 
                                       onClick={() => setSelectedCourseId(null)}
                                       className="w-max px-6 py-3 rounded-xl bg-alt hover:bg-white border border-transparent hover:border-subtle text-primary font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 active:scale-95 group shadow-sm"
                                    >
                                       <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Vault
                                    </button>
                                    <div>
                                       <h2 className="text-4xl sm:text-6xl font-black text-primary uppercase tracking-tighter italic leading-none mb-4">
                                          {courses.find(c => c._id === selectedCourseId)?.name}
                                       </h2>
                                       <div className="flex items-center gap-4">
                                          <div className="w-4 h-4 rounded-full bg-primary-accent animate-pulse"></div>
                                          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-dim opacity-70">
                                             Batch Repository • {subjects.filter(s => s.courseId === selectedCourseId).length} Available Modules
                                          </p>
                                       </div>
                                    </div>
                                 </div>
                                 
                                 <div className="relative w-full sm:w-96">
                                    <input
                                       type="text"
                                       placeholder="LOCATE MODULE..."
                                       className="input-premium py-4 pl-12 bg-white border-subtle text-[10px] font-black tracking-widest"
                                       value={searchTerm}
                                       onChange={e => setSearchTerm(e.target.value)}
                                    />
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-accent" size={18} />
                                 </div>
                              </div>

                              {/* Content Grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                 {subjects.filter(s => s.courseId === selectedCourseId && s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((sub, i) => (
                                    <Link 
                                       key={sub._id || i} 
                                       to={`/student/course/${sub._id}`} 
                                       className="card-premium group cursor-pointer border-slate-100 hover:border-primary-accent/40 p-10 flex flex-col gap-10 transition-all hover:-translate-y-2 no-underline relative overflow-hidden"
                                    >
                                       <div className="absolute top-0 left-0 w-24 h-24 bg-primary/5 rounded-br-[48px] -ml-12 -mt-12 transition-all group-hover:scale-125"></div>
                                       
                                       <div className="relative z-10 flex items-center justify-between">
                                          <div className="w-20 h-20 rounded-3xl bg-white border border-slate-100 flex items-center justify-center text-5xl group-hover:scale-110 transition-all shadow-sm group-hover:shadow-lg">{sub.icon || '📘'}</div>
                                          <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:translate-x-1">
                                             <ChevronRight size={24} />
                                          </div>
                                       </div>
                                       <div className="relative z-10">
                                          <h4 className="text-2xl font-black text-primary uppercase mb-1 tracking-tighter italic group-hover:text-primary-accent transition-colors">{sub.name}</h4>
                                          <p className="text-[11px] font-black text-dim uppercase tracking-widest opacity-60 italic">{sub.category}</p>
                                       </div>
                                       <div className="relative z-10 flex gap-4 mt-2">
                                          <div className="flex-1 bg-alt/50 py-5 rounded-2xl text-center border border-transparent group-hover:bg-white group-hover:border-subtle transition-all">
                                             <p className="text-xl font-black text-primary italic leading-none mb-1">{sub.resources?.notes?.length || 0}</p>
                                             <p className="text-[9px] font-black text-dim uppercase tracking-widest opacity-60">Docs</p>
                                          </div>
                                          <div className="flex-1 bg-alt/50 py-5 rounded-2xl text-center border border-transparent group-hover:bg-white group-hover:border-subtle transition-all">
                                             <p className="text-xl font-black text-primary italic leading-none mb-1">{sub.resources?.videos?.length || 0}</p>
                                             <p className="text-[9px] font-black text-dim uppercase tracking-widest opacity-60">Videos</p>
                                          </div>
                                       </div>
                                    </Link>
                                 ))}
                              </div>

                              {subjects.filter(s => s.courseId === selectedCourseId).length === 0 && (
                                 <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-[48px] bg-alt/30">
                                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-8 shadow-sm">
                                       <BookOpen size={32} className="text-slate-200" />
                                    </div>
                                    <h4 className="text-xl font-black text-primary uppercase tracking-[0.2em] mb-2 italic">Repository Empty</h4>
                                    <p className="text-dim text-[10px] font-black uppercase tracking-widest opacity-40">Educational modules are being synthesized by admin</p>
                                 </div>
                              )}
                           </div>
                        </div>
                     )}
                  </>
               )}

               {activeTab === 'queries' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fadeIn pb-20">
                     <div className="lg:col-span-12 mb-4">
                         <h3 className="text-3xl font-black text-primary tracking-tighter uppercase italic leading-none mb-3">Query <span className="text-primary-accent not-italic">Desk</span></h3>
                         <p className="text-[10px] text-dim font-black uppercase tracking-[0.4em] opacity-60">Direct Administrative Communications</p>
                     </div>

                     <div className="lg:col-span-5 space-y-8">
                        <div className="card-premium sticky top-32 border-slate-100 p-10 shadow-xl bg-white">
                           <h3 className="text-2xl font-black text-primary tracking-tighter uppercase italic mb-8">Ask <span className="text-primary-accent not-italic">Scholar Question</span></h3>
                           <form onSubmit={handleAskDoubt} className="space-y-6">
                              <div>
                                 <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-2 block ml-1">Academic Domain (Subject)</label>
                                 <select
                                    className="input-premium h-14 bg-alt/50 font-bold text-xs"
                                    value={newDoubt.subject}
                                    onChange={e => setNewDoubt({ ...newDoubt, subject: e.target.value })}
                                    required
                                 >
                                    <option value="">Choose Domain...</option>
                                    {subjects.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                                 </select>
                              </div>
                              <div>
                                 <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-2 block ml-1">Technical Inquiry</label>
                                 <textarea
                                    className="input-premium min-h-[180px] resize-none pt-4 bg-alt/50 font-bold text-xs leading-relaxed"
                                    placeholder="State your academic concern precisely..."
                                    value={newDoubt.question}
                                    onChange={e => setNewDoubt({ ...newDoubt, question: e.target.value })}
                                    required
                                 ></textarea>
                              </div>
                              <button disabled={isSubmitting} className="btn-premium btn-premium-primary w-full py-5 text-[10px] font-black tracking-[0.2em] uppercase shadow-xl shadow-primary/20">
                                 {isSubmitting ? 'TRANSMITTING...' : 'INITIALIZE QUERY'}
                              </button>
                           </form>
                        </div>
                     </div>

                     <div className="lg:col-span-7 space-y-10">
                        <div>
                           <h3 className="text-xl font-black text-primary uppercase tracking-tighter italic mb-2">Resolution Log</h3>
                           <p className="text-[10px] text-dim font-black uppercase tracking-widest opacity-60">Verified query history</p>
                        </div>

                        {myDoubts.length === 0 && (
                           <div className="card-premium text-center py-24 border-dashed border-slate-100 italic text-dim font-black uppercase tracking-widest opacity-40 bg-white shadow-sm">
                              Zero Queries Initiated
                           </div>
                        )}

                        {myDoubts.map((d, i) => (
                           <div key={i} className={`card-premium group transition-all duration-500 hover:border-primary-accent/30 bg-white ${!d.isResolved ? 'border-l-4 border-l-primary-accent shadow-lg shadow-primary-accent/5' : 'opacity-80'}`}>
                              <div className="flex items-center justify-between mb-6">
                                 <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${d.isResolved ? 'bg-success/10 text-success' : 'bg-primary-accent/10 text-primary-accent'}`}>
                                       <MessageSquare size={18} />
                                    </div>
                                    <div>
                                       <span className="text-[10px] font-black text-dim uppercase tracking-[0.2em] block mb-1">{new Date(d.createdAt).toLocaleDateString()}</span>
                                       <span className="text-[9px] font-black uppercase tracking-widest text-primary italic">{d.subject}</span>
                                    </div>
                                 </div>
                                 {d.isResolved ? (
                                    <span className="badge-premium badge-success shadow-sm">Resolved</span>
                                 ) : (
                                    <span className="badge-premium badge-primary animate-pulse shadow-md shadow-primary/10">In Registry</span>
                                 )}
                              </div>
                              <div className="p-6 rounded-[24px] bg-alt/50 border border-transparent group-hover:border-subtle group-hover:bg-white mb-6 transition-all">
                                 <p className="text-sm font-black text-primary italic leading-relaxed opacity-80">"{d.question}"</p>
                              </div>
                              {d.isResolved && (
                                 <div className="mt-8 pt-8 border-t border-slate-100">
                                    <div className="flex items-center gap-3 mb-4 text-success">
                                       <CheckCircle2 size={16} />
                                       <p className="text-[9px] font-black uppercase tracking-[0.2em]">Authority Guidance</p>
                                    </div>
                                    <div className="p-6 rounded-[24px] bg-success/5 border border-success/10">
                                       <p className="text-sm text-primary font-black leading-relaxed">{d.answer}</p>
                                    </div>
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {activeTab === 'financials' && (
                  <div className="space-y-12 animate-fadeIn pb-20">
                     <div className="lg:col-span-12 mb-4">
                         <h3 className="text-3xl font-black text-primary tracking-tighter uppercase italic leading-none mb-3">Verified <span className="text-primary-accent not-italic">Ledger</span></h3>
                         <p className="text-[10px] text-dim font-black uppercase tracking-[0.4em] opacity-60">Academic Remittance & Remainder Protocol</p>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="card-premium bg-[#0a1120] text-white border-none p-12 overflow-hidden group shadow-2xl relative h-[240px] flex flex-col justify-center">
                           <div className="absolute top-0 right-0 w-48 h-48 bg-primary-accent/20 rounded-full blur-3xl -mr-24 -mt-24 group-hover:scale-150 transition-transform duration-1000"></div>
                           <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.4em] mb-4 relative z-10">Verified Remittance</p>
                           <h2 className="text-5xl font-black tracking-tighter italic relative z-10">₹{(myFees.reduce((acc, f) => acc + (Number(f.paidAmount) || 0), 0)).toLocaleString()}</h2>
                           <div className="mt-8 flex items-center gap-2 relative z-10 opacity-60">
                              <ShieldCheck size={14} className="text-primary-accent" />
                              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Encrypted Ledger Access</p>
                           </div>
                        </div>

                        <div className="card-premium p-12 border-slate-100 group shadow-lg h-[240px] flex flex-col justify-center bg-white">
                           <p className="text-[10px] font-black text-dim uppercase tracking-[0.4em] mb-4">Unresolved Dues</p>
                           <h2 className="text-5xl font-black text-danger tracking-tighter italic">₹{(myFees.reduce((acc, f) => acc + (Number(f.pendingFees) || 0), 0)).toLocaleString()}</h2>
                           <div className="mt-8 flex items-center gap-2 opacity-60">
                              <AlertCircle size={14} className="text-danger" />
                              <p className="text-[10px] text-dim font-black uppercase tracking-widest italic">Pending Next Academic Cycle</p>
                           </div>
                        </div>
                     </div>

                     <div className="card-premium p-0 overflow-hidden border-slate-100 shadow-xl bg-white">
                        <div className="px-10 py-8 border-b border-subtle bg-alt/30 flex items-center justify-between">
                           <div>
                              <h3 className="text-lg font-black text-primary uppercase tracking-tighter italic mb-1">Financial Log</h3>
                              <p className="text-[9px] font-black text-dim uppercase tracking-widest opacity-60">Authority Transaction Protocol Status</p>
                           </div>
                           <div className="w-12 h-12 rounded-2xl bg-white border border-subtle flex items-center justify-center text-primary shadow-sm"><CreditCard size={20} /></div>
                        </div>
                        <div className="overflow-x-auto no-scrollbar">
                           <table className="w-full text-left">
                              <thead className="bg-[#0a1120] text-white/40">
                                 <tr>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em]">Protocol Descriptor</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em]">Verified Quantum</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em]">Status Code</th>
                                    <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-right">Deferred</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                 {myFees.length === 0 && <tr><td colSpan="4" className="px-10 py-24 text-center text-dim font-black uppercase tracking-widest opacity-40 italic">Zero Remittance Logged</td></tr>}
                                 {myFees.map((f, i) => (
                                    <tr key={i} className="hover:bg-alt/10 transition-all group">
                                       <td className="px-10 py-8">
                                          <div className="flex items-center gap-3">
                                             <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                                             <span className="font-black text-primary uppercase text-xs tracking-tight italic">Academic Cycle / {f.paymentMode}</span>
                                          </div>
                                       </td>
                                       <td className="px-10 py-8 text-sm font-black text-primary italic">₹{(Number(f.paidAmount) || 0).toLocaleString()}</td>
                                       <td className="px-10 py-8"><span className="badge-premium badge-primary px-4 py-1.5 font-black text-[9px]">SYNCHRONIZED</span></td>
                                       <td className="px-10 py-8 text-right text-sm font-black text-danger italic">₹{(Number(f.pendingFees) || 0).toLocaleString()}</td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'notices' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn pb-20">
                     <div className="lg:col-span-12 mb-4">
                         <h3 className="text-3xl font-black text-primary tracking-tighter uppercase italic leading-none mb-3">High-Priority <span className="text-primary-accent not-italic">Notices</span></h3>
                         <p className="text-[10px] text-dim font-black uppercase tracking-[0.4em] opacity-60">Verified Academy Authority Broadcasts</p>
                     </div>
                     
                     {announcements.length === 0 && <div className="card-premium col-span-full text-center py-24 italic text-dim border-dashed border-slate-100 font-black uppercase tracking-widest opacity-40 bg-white shadow-sm">Bulletin Log Depleted</div>}
                     {announcements.map((ann, i) => (
                        <div key={ann._id || i} className="card-premium group relative overflow-hidden transition-all duration-500 hover:border-primary-accent/40 bg-white shadow-xl border-l-4 border-primary-accent/40" style={{ animationDelay: `${i * 0.1}s` }}>
                           <div className="absolute top-0 right-0 w-24 h-24 bg-primary-accent/5 rounded-bl-[48px] -mr-8 -mt-8 transition-transform group-hover:scale-125"></div>
                           <div className="flex items-center gap-4 mb-8">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border ${ann.type === 'urgent' ? 'bg-danger/5 text-danger border-danger/10' : 'bg-primary-accent/5 text-primary-accent border-primary-accent/10'}`}>
                                 {ann.type === 'urgent' ? <AlertCircle size={24} /> : <Bell size={24} />}
                              </div>
                              <div>
                                 <span className="text-[10px] font-black text-dim uppercase tracking-[0.2em] block mb-1">{new Date(ann.createdAt).toDateString()}</span>
                                 <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${ann.type === 'urgent' ? 'border-danger/10 text-danger bg-danger/5' : 'border-primary-accent/10 text-primary-accent bg-primary-accent/5'}`}>
                                    {ann.type} protocol
                                 </span>
                              </div>
                           </div>
                           <h4 className="text-xl font-black text-primary mb-4 leading-tight uppercase tracking-tighter italic">{ann.title}</h4>
                           <div className="p-6 rounded-2xl bg-alt/50 border border-transparent group-hover:border-subtle group-hover:bg-white mb-8 transition-all h-[120px] overflow-y-auto no-scrollbar">
                              <p className="text-primary text-sm font-black leading-relaxed italic opacity-80">"{ann.content}"</p>
                           </div>
                           <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                              <span className="text-[10px] font-black text-dim uppercase tracking-widest opacity-50">Academy Authority</span>
                              <div className="w-10 h-10 rounded-full bg-alt group-hover:bg-primary-accent group-hover:text-white flex items-center justify-center transition-all duration-500">
                                 <ChevronRight size={18} />
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}

               {activeTab === 'settings' && (
                  <div className="max-w-4xl mx-auto space-y-12 animate-fadeUp pb-20">
                     <div className="flex justify-center">
                        <div className="w-full max-w-2xl card-premium p-12 border-l-4 border-l-primary-accent/40 bg-white shadow-2xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-64 h-64 bg-primary-accent/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                           
                           <div className="flex flex-col sm:flex-row items-center gap-10 mb-12 relative z-10 text-center sm:text-left">
                              <div className="w-32 h-32 rounded-[40px] bg-[#0a1120] flex items-center justify-center font-black text-white text-5xl shadow-2xl shadow-primary/20 border-2 border-white/5 relative group-hover:scale-105 transition-transform duration-500">
                                 <div className="absolute inset-0 bg-primary-accent/20 rounded-[40px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                 <span className="relative z-10">{user?.name?.charAt(0)}</span>
                              </div>
                              <div className="flex-1">
                                 <div className="flex items-center gap-3 justify-center sm:justify-start mb-2">
                                    <ShieldCheck size={16} className="text-primary-accent" />
                                    <p className="text-[10px] font-black text-primary-accent uppercase tracking-[0.4em]">Scholar Identity Matrix</p>
                                 </div>
                                 <h3 className="text-4xl font-black text-primary uppercase tracking-tighter italic leading-none">{user?.name}</h3>
                                 <p className="text-[11px] font-black text-dim uppercase tracking-[0.2em] mt-3 opacity-60">Verified Institutional Access</p>
                              </div>
                           </div>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mb-12">
                              <div className="p-6 rounded-3xl bg-alt/40 border border-subtle group/item hover:border-primary-accent/30 transition-all hover:bg-white shadow-sm">
                                 <span className="text-[9px] font-black text-dim uppercase tracking-widest mb-3 block opacity-40">Digital Node (Email)</span>
                                 <span className="text-sm font-bold text-primary italic truncate block">{user?.email}</span>
                              </div>
                              <div className="p-6 rounded-3xl bg-alt/40 border border-subtle group/item hover:border-primary-accent/30 transition-all hover:bg-white shadow-sm">
                                 <span className="text-[9px] font-black text-dim uppercase tracking-widest mb-3 block opacity-40">Mobile Vector</span>
                                 <span className="text-sm font-bold text-primary italic block">{user?.phone}</span>
                              </div>
                              <div className="p-6 rounded-3xl bg-[#0a1120] text-white/80 border border-white/10 shadow-xl md:col-span-2 group/item transition-all hover:scale-[1.02]">
                                 <div className="flex items-center justify-between">
                                    <div>
                                       <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] mb-3 block">Operational Batch</span>
                                       <span className="text-xl font-black text-white italic tracking-tighter uppercase">{user?.studentClass || 'Elite Masterclass'}</span>
                                    </div>
                                    <span className="badge-premium badge-primary text-[10px] font-black px-6 py-3 shadow-lg shadow-primary-accent/20">ACCESS LOCKED</span>
                                 </div>
                              </div>
                           </div>

                           <div className="p-8 rounded-3xl bg-alt/30 border border-dashed border-subtle text-center relative z-10">
                              <p className="text-[11px] text-dim leading-relaxed font-black uppercase tracking-widest opacity-40 italic">
                                 Security protocols are enforced. Identity modifications require physical administrative verification or secure ticket submission through the query desk.
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </main>

         <style>{`
         .no-scrollbar::-webkit-scrollbar { display: none; }
         @keyframes pulse-glow {
            0%, 100% { transform: translateX(-100%); opacity: 0; }
            50% { transform: translateX(100%); opacity: 1; }
         }
         .animate-pulse-glow {
            animation: pulse-glow 3s infinite;
         }
      `}</style>
      </div>
   );
};

export default StudentDashboard;

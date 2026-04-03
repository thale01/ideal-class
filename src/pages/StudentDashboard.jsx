import React, { useState } from 'react';
import {
   BookOpen, Bell, Layout, MessageSquare, Award,
   CreditCard, Search, ChevronRight, GraduationCap,
   Settings, LogOut, Sun, Moon, CheckCircle2, AlertCircle, FileText, Play, Trophy, Folder, ChevronLeft
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
      <div className="min-h-screen bg-main flex flex-col md:flex-row transition-colors duration-500 overflow-x-hidden">
         {/* Sidebar Navigation - Fixed on Desktop */}
         <aside className={`fixed inset-y-0 left-0 z-[100] w-72 sidebar-premium bg-surface border-r border-subtle transition-transform duration-500 md:translate-x-0 ${activeTab === 'menu-open' ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
            <div className="p-8">
               <div className="flex items-center gap-3">
                  <img src={logo} alt="Ideal Classes Logo" className="h-10 w-auto object-contain" />
                  <div>
                     <h1 className="text-xl font-bold text-bright tracking-tight italic leading-tight">IDEAL CLASSES</h1>
                     <p className="badge-premium badge-primary text-[8px] font-black uppercase tracking-widest mt-1 px-3 py-0.5">Learner Hub</p>
                  </div>
               </div>
            </div>

            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar">
               {menuItems.map(item => (
                  <button
                     key={item.id}
                     onClick={() => { setActiveTab(item.id); }}
                     className={`sidebar-item w-full group ${activeTab === item.id ? 'active bg-primary/10 text-primary' : 'text-dim hover:bg-alt/50 hover:text-bright'}`}
                  >
                     <div className={`p-2 rounded-lg transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-transparent text-dim group-hover:text-primary'}`}>
                        <item.icon size={18} />
                     </div>
                     <span className="font-bold ml-3 text-sm">{item.label}</span>
                  </button>
               ))}
            </nav>

            <div className="p-6 border-t border-subtle">
               <button onClick={logout} className="sidebar-item w-full transition-all group hover:bg-danger/10 text-danger">
                  <LogOut size={18} />
                  <span className="font-bold text-sm ml-3">Log Out</span>
               </button>
            </div>
         </aside>

         {/* Backdrop for mobile sidebar */}
         {activeTab === 'menu-open' && (
            <div 
               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden animate-fadeIn"
               onClick={() => setActiveTab('courses')}
            ></div>
         )}

         {/* Main content area */}
         <main className="flex-1 min-h-screen md:ml-72 min-w-0 transition-all duration-300">
            <header className="header-premium sticky top-0 z-[80] bg-surface/80 backdrop-blur-xl border-b border-subtle">
               <div className="container-premium py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                     <button 
                        onClick={() => setActiveTab('menu-open')}
                        className="md:hidden w-10 h-10 rounded-xl bg-alt border border-subtle flex items-center justify-center text-dim"
                     >
                        <Layout size={20} />
                     </button>
                     <div className="hidden sm:block">
                        <h2 className="text-xl font-bold text-bright tracking-tight capitalize leading-none mb-1">{activeTab}</h2>
                        <p className="text-[10px] text-dim font-bold uppercase tracking-widest italic">Scholar Portal</p>
                     </div>
                     <div className="sm:hidden flex items-center gap-2">
                        <img 
                           src={logo} 
                           alt="Logo" 
                           className="object-contain" 
                           style={{ height: '24px', maxWidth: '80px' }} 
                        />
                        <span className="text-xs font-black italic">IDEAL</span>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-6">
                     <div className="flex items-center gap-2 pr-3 sm:pr-6 border-r border-subtle">
                        <button onClick={toggleTheme} className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-alt border border-subtle flex items-center justify-center text-bright hover:text-primary transition-all">
                           {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                        <button className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-alt border border-subtle flex items-center justify-center text-bright hover:text-primary transition-all relative">
                           <Bell size={16} />
                           <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-surface"></div>
                        </button>
                     </div>

                     <div className="flex items-center gap-3">
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-grad-main flex items-center justify-center font-black text-white text-xs sm:text-sm shadow-md">
                           {user?.name?.charAt(0) || 'S'}
                        </div>
                        <div className="hidden lg:block">
                           <p className="text-sm font-bold text-bright leading-none mb-1 truncate max-w-[120px]">{user?.name || 'Scholar'}</p>
                           <span className="badge-premium badge-primary text-[8px] font-black uppercase tracking-widest px-2 py-0.5">Scholar</span>
                        </div>
                     </div>
                  </div>
               </div>
            </header>

            <div className="container-premium py-10 animate-fadeUp">
               {activeTab === 'courses' && (
                  <>
                     {!selectedCourseId ? (
                        <div className="space-y-8 animate-fadeIn">
                           <div>
                              <h3 className="text-2xl font-black text-bright tracking-tight uppercase italic leading-none mb-2">My Learning Vault</h3>
                              <p className="text-[10px] text-dim font-black uppercase tracking-[0.3em] opacity-60">Access your assigned academic batches</p>
                           </div>

                           <div className="relative group w-full max-w-md">
                              <input
                                 type="text"
                                 placeholder="Filter batches..."
                                 className="input-premium py-4 pl-12 bg-alt/40 border-subtle text-sm"
                                 value={searchTerm}
                                 onChange={e => setSearchTerm(e.target.value)}
                              />
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dim group-focus-within:text-primary transition-all" size={18} />
                           </div>

                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-responsive">
                              {courses.filter(c => user?.assignedCourses?.includes(c._id)).map((course, i) => (
                                 <div 
                                    key={course._id || i} 
                                    onClick={() => setSelectedCourseId(course._id)} 
                                    className="card-premium group cursor-pointer hover:border-primary/40 hover:-translate-y-2 transition-all p-8 relative overflow-hidden"
                                 >
                                    <div className="flex items-center justify-between mb-8 relative z-10">
                                       <div className="w-16 h-16 rounded-2xl bg-surface border border-subtle flex items-center justify-center text-4xl shadow-sm group-hover:scale-110 transition-transform">
                                          {course.icon || '📂'}
                                       </div>
                                       <div className="w-10 h-10 rounded-full border border-subtle flex items-center justify-center text-dim group-hover:bg-primary group-hover:text-white transition-all">
                                          <ChevronRight size={18} />
                                       </div>
                                    </div>
                                    <h4 className="text-xl font-black text-bright mb-1 uppercase tracking-tight italic">{course.name}</h4>
                                    <p className="text-[10px] font-black text-dim uppercase tracking-widest opacity-80">{course.category || 'Active Batch'}</p>
                                    <div className="pt-6 mt-6 border-t border-subtle flex items-center justify-between">
                                       <span className="badge-premium badge-primary px-3 py-1 font-black text-[9px] uppercase tracking-widest">{subjects.filter(s => s.courseId === course._id).length} MODULES</span>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     ) : (
                        <div className="folder-isolated-view">
                           <div className="max-w-7xl mx-auto w-full px-6 py-12 md:py-20 animate-fadeIn">
                              {/* Header Section */}
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-20 px-2">
                                 <div className="flex flex-col items-start gap-8">
                                    <button 
                                       onClick={() => setSelectedCourseId(null)}
                                       className="btn-back px-6 py-4"
                                    >
                                       <ChevronLeft size={18} />
                                       <span className="font-black">BACK TO VAULT</span>
                                    </button>
                                    <div>
                                       <h2 className="text-4xl md:text-6xl font-black text-black uppercase tracking-tighter leading-none mb-4 italic">
                                          {courses.find(c => c._id === selectedCourseId)?.name}
                                       </h2>
                                       <div className="flex items-center gap-3">
                                          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                                          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">
                                             SECURE REPOSITORY ACCESS • {subjects.filter(s => s.courseId === selectedCourseId).length} MODULES
                                          </p>
                                       </div>
                                    </div>
                                 </div>
                                 
                                 <div className="relative w-full sm:w-80">
                                    <input
                                       type="text"
                                       placeholder="Search modules..."
                                       className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] py-5 pl-14 pr-6 text-black font-black placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all outline-none"
                                       value={searchTerm}
                                       onChange={e => setSearchTerm(e.target.value)}
                                    />
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                 </div>
                              </div>

                              {/* Content Grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                                 {subjects.filter(s => s.courseId === selectedCourseId && s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((sub, i) => (
                                    <Link 
                                       key={sub._id || i} 
                                       to={`/student/course/${sub._id}`} 
                                       className="card-clean group cursor-pointer border-slate-100 hover:border-black p-10 flex flex-col gap-8 transition-transform hover:-translate-y-2 decoration-none no-underline"
                                    >
                                       <div className="flex items-center justify-between">
                                          <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform shadow-sm">{sub.icon || '📘'}</div>
                                          <div className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                                             <ChevronRight size={24} />
                                          </div>
                                       </div>
                                       <div>
                                          <h4 className="text-2xl font-black text-black uppercase mb-1 tracking-tight italic no-underline decoration-none">{sub.name}</h4>
                                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{sub.category}</p>
                                       </div>
                                       <div className="flex gap-4 mt-2">
                                          <div className="flex-1 bg-slate-50 py-4 rounded-2xl text-center border border-slate-100">
                                             <p className="text-lg font-black text-black">{sub.resources?.notes?.length || 0}</p>
                                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Documents</p>
                                          </div>
                                          <div className="flex-1 bg-slate-50 py-4 rounded-2xl text-center border border-slate-100">
                                             <p className="text-lg font-black text-black">{sub.resources?.videos?.length || 0}</p>
                                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Videos</p>
                                          </div>
                                       </div>
                                    </Link>
                                 ))}
                              </div>

                              {subjects.filter(s => s.courseId === selectedCourseId).length === 0 && (
                                 <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                                    <BookOpen size={48} className="mx-auto text-slate-200 mb-6" />
                                    <h4 className="text-xl font-black text-slate-300 uppercase tracking-[0.2em]">No Modules Published</h4>
                                    <p className="text-slate-400 text-sm mt-2 font-bold uppercase tracking-widest opacity-60">Educational content is being finalized</p>
                                 </div>
                              )}
                           </div>
                        </div>
                     )}
                  </>
               )}

               {activeTab === 'queries' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                     <div className="lg:col-span-5 space-y-6">
                        <div className="card-premium sticky top-32">
                           <h3 className="text-xl font-bold text-bright mb-6">Ask Question</h3>
                           <form onSubmit={handleAskDoubt} className="space-y-5">
                              <div>
                                 <label className="text-[10px] font-bold text-dim uppercase tracking-widest mb-2 block">Concerned Subject</label>
                                 <select
                                    className="input-premium h-14"
                                    value={newDoubt.subject}
                                    onChange={e => setNewDoubt({ ...newDoubt, subject: e.target.value })}
                                    required
                                 >
                                    <option value="">Select Domain</option>
                                    {subjects.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                                 </select>
                              </div>
                              <div>
                                 <label className="text-[10px] font-bold text-dim uppercase tracking-widest mb-2 block">Technical Problem</label>
                                 <textarea
                                    className="input-premium min-h-[150px] resize-none pt-4"
                                    placeholder="State your doubt clearly..."
                                    value={newDoubt.question}
                                    onChange={e => setNewDoubt({ ...newDoubt, question: e.target.value })}
                                    required
                                 ></textarea>
                              </div>
                              <button disabled={isSubmitting} className="btn-premium btn-premium-primary w-full py-4 text-xs tracking-widest uppercase">
                                 {isSubmitting ? 'Transmitting...' : 'Transmit Doubt'}
                              </button>
                           </form>
                        </div>
                     </div>

                     <div className="lg:col-span-7 space-y-6">
                        <h3 className="text-xl font-bold text-bright mb-2">My History</h3>
                        {myDoubts.length === 0 && <div className="card-premium text-center py-10 italic text-dim">No records yet.</div>}
                        {myDoubts.map((d, i) => (
                           <div key={i} className={`card-premium transition-all ${!d.isResolved ? 'border-l-4 border-l-primary' : 'opacity-75 grayscale-[0.2]'}`}>
                              <div className="flex items-center justify-between mb-4">
                                 <div>
                                    <span className="text-[10px] font-bold text-dim uppercase tracking-widest">{d.subject} • {new Date(d.createdAt).toLocaleDateString()}</span>
                                 </div>
                                 {d.isResolved ? (
                                    <span className="badge-premium badge-success">Resolved</span>
                                 ) : (
                                    <span className="badge-premium badge-primary animate-pulse">Processing</span>
                                 )}
                              </div>
                              <div className="p-4 rounded-xl bg-alt/50 mb-6">
                                 <p className="text-sm font-medium text-main italic">"{d.question}"</p>
                              </div>
                              {d.isResolved && (
                                 <div className="p-4 rounded-xl bg-success/5 border border-success/10 border-dashed">
                                    <div className="flex items-center gap-2 mb-2 text-success">
                                       <CheckCircle2 size={16} />
                                       <p className="text-[10px] font-bold uppercase tracking-widest">Correction Issued</p>
                                    </div>
                                    <p className="text-sm text-bright font-bold leading-relaxed">{d.answer}</p>
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {activeTab === 'financials' && (
                  <div className="space-y-8">
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="card-premium bg-primary-glow border-none p-10">
                           <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">My Payment</p>
                                                      <h2 className="text-4xl font-bold text-primary tracking-tight">₹{(myFees.reduce((acc, f) => acc + (Number(f.paidAmount) || 0), 0)).toLocaleString()}</h2>

                           <p className="text-xs text-primary/60 font-medium mt-4">Verified cloud transaction history</p>
                        </div>
                        <div className="card-premium p-10 border-danger/10">
                           <p className="text-[10px] font-bold text-dim uppercase tracking-widest mb-2">Pending Dues</p>
                                                      <h2 className="text-4xl font-bold text-danger tracking-tight">₹{(myFees.reduce((acc, f) => acc + (Number(f.pendingFees) || 0), 0)).toLocaleString()}</h2>

                           <p className="text-xs text-danger/60 font-medium mt-4">Required for upcoming semester</p>
                        </div>
                     </div>

                     <div className="card-premium p-0 overflow-hidden shadow-sm">
                        <div className="px-6 py-5 border-b border-subtle bg-alt/30">
                           <h3 className="font-bold text-bright tracking-tight">Payment Ledger</h3>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-left">
                              <thead className="bg-alt/50 border-b border-subtle">
                                 <tr>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-dim text-xs">Descriptor</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-dim text-xs">Amount Paid</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-dim text-xs">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-dim text-xs">Due</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-subtle">
                                 {myFees.length === 0 && <tr><td colSpan="4" className="px-6 py-10 text-center text-dim italic">No transaction records found.</td></tr>}
                                 {myFees.map((f, i) => (
                                    <tr key={i} className="hover:bg-alt/10 transition-all">
                                       <td className="px-6 py-4 font-bold text-bright capitalize">Cycle Payment / {f.paymentMode}</td>
                                                                               <td className="px-6 py-4 text-success font-bold">₹{(Number(f.paidAmount) || 0).toLocaleString()}</td>

                                       <td className="px-6 py-4"><span className="badge-premium badge-success">Success</span></td>
                                                                               <td className="px-6 py-4 text-danger font-bold">₹{(Number(f.pendingFees) || 0).toLocaleString()}</td>

                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'notices' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {announcements.length === 0 && <div className="card-premium col-span-full text-center py-20 italic text-dim border-dashed border-subtle">The notice board is currently clear.</div>}
                     {announcements.map((ann, i) => (
                        <div key={ann._id || i} className="card-premium animate-fadeUp relative group overflow-hidden hover:border-primary/40 transition-all border-l-4 border-primary/40 bg-surface/50" style={{ animationDelay: `${i * 0.1}s` }}>
                           <div className="flex items-center gap-3 mb-6">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${ann.type === 'urgent' ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'}`}>
                                 {ann.type === 'urgent' ? <AlertCircle size={22} /> : <Bell size={22} />}
                              </div>
                              <div>
                                 <span className="text-[10px] font-black text-dim uppercase tracking-[0.2em] [word-spacing:0.2em] block mb-1">{new Date(ann.createdAt).toDateString()}</span>
                                 <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${ann.type === 'urgent' ? 'border-danger/20 text-danger bg-danger/5' : 'border-primary/20 text-primary bg-primary/5'}`}>
                                    {ann.type} protocol
                                 </span>
                              </div>
                           </div>
                           <h4 className="text-xl font-bold text-bright mb-4 leading-tight uppercase tracking-tight">{ann.title}</h4>
                           <div className="p-4 rounded-xl bg-alt/50 border border-subtle mb-6">
                              <p className="text-main text-sm font-medium leading-relaxed italic">"{ann.content}"</p>
                           </div>
                           <div className="pt-6 border-t border-subtle flex items-center justify-between">
                              <span className="text-[10px] font-black text-dim uppercase tracking-widest opacity-60">Ideal Cloud Authority</span>
                              <button className="w-9 h-9 rounded-lg bg-alt text-dim group-hover:text-primary transition-all flex items-center justify-center border border-subtle">
                                 <ChevronRight size={18} />
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
               )}

               {activeTab === 'settings' && (
                  <div className="max-w-4xl mx-auto space-y-12 animate-fadeUp">
                    <div className="flex justify-center">
                       {/* Profile Overview Card */}
                       <div className="w-full max-w-2xl card-premium p-10 border-l-4 border-l-primary/40 bg-grad-surface shadow-2xl">
                          <div className="flex items-center gap-8 mb-10">
                             <div className="w-24 h-24 rounded-3xl bg-grad-main flex items-center justify-center font-black text-white text-4xl shadow-xl shadow-primary/20 border-2 border-white/10">
                                {user?.name?.charAt(0)}
                             </div>
                             <div>
                                <h3 className="text-3xl font-black text-bright uppercase tracking-tight italic mb-1">{user?.name}</h3>
                                <p className="text-[11px] font-bold text-dim uppercase tracking-[0.2em] flex items-center gap-2">
                                   <CheckCircle2 size={12} className="text-primary" /> Verified Scholar Identity
                                </p>
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                             <div className="p-5 rounded-2xl bg-alt/30 border border-subtle group hover:border-primary/30 transition-all">
                                <span className="text-[9px] font-black text-dim uppercase tracking-widest mb-2 block opacity-60">Digital Address</span>
                                <span className="text-sm font-bold text-bright truncate block">{user?.email}</span>
                             </div>
                             <div className="p-5 rounded-2xl bg-alt/30 border border-subtle group hover:border-primary/30 transition-all">
                                <span className="text-[9px] font-black text-dim uppercase tracking-widest mb-2 block opacity-60">Mobile Vector</span>
                                <span className="text-sm font-bold text-bright block">{user?.phone}</span>
                             </div>
                             <div className="p-5 rounded-2xl bg-alt/30 border border-subtle group hover:border-primary/30 transition-all md:col-span-2">
                                <div className="flex items-center justify-between">
                                   <div>
                                      <span className="text-[9px] font-black text-dim uppercase tracking-widest mb-2 block opacity-60">Assigned Batch</span>
                                      <span className="text-sm font-bold text-bright block">{user?.studentClass || 'Standard Batch'}</span>
                                   </div>
                                   <span className="badge-premium badge-primary text-[10px] font-black px-6 py-2">Batch Locked</span>
                                </div>
                             </div>
                          </div>

                          <div className="p-6 rounded-2xl bg-surface/30 border border-dashed border-subtle text-center">
                             <p className="text-xs text-dim leading-relaxed font-medium italic opacity-70">
                                Profile security is managed by the administrative authority. For identity updates or access key regeneration, please contact your instructor or submit a formal request through the Query Desk.
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
        .flex-center { display: flex; align-items: center; justify-content: center; }
      `}</style>
      </div>
   );
};

export default StudentDashboard;

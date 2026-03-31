import React, { useState } from 'react';
import {
   Users, BookOpen, Bell, Settings,
   Trash2, Plus, Search, LogOut, CheckCircle,
   TrendingUp, CreditCard, Award, UserPlus, BarChart,
   MessageSquareShare, AlertCircle, Send, CheckCircle2, ChevronRight, Layout, GraduationCap, Trophy, Sun, Moon,
   Folder, ChevronLeft, Upload, Video, Monitor, MoreVertical, FolderPlus, FileText, Play, Filter, PlusCircle, ArrowLeft, Edit2, Check,
   X, Menu
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import { useAdmission } from '../context/AdmissionContext';
import { useFee } from '../context/FeeContext';
import { useGallery } from '../context/GalleryContext';
import { useUpdate } from '../context/UpdateContext';
import { useDoubt } from '../context/DoubtContext';
import { useTheme } from '../context/ThemeContext';
import { useAnnouncement } from '../context/AnnouncementContext';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { API_URL as BASE_URL } from '../config/api';
const API_BASE = BASE_URL.replace('/api', '');

const TeacherDashboard = () => {
   const { user, logout } = useAuth();
   const { 
      subjects, courses, 
      deleteSubject, addSubject, updateSubject,
      addCourse, deleteCourse, updateCourse,
      assignCourses, fetchCourses, fetchSubjects, renameChapter 
   } = useCourse();
   const { applications, removeApplication, updateAppStatus } = useAdmission();
   const { fees, addFeeEntry, deleteFeeEntry } = useFee();
   const { toppers, deleteTopper } = useGallery();
   const { updates } = useUpdate();
   const { doubts, replyToDoubt } = useDoubt();
   const { students, deleteStudent, updateStudent, resetStudentPassword, changeAdminPassword } = useAuth();
   const { announcements, addAnnouncement, removeAnnouncement } = useAnnouncement();
   const { theme, toggleTheme } = useTheme();
   const navigate = useNavigate();

   const [activeTab, setActiveTab] = useState('subjects');
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedCourseId, setSelectedCourseId] = useState(null);
   const [selectedSubjectId, setSelectedSubjectId] = useState(null);
   const [selectedChapterName, setSelectedChapterName] = useState(null);
   const [editingId, setEditingId] = useState(null);
   const [editValue, setEditValue] = useState('');
   const [replyText, setReplyText] = useState({}); // { doubtId: text }
   const [isReplying, setIsReplying] = useState(false);
   const [showAddModal, setShowAddModal] = useState(false);
   const [showCourseModal, setShowCourseModal] = useState(false);
   const [showAssignModal, setShowAssignModal] = useState(false);
   const [showAnnounceModal, setShowAnnounceModal] = useState(false);
   const [showFeeModal, setShowFeeModal] = useState(false);
   const [selectedStudent, setSelectedStudent] = useState(null);
   const [newSubject, setNewSubject] = useState({ name: '', category: '', icon: '📘', color: '#4f46e5', courseId: '' });
   const [newCourse, setNewCourse] = useState({ name: '', description: '', icon: '📂', category: '' });
   const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', type: 'general' });
   const [newFee, setNewFee] = useState({ studentName: '', email: '', paidAmount: '', pendingFees: '', paymentMode: 'UPI/Online' });
   const [showEditStudentModal, setShowEditStudentModal] = useState(false);
   const [showResetPassModal, setShowResetPassModal] = useState(false);
   const [adminPassData, setAdminPassData] = useState({ current: '', new: '', confirm: '' });
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
   const [message, setMessage] = useState({ text: '', type: '' }); // { text: '', type: 'success' | 'error' }

   const filteredItems = (items, field = 'name') => {
      if (!items) return [];
      return items.filter(item => (item[field] || '').toLowerCase().includes(searchTerm.toLowerCase()));
   };

   const handleAddSubject = async (e) => {
      e.preventDefault();
      await addSubject({ ...newSubject, courseId: selectedCourseId || newSubject.courseId });
      setShowAddModal(false);
      setNewSubject({ name: '', category: '', icon: '📘', color: '#4f46e5', courseId: '' });
   };

   const handleAddCourse = async (e) => {
      e.preventDefault();
      await addCourse(newCourse);
      setShowCourseModal(false);
      setNewCourse({ name: '', description: '', icon: '📂', category: '' });
   };

   const handleAssignCourses = async (e) => {
      e.preventDefault();
      const courseIds = Array.from(e.target.elements)
         .filter(el => el.type === 'checkbox' && el.checked)
         .map(el => el.value);

      await assignCourses(selectedStudent._id, courseIds);
      setShowAssignModal(false);
      setSelectedStudent(null);
   };

   const handleAddAnnouncement = async (e) => {
      e.preventDefault();
      await addAnnouncement(newAnnouncement);
      setShowAnnounceModal(false);
      setNewAnnouncement({ title: '', content: '', type: 'general' });
   };

   const handleAddFee = async (e) => {
      e.preventDefault();
      await addFeeEntry({
         ...newFee,
         paidAmount: Number(newFee.paidAmount),
         pendingFees: Number(newFee.pendingFees) || 0
      });
      setShowFeeModal(false);
      setNewFee({ studentName: '', email: '', paidAmount: '', pendingFees: '', paymentMode: 'UPI/Online' });
   };

   const menuItems = [
      { id: 'subjects', label: 'Dashboard', icon: Layout },
      { id: 'admissions', label: 'Admissions', icon: UserPlus },
      { id: 'directory', label: 'Student Registry', icon: Users },
      { id: 'fees', label: 'Transactions', icon: CreditCard },
      { id: 'doubts', label: 'Doubt Desk', icon: MessageSquareShare },
      { id: 'announcements', label: 'Notices', icon: Bell },
      { id: 'halloffame', label: 'Hall of Fame', icon: Award },
      { id: 'settings', label: 'Settings', icon: Settings },
   ];

   return (
      <div className="min-h-screen bg-main flex flex-col md:flex-row transition-colors duration-500 overflow-x-hidden">
         {/* Sidebar Nav */}
         <aside className={`fixed inset-y-0 left-0 md:relative md:translate-x-0 sidebar-premium flex flex-col h-screen z-[10002] transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isSidebarCollapsed ? 'md:w-24' : 'md:w-80'} shrink-0 shadow-2xl md:shadow-none border-r border-subtle overflow-hidden`}>
            <div className={`p-6 transition-all duration-300 ${isSidebarCollapsed ? 'px-4' : 'p-8'}`}>
               <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3 overflow-hidden">
                     <button 
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="p-2.5 rounded-xl bg-alt/50 border border-subtle text-bright hover:bg-primary/10 hover:text-primary transition-all hidden md:flex items-center justify-center shrink-0"
                        title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                     >
                        <Menu size={20} />
                     </button>
                     <img src={logo} alt="Ideal Classes Logo" className={`h-10 w-auto object-contain transition-all duration-500 ${isSidebarCollapsed ? 'scale-0 w-0' : 'scale-100'}`} />
                     {!isSidebarCollapsed && (
                        <div className="animate-fadeIn">
                           <h1 className="text-xl font-bold text-bright tracking-tight italic whitespace-nowrap">IDEAL CLASSES</h1>
                           <p className="badge-premium badge-primary text-[9px] font-black uppercase tracking-widest mt-1 px-3 py-0.5 whitespace-nowrap">Admin Central</p>
                        </div>
                     )}
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 rounded-xl bg-alt/50 text-dim">
                     <X size={20} />
                  </button>
               </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
               {menuItems.map(item => (
                  <button
                     key={item.id}
                     onClick={() => { setActiveTab(item.id); setSearchTerm(''); setIsSidebarOpen(false); }}
                     className={`sidebar-item w-full group overflow-hidden ${activeTab === item.id ? 'active bg-primary/10 text-primary' : 'text-dim hover:bg-alt/50 hover:text-bright'}`}
                     title={isSidebarCollapsed ? item.label : ""}
                  >
                     <div className={`p-2 rounded-lg transition-all shrink-0 ${activeTab === item.id ? 'bg-primary text-white shadow-md shadow-primary/20' : 'bg-transparent text-dim group-hover:text-primary'}`}>
                        <item.icon size={18} />
                     </div>
                     <span className={`font-bold ml-3 text-sm transition-all duration-300 ${isSidebarCollapsed ? 'opacity-0 -translate-x-10 pointer-events-none' : 'opacity-100 translate-x-0'}`}>{item.label}</span>
                  </button>
               ))}
            </nav>

            <div className={`p-6 border-t border-subtle transition-all duration-300 ${isSidebarCollapsed ? 'px-4 text-center' : 'p-6'}`}>
               <button onClick={logout} className="sidebar-item w-full transition-all group hover:bg-danger/10 text-danger" title={isSidebarCollapsed ? "Terminate Session" : ""}>
                  <LogOut size={18} className="shrink-0" />
                  <span className={`font-bold text-sm ml-3 transition-all duration-300 ${isSidebarCollapsed ? 'hidden' : 'inline'}`}>Terminate Session</span>
               </button>
            </div>
         </aside>

         {/* Mobile Backdrop */}
         {isSidebarOpen && (
            <div 
               className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10001] md:hidden transition-opacity"
               onClick={() => setIsSidebarOpen(false)}
            ></div>
         )}

         {/* Main Main Area */}
         <main className="flex-1 min-h-screen min-w-0 overflow-x-hidden">

            <header className="header-premium border-b border-subtle sticky top-0 bg-surface/90 backdrop-blur-md z-[1000]">
               <div className="px-6 lg:px-12 flex items-center justify-between w-full h-full">

                  <div>
                     <h2 className="text-2xl font-bold text-bright tracking-tight capitalize">{activeTab}</h2>
                     <p className="text-xs text-dim font-medium">Managing academic database & resources</p>
                  </div>

                  <div className="flex items-center gap-4">
                     <button 
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden p-2.5 rounded-xl bg-alt/50 border border-subtle text-bright mr-2"
                     >
                        <Menu size={22} />
                     </button>
                     <div className="relative group hidden sm:block">
                        <input
                           type="text"
                           placeholder={`Search entries...`}
                           className="input-premium py-2.5 pl-10 w-64 bg-alt/50 border-subtle text-sm"
                           value={searchTerm}
                           onChange={e => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dim group-focus-within:text-primary transition-colors" size={16} />
                     </div>

                     <div className="flex items-center gap-2 pr-4 border-r border-subtle mr-2">
                        <button onClick={toggleTheme} className="w-10 h-10 rounded-xl bg-alt border border-subtle flex-center text-white hover:text-primary transition-all">
                           {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <button className="w-10 h-10 rounded-xl bg-alt border border-subtle flex-center text-white hover:text-primary transition-all">
                           <Bell size={18} />
                        </button>
                     </div>

                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-grad-main flex items-center justify-center font-bold text-white shadow-md">
                           {user?.name?.charAt(0) || 'A'}
                        </div>
                         <div className="hidden xl:block">
                            <p className="text-sm font-bold text-bright leading-none mb-1">{user?.name || 'Admin User'}</p>
                            <span className="badge-premium badge-primary text-[9px] font-black uppercase tracking-widest px-3 py-0.5">Master Control</span>
                         </div>
                     </div>
                  </div>
               </div>
            </header>

            <div className="px-4 md:px-8 lg:px-12 py-10 animate-fadeUp max-w-[1800px] mx-auto">

               {activeTab === 'subjects' && (
                  <div className="space-y-8">
                     {/* Hierarchical Breadcrumb Navigation */}
                     <div className="flex items-center gap-3 py-3 px-4 bg-alt/30 rounded-2xl border border-subtle backdrop-blur-sm">
                        <button
                           onClick={() => { setSelectedCourseId(null); setSelectedSubjectId(null); setSelectedChapterName(null); }}
                           className={`text-[10px] font-black uppercase tracking-[0.15em] [word-spacing:0.15em] flex items-center gap-2 transition-all p-1.5 rounded-lg ${!selectedCourseId ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-dim hover:text-bright hover:bg-alt'}`}
                        >
                           <Layout size={14} /> BATCHES
                        </button>
                        {selectedCourseId && (
                           <>
                              <ChevronRight size={14} className="text-subtle" />
                              <button
                                 onClick={() => { setSelectedSubjectId(null); setSelectedChapterName(null); }}
                                 className={`text-[10px] font-black uppercase tracking-[0.15em] [word-spacing:0.15em] flex items-center gap-2 transition-all p-1.5 rounded-lg ${selectedCourseId && !selectedSubjectId ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-dim hover:text-bright hover:bg-alt'}`}
                              >
                                 <Folder size={14} /> {courses.find(c => c._id === selectedCourseId)?.name}
                              </button>
                           </>
                        )}
                        {selectedSubjectId && (
                           <>
                              <ChevronRight size={14} className="text-subtle" />
                              <button
                                 onClick={() => { setSelectedChapterName(null); }}
                                 className={`text-[10px] font-black uppercase tracking-[0.15em] [word-spacing:0.15em] flex items-center gap-2 transition-all p-1.5 rounded-lg ${selectedSubjectId && !selectedChapterName ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-dim hover:text-bright hover:bg-alt'}`}
                              >
                                 <BookOpen size={14} /> {subjects.find(s => s._id === selectedSubjectId)?.name}
                              </button>
                           </>
                        )}
                        {selectedChapterName && (
                           <>
                              <ChevronRight size={14} className="text-subtle" />
                              <span className="text-[10px] font-black uppercase tracking-[0.15em] [word-spacing:0.15em] bg-primary/10 text-primary flex items-center gap-2 p-1.5 rounded-lg border border-primary/20">
                                 <Filter size={14} /> {selectedChapterName}
                              </span>
                           </>
                        )}
                     </div>

                     <div className="flex flex-col sm:flex-row items-center justify-between gap-12">
                        <div className="space-y-2">
                           <h3 className="text-4xl font-black text-bright uppercase tracking-tight italic">
                              {selectedChapterName ? 'RESOURCE CATALOG' :
                                 selectedSubjectId ? 'CHAPTER HIERARCHY' :
                                    selectedCourseId ? 'SUBJECT REPOSITORY' :
                                       'INFRASTRUCTURE CATALOG'}
                           </h3>
                           <p className="text-[12px] font-black text-dim uppercase tracking-[0.3em] [word-spacing:0.3em] opacity-70">
                              {selectedChapterName ? `Batch Content: ${selectedChapterName}` :
                                 selectedSubjectId ? `Strategic Folders within ${subjects.find(s => s._id === selectedSubjectId)?.name}` :
                                    selectedCourseId ? `Curated Modules for ${courses.find(c => c._id === selectedCourseId)?.name}` :
                                       'Central Command: Manage Batches & Academic Structure'}
                           </p>
                        </div>

                        <div className="flex gap-4 w-full sm:w-auto">
                           <div className="relative flex-1 sm:w-80">
                              <input
                                 type="text"
                                 placeholder="Dynamic filter..."
                                 className="input-premium py-5 pl-12 text-sm bg-alt/40 border-subtle shadow-lg"
                                 value={searchTerm}
                                 onChange={e => setSearchTerm(e.target.value)}
                              />
                              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-dim" size={20} />
                           </div>

                           {/* Contextual Action Button */}
                           {!selectedCourseId ? (
                              <button onClick={() => setShowCourseModal(true)} className="btn-premium btn-premium-primary px-10 py-5 flex items-center gap-3 shadow-xl">
                                 <FolderPlus size={20} /> <span className="hidden sm:inline font-bold">NEW BATCH</span>
                              </button>
                           ) : !selectedSubjectId ? (
                              <button onClick={() => setShowAddModal(true)} className="btn-premium btn-premium-primary px-10 py-5 flex items-center gap-3 shadow-xl">
                                 <PlusCircle size={20} /> <span className="hidden sm:inline font-bold">ADD SUBJECT</span>
                              </button>
                           ) : (
                              <button onClick={() => navigate(`/manage-course/${selectedSubjectId}`)} className="btn-premium btn-premium-primary px-10 py-5 flex items-center gap-3 shadow-xl">
                                 <Upload size={20} /> <span className="hidden sm:inline font-bold">POST ASSET</span>
                              </button>
                           )}
                        </div>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-responsive">
                        {/* LEVEL 1: ALL COURSES */}
                        {!selectedCourseId && (
                           <>
                               <div onClick={() => setShowCourseModal(true)} className="card-premium flex flex-col items-center justify-center border-dashed border-primary/20 hover:border-primary/60 cursor-pointer p-12 group bg-primary/5 hover:bg-primary/10 transition-all">
                                  <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/30 group-hover:scale-110 transition-all">
                                     <Plus size={40} />
                                  </div>
                                  <span className="text-[12px] font-black text-primary mt-8 uppercase tracking-[0.25em]">Deploy&nbsp;&nbsp;&nbsp;New&nbsp;&nbsp;&nbsp;Batch</span>
                               </div>
                              {filteredItems(courses).map((course, i) => (
                                 <div
                                    key={course._id || i}
                                    onClick={() => setSelectedCourseId(course._id)}
                                    className="card-premium group cursor-pointer hover:border-primary/40 hover:-translate-y-2 transition-all p-8 relative overflow-hidden"
                                 >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                                    <div className="flex items-center justify-between mb-8 relative z-10">
                                       <div className="w-16 h-16 rounded-2xl bg-surface border border-subtle flex items-center justify-center text-4xl shadow-sm group-hover:scale-110 transition-transform">
                                          {course.icon || '📂'}
                                       </div>
                                       <div className="flex gap-2">
                                          <button onClick={(e) => { 
                                             e.stopPropagation(); 
                                             setEditingId(course._id); 
                                             setEditValue(course.name); 
                                          }} className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-dim hover:text-primary transition-all border border-subtle"><Edit2 size={16} /></button>
                                          <button onClick={(e) => { e.stopPropagation(); deleteCourse(course._id); }} className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-dim hover:text-danger hover:border-danger/30 transition-all border border-subtle"><Trash2 size={16} /></button>
                                       </div>
                                    </div>
                                    {editingId === course._id ? (
                                       <input 
                                          autoFocus
                                          className="text-xl font-black text-bright mb-1 uppercase tracking-tight leading-tight bg-alt border border-primary px-2 py-1 rounded w-full outline-none"
                                          value={editValue}
                                          onChange={e => setEditValue(e.target.value)}
                                          onClick={e => e.stopPropagation()}
                                          onBlur={async () => {
                                             if (editValue.trim() && editValue !== course.name) {
                                                await updateCourse(course._id, { name: editValue });
                                             }
                                             setEditingId(null);
                                          }}
                                          onKeyDown={async e => {
                                             if (e.key === 'Enter') {
                                                if (editValue.trim() && editValue !== course.name) {
                                                   await updateCourse(course._id, { name: editValue });
                                                }
                                                setEditingId(null);
                                             }
                                          }}
                                       />
                                    ) : (
                                       <h4 className="text-xl font-black text-bright mb-1 uppercase tracking-tight leading-tight">{course.name}</h4>
                                    )}
                                    <p className="text-[10px] font-black text-dim uppercase tracking-widest opacity-80">{course.category || 'Strategic Area'}</p>
                                    <div className="pt-6 mt-6 border-t border-subtle flex items-center justify-between">
                                       <span className="badge-premium badge-primary px-3 py-1">{subjects.filter(s => s.courseId === course._id).length} MODULES</span>
                                       <ChevronRight size={18} className="text-dim group-hover:text-primary transition-all" />
                                    </div>
                                 </div>
                              ))}
                           </>
                        )}

                        {/* LEVEL 2: SUBJECTS IN COURSE */}
                        {selectedCourseId && !selectedSubjectId && (
                           <>
                              <div onClick={() => setShowAddModal(true)} className="card-premium flex flex-col items-center justify-center border-dashed border-primary/20 hover:border-primary/50 cursor-pointer p-10 group bg-primary/5">
                                 <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/30 group-hover:scale-110 transition-all">
                                    <BookOpen size={32} />
                                 </div>
                                 <span className="text-[10px] font-black text-primary mt-6 uppercase tracking-[0.2em]">Add&nbsp;&nbsp;&nbsp;New&nbsp;&nbsp;&nbsp;Subject</span>
                              </div>
                              {filteredItems(subjects.filter(s => s.courseId === selectedCourseId)).map((sub, i) => (
                                 <div
                                    key={sub._id || i}
                                    onClick={() => setSelectedSubjectId(sub._id)}
                                    className="card-premium group cursor-pointer hover:border-primary/40 hover:-translate-y-2 transition-all p-8"
                                 >
                                    <div className="flex items-center justify-between mb-8">
                                       <div className="w-16 h-16 rounded-2xl bg-surface border border-subtle flex items-center justify-center text-4xl group-hover:rotate-6 transition-transform shadow-lg">
                                          {sub.icon || '📚'}
                                       </div>
                                       <div className="flex gap-2">
                                          <button onClick={(e) => { 
                                             e.stopPropagation(); 
                                             setEditingId(sub._id); 
                                             setEditValue(sub.name); 
                                          }} className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-dim hover:text-primary transition-all border border-subtle"><Edit2 size={16} /></button>
                                          <button onClick={(e) => { e.stopPropagation(); deleteSubject(sub._id); }} className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-dim hover:text-danger hover:border-danger/30 transition-all border border-subtle"><Trash2 size={16} /></button>
                                       </div>
                                    </div>
                                    {editingId === sub._id ? (
                                       <input 
                                          autoFocus
                                          className="text-xl font-black text-bright mb-1 uppercase tracking-tight leading-tight bg-alt border border-primary px-2 py-1 rounded w-full outline-none"
                                          value={editValue}
                                          onChange={e => setEditValue(e.target.value)}
                                          onClick={e => e.stopPropagation()}
                                          onBlur={async () => {
                                             if (editValue.trim() && editValue !== sub.name) {
                                                await updateSubject(sub._id, { name: editValue });
                                             }
                                             setEditingId(null);
                                          }}
                                          onKeyDown={async e => {
                                             if (e.key === 'Enter') {
                                                if (editValue.trim() && editValue !== sub.name) {
                                                   await updateSubject(sub._id, { name: editValue });
                                                }
                                                setEditingId(null);
                                             }
                                          }}
                                       />
                                    ) : (
                                       <h4 className="text-xl font-black text-bright mb-1 uppercase tracking-tight leading-tight">{sub.name}</h4>
                                    )}
                                    <p className="text-[10px] font-black text-dim uppercase tracking-widest">{sub.category}</p>
                                    <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-subtle">
                                       <div className="p-3 rounded-xl bg-alt/50 border border-subtle text-center">
                                          <p className="text-sm font-black text-bright">{sub.resources?.notes?.length || 0}</p>
                                          <p className="text-[8px] font-black text-dim uppercase tracking-widest">Docs</p>
                                       </div>
                                       <div className="p-3 rounded-xl bg-alt/50 border border-subtle text-center">
                                          <p className="text-sm font-black text-bright">{sub.resources?.videos?.length || 0}</p>
                                          <p className="text-[8px] font-black text-dim uppercase tracking-widest">Mastery</p>
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </>
                        )}

                        {/* LEVEL 3: CHAPTERS IN SUBJECT */}
                        {selectedSubjectId && !selectedChapterName && (
                           <>
                              {(() => {
                                 const sub = subjects.find(s => s._id === selectedSubjectId);
                                 const allResources = [...(sub.resources?.notes || []), ...(sub.resources?.videos || [])];
                                 const chapters = Array.from(new Set(allResources.map(r => r.chapter || 'UNCATEGORIZED'))).sort();

                                 return chapters.map((ch, i) => (
                                    <div
                                       key={i}
                                       onClick={() => setSelectedChapterName(ch)}
                                       className="card-premium group cursor-pointer hover:border-primary/40 hover:-translate-y-2 transition-all p-8 flex items-center gap-5"
                                    >
                                       <div className="w-14 h-14 rounded-2xl bg-alt/50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-md">
                                          <Folder size={24} />
                                       </div>
                                       <div className="flex-1">
                                          {editingId === `chapter-${ch}` ? (
                                             <input 
                                                autoFocus
                                                className="text-lg font-black text-bright uppercase tracking-tight leading-tight bg-alt border border-primary px-2 py-1 rounded w-full outline-none"
                                                value={editValue}
                                                onChange={e => setEditValue(e.target.value)}
                                                onClick={e => e.stopPropagation()}
                                                onBlur={async () => {
                                                   if (editValue.trim() && editValue !== ch) {
                                                      await renameChapter(selectedSubjectId, ch, editValue);
                                                   }
                                                   setEditingId(null);
                                                }}
                                                onKeyDown={async e => {
                                                   if (e.key === 'Enter') {
                                                      if (editValue.trim() && editValue !== ch) {
                                                         await renameChapter(selectedSubjectId, ch, editValue);
                                                      }
                                                      setEditingId(null);
                                                   }
                                                }}
                                             />
                                          ) : (
                                             <h4 className="text-lg font-black text-bright uppercase tracking-tight leading-tight">{ch}</h4>
                                          )}
                                          <p className="text-[9px] font-black text-dim uppercase tracking-widest mt-0.5">
                                             {allResources.filter(r => (r.chapter || 'UNCATEGORIZED') === ch).length} Assets
                                          </p>
                                       </div>
                                       <div className="flex items-center gap-2">
                                          <button 
                                            onClick={(e) => { 
                                               e.stopPropagation(); 
                                               setEditingId(`chapter-${ch}`);
                                               setEditValue(ch);
                                            }}
                                            className="p-2.5 rounded-xl bg-alt text-dim hover:text-primary transition-all opacity-0 group-hover:opacity-100 border border-subtle"
                                          >
                                             <Edit2 size={14}/>
                                          </button>
                                          <ChevronRight size={18} className="text-dim group-hover:text-primary transition-colors" />
                                       </div>
                                    </div>
                                 ));
                              })()}
                              <div onClick={() => navigate(`/manage-course/${selectedSubjectId}`)} className="card-premium flex flex-col items-center justify-center border-dashed border-primary/20 hover:border-primary/50 cursor-pointer p-8 group bg-primary/5">
                                 <Plus size={24} className="text-primary group-hover:scale-125 transition-transform" />
                                 <span className="text-[9px] font-black text-primary mt-3 uppercase tracking-widest">Add New Asset</span>
                              </div>
                           </>
                        )}

                        {/* LEVEL 4: ASSETS IN CHAPTER */}
                        {selectedChapterName && (
                           <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeUp">
                              {(() => {
                                 const sub = subjects.find(s => s._id === selectedSubjectId);
                                 const notes = sub.resources?.notes?.filter(n => (n.chapter || 'UNCATEGORIZED') === selectedChapterName) || [];
                                 const videos = sub.resources?.videos?.filter(v => (v.chapter || 'UNCATEGORIZED') === selectedChapterName) || [];

                                 return (
                                    <>
                                       {notes.map((note, i) => (
                                          <div key={`n-${i}`} className="card-premium p-6 flex items-center gap-5 group hover:border-primary/30 transition-all bg-surface/50 border-subtle">
                                             <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-inner"><FileText size={20} /></div>
                                             <div className="flex-1 min-w-0">
                                                <h5 className="font-black text-bright uppercase text-xs tracking-tight truncate">{note.title}</h5>
                                                <p className="text-[9px] font-black text-dim uppercase tracking-widest truncate">{new Date(note.uploadDate).toLocaleDateString()} • PDF Document</p>
                                             </div>
                                             <a href={`http://localhost:5000${note.fileUrl}`} target="_blank" rel="noreferrer" className="p-2.5 rounded-lg bg-alt text-dim hover:text-primary transition-colors border border-subtle">
                                                <Upload size={14} />
                                             </a>
                                          </div>
                                       ))}
                                       {videos.map((vid, i) => (
                                          <div key={`v-${i}`} className="card-premium p-6 flex items-center gap-5 group hover:border-success/30 transition-all bg-surface/50 border-subtle">
                                             <div className="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center shadow-inner"><Play size={20} /></div>
                                             <div className="flex-1 min-w-0">
                                                <h5 className="font-black text-bright uppercase text-xs tracking-tight truncate">{vid.title}</h5>
                                                <p className="text-[9px] font-black text-dim uppercase tracking-widest truncate">Secure Stream • {vid.type}</p>
                                             </div>
                                             <a href={vid.url} target="_blank" rel="noreferrer" className="p-2.5 rounded-lg bg-alt text-dim hover:text-success transition-colors border border-subtle">
                                                <Video size={14} />
                                             </a>
                                          </div>
                                       ))}
                                       <button
                                          onClick={() => navigate(`/manage-course/${selectedSubjectId}`)}
                                          className="card-premium border-dashed border-primary/20 hover:border-primary/50 flex items-center justify-center gap-3 p-6 group transition-all"
                                       >
                                          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"><Plus size={18} /></div>
                                          <span className="text-[9px] font-black text-primary uppercase tracking-widest">Append Mastery Asset</span>
                                       </button>
                                    </>
                                 );
                              })()}
                           </div>
                        )}
                     </div>
                  </div>
               )}

               {activeTab === 'directory' && (
                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <div>
                           <h3 className="text-2xl font-bold text-bright">Student Registry</h3>
                           <p className="text-sm text-dim font-medium">Official database records</p>
                        </div>
                        <button
                           onClick={async () => {
                              const res = await fetch(`${API_BASE}/api/students/export`, {
                                 headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                              });
                              const blob = await res.blob();
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = `Ideal_Classes_Students_${new Date().toLocaleDateString()}.xlsx`;
                              a.click();
                           }}
                           className="btn-premium btn-premium-secondary"
                        >
                           <BarChart size={18} /> Export Excel
                        </button>
                     </div>

                     <div className="card-premium p-0 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                           <table className="w-full text-left">
                              <thead className="bg-alt border-b border-subtle">
                                 <tr>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-dim">Student Identity</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-dim">Class/Board</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-dim">Contact</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-dim">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-dim text-right">Action</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-subtle">
                                 {(students || []).length === 0 && <tr><td colSpan="5" className="px-6 py-16 text-center text-dim font-medium italic">No registered students found.</td></tr>}
                                 {filteredItems(students, 'name').map((st, i) => (
                                    <tr key={st._id || i} className="hover:bg-alt/30 transition-colors">
                                       <td className="px-6 py-4">
                                          <div className="flex items-center gap-3">
                                             <div className="w-9 h-9 rounded-lg bg-grad-main flex items-center justify-center font-bold text-white shadow-sm text-xs">{st.name.charAt(0)}</div>
                                             <div>
                                                <p className="font-bold text-bright text-sm">{st.name}</p>
                                                <p className="text-[9px] text-dim font-bold">UID: {st._id.substring(st._id.length - 8)}</p>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="px-6 py-4 font-bold text-xs text-bright">{st.studentClass || 'N/A'}</td>
                                       <td className="px-6 py-4 font-bold text-xs text-dim">{st.phone}</td>
                                       <td className="px-6 py-4"><span className="badge-premium badge-success">Active</span></td>
                                       <td className="px-6 py-4 text-right">
                                          <div className="flex justify-end gap-2">
                                             <button onClick={() => { setSelectedStudent(st); setShowAssignModal(true); }} className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-dim hover:text-primary transition-all border border-subtle" title="Assign Courses">
                                                <Folder size={16} /></button>
                                             <button onClick={() => deleteStudent(st._id)} className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-dim hover:text-danger transition-all border border-subtle">
                                                <Trash2 size={16} /></button>
                                          </div>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'admissions' && (
                  <div className="space-y-6">
                     <h3 className="text-2xl font-bold text-bright mb-8">Admission Flow</h3>
                     {applications.length === 0 && <div className="card-premium text-center py-16 text-dim italic">No pending requests.</div>}
                     <div className="grid grid-cols-1 gap-4">
                        {filteredItems(applications, 'name').map((app, i) => (
                           <div key={app._id || i} className="card-premium flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/30">
                              <div className="flex items-center gap-5">
                                 <div className="w-14 h-14 rounded-2xl bg-alt flex items-center justify-center text-dim font-bold text-xl border border-subtle">
                                    {app.name?.charAt(0) || 'U'}
                                 </div>
                                 <div>
                                    <h4 className="text-lg font-bold text-bright">{app.name}</h4>
                                    <p className="text-xs text-dim font-medium">{app.email} • {app.phone}</p>
                                    <div className="flex gap-3 mt-2">
                                       <span className="badge-premium badge-primary">{app.classApplied}</span>
                                       {app.batch && <span className="badge-premium badge-success">{app.batch}</span>}
                                    </div>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <button onClick={() => updateAppStatus(app._id, 'approved')} className="btn-premium btn-premium-primary py-2.5 text-xs">Approve</button>
                                 <button onClick={() => removeApplication(app._id)} className="w-10 h-10 rounded-xl bg-alt border border-subtle flex-center text-dim hover:text-danger hover:border-danger/30"><Trash2 size={18} /></button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {activeTab === 'doubts' && (
                  <div className="space-y-8">
                     <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-bright">Query Desk</h3>
                        <div className="flex gap-3">
                           <span className="badge-premium badge-danger">{doubts.filter(d => !d.isResolved).length} Pending</span>
                           <span className="badge-premium badge-success">{doubts.filter(d => d.isResolved).length} Resolved</span>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 gap-4">
                        {doubts.length === 0 && <div className="card-premium text-center py-16 text-dim italic">Communication log is silent.</div>}
                        {doubts.map((d, i) => (
                           <div key={d._id || i} className={`card-premium transition-all ${!d.isResolved ? 'border-l-4 border-l-primary' : 'opacity-70 grayscale-[0.3]'}`}>
                              <div className="flex items-center justify-between mb-4">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-grad-main flex items-center justify-center font-bold text-white text-xs">{d.studentName.charAt(0)}</div>
                                    <div>
                                       <h4 className="text-sm font-bold text-bright uppercase">{d.studentName}</h4>
                                       <p className="text-[10px] text-dim font-bold uppercase tracking-widest">{d.subject} • {new Date(d.createdAt).toLocaleDateString()}</p>
                                    </div>
                                 </div>
                                 {d.isResolved ? (
                                    <div className="text-success flex items-center gap-2"><CheckCircle2 size={14} /> <span className="text-[10px] font-bold uppercase">Resolved</span></div>
                                 ) : (
                                    <div className="text-primary flex items-center gap-2 animate-pulse"><AlertCircle size={14} /> <span className="text-[10px] font-bold uppercase">Urgent</span></div>
                                 )}
                              </div>

                              <div className="p-4 rounded-xl bg-alt border border-subtle mb-6">
                                 <p className="text-main font-medium italic text-sm">"{d.question}"</p>
                              </div>

                              {!d.isResolved ? (
                                 <div className="space-y-4">
                                    <textarea
                                       className="input-premium py-4 min-h-[100px] resize-none text-sm placeholder:italic"
                                       placeholder="Transmit official response..."
                                       value={replyText[d._id] || ''}
                                       onChange={e => setReplyText({ ...replyText, [d._id]: e.target.value })}
                                    ></textarea>
                                    <div className="flex justify-end">
                                       <button
                                          onClick={async () => {
                                             if (!replyText[d._id]) return;
                                             setIsReplying(true);
                                             await replyToDoubt(d._id, replyText[d._id]);
                                             setIsReplying(false);
                                          }}
                                          className="btn-premium btn-premium-primary py-2.5 text-xs shadow-none"
                                          disabled={isReplying}
                                       >
                                          {isReplying ? 'Transmitting...' : 'Send Logic'} <Send size={14} className="ml-1" />
                                       </button>
                                    </div>
                                 </div>
                              ) : (
                                 <div className="p-4 rounded-xl bg-success/5 border border-success/10">
                                    <p className="text-[9px] font-bold text-success uppercase tracking-widest mb-1 opacity-70">Official Correction:</p>
                                    <p className="text-success font-bold text-sm leading-relaxed">{d.answer}</p>
                                 </div>
                              )}
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {activeTab === 'fees' && (
                  <div className="space-y-8">
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="card-premium bg-primary-glow border-none">
                           <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Total Credit</p>
                                                       <h2 className="text-3xl font-bold text-primary tracking-tight">₹{(fees.reduce((acc, f) => acc + (Number(f.paidAmount) || 0), 0)).toLocaleString()}</h2>

                           <div className="mt-4 flex items-center gap-2 text-primary/50 text-xs"><TrendingUp size={14} /> <span>Verified Log</span></div>
                        </div>
                        <div className="card-premium border-danger/10">
                           <p className="text-[10px] font-bold text-dim uppercase tracking-widest mb-2">Pending Balance</p>
                                                       <h2 className="text-3xl font-bold text-danger tracking-tight">₹{(fees.reduce((acc, f) => acc + (Number(f.pendingFees) || 0), 0)).toLocaleString()}</h2>

                           <div className="mt-4 flex items-center gap-2 text-danger/50 text-xs"><AlertCircle size={14} /> <span>Collection Needed</span></div>
                        </div>
                        <div
                           onClick={() => setShowFeeModal(true)}
                           className="card-premium flex items-center justify-center border-dashed border-dim/20 hover:border-primary/50 cursor-pointer bg-transparent shadow-none hover:shadow-md group"
                        >
                           <div className="text-center">
                              <Plus size={24} className="mx-auto text-dim group-hover:text-primary transition-all mb-2" />
                              <p className="text-xs font-bold text-dim group-hover:text-primary transition-all uppercase tracking-widest">Post Payment</p>
                           </div>
                        </div>
                     </div>

                     <div className="card-premium p-0 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-subtle bg-alt/30 flex items-center justify-between">
                           <h3 className="font-bold text-bright tracking-tight">Transaction Ledger</h3>
                           <button className="text-[10px] font-bold text-dim hover:text-primary transition uppercase tracking-widest border border-subtle px-4 py-2 rounded-lg">Audit Download</button>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-left">
                              <thead className="bg-alt/50 border-b border-subtle">
                                 <tr>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-dim text-xs">Student Name</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-dim text-xs">Credit Amount</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-dim text-xs">Protocol</th>
                                    <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-dim text-xs">Due Status</th>
                                    <th className="px-6 py-4 text-right"></th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-subtle">
                                 {filteredItems(fees, 'studentName').map((f, i) => (
                                    <tr key={i} className="hover:bg-alt/20 transition-colors">
                                       <td className="px-6 py-4 font-bold text-bright text-sm">{f.studentName}</td>
                                                                               <td className="px-6 py-4 text-success font-bold text-sm">₹{(Number(f.paidAmount) || 0).toLocaleString()}</td>

                                       <td className="px-6 py-4"><span className="badge-premium badge-primary">{f.paymentMode}</span></td>
                                                                               <td className="px-6 py-4 text-danger font-bold text-sm">₹{(Number(f.pendingFees) || 0).toLocaleString()}</td>

                                       <td className="px-6 py-4 text-right">
                                          <button onClick={() => deleteFeeEntry(f._id)} className="text-dim hover:text-danger transition-all">
                                             <Trash2 size={16} />
                                          </button>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'announcements' && (
                  <div className="space-y-8">
                     <div className="flex items-center justify-between">
                        <div>
                           <h3 className="text-2xl font-bold text-bright tracking-tight">Broadcast Center</h3>
                           <p className="text-xs text-dim font-medium uppercase tracking-widest mt-1 opacity-70">Deploy official notices & academic alerts</p>
                        </div>
                        <button onClick={() => setShowAnnounceModal(true)} className="btn-premium btn-premium-primary px-8 py-3 flex items-center gap-3">
                           <Plus size={18} /> <span className="font-bold">PUBLISH NOTICE</span>
                        </button>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {announcements.length === 0 && <div className="col-span-full card-premium text-center py-16 text-dim italic">No active broadcasts.</div>}
                        {announcements.map((ann, i) => (
                           <div key={ann._id || i} className="card-premium group hover:border-primary/30 transition-all border-l-4 border-l-primary/40 bg-surface/50 p-6">
                              <div className="flex items-start justify-between mb-4">
                                 <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${ann.type === 'urgent' ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'}`}>
                                       {ann.type === 'urgent' ? <AlertCircle size={18} /> : <Bell size={18} />}
                                    </div>
                                    <div>
                                       <h4 className="font-bold text-bright uppercase tracking-tight leading-tight">{ann.title}</h4>
                                       <p className="text-[10px] font-bold text-dim uppercase tracking-widest mt-1">
                                          {new Date(ann.createdAt).toLocaleDateString()} • {ann.type}
                                       </p>
                                    </div>
                                 </div>
                                 <button onClick={() => removeAnnouncement(ann._id)} className="w-9 h-9 rounded-lg bg-alt text-dim hover:text-danger transition-all flex items-center justify-center border border-subtle">
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                              <div className="p-4 rounded-xl bg-alt/50 border border-subtle">
                                 <p className="text-sm font-medium text-main leading-relaxed">{ann.content}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {activeTab === 'halloffame' && (
                  <div className="space-y-8">
                     <h3 className="text-2xl font-bold text-bright">Scholar Hall of Fame</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <div className="card-premium flex flex-col items-center justify-center border-dashed border-dim/20 p-10 bg-transparent shadow-none hover:shadow-lg cursor-pointer group">
                           <Plus size={32} className="text-dim group-hover:text-primary transition-all mb-4" />
                           <span className="text-xs font-bold text-dim group-hover:text-primary transition-all uppercase tracking-widest">Add Topper</span>
                        </div>
                        {filteredItems(toppers).map((t, i) => (
                           <div key={i} className="card-premium group p-5">
                              <div className="h-56 bg-alt rounded-2xl mb-4 flex-center overflow-hidden border border-subtle group-hover:translate-y-[-5px] transition-all relative">
                                 {t.photoUrl ? <img src={`${API_BASE}${t.photoUrl}`} className="w-full h-full object-cover" /> : <Trophy size={64} className="text-dim opacity-10" />}
                                 <div className="absolute top-3 right-3 badge-premium badge-primary">Ranker</div>
                              </div>
                              <h4 className="text-lg font-bold text-bright mb-1">{t.name}</h4>
                              <div className="flex items-center justify-between text-[10px] font-bold text-dim uppercase tracking-widest mb-4">
                                 <span>{t.exam}</span>
                                 <span className="text-primary font-black">DR: {t.marks}%</span>
                              </div>
                              <button onClick={() => deleteTopper(t._id)} className="w-full py-2.5 rounded-xl bg-danger/5 text-danger font-bold text-[10px] uppercase tracking-widest border border-danger/10 hover:bg-danger/10 transition-all">Remove Portfolio</button>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

                {activeTab === 'settings' && (
                  <div className="space-y-12 animate-fadeUp">
                    <div className="flex flex-col md:flex-row gap-8">
                       {/* Admin Password Card */}
                       <div className="flex-1 card-premium p-8 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
                          <div className="flex items-center gap-4 mb-8">
                             <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20"><Settings size={22} /></div>
                             <div>
                                <h3 className="text-xl font-black text-bright uppercase tracking-tight italic">Admin Credentials</h3>
                                <p className="text-[10px] font-bold text-dim uppercase tracking-[0.2em]">Secure Main Control Access</p>
                             </div>
                          </div>
                          
                          <div className="space-y-5">
                             <div>
                                <label className="text-[9px] font-black text-dim uppercase tracking-widest mb-1.5 block">Current Master Key</label>
                                <input 
                                  type="password" 
                                  className="input-premium py-3.5 text-xs bg-alt/30" 
                                  placeholder="••••••••" 
                                  value={adminPassData.current}
                                  onChange={e => setAdminPassData({...adminPassData, current: e.target.value})}
                                />
                             </div>
                             <div>
                                <label className="text-[9px] font-black text-dim uppercase tracking-widest mb-1.5 block">New Master Key</label>
                                <input 
                                  type="password" 
                                  className="input-premium py-3.5 text-xs bg-alt/30" 
                                  placeholder="Enter new password"
                                  value={adminPassData.new}
                                  onChange={e => setAdminPassData({...adminPassData, new: e.target.value})}
                                />
                             </div>
                             <div>
                                <label className="text-[9px] font-black text-dim uppercase tracking-widest mb-1.5 block">Confirm New Master Key</label>
                                <input 
                                  type="password" 
                                  className="input-premium py-3.5 text-xs bg-alt/30" 
                                  placeholder="Verify new password"
                                  value={adminPassData.confirm}
                                  onChange={e => setAdminPassData({...adminPassData, confirm: e.target.value})}
                                />
                             </div>
                             
                             <button 
                                onClick={async () => {
                                   if (!adminPassData.current || !adminPassData.new) return setMessage({ text: 'All fields required', type: 'error' });
                                   if (adminPassData.new !== adminPassData.confirm) return setMessage({ text: 'Passwords do not match', type: 'error' });
                                   if (adminPassData.new.length < 6) return setMessage({ text: 'Min length 6 characters', type: 'error' });
                                   
                                   const ok = await changeAdminPassword(adminPassData.current, adminPassData.new);
                                   if (ok) {
                                      setMessage({ text: 'Admin identity updated!', type: 'success' });
                                      setAdminPassData({ current: '', new: '', confirm: '' });
                                   } else {
                                      setMessage({ text: 'Verification failed', type: 'error' });
                                   }
                                }}
                                className="w-full btn-premium btn-premium-primary py-4 font-black text-[10px] uppercase tracking-[0.2em] shadow-lg mt-4"
                             >
                                Synchronize Security
                             </button>
                             {message.text && (
                                <p className={`text-center text-[10px] font-bold uppercase mt-4 py-2 rounded-lg ${message.type === 'success' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                                   {message.text}
                                </p>
                             )}
                          </div>
                       </div>

                       {/* System Stats/Info Card */}
                       <div className="flex-1 space-y-8">
                          <div className="card-premium p-8 border-l-4 border-l-primary/40 bg-grad-surface">
                             <h4 className="text-sm font-black text-bright uppercase tracking-widest mb-6 border-b border-subtle pb-4 italic">Platform Ecosystem</h4>
                             <div className="grid grid-cols-2 gap-6">
                                <div>
                                   <p className="text-3xl font-black text-primary">{students.length}</p>
                                   <p className="text-[9px] font-black text-dim uppercase tracking-[0.1em]">ENROLLED SCHOLARS</p>
                                </div>
                                <div>
                                   <p className="text-3xl font-black text-success">{courses.length}</p>
                                   <p className="text-[9px] font-black text-dim uppercase tracking-[0.1em]">OPERATIONAL BATCHES</p>
                                </div>
                             </div>
                          </div>
                          <div className="card-premium p-8 bg-surface/30 border-subtle">
                             <h4 className="text-[10px] font-black text-dim uppercase tracking-[0.2em] mb-4">Security Advisory</h4>
                             <p className="text-xs text-dim leading-loose font-medium opacity-80 italic">Regularly update administrative keys to maintain data integrity. Use a combination of uppercase letters, numbers, and specialized symbols for maximum cryptographic strength.</p>
                          </div>
                       </div>
                    </div>

                    {/* Student Management Section */}
                    <div className="space-y-6">
                       <div className="flex items-center justify-between px-2">
                          <div>
                             <h3 className="text-2xl font-black text-bright uppercase tracking-tight italic">Scholar Directory Oversight</h3>
                             <p className="text-[10px] font-bold text-dim uppercase tracking-[0.2em]">Manage Identity & Access Credentials</p>
                          </div>
                       </div>

                       <div className="card-premium p-0 overflow-hidden border-subtle shadow-xl">
                          <div className="overflow-x-auto">
                             <table className="w-full text-left">
                                <thead className="bg-alt/40 border-b border-subtle">
                                   <tr>
                                      <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-dim">SCHOLAR IDENTITY</th>
                                      <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-dim">BATCH / BOARD</th>
                                      <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-dim">CONTACT VECTOR</th>
                                      <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-dim text-right">MASTER ACTIONS</th>
                                   </tr>
                                </thead>
                                <tbody className="divide-y divide-subtle">
                                   {students.map((st, i) => (
                                      <tr key={i} className="group hover:bg-primary/5 transition-all">
                                         <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                               <div className="w-10 h-10 rounded-2xl bg-grad-main flex items-center justify-center font-black text-white text-xs shadow-md shadow-primary/20">{st.name.charAt(0)}</div>
                                               <div>
                                                  <p className="font-black text-bright text-sm uppercase tracking-tight">{st.name}</p>
                                                  <p className="text-[9px] text-dim font-bold tracking-widest mt-0.5 opacity-70">UID: {st._id.substring(st._id.length - 8)}</p>
                                               </div>
                                            </div>
                                         </td>
                                         <td className="px-8 py-5"><span className="badge-premium badge-primary text-[9px] font-black px-4 py-1.5 uppercase">{st.studentClass || 'UNASSIGNED'}</span></td>
                                         <td className="px-8 py-5 font-bold text-xs text-bright/80">{st.phone}</td>
                                         <td className="px-8 py-5">
                                            <div className="flex justify-end gap-2.5">
                                               <button 
                                                  onClick={() => { setSelectedStudent(st); setShowEditStudentModal(true); }}
                                                  className="w-10 h-10 rounded-xl bg-surface border border-subtle text-dim hover:text-primary hover:border-primary/30 transition-all flex items-center justify-center"
                                                  title="Edit Identity"
                                               >
                                                  <Edit2 size={16} />
                                               </button>
                                               <button 
                                                  onClick={() => { setSelectedStudent(st); setShowResetPassModal(true); }}
                                                  className="w-10 h-10 rounded-xl bg-surface border border-subtle text-dim hover:text-success hover:border-success/30 transition-all flex items-center justify-center"
                                                  title="Access Override"
                                               >
                                                  <Award size={16} />
                                               </button>
                                               <button 
                                                  onClick={() => { if(window.confirm(`Terminate ${st.name}'s account?`)) deleteStudent(st._id); }}
                                                  className="w-10 h-10 rounded-xl bg-surface border border-subtle text-dim hover:text-danger hover:border-danger/30 transition-all flex items-center justify-center"
                                               >
                                                  <Trash2 size={16} />
                                               </button>
                                            </div>
                                         </td>
                                      </tr>
                                   ))}
                                </tbody>
                             </table>
                          </div>
                       </div>
                    </div>
                  </div>
                )}
            </div>
         </main>

         {/* Add Subject Modal */}
         {showAddModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-8 bg-black/60 backdrop-blur-md animate-fadeIn">
               <div className="w-full max-w-lg card-premium shadow-2xl animate-fadeUp border-primary/20">
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-2xl font-bold text-bright tracking-tight">Create Subject</h2>
                     <button onClick={() => setShowAddModal(false)} className="w-9 h-9 rounded-lg bg-alt flex items-center justify-center text-dim hover:text-bright transition-all">✕</button>
                  </div>
                  <form onSubmit={handleAddSubject} className="space-y-6">
                     <div className="grid grid-cols-1 gap-6">
                        <div>
                           <label className="text-[10px] font-bold text-dim uppercase tracking-widest mb-2 block">Subject Nomenclature</label>
                           <input className="input-premium" placeholder="e.g. ADVANCED CALCULUS" value={newSubject.name} onChange={e => setNewSubject({ ...newSubject, name: e.target.value })} required />
                        </div>
                        <div>
                           <label className="text-[10px] font-bold text-dim uppercase tracking-widest mb-2 block">Academic Board</label>
                           <input className="input-premium" placeholder="e.g. CBSE XII 2026" value={newSubject.category} onChange={e => setNewSubject({ ...newSubject, category: e.target.value })} required />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                           <label className="text-[10px] font-bold text-dim uppercase tracking-widest mb-2 block">Avatar Icon</label>
                           <select className="input-premium h-14" value={newSubject.icon} onChange={e => setNewSubject({ ...newSubject, icon: e.target.value })}>
                              <option>📘</option><option>🧪</option><option>🔢</option><option>🌍</option><option>⚖️</option><option>🧬</option><option>⚛️</option>
                           </select>
                        </div>
                        <div>
                           <label className="text-[10px] font-bold text-dim uppercase tracking-widest mb-2 block">Brand Identity</label>
                           <div className="flex items-center gap-3">
                              <input type="color" className="w-12 h-12 bg-transparent border-none cursor-pointer" value={newSubject.color} onChange={e => setNewSubject({ ...newSubject, color: e.target.value })} />
                              <span className="text-xs font-bold text-dim uppercase">{newSubject.color}</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex gap-3 mt-8 pt-6 border-t border-subtle">
                        <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 btn-premium btn-premium-secondary py-3">Cancel</button>
                        <button type="submit" className="flex-1 btn-premium btn-premium-primary py-3">Confirm Entry</button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* Add Course Modal */}
         {showCourseModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-8 bg-black/60 backdrop-blur-md animate-fadeIn">
               <div className="w-full max-w-lg card-premium shadow-2xl animate-fadeUp border-primary/20">
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-2xl font-bold text-bright tracking-tight">Create Folder/Course</h2>
                     <button onClick={() => setShowCourseModal(false)} className="w-9 h-9 rounded-lg bg-alt flex items-center justify-center text-dim hover:text-bright transition-all">✕</button>
                  </div>
                  <form onSubmit={handleAddCourse} className="space-y-6">
                     <div>
                        <label className="text-[10px] font-bold text-dim uppercase tracking-widest mb-2 block">Course Branding</label>
                        <input className="input-premium" placeholder="e.g. 10th SCIENCE BATCH 2026" value={newCourse.name} onChange={e => setNewCourse({ ...newCourse, name: e.target.value })} required />
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-dim uppercase tracking-widest mb-2 block">Folder Description</label>
                        <textarea className="input-premium min-h-[100px] py-4" placeholder="Briefly describe the contents of this folder..." value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} />
                     </div>
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                           <label className="text-[10px] font-bold text-dim uppercase tracking-widest mb-2 block">Folder Icon</label>
                           <select className="input-premium h-14" value={newCourse.icon} onChange={e => setNewCourse({ ...newCourse, icon: e.target.value })}>
                              <option>📂</option><option>📁</option><option>🚀</option><option>🎓</option><option>🔬</option>
                           </select>
                        </div>
                        <div>
                           <label className="text-[10px] font-bold text-dim uppercase tracking-widest mb-2 block">Parent Category</label>
                           <input className="input-premium h-14" placeholder="e.g. High School" value={newCourse.category} onChange={e => setNewCourse({ ...newCourse, category: e.target.value })} />
                        </div>
                     </div>
                     <div className="flex gap-3 mt-8 pt-6 border-t border-subtle">
                        <button type="button" onClick={() => setShowCourseModal(false)} className="flex-1 btn-premium btn-premium-secondary py-3">Cancel</button>
                        <button type="submit" className="flex-1 btn-premium btn-premium-primary py-3">Establish Folder</button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* Assign Course Permissions Modal */}
         {showAssignModal && selectedStudent && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-8 bg-black/60 backdrop-blur-md animate-fadeIn">
               <div className="w-full max-w-lg card-premium shadow-2xl animate-fadeUp">
                  <div className="flex items-center justify-between mb-8">
                     <div>
                        <h2 className="text-2xl font-bold text-bright tracking-tight">Assign Course Permissions</h2>
                        <p className="text-xs text-dim font-medium uppercase mt-1">For Student: {selectedStudent.name}</p>
                     </div>
                     <button onClick={() => setShowAssignModal(false)} className="w-9 h-9 rounded-lg bg-alt flex items-center justify-center text-dim hover:text-bright transition-all">✕</button>
                  </div>
                  <form onSubmit={handleAssignCourses} className="space-y-6">
                     <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
                        {courses.map(course => (
                           <label key={course._id} className="flex items-center justify-between p-4 rounded-2xl bg-alt/50 border border-subtle hover:border-primary/30 cursor-pointer group transition-all">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-xl border border-subtle group-hover:scale-110 transition-all">{course.icon}</div>
                                 <span className="font-bold text-bright text-sm">{course.name}</span>
                              </div>
                              <input
                                 type="checkbox"
                                 name="assignedCourses"
                                 value={course._id}
                                 className="w-5 h-5 accent-primary"
                                 defaultChecked={selectedStudent.assignedCourses?.includes(course._id)}
                              />
                           </label>
                        ))}
                        {courses.length === 0 && <p className="text-dim text-center py-10 italic">No courses established yet.</p>}
                     </div>
                     <div className="flex gap-3 mt-8 pt-6 border-t border-subtle">
                        <button type="button" onClick={() => setShowAssignModal(false)} className="flex-1 btn-premium btn-premium-secondary py-3">Cancel</button>
                        <button type="submit" className="flex-1 btn-premium btn-premium-primary py-3">Update Permissions</button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* Add Announcement Modal */}
         {showAnnounceModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-8 bg-black/60 backdrop-blur-md animate-fadeIn">
               <div className="w-full max-w-lg card-premium shadow-2xl animate-fadeUp border-primary/20">
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-2xl font-bold text-bright tracking-tight">Deploy Broadcast</h2>
                     <button onClick={() => setShowAnnounceModal(false)} className="w-9 h-9 rounded-lg bg-alt flex items-center justify-center text-dim hover:text-bright transition-all">✕</button>
                  </div>
                  <form onSubmit={handleAddAnnouncement} className="space-y-6">
                     <div>
                        <label className="text-[10px] font-bold text-dim uppercase tracking-widest mb-2 block">Protocol Title</label>
                        <input className="input-premium" placeholder="e.g. SEMESTER EXAMINATION SCHEDULE" value={newAnnouncement.title} onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} required />
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-dim uppercase tracking-widest mb-2 block">Instruction Content</label>
                        <textarea className="input-premium min-h-[120px] py-4" placeholder="Draft the notice content here..." value={newAnnouncement.content} onChange={e => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })} required />
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-dim uppercase tracking-widest mb-2 block">Priority Classification</label>
                        <select className="input-premium h-14" value={newAnnouncement.type} onChange={e => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}>
                           <option value="general">GENERAL PROTOCOL</option>
                           <option value="urgent">URGENT ALERT</option>
                           <option value="holiday">ACADEMIC HOLIDAY</option>
                           <option value="event">CAMPUS EVENT</option>
                        </select>
                     </div>
                     <div className="flex gap-3 mt-8 pt-6 border-t border-subtle">
                        <button type="button" onClick={() => setShowAnnounceModal(false)} className="flex-1 btn-premium btn-premium-secondary py-3">Abort</button>
                        <button type="submit" className="flex-1 btn-premium btn-premium-primary py-3">Broadcast Now</button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* Post Payment Modal */}
         {showFeeModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-8 bg-black/60 backdrop-blur-md animate-fadeIn">
               <div className="w-full max-w-lg card-premium shadow-2xl animate-fadeUp border-primary/20">
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-2xl font-bold text-bright tracking-tight">Record Transaction</h2>
                     <button onClick={() => setShowFeeModal(false)} className="w-9 h-9 rounded-lg bg-alt flex items-center justify-center text-dim hover:text-bright transition-all">✕</button>
                  </div>
                  <form onSubmit={handleAddFee} className="space-y-6">
                     <div>
                        <label className="text-[10px] font-bold text-dim uppercase tracking-widest mb-2 block">Student Name</label>
                        <input className="input-premium" placeholder="e.g. ARYAN K." value={newFee.studentName} onChange={e => setNewFee({ ...newFee, studentName: e.target.value })} required />
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-dim uppercase tracking-widest mb-2 block">Contact Email</label>
                        <input type="email" className="input-premium" placeholder="e.g. scholar@domain.com" value={newFee.email} onChange={e => setNewFee({ ...newFee, email: e.target.value })} required />
                     </div>
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                           <label className="text-[10px] font-bold text-dim uppercase tracking-widest mb-2 block">Paid Amount (₹)</label>
                           <input type="number" className="input-premium h-14" placeholder="Amount" value={newFee.paidAmount} onChange={e => setNewFee({ ...newFee, paidAmount: e.target.value })} required />
                        </div>
                        <div>
                           <label className="text-[10px] font-bold text-dim uppercase tracking-widest mb-2 block">Balance Due (₹)</label>
                           <input type="number" className="input-premium h-14" placeholder="Remaining" value={newFee.pendingFees} onChange={e => setNewFee({ ...newFee, pendingFees: e.target.value })} />
                        </div>
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-dim uppercase tracking-widest mb-2 block">Payment Protocol</label>
                        <select className="input-premium h-14" value={newFee.paymentMode} onChange={e => setNewFee({ ...newFee, paymentMode: e.target.value })}>
                           <option value="UPI/Online">UPI / ONLINE GATEWAY</option>
                           <option value="Cash">DIRECT CASH DEPOSIT</option>
                           <option value="Cheque">BANK CHEQUE</option>
                           <option value="Transfer">NEFT/IMPS TRANSFER</option>
                        </select>
                     </div>
                     <div className="flex gap-3 mt-8 pt-6 border-t border-subtle">
                        <button type="button" onClick={() => setShowFeeModal(false)} className="flex-1 btn-premium btn-premium-secondary py-3">Cancel</button>
                        <button type="submit" className="flex-1 btn-premium btn-premium-primary py-3">Finalize Entry</button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* Edit Student Detail Modal */}
         {showEditStudentModal && selectedStudent && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-8 bg-black/60 backdrop-blur-md animate-fadeIn">
               <div className="w-full max-w-lg card-premium shadow-2xl animate-fadeUp">
                  <div className="flex items-center justify-between mb-8">
                     <div>
                        <h2 className="text-2xl font-black text-bright tracking-tight italic uppercase">Refine Identity</h2>
                        <p className="text-[9px] text-dim font-black uppercase tracking-[0.2em] mt-1">Operational ID: {selectedStudent._id}</p>
                     </div>
                     <button onClick={() => setShowEditStudentModal(false)} className="w-9 h-9 rounded-xl bg-alt flex items-center justify-center text-dim hover:text-bright transition-all border border-subtle">✕</button>
                  </div>
                  <form onSubmit={async (e) => {
                     e.preventDefault();
                     const fd = new FormData(e.target);
                     const updatedData = {
                        name: fd.get('name'),
                        email: fd.get('email'),
                        phone: fd.get('phone'),
                        studentClass: fd.get('studentClass')
                     };
                     const ok = await updateStudent(selectedStudent._id, updatedData);
                     if (ok) setShowEditStudentModal(false);
                  }} className="space-y-6">
                     <div className="grid grid-cols-1 gap-6">
                        <div>
                           <label className="text-[9px] font-black text-dim uppercase tracking-widest mb-1.5 block">Full Nomenclature</label>
                           <input name="name" className="input-premium py-4" defaultValue={selectedStudent.name} required />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div>
                              <label className="text-[9px] font-black text-dim uppercase tracking-widest mb-1.5 block">Electronic Mail</label>
                              <input name="email" type="email" className="input-premium py-4" defaultValue={selectedStudent.email} required />
                           </div>
                           <div>
                              <label className="text-[9px] font-black text-dim uppercase tracking-widest mb-1.5 block">Contact Vector</label>
                              <input name="phone" className="input-premium py-4" defaultValue={selectedStudent.phone} required />
                           </div>
                        </div>
                        <div>
                           <label className="text-[9px] font-black text-dim uppercase tracking-widest mb-1.5 block">Strategic Batch</label>
                           <input name="studentClass" className="input-premium py-4" defaultValue={selectedStudent.studentClass} placeholder="e.g. CBSE 10th" />
                        </div>
                     </div>
                     <div className="flex gap-4 mt-8 pt-6 border-t border-subtle">
                        <button type="button" onClick={() => setShowEditStudentModal(false)} className="flex-1 btn-premium btn-premium-secondary py-4 uppercase font-black text-[9px] tracking-widest">Abort</button>
                        <button type="submit" className="flex-1 btn-premium btn-premium-primary py-4 uppercase font-black text-[9px] tracking-widest shadow-xl">Deploy Updates</button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* Reset Password Modal */}
         {showResetPassModal && selectedStudent && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-8 bg-black/60 backdrop-blur-md animate-fadeIn">
               <div className="w-full max-w-sm card-premium shadow-2xl animate-fadeUp border-primary/20">
                  <div className="text-center mb-8">
                     <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary mx-auto flex items-center justify-center border border-primary/20 mb-4"><Award size={32} /></div>
                     <h2 className="text-xl font-black text-bright uppercase tracking-tight italic">Access Override</h2>
                     <p className="text-[9px] text-dim font-black uppercase tracking-[0.2em] mt-1">Override Access for {selectedStudent.name}</p>
                  </div>
                  <div className="space-y-6">
                     <div>
                        <label className="text-[9px] font-black text-dim uppercase tracking-widest mb-1.5 block">New Access Key</label>
                        <div className="flex gap-2">
                           <input id="resetPassInput" type="text" className="input-premium flex-1 py-4 text-center font-black tracking-widest" placeholder="G-8A9K2M" />
                           <button 
                              type="button"
                              onClick={() => {
                                 const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
                                 let retVal = "";
                                 for (let i = 0; i < 6; ++i) {
                                    retVal += charset.charAt(Math.floor(Math.random() * charset.length));
                                 }
                                 document.getElementById('resetPassInput').value = retVal;
                              }}
                              className="w-12 h-14 rounded-xl bg-alt border border-subtle flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                           >
                              <Plus size={20} />
                           </button>
                        </div>
                     </div>
                     <div className="flex gap-3">
                        <button onClick={() => setShowResetPassModal(false)} className="flex-1 btn-premium btn-premium-secondary py-4 uppercase font-black text-[9px] tracking-widest">Cancel</button>
                        <button 
                           onClick={async () => {
                              const pass = document.getElementById('resetPassInput').value;
                              if (!pass) return;
                              const ok = await resetStudentPassword(selectedStudent._id, pass);
                              if (ok) {
                                 alert(`New credentials deployed: ${pass}`);
                                 setShowResetPassModal(false);
                              }
                           }}
                           className="flex-1 btn-premium btn-premium-primary py-4 uppercase font-black text-[9px] tracking-widest shadow-xl"
                        >
                           Overwrite
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .flex-center { display: flex; align-items: center; justify-content: center; }
      `}</style>
      </div>
   );
};

export default TeacherDashboard;

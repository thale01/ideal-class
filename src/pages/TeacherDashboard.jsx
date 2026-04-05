import React, { useState, useEffect } from 'react';
import SubjectCard from '../components/admin/SubjectCard';
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
   const { user, logout, fetchStudents } = useAuth();
   const {
      subjects, courses,
      deleteSubject, addSubject, updateSubject,
      addCourse, deleteCourse, updateCourse,
      assignCourses, fetchCourses, fetchSubjects, renameChapter,
      addResource, deleteResource
   } = useCourse();
   const { applications, removeApplication, updateAppStatus } = useAdmission();
   const { fees, addFeeEntry, deleteFeeEntry } = useFee();
   const { toppers, deleteTopper, addTopper } = useGallery();
   const { updates } = useUpdate();
   const { doubts, replyToDoubt } = useDoubt();
   const { students, deleteStudent, updateStudent, approveStudent, resetStudentPassword, changeAdminPassword } = useAuth();
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
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [activeResourceTab, setActiveResourceTab] = useState('notes');
   const [showResourceForm, setShowResourceForm] = useState(false);
   const [newResource, setNewResource] = useState({ title: '', chapter: 'General', type: 'note', file: null, url: '', videoType: 'youtube' });
   const [showGalleryModal, setShowGalleryModal] = useState(false);
   const [newTopper, setNewTopper] = useState({ name: '', exam: '', marks: '', photo: null });

   React.useEffect(() => {
      const anyModalOpen = showAddModal || showCourseModal || showAssignModal || showAnnounceModal || showFeeModal || showEditStudentModal || showResetPassModal || showResourceForm || showGalleryModal;
      setIsModalOpen(anyModalOpen);
      if (anyModalOpen) {
         document.body.style.overflow = 'hidden';
      } else {
         document.body.style.overflow = 'unset';
      }
      return () => { document.body.style.overflow = 'unset'; };
   }, [showAddModal, showCourseModal, showAssignModal, showAnnounceModal, showFeeModal, showEditStudentModal, showResetPassModal, showResourceForm, showGalleryModal]);

   const filteredItems = (items, field = 'name') => {
      if (!items) return [];
      return items.filter(item => (item[field] || '').toLowerCase().includes(searchTerm.toLowerCase()));
   };

   const handleAddSubject = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
         const ok = await addSubject({ ...newSubject, courseId: selectedCourseId || newSubject.courseId });
         if (ok) {
           setMessage({ text: 'Subject established successfully in academic vault', type: 'success' });
           setShowAddModal(false);
           setNewSubject({ name: '', category: '', icon: '📘', color: '#4f46e5', courseId: '' });
         } else {
           throw new Error('Transaction aborted');
         }
      } catch (err) {
         setMessage({ text: 'Protocol failure: Connection link interrupted', type: 'error' });
      } finally {
         setIsLoading(false);
         setTimeout(() => setMessage({ text: '', type: '' }), 4000);
      }
   };

   const handleAddRes = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
         const resData = {
            title: newResource.title,
            chapter: newResource.chapter,
            type: newResource.type,
            videoType: newResource.videoType
         };
         if (newResource.type === 'note' && newResource.file) {
            resData.files = [newResource.file];
         } else if (newResource.type === 'video') {
            if (newResource.videoType === 'youtube') resData.url = newResource.url;
            else if (newResource.file) resData.files = [newResource.file];
         }
         await addResource(selectedSubjectId, resData);
         setMessage({ text: 'Asset uploaded to repository', type: 'success' });
         setShowResourceForm(false);
         setNewResource({ title: '', chapter: 'General', type: 'note', file: null, url: '', videoType: 'youtube' });
         setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } catch (err) {
         setMessage({ text: 'failed to deploy asset', type: 'error' });
      } finally {
         setIsLoading(false);
      }
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

   const handleAddTopper = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      try {
         await addTopper(newTopper);
         setMessage({ text: 'Excellence record archived', type: 'success' });
         setShowGalleryModal(false);
         setNewTopper({ name: '', exam: '', marks: '', photo: null });
         setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } catch (err) {
         setMessage({ text: 'Link failure during transmission', type: 'error' });
      } finally {
         setIsLoading(false);
      }
   };

   const menuItems = [
      { id: 'subjects', label: 'Dashboard', icon: Layout },
      { id: 'directory', label: 'Students', icon: Users },
      { id: 'admissions', label: 'Registrations', icon: UserPlus },
      { id: 'fees', label: 'Fees Management', icon: CreditCard },
      { id: 'doubts', label: 'Doubt Desk', icon: MessageSquareShare },
      { id: 'announcements', label: 'Announcements', icon: Bell },
      { id: 'halloffame', label: 'Hall of Fame', icon: Trophy },
      { id: 'settings', label: 'Settings', icon: Settings },
   ];

   return (
      <div className="min-h-screen bg-main flex flex-col md:flex-row transition-colors duration-500 overflow-x-hidden">
         {/* Sidebar Nav */}
         <aside className={`fixed inset-y-0 left-0 md:relative md:translate-x-0 bg-[#0a1120] flex flex-col h-screen z-[10002] transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isSidebarCollapsed ? 'md:w-28' : 'md:w-80'} shrink-0 shadow-2xl md:shadow-none border-r border-white/5 overflow-hidden`}>
            <div className={`p-6 transition-all duration-300 ${isSidebarCollapsed ? 'px-4' : 'p-8'}`}>
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4 overflow-hidden">
                     <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all hidden md:flex items-center justify-center shrink-0 shadow-lg"
                        title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                     >
                        <Menu size={20} />
                     </button>
                     {!isSidebarCollapsed && (
                        <div className="animate-fadeIn flex flex-col items-start gap-2">
                           <div className="flex items-center gap-3">
                              <img src={logo} alt="Logo" className="h-9 w-auto object-contain drop-shadow-sm transition-transform hover:scale-105" />
                              <div className="h-6 w-px bg-white/20"></div>
                              <h1 className="text-sm font-black text-white tracking-widest uppercase leading-none">IDEAL</h1>
                           </div>
                           <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] opacity-90">CLASSES SECURE</p> 
                        </div>
                     )}
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-3 rounded-2xl bg-white/5 text-white/60">
                     <X size={20} />
                  </button>
               </div>
            </div>

            <nav className="flex-1 px-4 space-y-3 overflow-y-auto no-scrollbar pb-8">
               {menuItems.map(item => {
                  const active = activeTab === item.id || (item.id === 'directory' && activeTab === 'students'); 
                  return (
                    <button
                        key={item.id}
                        onClick={() => { setActiveTab(item.id); setSearchTerm(''); setIsSidebarOpen(false); }}
                        className={`w-full group flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-300
                        ${active 
                          ? 'bg-slate-100 text-blue-700 shadow-xl shadow-black/40' 
                          : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
                        title={isSidebarCollapsed ? item.label : ""}
                    >
                        <div className={`p-2.5 rounded-xl transition-all duration-300 shrink-0 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-400/30' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}`}>
                            <item.icon size={18} />
                        </div>
                        <span className={`tracking-tight transition-all duration-300 ${isSidebarCollapsed ? 'opacity-0 scale-0 w-0' : 'opacity-100 scale-100'}`}>
                           {item.label}
                        </span>
                    </button>
                  )
               })}
            </nav>

            <div className={`p-6 border-t border-white/5 transition-all duration-300 ${isSidebarCollapsed ? 'px-4 text-center' : 'p-6'}`}>
               <button onClick={logout} className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm text-slate-400 bg-white/5 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 group w-full" title={isSidebarCollapsed ? "Terminate Session" : ""}>
                  <div className="p-2.5 bg-slate-800 rounded-xl group-hover:bg-red-600/20 transition-colors">
                     <LogOut size={18} />
                  </div>
                  <span className={`tracking-tight transition-all duration-300 ${isSidebarCollapsed ? 'opacity-0 scale-0 w-0' : 'opacity-100 scale-100'}`}>Sign Out</span>
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
            <header className="header-premium border-b border-subtle sticky top-0 bg-surface/90 backdrop-blur-md z-[1000] h-20">
               <div className="px-6 lg:px-12 flex items-center justify-between w-full h-full">
                  <div className="flex items-center gap-6">
                     <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="md:hidden p-2 rounded-lg bg-alt/50 border border-subtle text-bright"
                     >
                        <Menu size={20} />
                     </button>
                     <div className="flex items-center gap-4">
                        <img
                           src={logo}
                           alt="Logo"
                           className="md:hidden block object-contain"
                           style={{ height: '32px', maxWidth: '120px' }}
                        />
                        <div className="py-2 hidden md:block">
                           <h2 className="text-xl font-bold text-bright tracking-tight capitalize leading-none mb-1">{activeTab}</h2>
                           <p className="text-[10px] text-dim font-medium uppercase tracking-widest opacity-60">Academic Portal</p>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-6 h-11">
                     <div className="relative group hidden sm:block h-full">
                        <input
                           type="text"
                           placeholder={`Search entries...`}
                           className="input-premium h-full py-0 pl-12 w-80 bg-alt/50 border-subtle text-sm"
                           value={searchTerm}
                           onChange={e => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dim group-focus-within:text-primary transition-colors" size={18} />
                     </div>

                     <div className="flex items-center gap-2 sm:gap-3 pr-6 border-r border-subtle h-full">
                        <button onClick={toggleTheme} className="w-11 h-11 rounded-xl bg-alt border border-subtle flex items-center justify-center text-white hover:text-primary transition-all">
                           {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                        <button className="w-11 h-11 rounded-xl bg-alt border border-subtle flex items-center justify-center text-white hover:text-primary transition-all relative">
                           <Bell size={18} />
                           <div className="absolute top-3.5 right-3.5 w-1.5 h-1.5 bg-primary-accent rounded-full border border-surface"></div>
                        </button>
                     </div>

                     <div className="flex items-center gap-3 h-full">
                        <div className="w-11 h-11 rounded-xl bg-grad-main flex items-center justify-center font-bold text-white shadow-md text-base overflow-hidden">
                           {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="hidden xl:block">
                           <p className="text-sm font-bold text-bright leading-none mb-0.5">{user?.name || 'Administrator'}</p>
                           <span className="badge-premium badge-primary text-[8px] font-bold uppercase tracking-widest px-2.5 py-0.5">Verified Admin</span>
                        </div>
                     </div>
                  </div>
               </div>
            </header>

            <div className="px-6 md:px-10 lg:px-12 py-10 animate-fadeUp max-w-[1800px] mx-auto min-h-[calc(100vh-5rem)]">
               {activeTab === 'subjects' && (
                  <>
                     {!selectedCourseId ? (
                        <div className="space-y-10 animate-fadeIn">
                           <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8">
                              <div className="space-y-2">
                                 <h3 className="text-xl sm:text-4xl font-black text-bright tracking-tight uppercase leading-tight italic">Secure Repository</h3>
                                 <p className="text-[10px] sm:text-[12px] font-black text-dim uppercase tracking-[0.4em] [word-spacing:0.4em] opacity-60">
                                    Level 2: Academic Subjects Access & Dynamic Catalog
                                 </p>
                              </div>

                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 sm:gap-8">
                                 <div className="relative w-full sm:w-80 h-12 sm:h-14">
                                    <input
                                       type="text"
                                       placeholder="Dynamic filter..."
                                       className="input-premium h-full w-full py-0 pl-12 pr-4 text-sm bg-alt/40 border-subtle"
                                       value={searchTerm}
                                       onChange={e => setSearchTerm(e.target.value)}
                                    />
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dim" size={18} />
                                 </div>
                                 <button onClick={() => setShowCourseModal(true)} className="btn-premium btn-premium-primary h-12 sm:h-14 px-8 flex items-center justify-center gap-3 shadow-lg whitespace-nowrap">
                                    <PlusCircle size={18} /> <span className="font-bold">NEW BATCH</span>
                                 </button>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
                              {/* Create Folder Card */}
                              <div onClick={() => setShowCourseModal(true)} className="card-premium h-[260px] flex flex-col items-center justify-center border-dashed border-primary/30 hover:border-primary/60 cursor-pointer p-8 group bg-primary/5 hover:bg-primary/10 transition-all duration-500 hover:-translate-y-2">
                                 <div className="w-16 h-16 rounded-[1.25rem] bg-primary flex items-center justify-center text-white shadow-2xl relative transition-transform duration-500 group-hover:scale-110">
                                    <Plus size={32} className="relative z-10" />
                                 </div>
                                 <span className="text-[11px] font-black text-primary mt-6 uppercase tracking-[0.4em] text-center w-full">Initialize Folder</span>
                              </div>

                              {filteredItems(courses).map((course, j) => (
                                 <div
                                    key={course._id || j}
                                    onClick={() => setSelectedCourseId(course._id)}
                                    className="card-premium h-[260px] group cursor-pointer hover:border-primary/40 hover:-translate-y-2 transition-all p-6 relative overflow-hidden flex flex-col justify-between"
                                 >
                                    <div className="relative z-10">
                                       <div className="flex items-center justify-between mb-6">
                                          <div className="w-14 h-14 rounded-2xl bg-surface border border-subtle flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">
                                             {course.icon || '📂'}
                                          </div>
                                          <div className="flex gap-2 relative z-10">
                                             <button onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingId(course._id);
                                                setEditValue(course.name);
                                             }} className="w-9 h-9 rounded-xl bg-surface flex items-center justify-center text-dim hover:text-primary transition-all border border-subtle shadow-sm" title="Edit Folder"><Edit2 size={14} /></button>
                                             <button onClick={async (e) => {
                                                e.stopPropagation();
                                                if (window.confirm(`PERMANENT ERASE: Completely wipe "${course.name}"?`)) {
                                                   const ok = await deleteCourse(course._id);
                                                   console.log(ok ? "✅ Folder wiped." : "❌ Wipe failed.");
                                                }
                                             }} className="w-9 h-9 rounded-xl bg-danger/5 flex items-center justify-center text-danger hover:text-white hover:bg-danger transition-all border border-danger/10 shadow-sm" title="Erase Folder"><Trash2 size={14} /></button>
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
                                          <h4 className="text-xl font-black text-bright mb-1 uppercase tracking-tight leading-tight line-clamp-1">{course.name}</h4>
                                       )}
                                       <p className="text-[10px] font-black text-dim uppercase tracking-widest opacity-80">{course.category || 'Strategic Area'}</p>
                                    </div>

                                    <div className="pt-4 border-t border-subtle flex items-center justify-between relative z-10">
                                       <span className="badge-premium badge-primary px-3 py-1 font-black text-[9px]">{subjects.filter(s => s.courseId === course._id).length} MODULES</span>
                                       <ChevronRight size={18} className="text-dim group-hover:text-primary transition-all translate-x-0 group-hover:translate-x-1" />
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     ) : (
                        <div className="folder-isolated-view">
                           <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-12 py-12 animate-fadeIn">
                              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 border-b border-subtle pb-12">
                                 <div className="flex flex-col items-start gap-8">
                                    <button
                                       onClick={() => {
                                          if (selectedChapterName) setSelectedChapterName(null);
                                          else if (selectedSubjectId) setSelectedSubjectId(null);
                                          else setSelectedCourseId(null);
                                       }}
                                       className="btn-back"
                                    >
                                       <ArrowLeft size={16} /> BACK TO DIRECTORY
                                    </button>
                                    <div>
                                       <h2 className="text-5xl md:text-7xl font-black text-bright uppercase tracking-tighter leading-none mb-4 italic">
                                          {selectedChapterName || subjects.find(s => s._id === selectedSubjectId)?.name || courses.find(c => c._id === selectedCourseId)?.name}
                                       </h2>
                                       <div className="flex items-center gap-4">
                                          <div className="badge-premium badge-primary px-4 py-1.5 font-black text-[10px]">
                                             {selectedChapterName ? 'Secure Repository: Resource Level' : selectedSubjectId ? 'Level 3: Module Control' : 'Level 2: Academic Subjects Access'}
                                          </div>
                                       </div>
                                    </div>
                                 </div>

                                 <div className="flex items-center gap-4 h-[56px] w-full lg:w-auto">
                                    <div className="relative flex-1 lg:w-80 h-full">
                                       <input
                                          type="text"
                                          placeholder="Filter modules..."
                                          className="input-premium h-full py-0 pl-12 pr-4 text-sm bg-alt/50"
                                          value={searchTerm}
                                          onChange={e => setSearchTerm(e.target.value)}
                                       />
                                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dim" size={18} />
                                    </div>
                                    {!selectedSubjectId ? (
                                       <button onClick={() => setShowAddModal(true)} className="btn-premium btn-premium-primary h-full px-8 shadow-xl">
                                          <PlusCircle size={18} /> <span className="font-bold">ADD NEW SUBJECT</span>
                                       </button>
                                    ) : (
                                       <button onClick={() => navigate(`/manage-course/${selectedSubjectId}`)} className="btn-premium btn-premium-primary h-full px-8 shadow-xl">
                                          <PlusCircle size={18} /> <span className="font-bold">ADD NEW ASSET</span>
                                       </button>
                                    )}
                                 </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                                 {selectedCourseId && !selectedSubjectId && (
                                    <>
                                       {subjects.filter(s => String(s.courseId) === String(selectedCourseId)).length === 0 && (
                                          <div className="col-span-full py-24 text-center bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-[3rem] animate-fadeIn">
                                             <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center mx-auto mb-8">
                                                <BookOpen size={40} className="text-slate-200" />
                                             </div>
                                             <h4 className="text-2xl font-black text-slate-300 uppercase tracking-[0.3em] italic">Vault Empty</h4>
                                             <p className="text-slate-400 text-[10px] mt-3 font-black uppercase tracking-[0.4em] opacity-50">CURRICULUM INITIALIZATION REQUIRED</p>
                                             <button onClick={() => setShowAddModal(true)} className="mt-10 btn-premium py-3 px-8 text-[10px]">Deploy First Module</button>
                                          </div>
                                       )}
                                       {filteredItems(subjects.filter(s => String(s.courseId) === String(selectedCourseId))).map((sub) => (
                                          <SubjectCard
                                             key={sub._id}
                                             subject={sub}
                                             onEdit={(s) => { setEditingId(s._id); setEditValue(s.name); }}
                                             onDelete={deleteSubject}
                                          />
                                       ))}
                                    </>
                                 )}
                              </div>

                              {selectedSubjectId && !showResourceForm && (
                                 <div className="col-span-full">
                                     <div className="tabs-premium mb-12">
                                        <button 
                                          onClick={() => setActiveResourceTab('notes')} 
                                          className={`tab-item-premium ${activeResourceTab === 'notes' ? 'active' : ''}`}
                                        >
                                          Notes & PDF
                                        </button>
                                        <button 
                                          onClick={() => setActiveResourceTab('videos')} 
                                          className={`tab-item-premium ${activeResourceTab === 'videos' ? 'active' : ''}`}
                                        >
                                          Video Lectures
                                        </button>
                                        <div className="flex-1"></div>
                                        <button onClick={() => setShowResourceForm(true)} className="btn-premium btn-premium-primary !px-6 !py-2.5 shadow-sm text-[10px]">
                                           <Plus size={14} /> Add Asset
                                        </button>
                                     </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                       {(() => {
                                          const sub = subjects.find(s => s._id === selectedSubjectId);
                                          const assets = activeResourceTab === 'notes' ? (sub?.resources?.notes || []) : (sub?.resources?.videos || []);

                                          if (assets.length === 0) return (
                                             <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-50 bg-slate-50/30 rounded-[2.5rem]">
                                                <p className="text-slate-300 font-black uppercase tracking-widest italic">No assets deployed in this sector</p>
                                             </div>
                                          );

                                          return assets.map((asset, i) => (
                                             <div key={i} className="card-clean flex items-center gap-6 group">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm bg-alt/80 border border-subtle transition-all group-hover:scale-110 ${activeResourceTab === 'notes' ? 'text-blue-500' : 'text-red-500'}`}>
                                                   {activeResourceTab === 'notes' ? <FileText size={24} /> : <Play size={24} />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                   <h5 className="font-black text-bright uppercase text-xs truncate mb-1">{asset.title}</h5>
                                                   <p className="text-[9px] font-black text-dim uppercase tracking-widest opacity-60">{activeResourceTab === 'notes' ? 'PDF DOCUMENT' : asset.dataType || 'DIRECT LINK'}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                   <a href={activeResourceTab === 'notes' ? `${API_BASE}${asset.fileUrl}` : asset.url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all">
                                                      <Play size={16} />
                                                   </a>
                                                   <button onClick={async () => { if (window.confirm('Erase this asset?')) await deleteResource(selectedSubjectId, asset._id, activeResourceTab === 'notes' ? 'note' : 'video'); }} className="w-10 h-10 rounded-xl bg-alt text-dim hover:text-danger flex items-center justify-center border border-subtle hover:bg-surface transition-all"><Trash2 size={16} /></button>
                                                </div>
                                             </div>
                                          ));
                                       })()}
                                    </div>
                                 </div>
                              )}

                              {showResourceForm && (
                                 <div className="col-span-full max-w-2xl mx-auto w-full animate-fadeUp">
                                    <div className="card-premium p-8 md:p-12 border-subtle shadow-2xl relative overflow-hidden bg-grad-surface">
                                       <button onClick={() => setShowResourceForm(false)} className="absolute top-8 right-8 text-dim hover:text-primary transition-all"><X size={24} /></button>
                                       <div className="mb-10">
                                          <h3 className="text-3xl font-black text-bright uppercase italic tracking-tighter leading-none mb-3">Deploy Digital Asset</h3>
                                          <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] opacity-80">Repository Addition Sequence</p>
                                       </div>
                                       
                                       <form onSubmit={handleAddRes} className="space-y-10">
                                          <div className="grid grid-cols-2 gap-4 bg-alt/50 p-2 rounded-2xl mb-8 border border-subtle">
                                             <button type="button" onClick={() => setNewResource({ ...newResource, type: 'note' })} className={`flex-1 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${newResource.type === 'note' ? 'bg-primary text-white shadow-lg' : 'text-dim hover:text-bright'}`}>Note / PDF Archive</button>
                                             <button type="button" onClick={() => setNewResource({ ...newResource, type: 'video' })} className={`flex-1 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${newResource.type === 'video' ? 'bg-primary text-white shadow-lg' : 'text-dim hover:text-bright'}`}>Video Intel</button>
                                          </div>

                                          <div className="space-y-6">
                                             <div>
                                                <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-3 block">Asset Designation</label>
                                                <input className="input-premium py-5 px-6 italic text-bright bg-alt/30" placeholder="E.G. SEMESTER 1 HANDOUT" value={newResource.title} onChange={e => setNewResource({ ...newResource, title: e.target.value })} required />
                                             </div>

                                             {newResource.type === 'video' && (
                                                <div className="space-y-8 animate-fadeIn">
                                                   <div className="flex gap-8 px-2">
                                                      <label className="flex items-center gap-3 cursor-pointer group">
                                                         <input type="radio" className="w-5 h-5 accent-primary" checked={newResource.videoType === 'youtube'} onChange={() => setNewResource({ ...newResource, videoType: 'youtube' })} />
                                                         <span className="text-[10px] font-black uppercase tracking-widest text-dim group-hover:text-bright transition-colors">YouTube Link</span>
                                                      </label>
                                                      <label className="flex items-center gap-3 cursor-pointer group">
                                                         <input type="radio" className="w-5 h-5 accent-primary" checked={newResource.videoType === 'file'} onChange={() => setNewResource({ ...newResource, videoType: 'file' })} />
                                                         <span className="text-[10px] font-black uppercase tracking-widest text-dim group-hover:text-bright transition-colors">Direct Upload</span>
                                                      </label>
                                                   </div>
                                                   {newResource.videoType === 'youtube' ? (
                                                      <input className="input-premium py-5 px-6 italic text-bright bg-alt/30" placeholder="PASTE CLOUD-STREAM URL..." value={newResource.url} onChange={e => setNewResource({ ...newResource, url: e.target.value })} required />
                                                   ) : (
                                                      <div className="relative group">
                                                         <input type="file" className="input-premium py-4 px-6 text-[10px] uppercase font-black cursor-pointer bg-alt/30 file:mr-6 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-primary file:text-white file:cursor-pointer" onChange={e => setNewResource({ ...newResource, file: e.target.files[0] })} required />
                                                      </div>
                                                   )}
                                                </div>
                                             )}

                                             {newResource.type === 'note' && (
                                                <div className="animate-fadeIn">
                                                   <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-3 block">PDF Repository Source</label>
                                                   <input type="file" className="input-premium py-4 px-6 text-[10px] uppercase font-black cursor-pointer bg-alt/30 file:mr-6 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-primary file:text-white file:cursor-pointer" onChange={e => setNewResource({ ...newResource, file: e.target.files[0] })} required />
                                                </div>
                                             )}
                                          </div>

                                          <div className="flex gap-6 pt-8 border-t border-subtle">
                                             <button type="button" onClick={() => setShowResourceForm(false)} className="flex-1 btn-premium btn-premium-secondary py-5 text-[10px] font-black">ABORT MISSION</button>
                                             <button type="submit" disabled={isLoading} className="flex-1 btn-premium btn-premium-primary py-5 text-[10px] font-black shadow-[0_12px_24px_rgba(37,99,235,0.25)]">
                                                {isLoading ? 'ENCRYPTING...' : 'DEPLOY ASSET'}
                                             </button>
                                          </div>
                                       </form>
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>
                     )}
                  </>
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

                     <div className="card-premium p-0 overflow-hidden shadow-sm border-subtle">
                        <div className="overflow-x-auto custom-scrollbar">
                           <table className="w-full text-left min-w-[900px] border-collapse">
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
                                       <td className="px-6 py-4">
                                           {st.status === 'approved' ? (
                                              <span className="badge-premium badge-success">Approved</span>
                                           ) : (
                                              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-lg text-[9px] font-black uppercase tracking-wider">Pending</span>
                                           )}
                                       </td>
                                       <td className="px-6 py-4 text-right">
                                          <div className="flex justify-end gap-2">
                                             {st.status !== 'approved' && (
                                                <button onClick={async () => {
                                                   if (window.confirm(`Grant official clearance to ${st.name}?`)) {
                                                      const ok = await approveStudent(st._id);
                                                      if (ok) setMessage({ text: 'Protocol Complete: Student identity verified & notified', type: 'success' });
                                                      else setMessage({ text: 'Link Failure: Could not finalize approval', type: 'error' });
                                                      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
                                                   }
                                                }} className="w-9 h-9 rounded-lg bg-green-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all" title="Approve Access">
                                                   <Check size={16} />
                                                </button>
                                             )}
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
                     {applications.filter(a => (a.status || 'pending') === 'pending').length === 0 ? (
                        <div className="card-premium text-center py-20 bg-slate-900/40 border-dashed border-slate-800 rounded-[2.5rem]">
                           <CheckCircle2 size={48} className="mx-auto text-slate-800 mb-6 opacity-30" />
                           <h4 className="text-xl font-black text-slate-600 uppercase tracking-widest">Workspace Clear</h4>
                           <p className="text-slate-500 text-[10px] mt-2 font-black uppercase tracking-[0.2em] opacity-40">All Admission Sequences Processed</p>
                           <button onClick={() => setActiveTab('students')} className="mt-8 btn-premium py-2 px-6 text-xs border-primary/20 text-primary hover:bg-primary/5">View Student Registry</button>
                        </div>
                     ) : (
                        <div className="grid grid-cols-1 gap-4">
                           {filteredItems(applications.filter(a => (a.status || 'pending') === 'pending'), 'name').map((app, i) => (
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
                                 <div className="flex items-center gap-3 w-full md:w-auto">
                                    <button
                                       onClick={async () => {
                                          setMessage({ text: 'Processing Approval & Sending Notification...', type: 'success' });
                                          const ok = await updateAppStatus(app._id, 'approved');
                                          if (ok) {
                                             fetchStudents();
                                             setMessage({ text: 'Application Approved: Email Dispatched to Student', type: 'success' });
                                          } else {
                                             setMessage({ text: 'Approval Link Failure - Check Server Connection', type: 'error' });
                                          }
                                       }}
                                       className="btn-premium btn-premium-primary flex-1 md:flex-none py-3 md:py-2.5 px-6 text-sm md:text-xs"
                                    >
                                       Approve
                                    </button>
                                    <button onClick={() => removeApplication(app._id)} className="w-12 h-12 md:w-10 md:h-10 rounded-xl bg-alt border border-subtle flex-center text-dim hover:text-danger hover:border-danger/30 transition-all shrink-0">
                                       <Trash2 size={18} />
                                    </button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     )}
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
                        <div onClick={() => setShowFeeModal(true)} className="card-premium flex flex-col items-center justify-center border-dashed border-subtle hover:border-primary cursor-pointer group transition-all">
                           <Plus size={24} className="mx-auto text-dim group-hover:text-primary transition-all mb-2" />
                           <p className="text-xs font-bold text-dim group-hover:text-primary transition-all uppercase tracking-widest">Post Payment</p>
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
                  <div className="space-y-12 bg-cosmic min-h-[80vh] rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
                     {/* Starfield Background */}
                     <div className="starfield"></div>

                     <div className="relative z-10 flex items-center justify-between">
                        <div>
                           <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Scholar Hall of Fame</h3>
                           <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] mt-2">Zero-G Academic Orbit</p>
                        </div>
                     </div>

                     <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 relative z-10"
                        onMouseMove={(e) => {
                           const cards = e.currentTarget.querySelectorAll('.antigravity-card');
                           cards.forEach(card => {
                              const rect = card.getBoundingClientRect();
                              const centerX = rect.left + rect.width / 2;
                              const centerY = rect.top + rect.height / 2;
                              const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);

                              if (distance < 300) {
                                 const angle = Math.atan2(centerY - e.clientY, centerX - e.clientX);
                                 const force = (300 - distance) / 10;
                                 const translateX = Math.cos(angle) * force;
                                 const translateY = Math.sin(angle) * force;
                                 card.style.transform = `translate(${translateX}px, ${translateY}px) scale(1.02)`;
                              } else {
                                 card.style.transform = 'translate(0px, 0px) scale(1)';
                              }
                           });
                        }}
                        onMouseLeave={(e) => {
                           const cards = e.currentTarget.querySelectorAll('.antigravity-card');
                           cards.forEach(card => card.style.transform = 'translate(0px, 0px) scale(1)');
                        }}
                     >
                        <div
                           onClick={() => setShowGalleryModal(true)}
                           className="glass-card antigravity-card antigravity-float glow-neon-blue flex flex-col items-center justify-center p-12 cursor-pointer group transition-all animate-vacuum-pop"
                           style={{ animationDelay: '0.1s' }}
                        >
                           <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                              <Plus size={32} />
                           </div>
                           <span className="text-[10px] font-black text-cyan-400 mt-8 uppercase tracking-[0.3em] group-hover:text-white transition-colors">Add Topper</span>
                        </div>

                        {toppers.map((t, i) => (
                           <div
                              key={t._id || i}
                              className="glass-card antigravity-card antigravity-float glow-neon-violet group p-6 animate-vacuum-pop"
                              style={{ animationDelay: `${(i + 2) * 0.15}s` }}
                           >
                              <div className="h-64 bg-slate-900/40 rounded-3xl mb-6 flex items-center justify-center overflow-hidden border border-white/5 relative group-hover:border-violet-500/30 transition-all">
                                 {t.photoUrl ? (
                                    <img src={`${API_BASE}${t.photoUrl}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={t.name} />
                                 ) : (
                                    <Trophy size={80} className="text-white/10" />
                                 )}
                                 <div className="absolute top-4 right-4 bg-violet-600 text-white font-black text-[9px] px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">Ranker</div>
                              </div>

                              <div className="text-center mb-6">
                                 <h4 className="text-xl font-black text-white italic truncate uppercase">{t.name}</h4>
                                 <div className="flex items-center justify-center gap-4 mt-2">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.exam}</span>
                                    <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                                    <span className="text-[11px] font-black text-violet-400 uppercase tracking-widest">{t.marks}% Score</span>
                                 </div>
                              </div>

                              <button
                                 onClick={() => deleteTopper(t._id)}
                                 className="w-full py-4 rounded-2xl bg-white/5 text-white/40 font-black text-[9px] uppercase tracking-widest border border-white/5 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                              >
                                 Expel Record
                              </button>
                           </div>
                        ))}
                     </div>
                  </div>
               )}

               {activeTab === 'settings' && (
                  <div className="space-y-12 animate-fadeUp">
                     <div className="flex flex-col md:flex-row gap-8">
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
                                    onChange={e => setAdminPassData({ ...adminPassData, current: e.target.value })}
                                 />
                              </div>
                              <div>
                                 <label className="text-[9px] font-black text-dim uppercase tracking-widest mb-1.5 block">New Master Key</label>
                                 <input
                                    type="password"
                                    className="input-premium py-3.5 text-xs bg-alt/30"
                                    placeholder="Enter new password"
                                    value={adminPassData.new}
                                    onChange={e => setAdminPassData({ ...adminPassData, new: e.target.value })}
                                 />
                              </div>
                              <div>
                                 <label className="text-[9px] font-black text-dim uppercase tracking-widest mb-1.5 block">Confirm New Master Key</label>
                                 <input
                                    type="password"
                                    className="input-premium py-3.5 text-xs bg-alt/30"
                                    placeholder="Verify new password"
                                    value={adminPassData.confirm}
                                    onChange={e => setAdminPassData({ ...adminPassData, confirm: e.target.value })}
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
                           </div>

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
                        </div>
                     </div>
                     <div className="flex-1 space-y-6">
                           <h3 className="text-2xl font-black text-bright uppercase tracking-tight italic">Scholar Directory Oversight</h3>
                           <div className="card-premium p-0 overflow-hidden border-subtle shadow-xl">
                              <div className="overflow-x-auto">
                                 <table className="w-full text-left">
                                    <thead className="bg-alt/40 border-b border-subtle">
                                       <tr>
                                          <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-dim">SCHOLAR IDENTITY</th>
                                          <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-dim">BATCH / BOARD</th>
                                          <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-dim text-right">MASTER ACTIONS</th>
                                       </tr>
                                    </thead>
                                    <tbody className="divide-y divide-subtle">
                                       {students.map((st, i) => (
                                          <tr key={i} className="group hover:bg-primary/5 transition-all">
                                             <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                   <div className="w-10 h-10 rounded-2xl bg-grad-main flex items-center justify-center font-black text-white text-xs">{st.name.charAt(0)}</div>
                                                   <div>
                                                      <p className="font-black text-bright text-sm uppercase tracking-tight">{st.name}</p>
                                                      <p className="text-[9px] text-dim font-bold tracking-widest mt-0.5 opacity-70">UID: {st._id.substring(st._id.length - 8)}</p>
                                                   </div>
                                                </div>
                                             </td>
                                             <td className="px-8 py-5"><span className="badge-premium badge-primary text-[9px] font-black px-4 py-1.5 uppercase">{st.studentClass || 'UNASSIGNED'}</span></td>
                                             <td className="px-8 py-5">
                                                <div className="flex justify-end gap-2.5">
                                                   <button onClick={() => { setSelectedStudent(st); setShowEditStudentModal(true); }} className="w-10 h-10 rounded-xl bg-surface border border-subtle text-dim hover:text-primary transition-all flex items-center justify-center"><Edit2 size={16} /></button>
                                                   <button onClick={() => { setSelectedStudent(st); setShowResetPassModal(true); }} className="w-10 h-10 rounded-xl bg-surface border border-subtle text-dim hover:text-success transition-all flex items-center justify-center"><ShieldCheck size={16} /></button>
                                                   <button onClick={() => { if (window.confirm(`Terminate ${st.name}?`)) deleteStudent(st._id); }} className="w-10 h-10 rounded-xl bg-surface border border-subtle text-dim hover:text-danger transition-all flex items-center justify-center"><Trash2 size={16} /></button>
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
                  </div>
               )}
            </div>
         </main>

         {/* Toast Message */}
         {message.text && (
            <div className={`fixed top-12 left-1/2 -translate-x-1/2 z-[20000] px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl animate-fadeDown ${message.type === 'success' ? 'bg-black text-white' : 'bg-red-600 text-white'}`}>
               <div className="flex items-center gap-3">
                  {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  {message.text}
               </div>
            </div>
         )}

         {/* Add Subject Modal */}
         {showAddModal && (
            <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 sm:p-8 bg-black/80 animate-fadeIn">
               <div className="w-full max-w-lg modal-high-contrast rounded-3xl p-8 md:p-12 animate-fadeUp relative overflow-hidden">
                  <div className="flex items-start justify-between gap-8 mb-10">
                     <div className="text-left flex-1">
                        <h2 className="text-3xl font-black text-bright tracking-tight uppercase leading-none mb-2 italic">Create Subject</h2>
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest opacity-80">Protocol Initialization</p>
                     </div>
                     <button
                        onClick={() => setShowAddModal(false)}
                        className="w-11 h-11 rounded-2xl bg-alt border border-subtle flex items-center justify-center text-dim hover:text-primary transition-all shadow-sm shrink-0"
                     >
                        <X size={20} />
                     </button>
                  </div>
                  <form onSubmit={handleAddSubject} className="space-y-10">
                     <div className="space-y-6">
                        <div>
                           <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-3 block">Subject Nomenclature</label>
                           <input className="input-premium py-5 px-6 italic text-bright" placeholder="e.g. ADVANCED CALCULUS" value={newSubject.name} onChange={e => setNewSubject({ ...newSubject, name: e.target.value })} required />
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-3 block">Academic Board</label>
                           <input className="input-premium py-5 px-6 italic text-bright" placeholder="e.g. CBSE XII 2026" value={newSubject.category} onChange={e => setNewSubject({ ...newSubject, category: e.target.value })} required />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-8">
                        <div>
                           <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-3 block">Avatar Icon</label>
                           <select className="input-premium h-[64px] px-6 text-bright bg-alt/50" value={newSubject.icon} onChange={e => setNewSubject({ ...newSubject, icon: e.target.value })}>
                              <option>📘</option><option>🧪</option><option>🔢</option><option>🌍</option><option>⚖️</option><option>🧬</option><option>⚛️</option>
                           </select>
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-3 block">Brand color</label>
                           <div className="flex items-center h-[64px] gap-4 bg-alt/50 rounded-2xl px-4 border border-subtle">
                              <input type="color" className="w-10 h-10 bg-transparent border-none cursor-pointer" value={newSubject.color} onChange={e => setNewSubject({ ...newSubject, color: e.target.value })} />
                              <span className="text-[10px] font-black text-bright uppercase tracking-widest font-mono">{newSubject.color}</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex gap-6 pt-6 border-t border-subtle">
                        <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 btn-premium btn-premium-secondary py-5 text-[10px] font-black">ABORT SEQUENCE</button>
                        <button type="submit" disabled={isLoading} className="flex-1 btn-premium btn-premium-primary py-5 text-[10px] font-black shadow-[0_12px_24px_rgba(37,99,235,0.25)] disabled:opacity-50">
                           {isLoading ? 'ESTABLISHING...' : 'CONFIRM ENTRY'}
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* Add Course Modal */}
         {showCourseModal && (
            <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 sm:p-8 bg-black/80 animate-fadeIn overflow-hidden">
               <div className="w-full max-w-lg modal-high-contrast rounded-3xl shadow-2xl animate-fadeUp p-8 md:p-12 relative overflow-hidden">
                  <div className="flex items-start justify-between gap-8 mb-10">
                     <div className="text-left flex-1">
                        <h2 className="text-3xl font-black text-bright tracking-tight uppercase leading-none mb-3 italic">Create Folder/Course</h2>
                        <p className="text-[11px] text-primary font-black uppercase tracking-[0.3em] opacity-80">Initialize academic structure</p>
                     </div>
                     <button
                        onClick={() => setShowCourseModal(false)}
                        className="w-11 h-11 rounded-2xl bg-alt border border-subtle flex items-center justify-center text-dim hover:text-primary transition-all shadow-sm shrink-0"
                     >
                        <X size={20} />
                     </button>
                  </div>

                  <form onSubmit={handleAddCourse} className="space-y-10">
                     <div className="space-y-6">
                        <div>
                           <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-3 block">Folder Name</label>
                           <input 
                              className="input-premium py-5 px-6 italic text-bright" 
                              placeholder="e.g. SEMESTER 1 ARCHIVE"
                              value={newCourse.name} 
                              onChange={e => setNewCourse({ ...newCourse, name: e.target.value })} 
                              required 
                           />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                           <div>
                              <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-3 block">Icon</label>
                              <select 
                                 className="input-premium h-[64px] px-6 text-bright bg-alt/50 cursor-pointer" 
                                 value={newCourse.icon} 
                                 onChange={e => setNewCourse({ ...newCourse, icon: e.target.value })}
                              >
                                 <option>📂</option><option>📁</option><option>🚀</option><option>🎓</option><option>🔬</option>
                              </select>
                           </div>
                           <div>
                              <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-3 block">Category</label>
                              <input 
                                 className="input-premium h-[64px] px-6 text-bright bg-alt/50 placeholder:opacity-40" 
                                 placeholder="Academic Sector"
                                 value={newCourse.category} 
                                 onChange={e => setNewCourse({ ...newCourse, category: e.target.value })} 
                              />
                           </div>
                        </div>
                     </div>
                     <div className="flex gap-6 pt-6 border-t border-subtle">
                        <button 
                           type="button" 
                           onClick={() => setShowCourseModal(false)} 
                           className="flex-1 btn-premium btn-premium-secondary py-5 text-[10px] font-black"
                        >
                           ABORT SEQUENCE
                        </button>
                        <button 
                           type="submit" 
                           className="flex-1 btn-premium btn-premium-primary py-5 text-[10px] font-black shadow-[0_12px_24px_rgba(37,99,235,0.25)]"
                        >
                           ESTABLISH FOLDER
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* Assign Course Permissions Modal */}
         {showAssignModal && selectedStudent && (
            <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 sm:p-8 bg-black/80 animate-fadeIn">
               <div className="w-full max-w-lg modal-high-contrast rounded-3xl p-8 md:p-12 animate-fadeUp relative overflow-hidden">
                  <div className="flex items-start justify-between gap-8 mb-10">
                     <div className="flex-1 text-left">
                        <h2 className="text-2xl font-black text-bright tracking-tight uppercase leading-none italic mb-2">Assign Permissions</h2>
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest opacity-80">{selectedStudent.name}</p>
                     </div>
                     <button
                        onClick={() => setShowAssignModal(false)}
                        className="w-11 h-11 rounded-2xl bg-alt border border-subtle flex items-center justify-center text-dim hover:text-primary transition-all shadow-sm shrink-0"
                     >
                        <X size={20} />
                     </button>
                  </div>
                  <form onSubmit={handleAssignCourses} className="space-y-10">
                     <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-3 custom-scrollbar">
                        {courses.map(course => (
                           <label key={course._id} className="flex items-center justify-between p-5 rounded-2xl bg-alt/50 border border-subtle hover:border-primary cursor-pointer group transition-all">
                              <div className="flex items-center gap-6">
                                 <div className="w-14 h-14 rounded-xl bg-surface border border-subtle flex items-center justify-center text-2xl shadow-sm text-bright transition-all group-hover:scale-110">{course.icon}</div>
                                 <div className="flex flex-col">
                                    <span className="font-black text-bright text-sm uppercase tracking-tight leading-none mb-1">{course.name}</span>
                                    <span className="text-[8px] font-black text-dim uppercase tracking-widest opacity-60">{course.category || 'ACADEMIC MODULE'}</span>
                                 </div>
                              </div>
                              <input
                                 type="checkbox"
                                 name="assignedCourses"
                                 value={course._id}
                                 className="w-6 h-6 border-2 border-primary-accent rounded-lg bg-alt/40 checked:bg-primary transition-all cursor-pointer"
                                 defaultChecked={selectedStudent.assignedCourses?.includes(course._id)}
                              />
                           </label>
                        ))}
                     </div>
                     <div className="flex gap-6 pt-6 border-t border-subtle">
                        <button 
                           type="button" 
                           onClick={() => setShowAssignModal(false)} 
                           className="flex-1 btn-premium btn-premium-secondary py-5 text-[10px] font-black"
                        >
                           ABORT SEQUENCE
                        </button>
                        <button 
                           type="submit" 
                           className="flex-1 btn-premium btn-premium-primary py-5 text-[10px] font-black shadow-[0_12px_24px_rgba(37,99,235,0.25)]"
                        >
                           GRANT ACCESS
                        </button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* Add Announcement Modal */}
         {showAnnounceModal && (
            <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 sm:p-8 bg-black/80 animate-fadeIn">
               <div className="w-full max-w-lg modal-high-contrast rounded-3xl p-8 md:p-12 animate-fadeUp relative overflow-hidden">
                  <div className="flex items-start justify-between gap-8 mb-10">
                     <div className="text-left flex-1">
                        <h2 className="text-2xl font-black text-bright tracking-tight uppercase leading-none italic mb-2">Deploy Broadcast</h2>
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest opacity-80">Global Notification Protocol</p>
                     </div>
                     <button
                        onClick={() => setShowAnnounceModal(false)}
                        className="w-11 h-11 rounded-2xl bg-alt border border-subtle flex items-center justify-center text-dim hover:text-primary transition-all shadow-sm shrink-0"
                     >
                        <X size={20} />
                     </button>
                  </div>
                  <form onSubmit={handleAddAnnouncement} className="space-y-6">
                     <div>
                        <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-3 block">Protocol Title</label>
                        <input className="input-premium py-5 px-6 italic text-bright" placeholder="TITLE OF NOTICE" value={newAnnouncement.title} onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} required />
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-3 block">Instruction Content</label>
                        <textarea className="input-premium py-5 px-6 text-bright min-h-[140px] resize-none" placeholder="DRAFT CONTENT..." value={newAnnouncement.content} onChange={e => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })} required />
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-3 block">Priority Classification</label>
                        <select className="input-premium h-[64px] px-6 text-bright bg-alt/50" value={newAnnouncement.type} onChange={e => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}>
                           <option value="general">GENERAL PROTOCOL</option>
                           <option value="urgent">URGENT ALERT</option>
                           <option value="holiday">ACADEMIC HOLIDAY</option>
                           <option value="event">CAMPUS EVENT</option>
                        </select>
                     </div>
                     <div className="flex gap-6 pt-6 border-t border-subtle">
                        <button type="button" onClick={() => setShowAnnounceModal(false)} className="flex-1 btn-premium btn-premium-secondary py-5 text-[10px] font-black">ABORT</button>
                        <button type="submit" className="flex-1 btn-premium btn-premium-primary py-5 text-[10px] font-black shadow-[0_12px_24px_rgba(37,99,235,0.25)]">TRANSMIT</button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* Post Payment Modal */}
         {showFeeModal && (
            <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 sm:p-8 bg-black/80 animate-fadeIn">
               <div className="w-full max-w-lg modal-high-contrast rounded-3xl p-8 md:p-12 animate-fadeUp relative overflow-hidden">
                  <div className="flex items-start justify-between gap-8 mb-10">
                     <div className="text-left flex-1">
                        <h2 className="text-2xl font-black text-bright tracking-tight uppercase leading-none italic mb-2">Record Payment</h2>
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest opacity-80">Financial Transaction Registry</p>
                     </div>
                     <button
                        onClick={() => setShowFeeModal(false)}
                        className="w-11 h-11 rounded-2xl bg-alt border border-subtle flex items-center justify-center text-dim hover:text-primary transition-all shadow-sm shrink-0"
                     >
                        <X size={20} />
                     </button>
                  </div>
                  <form onSubmit={handleAddFee} className="space-y-6">
                     <div>
                        <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-2 block">Student Name</label>
                        <input className="input-premium py-5 px-6 italic text-bright" placeholder="FULL NAME" value={newFee.studentName} onChange={e => setNewFee({ ...newFee, studentName: e.target.value })} required />
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-2 block">Mail Vector</label>
                        <input type="email" className="input-premium py-5 px-6 italic text-bright" placeholder="SCHOLAR@DOMAIN.COM" value={newFee.email} onChange={e => setNewFee({ ...newFee, email: e.target.value })} required />
                     </div>
                     <div className="grid grid-cols-2 gap-8">
                        <div>
                           <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-2 block">Amount Received</label>
                           <input type="number" className="input-premium py-5 px-6 text-bright bg-alt/50" placeholder="₹" value={newFee.paidAmount} onChange={e => setNewFee({ ...newFee, paidAmount: e.target.value })} required />
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-2 block">Outstanding</label>
                           <input type="number" className="input-premium py-5 px-6 text-bright bg-alt/50" placeholder="₹" value={newFee.pendingFees} onChange={e => setNewFee({ ...newFee, pendingFees: e.target.value })} />
                        </div>
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-2 block">Payment Protocol</label>
                        <select className="input-premium h-[64px] px-6 text-bright bg-alt/50" value={newFee.paymentMode} onChange={e => setNewFee({ ...newFee, paymentMode: e.target.value })}>
                           <option value="UPI/Online">UPI / ONLINE GATEWAY</option>
                           <option value="Cash">DIRECT CASH DEPOSIT</option>
                           <option value="Cheque">BANK CHEQUE</option>
                           <option value="Transfer">NEFT/IMPS TRANSFER</option>
                        </select>
                     </div>
                     <div className="flex gap-6 pt-6 border-t border-subtle">
                        <button type="button" onClick={() => setShowFeeModal(false)} className="flex-1 btn-premium btn-premium-secondary py-5 text-[10px] font-black">CANCEL</button>
                        <button type="submit" className="flex-1 btn-premium btn-premium-primary py-5 text-[10px] font-black shadow-[0_12px_24px_rgba(37,99,235,0.25)]">FINALIZE</button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* Edit Student Detail Modal */}
         {showEditStudentModal && selectedStudent && (
            <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 sm:p-8 bg-black/80 animate-fadeIn">
               <div className="w-full max-w-lg modal-high-contrast rounded-3xl p-8 md:p-12 animate-fadeUp relative overflow-hidden">
                  <div className="flex items-start justify-between gap-8 mb-10">
                     <div className="text-left flex-1">
                        <h2 className="text-2xl font-black text-bright tracking-tight uppercase italic leading-none mb-2">Update Identity</h2>
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest opacity-80">{selectedStudent.name}</p>
                     </div>
                     <button
                        onClick={() => setShowEditStudentModal(false)}
                        className="w-11 h-11 rounded-2xl bg-alt border border-subtle flex items-center justify-center text-dim hover:text-primary transition-all shadow-sm shrink-0"
                     >
                        <X size={20} />
                     </button>
                  </div>
                  <form onSubmit={async (e) => {
                     e.preventDefault();
                     const fd = new FormData(e.target);
                     await updateStudent(selectedStudent._id, {
                        name: fd.get('name'),
                        email: fd.get('email'),
                        phone: fd.get('phone'),
                        studentClass: fd.get('studentClass')
                     });
                     setShowEditStudentModal(false);
                  }} className="space-y-8">
                     <div className="space-y-6">
                        <div>
                           <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-3 block">Full Nomenclature</label>
                           <input name="name" className="input-premium py-5 px-6 italic text-bright" defaultValue={selectedStudent.name} required />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                           <div>
                              <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-3 block">Email Address</label>
                              <input name="email" type="email" className="input-premium py-5 px-6 text-bright bg-alt/50" defaultValue={selectedStudent.email} required />
                           </div>
                           <div>
                              <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-3 block">Contact Vector</label>
                              <input name="phone" className="input-premium py-5 px-6 text-bright bg-alt/50" defaultValue={selectedStudent.phone} required />
                           </div>
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-3 block">Board / Class</label>
                           <input name="studentClass" className="input-premium py-5 px-6 text-bright italic bg-alt/50" defaultValue={selectedStudent.studentClass} />
                        </div>
                     </div>
                     <div className="flex gap-6 pt-6 border-t border-subtle">
                        <button type="button" onClick={() => setShowEditStudentModal(false)} className="flex-1 btn-premium btn-premium-secondary py-5 text-[10px] font-black">ABORT</button>
                        <button type="submit" className="flex-1 btn-premium btn-premium-primary py-5 text-[10px] font-black shadow-[0_12px_24px_rgba(37,99,235,0.25)]">DEPLOY UPDATE</button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* Reset Password Modal */}
         {showResetPassModal && selectedStudent && (
            <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 sm:p-8 bg-black/80 animate-fadeIn">
               <div className="w-full max-w-md modal-high-contrast rounded-3xl p-8 md:p-12 animate-fadeUp relative overflow-hidden">
                  <div className="flex items-start justify-between gap-8 mb-10">
                     <div className="text-left flex-1">
                        <h2 className="text-xl font-black text-bright tracking-tight uppercase italic leading-none mb-1">Access Override</h2>
                        <p className="text-[10px] text-danger font-black uppercase tracking-widest opacity-80">Security Protocol Alpha</p>
                     </div>
                     <button
                        onClick={() => setShowResetPassModal(false)}
                        className="w-11 h-11 rounded-2xl bg-alt border border-subtle flex items-center justify-center text-dim hover:text-danger transition-all shadow-sm shrink-0"
                     >
                        <X size={20} />
                     </button>
                  </div>
                  <div className="space-y-10">
                     <div>
                        <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-3 block text-center">New Master Identity Key</label>
                        <input 
                           id="resetPassInput" 
                           type="text" 
                           className="input-premium py-5 text-center text-bright font-black tracking-[0.3em] uppercase bg-alt/30" 
                           placeholder="G-8A9K2M" 
                        />
                     </div>
                     <div className="flex gap-6 pt-6 border-t border-subtle">
                        <button type="button" onClick={() => setShowResetPassModal(false)} className="flex-1 btn-premium btn-premium-secondary py-5 text-[10px] font-black">CANCEL</button>
                        <button 
                           onClick={async () => {
                              const pass = document.getElementById('resetPassInput').value;
                              if (!pass) return;
                              const success = await resetStudentPassword(selectedStudent._id, pass);
                              if (success) {
                                 setMessage({ text: 'Access token successfully overwritten', type: 'success' });
                              } else {
                                 setMessage({ text: 'Security override failed: System mismatch', type: 'error' });
                              }
                              setShowResetPassModal(false);
                              setTimeout(() => setMessage({ text: '', type: '' }), 4000);
                           }}
                           className="flex-1 btn-premium py-5 text-[10px] font-black bg-danger text-white hover:bg-red-600 transition-all shadow-[0_12px_24px_rgba(239,68,68,0.25)]"
                        >
                           OVERWRITE
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Add Topper Modal */}
         {showGalleryModal && (
            <div className="fixed inset-0 z-[10001] flex items-center justify-center p-6 sm:p-8 bg-black/60 backdrop-blur-md animate-fadeIn">
               <div className="w-full max-w-lg modal-high-contrast rounded-3xl p-10 md:p-12 animate-fadeUp relative border-subtle shadow-2xl overflow-hidden bg-grad-surface">
                  <div className="flex items-start justify-between gap-8 mb-10">
                     <div className="text-left flex-1">
                        <h2 className="text-3xl font-black text-bright tracking-tighter uppercase leading-none mb-2 italic">Archive Excellence</h2>
                        <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em] opacity-80">Scholar Data Input</p>
                     </div>
                     <button onClick={() => setShowGalleryModal(false)} className="w-11 h-11 rounded-2xl bg-alt border border-subtle flex items-center justify-center text-dim hover:text-primary transition-all shadow-sm shrink-0"><X size={20} /></button>
                  </div>
                  <form onSubmit={handleAddTopper} className="space-y-8">
                     <div className="space-y-6">
                        <div>
                           <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-3 block">Scholar Identity</label>
                           <input className="input-premium py-5 px-6 italic text-bright bg-alt/30" placeholder="FULL NAME" value={newTopper.name} onChange={e => setNewTopper({ ...newTopper, name: e.target.value })} required />
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                           <div>
                              <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-3 block">Exam Category</label>
                              <input className="input-premium py-5 px-6 text-bright bg-alt/30" placeholder="e.g. JEE 2026" value={newTopper.exam} onChange={e => setNewTopper({ ...newTopper, exam: e.target.value })} required />
                           </div>
                           <div>
                              <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-3 block">Score (%)</label>
                              <input className="input-premium py-5 px-6 text-bright bg-alt/30" placeholder="00.00" value={newTopper.marks} onChange={e => setNewTopper({ ...newTopper, marks: e.target.value })} required />
                           </div>
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-3 block">Portfolio Imagery</label>
                           <input type="file" className="input-premium py-4 px-6 text-[10px] uppercase font-black cursor-pointer bg-alt/30 file:mr-6 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-primary file:text-white file:cursor-pointer" onChange={e => setNewTopper({ ...newTopper, photo: e.target.files[0] })} required />
                        </div>
                     </div>
                     <div className="flex gap-6 pt-6 border-t border-subtle">
                        <button type="button" onClick={() => setShowGalleryModal(false)} className="flex-1 btn-premium btn-premium-secondary py-5 text-[10px] font-black">ABORT</button>
                        <button type="submit" disabled={isLoading} className="flex-1 btn-premium btn-premium-primary py-5 text-[10px] font-black shadow-[0_12px_24px_rgba(37,99,235,0.25)] disabled:opacity-50">ARCHIVE DATA</button>
                     </div>
                  </form>
               </div>
            </div>
         )}

         <style>{`
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
         `}</style>
      </div>
   );
};

export default TeacherDashboard;


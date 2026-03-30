import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCourse } from '../context/CourseContext';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, FileText, Play, Clock, Search, ExternalLink, Download, Folder, Filter, BookOpen } from 'lucide-react';
import { API_URL as BASE_URL } from '../config/api';
const API_BASE = BASE_URL.replace('/api', '');

const CourseViewer = () => {
  const { id } = useParams();
  const { subjects, courses } = useCourse();
  const { user } = useAuth();
  const subject = subjects.find(s => s._id === id);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChapter, setSelectedChapter] = useState(null);

  const isAssigned = user?.role === 'admin' || user?.assignedCourses?.includes(subject?.courseId);

  if (!subject || !isAssigned) return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 bg-main">
      <div className="w-24 h-24 bg-surface rounded-[32px] flex items-center justify-center text-5xl shadow-lg border border-subtle">🔒</div>
      <h2 className="text-3xl font-black text-bright uppercase tracking-widest italic">{!subject ? 'Course Not Found' : 'Not Authorized'}</h2>
      <Link to="/student" className="btn-premium btn-premium-primary rounded-2xl px-12 py-5 shadow-2xl">Return to Dashboard</Link>
    </div>
  );

  const getFilteredResources = (resources, chapter, search) => {
    if (!resources) return [];
    return resources.filter(r => 
       (r.chapter || 'GENERAL RESOURCES') === chapter &&
       (r.title.toLowerCase().includes(search.toLowerCase()))
    );
  };

  return (
    <div className="min-h-screen bg-main pb-32 animate-fadeIn transition-colors duration-500">
      {/* Dynamic Header */}
      <header className="header-premium sticky top-0 z-50 px-8 py-8 border-x-0 border-t-0 border-b-subtle backdrop-blur-3xl">
        <div className="container-premium mx-auto flex items-center justify-between">
           <div className="flex items-center gap-10">
              <Link to="/student" className="w-14 h-14 rounded-2xl bg-surface border border-subtle flex items-center justify-center text-dim hover:text-primary hover:bg-alt transition-all shadow-sm">
                <ChevronLeft size={28} />
              </Link>
              <div className="flex items-center gap-6">
                <span className="text-6xl p-2 rounded-2xl bg-surface shadow-md border border-subtle">{subject.icon}</span>
                <div>
                   <h1 className="text-5xl font-black text-bright tracking-widest uppercase italic">{subject.name}</h1>
                   <div className="flex items-center gap-4 mt-2">
                      <span className="badge-premium badge-primary">STUDENT RESOURCE</span>
                      <span className="text-[10px] font-black text-dim uppercase tracking-widest opacity-80">• {subject.category} • CLOUD SYNCED</span>
                   </div>
                </div>
              </div>
           </div>

           <div className="card-premium p-0 px-6 py-4 flex items-center gap-4 w-96 bg-surface border-subtle">
              <Search size={20} className="text-dim"/>
              <input 
                placeholder="Search resources..." 
                className="bg-transparent outline-none w-full font-bold text-sm text-bright"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
        </div>
      </header>
      <main className="container-premium mx-auto px-8 mt-12 animate-fadeUp">
         {/* Hierarchical Breadcrumb */}
         <div className="flex items-center gap-3 mb-10 py-3 px-5 bg-surface/50 rounded-2xl border border-subtle w-fit mx-auto md:mx-0 backdrop-blur-sm shadow-sm">
            <button 
               onClick={() => setSelectedChapter(null)}
               className={`text-[10px] font-black uppercase tracking-[0.15em] [word-spacing:0.15em] flex items-center gap-2 transition-all p-1.5 rounded-lg ${!selectedChapter ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-dim hover:text-bright'}`}
            >
               <BookOpen size={14}/> ALL CHAPTERS
            </button>
            {selectedChapter && (
               <>
                  <ChevronRight size={14} className="text-subtle"/>
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] [word-spacing:0.15em] bg-primary/10 text-primary flex items-center gap-2 p-1.5 rounded-lg border border-primary/20">
                     <Filter size={14}/> {selectedChapter}
                  </span>
               </>
            )}
         </div>

         {!selectedChapter ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
               {(() => {
                  const allResources = [...(subject.resources?.notes || []), ...(subject.resources?.videos || [])];
                  const chapters = Array.from(new Set(allResources.map(r => r.chapter || 'GENERAL RESOURCES'))).sort();
                  
                  if (chapters.length === 0) return <div className="col-span-full py-40 text-center text-dim font-black uppercase italic opacity-40">No academic folders established for this subject.</div>;
                  
                  return chapters.map((ch, i) => (
                     <div 
                        key={i} 
                        onClick={() => setSelectedChapter(ch)}
                        className="card-premium group cursor-pointer hover:border-primary/40 hover:-translate-y-2 transition-all p-10 flex items-center gap-8 relative overflow-hidden"
                     >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="w-20 h-20 rounded-3xl bg-surface border border-subtle flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-xl shadow-primary/5 relative z-10">
                           <Folder size={36}/>
                        </div>
                        <div className="flex-1 relative z-10">
                           <h4 className="text-2xl font-black text-bright uppercase tracking-tight leading-tight group-hover:text-primary transition-colors">{ch}</h4>
                           <p className="text-[10px] font-black text-dim uppercase tracking-widest mt-2">
                              {allResources.filter(r => (r.chapter || 'GENERAL RESOURCES') === ch).length} Master Assets
                           </p>
                        </div>
                        <ChevronRight size={24} className="text-dim group-hover:text-primary transition-colors relative z-10"/>
                     </div>
                  ));
               })()}
            </div>
         ) : (
            <div className="space-y-12 animate-fadeUp">
               {/* Chapter Resources Header */}
               <div className="flex items-center justify-between border-b border-subtle pb-8">
                  <h3 className="text-4xl font-black text-bright uppercase tracking-tighter italic">{selectedChapter} Assets</h3>
                  <button onClick={() => setSelectedChapter(null)} className="btn-premium btn-premium-secondary px-6 py-3 flex items-center gap-2 text-[10px]">
                     <ChevronLeft size={16}/> BACK TO CHAPTERS
                  </button>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Notes in Chapter */}
                  {getFilteredResources(subject.resources?.notes, selectedChapter, searchTerm).map((note, i) => (
                     <div key={`n-${i}`} className="card-premium group hover:border-primary/30 transition-all p-8 flex items-center gap-8 bg-surface/40">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner"><FileText size={28}/></div>
                        <div className="flex-1 min-w-0">
                           <h4 className="text-xl font-black text-bright uppercase tracking-tight truncate">{note.title}</h4>
                           <p className="text-[10px] font-black text-dim uppercase tracking-widest mt-1 opacity-70">Study Material • Secure PDF</p>
                        </div>
                        <div className="flex gap-3">
                           <a href={`${API_BASE}${note.fileUrl}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-alt flex items-center justify-center text-dim hover:text-primary transition-all border border-subtle">
                              <ExternalLink size={20}/>
                           </a>
                           <a href={`${API_BASE}${note.fileUrl}`} download className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all border border-primary/20">
                              <Download size={20}/>
                           </a>
                        </div>
                     </div>
                  ))}

                  {/* Videos in Chapter */}
                  {getFilteredResources(subject.resources?.videos, selectedChapter, searchTerm).map((vid, i) => (
                     <div key={`v-${i}`} className="card-premium group hover:border-success/30 transition-all p-8 flex items-center gap-8 bg-surface/40">
                        <div className="w-16 h-16 rounded-2xl bg-success/10 text-success flex items-center justify-center shadow-inner"><Play size={28}/></div>
                        <div className="flex-1 min-w-0">
                           <h4 className="text-xl font-black text-bright uppercase tracking-tight truncate">{vid.title}</h4>
                           <p className="text-[10px] font-black text-dim uppercase tracking-widest mt-1 opacity-70">Masterclass • {vid.type}</p>
                        </div>
                        <a href={vid.url} target="_blank" rel="noreferrer" className="btn-premium bg-success text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border-none hover:scale-105 transition-transform flex items-center gap-2">
                           WATCH <Play size={14}/>
                        </a>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </main>

      <style>{`
        .delay-100 { animation-delay: 0.1s; }
      `}</style>
    </div>
  );
};

export default CourseViewer;

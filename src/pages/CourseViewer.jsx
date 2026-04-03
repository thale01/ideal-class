import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCourse } from '../context/CourseContext';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, FileText, Play, Clock, Search, ExternalLink, Download, Folder, Filter, BookOpen } from 'lucide-react';
import { API_URL as BASE_URL } from '../config/api';
const API_BASE = BASE_URL.replace('/api', '');

const CourseViewer = () => {
  const { id } = useParams();
  const { subjects, courses } = useCourse();
  const { user } = useAuth();
  const subject = subjects.find(s => s._id === id);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

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

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : url;
  };

  return (
    <div className="min-h-screen bg-main pb-32 animate-fadeIn transition-colors duration-500">
      
      {selectedVideo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-fadeIn" onClick={() => setSelectedVideo(null)}></div>
           <div className="relative w-full max-w-5xl bg-surface rounded-[40px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] animate-fadeUp border border-white/5">
              <div className="video-container">
                 <iframe
                    src={getYouTubeEmbedUrl(selectedVideo.url)}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                 ></iframe>
              </div>
              <div className="p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-surface">
                 <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-bright uppercase tracking-tighter italic leading-none">{selectedVideo.title}</h3>
                    <p className="text-[10px] font-900 text-dim uppercase tracking-[0.3em] mt-4 flex items-center gap-2">
                       <Play size={12} className="text-primary"/> {selectedVideo.chapter} • PERSISTENT ACADEMIC STREAM
                    </p>
                 </div>
                 <button 
                    onClick={() => setSelectedVideo(null)}
                    className="btn-premium bg-danger/10 text-danger border border-danger/20 px-10 py-5 font-black uppercase tracking-widest hover:bg-danger hover:text-white transition-all shadow-xl"
                 >
                    CLOSE THEATER
                 </button>
              </div>
           </div>
        </div>
      )}

      <header className="header-premium sticky top-0 z-50 transition-all duration-300 border-b border-subtle">
        <div className="container-premium py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
           <div className="flex items-center gap-4 sm:gap-8 w-full md:w-auto">
              <Link to="/student" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-surface border border-subtle flex-shrink-0 flex items-center justify-center text-dim hover:text-primary transition-all shadow-sm">
                <ChevronLeft size={20} />
              </Link>
              <div className="flex items-center gap-3 sm:gap-6 overflow-hidden">
                <span className="text-3xl sm:text-5xl p-1.5 sm:p-2 rounded-xl bg-surface shadow-md border border-subtle">{subject.icon}</span>
                <div className="min-w-0">
                   <h1 className="text-xl sm:text-4xl font-black text-bright tracking-tight uppercase italic truncate">{subject.name}</h1>
                   <p className="text-[8px] sm:text-[10px] font-black text-dim uppercase tracking-widest opacity-80 mt-1 truncate">Academic Vault • {subject.category}</p>
                </div>
              </div>
           </div>

           <div className="w-full md:w-80 bg-surface border border-subtle rounded-xl flex items-center p-0 px-4 py-2.5 shadow-sm">
              <Search size={16} className="text-dim flex-shrink-0 mr-3"/>
              <input 
                placeholder="Search resources..." 
                className="bg-transparent outline-none w-full font-bold text-xs sm:text-sm text-bright placeholder:text-dim/50"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
        </div>
      </header>

      <main className="container-premium mt-8 sm:mt-12 animate-fadeUp">
         <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-8 sm:mb-10 py-2.5 sm:py-3 px-4 sm:px-5 bg-surface/50 rounded-2xl border border-subtle w-full sm:w-fit backdrop-blur-sm shadow-sm">
            <button 
               onClick={() => setSelectedChapter(null)}
               className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all p-1.5 sm:p-2 rounded-lg ${!selectedChapter ? 'bg-primary text-white shadow-md' : 'text-dim hover:text-bright'}`}
            >
               <BookOpen size={14}/> ALL MODULES
            </button>
            {selectedChapter && (
               <>
                  <ChevronRight size={14} className="text-subtle hidden sm:block"/>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary flex items-center gap-2 p-1.5 sm:p-2 rounded-lg border border-primary/20">
                     <Filter size={14}/> {selectedChapter}
                  </span>
               </>
            )}
         </div>

         {!selectedChapter ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
               {(() => {
                  const allResources = [...(subject.resources?.notes || []), ...(subject.resources?.videos || [])];
                  const chapters = Array.from(new Set(allResources.map(r => r.chapter || 'GENERAL RESOURCES'))).sort();
                  
                  if (chapters.length === 0) return <div className="col-span-full py-32 text-center text-dim font-black uppercase italic opacity-40">No records established.</div>;
                  
                  return chapters.map((ch, i) => (
                     <div 
                        key={i} 
                        onClick={() => setSelectedChapter(ch)}
                        className="card-premium group cursor-pointer hover:border-primary/40 hover:-translate-y-1 transition-all p-8 flex items-center gap-6 relative overflow-hidden"
                     >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                        <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-2xl bg-surface border border-subtle flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                           <Folder size={28}/>
                        </div>
                        <div className="flex-1 relative z-10 min-w-0">
                           <h4 className="text-lg sm:text-xl font-black text-bright uppercase tracking-tight leading-tight group-hover:text-primary transition-colors truncate">{ch}</h4>
                           <p className="text-[10px] font-black text-dim uppercase tracking-widest mt-1">
                              {allResources.filter(r => (r.chapter || 'GENERAL RESOURCES') === ch).length} Assets
                           </p>
                        </div>
                        <ChevronRight size={18} className="text-dim group-hover:text-primary transition-colors"/>
                     </div>
                  ));
               })()}
            </div>
         ) : (
            <div className="space-y-12 animate-fadeUp">
               <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-subtle pb-6 sm:pb-8 gap-4">
                  <h3 className="text-2xl sm:text-4xl font-black text-bright uppercase tracking-tight italic">{selectedChapter} Assets</h3>
                  <button onClick={() => setSelectedChapter(null)} className="btn-premium btn-premium-secondary px-4 sm:px-6 py-2 sm:py-3 flex items-center gap-2 text-[9px] sm:text-[10px]">
                     <ChevronLeft size={16}/> BACK TO MODULES
                  </button>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                  {getFilteredResources(subject.resources?.notes, selectedChapter, searchTerm).map((note, i) => (
                     <div key={`n-${i}`} className="card-premium group hover:border-primary/30 transition-all p-6 sm:p-8 flex items-center gap-6 sm:gap-8 bg-surface/40">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner"><FileText size={24}/></div>
                        <div className="flex-1 min-w-0">
                           <h4 className="text-lg sm:text-xl font-black text-bright uppercase tracking-tight truncate">{note.title}</h4>
                           <p className="text-[9px] sm:text-[10px] font-black text-dim uppercase tracking-widest mt-1 opacity-70">Study Material • Secure PDF</p>
                        </div>
                        <div className="flex gap-2 sm:gap-3">
                           <a href={`${API_BASE}${note.fileUrl}`} target="_blank" rel="noreferrer" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-alt flex items-center justify-center text-dim hover:text-primary transition-all border border-subtle">
                              <ExternalLink size={18}/>
                           </a>
                           <a href={`${API_BASE}${note.fileUrl}`} download className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all border border-primary/20">
                              <Download size={18}/>
                           </a>
                        </div>
                     </div>
                  ))}

                  {getFilteredResources(subject.resources?.videos, selectedChapter, searchTerm).map((vid, i) => (
                     <div key={`v-${i}`} className="card-premium group hover:border-success/30 transition-all p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 bg-surface/40 cursor-pointer" onClick={() => setSelectedVideo(vid)}>
                        <div className="w-full sm:w-auto flex items-center gap-6 flex-1">
                           <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 rounded-2xl bg-success/10 text-success flex items-center justify-center shadow-inner"><Play size={24}/></div>
                           <div className="flex-1 min-w-0">
                              <h4 className="text-lg sm:text-xl font-black text-bright uppercase tracking-tight truncate">{vid.title}</h4>
                              <p className="text-[9px] sm:text-[10px] font-black text-dim uppercase tracking-widest mt-1 opacity-70">Masterclass • {vid.type}</p>
                           </div>
                        </div>
                        <button className="w-full sm:w-auto btn-premium bg-success text-white px-8 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest border-none hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-success/20">
                           WATCH <Play size={14}/>
                        </button>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </main>
    </div>
  );
};

export default CourseViewer;

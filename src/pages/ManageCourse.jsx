import React, { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useCourse } from '../context/CourseContext';
import { ChevronLeft, Search, FileText, Video } from 'lucide-react';
import UploadPDF from '../components/UploadPDF';
import VideoUpload from '../components/VideoUpload';
import ContentCard from '../components/ContentCard';

const ManageCourse = () => {
  const { id } = useParams();
  const { subjects, addResource, deleteResource, updateResource } = useCourse();
  const subject = subjects.find(s => s._id === id);

  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'notes'); 
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddPDF = async (data) => {
    await addResource(id, {
      type: 'note',
      ...data
    });
  };

  const handleAddVideo = async (data) => {
    await addResource(id, {
      type: 'video',
      ...data
    });
  };

  const filteredNotes = subject?.resources?.notes?.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (n.chapter || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredVideos = subject?.resources?.videos?.filter(v => 
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (v.chapter || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (!subject) return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 bg-main text-main">
      <div className="w-24 h-24 bg-surface rounded-2xl flex items-center justify-center text-5xl shadow-lg border border-subtle">🔍</div>
      <h2 className="text-2xl font-bold text-bright tracking-tight uppercase">Subject Data Missing</h2>
      <Link to="/admin" className="btn-premium btn-premium-primary rounded-xl px-10 py-4 shadow-xl">Return to Dashboard</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-main pb-32 animate-fadeIn">
      {/* Premium Header */}
      <header className="header-premium sticky top-0 z-50 transition-all duration-300">
        <div className="container-premium py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-8 w-full md:w-auto">
            <Link to="/admin" className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-surface border border-subtle flex-shrink-0 flex items-center justify-center text-dim hover:text-bright hover:bg-blue-500/10 transition-all transition-all">
              <ChevronLeft size={20} />
            </Link>
            <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
              <span className="text-2xl sm:text-4xl rounded-xl p-1.5 sm:p-2 bg-surface border border-subtle">{subject.icon}</span>
              <h1 className="text-xl sm:text-3xl font-bold text-bright tracking-tight uppercase truncate">{subject.name}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
             <div className="px-4 py-2 sm:px-6 sm:py-3 flex items-center gap-3 flex-1 md:w-80 bg-surface border border-subtle rounded-xl sm:rounded-2xl shadow-sm">
                <Search size={16} className="text-dim flex-shrink-0"/>
                <input 
                  placeholder="Filter..." 
                  className="bg-transparent border-none outline-none text-xs sm:text-sm font-semibold w-full text-bright placeholder:text-dim/50"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
          </div>
        </div>
      </header>

      <main className="container-premium mt-8 sm:mt-12 flex flex-col lg:flex-row gap-8 sm:gap-12 pb-32">
        
        {/* Resource Creation Panel */}
        <div className="w-full lg:w-1/3 lg:sticky lg:top-36 h-fit animate-slideUp">
          <div className="flex gap-2 p-1 bg-surface border border-subtle shadow-md rounded-2xl mb-6">
             <button 
               onClick={() => setActiveTab('notes')}
               className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all
                 ${activeTab === 'notes' ? 'bg-primary text-white shadow-md' : 'text-dim hover:text-bright'}
               `}
             >
               <FileText size={16}/> Study Notes
             </button>
             <button 
               onClick={() => setActiveTab('videos')}
               className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all
                 ${activeTab === 'videos' ? 'bg-primary text-white shadow-md' : 'text-dim hover:text-bright'}
               `}
             >
               <Video size={16}/> Lectures
             </button>
          </div>

          {activeTab === 'notes' ? (
            <UploadPDF onSubmit={handleAddPDF} subjectIcon={subject.icon} subjectName={subject.name} />
          ) : (
            <VideoUpload onSubmit={handleAddVideo} subjectIcon={subject.icon} subjectName={subject.name} />
          )}
        </div>

        {/* Resources Grid Area */}
        <div className="flex-1 space-y-12 animate-slideUp" style={{ animationDelay: '0.1s' }}>
          
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-md shadow-primary/5"><FileText size={24}/></div>
              <div>
                 <h3 className="text-xl font-bold text-bright tracking-tight">Study Materials</h3>
                 <p className="text-dim text-[10px] font-semibold tracking-widest mt-0.5 uppercase">PDF Documents Registry ({subject.resources?.notes?.length || 0})</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {filteredNotes.length === 0 && <div className="col-span-full card-premium text-center py-24 bg-surface border-dashed border-subtle text-dim font-bold uppercase tracking-widest opacity-50">Empty Archive • No PDF published</div>}
              {filteredNotes.map((n, i) => (
                <ContentCard key={n._id || i} {...n} type="note" date={n.uploadDate} onDelete={() => deleteResource(id, n._id, 'note')} onUpdate={(data) => updateResource(id, n._id, 'note', data)} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-success/10 text-success flex items-center justify-center border border-success/20 shadow-sm"><Video size={20}/></div>
              <div>
                 <h3 className="text-lg sm:text-xl font-bold text-bright tracking-tight">Lecture Videos</h3>
                 <p className="text-dim text-[10px] font-semibold tracking-widest mt-0.5 uppercase">Masterclass Video ({subject.resources?.videos?.length || 0})</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:gap-6">
              {filteredVideos.length === 0 && <div className="card-premium text-center py-24 bg-surface border-dashed border-subtle text-dim font-bold uppercase tracking-widest opacity-50">Secure Vault Empty • No video published</div>}
              {filteredVideos.map((v, i) => (
                <ContentCard key={v._id || i} {...v} type="video" date={v.uploadDate} onDelete={() => deleteResource(id, v._id, 'video')} onUpdate={(data) => updateResource(id, v._id, 'video', data)} />
              ))}
            </div>
          </section>

        </div>
      </main>

      <style>{`
        .delay-100 { animation-delay: 0.1s; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default ManageCourse;

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCourse } from '../context/CourseContext';
import { ChevronLeft, Search, FileText, Video } from 'lucide-react';
import UploadPDF from '../components/UploadPDF';
import VideoUpload from '../components/VideoUpload';
import ContentCard from '../components/ContentCard';

const ManageCourse = () => {
  const { id } = useParams();
  const { subjects, addResource, deleteResource, updateResource } = useCourse();
  const subject = subjects.find(s => s._id === id);

  const [activeTab, setActiveTab] = useState('notes'); 
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
      <div className="w-24 h-24 bg-surface rounded-[32px] flex items-center justify-center text-5xl shadow-lg border border-subtle">🔍</div>
      <h2 className="text-3xl font-black text-gradient uppercase tracking-widest">Subject Data Missing</h2>
      <Link to="/admin" className="btn-premium btn-premium-primary rounded-2xl px-12 py-5 shadow-2xl">Return to Control Center</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-main pb-32 animate-fadeIn">
      {/* Premium Header */}
      <header className="glass-panel sticky top-0 z-50 px-8 py-6 rounded-none border-x-0 border-t-0 border-b-white/5 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/admin" className="w-12 h-12 rounded-2xl bg-surface border border-subtle flex items-center justify-center text-dim hover:text-bright hover:border-blue-500/50 hover:bg-blue-500/10 transition-all">
              <ChevronLeft size={24} />
            </Link>
            <div>
              <div className="flex items-center gap-4">
                <span className="text-4xl shadow-glow rounded-xl p-2 bg-surface border border-subtle shadow-sm">{subject.icon}</span>
                <h1 className="text-4xl font-black text-bright tracking-tight uppercase italic">{subject.name}</h1>
              </div>
              <div className="flex items-center gap-3 mt-2">
                 <span className="badge badge-purple">{subject.category}</span>
                 <span className="text-dim text-[10px] font-black uppercase tracking-[0.2em] [word-spacing:0.2em]">• Total Assets: {subject.resources?.notes?.length + subject.resources?.videos?.length}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="glass-panel px-6 py-3 flex items-center gap-3 w-80 bg-surface border border-subtle shadow-sm border-subtle shadow-inner">
                <Search size={18} className="text-dim"/>
                <input 
                  placeholder="Filter resources..." 
                  className="bg-transparent border-none outline-none text-sm font-bold w-full text-bright placeholder:text-bright/20"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-8 mt-12 grid grid-cols-12 gap-responsive">
        
        {/* Resource Creation Panel */}
        <div className="col-span-4 sticky top-36 h-fit animate-slideUp">
          <div className="flex gap-2 p-1.5 bg-surface border border-subtle shadow-lg rounded-3xl mb-8 border border-subtle shadow-2xl">
            <button 
              onClick={() => setActiveTab('notes')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all
                ${activeTab === 'notes' ? 'bg-primary text-white shadow-xl translate-y-[-2px]' : 'text-dim hover:text-bright'}
              `}
            >
              <FileText size={18}/> Study Notes
            </button>
            <button 
              onClick={() => setActiveTab('videos')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all
                ${activeTab === 'videos' ? 'bg-primary text-white shadow-xl translate-y-[-2px]' : 'text-dim hover:text-bright'}
              `}
            >
              <Video size={18}/> Lectures
            </button>
          </div>

          {activeTab === 'notes' ? (
            <UploadPDF onSubmit={handleAddPDF} subjectIcon={subject.icon} subjectName={subject.name} />
          ) : (
            <VideoUpload onSubmit={handleAddVideo} subjectIcon={subject.icon} subjectName={subject.name} />
          )}
        </div>

        {/* Resources Grid Area */}
        <div className="col-span-8 space-y-16 pb-20 animate-slideUp" style={{ animationDelay: '0.1s' }}>
          
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-[20px] bg-purple-500/10 text-purple-400 flex flex-center border border-purple-500/20 shadow-lg shadow-purple-500/10"><FileText size={28}/></div>
              <div>
                 <h3 className="text-2xl font-black text-bright uppercase italic tracking-widest">Library Access</h3>
                 <p className="text-dim text-[10px] font-black tracking-[0.3em] mt-1 uppercase">PDF&nbsp;&nbsp;&nbsp;Documents&nbsp;&nbsp;&nbsp;Storage ({subject.resources?.notes?.length || 0})</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {filteredNotes.length === 0 && <div className="col-span-2 card-premium text-center py-24 bg-surface shadow-md border-subtle text-dim font-black italic tracking-widest opacity-40">No library assets found.</div>}
              {filteredNotes.map((n, i) => (
                <ContentCard key={n._id || i} {...n} type="note" date={n.uploadDate} onDelete={() => deleteResource(id, n._id, 'note')} onUpdate={(data) => updateResource(id, n._id, 'note', data)} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 rounded-[20px] bg-blue-500/10 text-blue-400 flex flex-center border border-blue-500/20 shadow-lg shadow-blue-500/10"><Video size={28}/></div>
              <div>
                 <h3 className="text-2xl font-black text-bright uppercase italic tracking-widest">Digital Vault</h3>
                 <p className="text-dim text-[10px] font-black tracking-[0.3em] mt-1 uppercase">Video&nbsp;&nbsp;&nbsp;Masterclass ({subject.resources?.videos?.length || 0})</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {filteredVideos.length === 0 && <div className="card-premium text-center py-24 bg-surface shadow-md border-subtle text-dim font-black italic tracking-widest opacity-40">No lecture videos published.</div>}
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

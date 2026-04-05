import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourse } from '../../context/CourseContext';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  FileText, 
  Video, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  Youtube,
  Cloud,
  FileDigit,
  Layout,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const SubjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { subjects, addResource, deleteResource } = useCourse();
  const subject = subjects.find(s => s._id === id);

  const [activeTab, setActiveTab] = useState('notes');
  const [isLoading, setIsLoading] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    chapter: 'General',
    type: 'note',
    file: null,
    url: '',
    videoType: 'youtube'
  });

  if (!subject) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-main gap-6 animate-fadeIn">
        <div className="w-20 h-20 rounded-full bg-alt flex items-center justify-center text-primary-accent border border-subtle mb-4">
           <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-black text-primary uppercase tracking-tighter italic">Entity Not Located</h2>
        <button onClick={() => navigate('/admin')} className="btn-premium btn-premium-primary px-8 py-4">Return to Authority Hub</button>
      </div>
    );
  }

  const handleAddResource = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const resourceData = {
        title: newResource.title,
        chapter: newResource.chapter,
        type: newResource.type,
      };

      if (newResource.type === 'note') {
        resourceData.files = newResource.file ? [newResource.file] : [];
      } else {
        if (newResource.videoType === 'upload') {
          resourceData.files = newResource.file ? [newResource.file] : [];
        } else {
          resourceData.url = newResource.url;
          resourceData.videoType = newResource.videoType;
        }
      }

      await addResource(id, resourceData);
      setNewResource({ title: '', chapter: 'General', type: activeTab === 'notes' ? 'note' : 'video', file: null, url: '', videoType: 'youtube' });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const notes = subject.resources?.notes || [];
  const videos = subject.resources?.videos || [];

  return (
    <AdminLayout 
      title={subject.name} 
      hideSidebar={true}
      headerActions={
        <button 
          onClick={() => navigate('/admin')}
          className="flex items-center gap-3 px-6 py-3 bg-alt hover:bg-white border border-transparent hover:border-subtle rounded-xl text-primary font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 group shadow-sm"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Hub
        </button>
      }
    >
      <div className="space-y-10">
         {/* Entity Overview */}
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="flex items-center gap-8">
               <div className="w-24 h-24 rounded-[32px] bg-white border border-subtle flex items-center justify-center text-5xl shadow-xl shadow-primary/5 transition-transform hover:scale-105 duration-500">
                  {subject.icon}
               </div>
               <div>
                  <h1 className="text-4xl sm:text-6xl font-black text-primary uppercase tracking-tighter italic leading-none mb-4">{subject.name}</h1>
                  <div className="flex items-center gap-3">
                     <span className="badge-premium badge-primary px-4 py-1.5 font-black text-[10px] uppercase tracking-widest">{subject.category} PROTOCOL</span>
                     <span className="w-1.5 h-1.5 rounded-full bg-subtle"></span>
                     <p className="text-[11px] font-black text-dim uppercase tracking-widest opacity-60">Master Resource Registry</p>
                  </div>
               </div>
            </div>

            <div className="flex bg-alt/50 p-1.5 rounded-2xl border border-subtle backdrop-blur-md">
               <button 
                  onClick={() => setActiveTab('notes')}
                  className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'notes' ? 'bg-primary text-white shadow-xl italic' : 'text-dim hover:text-primary'}`}
               >
                  <FileText size={16} className="inline mr-2" /> Study Assets
               </button>
               <button 
                  onClick={() => setActiveTab('videos')}
                  className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'videos' ? 'bg-primary text-white shadow-xl italic' : 'text-dim hover:text-primary'}`}
               >
                  <Video size={16} className="inline mr-2" /> Lecture Vault
               </button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Repository Grid */}
            <div className="lg:col-span-8 space-y-8">
               {activeTab === 'notes' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {notes.length === 0 && (
                        <div className="col-span-full py-24 text-center border-2 border-dashed border-subtle rounded-[40px] bg-alt/30 group">
                           <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-6 shadow-sm border border-subtle group-hover:scale-110 transition-transform">
                              <FileText size={32} className="text-slate-200" />
                           </div>
                           <h4 className="text-xl font-black text-primary uppercase tracking-tighter mb-2 italic">Archive Empty</h4>
                           <p className="text-[10px] font-black text-dim uppercase tracking-widest opacity-40">Zero documentation protocols initialized</p>
                        </div>
                     )}
                     {notes.map((note) => (
                        <div key={note._id} className="card-premium group hover:border-primary-accent/30 p-8 flex flex-col justify-between h-[200px] relative overflow-hidden transition-all duration-500 hover:-translate-y-1">
                           <div className="absolute top-0 right-0 w-24 h-24 bg-alt/50 rounded-bl-[48px] -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                           
                           <div className="flex items-start justify-between relative z-10">
                              <div className="w-14 h-14 bg-alt/50 border border-subtle rounded-2xl flex items-center justify-center text-primary group-hover:bg-white transition-all">
                                 <FileDigit size={28} />
                              </div>
                              <div className="flex items-center gap-1.5 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                 <button className="w-10 h-10 rounded-xl bg-alt hover:bg-white text-primary border border-transparent hover:border-subtle flex items-center justify-center transition-all"><Eye size={18} /></button>
                                 <button className="w-10 h-10 rounded-xl bg-alt hover:bg-white text-primary border border-transparent hover:border-subtle flex items-center justify-center transition-all"><Download size={18} /></button>
                                 <button onClick={() => deleteResource(id, note._id, 'note')} className="w-10 h-10 rounded-xl bg-danger/5 hover:bg-danger text-danger hover:text-white flex items-center justify-center transition-all"><Trash2 size={18} /></button>
                              </div>
                           </div>
                           
                           <div className="relative z-10">
                              <h4 className="text-lg font-black text-primary uppercase tracking-tight italic mb-1">{note.title}</h4>
                              <p className="text-[9px] font-black text-dim uppercase tracking-widest opacity-60 italic">{note.chapter} • SYNCED {new Date(note.uploadDate).toLocaleDateString()}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {videos.length === 0 && (
                        <div className="col-span-full py-24 text-center border-2 border-dashed border-subtle rounded-[40px] bg-alt/30 group">
                           <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-6 shadow-sm border border-subtle group-hover:scale-110 transition-transform">
                              <Video size={32} className="text-slate-200" />
                           </div>
                           <h4 className="text-xl font-black text-primary uppercase tracking-tighter mb-2 italic">Video Vault Cleared</h4>
                           <p className="text-[10px] font-black text-dim uppercase tracking-widest opacity-40">Zero visual transmissions protocolled</p>
                        </div>
                     )}
                     {videos.map((video) => (
                        <div key={video._id} className="card-premium p-0 overflow-hidden group border-slate-100 shadow-xl hover:border-primary-accent/40 transition-all duration-500 hover:-translate-y-2">
                           <div className="aspect-video bg-[#0a1120] relative flex items-center justify-center">
                              {video.url?.includes('youtube') ? <Youtube size={64} className="text-danger absolute z-10 transition-transform group-hover:scale-110" /> : <Video size={64} className="text-white/20 absolute z-10" />}
                              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center z-20 backdrop-blur-sm grayscale group-hover:grayscale-0">
                                 <button className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:scale-110 transition-transform">
                                    <Eye size={24} />
                                 </button>
                              </div>
                           </div>
                           <div className="p-8 bg-white border-t border-subtle">
                              <div className="flex items-center justify-between gap-4">
                                 <div>
                                    <h4 className="text-sm font-black text-primary uppercase tracking-tight italic mb-1">{video.title}</h4>
                                    <p className="text-[9px] font-black text-dim uppercase tracking-[0.2em]">{video.chapter}</p>
                                 </div>
                                 <button onClick={() => deleteResource(id, video._id, 'video')} className="w-10 h-10 rounded-xl bg-danger/5 hover:bg-danger text-danger hover:text-white flex items-center justify-center transition-all">
                                    <Trash2 size={16} />
                                 </button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>

            {/* Admin Protocol Controls */}
            <div className="lg:col-span-4 space-y-8">
               <div className="card-premium border-slate-100 p-10 bg-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-accent/5 rounded-bl-[64px] -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-1000"></div>
                  
                  <div className="flex items-center gap-4 mb-10 relative z-10">
                     <div className="w-14 h-14 rounded-2xl bg-[#0a1120] flex items-center justify-center text-white shadow-xl shadow-primary/20">
                        <Plus size={24} />
                     </div>
                     <div>
                        <h3 className="text-xl font-black text-primary uppercase tracking-tighter italic">Establish Content</h3>
                        <p className="text-[9px] font-black text-dim uppercase tracking-widest opacity-60">Authorize new {activeTab === 'notes' ? 'document' : 'media'} protocol</p>
                     </div>
                  </div>

                  <form onSubmit={handleAddResource} className="space-y-6 relative z-10">
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-dim uppercase tracking-widest ml-1">Protocol Nomenclature</label>
                       <input 
                         className="input-premium py-4" 
                         placeholder="e.g. ADVANCED CALCULUS" 
                         value={newResource.title}
                         onChange={e => setNewResource({...newResource, title: e.target.value})}
                         required
                       />
                    </div>
                    
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-dim uppercase tracking-widest ml-1">Strategic Chapter</label>
                       <input 
                         className="input-premium py-4" 
                         placeholder="e.g. Chapter 4" 
                         value={newResource.chapter}
                         onChange={e => setNewResource({...newResource, chapter: e.target.value})}
                       />
                    </div>

                    {activeTab === 'notes' ? (
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-dim uppercase tracking-widest ml-1">Material Integrity</label>
                          <select 
                            className="input-premium h-14"
                            value={newResource.noteType}
                            onChange={e => setNewResource({...newResource, noteType: e.target.value, type: 'note'})}
                          >
                             <option value="pdf">PDF Document Protocol</option>
                             <option value="image">Diagram / Visual Array</option>
                             <option value="link">External Reference Link</option>
                          </select>
                       </div>
                    ) : (
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-dim uppercase tracking-widest ml-1">Transmission Vector</label>
                          <select 
                            className="input-premium h-14"
                            value={newResource.videoType}
                            onChange={e => setNewResource({...newResource, videoType: e.target.value, type: 'video'})}
                          >
                             <option value="youtube">YouTube Broadcast</option>
                             <option value="drive">Cloud Storage (Drive)</option>
                             <option value="upload">Local Repository Upload</option>
                          </select>
                       </div>
                    )}

                    {((activeTab === 'notes' && newResource.noteType !== 'link') || (activeTab === 'videos' && newResource.videoType === 'upload')) ? (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-dim uppercase tracking-widest ml-1">Repository Registry</label>
                        <div className="border-2 border-dashed border-subtle rounded-2xl p-8 text-center hover:border-primary-accent transition-all cursor-pointer relative bg-alt group/upload">
                          <Plus size={32} className="mx-auto text-slate-300 mb-3 group-hover/upload:text-primary-accent group-hover/upload:scale-110 transition-all" />
                          <span className="text-[10px] font-black text-dim uppercase tracking-widest block truncate px-4">{newResource.file ? newResource.file.name : 'Ingest Protocol File'}</span>
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setNewResource({...newResource, file: e.target.files[0]})} />
                        </div>
                      </div>
                    ) : (
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-dim uppercase tracking-widest ml-1">Resource Vector (URL)</label>
                          <input 
                             className="input-premium py-4"
                             placeholder={newResource.videoType === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://...'} 
                             value={newResource.url}
                             onChange={e => setNewResource({...newResource, url: e.target.value})}
                             required
                          />
                       </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="btn-premium btn-premium-primary w-full py-5 text-[10px] font-black tracking-[0.2em] uppercase shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                    >
                      {isLoading ? 'TRANSMITTING...' : (
                         <>
                            <Plus size={18} /> Establish Resource
                         </>
                      )}
                    </button>
                  </form>
               </div>

               <div className="card-premium bg-[#0a1120] border-none p-10 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[64px] -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-1000"></div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-primary-accent">
                       <Cloud size={20} />
                    </div>
                    <h4 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Registry Health</h4>
                  </div>
                  <div className="space-y-6">
                     <div className="flex justify-between items-end border-b border-white/5 pb-4">
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div>
                           <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Network Authority</span>
                        </div>
                        <span className="text-[10px] font-black text-success uppercase italic">Synchronized</span>
                     </div>
                     <div className="flex justify-between items-end border-b border-white/5 pb-4">
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Transmission Latency</span>
                        <span className="text-[10px] font-black text-white italic">4.2ms verified</span>
                     </div>
                     <div className="flex justify-between items-end">
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Resource Quota</span>
                        <span className="text-[10px] font-black text-primary-accent italic">Elite Unmetered</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </AdminLayout>
  );
};

export default SubjectPage;

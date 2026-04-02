import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourse } from '../../context/CourseContext';
import Sidebar from '../../components/admin/Sidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { Card, Button, Input, Select } from '../../components/admin/AdminComponents';
import { 
  FileText, 
  Video, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  ExternalLink,
  Youtube,
  Cloud,
  FileDigit
} from 'lucide-react';

const SubjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { subjects, addResource, deleteResource } = useCourse();
  const subject = subjects.find(s => s._id === id);

  const [activeTab, setActiveTab] = useState('notes');
  const [showAddResource, setShowAddResource] = useState(false);
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
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 gap-4">
        <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest">Protocol Entity Not Found</h2>
        <Button onClick={() => navigate('/admin')}>Return to Hub</Button>
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
      setShowAddResource(false);
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
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <AdminHeader 
          title={subject.name} 
          actions={
            <Button 
              variant="secondary" 
              onClick={() => navigate('/admin')}
              className="px-4"
              icon={ChevronLeft}
            >
              Back to Hub
            </Button>
          }
        />

        <div className="p-8 max-w-7xl mx-auto w-full">
          {/* Breadcrumbs / Navigation Detail */}
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-4xl shadow-sm">
                {subject.icon}
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic leading-none">{subject.name}</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{subject.category} • MASTER REPOSITORY</p>
              </div>
            </div>
            
            <div className="flex p-1 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <button 
                onClick={() => setActiveTab('notes')}
                className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'notes' ? 'bg-black text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
              >
                <FileText size={16} /> Study Notes
              </button>
              <button 
                onClick={() => setActiveTab('videos')}
                className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'videos' ? 'bg-black text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}
              >
                <Video size={16} /> Lectures
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-8">
              {activeTab === 'notes' ? (
                <div className="space-y-4">
                  {notes.length === 0 && (
                    <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
                      <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Archive Empty • No notes published</p>
                    </div>
                  )}
                  {notes.map((note) => (
                    <Card key={note._id} className="flex flex-row items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-900">
                          <FileDigit size={24} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{note.title}</h4>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{note.chapter} • {new Date(note.uploadDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <Button variant="ghost" className="p-2 h-10 w-10 min-w-0" icon={Eye} />
                        <Button variant="ghost" className="p-2 h-10 w-10 min-w-0" icon={Download} />
                        <Button variant="ghost" className="p-2 h-10 w-10 min-w-0 text-red-500 hover:bg-red-50" icon={Trash2} onClick={() => deleteResource(id, note._id, 'note')} />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videos.length === 0 && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
                      <Video size={48} className="mx-auto text-slate-200 mb-4" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Video Vault Empty • No lectures published</p>
                    </div>
                  )}
                  {videos.map((video) => (
                    <Card key={video._id} className="p-0 overflow-hidden group border-none shadow-md">
                      <div className="aspect-video bg-slate-100 relative flex items-center justify-center group-hover:scale-105 transition-transform">
                        {video.url?.includes('youtube') ? <Youtube size={48} className="text-red-500" /> : <Video size={48} className="text-slate-300" />}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                           <Button variant="primary" className="rounded-full h-12 w-12 p-0" icon={Eye}></Button>
                        </div>
                      </div>
                      <div className="p-5">
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight mb-1">{video.title}</h4>
                        <div className="flex items-center justify-between">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{video.chapter}</p>
                          <button onClick={() => deleteResource(id, video._id, 'video')} className="text-slate-300 hover:text-red-500 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Controls Area */}
            <div className="lg:col-span-4 space-y-6">
               <Card title="Add Content" subtitle={`Initialize new ${activeTab === 'notes' ? 'document' : 'media'} protocol`}>
                  <form onSubmit={handleAddResource} className="space-y-4">
                    <Input 
                      label="Protocol Title" 
                      placeholder="e.g. CALCULUS SHEET" 
                      value={newResource.title}
                      onChange={e => setNewResource({...newResource, title: e.target.value})}
                      required
                    />
                    <Input 
                      label="Strategic Chapter" 
                      placeholder="e.g. Chapter 4" 
                      value={newResource.chapter}
                      onChange={e => setNewResource({...newResource, chapter: e.target.value})}
                    />

                    {activeTab === 'notes' && (
                      <Select 
                        label="Material Protocol"
                        value={newResource.noteType}
                        onChange={e => setNewResource({...newResource, noteType: e.target.value, type: 'note'})}
                        options={[
                          { label: 'PDF Document', value: 'pdf' },
                          { label: 'Diagram / Image', value: 'image' },
                          { label: 'Reference Link', value: 'link' }
                        ]}
                      />
                    )}

                    {activeTab === 'videos' && (
                      <Select 
                        label="Transmission Source"
                        value={newResource.videoType}
                        onChange={e => setNewResource({...newResource, videoType: e.target.value, type: 'video'})}
                        options={[
                          { label: 'YouTube Protocol', value: 'youtube' },
                          { label: 'Cloud Drive (GDrive)', value: 'drive' },
                          { label: 'Local Asset Upload', value: 'upload' }
                        ]}
                      />
                    )}

                    {((activeTab === 'notes' && newResource.noteType !== 'link') || (activeTab === 'videos' && newResource.videoType === 'upload')) ? (
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Repository Registry</label>
                        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-slate-400 transition-all cursor-pointer relative bg-slate-50 group">
                          <Plus size={24} className="mx-auto text-slate-300 mb-2 group-hover:text-black transition-colors" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block truncate px-4">{newResource.file ? newResource.file.name : 'Select Source File'}</span>
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setNewResource({...newResource, file: e.target.files[0]})} />
                        </div>
                      </div>
                    ) : (
                      <Input 
                        label="Resource Vector (URL)" 
                        placeholder={newResource.videoType === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://...'} 
                        value={newResource.url}
                        onChange={e => setNewResource({...newResource, url: e.target.value})}
                        required
                      />
                    )}

                    <Button 
                      type="submit" 
                      className="w-full h-[52px]" 
                      loading={isLoading}
                      icon={Plus}
                    >
                      Publish Resource
                    </Button>
                  </form>
               </Card>

               <Card className="bg-slate-900 border-none">
                  <div className="flex items-center gap-3 mb-4">
                    <Cloud className="text-white opacity-50" size={20} />
                    <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">System Health</h4>
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-end border-b border-white/5 pb-3">
                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Network Status</span>
                        <span className="text-[10px] font-black text-green-400 uppercase">Operational</span>
                     </div>
                     <div className="flex justify-between items-end border-b border-white/5 pb-3">
                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Latency</span>
                        <span className="text-[10px] font-black text-white">42ms</span>
                     </div>
                  </div>
               </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubjectPage;

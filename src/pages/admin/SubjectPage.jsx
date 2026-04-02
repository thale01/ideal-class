import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourse } from '../../context/CourseContext';
import AdminLayout from '../../components/admin/AdminLayout';
import { Card, Button, Input, Select } from '../../components/admin/AdminComponents';
import { 
  FileText, 
  Video, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  FileDigit,
  Youtube,
  Cloud,
  CheckCircle2
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 gap-4">
        <h2 className="text-xl font-bold text-slate-400">Subject Not Found</h2>
        <Button onClick={() => navigate('/admin')}>Return to Dashboard</Button>
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
      headerActions={
        <Button 
          variant="secondary" 
          onClick={() => navigate('/admin')}
          className="px-4 py-2"
          icon={ChevronLeft}
        >
          Back
        </Button>
      }
    >
      <div className="space-y-8">
        {/* Subject Header Card */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[24px] bg-indigo-50 border border-indigo-100 flex items-center justify-center text-4xl shadow-sm">
              {subject.icon || '📚'}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{subject.name}</h1>
              <p className="text-slate-500 font-medium mt-1">{subject.category} • Content Repository</p>
            </div>
          </div>
          
          <div className="flex p-1.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <button 
              onClick={() => setActiveTab('notes')}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2.5 ${activeTab === 'notes' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <FileText size={18} /> Notes
            </button>
            <button 
              onClick={() => setActiveTab('videos')}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2.5 ${activeTab === 'videos' ? 'bg-white text-indigo-600 shadow-md ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Video size={18} /> Lectures
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {activeTab === 'notes' ? (
              <div className="space-y-4">
                {notes.length === 0 && (
                  <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-[32px] bg-white/50">
                    <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-lg font-bold text-slate-400">No notes published yet</h3>
                    <p className="text-slate-400 text-sm mt-1">Upload study materials to populate your repository.</p>
                  </div>
                )}
                {notes.map((note) => (
                  <div key={note._id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between group hover:border-indigo-100 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                        <FileDigit size={24} />
                      </div>
                      <div>
                        <h4 className="text-[15px] font-bold text-slate-900">{note.title}</h4>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{note.chapter} • {new Date(note.uploadDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" className="p-2.5 h-10 w-10" icon={Download} />
                      <Button 
                        variant="ghost" 
                        className="p-2.5 h-10 w-10 text-rose-500 hover:bg-rose-50 hover:text-rose-600" 
                        icon={Trash2} 
                        onClick={() => deleteResource(id, note._id, 'note')} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.length === 0 && (
                  <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-200 rounded-[32px] bg-white/50">
                    <Video size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-lg font-bold text-slate-400">No lectures published yet</h3>
                    <p className="text-slate-400 text-sm mt-1">Add video resources to share with your students.</p>
                  </div>
                )}
                {videos.map((video) => (
                  <div key={video._id} className="bg-white border border-slate-200 rounded-[24px] overflow-hidden group shadow-sm hover:shadow-md transition-all">
                    <div className="aspect-video bg-slate-100 relative flex items-center justify-center">
                      {video.url?.includes('youtube') ? <Youtube size={48} className="text-rose-500" /> : <Video size={48} className="text-slate-300" />}
                      <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                         <Button variant="primary" className="rounded-full h-12 w-12 p-0 shadow-xl" icon={Eye}></Button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-[15px] font-bold text-slate-900 leading-tight">{video.title}</h4>
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1.5">{video.chapter}</p>
                        </div>
                        <button 
                          onClick={() => deleteResource(id, video._id, 'video')} 
                          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Controls Area */}
          <div className="lg:col-span-4 space-y-6">
             <Card title="Upload Content" subtitle={`Protocol: ${activeTab === 'notes' ? 'Document' : 'Media'}`}>
                <form onSubmit={handleAddResource} className="space-y-5">
                  <Input 
                    label="Resource Title" 
                    placeholder="e.g. Calculus Basics" 
                    value={newResource.title}
                    onChange={e => setNewResource({...newResource, title: e.target.value})}
                    required
                  />
                  <Input 
                    label="Chapter Name" 
                    placeholder="e.g. Chapter 4" 
                    value={newResource.chapter}
                    onChange={e => setNewResource({...newResource, chapter: e.target.value})}
                  />

                  {activeTab === 'notes' && (
                    <Select 
                      label="Material Type"
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
                      label="Deployment Mode"
                      value={newResource.videoType}
                      onChange={e => setNewResource({...newResource, videoType: e.target.value, type: 'video'})}
                      options={[
                        { label: 'YouTube URL', value: 'youtube' },
                        { label: 'Google Drive', value: 'drive' },
                        { label: 'Direct Upload', value: 'upload' }
                      ]}
                    />
                  )}

                  {((activeTab === 'notes' && newResource.noteType !== 'link') || (activeTab === 'videos' && newResource.videoType === 'upload')) ? (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Asset Source</label>
                      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer relative bg-slate-50/50 group">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-3 text-slate-300 group-hover:text-indigo-500 transition-colors">
                          <Plus size={24} />
                        </div>
                        <span className="text-xs font-bold text-slate-500 block truncate px-4">{newResource.file ? newResource.file.name : 'Choose file to upload'}</span>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setNewResource({...newResource, file: e.target.files[0]})} />
                      </div>
                    </div>
                  ) : (
                    <Input 
                      label="Resource Link" 
                      placeholder={newResource.videoType === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://...'} 
                      value={newResource.url}
                      onChange={e => setNewResource({...newResource, url: e.target.value})}
                      required
                    />
                  )}

                  <Button 
                    type="submit" 
                    className="w-full mt-2" 
                    loading={isLoading}
                    icon={Plus}
                  >
                    Deploy Content
                  </Button>
                </form>
             </Card>

             <Card className="bg-indigo-900 border-none shadow-xl shadow-indigo-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Cloud className="text-indigo-200" size={16} />
                  </div>
                  <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Deployment Status</h4>
                </div>
                <div className="space-y-5">
                   <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Network</span>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="text-[10px] font-black text-emerald-400 uppercase">Stable</span>
                      </div>
                   </div>
                   <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                      <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Storage</span>
                      <span className="text-[10px] font-black text-white">12.4 GB / 50 GB</span>
                   </div>
                </div>
             </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SubjectPage;

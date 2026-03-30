import React, { useState } from 'react';
import { Plus, Video, Link as LinkIcon } from 'lucide-react';

const VideoUpload = ({ onSubmit, subjectIcon, subjectName }) => {
  const [data, setData] = useState({ title: '', chapter: '', url: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.title || !data.url) return;
    onSubmit(data);
    setData({ title: '', chapter: '', url: '' });
  };

  return (
    <div className="card-premium subject-card animate-slideUp">
      <h3 className="text-xl font-black mb-6 text-bright flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex-center bg-blue-500/20 text-blue-400">
          <Video size={20}/>
        </div>
        Video Lecture Entry
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-[10px] font-black uppercase text-dim mb-2 block tracking-widest">Active Course</label>
          <div className="input-premium bg-surface border border-subtle shadow-sm border-subtle text-dim font-black cursor-not-allowed flex items-center gap-3">
            <span className="text-lg">{subjectIcon}</span> {subjectName}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black uppercase text-dim mb-2 block tracking-widest">Lecture Title</label>
          <input 
            className="input-premium" 
            placeholder="e.g. Intro to Mechanics" 
            value={data.title}
            onChange={e => setData({...data, title: e.target.value})}
            required
          />
        </div>

        <div>
           <label className="text-[10px] font-black uppercase text-dim mb-2 block tracking-widest">Video URL (YT / Drive)</label>
           <input 
            className="input-premium" 
            placeholder="https://youtu.be/..." 
            value={data.url}
            onChange={e => setData({...data, url: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="text-[10px] font-black uppercase text-dim mb-2 block tracking-widest">Target Chapter</label>
          <input 
            className="input-premium" 
            placeholder="e.g. Chapter 1: Kinematics" 
            value={data.chapter}
            onChange={e => setData({...data, chapter: e.target.value})}
          />
        </div>

        <button className="btn-premium w-full py-5 rounded-2xl font-black text-lg transition-all gap-4 shadow-lg justify-center border-none text-bright bg-grad-blue shadow-blue-500/20">
          <LinkIcon size={24}/> Add Video Lecture
        </button>
      </form>
    </div>
  );
};

export default VideoUpload;

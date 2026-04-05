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

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase text-bright mb-1 block tracking-[0.2em] opacity-90">Target Repository</label>
          <div className="input-premium bg-alt/50 border border-subtle text-dim font-black cursor-not-allowed flex items-center gap-4 py-4 px-5">
            <span className="text-xl filter grayscale group-hover:grayscale-0 transition-all">{subjectIcon}</span> 
            <span className="truncate">{subjectName}</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase text-bright mb-1 block tracking-[0.2em] opacity-90">Lecture Designation</label>
          <input 
            className="input-premium py-5 bg-surface/50 placeholder:text-dim/60" 
            placeholder="E.G. INTRO TO QUANTUM MECHANICS" 
            value={data.title}
            onChange={e => setData({...data, title: e.target.value})}
            required
          />
        </div>

        <div className="space-y-3">
           <label className="text-[11px] font-black uppercase text-bright mb-1 block tracking-[0.2em] opacity-90">Streaming Vector (YT / DRIVE)</label>
           <input 
            className="input-premium py-5 bg-surface/50 placeholder:text-dim/60 font-mono text-[10px]" 
            placeholder="HTTPS://YOUTU.BE/LINK_IDENTITY" 
            value={data.url}
            onChange={e => setData({...data, url: e.target.value})}
            required
          />
        </div>

        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase text-bright mb-1 block tracking-[0.2em] opacity-90">Academic Module / Chapter</label>
          <input 
            className="input-premium py-5 bg-surface/50 placeholder:text-dim/60 italic" 
            placeholder="E.G. CHAPTER 01: KINEMATICS" 
            value={data.chapter}
            onChange={e => setData({...data, chapter: e.target.value})}
          />
        </div>

        <button className="btn-premium w-full py-6 rounded-2xl font-black text-sm transition-all gap-4 shadow-xl border-none text-white bg-primary hover:bg-blue-600 shadow-primary/20 uppercase tracking-[0.2em]">
          <Plus size={20}/> Deploy Video to Repository
        </button>
      </form>
    </div>
  );
};

export default VideoUpload;

import React, { useState } from 'react';
import { Upload, Plus, FileText } from 'lucide-react';

const UploadPDF = ({ onSubmit, subjectIcon, subjectName }) => {
  const [data, setData] = useState({ title: '', chapter: '', files: [] });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.files.length === 0) return;
    onSubmit(data);
    setData({ title: '', chapter: '', files: [] });
  };

  return (
    <div className="card-premium subject-card animate-slideUp">
      <h3 className="text-xl font-black mb-6 text-bright flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex-center bg-purple-500/20 text-purple-400">
          <FileText size={20}/>
        </div>
        Bulk Notes Entry
      </h3>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-3">
              <label className="text-[11px] font-black uppercase text-bright mb-1 block tracking-[0.2em] opacity-90">Target Repository</label>
              <div className="input-premium bg-alt/50 border border-subtle text-dim font-black cursor-not-allowed flex items-center gap-4 py-4 px-5">
                <span className="text-xl filter grayscale group-hover:grayscale-0 transition-all">{subjectIcon}</span> 
                <span className="truncate">{subjectName}</span>
              </div>
           </div>
           <div className="space-y-3">
              <label className="text-[11px] font-black uppercase text-bright mb-1 block tracking-[0.2em] opacity-90">Chapter / Category</label>
              <input 
                className="input-premium py-4 text-xs italic bg-surface/50 placeholder:text-dim/60" 
                placeholder="E.G. CHAPTER 04: CALCULUS" 
                value={data.chapter}
                onChange={e => setData({...data, chapter: e.target.value})}
              />
           </div>
        </div>

        {data.files.length <= 1 && (
           <div className="animate-fadeIn space-y-3">
              <label className="text-[11px] font-black uppercase text-bright mb-1 block tracking-[0.2em] opacity-90">Document Identity</label>
              <input 
                className="input-premium py-5 bg-surface/50 placeholder:text-dim/60" 
                placeholder="E.G. SEMESTER 1 HANDOUT" 
                value={data.title}
                onChange={e => setData({...data, title: e.target.value})}
              />
              <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-2 bg-primary/5 py-2 px-4 rounded-lg w-fit">Leave blank to use filename metadata</p>
           </div>
        )}

        <div className="border-2 border-dashed border-subtle rounded-3xl p-12 text-center bg-alt/30 shadow-lg hover:border-primary transition-all relative group cursor-pointer overflow-hidden pb-14">
           <div className="absolute inset-x-0 bottom-0 h-1 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
           <Upload size={40} className="mx-auto text-dim group-hover:text-primary transition-colors mb-4"/>
           <span className="text-[11px] font-black text-dim uppercase tracking-[0.3em] group-hover:text-bright transition-colors">Select Archive Files</span>
           <p className="text-[9px] text-dim/50 uppercase font-black mt-2 tracking-widest">Supports multiple PDF ingestion</p>
           <input 
            type="file" 
            accept=".pdf"
            multiple
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={e => setData({...data, files: Array.from(e.target.files)})}
           />
           {data.files.length > 0 && (
              <div className="mt-8 space-y-3">
                 {data.files.map((f, i) => (
                    <div key={i} className="text-[10px] text-primary font-black bg-primary/10 py-3 rounded-2xl border border-primary/20 px-5 truncate flex justify-between animate-fadeUp">
                       <span>{f.name}</span>
                       <span className="opacity-60">{(f.size / 1024).toFixed(1)} KB</span>
                    </div>
                 ))}
              </div>
           )}
        </div>

        <button className="btn-premium w-full py-6 rounded-2xl font-black text-sm transition-all gap-4 shadow-xl border-none text-white bg-primary hover:bg-blue-600 shadow-primary/20 uppercase tracking-[0.2em]">
          <Plus size={20}/> Publish Assets to Repository
        </button>
      </form>
    </div>
  );
};

export default UploadPDF;

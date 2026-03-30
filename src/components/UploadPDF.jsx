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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-4">
           <div className="flex-1">
              <label className="text-[10px] font-black uppercase text-dim mb-2 block tracking-widest">Active Course</label>
              <div className="input-premium bg-surface border border-subtle shadow-sm border-subtle text-dim font-black cursor-not-allowed flex items-center gap-3 text-xs">
                <span className="text-lg">{subjectIcon}</span> {subjectName}
              </div>
           </div>
           <div className="flex-1">
              <label className="text-[10px] font-black uppercase text-dim mb-2 block tracking-widest">Manual Chapter</label>
              <input 
                className="input-premium py-4 text-xs" 
                placeholder="e.g. Chapter 4" 
                value={data.chapter}
                onChange={e => setData({...data, chapter: e.target.value})}
              />
           </div>
        </div>

        {data.files.length <= 1 && (
           <div className="animate-fadeIn">
              <label className="text-[10px] font-black uppercase text-dim mb-2 block tracking-widest">Primary Title</label>
              <input 
                className="input-premium" 
                placeholder="e.g. Calculus Basics" 
                value={data.title}
                onChange={e => setData({...data, title: e.target.value})}
              />
              <p className="text-[9px] text-dim mt-2 italic font-medium">Leave blank to use filename(s)</p>
           </div>
        )}

        <div className="border-2 border-dashed border-subtle rounded-2xl p-8 text-center bg-surface shadow-md hover:bg-surface border border-subtle shadow-lg hover:border-blue-500/50 transition-all relative group">
           <Upload size={32} className="mx-auto text-dim group-hover:text-blue-400 transition-colors mb-2"/>
           <span className="text-[10px] font-black text-dim uppercase tracking-widest">Select Files (Single or Multiple)</span>
           <input 
            type="file" 
            accept=".pdf"
            multiple
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={e => setData({...data, files: Array.from(e.target.files)})}
           />
           {data.files.length > 0 && (
              <div className="mt-4 space-y-2">
                 {data.files.map((f, i) => (
                    <div key={i} className="text-[8px] text-blue-400 font-black bg-blue-500/10 py-2 rounded-xl border border-blue-500/20 px-3 truncate flex justify-between">
                       <span>{f.name}</span>
                       <span className="opacity-50">{(f.size / 1024).toFixed(1)} KB</span>
                    </div>
                 ))}
              </div>
           )}
        </div>

        <button className="btn-premium w-full py-5 rounded-2xl font-black text-lg transition-all gap-4 shadow-lg justify-center border-none text-bright bg-grad-primary shadow-purple-500/20">
          <Plus size={24}/> Upload PDF Notes
        </button>
      </form>
    </div>
  );
};

export default UploadPDF;

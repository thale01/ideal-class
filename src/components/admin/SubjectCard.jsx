import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, ChevronRight, FileText, Play } from 'lucide-react';

const SubjectCard = ({ subject, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/admin/subject/${subject._id}`)}
      className="card-premium group cursor-pointer relative flex flex-col justify-between h-[300px] p-8 hover:border-primary-accent/40 bg-surface/50 transition-all duration-500 hover:-translate-y-2"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-glow rounded-bl-[64px] -mr-16 -mt-16 transition-all duration-700 group-hover:scale-150"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-alt border border-subtle flex items-center justify-center text-4xl shadow-sm group-hover:scale-110 group-hover:bg-surface group-hover:border-primary-accent transition-all duration-500 mb-6">
          {subject.icon || '📚'}
        </div>
        
        <h3 className="text-xl font-black text-bright uppercase tracking-tight italic transition-colors leading-tight mb-2">{subject.name}</h3>
        <p className="badge-premium badge-primary text-[8px] px-3 py-1 font-black">{subject.category || 'Standard Board'}</p>
      </div>

      <div className="relative z-10 pt-6 border-t border-subtle flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 group/stat">
             <div className="w-8 h-8 rounded-lg bg-alt flex items-center justify-center text-dim group-hover/stat:text-primary transition-colors">
                <FileText size={14} />
             </div>
             <div className="flex flex-col">
                <span className="text-sm font-black text-bright leading-none mb-0.5">{subject.resources?.notes?.length || 0}</span>
                <span className="text-[7px] font-black text-dim uppercase tracking-widest leading-none">Files</span>
             </div>
          </div>
          <div className="w-px h-6 bg-subtle"></div>
          <div className="flex items-center gap-2 group/stat">
             <div className="w-8 h-8 rounded-lg bg-alt flex items-center justify-center text-dim group-hover/stat:text-danger transition-colors">
                <Play size={14} />
             </div>
             <div className="flex flex-col">
                <span className="text-sm font-black text-bright leading-none mb-0.5">{subject.resources?.videos?.length || 0}</span>
                <span className="text-[7px] font-black text-dim uppercase tracking-widest leading-none">Vids</span>
             </div>
          </div>
        </div>
        
        <div className="flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(subject); }}
              className="w-10 h-10 rounded-xl bg-alt text-dim hover:text-primary-accent hover:bg-surface border border-transparent hover:border-subtle transition-all duration-300 flex items-center justify-center lg:opacity-0 lg:group-hover:opacity-100"
            >
              <Edit2 size={16} />
            </button>
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                if (window.confirm('IRREVERSIBLE ACTION: Wipe this module and all nested files?')) {
                  onDelete(subject._id); 
                }
              }}
              className="w-10 h-10 rounded-xl bg-alt text-danger/80 hover:text-danger hover:bg-surface border border-transparent hover:border-subtle transition-all duration-300 flex items-center justify-center lg:opacity-0 lg:group-hover:opacity-100 shadow-sm"
            >
              <Trash2 size={16} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;

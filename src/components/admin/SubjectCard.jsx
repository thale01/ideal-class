import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, ChevronRight, BookOpen } from 'lucide-react';

const SubjectCard = ({ subject, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/admin/subject/${subject._id}`)}
      className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-slate-300 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-[220px]"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-[48px] -mr-8 -mt-8 transition-all group-hover:bg-slate-100/50"></div>
      
      <div>
        <div className="flex items-start justify-between relative z-10 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-3xl shadow-sm">
            {subject.icon || '📚'}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(subject); }}
              className="p-2.5 rounded-xl text-slate-400 hover:text-black hover:bg-slate-50 transition-all opacity-0 group-hover:opacity-100"
            >
              <Edit2 size={16} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(subject._id); }}
              className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight leading-tight group-hover:text-blue-600 transition-colors">{subject.name}</h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{subject.category || 'Standard Board'}</p>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50 relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-900">{subject.resources?.notes?.length || 0}</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Notes</span>
          </div>
          <div className="w-[1px] h-6 bg-slate-100"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-900">{subject.resources?.videos?.length || 0}</span>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Videos</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black text-slate-900 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
          Manage <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;

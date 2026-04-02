import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, ChevronRight, BookOpen } from 'lucide-react';

const SubjectCard = ({ subject, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/admin/subject/${subject._id}`)}
      className="group bg-white border border-slate-200 rounded-[20px] p-5 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05),0_10px_10px_-5px_rgba(0,0,0,0.02)] hover:border-indigo-100 transition-all duration-300 cursor-pointer relative flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
            {subject.icon || '📚'}
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-lg font-bold text-slate-900 leading-tight truncate group-hover:text-indigo-600 transition-colors">
              {subject.name || 'Untitled Subject'}
            </h3>
            <p className="text-[11px] font-semibold text-slate-400 tracking-wide uppercase mt-0.5">
              {subject.category || 'Standard Board'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(subject); }}
            className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
            title="Edit Subject"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(subject._id); }}
            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
            title="Delete Subject"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100">
            <BookOpen size={12} className="text-slate-400" />
            <span className="text-[11px] font-bold text-slate-600">
              {subject.resources?.notes?.length || 0} Notes
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-100">
            <ChevronRight size={12} className="text-slate-400" />
            <span className="text-[11px] font-bold text-slate-600">
              {subject.resources?.videos?.length || 0} Videos
            </span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
          <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;

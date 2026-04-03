import React, { useState } from 'react';
import { FileText, Play, Clock, Trash2, Layers, CheckCircle, Edit2, Check } from 'lucide-react';
import { API_URL as BASE_URL } from '../config/api';
const API_BASE = BASE_URL.replace('/api', '');

const ContentCard = ({ id, type, title, chapter, date, url, fileUrl, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(title);

  const isVideo = type === 'video';
  const Icon = isVideo ? Play : FileText;
  const accentClass = isVideo ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-blue-500/10' : 'bg-primary/10 text-primary border-primary/20 shadow-primary/10';

  const handleUpdate = async () => {
    if (editValue.trim() && editValue !== title) {
      await onUpdate({ title: editValue });
    }
    setIsEditing(false);
  };

  return (
    <div className="card-premium flex flex-col sm:flex-row items-start sm:items-center justify-between group h-fit animate-slideUp border border-subtle p-4 sm:p-6 gap-4 sm:gap-6">
      <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto">
        <div className={`w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 ${accentClass} rounded-xl sm:rounded-2xl flex items-center justify-center border group-hover:scale-105 transition-all`}>
          <Icon size={isVideo ? 24 : 28} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            {isEditing ? (
              <input 
                autoFocus
                className="bg-alt border border-primary px-3 py-1.5 rounded-xl font-bold text-bright outline-none w-full sm:w-64 text-sm"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onBlur={handleUpdate}
                onKeyDown={e => e.key === 'Enter' && handleUpdate()}
              />
            ) : (
              <h4 className="font-black text-bright truncate text-base sm:text-lg uppercase tracking-tight max-w-[150px] sm:max-w-[300px]">{title}</h4>
            )}
            {chapter && !isEditing && <span className={`badge-premium badge-primary px-2 py-0.5 text-[8px] whitespace-nowrap`}>{chapter}</span>}
          </div>
          <p className="text-[9px] sm:text-[10px] text-dim font-black uppercase flex items-center gap-2 mt-1">
            <Clock size={10} /> {new Date(date).toLocaleDateString()}
            {isVideo && <span className="flex items-center gap-1.5 text-success ml-2"><CheckCircle size={10}/> 1080p HD</span>}
          </p>
        </div>
      </div>
      <div className="flex gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-subtle">
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-dim hover:text-primary transition-all border border-subtle shadow-sm ${isEditing ? 'text-primary border-primary/30' : ''}`}
        >
          {isEditing ? <Check size={20}/> : <Edit2 size={20} />}
        </button>
        <a 
          href={isVideo ? (url.startsWith('http') ? url : `${API_BASE}${url}`) : `${API_BASE}${fileUrl}`} 
          target="_blank" 
          rel="noreferrer" 
          className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-dim hover:bg-alt hover:text-primary transition-all border border-subtle shadow-sm"
          title={isVideo ? "Watch" : "View"}
        >
          {isVideo ? <Play size={20} /> : <Layers size={20} />}
        </a>
        {onDelete && (
          <button 
            onClick={onDelete} 
            className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-dim hover:bg-danger/10 hover:text-danger hover:border-danger/30 transition-all border border-subtle shadow-sm"
            title="Delete"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ContentCard;

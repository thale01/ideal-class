import React from 'react';
import { Loader2 } from 'lucide-react';

export const Card = ({ children, className = '', title, subtitle, icon }) => (
  <div className={`bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}>
    {(title || icon) && (
      <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
        {icon && <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900 border border-slate-100 shadow-sm">{icon}</div>}
        <div>
          {title && <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{title}</h3>}
          {subtitle && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{subtitle}</p>}
        </div>
      </div>
    )}
    {children}
  </div>
);

export const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled, loading, icon: Icon }) => {
  const variants = {
    primary: 'bg-black text-white hover:bg-slate-800 shadow-md hover:shadow-xl shadow-slate-200',
    secondary: 'bg-white text-slate-900 border border-slate-200 hover:border-slate-400 hover:bg-slate-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-xl shadow-red-100',
    ghost: 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon && <Icon size={16} />}
      <span className="leading-none">{children}</span>
    </button>
  );
};

export const Input = ({ label, error, className = '', ...props }) => (
  <div className={`space-y-2 ${className}`}>
    {label && <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 block">{label}</label>}
    <input
      {...props}
      className={`
        w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 text-sm font-bold text-slate-900 placeholder:text-slate-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-slate-100 focus:border-slate-400
        ${error ? 'border-red-500 ring-red-50' : ''}
      `}
    />
    {error && <p className="text-[10px] font-bold text-red-500 ml-1 italic">{error}</p>}
  </div>
);

export const Select = ({ label, options, className = '', ...props }) => (
  <div className={`space-y-2 ${className}`}>
    {label && <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1 block">{label}</label>}
    <select
      {...props}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl h-[56px] px-6 text-sm font-bold text-slate-900 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-slate-100 focus:border-slate-400 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_1.25rem_center] bg-[length:1.25rem_1.25rem] bg-no-repeat"
    >
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

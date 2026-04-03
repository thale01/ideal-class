import React from 'react';
import { Loader2 } from 'lucide-react';

export const Card = ({ children, className = '', title, subtitle, icon }) => (
  <div className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-sm ${className}`}>
    {(title || icon) && (
      <div className="flex items-center gap-4 mb-6 border-b border-slate-50 pb-4">
        {icon && <div className="p-2.5 bg-slate-50 rounded-xl text-slate-900 border border-slate-100">{icon}</div>}
        <div>
          {title && <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{title}</h3>}
          {subtitle && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{subtitle}</p>}
        </div>
      </div>
    )}
    {children}
  </div>
);

export const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled, loading, icon: Icon }) => {
  const variants = {
    primary: 'bg-black text-white hover:bg-slate-800 shadow-lg shadow-slate-200',
    secondary: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-100',
    ghost: 'text-slate-500 hover:bg-slate-50 hover:text-slate-900',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

export const Input = ({ label, error, className = '', ...props }) => (
  <div className={`space-y-1.5 ${className}`}>
    {label && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>}
    <input
      {...props}
      className={`
        w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-slate-100
        ${error ? 'border-red-500 ring-red-50' : ''}
      `}
    />
    {error && <p className="text-[10px] font-bold text-red-500 ml-1 italic">{error}</p>}
  </div>
);

export const Select = ({ label, options, className = '', ...props }) => (
  <div className={`space-y-1.5 ${className}`}>
    {label && <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>}
    <select
      {...props}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl h-[48px] px-5 text-sm font-semibold text-slate-900 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-slate-100"
    >
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

import React from 'react';
import { Loader2 } from 'lucide-react';

export const Card = ({ children, className = '', title, subtitle, icon }) => (
  <div className={`bg-white border border-slate-200 rounded-[24px] p-8 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
    {(title || icon) && (
      <div className="flex items-center gap-4 mb-8">
        {icon && <div className="w-12 h-12 bg-indigo-50 rounded-2xl text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm">{icon}</div>}
        <div>
          {title && <h3 className="text-lg font-bold text-slate-900 leading-tight">{title}</h3>}
          {subtitle && <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">{subtitle}</p>}
        </div>
      </div>
    )}
    {children}
  </div>
);

export const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled, loading, icon: Icon }) => {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm active:scale-95',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-100 active:scale-95',
    ghost: 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 active:scale-95',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
    >
      {loading ? <Loader2 size={18} className="animate-spin" /> : Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

export const Input = ({ label, error, className = '', ...props }) => (
  <div className={`space-y-2 ${className}`}>
    {label && <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>}
    <input
      {...props}
      className={`
        w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-6 text-[15px] font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-200
        ${error ? 'border-red-500 ring-4 ring-red-50' : ''}
      `}
    />
    {error && <p className="text-xs font-bold text-red-500 ml-1">{error}</p>}
  </div>
);

export const Select = ({ label, options, className = '', ...props }) => (
  <div className={`space-y-2 ${className}`}>
    {label && <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{label}</label>}
    <select
      {...props}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl h-[56px] px-6 text-[15px] font-semibold text-slate-900 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-200"
    >
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

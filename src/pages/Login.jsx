import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { GraduationCap, Sun, Moon, Lock, Mail, ChevronRight, User, Phone, ShieldCheck } from 'lucide-react';
import logo from '../assets/logo-main.png';

const Login = () => {
  const { user, login, error: authError } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const location = useLocation();
  const [role, setRole] = useState(location.state?.role || 'student'); // admin, student
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/student');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    
    console.log('Login attempt:', { role, email: email.trim(), hasPassword: !!password });
    
    try {
      const credentials = {
         name: role === 'student' ? name : 'Admin',
         email: email.trim(),
         phone: role === 'student' ? phone : '9999999999',
         password: password.trim()
      };

      const success = await login(role, credentials);

      if (!success) {
        // user will see context error handled by authError
        // AuthContext already sets the specific error message
      }
    } catch (err) {
      setErrorMessage('Communication Error with Server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-main flex flex-col transition-colors duration-500 overflow-hidden relative">
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 -translate-y-1/2 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary-accent/5 translate-y-1/2 translate-x-1/4 blur-[140px] rounded-full"></div>

      <nav className="relative w-full p-8 flex justify-between items-center z-50">
         <div className="flex items-center gap-4">
            <img src={logo} alt="L" className="h-10 w-auto object-contain drop-shadow-sm" />
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="hidden sm:block">
               <h1 className="text-xs font-black text-primary tracking-[0.3em] uppercase leading-none italic">Ideal Classes</h1>
               <p className="text-[10px] font-bold text-dim uppercase tracking-widest mt-1 opacity-60">Admin Protocol</p>
            </div>
         </div>
         <button 
           onClick={toggleTheme} 
           className="w-12 h-12 rounded-2xl bg-white border border-subtle flex items-center justify-center text-primary group-hover:text-primary-accent transition-all shadow-sm active:scale-95"
         >
            {theme === 'dark' ? <Sun size={20}/> : <Moon size={20}/>}
         </button>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-lg animate-fadeUp">
          <div className="card-premium shadow-2xl relative overflow-hidden p-10 sm:p-14 border-slate-100">
             <header className="mb-12 text-center">
                <div className="mb-6">
                   <span className={`badge-premium ${role === 'admin' ? 'badge-danger' : 'badge-primary'}`}>
                     {role === 'admin' ? 'Strategic Access' : 'Scholar Gateway'}
                   </span>
                </div>
                <h2 className="text-4xl font-black text-primary tracking-tighter uppercase italic leading-tight mb-3">Identity <span className="text-primary-accent not-italic">Check</span></h2>
                <p className="text-dim text-xs font-bold uppercase tracking-widest opacity-60">Authorize your academic credentials</p>
             </header>

             <div className="grid grid-cols-2 gap-3 p-1.5 bg-alt rounded-2xl mb-12">
                <button 
                  onClick={() => { setRole('student'); setErrorMessage(''); }}
                  className={`py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${role === 'student' ? 'bg-primary text-white shadow-xl scale-105' : 'text-dim hover:text-primary hover:bg-white'}`}
                >
                  Student
                </button>
                <button 
                  onClick={() => { setRole('admin'); setErrorMessage(''); }}
                  className={`py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${role === 'admin' ? 'bg-primary text-white shadow-xl scale-105' : 'text-dim hover:text-primary hover:bg-white'}`}
                >
                  Administrator
                </button>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6">
                {role === 'student' && (
                   <div className="space-y-6 animate-fadeIn">
                      <div>
                         <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-2 block ml-1">Academic Name</label>
                         <div className="relative group">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-dim group-focus-within:text-primary-accent transition-colors" size={18}/>
                            <input className="input-premium pl-14 py-4" placeholder="e.g. ARYAN SHARMA" value={name} onChange={e => setName(e.target.value)} required/>
                         </div>
                      </div>
                      <div>
                         <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-2 block ml-1">Contact Protocol</label>
                         <div className="relative group">
                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-dim group-focus-within:text-primary-accent transition-colors" size={18}/>
                            <input className="input-premium pl-14 py-4" placeholder="+91 00000 00000" value={phone} onChange={e => setPhone(e.target.value)} required/>
                         </div>
                      </div>
                   </div>
                )}

                <div>
                   <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-2 block ml-1">Logic ID (Email)</label>
                   <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-dim group-focus-within:text-primary-accent transition-colors" size={18}/>
                      <input className="input-premium pl-14 py-4" type="email" placeholder="ADMIN@IDEAL.COM" value={email} onChange={e => setEmail(e.target.value)} required/>
                   </div>
                </div>

                <div>
                   <label className="text-[10px] font-black text-dim uppercase tracking-widest mb-2 block ml-1">Security Token</label>
                   <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-dim group-focus-within:text-primary-accent transition-colors" size={18}/>
                      <input className="input-premium pl-14 py-4 font-bold tracking-widest" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required/>
                   </div>
                </div>

                {(errorMessage || authError) && (
                   <div className="p-4 rounded-xl bg-danger/5 border border-danger/20 animate-shake">
                      <p className="text-[10px] font-black text-danger text-center uppercase tracking-widest mb-1">Access Denied</p>
                      <p className="text-[10px] font-bold text-danger/80 text-center uppercase tracking-tight">{errorMessage || authError}</p>
                   </div>
                )}

                <button type="submit" disabled={loading} className="btn-premium btn-premium-primary w-full py-5 text-xs font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 group overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                   <div className="relative z-10 flex items-center justify-center gap-3">
                      {loading ? 'Decrypting...' : 'Initialize Session'}
                      {!loading && <ShieldCheck size={18}/>}
                   </div>
                </button>
             </form>

             <footer className="mt-12 pt-8 border-t border-slate-100 text-center">
                <p className="text-[10px] font-black text-primary-accent uppercase tracking-[0.4em] mb-4 italic animate-pulse">Academy Network Reboot v6.0</p>
                <Link to="/admission" className="text-[10px] font-black text-primary-accent hover:text-primary uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group">
                   Apply for Clearance <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
             </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;



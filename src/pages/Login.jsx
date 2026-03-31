import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { GraduationCap, Sun, Moon, Lock, Mail, ChevronRight, User, Phone, ShieldCheck } from 'lucide-react';
import logo from '../assets/logo.png';

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
    
    try {
      const credentials = {
         name: role === 'student' ? name : 'Admin',
         email,
         phone: role === 'student' ? phone : '9999999999',
         password
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
    <div className="min-h-screen bg-main flex flex-col transition-colors duration-500">
      {/* Dynamic Navigation */}
      <nav className="fixed top-0 w-full p-6 md:p-8 flex justify-between items-center z-50">
         <div className="flex items-center gap-3">
            <img src={logo} alt="Ideal Classes Logo" className="h-10 w-auto object-contain" />
         </div>
         <button 
           onClick={toggleTheme} 
           className="w-12 h-12 rounded-xl bg-surface border border-subtle flex items-center justify-center text-dim hover:text-primary hover:border-primary/30 transition-all shadow-sm"
         >
            {theme === 'dark' ? <Sun size={20}/> : <Moon size={20}/>}
         </button>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6 mt-16 md:mt-20">
        <div className="w-full max-w-lg card-premium fade-up relative overflow-hidden">
          {/* Subtle Background Ornament */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
          
          <header className="mb-8 text-center">
             <div className="inline-block mb-4">
                <span className={`badge-premium ${role === 'admin' ? 'badge-danger' : 'badge-primary'}`}>
                  {role === 'admin' ? 'Master Access' : 'Scholar Portal'}
                </span>
             </div>
             <h2 className="text-4xl font-bold text-bright tracking-tight mb-2">Welcome Back</h2>
             <p className="text-dim text-sm font-medium">Please enter your verified academic credentials</p>
          </header>

          <div className="grid grid-cols-2 gap-2 bg-alt p-1 rounded-xl mb-10">
             <button 
               onClick={() => { setRole('student'); setErrorMessage(''); }}
               className={`py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${role === 'student' ? 'bg-primary text-white shadow-lg' : 'text-dim hover:text-primary hover:bg-primary/5'}`}
             >
               Student
             </button>
             <button 
               onClick={() => { setRole('admin'); setErrorMessage(''); }}
               className={`py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${role === 'admin' ? 'bg-primary text-white shadow-lg' : 'text-dim hover:text-primary hover:bg-primary/5'}`}
             >
               Admin
             </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
             {role === 'student' && (
                <div className="space-y-6 animate-fadeIn">
                   <div>
                      <label className="text-[10px] font-bold text-dim uppercase tracking-[0.2em] mb-2 block">Full&nbsp;&nbsp;&nbsp;Name</label>
                      <div className="relative group">
                         <User className="absolute left-4 top-1/2 -translate-y-1/2 text-dim group-focus-within:text-primary transition-colors" size={18}/>
                         <input className="input-premium pl-12" placeholder="e.g. Aryan Sharma" value={name} onChange={e => setName(e.target.value)} required/>
                      </div>
                   </div>
                   <div>
                      <label className="text-[10px] font-bold text-dim uppercase tracking-[0.2em] mb-2 block">Contact&nbsp;&nbsp;&nbsp;Number</label>
                      <div className="relative group">
                         <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-dim group-focus-within:text-primary transition-colors" size={18}/>
                         <input className="input-premium pl-12" placeholder="+91 99887 76655" value={phone} onChange={e => setPhone(e.target.value)} required/>
                      </div>
                   </div>
                </div>
             )}

             <div>
                <label className="text-[10px] font-bold text-dim uppercase tracking-[0.2em] mb-2 block">Email&nbsp;&nbsp;&nbsp;Address</label>
                <div className="relative group">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dim group-focus-within:text-primary transition-colors" size={18}/>
                   <input className="input-premium pl-12" type="email" placeholder="example@gmail.com" value={email} onChange={e => setEmail(e.target.value)} required/>
                </div>
             </div>

             <div>
                <label className="text-[10px] font-bold text-dim uppercase tracking-[0.2em] mb-2 block">Secure&nbsp;&nbsp;&nbsp;Key</label>
                <div className="relative group">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-dim group-focus-within:text-primary transition-colors" size={18}/>
                   <input className="input-premium pl-12 font-bold" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required/>
                </div>
             </div>

             {(errorMessage || authError) && (
                <div className="p-3 rounded-lg bg-danger/10 border border-danger/20">
                   <p className="text-xs font-bold text-danger text-center">{errorMessage || authError}</p>
                </div>
             )}

             <button type="submit" disabled={loading} className="btn-premium btn-premium-primary w-full py-4 text-sm uppercase tracking-widest shadow-lg">
                {loading ? 'Verifying...' : 'Initialize Session'}
                {!loading && <ChevronRight size={18}/>}
             </button>
          </form>

          <footer className="mt-8 pt-8 border-t border-subtle text-center">
             <p className="text-xs font-medium text-dim inline-block mr-2">New student?</p>
             <Link to="/admission" className="text-xs font-bold text-primary hover:underline underline-offset-4 transition-all">Apply for Online Access</Link>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;



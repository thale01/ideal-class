import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Home, 
  BookOpen, 
  Image as ImageIcon, 
  Zap, 
  User, 
  LogOut, 
  Moon, 
  Sun,
  LayoutDashboard,
  MapPin,
  Phone,
  X,
  User as UserIcon,
  Menu
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Gallery', path: '/gallery', icon: ImageIcon },
  ];

  return (
    <header className={`landing-nav ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container nav-content">
        {/* Logo Section - Triggers Professional Contact Modal */}
        <div onClick={() => setShowContactModal(true)} className="logo-group select-none cursor-pointer group transition-transform hover:scale-105 active:scale-95">
          <div className="logo-icon flex items-center justify-center" style={{ width: 'auto', height: 'auto', background: 'none', boxShadow: 'none' }}>
            <img 
              src="/logo.png" 
              alt="Ideal Logo" 
              className="object-contain mix-blend-screen" 
              style={{ 
                width: isScrolled ? '100px' : '120px', 
                height: 'auto',
                transition: 'all 0.4s ease',
                filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.2))' 
              }} 
            />
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="nav-actions flex items-center gap-2 sm:gap-4 md:gap-8">
          
          {/* Main Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-8 mr-4">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                className={`text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-primary ${
                  location.pathname === link.path ? 'text-primary' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-300 shadow-sm border border-slate-200/50 dark:border-white/10"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Auth Section (Desktop/Tablet) */}
          <div className="hidden sm:flex items-center gap-4">
            {user ? (
              <>
                <Link 
                  to={user.role === 'admin' ? '/admin' : '/student'}
                  className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.1em] text-slate-700 dark:text-slate-300 hover:text-primary transition-all"
                >
                  <LayoutDashboard size={18} />
                  <span>Portal</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.1em] text-danger hover:opacity-80 transition-all"
                >
                  <LogOut size={18} />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-sm font-black uppercase tracking-[0.1em] text-slate-600 dark:text-slate-300 hover:text-primary transition-all vanish-mobile"
                >
                  Log In
                </Link>
                <Link 
                  to="/admission" 
                  className="btn-premium btn-primary px-6 sm:px-8 py-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20"
                >
                  Apply
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg transition-transform active:scale-90"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Mobile Navigation Overlay - Ultra Modern & Premium */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[10001] lg:hidden">
            <div 
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-3xl animate-in fade-in duration-500"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            
            <div className="relative h-full flex flex-col p-8 sm:p-12 animate-in slide-in-from-right duration-500">
              <div className="flex justify-between items-center mb-16">
                <img src="/logo.png" alt="Logo" className="h-10 w-auto mix-blend-screen" />
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/20"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex flex-col gap-8">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-3xl font-black text-white hover:text-primary transition-colors flex items-center gap-6 group"
                  >
                    <div className="w-1 h-8 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-10 border-t border-white/10 flex flex-col gap-6">
                {user ? (
                  <>
                    <Link 
                      to={user.role === 'admin' ? '/admin' : '/student'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-4 text-white font-bold"
                    >
                      <LayoutDashboard className="text-primary" /> PORTAL DASHBOARD
                    </Link>
                    <button 
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                      className="p-6 bg-danger/10 border border-danger/20 rounded-3xl flex items-center gap-4 text-danger font-bold"
                    >
                      <LogOut /> LOGOUT SESSION
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-4 text-white font-bold uppercase tracking-widest text-center justify-center"
                    >
                      Member Portal
                    </Link>
                    <Link 
                      to="/admission"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-6 bg-primary rounded-3xl flex items-center gap-4 text-white font-black uppercase tracking-[0.2em] text-center justify-center shadow-2xl shadow-primary/40"
                    >
                      Apply Online
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Professional Contact Modal - Highly Modern & Cinematic */}
        {showContactModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Backdrop with Blur */}
            <div 
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-2xl animate-in fade-in duration-500"
              onClick={() => setShowContactModal(false)}
            ></div>
            
            {/* Modal Content - Forced Cinematic Dark for Perfect Visibility */}
            <div 
              className="relative w-full max-w-2xl rounded-[40px] shadow-[0_48px_200px_rgba(0,0,0,1)] overflow-hidden animate-in zoom-in duration-700 border antialiased"
              style={{ 
                backgroundColor: '#020617', 
                borderColor: 'rgba(255, 255, 255, 0.1)',
                position: 'relative'
              }}
            >
              
              {/* Header Visual Stripe - Emerald Gradient */}
              <div className="h-2" style={{ background: 'linear-gradient(to right, #059669, #14b8a6, #22c55e)' }}></div>
              
              <div className="p-6 sm:p-10 md:p-14 pt-16 sm:pt-20 relative">
                {/* Close Button - Optimized Position & Premium Style */}
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="absolute top-6 right-6 sm:top-12 sm:right-12 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all border duration-300 pointer-events-auto z-10"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                    borderColor: 'rgba(255, 255, 255, 0.15)', 
                    color: 'rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                    e.currentTarget.style.color = '#ef4444';
                    e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                    e.currentTarget.style.transform = 'rotate(90deg)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'rotate(0deg)';
                  }}
                >
                  <X size={28} strokeWidth={2} />
                </button>

                <div className="flex flex-col md:flex-row gap-12 items-center text-center md:text-left">
                  {/* Founder Profile Avatar Wrapper - Premium Glassmorphism */}
                  <div className="flex-shrink-0">
                    <div 
                      className="w-24 h-24 sm:w-40 sm:h-40 flex items-center justify-center relative group transition-all duration-700" 
                      style={{ 
                        backgroundColor: 'rgba(16, 185, 129, 0.08)', 
                        color: '#34d399', 
                        borderRadius: '40px',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.2), inset 0 0 20px rgba(16, 185, 129, 0.1)'
                      }}
                    >
                      <UserIcon size={40} className="sm:hidden" />
                      <UserIcon size={80} strokeWidth={1} className="hidden sm:block" />
                      <div className="absolute inset-0 border-2 rounded-[40px] border-emerald-500/20 group-hover:scale-105 duration-700 transition-all"></div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <span className="text-[11px] font-black uppercase mb-3 block opacity-80" style={{ color: '#10b981', letterSpacing: '0.4em' }}>Administration</span>
                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter mb-4 italic leading-tight">
                      Kalpesh Patil
                    </h2>
                    <div className="flex items-center gap-3 justify-center md:justify-start">
                      <div className="h-1 w-8 rounded-full" style={{ backgroundColor: 'rgba(16, 185, 129, 0.3)' }}></div>
                      <p className="font-900 uppercase text-[10px] tracking-[0.2em]" style={{ color: '#94a3b8' }}>Founder & Managing Director</p>
                    </div>
                  </div>
                </div>

                <div className="h-px my-12" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  {/* Contact Info Group */}
                  <div className="space-y-6 sm:space-y-10">
                    <div className="flex items-start gap-4 sm:gap-6 group">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 border transition-all duration-500" style={{ backgroundColor: 'rgba(20, 184, 166, 0.1)', color: '#2dd4bf', borderColor: 'rgba(20, 184, 166, 0.2)' }}>
                        <Phone size={20} strokeWidth={2.5} className="sm:hidden" />
                        <Phone size={24} strokeWidth={2.5} className="hidden sm:block" />
                      </div>
                      <div>
                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest block mb-1 sm:mb-2" style={{ color: '#64748b' }}>Direct Inquiry</span>
                        <div className="space-y-1">
                          <a href="tel:8793309230" className="text-xl sm:text-2xl font-black text-white hover:text-emerald-400 transition-colors block tracking-tight">+91 87933 09230</a>
                          <a href="tel:9028289230" className="text-xl sm:text-2xl font-black text-white hover:text-emerald-400 transition-colors block tracking-tight">+91 90282 89230</a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Branches Info Group */}
                  <div className="space-y-10">
                    <div className="flex items-start gap-6 group">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-all duration-500" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                        <MapPin size={24} strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <span className="text-[11px] font-black uppercase tracking-widest block mb-3" style={{ color: '#64748b' }}>Campus Protocol</span>
                        <div className="space-y-6">
                          <div className="relative pl-4 border-l-2 transition-colors" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <span className="text-white font-black block text-[10px] mb-1 uppercase tracking-widest opacity-90">RAMWADI BRANCH</span>
                            <p className="text-sm font-bold leading-relaxed" style={{ color: '#94a3b8' }}>Diploma College Rd, Near Highway</p>
                          </div>
                          <div className="relative pl-4 border-l-2 transition-colors" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                            <span className="text-white font-black block text-[10px] mb-1 uppercase tracking-widest opacity-90">PEN BRANCH</span>
                            <p className="text-sm font-bold leading-relaxed" style={{ color: '#94a3b8' }}>Chavadi Naka, Pen</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 sm:mt-16 pt-6 sm:pt-10 border-t flex flex-col sm:flex-row gap-4 sm:gap-6" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                  <button 
                    onClick={() => setShowContactModal(false)}
                    className="flex-1 py-4 sm:py-5 rounded-xl sm:rounded-2xl text-[12px] sm:text-[13px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-3"
                    style={{ backgroundColor: '#ffffff', color: '#020617' }}
                  >
                    Close Profile
                  </button>
                  <a 
                    href="https://wa.me/918793309230"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-4 sm:py-5 rounded-xl sm:rounded-2xl text-[12px] sm:text-[13px] font-black uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3"
                    style={{ backgroundColor: '#059669', color: '#ffffff', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)' }}
                  >
                    Quick WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

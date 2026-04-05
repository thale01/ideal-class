import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Home, 
  BookOpen, 
  Image as ImageIcon, 
  LogOut, 
  Sun,
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
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

  return (
    <header className={`navbar-official ${isScrolled ? 'backdrop-blur-2xl' : ''}`}>
      <div className="nav-container">
        {/* Logo Section */}
        <Link to="/" className="logo-link">
          <img 
            src="/src/assets/logo-main.png?v=5.1" 
            alt="Ideal Classes" 
            className="official-logo" 
          />
        </Link>

        {/* Global Navigation (Right Side) */}
        <div className="nav-right">
          
          {/* Main Links (Desktop) - Hidden for this specific minimalism unless user asks back */}
          <div className="hidden lg:flex items-center gap-8 mr-8">
            <Link to="/" className="btn-log-in" style={{ fontSize: '12px' }}>Home</Link>
            <Link to="/gallery" className="btn-log-in" style={{ fontSize: '12px' }}>Gallery</Link>
            <Link to="/courses" className="btn-log-in" style={{ fontSize: '12px' }}>Curriculum</Link>
          </div>

          {/* Theme Toggle Pill */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-nav"
            title="Toggle Theme"
          >
            <Sun size={20} strokeWidth={2.5} />
          </button>

          {/* Auth Section */}
          <div className="hidden sm:flex items-center gap-8">
            {user ? (
              <>
                <Link 
                  to={user.role === 'admin' ? '/admin' : '/student'}
                  className="btn-log-in"
                >
                  <LayoutDashboard size={18} className="inline mr-2" />
                  Portal
                </Link>
                <button 
                  onClick={handleLogout}
                  className="btn-log-in text-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-log-in">
                  Log In
                </Link>
                <Link to="/admission" className="btn-apply-gradient">
                  Apply Online
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
            className="sm:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Basic Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[80px] bg-slate-950 z-[999] flex flex-col p-8 sm:hidden">
            <nav className="flex flex-col gap-8">
               <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-white uppercase">Home</Link>
               <Link to="/admission" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-white uppercase">Apply Online</Link>
               <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black text-white uppercase">Log In Portal</Link>
            </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

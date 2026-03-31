import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGallery } from '../context/GalleryContext';
import { useTheme } from '../context/ThemeContext';
import {
  Trophy, Medal, Star, Users,
  ArrowRight, CheckCircle, ShieldCheck,
  Zap, Award, GraduationCap, ChevronRight,
  LogIn, UserCheck, ShieldAlert, TrendingUp,
  Sun, Moon, Instagram, Twitter, Linkedin, X, Phone, MapPin,
  Home as HomeIcon,
  BookOpen,
  Image,
  Search,
  Menu,
  ChevronDown,
  User,
  Lock
} from 'lucide-react';
import Navbar from '../components/Navbar';
import logo from '../assets/logo.png';

const IdealLogo = ({ className = "" }) => (
  <div className={`flex items-center select-none cursor-pointer group ${className}`}>
    <div className="h-12 md:h-16 transition-all duration-500">
      <img 
        src="/logo.png?v=1" 
        alt="Ideal Classes Logo" 
        className="h-full w-auto object-contain brightness-110 group-hover:scale-105 transition-transform duration-500 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
      />
    </div>
  </div>
);

const LandingPage = () => {
  const gallery = useGallery() || {};
  const toppers = (gallery.toppers && gallery.toppers.length > 0) ? gallery.toppers : [
    { id: 1, name: "Aryan K.", score: "99.4%", exam: "CBSE Boards", achievement: "District Topper" },
    { id: 2, name: "Sneha D.", score: "98.6%", exam: "SSC Boards", achievement: "School Rank #1" },
    { id: 3, name: "Pratik T.", score: "97.2%", exam: "HSC Science", achievement: "Merit Holder" }
  ];
  const achievements = (gallery.achievements && gallery.achievements.length > 0) ? gallery.achievements : [
    { id: 1, title: "10+ Years Excellence", description: "Providing quality education since 2014." },
    { id: 2, title: "Engineering Experts", description: "Specialized coaching for Diploma & Degree across all major streams." },
    { id: 3, title: "Entrance Professionals", description: "Proven track record in JEE, NEET, MHT-CET, and NATA." }
  ];

  const programs = [
    {
      category: "Engineering Focus",
      icon: <GraduationCap size={32} />,
      subjects: ["Computer / IT", "Civil", "Mechanical", "Electrical", "Chemical", "Instrumentation"]
    },
    {
      category: "Academic Science",
      icon: <BookOpen size={32} />,
      subjects: ["11th Science", "12th Science"]
    },
    {
      category: "Entrance Mastery",
      icon: <Trophy size={32} />,
      subjects: ["MHT-CET", "JEE", "NATA", "NEET"]
    }
  ];
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.1 });

    const observeElements = () => {
      const elements = document.querySelectorAll('.reveal-on-scroll, .stagger-reveal');
      elements.forEach((el) => {
        observer.observe(el);
      });
    };

    observeElements();
    
    // Re-observe after a short delay to account for potential layout shifts or re-renders
    const timeoutId = setTimeout(observeElements, 1000);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []); // Stable dependency to prevent "changed size" React error

  return (
    <div className="landing-container min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Cinematic Hero Section - Center-Aligned Bubble Design (Vibrant Green) */}
      <header className="hero-section relative overflow-hidden flex items-center justify-center pt-20" style={{ 
        background: 'linear-gradient(135deg, #0d9488 0%, #10b981 100%)',
        minHeight: '95vh',
        position: 'relative',
        WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)'
      }}>
        {/* ENHANCED Centerpiece Bubble Backdrop - GUARANTEED RENDERING */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-1">
          <div 
            className="rounded-full border-2 animate-pulse-glow backdrop-blur-lg" 
            style={{ 
              width: 'clamp(280px, 90vw, 760px)', 
              height: 'clamp(280px, 90vw, 760px)', 
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              borderColor: 'rgba(255, 255, 255, 0.4)',
              boxShadow: '0 0 120px rgba(255, 255, 255, 0.1), inset 0 10px 60px rgba(255, 255, 255, 0.3)',
              borderRadius: '48% 52% 50% 50% / 50% 50% 50% 50%'
            }}
          ></div>
        </div>
        
        {/* Dynamic Glow Overlays for depth */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', filter: 'blur(180px)', top: '5%', right: '5%' }}></div>
        <div className="absolute animate-float-y rounded-full" style={{ backgroundColor: 'rgba(16, 185, 129, 0.4)', filter: 'blur(160px)', width: '700px', height: '700px', bottom: '-15%', left: '-10%' }}></div>
        
        <div className="container relative z-10 px-6 text-center" style={{ maxWidth: '1000px' }}>
          <div className="reveal-on-scroll flex flex-col items-center">
            
            <h1 className="text-4xl sm:text-7xl lg:text-8xl font-950 tracking-tighter mb-4 sm:mb-8 animate-fadeIn delay-200 opacity-0" style={{ animationFillMode: 'forwards' }}>
              Advancing Academic <br className="hidden sm:block" /> Success. <span className="text-gradient">Forever.</span>
            </h1>
            
            <p className="font-bold text-white mb-10 sm:mb-14 opacity-100 px-2" style={{ fontSize: 'clamp(0.95rem, 2.5vw, 22px)', lineHeight: '1.6', maxWidth: '800px', textShadow: '0 10px 20px rgba(0,0,0,0.4)' }}>
              Welcome to Ideal Classes. We craft intuitive learning pathways and visually captivating academic experiences that help students stand out in their journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8 sm:mt-12 mb-8 sm:mb-12 w-full max-w-[600px] mx-auto px-4">
              <button 
                onClick={() => navigate('/login', { state: { role: 'student' } })} 
                className="w-full sm:w-auto px-10 py-4 sm:py-5 rounded-2xl text-white font-black transition-all backdrop-blur-xl border flex items-center justify-center gap-3 hover:scale-105 active:scale-95 shadow-xl"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                  fontSize: '16px',
                  letterSpacing: 'tight',
                  flex: 1
                }}
              >
                <User size={20} />
                Student Portal
              </button>
              
              <button 
                onClick={() => navigate('/login', { state: { role: 'admin' } })} 
                className="w-full sm:w-auto px-10 py-4 sm:py-5 rounded-2xl text-white font-black transition-all backdrop-blur-xl border flex items-center justify-center gap-3 hover:scale-105 active:scale-95 shadow-2xl"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.25)', 
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  fontSize: '16px',
                  letterSpacing: 'tight',
                  flex: 1
                }}
              >
                <Lock size={20} />
                Admin Portal
              </button>
            </div>
            
          </div>
        </div>
        {/* CSS Mask Blending ensures smooth spread into next section */}
      </header>

      {/* Academic Programs */}
      <section id="courses" className="programs-section -mt-32 pt-10 pb-32 overflow-hidden relative z-10">
        <div className="absolute -left-[20%] top-[40%] w-[500px] h-[500px] bg-emerald-700/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="container relative z-10">
          <div className="section-header reveal-on-scroll text-center mb-20">
            <span className="section-tag border-emerald-500/20 text-emerald-400/80 bg-emerald-500/5">Our Verticals</span>
            <h2 className="section-title">Comprehensive Academic Tracks</h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-500">From foundation years to professional engineering degrees, we provide the roadmap to your career goals.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((prog, i) => (
              <div key={i} className={`reveal-on-scroll delay-${(i+1)*100} p-8 pb-10 rounded-[32px] bg-white/5 border border-white/5 hover:bg-white/10 hover:border-emerald-500/40 transition-all duration-500 shadow-xl group hover:-translate-y-2`}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-400 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-float-y">
                  {prog.icon}
                </div>
                <h3 className="text-2xl font-900 mb-6 tracking-tight text-white group-hover:text-emerald-300 transition-colors">{prog.category}</h3>
                <ul className="space-y-3">
                  {prog.subjects.map((sub, j) => (
                    <li key={j} className="flex items-center gap-3 text-slate-400 font-500 group-hover:text-slate-300 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div> {sub}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-32">
        <div className="container">
          <div className="section-header text-center mb-28">
            <span className="section-tag reveal-on-scroll delay-100">Features</span>
            <h2 className="section-title reveal-on-scroll delay-300">
              <span className="text-reveal-mask">
                <span className="text-reveal-content">Everything You Need to Succeed</span>
              </span>
            </h2>
            <div className="w-24 h-1 bg-primary/30 mx-auto mt-8 rounded-full reveal-on-scroll delay-500"></div>
          </div>
          <div className="features-grid">
            <div className="feature-card reveal-on-scroll delay-100 group">
              <div className="feature-icon group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"><BookOpen size={36} strokeWidth={1.5} /></div>
              <h3 className="text-2xl font-900 mb-4">Smart Curriculum</h3>
              <p className="text-slate-500 font-500 leading-relaxed group-hover:text-slate-600 transition-colors">
                Well-structured digital notes and expert resources organized by class, subject, and chapter for a seamless learning experience.
              </p>
            </div>
            <div className="feature-card reveal-on-scroll delay-200 group">
              <div className="feature-icon group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300" style={{ color: '#10b981' }}><TrendingUp size={36} strokeWidth={1.5} /></div>
              <h3 className="text-2xl font-900 mb-4">Performance Insights</h3>
              <p className="text-slate-500 font-500 leading-relaxed group-hover:text-slate-600 transition-colors">
                Monitor your academic growth with the region's first AI-integrated progress tracker, designed to build data-driven confidence.
              </p>
            </div>
            <div className="feature-card reveal-on-scroll delay-300 group">
              <div className="feature-icon group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" style={{ color: '#f59e0b' }}><Award size={36} strokeWidth={1.5} /></div>
              <h3 className="text-2xl font-900 mb-4">Holistic Evaluation</h3>
              <p className="text-slate-500 font-500 leading-relaxed group-hover:text-slate-600 transition-colors">
                Weekly assessments and mock board examinations that perfectly simulate competitive environments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hall of Fame (Gallery representation) */}
      <section id="gallery" className="toppers-section py-32 bg-subtle relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] animate-pulse-glow pointer-events-none"></div>
        <div className="container relative z-10">
          <div className="section-header reveal-on-scroll text-center">
            <span className="section-tag">Hall of Fame</span>
            <h2 className="section-title">Celebrating Excellence</h2>
          </div>
          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {toppers.map((topper, idx) => (
              <div key={topper.id} className={`topper-card reveal-on-scroll delay-${(idx % 4) * 100 + 100} hover:-translate-y-3 transition-transform duration-500`}>
                <div className="topper-avatar" style={{ color: idx === 1 ? '#0ea5e9' : idx === 2 ? '#10b981' : 'var(--accent)' }}>
                  {topper.name.charAt(0)}
                </div>
                <div className="topper-rank">{topper.achievement}</div>
                <h3 className="topper-name">{topper.name}</h3>
                <div className="topper-stats">{topper.score}</div>
                <div className="mt-4 text-sm font-800 opacity-40 uppercase tracking-widest">{topper.exam}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built on Trust (Achievements) */}
      <section id="achievements" className="achievements-section py-32 relative">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="reveal-on-scroll">
            <span className="section-tag">Our Legacy</span>
            <h2 className="section-title text-left">Built on Trust, <br /> <span className="text-accent underline decoration-accent-soft underline-offset-8">Verified by Success</span></h2>
            <p className="text-slate-500 text-lg font-500 mb-10 max-w-xl">
              Ideal Classes combines traditional teaching values with modern digital tools to ensure every student achieves their highest potential with unparalleled support.
            </p>

            <div className="space-y-6">
              {achievements.map((ach, idx) => (
                <div key={ach.id} className={`reveal-on-scroll delay-${(idx%3+1)*100} p-8 bg-card border border-border rounded-xl flex items-center gap-6 group hover:border-accent hover:shadow-lg transition-all duration-300`}>
                  <div className="w-14 h-14 rounded-lg bg-accent-light flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300 group-hover:scale-110">
                    <CheckCircle size={28} />
                  </div>
                  <div>
                    <strong className="text-xl block font-900">{ach.title}</strong>
                    <p className="text-slate-500 font-500 mt-1">{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="reveal-on-scroll delay-300 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent rounded-4xl -rotate-3 scale-105 pointer-events-none animate-pulse-glow"></div>
              <div className="p-14 bg-card border border-border rounded-[48px] shadow-2xl relative overflow-hidden animate-float-y">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-2xl pointer-events-none"></div>
                
                {/* Header Section */}
                <div className="flex justify-between items-center mb-16 relative z-10">
                  <div>
                    <strong className="text-3xl block font-900 tracking-tight">Student Analytics</strong>
                    <span className="text-slate-500 font-700 uppercase text-xs tracking-widest mt-2 block">Real-time Growth Metrics</span>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-accent-light flex items-center justify-center text-accent animate-pulse shadow-sm shadow-accent/20"><TrendingUp size={28} /></div>
                </div>

                {/* Progress Tracker Section */}
                <div className="mb-20 relative z-10">
                  <div className="flex justify-between mb-5 font-900 text-lg">
                    <span>Score Improvement</span>
                    <span className="text-accent underline decoration-accent/20 underline-offset-4">94%</span>
                  </div>
                  <div className="h-5 bg-subtle rounded-full overflow-hidden border border-border p-1 relative">
                    <div className="absolute inset-0 bg-accent/10 animate-pulse"></div>
                    <div className="h-full bg-accent rounded-full w-[94%] relative z-10 shadow-[0_0_15px_rgba(var(--accent-rgb),0.6)]"></div>
                  </div>
                </div>

                {/* Bottom Stats Grid */}
                <div className="grid grid-cols-2 gap-20 pt-12 border-t border-border relative z-10">
                  <div>
                    <span className="text-slate-400 text-[10px] block mb-3 uppercase font-950 tracking-[0.2em]">Board Success</span>
                    <strong className="text-4xl font-950 text-accent tabular-nums tracking-tighter italic">99.2%</strong>
                  </div>
                  <div className="border-l border-border pl-10">
                    <span className="text-slate-400 text-[10px] block mb-3 uppercase font-950 tracking-[0.2em]">Rank Growth</span>
                    <strong className="text-4xl font-950 text-success tabular-nums tracking-tighter italic">+180</strong>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </section>

      {/* Dynamic CTA */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="container">
          <div className="reveal-on-scroll relative p-12 lg:p-24 bg-[#8b5cf6] rounded-[40px] text-white text-center overflow-hidden border-2 border-white/20 shadow-[0_40px_100px_rgba(139,92,246,0.3)] group transition-all duration-500">
            {/* Minimal Decorative Elements */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/10 blur-[100px] rounded-full"></div>

            <div className="relative z-10 flex flex-col items-center">
              <h2 className="reveal-on-scroll delay-200 text-5xl md:text-7xl font-950 tracking-tighter mb-8 leading-tight">Ready to Sculpt Your Future?</h2>
              <p className="reveal-on-scroll delay-300 text-white/90 text-lg md:text-xl font-600 max-w-2xl mx-auto mb-16 leading-relaxed">
                Join Ideal Classes today and experience the perfect blend of traditional methodology and modern digital excellence.
              </p>

              <div className="reveal-on-scroll delay-400 flex flex-col sm:flex-row gap-8 justify-center items-center">
                <Link to="/admission" className="px-12 py-5 bg-white text-[#8b5cf6] rounded-2xl font-black text-lg tracking-wide hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl">
                  Register Now
                </Link>
                <Link to="/login" className="px-10 py-5 text-white font-black text-lg tracking-widest hover:translate-x-1 transition-all">
                  Self Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Branch Oversight */}
      <section className="branches-section py-32 bg-subtle">
        <div className="container">
          <div className="section-header reveal-on-scroll text-center mb-20">
             <span className="section-tag">Strategic Hubs</span>
             <h2 className="section-title">Visit Our Campuses</h2>
             <p className="text-slate-500 max-w-xl mx-auto font-600 leading-relaxed uppercase text-[10px] tracking-widest mt-4">Authorized Centers for Engineering & Science Excellence</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="reveal-on-scroll delay-100 group p-10 bg-card border border-border shadow-lg rounded-[32px] hover:border-primary/40 transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-[2.5] transition-transform duration-700"></div>
                <div className="relative z-10">
                   <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm animate-float-y-reverse"><MapPin size={24} /></div>
                   <h3 className="text-3xl font-950 mb-3 tracking-tighter italic text-main">RAMWADI<br /><span className="text-muted not-italic font-800 text-lg uppercase tracking-widest">Headquarters</span></h3>
                   <p className="text-secondary font-600 leading-loose mb-8">Near Mumbai- Goa Highway,<br />Diploma College Road, Ramwadi</p>
                   <div className="pt-8 border-t border-border flex items-center justify-between">
                      <span className="text-xs font-950 tracking-widest text-primary uppercase">Main Branch</span>
                      <ArrowRight size={20} className="text-muted group-hover:text-primary group-hover:translate-x-2 transition-transform duration-300" />
                   </div>
                </div>
             </div>
             <div className="reveal-on-scroll delay-200 group p-10 bg-card border border-border shadow-lg rounded-[32px] hover:border-success/40 transition-all cursor-pointer relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-success/5 rounded-full -mr-16 -mt-16 group-hover:scale-[2.5] transition-transform duration-700"></div>
                <div className="relative z-10">
                   <div className="w-14 h-14 rounded-2xl bg-success/10 text-success flex items-center justify-center mb-8 border border-success/20 group-hover:bg-success group-hover:text-white transition-all duration-500 shadow-sm animate-float-y"><MapPin size={24} /></div>
                   <h3 className="text-3xl font-950 mb-3 tracking-tighter italic text-main">PEN BRANCH<br /><span className="text-muted not-italic font-800 text-lg uppercase tracking-widest">Strategic Node</span></h3>
                   <p className="text-secondary font-600 leading-loose mb-8">1st Floor, Prathmesh Vishnu Appt,<br />Chavadi Naka, Pen</p>
                   <div className="pt-8 border-t border-border flex items-center justify-between">
                      <span className="text-xs font-950 tracking-widest text-success uppercase">Active Campus</span>
                      <ArrowRight size={20} className="text-muted group-hover:text-success group-hover:translate-x-2 transition-transform duration-300" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* High-End Cinematic Mega Footer */}
      <footer className="mt-64 pb-32 pt-20 bg-slate-950 text-white relative overflow-hidden">
        {/* Dynamic Atmospheric Elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse-glow"></div>
        <div className="absolute bottom-[-10%] left-[5%] w-[800px] h-[800px] bg-primary/10 blur-[200px] rounded-full animate-pulse-glow" style={{ animationDelay: '3s' }}></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Elite Branding Panel */}
            <div className="md:col-span-12 lg:col-span-5 p-8 sm:p-12 bg-white/5 border border-white/10 rounded-[40px] sm:rounded-[48px] backdrop-blur-3xl shadow-2xl flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-6 mb-12">
                  <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-[0_0_40px_rgba(var(--primary-rgb),0.3)] group-hover:rotate-12 transition-transform duration-500">
                    <GraduationCap size={36} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-950 tracking-tighter text-white uppercase italic leading-none">Ideal <span className="text-primary not-italic font-black">Classes</span></h2>
                    <p className="text-xs font-900 text-primary uppercase tracking-[0.4em] mt-3 opacity-60">Verified Excellence Since 2010</p>
                  </div>
                </div>
                <p className="text-slate-300 text-lg sm:text-xl font-600 leading-relaxed max-w-sm mb-12 sm:mb-16">
                  Nurturing academic precision and building a unified roadmap to engineering and science mastery for over a decade.
                </p>
              </div>

              <div className="flex gap-6 relative z-10">
                {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                  <button key={i} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black hover:-translate-y-3 transition-all duration-500 shadow-xl group">
                    <Icon size={24} className="group-hover:scale-110 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            {/* Tactical Navigation Panel */}
            <div className="md:col-span-6 lg:col-span-3 p-8 sm:p-12 bg-white/[0.03] border border-white/5 rounded-[40px] sm:rounded-[48px] backdrop-blur-2xl flex flex-col justify-between overflow-hidden relative">
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 w-full">
                <h3 className="text-xs font-900 text-slate-500 uppercase tracking-[0.4em] mb-12 border-l-4 border-primary pl-6">Navigation</h3>
                <ul className="space-y-8 list-none p-0 m-0">
                  {['Courses', 'Student Portal', 'Gallery', 'Achievements'].map((item) => (
                    <li key={item}>
                      <Link 
                        to={`/${item.toLowerCase().replace(' ', '')}`} 
                        className="text-slate-400 hover:text-white transition-all duration-500 font-700 text-xl flex items-center group w-max"
                      >
                        <span className="w-0 h-0.5 bg-primary group-hover:w-8 transition-all duration-500 mr-0 group-hover:mr-6"></span>
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Kinetic Contact Panel */}
            <div className="md:col-span-6 lg:col-span-4 p-8 sm:p-12 bg-white/[0.03] border border-white/5 rounded-[40px] sm:rounded-[48px] backdrop-blur-2xl flex flex-col justify-between overflow-hidden relative">
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <h3 className="text-xs font-900 text-slate-500 uppercase tracking-[0.4em] mb-12 border-l-4 border-primary pl-6">Connect</h3>
                <div className="space-y-12">
                  <div className="flex gap-8 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)]">
                       <MapPin size={24} />
                    </div>
                    <p className="text-slate-300 text-lg leading-relaxed font-700">
                      Near Mumbai-Goa Highway,<br />Diploma College Rd, Ramwadi
                    </p>
                  </div>
                  <div className="space-y-6 pt-12 border-t border-white/10">
                    <a href="tel:+918793309230" className="flex items-center gap-6 text-slate-100 hover:text-primary transition-all duration-500 text-2xl font-black tracking-tight group w-max">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                         <Phone size={24} />
                      </div>
                      +91 87933 09230
                    </a>
                    <a href="tel:+919028289230" className="flex items-center gap-6 text-slate-100 hover:text-primary transition-all duration-500 text-2xl font-black tracking-tight group w-max">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
                         <Phone size={24} />
                      </div>
                      +91 90282 89230
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto pt-10 relative z-10">
                 <a href="mailto:idealclasses@gmail.com" className="hover:text-primary transition-colors text-slate-400 font-900 text-lg tracking-widest flex items-center gap-4 group uppercase">
                    <Zap size={20} className="text-primary group-hover:scale-125 transition-transform" /> idealclasses@gmail.com
                 </a>
              </div>
            </div>

          </div>

          {/* Final Architectural Footnote */}
          <div className="mt-8 sm:mt-16 p-8 sm:p-12 bg-white/[0.02] border border-white/5 rounded-[32px] sm:rounded-[40px] flex flex-col lg:flex-row justify-between items-center gap-10 relative z-10">
             <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
                <p className="text-slate-500 text-xs font-950 tracking-[0.2em] uppercase">© 2026 IDEAL CLASSES REGIME.</p>
                <div className="h-6 w-px bg-white/10 hidden lg:block"></div>
                <p className="text-slate-600 text-xs font-800 tracking-wider uppercase italic">Precise Academic Guidance For Engineering & Science Experts.</p>
             </div>
             <div className="flex gap-12">
                <a href="#" className="text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.4em] opacity-60 hover:opacity-100">Privacy Protocol</a>
                <a href="#" className="text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.4em] opacity-60 hover:opacity-100">Structural Terms</a>
             </div>
          </div>
        </div>
      </footer>
      <style>{`
        .landing-container {
          background: var(--bg-main);
          color: var(--text-main);
          font-family: var(--font-main);
        }
      `}</style>
    </div>
  );
};

export default LandingPage;

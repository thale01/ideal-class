import React from 'react';
import { useGallery } from '../context/GalleryContext';
import { Trophy, Award, Star, TrendingUp, GraduationCap, ChevronRight, Zap, Flame, LayoutGrid, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { API_URL as BASE_URL } from '../config/api';
const API_BASE = BASE_URL.replace('/api', '');

const Gallery = () => {
  const { toppers = [], achievements = [] } = useGallery() || {};

  // Mock data if context is empty for preview purposes
  const displayToppers = toppers.length > 0 ? toppers : [
    { name: "Aarav Sharma", exam: "MHT-CET 2025", perc: "99.99%", achievement: "State Rank #1" },
    { name: "Priya Patel", exam: "NEET UG", perc: "685/720", achievement: "AIR 124" },
    { name: "Rohan Desai", exam: "JEE MAIN", perc: "99.85%", achievement: "IIT BOMBAY" },
    { name: "Sneha K.", exam: "12TH BOARDS", perc: "100/100", achievement: "PERFECT SCORE" }
  ];

  return (
    <div className="min-h-screen bg-theme transition-colors duration-500 overflow-hidden relative">
      <Navbar />
      
      {/* High-End Immersive Background System */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Cinematic Mesh Gradients */}
        <div className="absolute -top-[20%] -right-[10%] w-[100vw] h-[100vw] bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)] animate-pulse-glow"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[80vw] h-[80vw] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1)_0%,transparent_70%)] animate-pulse-glow" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-[20%] left-[15%] w-[40vw] h-[40vw] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)] animate-pulse-glow" style={{ animationDelay: '5s' }}></div>
        
        {/* Dynamic Light Beams */}
        <div className="absolute inset-0 opacity-[0.1]" style={{ 
          background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)',
          backgroundSize: '200% 200%',
          animation: 'shimmer 15s linear infinite'
        }}></div>

        {/* Sophisticated Dot-Mesh Overlay */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ 
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 0)', 
          backgroundSize: '48px 48px' 
        }}></div>
        
        {/* Glass Edge Highlights */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      </div>

      <div className="pt-32 sm:pt-40 pb-20 sm:pb-32 container mx-auto px-6 relative z-10">
        {/* Cinematic Header */}
        <header className="text-center mb-16 sm:mb-32 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-black tracking-[0.2em] text-[9px] sm:text-[10px] uppercase mb-8 sm:mb-12 animate-fadeIn opacity-0" style={{ animationFillMode: 'forwards' }}>
             <Trophy size={12} className="animate-bounce" /> The Absolute Elite
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-9xl font-900 tracking-tighter leading-[0.9] mb-8 sm:mb-12 animate-fadeIn delay-100 opacity-0" style={{ animationFillMode: 'forwards' }}>
             Hall of <br className="hidden sm:block" /><span className="text-gradient drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]">Achievement</span>
          </h1>
          <p className="text-secondary text-lg sm:text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed animate-fadeIn delay-200 opacity-0" style={{ animationFillMode: 'forwards' }}>
             A visual testament to a decade of academic dominance. Celebrating the students who redefined excellence through precision and perseverance.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-20 max-w-4xl mx-auto animate-fadeIn delay-300 opacity-0" style={{ animationFillMode: 'forwards' }}>
             <div className="p-8 rounded-3xl bg-theme/5 border border-white/5 backdrop-blur-sm group hover:border-primary/30 transition-all duration-500">
                <span className="block text-5xl font-900 text-primary tracking-tighter mb-2 group-hover:scale-110 transition-transform">500+</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Top Rankers</span>
             </div>
             <div className="p-8 rounded-3xl bg-theme/5 border border-white/5 backdrop-blur-sm group hover:border-primary/30 transition-all duration-500">
                <span className="block text-5xl font-900 text-primary tracking-tighter mb-2 group-hover:scale-110 transition-transform">100%</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Board Success</span>
             </div>
             <div className="p-8 rounded-3xl bg-theme/5 border border-white/5 backdrop-blur-sm group hover:border-primary/30 transition-all duration-500">
                <span className="block text-5xl font-900 text-primary tracking-tighter mb-2 group-hover:scale-110 transition-transform">12+</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">Specializations</span>
             </div>
          </div>
        </header>

        {/* Portraits Gallery Section */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 border-b border-white/5 pb-10">
            <h2 className="text-4xl font-900 tracking-tight flex items-center gap-4">
              <span className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <ImageIcon size={24} />
              </span>
              Portraits of Success
            </h2>
            <div className="flex p-1.5 bg-theme/5 rounded-2xl border border-white/5 backdrop-blur-xl">
               <button className="px-8 py-3 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-[0_10px_20px_var(--primary-glow)] flex items-center gap-2 transition-all hover:scale-105">
                  <LayoutGrid size={14}/> Grid View
               </button>
               <button className="px-8 py-3 font-black text-muted text-[10px] uppercase tracking-widest rounded-xl hover:text-white transition-colors">
                  List View
               </button>
            </div>
          </div>

          {/* Luxury Topper Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {displayToppers.map((topper, i) => (
              <div key={i} className={`animate-fadeIn delay-${(i % 4 + 1) * 100} opacity-0 group relative perspective-1000`} style={{ animationFillMode: 'forwards' }}>
                <div className="relative bg-theme/5 border border-white/5 rounded-[40px] p-4 transition-all duration-700 hover:border-primary/50 hover:bg-theme/10 hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)] group-hover:-translate-y-4 backdrop-blur-xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-all duration-700"></div>
                  
                  {/* Portrait Area */}
                  <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden mb-8 bg-slate-900/40 border border-white/5 shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity z-10"></div>
                    
                    {topper.photoUrl ? (
                      <img src={`${API_BASE}${topper.photoUrl}`} alt={topper.name} className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-primary/10 group-hover:text-primary/30 transition-all duration-700">
                        <ImageIcon size={64} strokeWidth={0.5}/>
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
                      <span className="bg-slate-950/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-white font-black text-[9px] uppercase tracking-[0.2em] shadow-2xl">
                        {topper.achievement || 'TOP RANKER'}
                      </span>
                      <Award size={24} className="text-secondary opacity-50 group-hover:opacity-100 transition-opacity animate-pulse" />
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 z-20 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="text-white text-[12px] font-medium italic leading-relaxed text-center">
                        "Redefining academic excellence through strategic mastery."
                      </p>
                    </div>
                  </div>

                  {/* Student Details */}
                  <div className="px-4 pb-4">
                    <div className="flex items-center gap-3 mb-2">
                       <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{topper.exam}</p>
                       <div className="h-px flex-grow bg-white/10"></div>
                    </div>
                    <h4 className="text-3xl font-900 tracking-tighter mb-8 group-hover:text-primary transition-colors duration-500">{topper.name}</h4>
                    
                    <div className="flex items-center justify-between p-6 rounded-[28px] bg-white/5 border border-white/5 group-hover:bg-primary group-hover:border-primary transition-all duration-700">
                       <div>
                          <p className="text-[9px] font-black text-muted group-hover:text-black/60 uppercase tracking-widest mb-1">Scholar Score</p>
                          <p className="text-3xl font-900 text-white group-hover:text-black tracking-tighter leading-none">{topper.marks || topper.perc || '99.9%'}</p>
                       </div>
                       <ChevronRight size={24} className="text-primary group-hover:text-black group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Institutional Milestones */}
        <section className="mt-56">
           <div className="flex flex-col items-center text-center mb-24">
              <span className="text-[10px] font-black text-muted uppercase tracking-[0.3em] mb-4">Milestone excellence</span>
              <h2 className="text-5xl font-900 tracking-tighter mb-8">Quality Verified</h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {achievements.slice(0, 3).map((item, i) => (
                <div key={i} className="p-12 rounded-[48px] bg-theme/5 border border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col h-full backdrop-blur-sm">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-10 border border-emerald-500/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                     {i % 2 === 0 ? <Award size={32}/> : <TrendingUp size={32}/>}
                  </div>
                  <h3 className="text-2xl font-900 mb-6 tracking-tight group-hover:text-emerald-400 transition-colors uppercase italic">{item.title || "Academic Excellence"}</h3>
                  <p className="text-secondary font-medium leading-relaxed mb-10">{item.description || "Consistently delivering high-impact results across all technical specializations."}</p>
                  <div className="mt-auto flex items-center gap-3 text-emerald-500/60 font-black text-[9px] uppercase tracking-widest group-hover:text-emerald-500 transition-colors">
                     <span>Verified Accreditation</span>
                     <div className="h-px flex-grow bg-emerald-500/10"></div>
                     <Star size={10} fill="currentColor" />
                  </div>
                </div>
              ))}
           </div>
        </section>

        {/* Global CTA */}
        <section className="mt-24 sm:mt-56 relative overflow-hidden rounded-[40px] sm:rounded-[60px] p-10 sm:p-16 md:p-32 border border-white/10 group bg-slate-950 isolate">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/10 opacity-50"></div>
           <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1.5px,transparent_0)] bg-[size:40px_40px]"></div>
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 blur-[120px] rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
           
           <div className="relative z-10 text-center flex flex-col items-center">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-primary text-white rounded-2xl sm:rounded-3xl flex items-center justify-center mb-10 sm:mb-16 shadow-[0_20px_40px_var(--primary-glow)] rotate-6 group-hover:rotate-12 transition-all duration-500">
                 <GraduationCap size={32} className="sm:hidden" />
                 <GraduationCap size={48} className="hidden sm:block" />
              </div>
              <h2 className="text-4xl sm:text-6xl md:text-8xl font-900 text-white tracking-tighter leading-[0.9] mb-8 sm:mb-12">
                Join the <br className="hidden sm:block" /> <span className="text-gradient drop-shadow-[0_0_20px_var(--primary-glow)] italic">Elite Circle</span>
              </h2>
              <p className="text-slate-400 text-lg sm:text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-12 sm:mb-20">Our next enrollment cycle for high-performers is now open. Secure your seat among the district's best.</p>
              
              <div className="flex flex-col sm:flex-row gap-8">
                 <Link to="/admission" className="btn-premium btn-primary px-16 py-6 text-sm uppercase tracking-[0.2em]">Enrol Now</Link>
                 <Link to="/login" className="btn-premium px-16 py-6 text-sm uppercase tracking-[0.2em] bg-white/5 border border-white/10 text-white backdrop-blur-2xl hover:bg-white/10">Student Portal</Link>
              </div>
           </div>
        </section>
      </div>

      <style>{`
        .bg-theme { background-color: var(--bg-main); }
        .text-primary { color: var(--primary); }
        .bg-primary { background-color: var(--primary); }
        .text-secondary { color: var(--text-secondary); }
        .text-muted { color: var(--text-muted); }
        .text-gradient { 
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }
        .animate-pulse-glow { animation: pulse-glow 8s ease-in-out infinite; }

        @keyframes shimmer {
          0% { background-position: 200% 200%; }
          100% { background-position: -200% -200%; }
        }

        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
};

export default Gallery;

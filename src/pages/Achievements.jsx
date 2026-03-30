import React from 'react';
import Navbar from '../components/Navbar';
import { Medal, Trophy, Star, TrendingUp, Users, Target } from 'lucide-react';

const MetricCard = ({ icon: Icon, value, label, color, delay }) => (
  <div className={`animate-fadeIn ${delay} opacity-0 p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center group hover:bg-white/10 hover:border-white/20 transition-all duration-500 shadow-xl overflow-hidden relative`} style={{animationFillMode: 'forwards'}}>
    <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${color} opacity-20 blur-[40px] rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
    <div className={`mb-6 p-4 rounded-full bg-white/5 ${color.replace('bg-', 'text-')} group-hover:scale-110 transition-transform duration-500 border border-white/5`}>
      <Icon size={28} />
    </div>
    <span className="text-4xl lg:text-5xl font-950 mb-2 tracking-tighter">{value}</span>
    <span className="text-sm font-800 uppercase tracking-widest text-slate-400">{label}</span>
  </div>
);

const Achievements = () => {
  return (
    <div className="min-h-screen overflow-hidden">
      <Navbar />
      
      {/* Dynamic Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[10%] right-[20%] w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[20%] left-[10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="pt-40 pb-32 container mx-auto px-6 relative z-10">
        <div className="text-center mb-24 max-w-4xl mx-auto">
           <div className="inline-block px-5 py-2 rounded-full bg-white/5 border border-white/10 text-purple-400 font-bold tracking-widest text-xs uppercase mb-8 animate-fadeIn delay-100 opacity-0" style={{animationFillMode: 'forwards'}}>
             Verified Success
           </div>
           <h1 className="text-6xl lg:text-8xl font-950 tracking-tighter mb-8 animate-fadeIn delay-200 opacity-0 flex items-center justify-center gap-4" style={{animationFillMode: 'forwards'}}>
             Our <span className="text-[#c084fc] drop-shadow-[0_0_20px_rgba(192,132,252,0.4)]">Legacy</span> 🎓
           </h1>
           <p className="text-slate-400 text-xl font-500 leading-relaxed animate-fadeIn delay-300 opacity-0" style={{animationFillMode: 'forwards'}}>
             A testament to hard work and dedication. Discover the incredible milestones and unprecedented academic successes our students have achieved globally.
           </p>
        </div>
        
        {/* Hall of Fame Student Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-16 animate-fadeIn delay-300 opacity-0" style={{animationFillMode: 'forwards'}}>
             <div className="w-16 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-6"></div>
             <h2 className="text-4xl lg:text-5xl font-950 text-center">
               Hall of <span className="text-[#f472b6] drop-shadow-[0_0_20px_rgba(244,114,182,0.4)]">Fame</span>
             </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Student Card 1 */}
            <div className="animate-fadeIn delay-400 opacity-0 p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition-all duration-500 group flex flex-col items-center text-center relative overflow-hidden" style={{animationFillMode: 'forwards'}}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 p-1 mb-6 shadow-[0_0_30px_rgba(168,85,247,0.4)] group-hover:scale-110 transition-transform duration-500">
                <div className="w-full h-full rounded-full bg-slate-900 border-[3px] border-transparent flex items-center justify-center text-3xl font-900 text-white">
                  A
                </div>
              </div>
              <div className="w-fit px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-900 tracking-widest uppercase mb-4 border border-purple-500/30">
                State Rank #1
              </div>
              <h3 className="text-2xl font-900 mb-2">Aarav Sharma</h3>
              <p className="text-purple-400 font-950 text-xl tracking-tight mb-4">99.99%tile</p>
              <div className="w-full pt-6 border-t border-white/10 text-slate-400 text-sm font-600 tracking-widest uppercase mt-auto">
                MHT-CET 2025
              </div>
            </div>

            {/* Student Card 2 */}
            <div className="animate-fadeIn delay-500 opacity-0 p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all duration-500 group flex flex-col items-center text-center relative overflow-hidden" style={{animationFillMode: 'forwards'}}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 p-1 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.4)] group-hover:scale-110 transition-transform duration-500">
                <div className="w-full h-full rounded-full bg-slate-900 border-[3px] border-transparent flex items-center justify-center text-3xl font-900 text-white">
                  P
                </div>
              </div>
              <div className="w-fit px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-900 tracking-widest uppercase mb-4 border border-blue-500/30">
                AIR 124
              </div>
              <h3 className="text-2xl font-900 text-white mb-2">Priya Patel</h3>
              <p className="text-blue-400 font-950 text-xl tracking-tight mb-4">Score: 685/720</p>
              <div className="w-full pt-6 border-t border-white/10 text-slate-400 text-sm font-600 tracking-widest uppercase mt-auto">
                NEET UG
              </div>
            </div>

            {/* Student Card 3 */}
            <div className="animate-fadeIn delay-[600ms] opacity-0 p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-white/10 transition-all duration-500 group flex flex-col items-center text-center relative overflow-hidden" style={{animationFillMode: 'forwards'}}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 p-1 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform duration-500">
                <div className="w-full h-full rounded-full bg-slate-900 border-[3px] border-transparent flex items-center justify-center text-3xl font-900 text-white">
                  R
                </div>
              </div>
              <div className="w-fit px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-900 tracking-widest uppercase mb-4 border border-emerald-500/30">
                IIT BOMBAY
              </div>
              <h3 className="text-2xl font-900 text-white mb-2">Rohan Desai</h3>
              <p className="text-emerald-400 font-950 text-xl tracking-tight mb-4">99.85%tile</p>
              <div className="w-full pt-6 border-t border-white/10 text-slate-400 text-sm font-600 tracking-widest uppercase mt-auto">
                JEE MAIN
              </div>
            </div>

            {/* Student Card 4 */}
            <div className="animate-fadeIn delay-[700ms] opacity-0 p-8 rounded-[32px] bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-white/10 transition-all duration-500 group flex flex-col items-center text-center relative overflow-hidden" style={{animationFillMode: 'forwards'}}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 p-1 mb-6 shadow-[0_0_30px_rgba(236,72,153,0.4)] group-hover:scale-110 transition-transform duration-500">
                <div className="w-full h-full rounded-full bg-slate-900 border-[3px] border-transparent flex items-center justify-center text-3xl font-900 text-white">
                  S
                </div>
              </div>
              <div className="w-fit px-4 py-1.5 rounded-full bg-pink-500/20 text-pink-300 text-xs font-900 tracking-widest uppercase mb-4 border border-pink-500/30">
                PERFECT SCORE
              </div>
              <h3 className="text-2xl font-900 text-white mb-2">Sneha K.</h3>
              <p className="text-pink-400 font-950 text-xl tracking-tight mb-4">100/100</p>
              <div className="w-full pt-6 border-t border-white/10 text-slate-400 text-sm font-600 tracking-widest uppercase mt-auto">
                12TH BOARDS
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;

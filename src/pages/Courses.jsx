import React from 'react';
import Navbar from '../components/Navbar';
import { GraduationCap, BookOpen, Trophy, ChevronRight } from 'lucide-react';

const CourseCategory = ({ title, icon: Icon, courses, color, delay }) => (
  <div className={`animate-fadeIn ${delay} p-8 lg:p-10 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all duration-500 group flex flex-col h-full relative overflow-hidden`}>
    {/* Decorative Background Glow per card */}
    <div className={`absolute top-0 right-0 w-64 h-64 opacity-20 blur-[80px] rounded-full pointer-events-none transition-transform duration-700 group-hover:scale-150 ${color}`}></div>

    <div className="mb-8 p-4 bg-white/5 rounded-2xl w-max border border-white/10 group-hover:scale-110 transition-transform duration-500">
      <Icon size={32} className="text-white" />
    </div>
    
    <h2 className="text-3xl font-900 mb-8 tracking-tight">{title}</h2>
    
    <ul className="space-y-4 m-0 p-0 list-none flex-grow relative z-10">
      {courses.map((course, index) => (
        <li key={index} className="flex items-center gap-4 text-slate-300 group/item cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex flex-center border border-white/5 group-hover/item:bg-white/20 group-hover/item:border-white/30 transition-all duration-300">
            <ChevronRight size={14} className="text-white opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 transition-all duration-300" />
          </div>
          <span className="text-lg font-500 group-hover/item:text-white transition-colors">{course}</span>
        </li>
      ))}
    </ul>
    
    <div className="pb-4"></div>
  </div>
);

const Courses = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[10%] left-[5%] w-[800px] h-[800px] bg-blue-600/10 blur-[150px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="pt-40 pb-32 container mx-auto px-6 relative z-10">
        <div className="text-center mb-24 max-w-4xl mx-auto">
           <div className="inline-block px-5 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 font-bold tracking-widest text-xs uppercase mb-8 delay-100 animate-fadeIn opacity-0" style={{animationFillMode: 'forwards'}}>
             Academic Structure
           </div>
           <h1 className="text-6xl lg:text-7xl font-950 tracking-tighter mb-8 animate-fadeIn delay-200 opacity-0" style={{animationFillMode: 'forwards'}}>
             Start Learning 🚀
           </h1>
           <p className="text-slate-400 text-xl font-500 leading-relaxed animate-fadeIn delay-300 opacity-0" style={{animationFillMode: 'forwards'}}>
             Access notes, videos & tests in one place
           </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          <CourseCategory 
            title="Engineering Focus" 
            icon={GraduationCap} 
            color="bg-emerald-500"
            delay="delay-100"
            courses={[
              "Computer / IT",
              "Civil",
              "Mechanical",
              "Electrical",
              "Chemical",
              "Instrumentation"
            ]} 
          />
          
          <CourseCategory 
            title="Academic Science" 
            icon={BookOpen} 
            color="bg-purple-500"
            delay="delay-200"
            courses={[
              "11th Science",
              "12th Science"
            ]} 
          />
          
          <CourseCategory 
            title="Entrance Mastery" 
            icon={Trophy} 
            color="bg-blue-500"
            delay="delay-300"
            courses={[
              "MHT-CET",
              "JEE",
              "NATA",
              "NEET"
            ]} 
          />
        </div>
      </div>
    </div>
  );
};

export default Courses;

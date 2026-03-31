import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmission } from '../context/AdmissionContext';
import { useTheme } from '../context/ThemeContext';
import { FileText, User, Mail, Phone, GraduationCap, ArrowLeft, Send, CheckCircle, Sun, Moon } from 'lucide-react';
import logo from '../assets/logo.png';

const AdmissionForm = () => {
   const { submitApplication } = useAdmission();
   const { theme, toggleTheme } = useTheme();
   const navigate = useNavigate();
   const [isSubmitted, setIsSubmitted] = useState(false);
   const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      classApplied: '11th Science',
      branch: '',
      batch: 'Diploma Engineering (Comp / IT / Civil / Mech / Elect / Chem / Inst)',
      previousScore: '',
      message: '',
      agreedToPrivacy: false
   });

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.agreedToPrivacy) {
         alert("Please agree to the privacy policy to proceed.");
         return;
      }
      const success = await submitApplication(formData);
      if (success) {
         setIsSubmitted(true);
         setTimeout(() => {
            navigate('/login');
         }, 5000);
      } else {
         alert("Submission failed. Please try again.");
      }
   };

   const batches = [
      'Diploma Engineering (Comp / IT / Civil / Mech / Elect / Chem / Inst)',
      'Degree Engineering (All Branches)',
      '11th / 12th Science (State/CBSE)',
      'JEE / NEET Masterclass',
      'MHT-CET / NATA Specialized'
   ];

   if (isSubmitted) {
      return (
         <div className="min-h-screen bg-main flex items-center justify-center p-6 transition-colors duration-500">
            <div className="card-premium max-w-lg w-full text-center animate-fadeIn py-16">
               <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-8 border border-success/20">
                  <CheckCircle size={48} className="text-success" />
               </div>
               <h1 className="text-3xl font-black text-bright tracking-tight mb-4">Application Sent!</h1>
               <p className="text-dim font-medium leading-relaxed mb-10">Your admission request has been dispatched to Ideal Classes securely. Our counseling team will reach out via the provided contact number.</p>
               <div className="p-4 rounded-xl bg-alt mb-8">
                  <p className="text-[10px] font-black uppercase tracking-widest text-dim">Redirecting in 5 seconds...</p>
               </div>
               <Link to="/login" className="btn-premium btn-premium-primary w-full py-4 text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20">Return to Portal</Link>
            </div>
         </div>
      );
   }

   return (
       <div className="min-h-screen bg-main flex items-center justify-center p-3 sm:p-6 relative transition-colors duration-500">

          <div className="card-premium w-full max-w-2xl animate-fadeUp my-6 sm:my-10 relative overflow-hidden p-6 sm:p-10 md:p-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-success/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

            <header className="mb-8 sm:mb-10 relative z-10 flex flex-col sm:flex-row items-start justify-between gap-6 sm:gap-4">
               <div className="w-full sm:w-auto">
                  <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-dim hover:text-primary transition-all mb-6 sm:mb-8">
                     <ArrowLeft size={16} /> Retreat to Login
                  </Link>
                  <div className="flex items-center gap-4">
                     <img src={logo} alt="Ideal Classes Logo" className="h-10 sm:h-14 w-auto object-contain" />
                      <div>
                         <h1 className="text-xl sm:text-3xl font-black text-bright tracking-tight italic">IDEAL<br className="sm:hidden" /> CLASSES</h1>
                         <p className="badge-premium badge-primary text-[8px] sm:text-[9px] font-black uppercase tracking-widest mt-1 sm:mt-2 px-2 sm:px-3 py-0.5">Admission Entry</p>
                      </div>
                  </div>
               </div>

               <button
                  onClick={toggleTheme}
                  className="w-12 h-12 rounded-xl bg-alt border border-subtle flex items-center justify-center text-dim hover:text-primary transition-all shadow-sm hover:border-primary/50"
                  title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
               >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
               </button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
               <div className="space-y-6">
                  <div>
                     <label className="text-[10px] font-black text-dim uppercase tracking-widest block mb-2">Student Name</label>
                     <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-dim group-focus-within:text-primary transition-colors" size={18} />
                        <input type="text" className="input-premium pl-12 h-14 font-bold text-sm" placeholder="Enter your full name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="text-[10px] font-black text-dim uppercase tracking-widest block mb-2">Email Address</label>
                        <div className="relative group">
                           <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-dim group-focus-within:text-primary transition-colors" size={18} />
                           <input type="email" className="input-premium pl-12 h-14 font-bold text-sm" placeholder="scholar@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                        </div>
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-dim uppercase tracking-widest block mb-2">Mobile Number</label>
                        <div className="relative group">
                           <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-dim group-focus-within:text-primary transition-colors" size={18} />
                           <input type="tel" className="input-premium pl-12 h-14 font-bold text-sm" placeholder="+91 8899889988" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-subtle">
                     <div>
                        <label className="text-[10px] font-black text-dim uppercase tracking-widest block mb-2">Target Class</label>
                        <select className="input-premium h-14 font-bold text-sm" value={formData.classApplied} onChange={(e) => setFormData({ ...formData, classApplied: e.target.value })} required>
                           <option>11th Science</option>
                           <option>12th Science</option>
                           <option>Diploma Engineering</option>
                           <option>Degree Engineering</option>
                        </select>
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-dim uppercase tracking-widest block mb-2">Desired Masterclass</label>
                        <select className="input-premium h-14 font-bold text-sm" value={formData.batch} onChange={(e) => setFormData({ ...formData, batch: e.target.value })} required>
                           {batches.map(batch => <option key={batch} value={batch}>{batch}</option>)}
                        </select>
                     </div>
                  </div>

                  {(formData.classApplied === 'Diploma Engineering' || formData.classApplied === 'Degree Engineering') && (
                     <div className="animate-fadeIn p-6 bg-primary/5 rounded-[32px] border border-primary/20">
                        <label className="text-[10px] font-black text-primary uppercase tracking-widest block mb-4">Engineering Specialization (Branch)</label>
                        <select 
                           className="input-premium h-12 font-bold text-xs bg-surface/50" 
                           value={formData.branch} 
                           onChange={(e) => setFormData({ ...formData, branch: e.target.value })} 
                           required
                        >
                           <option value="">Select your branch...</option>
                           <option>Computer Science / IT</option>
                           <option>Mechanical Engineering</option>
                           <option>Civil Engineering</option>
                           <option>Electrical Engineering</option>
                           <option>Chemical Engineering</option>
                           <option>Instrumentation Engineering</option>
                        </select>
                     </div>
                  )}

                  <div>
                     <label className="text-[10px] font-black text-dim uppercase tracking-widest block mb-2">Academic Consistency (Previous %)</label>
                     <input type="text" className="input-premium h-14 font-bold text-sm" placeholder="e.g. 95% in Board Exams" value={formData.previousScore} onChange={(e) => setFormData({ ...formData, previousScore: e.target.value })} />
                  </div>

                  <div>
                     <label className="text-[10px] font-black text-dim uppercase tracking-widest block mb-2">Administrative Brief (Optional)</label>
                     <textarea className="input-premium min-h-[120px] resize-none pt-4 font-bold text-sm" placeholder="State any specific requests for the admin..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                     <input 
                        type="checkbox" 
                        id="privacy" 
                        className="mt-1 w-5 h-5 rounded border-subtle transition-all cursor-pointer accent-primary"
                        checked={formData.agreedToPrivacy}
                        onChange={() => setFormData({ ...formData, agreedToPrivacy: !formData.agreedToPrivacy })}
                     />
                     <label htmlFor="privacy" className="text-xs font-bold text-dim cursor-pointer select-none leading-relaxed">
                        I agree to the <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> and authorize Ideal Classes to contact me regarding my academic interests.
                     </label>
                  </div>
               </div>

               <button type="submit" className="btn-premium btn-premium-primary w-full py-5 mt-4 text-xs font-black uppercase tracking-[0.2em] [word-spacing:0.2em] shadow-xl shadow-primary/20">
                  <Send size={18} className="mr-2 inline" /> Transmit Application
               </button>
            </form>
         </div>
      </div>
   );
};

export default AdmissionForm;

import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import SubjectCard from '../../components/admin/SubjectCard';
import { Plus, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCourse } from '../../context/CourseContext';

const AdminDashboard = () => {
  const { subjects, addSubject, deleteSubject, updateSubject } = useCourse();
  const { user, loading: authLoading } = useAuth();
  
  // Debug mode for role verification
  React.useEffect(() => {
    console.group('Admin Access Diagnostics');
    console.log('User Authenticated:', !!user);
    console.log('User Role:', user?.role);
    console.log('Auth Loading State:', authLoading);
    console.groupEnd();
  }, [user, authLoading]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', icon: '📘', category: '', color: '#000000' });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addSubject(newSubject);
      setMessage({ text: 'Subject created successfully!', type: 'success' });
      setShowAddModal(false);
      setNewSubject({ name: '', icon: '📘', category: '', color: '#000000' });
    } catch (err) {
      setMessage({ text: 'Deployment failed.', type: 'error' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  const handleUpdateSubject = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateSubject(editingSubject._id, editingSubject);
      setMessage({ text: 'Subject updated successfully!', type: 'success' });
      setShowEditModal(false);
    } catch (err) {
      setMessage({ text: 'Update failed.', type: 'error' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  return (
    <AdminLayout 
      title="Curriculum Hub"
      headerActions={
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
        >
          <Plus size={16} /> New Subject
        </button>
      }
    >
      <div className="mb-4">
        {user?.role !== 'admin' && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl mb-8">
            <p className="text-red-500 text-xs font-black uppercase tracking-widest leading-none">Security Alert: Unauthorized Access Attempt Detected</p>
            <p className="text-red-500/70 text-[10px] font-bold mt-2 font-mono">Principal Identity Masking: {user?.role || 'null'}</p>
          </div>
        )}
        
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic leading-none mb-2">Welcome, {user?.name || 'Administrator'}</h1>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Protocol Management & Curriculum Orchestration</p>
      </div>

      {!subjects || subjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white border-2 border-dashed border-slate-200 rounded-[3rem]">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-6 font-bold text-3xl">!</div>
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight italic">No Active Protocols</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Initialize your curriculum structure to begin</p>
          <button 
             onClick={() => setShowAddModal(true)}
             className="mt-8 px-8 py-4 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            Establish First Subject
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {subjects.map(subject => (
            <SubjectCard 
              key={subject._id || Math.random()} 
              subject={subject} 
              onDelete={deleteSubject}
              onEdit={(s) => { setEditingSubject(s); setShowEditModal(true); }}
            />
          ))}
        </div>
      )}

      {/* Create Subject Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl animate-fadeUp relative overflow-hidden border border-slate-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[64px] -mr-16 -mt-16"></div>
            
            <div className="flex items-start justify-between relative z-10 mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic leading-none">New Curriculum</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Initialize Subject Entity</p>
              </div>
              <button 
                 onClick={() => setShowAddModal(false)} 
                 className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-black hover:bg-slate-100 transition-all shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-6 relative z-10">
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1 font-bold">Nomenclature</label>
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-slate-100 outline-none transition-all" 
                    placeholder="e.g. ADVANCED CALCULUS" 
                    value={newSubject.name} 
                    onChange={e => setNewSubject({ ...newSubject, name: e.target.value })} 
                    required 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1 font-bold">Strategy/Board</label>
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-slate-100 outline-none transition-all" 
                    placeholder="e.g. CBSE XII" 
                    value={newSubject.category} 
                    onChange={e => setNewSubject({ ...newSubject, category: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1 font-bold">Avatar</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl h-14 px-6 text-slate-900 font-bold outline-none"
                    value={newSubject.icon}
                    onChange={e => setNewSubject({ ...newSubject, icon: e.target.value })}
                  >
                    <option>📘</option><option>🧪</option><option>🔢</option><option>🌍</option><option>⚖️</option><option>🧬</option><option>⚛️</option>
                  </select>
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1 font-bold">Protocol Color</label>
                   <div className="flex items-center gap-3 h-14 bg-slate-50 border border-slate-200 rounded-2xl px-4">
                      <input type="color" className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer p-0" value={newSubject.color} onChange={e => setNewSubject({...newSubject, color: e.target.value})} />
                      <span className="text-[10px] font-black text-slate-900 tracking-widest">{newSubject.color.toUpperCase()}</span>
                   </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">Abort</button>
                <button type="submit" disabled={isLoading} className="flex-1 bg-black text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-slate-800 transition-all disabled:opacity-50">
                  {isLoading ? 'Processing...' : 'Establish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Subject Modal */}
      {showEditModal && editingSubject && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl animate-fadeUp relative overflow-hidden border border-slate-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[64px] -mr-16 -mt-16"></div>
            
            <div className="flex items-start justify-between relative z-10 mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic leading-none">Modify Protocol</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Update Subject Entity Information</p>
              </div>
              <button 
                 onClick={() => setShowEditModal(false)} 
                 className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-black hover:bg-slate-100 transition-all shadow-sm"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateSubject} className="space-y-6 relative z-10">
              <div className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1 font-bold">Nomenclature</label>
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-slate-100 outline-none transition-all" 
                    placeholder="e.g. ADVANCED CALCULUS" 
                    value={editingSubject.name} 
                    onChange={e => setEditingSubject({ ...editingSubject, name: e.target.value })} 
                    required 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1 font-bold">Strategy/Board</label>
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-6 text-slate-900 font-bold focus:bg-white focus:ring-4 focus:ring-slate-100 outline-none transition-all" 
                    placeholder="e.g. CBSE XII" 
                    value={editingSubject.category} 
                    onChange={e => setEditingSubject({ ...editingSubject, category: e.target.value })} 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1 font-bold">Avatar</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl h-14 px-6 text-slate-900 font-bold outline-none"
                    value={editingSubject.icon}
                    onChange={e => setEditingSubject({ ...editingSubject, icon: e.target.value })}
                  >
                    <option>📘</option><option>🧪</option><option>🔢</option><option>🌍</option><option>⚖️</option><option>🧬</option><option>⚛️</option>
                  </select>
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1 font-bold">Protocol Color</label>
                   <div className="flex items-center gap-3 h-14 bg-slate-50 border border-slate-200 rounded-2xl px-4">
                      <input type="color" className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer p-0" value={editingSubject.color} onChange={e => setEditingSubject({...editingSubject, color: e.target.value})} />
                      <span className="text-[10px] font-black text-slate-900 tracking-widest">{editingSubject.color.toUpperCase()}</span>
                   </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all">Abort</button>
                <button type="submit" disabled={isLoading} className="flex-1 bg-black text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-slate-800 transition-all disabled:opacity-50">
                  {isLoading ? 'Processing...' : 'Deploy Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Toast */}
      {message.text && (
         <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[2000] px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl animate-fadeDown ${message.type === 'success' ? 'bg-black text-white' : 'bg-red-500 text-white'}`}>
            {message.text}
         </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;

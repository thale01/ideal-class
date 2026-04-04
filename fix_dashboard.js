const fs = require('fs');
const path = 'src/pages/TeacherDashboard.jsx';
const content = fs.readFileSync(path, 'utf8').split('\n');

// We want to replace from line 968 to line 1102 (inclusive)
// In a 0-indexed array, that's index 967 to index 1101
const startLine = 968; 
const endLine = 1102; 

const fixedBlock = `               {activeTab === 'settings' && (
                  <div className=\"space-y-12 animate-fadeUp\">
                     <div className=\"flex flex-col md:flex-row gap-8\">
                        <div className=\"flex-1 card-premium p-8 relative overflow-hidden\">
                           <div className=\"absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16\"></div>
                           <div className=\"flex items-center gap-4 mb-8\">
                              <div className=\"w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20\"><Settings size={22} /></div>
                              <div>
                                 <h3 className=\"text-xl font-black text-bright uppercase tracking-tight italic\">Admin Credentials</h3>
                                 <p className=\"text-[10px] font-bold text-dim uppercase tracking-[0.2em]\">Secure Main Control Access</p>
                              </div>
                           </div>
                           <div className=\"space-y-5\">
                              <div>
                                 <label className=\"text-[9px] font-black text-dim uppercase tracking-widest mb-1.5 block\">Current Master Key</label>
                                 <input
                                    type=\"password\"
                                    className=\"input-premium py-3.5 text-xs bg-alt/30\"
                                    placeholder=\"••••••••\"
                                    value={adminPassData.current}
                                    onChange={e => setAdminPassData({ ...adminPassData, current: e.target.value })}
                                 />
                              </div>
                              <div>
                                 <label className=\"text-[9px] font-black text-dim uppercase tracking-widest mb-1.5 block\">New Master Key</label>
                                 <input
                                    type=\"password\"
                                    className=\"input-premium py-3.5 text-xs bg-alt/30\"
                                    placeholder=\"Enter new password\"
                                    value={adminPassData.new}
                                    onChange={e => setAdminPassData({ ...adminPassData, new: e.target.value })}
                                 />
                              </div>
                              <div>
                                 <label className=\"text-[9px] font-black text-dim uppercase tracking-widest mb-1.5 block\">Confirm New Master Key</label>
                                 <input
                                    type=\"password\"
                                    className=\"input-premium py-3.5 text-xs bg-alt/30\"
                                    placeholder=\"Verify new password\"
                                    value={adminPassData.confirm}
                                    onChange={e => setAdminPassData({ ...adminPassData, confirm: e.target.value })}
                                 />
                              </div>
                              <button
                                 onClick={async () => {
                                    if (!adminPassData.current || !adminPassData.new) return setMessage({ text: 'All fields required', type: 'error' });
                                    if (adminPassData.new !== adminPassData.confirm) return setMessage({ text: 'Passwords do not match', type: 'error' });
                                    if (adminPassData.new.length < 6) return setMessage({ text: 'Min length 6 characters', type: 'error' });
                                    const ok = await changeAdminPassword(adminPassData.current, adminPassData.new);
                                    if (ok) {
                                       setMessage({ text: 'Admin identity updated!', type: 'success' });
                                       setAdminPassData({ current: '', new: '', confirm: '' });
                                    } else {
                                       setMessage({ text: 'Verification failed', type: 'error' });
                                    }
                                 }}
                                 className=\"w-full btn-premium btn-premium-primary py-4 font-black text-[10px] uppercase tracking-[0.2em] shadow-lg mt-4\"
                              >
                                 Synchronize Security
                              </button>
                           </div>
                           <div className=\"flex-1 space-y-8 mt-12\">
                              <div className=\"card-premium p-8 border-l-4 border-l-primary/40 bg-grad-surface\">
                                 <h4 className=\"text-sm font-black text-bright uppercase tracking-widest mb-6 border-b border-subtle pb-4 italic\">Platform Ecosystem</h4>
                                 <div className=\"grid grid-cols-2 gap-6\">
                                    <div>
                                       <p className=\"text-3xl font-black text-primary\">{students.length}</p>
                                       <p className=\"text-[9px] font-black text-dim uppercase tracking-[0.1em]\">ENROLLED SCHOLARS</p>
                                    </div>
                                    <div>
                                       <p className=\"text-3xl font-black text-success\">{courses.length}</p>
                                       <p className=\"text-[9px] font-black text-dim uppercase tracking-[0.1em]\">OPERATIONAL BATCHES</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className=\"flex-1 space-y-6\">
                           <h3 className=\"text-2xl font-black text-bright uppercase tracking-tight italic\">Scholar Directory Oversight</h3>
                           <div className=\"card-premium p-0 overflow-hidden border-subtle shadow-xl\">
                              <div className=\"overflow-x-auto\">
                                 <table className=\"w-full text-left\">
                                    <thead className=\"bg-alt/40 border-b border-subtle\">
                                       <tr>
                                          <th className=\"px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-dim\">SCHOLAR IDENTITY</th>
                                          <th className=\"px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-dim\">BATCH / BOARD</th>
                                          <th className=\"px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-dim text-right\">MASTER ACTIONS</th>
                                       </tr>
                                    </thead>
                                    <tbody className=\"divide-y divide-subtle\">
                                       {students.map((st, i) => (
                                          <tr key={i} className=\"group hover:bg-primary/5 transition-all\">
                                             <td className=\"px-8 py-5\">
                                                <div className=\"flex items-center gap-4\">
                                                   <div className=\"w-10 h-10 rounded-2xl bg-grad-main flex items-center justify-center font-black text-white text-xs\">{st.name.charAt(0)}</div>
                                                   <div>
                                                      <p className=\"font-black text-bright text-sm uppercase tracking-tight\">{st.name}</p>
                                                      <p className=\"text-[9px] text-dim font-bold tracking-widest mt-0.5 opacity-70\">UID: {st._id.substring(st._id.length - 8)}</p>
                                                   </div>
                                                </div>
                                             </td>
                                             <td className=\"px-8 py-5\"><span className=\"badge-premium badge-primary text-[9px] font-black px-4 py-1.5 uppercase\">{st.studentClass || 'UNASSIGNED'}</span></td>
                                             <td className=\"px-8 py-5\">
                                                <div className=\"flex justify-end gap-2.5\">
                                                   <button onClick={() => { setSelectedStudent(st); setShowEditStudentModal(true); }} className=\"w-10 h-10 rounded-xl bg-surface border border-subtle text-dim hover:text-primary transition-all flex items-center justify-center\"><Edit2 size={16} /></button>
                                                   <button onClick={() => { setSelectedStudent(st); setShowResetPassModal(true); }} className=\"w-10 h-10 rounded-xl bg-surface border border-subtle text-dim hover:text-success transition-all flex items-center justify-center\"><Award size={16} /></button>
                                                   <button onClick={() => { if (window.confirm(\`Terminate \${st.name}?\`)) deleteStudent(st._id); }} className=\"w-10 h-10 rounded-xl bg-surface border border-subtle text-dim hover:text-danger transition-all flex items-center justify-center\"><Trash2 size={16} /></button>
                                                </div>
                                             </td>
                                          </tr>
                                       ))}
                                    </tbody>
                                 </table>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </main>

         {/* Toast Message */}
         {message.text && (
            <div className={\`fixed top-12 left-1/2 -translate-x-1/2 z-[20000] px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl animate-fadeDown \${message.type === 'success' ? 'bg-black text-white' : 'bg-red-600 text-white'}\`}>
               <div className=\"flex items-center gap-3\">
                  {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  {message.text}
               </div>
            </div>
         )}`;

const numToRemove = (endLine - startLine) + 1;
content.splice(startLine - 1, numToRemove, fixedBlock);
fs.writeFileSync(path, content.join('\\n'));
console.log('Fixed TeacherDashboard.jsx');

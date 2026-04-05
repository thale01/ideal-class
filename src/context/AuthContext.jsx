import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import API_URL from '../config/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error("Auth check failed", err);
        }
      }
      setLoading(false);
    };
    checkToken();
  }, []);

  const login = async (role, credentials) => {
    setError(null);
    const { email, password } = credentials;
    
    // DEBUG LOGS
    console.log('--- AUTH ATTEMPT ---');
    console.log('Role:', role);
    console.log('Email Input:', email?.trim());
    console.log('Password Input Length:', password?.trim()?.length);

    try {
      // 1. Primary Authentication via Firebase
      console.log('Initiating Firebase Handshake...');
      const firebaseRes = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      console.log('Firebase Identity Verified:', firebaseRes.user.uid);

      // 2. Local Backend Session & Metadata Sync
      const endpoint = role === 'admin' ? '/auth/admin/login' : '/auth/student/login';
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...credentials, 
          email: email.trim(), 
          password: password.trim(),
          isFirebaseVerified: true // Signal to backend that Firebase already approved this
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem('token', data.token);
        return true;
      } else {
        setError(data.message);
        return false;
      }
    } catch (err) {
      console.error("Firebase Auth Failure Code:", err.code);
      console.error("Firebase Auth Message:", err.message);
      
      if (err.code === 'auth/user-not-found') {
        setError("Account not found in secure registry.");
      } else if (err.code === 'auth/wrong-password') {
        setError("Invalid credentials for this session.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Invalid email format detected.");
      } else {
        setError("Access Denied: Authentication services unavailable.");
      }
      return false;
    }
  };

  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    const token = localStorage.getItem('token');
    if (!token || user?.role !== 'admin') return;
    try {
      const res = await fetch(`${API_URL}/students`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (err) {
      console.error("Fetch students failed", err);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') fetchStudents();
  }, [user]);

  const updateStudent = async (id, details) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/students/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(details)
      });
      if (res.ok) {
        fetchStudents();
        return true;
      }
    } catch (err) {
      console.error("Update student failed", err);
    }
    return false;
  };

  const resetStudentPassword = async (id, newPassword) => {
    const token = localStorage.getItem('token');
    try {
      // Points to the new secure route
      const res = await fetch(`${API_URL.replace('/api', '')}/api/admin/change-student-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ studentId: id, newPassword })
      });
      return res.ok;
    } catch (err) {
      console.error("Master Reset failed", err);
    }
    return false;
  };

  const changeAdminPassword = async (currentPassword, newPassword) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/auth/admin/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      return res.ok;
    } catch (err) {
      console.error("Change admin password failed", err);
    }
    return false;
  };

  const deleteStudent = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/students/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setStudents(prev => prev.filter(s => s._id !== id));
        fetchStudents();
        return true;
      }
    } catch (err) {
      console.error("Delete student failed", err);
    }
    return false;
  };

  const approveStudent = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/students/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchStudents();
        return true;
      }
    } catch (err) {
      console.error("Approve student failed", err);
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    setStudents([]);
  };

  return (
    <AuthContext.Provider value={{
      user, login, logout, fetchStudents, students, deleteStudent,
      approveStudent, updateStudent, resetStudentPassword, changeAdminPassword,
      loading, error
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_URL = 'http://localhost:5000/api';

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
    const endpoint = role === 'admin' ? '/auth/admin/login' : '/auth/student/login';
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
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
      setError("Server connection failed");
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
      const res = await fetch(`${API_URL}/students/${id}/reset-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword })
      });
      return res.ok;
    } catch (err) {
      console.error("Reset password failed", err);
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    setStudents([]);
  };

  return (
    <AuthContext.Provider value={{
      user, login, logout, fetchStudents, students, deleteStudent,
      updateStudent, resetStudentPassword, changeAdminPassword,
      loading, error
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

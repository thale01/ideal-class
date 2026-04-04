import React, { createContext, useContext, useState, useEffect } from 'react';

const CourseContext = createContext();
import { API_URL as BASE_URL } from '../config/api';
const API_URL = `${BASE_URL}/subjects`;
const COURSES_URL = `${BASE_URL}/courses`;

export const useCourse = () => useContext(CourseContext);

export const CourseProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const res = await fetch(COURSES_URL);
      if (res.ok) {
        let data = await res.json();
        // DEDUPLICATION & PERSISTENCE: Ensure unique and saved locally
        const uniqueMap = new Map();
        data.forEach(course => {
          const key = course._id || `${course.name}-${course.category}`.toLowerCase();
          if (!uniqueMap.has(key)) uniqueMap.set(key, course);
        });
        const newList = Array.from(uniqueMap.values());
        setCourses(newList);
        localStorage.setItem('courses_persistent', JSON.stringify(newList));
      } else {
        throw new Error('Server response not OK');
      }
    } catch (err) {
      console.error("Failed to fetch courses - using local backup", err);
      const backup = localStorage.getItem('courses_persistent');
      if (backup) setCourses(JSON.parse(backup));
    }
  };

  const fetchSubjects = async (forceHydrate = false) => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        const localDataString = localStorage.getItem('subjects_persistent');
        const localData = JSON.parse(localDataString || '[]');
        
        const serverIds = new Set(data.map(s => String(s._id)));
        const now = Date.now();

        // MERGE LOGIC: Keep server items, plus local items that are:
        // 1. Temporary (temp- IDs) - Keep for 60s to allow slow server sync
        // 2. Recently synced (to handle propagation delay in background polling)
        const merged = [
          ...data,
          ...localData.filter(ls => {
            const isTemp = ls._id && String(ls._id).startsWith('temp-');
            const age = ls.createdAt ? (now - new Date(ls.createdAt).getTime()) : 0;
            const isNewTemp = isTemp && (age < 60000); // 60s life for pending syncs
            const isRecent = ls.lastSynced && (now - ls.lastSynced < 30000); // 30s stickiness
            return (isNewTemp || isRecent) && !serverIds.has(String(ls._id));
          })
        ];

        setSubjects(merged);
        localStorage.setItem('subjects_persistent', JSON.stringify(merged));
      } else {
        throw new Error('Server unreachable');
      }
    } catch (err) {
      console.error("Fetch failed - using backup logic", err);
      const backup = localStorage.getItem('subjects_persistent');
      if (backup) setSubjects(JSON.parse(backup));
    }
  };

  useEffect(() => {
    // Stage 1: Immediate Hydration from Disk (Zero Lag UI)
    const backup = localStorage.getItem('subjects_persistent');
    const coursesBackup = localStorage.getItem('courses_persistent');
    if (backup) setSubjects(JSON.parse(backup));
    if (coursesBackup) setCourses(JSON.parse(coursesBackup));
    
    // Stage 2: Background Sync
    fetchSubjects();
    fetchCourses();

    const interval = setInterval(() => {
      fetchSubjects();
      fetchCourses();
    }, 10000); 

    return () => clearInterval(interval);
  }, []);

  const addCourse = async (courseData) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(COURSES_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
      });
      if (res.ok) {
        await fetchCourses();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Add course failed", err);
      return false;
    }
  };

  const deleteCourse = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${COURSES_URL}/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCourses();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Delete course failed", err);
      return false;
    }
  };

  const assignCourses = async (studentId, courseIds) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${COURSES_URL}/assign/${studentId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseIds })
      });
      return res.ok;
    } catch (err) {
      console.error("Assign courses failed", err);
      return false;
    }
  };

  const addSubject = async (subjectData) => {
    const tempId = 'temp-' + Date.now();
    const optimisticSubject = { 
      ...subjectData, 
      _id: tempId, 
      resources: { notes: [], videos: [] }, 
      createdAt: new Date().toISOString()
    };
    
    // PRIORITY 1: Instant local state update
    setSubjects(prev => {
      const newList = [...prev, optimisticSubject];
      localStorage.setItem('subjects_persistent', JSON.stringify(newList));
      return newList;
    });

    const token = localStorage.getItem('token');
    console.log("-------------------------------------------");
    console.log("📤 [FRONTEND] SENDING SUBJECT DATA TO SERVER");
    console.log("Endpoint:", API_URL);
    console.log("Payload:", JSON.stringify(subjectData, null, 2));

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(subjectData)
      });
      
      console.log("📥 [FRONTEND] RECEIVED RESPONSE STATUS:", res.status);
      if (res.ok) {
        let serverSubject = await res.json();
        console.log("✅ [FRONTEND] SERVER RESPONSE BODY:", JSON.stringify(serverSubject, null, 2));
        console.log("✅ Sync complete for", serverSubject.name, "ID:", serverSubject._id);
        // Add stickiness timestamp to prevent premature cleanup by background sync
        serverSubject = { ...serverSubject, lastSynced: Date.now() };
        
        setSubjects(prev => {
          const synced = prev.map(s => s._id === tempId ? serverSubject : s);
          localStorage.setItem('subjects_persistent', JSON.stringify(synced));
          return synced;
        });
        return true;
      } else {
        const errorText = await res.text();
        console.error("❌ Sync rejected by server:", errorText);
        throw new Error('Sync rejected: ' + errorText);
      }
    } catch (err) {
      console.warn("⚠️ Persistence failed. Local copy maintained.", err.message);
      return true; 
    }
  };

  const addResource = async (subjectId, resourceData) => {
    try {
      const formData = new FormData();
      Object.keys(resourceData).forEach(key => {
        if (key === 'files') {
          resourceData[key].forEach(file => formData.append('files', file));
        } else if (resourceData[key]) {
          formData.append(key, resourceData[key]);
        }
      });
      
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${subjectId}/resource`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        await fetchSubjects();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Add resource failed", err);
      return false;
    }
  };

  const deleteSubject = async (id) => {
    const originalSubjects = [...subjects];
    setSubjects(prev => prev.filter(s => s._id !== id));

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) setSubjects(originalSubjects);
    } catch (err) {
      console.error("Delete subject failed", err);
      setSubjects(originalSubjects);
    }
  };

  const deleteResource = async (id, resourceId, type) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/${id}/resource?resourceId=${resourceId}&type=${type}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchSubjects();
    } catch (err) {
      console.error("Delete resource failed", err);
    }
  };

  const updateResource = async (subjectId, resourceId, type, updatedData) => {
    try {
      const subject = subjects.find(s => s._id === subjectId);
      if (!subject) return;

      const key = type === 'video' ? 'videos' : 'notes';
      const updatedResources = (subject.resources?.[key] || []).map(r => 
        r._id === resourceId ? { ...r, ...updatedData } : r
      );

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${subjectId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          resources: { 
            ...subject.resources,
            [key]: updatedResources 
          }
        })
      });
      if (res.ok) fetchSubjects();
    } catch (err) {
      console.error("Update resource failed", err);
    }
  };

  const renameChapter = async (subjectId, oldName, newName) => {
    try {
      const subject = subjects.find(s => s._id === subjectId);
      if (!subject) return;

      const updatedNotes = (subject.resources?.notes || []).map(n => 
        (n.chapter || 'UNCATEGORIZED') === oldName ? { ...n, chapter: newName } : n
      );
      const updatedVideos = (subject.resources?.videos || []).map(v => 
        (v.chapter || 'UNCATEGORIZED') === oldName ? { ...v, chapter: newName } : v
      );

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/${subjectId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          resources: { 
            notes: updatedNotes, 
            videos: updatedVideos 
          }
        })
      });
      if (res.ok) fetchSubjects();
    } catch (err) {
      console.error("Rename chapter failed", err);
    }
  };
  
  const updateSubject = async (id, data) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (res.ok) fetchSubjects();
    } catch (err) {
      console.error("Update subject failed", err);
    }
  };

  const updateCourse = async (id, data) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${COURSES_URL}/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (res.ok) fetchCourses();
    } catch (err) {
      console.error("Update course failed", err);
    }
  };

  return (
    <CourseContext.Provider value={{ 
      subjects, courses, 
      addCourse, deleteCourse, updateCourse,
      addSubject, updateSubject, deleteSubject,
      addResource, deleteResource, renameChapter, updateResource,
      fetchSubjects, fetchCourses, assignCourses 
    }}>
      {children}
    </CourseContext.Provider>
  );
};

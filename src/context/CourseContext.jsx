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
        // DEDUPLICATION: Ensure unique courses by name + category
        const uniqueMap = new Map();
        data.forEach(course => {
          const key = `${course.name}-${course.category}`.toLowerCase();
          if (!uniqueMap.has(key)) uniqueMap.set(key, course);
        });
        setCourses(Array.from(uniqueMap.values()));
      }
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        // PERSISTENCE GUARANTEE: Never overwrite valid local state with an empty server response
        const localData = JSON.parse(localStorage.getItem('subjects_persistent') || '[]');
        const serverIds = new Set(data.map(s => s._id));
        
        const merged = [
          ...data,
          ...localData.filter(ls => ls._id.startsWith('temp-') && !serverIds.has(ls._id))
        ];

        setSubjects(merged);
        localStorage.setItem('subjects_persistent', JSON.stringify(merged));
      }
    } catch (err) {
      console.error("Fetch failed - using backup", err);
      const backup = localStorage.getItem('subjects_persistent');
      if (backup) setSubjects(JSON.parse(backup));
    }
  };

  useEffect(() => {
    // Initial Hydration from disk
    const backup = localStorage.getItem('subjects_persistent');
    const coursesBackup = localStorage.getItem('courses_persistent');
    if (backup) setSubjects(JSON.parse(backup));
    if (coursesBackup) setCourses(JSON.parse(coursesBackup));
    
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
      if (res.ok) fetchCourses();
    } catch (err) {
      console.error("Add course failed", err);
    }
  };

  const deleteCourse = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${COURSES_URL}/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchCourses();
    } catch (err) {
      console.error("Delete course failed", err);
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
    
    // FORCED PERSISTENCE: Push to state and local disk immediately
    setSubjects(prev => {
      const newList = [...prev, optimisticSubject];
      localStorage.setItem('subjects_persistent', JSON.stringify(newList));
      return newList;
    });

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(subjectData)
      });
      
      if (res.ok) {
        const serverSubject = await res.json();
        setSubjects(prev => {
          const synced = prev.map(s => s._id === tempId ? serverSubject : s);
          localStorage.setItem('subjects_persistent', JSON.stringify(synced));
          return synced;
        });
      }
    } catch (err) {
      console.error("Server add failed, but keeping local optimistic copy.", err);
    }
  };

  const addResource = async (subjectId, resourceData) => {
    // Note: Optimistic update for FormData is complex due to file handling, 
    // so we'll stick to robust fetch here but ensure UI shows loading.
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

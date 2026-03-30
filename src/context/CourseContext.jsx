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
        const data = await res.json();
        setCourses(data);
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
        setSubjects(data);
      }
    } catch (err) {
      console.error("Failed to fetch subjects", err);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchCourses();

    // Auto-refresh every 30 seconds to keep folder structures synced
    const interval = setInterval(() => {
      fetchSubjects();
      fetchCourses();
    }, 30000);

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
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subjectData)
      });
      if (res.ok) fetchSubjects();
    } catch (err) {
      console.error("Add subject failed", err);
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
      
      const res = await fetch(`${API_URL}/${subjectId}/resource`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) fetchSubjects();
    } catch (err) {
      console.error("Add resource failed", err);
    }
  };

  const deleteSubject = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchSubjects();
    } catch (err) {
      console.error("Delete subject failed", err);
    }
  };

  const deleteResource = async (id, resourceId, type) => {
    try {
      const res = await fetch(`${API_URL}/${id}/resource?resourceId=${resourceId}&type=${type}`, {
        method: 'DELETE'
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

      const res = await fetch(`${API_URL}/${subjectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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

      const res = await fetch(`${API_URL}/${subjectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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

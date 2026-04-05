import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

const CourseContext = createContext();
import { API_URL as BASE_URL } from '../config/api';
const API_URL = `${BASE_URL}/subjects`;
const COURSES_URL = `${BASE_URL}/folders`;

export const useCourse = () => useContext(CourseContext);

export const CourseProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // REAL-TIME SYNC (FIREBASE - CLOUD DATABASE)
  useEffect(() => {
    // 1. Subjects/Folders Real-time Listener (Single Source of Truth)
    const qSubjects = query(collection(db, "subjects"), orderBy("createdAt", "desc"));
    const unsubscribeSubjects = onSnapshot(qSubjects, (snapshot) => {
      const subjectsList = snapshot.docs.map(doc => ({
        _id: doc.id,
        ...doc.data()
      }));
      setSubjects(subjectsList);
      setLoading(false);
    }, (err) => {
      console.error("Firestore Subjects Error:", err);
      // Fallback for missing keys (silent)
      if (err.code === 'permission-denied') console.warn("Firebase: Access denied. Check Security Rules.");
      setLoading(false);
    });

    // 2. Fetch courses (Existing backend - polling removed for subjects)
    // We keep this to avoid breaking student assignments that rely on the legacy backend
    const fetchCoursesSync = async () => {
      try {
        const res = await fetch(COURSES_URL);
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch (err) {
        console.error("Failed to sync legacy courses", err);
      }
    };
    fetchCoursesSync();
    const courseInterval = setInterval(fetchCoursesSync, 10000); // Pulse every 10s for legacy data

    return () => {
      unsubscribeSubjects();
      clearInterval(courseInterval);
    };
  }, []);

  // CLOUD PERSISTENCE ACTIONS
  const addSubject = async (subjectData) => {
    try {
      // Direct Cloud Write -> Instantly syncs to ALL devices via onSnapshot
      await addDoc(collection(db, "subjects"), {
        ...subjectData,
        resources: { notes: [], videos: [] },
        createdAt: serverTimestamp()
      });
      return true;
    } catch (err) {
      console.error("Cloud Write Failed:", err);
      return false;
    }
  };

  const updateSubject = async (id, data) => {
    try {
      const subjectRef = doc(db, "subjects", id);
      await updateDoc(subjectRef, data);
      return true;
    } catch (err) {
      console.error("Cloud Update Failed:", err);
      return false;
    }
  };

  const deleteSubject = async (id) => {
    try {
      const subjectRef = doc(db, "subjects", id);
      await deleteDoc(subjectRef);
      return true;
    } catch (err) {
      console.error("Cloud Delete Failed:", err);
      return false;
    }
  };

  // HYBRID RESOURCE MANAGEMENT (File -> Railway, Metadata -> Cloud)
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
      // Upload actual file to storage backend (Railway)
      const res = await fetch(`${API_URL}/${subjectId}/resource`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        // Once file is hosted, pull metadata from backend return and SYNC to Cloud
        const updateRes = await fetch(`${BASE_URL}/subjects/${subjectId}`);
        if (updateRes.ok) {
          const updatedSubject = await updateRes.json();
          // Update Firestore -> All devices see the new file resource instantly
          await updateSubject(subjectId, { resources: updatedSubject.resources });
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Cloud Resource Sync failed", err);
      return false;
    }
  };

  const deleteResource = async (subjectId, resourceId, type) => {
    try {
      const token = localStorage.getItem('token');
      // Delete from storage backend
      const res = await fetch(`${API_URL}/${subjectId}/resource?resourceId=${resourceId}&type=${type}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        // Synchronize deletion to Cloud
        const updateRes = await fetch(`${BASE_URL}/subjects/${subjectId}`);
        if (updateRes.ok) {
          const updatedSubject = await updateRes.json();
          await updateSubject(subjectId, { resources: updatedSubject.resources });
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Cloud Resource Delete failed", err);
      return false;
    }
  };

  // Rename across devices instantly
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
      const newResources = { notes: updatedNotes, videos: updatedVideos };

      // Update Cloud -> Syncs all devices
      await updateSubject(subjectId, { resources: newResources });
      return true;
    } catch (err) {
      console.error("Cloud Chapter Rename failed", err);
      return false;
    }
  };

  const addCourse = async (courseData) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(COURSES_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(courseData)
      });
      if (res.ok) {
        const data = await res.json();
        setCourses(prev => [data, ...prev]);
        return true;
      }
      return false;
    } catch (err) { return false; }
  };

  const deleteCourse = async (id) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${COURSES_URL}/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCourses(prev => prev.filter(c => c._id !== id));
        return true;
      }
      return false;
    } catch (err) { return false; }
  };

  const assignCourses = async (studentId, courseIds) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${COURSES_URL}/assign/${studentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ courseIds })
      });
      return res.ok;
    } catch (err) { return false; }
  };

  return (
    <CourseContext.Provider value={{ 
      subjects, courses, 
      addCourse, deleteCourse, 
      addSubject, updateSubject, deleteSubject,
      addResource, deleteResource, renameChapter,
      assignCourses 
    }}>
      {children}
    </CourseContext.Provider>
  );
};

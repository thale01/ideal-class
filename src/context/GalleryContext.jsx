import React, { createContext, useContext, useState, useEffect } from 'react';

const GalleryContext = createContext();
import { API_URL as BASE_URL } from '../config/api';
const API_URL = `${BASE_URL}/toppers`;

export const useGallery = () => useContext(GalleryContext);

export const GalleryProvider = ({ children }) => {
  const [toppers, setToppers] = useState([]);
  const [achievements] = useState([
    { id: 1, title: "10+ Years Excellence", description: "Providing top-tier coaching since 2014." },
    { id: 2, title: "Expert Faculty", description: "Learn from teachers with decades of experience." },
    { id: 3, title: "Personalized Care", description: "Small batches for individual student attention." },
    { id: 4, title: "Proven Success", description: "Over 95% success rate in board exams every year." }
  ]);

  const fetchToppers = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        const localData = JSON.parse(localStorage.getItem('toppers_persistent') || '[]');
        const serverIds = new Set(data.map(t => String(t._id)));
        const now = Date.now();

        const merged = [
          ...data,
          ...localData.filter(lt => {
            const isTemp = lt._id && String(lt._id).startsWith('temp-');
            const isRecent = lt.lastSynced && (now - lt.lastSynced < 45000); // 45s for file uploads
            return (isTemp || isRecent) && !serverIds.has(String(lt._id));
          })
        ];

        setToppers(merged);
        localStorage.setItem('toppers_persistent', JSON.stringify(merged));
      }
    } catch (err) {
      console.error("Failed to fetch toppers", err);
      const backup = localStorage.getItem('toppers_persistent');
      if (backup) setToppers(JSON.parse(backup));
    }
  };

  useEffect(() => {
    const backup = localStorage.getItem('toppers_persistent');
    if (backup) setToppers(JSON.parse(backup));
    
    fetchToppers();
    const interval = setInterval(fetchToppers, 20000);
    return () => clearInterval(interval);
  }, []);

  const addTopper = async (topperData) => {
    const tempId = 'temp-' + Date.now();
    // For toppers, we can only do partial optimistic update without the image photo URL
    const optimistic = { 
        ...topperData, 
        _id: tempId, 
        photoUrl: topperData.photoUrl || '', 
        createdAt: new Date().toISOString() 
    };
    
    setToppers(prev => {
      const next = [optimistic, ...prev];
      localStorage.setItem('toppers_persistent', JSON.stringify(next));
      return next;
    });

    try {
      const formData = new FormData();
      Object.keys(topperData).forEach(key => {
        if (topperData[key]) formData.append(key, topperData[key]);
      });
      
      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData
      });
      
      if (res.ok) {
        let serverTopper = await res.json();
        serverTopper = { ...serverTopper, lastSynced: Date.now() };
        setToppers(prev => {
          const synced = prev.map(t => t._id === tempId ? serverTopper : t);
          localStorage.setItem('toppers_persistent', JSON.stringify(synced));
          return synced;
        });
        return true;
      }
    } catch (err) {
      console.error("Add topper failed", err);
      return true;
    }
    return false;
  };

  const deleteTopper = async (id) => {
    setToppers(prev => prev.filter(t => t._id !== id));
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchToppers();
    } catch (err) {
      console.error("Delete topper failed", err);
    }
  };

  return (
    <GalleryContext.Provider value={{ toppers, achievements, addTopper, deleteTopper, fetchToppers }}>
      {children}
    </GalleryContext.Provider>
  );
};

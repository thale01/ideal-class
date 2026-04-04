import React, { createContext, useContext, useState, useEffect } from 'react';

const AnnouncementContext = createContext();
import { API_URL as BASE_URL } from '../config/api';
const API_URL = `${BASE_URL}/announcements`;

export const useAnnouncement = () => useContext(AnnouncementContext);

export const AnnouncementProvider = ({ children }) => {
  const [announcements, setAnnouncements] = useState([]);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        const localData = JSON.parse(localStorage.getItem('announcements_persistent') || '[]');
        const serverIds = new Set(data.map(a => String(a._id)));
        const now = Date.now();

        const merged = [
          ...data,
          ...localData.filter(la => {
            const isTemp = la._id && String(la._id).startsWith('temp-');
            const isRecent = la.lastSynced && (now - la.lastSynced < 30000);
            return (isTemp || isRecent) && !serverIds.has(String(la._id));
          })
        ];

        setAnnouncements(merged);
        localStorage.setItem('announcements_persistent', JSON.stringify(merged));
      }
    } catch (err) {
      console.error("Failed to fetch announcements", err);
      const backup = localStorage.getItem('announcements_persistent');
      if (backup) setAnnouncements(JSON.parse(backup));
    }
  };

  useEffect(() => {
    const backup = localStorage.getItem('announcements_persistent');
    if (backup) setAnnouncements(JSON.parse(backup));
    
    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, 15000);
    return () => clearInterval(interval);
  }, []);

  const addAnnouncement = async (announce) => {
    const tempId = 'temp-' + Date.now();
    const optimistic = { ...announce, _id: tempId, createdAt: new Date().toISOString() };
    
    setAnnouncements(prev => {
      const next = [optimistic, ...prev];
      localStorage.setItem('announcements_persistent', JSON.stringify(next));
      return next;
    });

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announce)
      });
      if (res.ok) {
        let serverAnnounce = await res.json();
        serverAnnounce = { ...serverAnnounce, lastSynced: Date.now() };
        setAnnouncements(prev => {
          const synced = prev.map(a => a._id === tempId ? serverAnnounce : a);
          localStorage.setItem('announcements_persistent', JSON.stringify(synced));
          return synced;
        });
        return true;
      }
    } catch (err) {
      console.error("Add failed", err);
      return true; // Keep local copy
    }
    return false;
  };

  const removeAnnouncement = async (id) => {
    setAnnouncements(prev => prev.filter(a => a._id !== id));
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchAnnouncements();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <AnnouncementContext.Provider value={{ announcements, addAnnouncement, removeAnnouncement }}>
      {children}
    </AnnouncementContext.Provider>
  );
};

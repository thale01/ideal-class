import React, { createContext, useContext, useState, useEffect } from 'react';

const AnnouncementContext = createContext();
const API_URL = 'http://localhost:5000/api/announcements';

export const useAnnouncement = () => useContext(AnnouncementContext);

export const AnnouncementProvider = ({ children }) => {
  const [announcements, setAnnouncements] = useState([]);

  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) setAnnouncements(await res.json());
    } catch (err) {
      console.error("Failed to fetch announcements", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const addAnnouncement = async (announce) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(announce)
      });
      if (res.ok) fetchAnnouncements();
    } catch (err) {
      console.error("Add failed", err);
    }
  };

  const removeAnnouncement = async (id) => {
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

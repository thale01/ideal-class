import React, { createContext, useContext, useState, useEffect } from 'react';

const UpdateContext = createContext();
import { API_URL as BASE_URL } from '../config/api';
const API_URL = `${BASE_URL}/updates`;

export const useUpdate = () => useContext(UpdateContext);

export const UpdateProvider = ({ children }) => {
  const [updates, setUpdates] = useState([]);

  const fetchUpdates = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        const localData = JSON.parse(localStorage.getItem('updates_persistent') || '[]');
        const serverIds = new Set(data.map(u => String(u._id)));
        const now = Date.now();

        const merged = [
          ...data,
          ...localData.filter(lu => {
            const isTemp = lu._id && String(lu._id).startsWith('temp-');
            const isRecent = lu.lastSynced && (now - lu.lastSynced < 30000);
            return (isTemp || isRecent) && !serverIds.has(String(lu._id));
          })
        ];

        setUpdates(merged);
        localStorage.setItem('updates_persistent', JSON.stringify(merged));
      }
    } catch (err) {
      console.error("Failed to fetch updates", err);
      const backup = localStorage.getItem('updates_persistent');
      if (backup) setUpdates(JSON.parse(backup));
    }
  };

  useEffect(() => {
    const backup = localStorage.getItem('updates_persistent');
    if (backup) setUpdates(JSON.parse(backup));
    
    fetchUpdates();
    const interval = setInterval(fetchUpdates, 30000);
    return () => clearInterval(interval);
  }, []);

  const addUpdateEntry = async (updateData) => {
    const tempId = 'temp-' + Date.now();
    const optimistic = { ...updateData, _id: tempId, timestamp: new Date().toISOString() };
    
    setUpdates(prev => {
      const next = [optimistic, ...prev];
      localStorage.setItem('updates_persistent', JSON.stringify(next));
      return next;
    });

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      if (res.ok) {
        let serverUpdate = await res.json();
        serverUpdate = { ...serverUpdate, lastSynced: Date.now() };
        setUpdates(prev => {
          const synced = prev.map(u => u._id === tempId ? serverUpdate : u);
          localStorage.setItem('updates_persistent', JSON.stringify(synced));
          return synced;
        });
        return true;
      }
    } catch (err) {
      console.error("Add update entry failed", err);
      return true;
    }
    return false;
  };

  const deleteUpdateEntry = async (id) => {
    setUpdates(prev => prev.filter(u => u._id !== id));
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchUpdates();
    } catch (err) {
      console.error("Delete update entry failed", err);
    }
  };

  return (
    <UpdateContext.Provider value={{ updates, addUpdateEntry, deleteUpdateEntry, fetchUpdates }}>
      {children}
    </UpdateContext.Provider>
  );
};

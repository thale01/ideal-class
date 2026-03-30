import React, { createContext, useContext, useState, useEffect } from 'react';

const UpdateContext = createContext();
const API_URL = 'http://localhost:5000/api/updates';

export const useUpdate = () => useContext(UpdateContext);

export const UpdateProvider = ({ children }) => {
  const [updates, setUpdates] = useState([]);

  const fetchUpdates = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) setUpdates(await res.json());
    } catch (err) {
      console.error("Failed to fetch updates", err);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const addUpdateEntry = async (updateData) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      if (res.ok) fetchUpdates();
    } catch (err) {
      console.error("Add update entry failed", err);
    }
  };

  const deleteUpdateEntry = async (id) => {
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

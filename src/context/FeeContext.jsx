import React, { createContext, useContext, useState, useEffect } from 'react';

const FeeContext = createContext();
import { API_URL as BASE_URL } from '../config/api';
const API_URL = `${BASE_URL}/fees`;

export const useFee = () => useContext(FeeContext);

export const FeeProvider = ({ children }) => {
  const [fees, setFees] = useState([]);

  const fetchFees = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        const localData = JSON.parse(localStorage.getItem('fees_persistent') || '[]');
        const serverIds = new Set(data.map(f => String(f._id)));
        const now = Date.now();

        const merged = [
          ...data,
          ...localData.filter(lf => {
            const isTemp = lf._id && String(lf._id).startsWith('temp-');
            const isRecent = lf.lastSynced && (now - lf.lastSynced < 30000);
            return (isTemp || isRecent) && !serverIds.has(String(lf._id));
          })
        ];

        setFees(merged);
        localStorage.setItem('fees_persistent', JSON.stringify(merged));
      }
    } catch (err) {
      console.error("Failed to fetch fees", err);
      const backup = localStorage.getItem('fees_persistent');
      if (backup) setFees(JSON.parse(backup));
    }
  };

  useEffect(() => {
    const backup = localStorage.getItem('fees_persistent');
    if (backup) setFees(JSON.parse(backup));
    
    fetchFees();
    const interval = setInterval(fetchFees, 15000);
    return () => clearInterval(interval);
  }, []);

  const addFeeEntry = async (feeData) => {
    const tempId = 'temp-' + Date.now();
    const optimistic = { ...feeData, _id: tempId, createdAt: new Date().toISOString() };
    
    setFees(prev => {
      const next = [optimistic, ...prev];
      localStorage.setItem('fees_persistent', JSON.stringify(next));
      return next;
    });

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feeData)
      });
      if (res.ok) {
        let serverFee = await res.json();
        serverFee = { ...serverFee, lastSynced: Date.now() };
        setFees(prev => {
          const synced = prev.map(f => f._id === tempId ? serverFee : f);
          localStorage.setItem('fees_persistent', JSON.stringify(synced));
          return synced;
        });
        return true;
      }
    } catch (err) {
      console.error("Add fee entry failed", err);
      return true; // Stick with local
    }
    return false;
  };

  const deleteFeeEntry = async (id) => {
    setFees(prev => prev.filter(f => f._id !== id));
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchFees();
    } catch (err) {
      console.error("Delete fee entry failed", err);
    }
  };

  const totalCollected = fees.reduce((acc, f) => acc + (Number(f.paidAmount) || 0), 0);
  const totalPending = fees.reduce((acc, f) => acc + (Number(f.pendingFees) || 0), 0);

  return (
    <FeeContext.Provider value={{ fees, addFeeEntry, deleteFeeEntry, totalCollected, totalPending, fetchFees }}>
      {children}
    </FeeContext.Provider>
  );
};

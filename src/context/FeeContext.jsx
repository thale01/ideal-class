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
      if (res.ok) setFees(await res.json());
    } catch (err) {
      console.error("Failed to fetch fees", err);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const addFeeEntry = async (feeData) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feeData)
      });
      if (res.ok) fetchFees();
    } catch (err) {
      console.error("Add fee entry failed", err);
    }
  };

  const deleteFeeEntry = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchFees();
    } catch (err) {
      console.error("Delete fee entry failed", err);
    }
  };

  const totalCollected = fees.reduce((acc, f) => acc + f.paidAmount, 0);
  const totalPending = fees.reduce((acc, f) => acc + f.pendingFees, 0);

  return (
    <FeeContext.Provider value={{ fees, addFeeEntry, deleteFeeEntry, totalCollected, totalPending, fetchFees }}>
      {children}
    </FeeContext.Provider>
  );
};

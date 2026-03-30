import React, { createContext, useContext, useState, useEffect } from 'react';

const DoubtContext = createContext();
const API_URL = 'http://localhost:5000/api/doubts';

export const useDoubt = () => useContext(DoubtContext);

export const DoubtProvider = ({ children }) => {
  const [doubts, setDoubts] = useState([]);

  const fetchDoubts = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        setDoubts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch doubts", err);
    }
  };

  useEffect(() => {
    fetchDoubts();
  }, []);

  const askDoubt = async (doubtData) => {
    try {
      const res = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doubtData)
      });
      if (res.ok) fetchDoubts();
    } catch (err) {
      console.error("Ask doubt failed", err);
    }
  };

  const replyToDoubt = async (id, answer) => {
    try {
      const res = await fetch(`${API_URL}/${id}/reply`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer })
      });
      if (res.ok) fetchDoubts();
    } catch (err) {
      console.error("Reply to doubt failed", err);
    }
  };

  return (
    <DoubtContext.Provider value={{ doubts, askDoubt, replyToDoubt, fetchDoubts }}>
      {children}
    </DoubtContext.Provider>
  );
};

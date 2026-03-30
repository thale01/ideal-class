import React, { createContext, useContext, useState, useEffect } from 'react';

const GalleryContext = createContext();
const API_URL = 'http://localhost:5000/api/toppers';

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
      if (res.ok) setToppers(await res.json());
    } catch (err) {
      console.error("Failed to fetch toppers", err);
    }
  };

  useEffect(() => {
    fetchToppers();
  }, []);

  const addTopper = async (topperData) => {
    try {
      const formData = new FormData();
      Object.keys(topperData).forEach(key => {
        if (topperData[key]) formData.append(key, topperData[key]);
      });
      
      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData
      });
      if (res.ok) fetchToppers();
    } catch (err) {
      console.error("Add topper failed", err);
    }
  };

  const deleteTopper = async (id) => {
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

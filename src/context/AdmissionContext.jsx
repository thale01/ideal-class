import React, { createContext, useContext, useState, useEffect } from 'react';

const AdmissionContext = createContext();
import { API_URL as BASE_URL } from '../config/api';
const API_URL = `${BASE_URL}/admissions`;

export const useAdmission = () => useContext(AdmissionContext);

export const AdmissionProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) setApplications(await res.json());
    } catch (err) {
      console.error("Failed to fetch admissions", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const submitApplication = async (app) => {
    try {
      const res = await fetch(`${API_URL}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(app)
      });
      if (res.ok) {
        fetchApplications();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Apply failed", err);
      return false;
    }
  };

  const updateAppStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchApplications();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const removeApplication = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchApplications();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <AdmissionContext.Provider value={{ applications, submitApplication, updateAppStatus, removeApplication }}>
      {children}
    </AdmissionContext.Provider>
  );
};

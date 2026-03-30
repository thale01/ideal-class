import React, { createContext, useContext, useState, useEffect } from 'react';

const QuizContext = createContext();
const API_URL = 'http://localhost:5000/api/quizzes';

export const useQuiz = () => useContext(QuizContext);

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch(API_URL);
      if (res.ok) setQuizzes(await res.json());
    } catch (err) {
      console.error("Failed to fetch quizzes", err);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const addQuiz = async (quiz) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quiz)
      });
      if (res.ok) fetchQuizzes();
    } catch (err) {
      console.error("Add failed", err);
    }
  };

  const removeQuiz = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) fetchQuizzes();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const submitQuiz = (studentId, quizId, score, answers) => {
    // In production, this would be a POST to /api/quizzes/results
    const newResult = {
      id: Date.now(),
      studentId, quizId, score, answers,
      submittedAt: new Date().toISOString()
    };
    setResults(prev => [...prev, newResult]);
    return newResult;
  };

  return (
    <QuizContext.Provider value={{ quizzes, results, addQuiz, removeQuiz, submitQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};

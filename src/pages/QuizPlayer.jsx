import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { useAuth } from '../context/AuthContext';
import { Clock, ChevronRight, ChevronLeft, CheckCircle, Send, AlertCircle } from 'lucide-react';

const QuizPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quizzes, submitQuiz } = useQuiz();
  const { user } = useAuth();
  
  const quiz = quizzes.find(q => q.id === parseInt(id));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quiz?.duration * 60 || 0);
  const [finalResult, setFinalResult] = useState(null);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isFinished) {
      handleSubmit();
    }
  }, [timeLeft, isFinished]);

  if (!quiz) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-main transition-colors duration-500">
      <div className="w-20 h-20 rounded-full bg-surface border border-subtle flex items-center justify-center text-4xl mb-4 shadow-sm">❓</div>
      <h2 className="text-2xl font-black text-bright uppercase tracking-widest italic opacity-80">Quiz Not Found</h2>
    </div>
  );

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleOptionSelect = (optionIndex) => {
    setAnswers({ ...answers, [currentQuestion.id]: optionIndex });
  };

  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach(q => {
      if (answers[q.id] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const handleSubmit = () => {
    const score = calculateScore();
    const result = submitQuiz(user.id, quiz.id, score, answers);
    setFinalResult(result);
    setIsFinished(true);
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto my-16 px-6 animate-fadeUp">
        <div className="card-premium flex flex-col items-center justify-center text-center p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-success/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-8 relative z-10 border border-success/20 shadow-inner">
             <CheckCircle size={48} className="text-success" />
          </div>
          <h1 className="text-4xl font-black text-bright tracking-tight mb-4 relative z-10">Exam Completed!</h1>
          <p className="text-dim font-medium mb-12 relative z-10">Your academic evaluation has been processed.</p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center w-full mb-12 relative z-10">
            <div className="flex-1 bg-surface border border-subtle rounded-2xl p-6 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-dim block mb-2">Final Score</span>
              <span className="text-4xl font-black text-primary">{finalResult.score} <span className="text-xl text-dim opacity-50">/ {finalResult.maxScore}</span></span>
            </div>
            <div className="flex-1 bg-surface border border-subtle rounded-2xl p-6 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-dim block mb-2">Accuracy Rate</span>
              <span className="text-4xl font-black text-success">{Math.round((finalResult.score / finalResult.maxScore) * 100)}%</span>
            </div>
          </div>
          
          <button className="btn-premium btn-premium-primary w-full max-w-xs py-4 text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 relative z-10" onClick={() => navigate('/student')}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-12 px-6 animate-fadeIn transition-colors duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <span className="badge-premium badge-primary">ACTIVE EVALUATION</span>
              <span className="text-[10px] font-black text-dim uppercase tracking-widest">Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
           </div>
           <h1 className="text-3xl font-black text-bright tracking-tight leading-tight">{quiz.title}</h1>
        </div>
        <div className="flex items-center gap-3 px-6 py-4 bg-surface border border-danger/20 rounded-2xl shadow-sm text-danger whitespace-nowrap">
           <Clock size={24} />
           <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-danger to-red-400">{formatTime(timeLeft)}</span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-alt rounded-full overflow-hidden mb-10 shadow-inner">
         <div className="h-full bg-primary transition-all duration-300 ease-out" style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}></div>
      </div>

      <main className="card-premium p-8 md:p-12 mb-8">
         <h2 className="text-xl font-bold text-bright leading-relaxed mb-10">{currentQuestion.text}</h2>
         <div className="flex flex-col gap-4">
            {currentQuestion.options.map((option, i) => {
               const isSelected = answers[currentQuestion.id] === i;
               return (
                  <button 
                     key={i} 
                     onClick={() => handleOptionSelect(i)}
                     className={`w-full flex items-center gap-6 p-5 rounded-2xl border text-left transition-all duration-200
                        ${isSelected 
                           ? 'bg-primary/5 border-primary shadow-sm ring-2 ring-primary/20' 
                           : 'bg-surface border-subtle hover:border-primary/40 hover:bg-alt'}
                     `}
                  >
                     <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-colors
                        ${isSelected ? 'bg-primary text-white shadow-md' : 'bg-alt text-dim group-hover:bg-surface border border-subtle'}`}>
                        {String.fromCharCode(65 + i)}
                     </span>
                     <span className={`font-medium flex-1 ${isSelected ? 'text-primary' : 'text-bright'}`}>{option}</span>
                  </button>
               );
            })}
         </div>
      </main>

      <footer className="flex items-center justify-between border-t border-subtle pt-8">
         <button 
            className={`btn-premium py-4 px-8 text-xs font-black uppercase tracking-widest shadow-none ${currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed bg-surface text-dim border-subtle' : 'btn-premium-secondary hover:bg-surface'}`} 
            disabled={currentQuestionIndex === 0} 
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
         >
            <ChevronLeft size={18} className="mr-2 inline" /> Previous
         </button>
         
         {currentQuestionIndex < quiz.questions.length - 1 ? (
            <button className="btn-premium btn-premium-primary py-4 px-8 text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20" onClick={() => setCurrentQuestionIndex(prev => prev + 1)}>
               Next Logic <ChevronRight size={18} className="ml-2 inline" />
            </button>
         ) : (
            <button className="btn-premium py-4 px-8 text-xs font-black uppercase tracking-widest bg-success hover:bg-green-600 text-white shadow-lg shadow-success/20 border-none" onClick={handleSubmit}>
               <Send size={18} className="mr-2 inline" /> Conclude Exam
            </button>
         )}
      </footer>
    </div>
  );
};

export default QuizPlayer;

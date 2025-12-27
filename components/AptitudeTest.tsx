
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Clock, CheckCircle2, AlertCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { APTITUDE_QUESTIONS } from '../constants';
import { Question } from '../types';

const AptitudeTest: React.FC = () => {
  const [testStarted, setTestStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentAnswers, setCurrentAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [score, setScore] = useState(0);

  const startTest = () => {
    const shuffled = [...APTITUDE_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 5);
    setQuestions(shuffled);
    setTestStarted(true);
    setSubmitted(false);
    setCurrentAnswers({});
    setTimeLeft(600);
  };

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    let newScore = 0;
    questions.forEach((q) => {
      if (currentAnswers[q.questionNumber] === q.correctAnswer) {
        newScore++;
      }
    });
    setScore(newScore);
  }, [submitted, questions, currentAnswers]);

  useEffect(() => {
    let timer: any;
    if (testStarted && !submitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSubmit();
    }
    return () => clearInterval(timer);
  }, [testStarted, submitted, timeLeft, handleSubmit]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!testStarted) {
    return (
      <div className="text-center py-16">
        <motion.div 
          animate={{ rotate: [0, -10, 10, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
          className="mb-10 inline-block p-8 bg-emerald-50 rounded-full"
        >
          <Brain className="w-16 h-16 text-emerald-500" />
        </motion.div>
        <h2 className="text-4xl font-black text-gray-800 mb-4 tracking-tight">Aptitude Arena</h2>
        <p className="text-gray-500 mb-10 max-w-md mx-auto text-lg leading-relaxed">
          Prove your readiness with a timed assessment across Logic, Verbal, and Quantitative reasoning.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startTest}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-5 px-12 rounded-3xl shadow-2xl shadow-emerald-200 transition-all text-xl"
        >
          Begin 10-Minute Assessment
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <motion.div 
        layout
        className="flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-xl py-6 z-20 border-b border-gray-100"
      >
        <div>
          <h3 className="text-2xl font-black text-emerald-900 flex items-center">
            Assessment <span className="text-emerald-500 ml-2">Active</span>
          </h3>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mt-1">5 Questions Total</p>
        </div>
        <div className={`px-6 py-3 rounded-2xl font-mono text-3xl font-black shadow-inner flex items-center space-x-3 transition-colors ${timeLeft < 60 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-emerald-50 text-emerald-700'}`}>
          <Clock className="w-6 h-6" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </motion.div>

      <AnimatePresence>
        {submitted && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border-4 border-emerald-500 rounded-[3rem] p-12 text-center shadow-2xl mb-16 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-50 rounded-full -z-10"
            />
            <h4 className="text-3xl font-black text-emerald-900 mb-4">Results are in!</h4>
            <div className="mb-6 relative inline-block">
              <span className="text-8xl font-black text-emerald-600">{score}</span>
              <span className="text-4xl text-emerald-300 font-bold">/ {questions.length}</span>
            </div>
            <p className="text-emerald-700 font-bold text-xl mb-8">
              {score === 5 ? "Perfect score! You're ready for any challenge." : 
               score >= 3 ? "Solid performance! Just a few areas to polish." : 
               "Great practice! Keep refining your skills."}
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              onClick={startTest}
              className="bg-emerald-100 text-emerald-800 font-black px-8 py-4 rounded-2xl flex items-center mx-auto hover:bg-emerald-200 transition-all"
            >
              <RotateCcw className="w-5 h-5 mr-2" /> Try New Questions
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-8 pb-10">
        {questions.map((q, idx) => (
          <motion.div 
            key={idx}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            className={`p-10 rounded-[2.5rem] border-2 transition-all duration-500 ${
              submitted 
                ? (currentAnswers[q.questionNumber] === q.correctAnswer ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-100 bg-red-50/20')
                : 'border-gray-50 bg-white shadow-sm hover:shadow-xl hover:border-emerald-100'
            }`}
          >
            <div className="flex items-start space-x-4 mb-6">
              <span className="bg-emerald-500 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0">
                {idx + 1}
              </span>
              <p className="font-bold text-xl text-gray-800 leading-snug">{q.question}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Object.entries(q.options) as [keyof typeof q.options, string][]).map(([key, val]) => (
                <motion.button
                  key={key}
                  whileHover={!submitted ? { scale: 1.02 } : {}}
                  disabled={submitted}
                  onClick={() => setCurrentAnswers(prev => ({ ...prev, [q.questionNumber]: key }))}
                  className={`flex items-center p-6 rounded-3xl border-2 transition-all text-left relative overflow-hidden ${
                    currentAnswers[q.questionNumber] === key
                      ? (submitted 
                          ? (key === q.correctAnswer ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-red-500 border-red-500 text-white')
                          : 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-4 ring-emerald-50')
                      : (submitted && key === q.correctAnswer 
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-400'
                          : 'border-gray-50 bg-gray-50 text-gray-700 opacity-80')
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black mr-4 shrink-0 transition-colors ${
                    currentAnswers[q.questionNumber] === key ? 'bg-white/20' : 'bg-white text-emerald-500'
                  }`}>
                    {key}
                  </span>
                  <span className="font-bold">{val}</span>
                  {submitted && key === q.correctAnswer && <CheckCircle2 className="absolute right-4 w-6 h-6 text-emerald-400" />}
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {submitted && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-8 p-6 bg-white/80 rounded-3xl border border-emerald-100 text-gray-600 shadow-sm"
                >
                  <div className="flex items-center text-emerald-800 font-black mb-2">
                    <AlertCircle className="w-5 h-5 mr-2" /> Explanation
                  </div>
                  <p className="leading-relaxed">{q.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {!submitted && (
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#000' }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="w-full bg-emerald-900 text-white font-black py-6 rounded-[2rem] shadow-2xl transition-all flex items-center justify-center space-x-3 text-xl"
        >
          <span>Submit My Assessment</span>
          <ArrowRight className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
};

export default AptitudeTest;

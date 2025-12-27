
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Brain, MessageSquare, Search, Printer, 
  Sparkles, Send, Trash2, ChevronRight, Map,
  Target, Zap, Award, BookOpen, User, Info
} from 'lucide-react';
import { TabType, GroundingChunk } from './types';
import { SAMPLE_RESUME, SAMPLE_JOB_DESC } from './constants';
import { analyzeResumeMatch, generateInterviewGuide, generateCareerRoadmap } from './services/geminiService';
import MarkdownRenderer from './components/MarkdownRenderer';
import AptitudeTest from './components/AptitudeTest';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('match');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Persist resume and job role
  const [resume, setResume] = useState(() => localStorage.getItem('jobsy_resume') || SAMPLE_RESUME);
  const [jobDesc, setJobDesc] = useState(SAMPLE_JOB_DESC);
  const [matchResult, setMatchResult] = useState<string | null>(null);

  const [role, setRole] = useState(() => localStorage.getItem('jobsy_role') || '');
  const [interviewResult, setInterviewResult] = useState<string | null>(null);
  const [interviewGrounding, setInterviewGrounding] = useState<GroundingChunk[] | undefined>(undefined);
  
  const [roadmapResult, setRoadmapResult] = useState<string | null>(null);
  const [roadmapGrounding, setRoadmapGrounding] = useState<GroundingChunk[] | undefined>(undefined);

  useEffect(() => {
    localStorage.setItem('jobsy_resume', resume);
  }, [resume]);

  useEffect(() => {
    localStorage.setItem('jobsy_role', role);
  }, [role]);

  const handleMatchAnalysis = async () => {
    if (!resume.trim() || !jobDesc.trim()) {
      setError("Please fill in both resume and job description.");
      return;
    }
    setLoading(true);
    setError(null);
    setMatchResult(null);
    try {
      const response = await analyzeResumeMatch(resume, jobDesc);
      setMatchResult(response.text);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewPrep = async () => {
    if (!role.trim()) {
      setError("Please specify a job role.");
      return;
    }
    setLoading(true);
    setError(null);
    setInterviewResult(null);
    try {
      const response = await generateInterviewGuide(role);
      setInterviewResult(response.text);
      setInterviewGrounding(response.groundingChunks);
    } catch (err: any) {
      setError(err.message || "An error occurred generating the guide.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoadmapGen = async () => {
    if (!role.trim()) {
      setError("Tell us your target role first!");
      return;
    }
    setLoading(true);
    setError(null);
    setRoadmapResult(null);
    try {
      const response = await generateCareerRoadmap(role);
      setRoadmapResult(response.text);
      setRoadmapGrounding(response.groundingChunks);
    } catch (err: any) {
      setError(err.message || "Failed to build your path.");
    } finally {
      setLoading(false);
    }
  };

  const Illustration = ({ type }: { type: TabType }) => {
    const variants = {
      initial: { scale: 0.8, opacity: 0, rotate: -10 },
      animate: { scale: 1, opacity: 0.15, rotate: 0 },
    };
    
    return (
      <motion.div 
        variants={variants}
        initial="initial"
        animate="animate"
        className="w-64 h-64 absolute right-10 top-24 pointer-events-none hidden lg:block z-0"
      >
        {type === 'match' && <Briefcase className="w-full h-full text-emerald-500" strokeWidth={0.5} />}
        {type === 'roadmap' && <Map className="w-full h-full text-blue-500" strokeWidth={0.5} />}
        {type === 'aptitude' && <Award className="w-full h-full text-amber-500" strokeWidth={0.5} />}
        {type === 'interview' && <MessageSquare className="w-full h-full text-purple-500" strokeWidth={0.5} />}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8 max-w-6xl mx-auto relative">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col md:flex-row items-center justify-between py-10 gap-6 z-50 relative"
      >
        <div className="flex items-center space-x-4">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="bg-gradient-to-br from-emerald-400 to-emerald-600 p-3 rounded-2xl shadow-xl shadow-emerald-200 cursor-pointer"
          >
            <span className="text-4xl">🎓</span>
          </motion.div>
          <div>
            <h1 className="text-4xl font-black text-emerald-900 tracking-tighter">Jobsy<span className="text-emerald-500">.</span></h1>
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-600 opacity-60">AI Career Accelerator</p>
          </div>
        </div>
        
        <div className="flex glass p-1.5 rounded-[1.5rem] shadow-xl border border-emerald-100/50">
          {(['match', 'roadmap', 'aptitude', 'interview'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setError(null); }}
              className={`relative px-5 py-2.5 rounded-xl font-bold transition-all duration-500 flex items-center space-x-2 ${
                activeTab === tab ? 'text-white' : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              {activeTab === tab && (
                <motion.div 
                  layoutId="tab-active-pill"
                  className={`absolute inset-0 rounded-xl -z-10 bg-gradient-to-r ${
                    tab === 'match' ? 'from-emerald-500 to-emerald-600' :
                    tab === 'roadmap' ? 'from-blue-500 to-blue-600' :
                    tab === 'aptitude' ? 'from-amber-500 to-amber-600' :
                    'from-purple-500 to-purple-600'
                  }`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {tab === 'match' && <Zap className="w-4 h-4" />}
              {tab === 'roadmap' && <Map className="w-4 h-4" />}
              {tab === 'aptitude' && <Brain className="w-4 h-4" />}
              {tab === 'interview' && <MessageSquare className="w-4 h-4" />}
              <span className="hidden sm:inline">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
            </button>
          ))}
        </div>
      </motion.header>

      {/* Profile Sync Banner */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-2 px-4 py-1.5 bg-white/50 border border-emerald-100 rounded-full text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
           <User className="w-3 h-3" />
           <span>Profile Sync: Local Active</span>
        </div>
      </div>

      {/* Global Error Notice */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 p-4 bg-red-50 border-2 border-red-100 text-red-600 rounded-2xl flex items-center space-x-3"
          >
            <Info className="w-6 h-6 shrink-0" />
            <span className="font-bold">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <motion.main 
        layout
        className="glass relative rounded-[3rem] shadow-2xl shadow-emerald-900/10 p-8 md:p-12 min-h-[650px] overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Illustration type={activeTab} />

            {activeTab === 'match' && (
              <div className="relative z-10">
                <div className="mb-10 text-center md:text-left">
                  <h2 className="text-4xl font-black text-emerald-900 mb-2">Resume Optimizer</h2>
                  <p className="text-gray-500 max-w-lg font-medium">Instantly identify gaps and generate professional bullet points tailored to your target job.</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-3 group">
                    <label className="text-sm font-bold text-emerald-700 uppercase tracking-wider ml-1 flex items-center group-focus-within:text-emerald-500 transition-colors">
                      <Award className="w-4 h-4 mr-2" /> Your Current Resume
                    </label>
                    <div className="relative overflow-hidden rounded-[2rem]">
                      {loading && <div className="scanner-line" />}
                      <textarea
                        value={resume}
                        onChange={(e) => setResume(e.target.value)}
                        className="w-full h-[400px] p-8 bg-emerald-50/10 border-2 border-emerald-50 focus:bg-white rounded-[2rem] focus:ring-8 focus:ring-emerald-100 focus:border-emerald-500 transition-all outline-none resize-none font-medium text-gray-700 leading-relaxed shadow-inner"
                        placeholder="Paste your professional experience here..."
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-blue-700 uppercase tracking-wider ml-1 flex items-center">
                      <Target className="w-4 h-4 mr-2" /> Target Job Description
                    </label>
                    <textarea
                      value={jobDesc}
                      onChange={(e) => setJobDesc(e.target.value)}
                      className="w-full h-[400px] p-8 bg-blue-50/10 border-2 border-blue-50 focus:bg-white rounded-[2rem] focus:ring-8 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none resize-none font-medium text-gray-700 leading-relaxed shadow-inner"
                      placeholder="Paste the requirements of your dream role..."
                    />
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleMatchAnalysis}
                  disabled={loading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-black py-6 rounded-[2rem] shadow-xl shadow-emerald-200 transition-all flex items-center justify-center space-x-3 mb-10 text-xl"
                >
                  {loading ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Analyzing Potential...</span>
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      <span>Compare & Fix Resume</span>
                    </>
                  )}
                </motion.button>

                {matchResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 pt-12 border-t border-emerald-50"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-black text-emerald-900 flex items-center">
                        <Zap className="w-6 h-6 mr-3 text-emerald-500" /> Improvement Strategy
                      </h3>
                      <button onClick={() => setMatchResult(null)} className="text-emerald-400 hover:text-emerald-600 font-bold transition">New Scan</button>
                    </div>
                    <MarkdownRenderer content={matchResult} />
                  </motion.div>
                )}
              </div>
            )}

            {activeTab === 'roadmap' && (
              <div className="max-w-4xl mx-auto z-10 relative">
                <div className="text-center mb-12">
                   <motion.div 
                    animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="inline-block p-6 bg-blue-50 rounded-[2rem] mb-6 shadow-lg shadow-blue-100"
                  >
                    <Map className="w-16 h-16 text-blue-500" />
                  </motion.div>
                  <h2 className="text-4xl font-black text-emerald-900 mb-3">Skill Roadmap</h2>
                  <p className="text-gray-500 text-lg font-medium">Your personalized learning path to becoming a <span className="text-blue-600 font-bold">{role || "Senior Professional"}</span>.</p>
                </div>

                <div className="relative group mb-12 max-w-2xl mx-auto">
                   <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRoadmapGen()}
                    placeholder="Enter your goal role..."
                    className="w-full p-8 pl-16 bg-white border-2 border-blue-50 focus:border-blue-500 rounded-[2rem] outline-none transition-all font-bold text-emerald-900 text-xl shadow-xl shadow-blue-900/5"
                  />
                  <Target className="w-8 h-8 text-blue-300 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRoadmapGen}
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white font-black py-3 px-8 rounded-2xl shadow-lg"
                  >
                    {loading ? 'Mapping...' : 'Build Path'}
                  </motion.button>
                </div>

                {roadmapResult && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-blue-50/50 to-emerald-50/50 border-2 border-white p-10 rounded-[3rem] shadow-xl"
                  >
                    <div className="flex items-center justify-between mb-10">
                      <h3 className="text-2xl font-black text-blue-900 flex items-center">
                        <BookOpen className="w-6 h-6 mr-3" /> The Growth Blueprint
                      </h3>
                      <button onClick={() => window.print()} className="bg-white p-3 rounded-xl shadow-sm text-blue-500 hover:bg-blue-500 hover:text-white transition-all">
                        <Printer className="w-6 h-6" />
                      </button>
                    </div>
                    <MarkdownRenderer content={roadmapResult} groundingChunks={roadmapGrounding} />
                  </motion.div>
                )}
              </div>
            )}

            {activeTab === 'aptitude' && <AptitudeTest />}

            {activeTab === 'interview' && (
              <div className="max-w-3xl mx-auto z-10 relative">
                <div className="text-center mb-12">
                  <motion.div 
                    animate={{ rotateY: [0, 180, 360] }}
                    transition={{ repeat: Infinity, duration: 6 }}
                    className="inline-block p-6 bg-purple-50 rounded-full mb-6 shadow-xl shadow-purple-100"
                  >
                    <MessageSquare className="w-12 h-12 text-purple-500" />
                  </motion.div>
                  <h2 className="text-4xl font-black text-emerald-900 mb-3">Interview Simulator</h2>
                  <p className="text-gray-500 text-lg font-medium">Real-time coaching for the toughest technical and behavioral questions.</p>
                </div>

                <div className="relative group mb-12">
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleInterviewPrep()}
                    placeholder="Search prep for a role..."
                    className="w-full p-8 pl-16 bg-white border-2 border-purple-50 focus:border-purple-500 rounded-[2.5rem] outline-none transition-all font-bold text-emerald-900 text-xl shadow-2xl shadow-purple-900/5"
                  />
                  <Search className="w-8 h-8 text-purple-200 absolute left-6 top-1/2 -translate-y-1/2 group-focus-within:text-purple-500 transition-colors" />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleInterviewPrep}
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-purple-500 hover:bg-purple-600 text-white font-black py-3 px-8 rounded-2xl shadow-lg"
                  >
                    {loading ? 'Consulting...' : 'Get Ready'}
                  </motion.button>
                </div>

                {interviewResult && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/40 border-2 border-white backdrop-blur-sm p-10 rounded-[3rem] shadow-2xl"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-black text-purple-900 flex items-center uppercase tracking-widest">
                        <Sparkles className="w-6 h-6 mr-3 text-purple-400" /> Pre-Game Strategy
                      </h3>
                      <div className="flex gap-2">
                        <button className="bg-white p-3 rounded-xl shadow-sm text-purple-500 hover:text-purple-700" onClick={() => window.print()}><Printer className="w-5 h-5" /></button>
                      </div>
                    </div>
                    <MarkdownRenderer content={interviewResult} groundingChunks={interviewGrounding} />
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.main>

      {/* Floating Interactive Blobs */}
      <motion.div 
        animate={{ x: [0, 50, 0], y: [0, 100, 0] }}
        transition={{ repeat: Infinity, duration: 25 }}
        className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-emerald-300/10 rounded-full blur-[120px] -z-20 pointer-events-none"
      />
      <motion.div 
        animate={{ x: [0, -50, 0], y: [0, -80, 0] }}
        transition={{ repeat: Infinity, duration: 20 }}
        className="fixed top-0 right-0 w-[400px] h-[400px] bg-blue-300/10 rounded-full blur-[100px] -z-20 pointer-events-none"
      />

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 text-center text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] flex flex-col items-center gap-4"
      >
        <div className="flex items-center space-x-2 px-6 py-2 glass rounded-full border border-emerald-100/30">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
          <span>Live AI Analysis Engine active</span>
        </div>
        <p>Built for professionals by Jobsy AI &bull; 2024</p>
      </motion.footer>
    </div>
  );
};

export default App;

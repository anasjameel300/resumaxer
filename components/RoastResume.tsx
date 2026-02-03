import React, { useState } from 'react';
import { roastMyResume } from '../services/geminiService';

const RoastResume: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [roast, setRoast] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoast = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    try {
      const result = await roastMyResume(resumeText);
      setRoast(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-center space-y-8">
      <div className="mb-10">
        <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 tracking-tight pb-2">
          Roast My Resume 🔥
        </h2>
        <p className="text-surface-500 mt-4 text-lg max-w-2xl mx-auto">
          Warning: The AI Recruiter is having a particularly bad day. Proceed only if you have thick skin.
        </p>
      </div>

      <div className="mb-8 relative group max-w-3xl mx-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <textarea
          className="relative w-full h-64 p-6 bg-white border border-surface-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none shadow-xl text-lg text-surface-800 placeholder-surface-400"
          placeholder="Paste your resume here if you dare..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />
      </div>

      <button
        onClick={handleRoast}
        disabled={loading || !resumeText}
        className="px-10 py-5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold text-xl rounded-2xl shadow-lg shadow-orange-500/30 transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Cooking...' : 'Destroy My Career Dreams'}
      </button>

      {roast && (
        <div className="mt-16 text-left animate-fade-in max-w-3xl mx-auto">
             <div className="relative bg-white p-8 md:p-10 rounded-3xl shadow-2xl border-2 border-orange-100">
                <div className="absolute -top-6 -left-6 w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg transform -rotate-6">
                    💀
                </div>
                <h3 className="text-2xl font-bold text-surface-900 mb-6 pl-6">The Verdict</h3>
                <div className="prose prose-orange prose-lg text-surface-700 whitespace-pre-line leading-relaxed">
                    {roast}
                </div>
             </div>
        </div>
      )}
    </div>
  );
};

export default RoastResume;
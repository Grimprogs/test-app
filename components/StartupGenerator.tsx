'use client';

import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Sparkles, Rocket, Target, Users, Briefcase, Zap, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StartupIdea {
  name: string;
  oneLineIdea: string;
  problem: string;
  targetAudience: string;
  businessModel: string;
  usp: string;
}

export default function StartupGenerator() {
  const [interests, setInterests] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [idea, setIdea] = useState<StartupIdea | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateIdea = async () => {
    if (!interests.trim() || !skills.trim()) {
      setError('Please fill in both fields to spark an idea!');
      return;
    }

    setLoading(true);
    setError(null);
    setIdea(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY! });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a startup idea generator for college students.
        Based on the user's interests and skills, generate a unique, practical, and innovative startup idea.
        
        User Input:
        Interests: ${interests}
        Skills: ${skills}
        
        Output must be in JSON format.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Startup Name" },
              oneLineIdea: { type: Type.STRING, description: "One-line Idea" },
              problem: { type: Type.STRING, description: "Problem it Solves" },
              targetAudience: { type: Type.STRING, description: "Target Audience" },
              businessModel: { type: Type.STRING, description: "Business Model (how it makes money)" },
              usp: { type: Type.STRING, description: "Unique Selling Point (USP)" },
            },
            required: ["name", "oneLineIdea", "problem", "targetAudience", "businessModel", "usp"]
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      setIdea(result);
    } catch (err) {
      console.error(err);
      setError('Failed to generate idea. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      <header className="mb-12 text-center md:text-left">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block bg-black text-white px-4 py-1 font-display text-sm uppercase tracking-widest mb-4"
        >
          SparkFound v1.0
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-display font-black uppercase leading-none mb-4"
        >
          Build the <span className="text-[#00FF00]">Future</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 max-w-2xl"
        >
          Turn your unique skills and passions into a practical startup idea designed for college entrepreneurs.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="brutalist-card p-6"
        >
          <label className="block font-display font-bold uppercase text-sm mb-2">What are you interested in?</label>
          <textarea 
            className="brutalist-input h-32 resize-none"
            placeholder="e.g. Sustainability, Gaming, Mental Health, Urban Gardening..."
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="brutalist-card p-6"
        >
          <label className="block font-display font-bold uppercase text-sm mb-2">What are your skills?</label>
          <textarea 
            className="brutalist-input h-32 resize-none"
            placeholder="e.g. Python, Graphic Design, Public Speaking, Data Analysis..."
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </motion.div>
      </div>

      <div className="flex flex-col items-center gap-4 mb-16">
        <button 
          onClick={generateIdea}
          disabled={loading}
          className="brutalist-button flex items-center gap-3 text-xl group"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              Generate Startup Idea
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
        {error && <p className="text-red-600 font-bold uppercase text-sm">{error}</p>}
      </div>

      <AnimatePresence mode="wait">
        {idea && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            <div className="brutalist-card bg-[#00FF00] p-8 text-center">
              <h2 className="text-4xl md:text-6xl font-display font-black uppercase mb-2">{idea.name}</h2>
              <p className="text-xl font-medium italic">&quot;{idea.oneLineIdea}&quot;</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <IdeaSection 
                icon={<Target className="w-6 h-6" />} 
                title="The Problem" 
                content={idea.problem} 
                delay={0.1}
              />
              <IdeaSection 
                icon={<Users className="w-6 h-6" />} 
                title="Target Audience" 
                content={idea.targetAudience} 
                delay={0.2}
              />
              <IdeaSection 
                icon={<Briefcase className="w-6 h-6" />} 
                title="Business Model" 
                content={idea.businessModel} 
                delay={0.3}
              />
              <IdeaSection 
                icon={<Zap className="w-6 h-6" />} 
                title="Unique Selling Point" 
                content={idea.usp} 
                delay={0.4}
              />
            </div>

            <div className="text-center pt-8">
              <button 
                onClick={() => {
                  setIdea(null);
                  setInterests('');
                  setSkills('');
                }}
                className="text-sm font-bold uppercase tracking-widest border-b-2 border-black hover:text-gray-600 transition-colors"
              >
                Start Over
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-24 pt-8 border-t-2 border-black/10 text-center text-gray-400 text-xs uppercase tracking-widest">
        Built for the next generation of founders
      </footer>
    </div>
  );
}

function IdeaSection({ icon, title, content, delay }: { 
  icon: React.ReactNode, 
  title: string, 
  content: string, 
  delay: number
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="brutalist-card p-6 bg-white"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="text-black">
          {icon}
        </div>
        <h3 className="font-display font-bold uppercase text-lg tracking-tight">{title}</h3>
      </div>
      <p className="leading-relaxed text-gray-600">
        {content}
      </p>
    </motion.div>
  );
}

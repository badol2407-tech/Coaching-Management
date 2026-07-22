import { motion } from 'framer-motion';
import { useState } from 'react';

// Generates an array of random particles for the background
const generateParticles = (count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100, // percentage
    y: Math.random() * 100, // percentage
    size: Math.random() * 4 + 1, // px
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 2,
    color: Math.random() > 0.5 ? '#f59e0b' : '#3b82f6', // gold or blue
    opacity: Math.random() * 0.5 + 0.1,
  }));
};

export function Scene1() {
  const [particles] = useState(() => generateParticles(40));

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center bg-black overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 5, times: [0, 0.1, 0.9, 1], ease: 'linear' }}
    >
      {/* Background AI Image with slow zoom - cinematic base */}
      <motion.img
        src={`${import.meta.env.BASE_URL}images/cinematic-bg.jpg`}
        alt="Cinematic Background"
        className="absolute inset-0 w-full h-full object-cover mix-blend-screen"
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ 
          scale: 1.15, 
          opacity: [0, 0.4, 0.4, 0] 
        }}
        transition={{ 
          scale: { duration: 5, ease: 'linear' },
          opacity: { duration: 5, times: [0, 0.1, 0.9, 1], ease: 'linear' }
        }}
      />

      {/* Main Container - The "Camera" that slowly zooms in */}
      <motion.div
        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center z-10"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 5, ease: 'linear' }}
      >
        {/* Soft Golden Light appearing from center */}
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, rgba(59,130,246,0.05) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1.1, 1.2] }}
          transition={{ duration: 5, times: [0, 0.4, 0.9, 1], ease: 'easeOut' }}
        />

        {/* Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0, p.opacity, p.opacity, 0], y: -20 }}
              transition={{
                opacity: { duration: 5, times: [0, 0.1, 0.9, 1] },
                y: {
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  ease: 'easeInOut',
                }
              }}
            />
          ))}
        </div>

        {/* Glassmorphism Card for Logo & Text */}
        <motion.div
          className="relative z-20 flex flex-col items-center p-12 rounded-3xl"
          style={{
            background: 'rgba(15, 23, 42, 0.3)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ 
            opacity: [0, 1, 1, 0], 
            y: [30, 0, 0, -30],
            filter: ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(10px)']
          }}
          transition={{ duration: 5, times: [0, 0.2, 0.9, 1], ease: 'easeInOut' }}
        >
          {/* Logo Animation (Animated SVG Paths) */}
          <div className="relative mb-8">
            {/* Ambient Logo Glow */}
            <motion.div
              className="absolute inset-0 rounded-full bg-yellow-500 blur-3xl opacity-20"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1, 1, 0] }}
              transition={{ duration: 5, times: [0, 0.3, 0.9, 1], ease: 'easeInOut' }}
            />
            
            <svg viewBox="0 0 120 120" className="w-32 h-32 relative z-10 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              {/* Outer Hexagon/Shield Shape */}
              <motion.path
                d="M60 10 L110 35 L110 85 L60 110 L10 85 L10 35 Z"
                fill="transparent"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 1, 1, 1] }}
                transition={{ duration: 5, times: [0, 0.4, 0.9, 1], ease: "easeInOut" }}
              />
              <motion.path
                d="M60 10 L110 35 L110 85 L60 110 L10 85 L10 35 Z"
                fill="transparent"
                stroke="url(#logoGrad)"
                strokeWidth="2.5"
                strokeDasharray="1 1"
                initial={{ pathLength: 0, pathOffset: 1 }}
                animate={{ pathLength: [0, 1, 1, 1], pathOffset: [1, 0, 0, 0] }}
                transition={{ duration: 5, times: [0, 0.5, 0.9, 1], ease: "easeInOut" }}
              />
              
              {/* Inner Abstract 'E' / Connection Nodes */}
              <motion.path
                d="M35 35 L60 50 L85 35 M60 50 L60 85"
                fill="transparent"
                stroke="#f59e0b"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1, 1], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 5, times: [0, 0.3, 0.9, 1], ease: "easeInOut", delay: 0.5 }}
              />
              <motion.path
                d="M35 60 L60 75 M35 85 L50 77"
                fill="transparent"
                stroke="#3b82f6"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1, 1], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 5, times: [0, 0.25, 0.9, 1], ease: "easeInOut", delay: 1 }}
              />
              
              {/* Data points / Nodes */}
              {[
                { cx: 35, cy: 35, delay: 0.2 },
                { cx: 85, cy: 35, delay: 0.4 },
                { cx: 60, cy: 50, delay: 0.1 },
                { cx: 60, cy: 85, delay: 0.6 },
                { cx: 35, cy: 60, delay: 0.5 },
                { cx: 35, cy: 85, delay: 0.7 }
              ].map((dot, i) => (
                <motion.circle
                  key={i}
                  cx={dot.cx}
                  cy={dot.cy}
                  r="4"
                  fill="#ffffff"
                  className="drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 5 - dot.delay, times: [0, 0.1, 0.9, 1], delay: dot.delay, ease: "easeInOut" }}
                />
              ))}
            </svg>
          </div>

          {/* Elegant Bangla Typography */}
          <motion.div className="overflow-hidden">
            <motion.h1
              className="text-4xl md:text-5xl font-medium tracking-wide text-transparent bg-clip-text"
              style={{
                fontFamily: "'Hind Siliguri', sans-serif",
                backgroundImage: 'linear-gradient(to right, #ffffff, #cbd5e1)',
              }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: [50, 0, 0, -20], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 5, times: [0, 0.2, 0.9, 1], delay: 0.5, ease: "easeInOut" }}
            >
              কোচিং পরিচালনা এখন আরও সহজ।
            </motion.h1>
          </motion.div>
        </motion.div>

        {/* Global Dark Vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(circle, transparent 40%, rgba(2,6,23,0.8) 100%)'
        }} />
      </motion.div>
    </motion.div>
  );
}

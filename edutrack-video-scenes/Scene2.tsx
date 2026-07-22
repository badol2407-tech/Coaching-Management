import { motion } from 'framer-motion';

const segmentEasings = ['linear', 'easeOut', 'linear', 'easeIn'];

export function Scene2() {
  const cards = [
    {
      title: "Student Attendance",
      value: "94.5%",
      subtitle: "+2.1% this week",
      icon: (
        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "rgba(59, 130, 246, 0.2)",
      textColor: "text-blue-400",
      times: [0, 0.12, 0.24, 0.9, 1]
    },
    {
      title: "Fee Management",
      value: "৳ 1,24,500",
      subtitle: "85% collected",
      icon: (
        <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "rgba(245, 158, 11, 0.2)",
      textColor: "text-yellow-500",
      times: [0, 0.16, 0.28, 0.9, 1]
    },
    {
      title: "Homework Tracking",
      value: "28/32",
      subtitle: "Assignments submitted",
      icon: (
        <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: "rgba(168, 85, 247, 0.2)",
      textColor: "text-purple-400",
      times: [0, 0.20, 0.32, 0.9, 1]
    },
    {
      title: "Student Progress",
      value: "A+",
      subtitle: "Average grade",
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: "rgba(16, 185, 129, 0.2)",
      textColor: "text-emerald-400",
      times: [0, 0.24, 0.36, 0.9, 1]
    }
  ];

  return (
    <motion.div
      className="absolute inset-0 bg-[#020617] overflow-hidden flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 5, times: [0, 0.1, 0.9, 1], ease: 'linear' }}
    >
      {/* Background ambient glow */}
      <motion.div
        className="absolute z-0 w-[1000px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(30,58,138,0.15) 0%, rgba(180,83,9,0.08) 40%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1.1, 1] }}
        transition={{ duration: 5, times: [0, 0.2, 0.9, 1], ease: 'easeOut' }}
      />

      {/* EduTrack Logo slowly drifting upwards in the background */}
      <motion.div
        className="absolute top-1/2 left-1/2 z-0"
        initial={{ x: '-50%', y: '-30%', scale: 1.4, opacity: 0 }}
        animate={{ 
          y: ['-30%', '-50%', '-60%', '-70%'], 
          scale: [1.4, 0.9, 0.9, 0.8],
          opacity: [0, 0.12, 0.12, 0]
        }}
        transition={{ duration: 5, times: [0, 0.3, 0.9, 1], ease: ['easeOut', 'linear', 'easeIn'] }}
      >
        <svg viewBox="0 0 120 120" className="w-[450px] h-[450px] drop-shadow-[0_0_20px_rgba(234,179,8,0.2)]">
          <defs>
            <linearGradient id="logoGradBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <path
            d="M60 10 L110 35 L110 85 L60 110 L10 85 L10 35 Z"
            fill="transparent"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="2"
          />
          <path
            d="M60 10 L110 35 L110 85 L60 110 L10 85 L10 35 Z"
            fill="transparent"
            stroke="url(#logoGradBg)"
            strokeWidth="2.5"
            strokeDasharray="2 4"
            className="opacity-40"
          />
          <path
            d="M35 35 L60 50 L85 35 M60 50 L60 85"
            fill="transparent"
            stroke="#f59e0b"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M35 60 L60 75 M35 85 L50 77"
            fill="transparent"
            stroke="#3b82f6"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {[
            { cx: 35, cy: 35 },
            { cx: 85, cy: 35 },
            { cx: 60, cy: 50 },
            { cx: 60, cy: 85 },
            { cx: 35, cy: 60 },
            { cx: 35, cy: 85 }
          ].map((dot, i) => (
            <circle
              key={i}
              cx={dot.cx}
              cy={dot.cy}
              r="4"
              fill="#ffffff"
              className="drop-shadow-[0_0_5px_rgba(255,255,255,0.4)] opacity-50"
            />
          ))}
        </svg>
      </motion.div>

      {/* Cinematic Horizontal Pan Container */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center w-full h-full"
        initial={{ x: '3%' }}
        animate={{ x: '-3%' }}
        transition={{ duration: 5, ease: 'linear' }}
      >
        {/* Glassmorphism Dashboard */}
        <motion.div
          className="w-[850px] rounded-[2rem] p-8 flex flex-col gap-6"
          style={{
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
          initial={{ opacity: 0, y: 40, scale: 0.95, filter: 'blur(10px)' }}
          animate={{ 
            opacity: [0, 0, 1, 1, 0], 
            y: [40, 40, 0, 0, -20], 
            scale: [0.95, 0.95, 1, 1, 1.05], 
            filter: ['blur(10px)', 'blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(10px)'] 
          }}
          transition={{ duration: 5, times: [0, 0.04, 0.16, 0.9, 1], ease: segmentEasings }}
        >
          {/* Dashboard Header Bar */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex gap-4 items-center">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="h-4 w-px bg-white/10 mx-1" />
              <div className="text-white/40 text-xs font-semibold tracking-[0.2em]">EDUTRACK OS</div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-yellow-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-slate-900 border border-white/20" />
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 gap-6">
            {cards.map((card, i) => (
              <motion.div
                key={i}
                className="rounded-2xl p-6 relative overflow-hidden group"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)'
                }}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ 
                  opacity: [0, 0, 1, 1, 0], 
                  y: [20, 20, 0, 0, -10], 
                  filter: ['blur(8px)', 'blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(8px)'] 
                }}
                transition={{ duration: 5, times: card.times, ease: segmentEasings }}
              >
                {/* Glowing orb behind card content */}
                <div 
                  className="absolute -top-4 -right-4 w-32 h-32 blur-[40px] mix-blend-screen transition-opacity duration-700 opacity-60" 
                  style={{ background: card.color, borderRadius: '50%' }} 
                />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-black/40 border border-white/5 backdrop-blur-md shadow-lg">
                      {card.icon}
                    </div>
                    <div className="text-white/60 font-medium tracking-wider text-xs uppercase">{card.title}</div>
                  </div>
                  <div className="text-4xl font-semibold text-white mb-2 tracking-tight">{card.value}</div>
                  <div className={`text-sm font-medium ${card.textColor}`}>
                    {card.subtitle}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Floating Tagline / Typography */}
        <motion.h2
          className="text-3xl md:text-4xl font-medium tracking-wide mt-12 text-transparent bg-clip-text drop-shadow-lg"
          style={{
            fontFamily: "'Hind Siliguri', sans-serif",
            backgroundImage: 'linear-gradient(to right, #ffffff, #94a3b8)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: [0, 0, 1, 1, 0], 
            y: [20, 20, 0, 0, -20] 
          }}
          transition={{ duration: 5, times: [0, 0.3, 0.44, 0.9, 1], ease: segmentEasings }}
        >
          শিক্ষার্থী, ফি ও ক্লাস ম্যানেজমেন্ট এক জায়গায়।
        </motion.h2>
      </motion.div>

      {/* Global dark vignette to frame the scene perfectly */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle at center, transparent 30%, rgba(2,6,23,0.95) 100%)'
      }} />
    </motion.div>
  );
}

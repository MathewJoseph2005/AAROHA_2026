import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trophy, Calendar, Users, Zap } from 'lucide-react';
import sargamLogo from '@/assets/SARGAM_LOGO.png';
import sjcLogo from '@/assets/SJC_LOGO.png';

const stats = [
  { icon: Trophy, label: 'Prize Pool', value: '₹60,000', color: 'text-neon-gold' },
  { icon: Calendar, label: 'Event Time', value: '12 PM – 5 PM', color: 'text-neon-cyan' },
  { icon: Users, label: 'Team Size', value: '4–10 Members', color: 'text-neon-magenta' },
  { icon: Zap, label: 'Entry Fee', value: '₹1,200/team', color: 'text-neon-violet' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28">
      {/* Animated background gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px] animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-600/10 rounded-full blur-[100px] animate-glow-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* SJC logo watermark — fixed behind all content */}
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0">
        <img
          src={sjcLogo}
          alt=""
          className="w-[125%] h-[110%] max-w-none object-contain opacity-[0.15]"
          style={{ filter: 'blur(1.5px) brightness(1.4) grayscale(0.2)' }}
        />
      </div>

      {/* Subtle dark vignette over the watermark for readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(2,6,23,0.6) 80%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* SARGAM Logo Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center mb-14"
        >
          {/* Rotating halo ring */}
          <div className="absolute w-52 h-52 sm:w-64 sm:h-64 md:w-80 md:h-80 logo-halo">
            <div className="w-full h-full rounded-full" style={{
              background: 'conic-gradient(from 0deg, rgba(139,92,246,0.5), rgba(6,182,212,0.4), rgba(236,72,153,0.4), rgba(139,92,246,0.5))',
              mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 2px))',
              WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 2px))',
            }} />
          </div>

          {/* Outer glow — slow breathe */}
          <div className="absolute w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full bg-violet-600/15 blur-[80px] logo-breathe-slow" />

          {/* Inner glow — faster breathe, offset timing */}
          <div className="absolute w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 rounded-full bg-cyan-500/10 blur-[60px] logo-breathe-fast" />

          {/* Liquid glass circle with SJC logo behind */}
          <div className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 rounded-full overflow-hidden">
            {/* Layer 1: SJC logo as faint background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={sjcLogo}
                alt=""
                className="w-[60%] h-[60%] object-contain opacity-20"
                style={{ filter: 'blur(1px) brightness(1.2)' }}
              />
            </div>

            {/* Layer 2: Frosted glass overlay */}
            <div
              className="absolute inset-0 rounded-full backdrop-blur-md border border-white/10"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(139,92,246,0.15), rgba(15,23,42,0.6) 60%, rgba(6,182,212,0.08))',
                boxShadow: 'inset 0 0 40px rgba(139,92,246,0.1), inset 0 2px 4px rgba(255,255,255,0.05), 0 0 30px rgba(139,92,246,0.15)',
              }}
            />

            {/* Layer 3: SARGAM logo on top — highlighted */}
            <div className="relative w-full h-full flex items-center justify-center logo-float">
              {/* Shine sweep overlay */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/15 to-transparent logo-shine" />
              </div>

              <img
                src={sargamLogo}
                alt="SARGAM 2026"
                className="relative w-[75%] h-[75%] object-contain"
                style={{
                  filter: 'drop-shadow(0 0 30px rgba(139,92,246,0.5)) drop-shadow(0 0 60px rgba(139,92,246,0.25)) drop-shadow(0 0 100px rgba(6,182,212,0.15))',
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Tag line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-medium">
            AAROHA 2026 – Inter-College Battle of Bands
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6"
        >
          <span className="block text-white">Get Ready to</span>
          <span className="block bg-gradient-to-r from-violet-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
            Rock the Stage
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-10"
        >
          An electrifying inter-college music showdown. Bring your band, your energy,
          and your passion — compete for glory and a massive{' '}
          <span className="text-neon-gold font-semibold">₹60,000 prize pool</span>.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Button variant="neon" size="xl" asChild>
            <Link to="/register">Register Your Band</Link>
          </Button>
          <Button variant="neon-outline" size="xl" asChild>
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
            >
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              <span className="text-xl font-bold text-white">{stat.value}</span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
    </section>
  );
}

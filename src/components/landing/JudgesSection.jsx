import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { HelpCircle, Eye, Clock, Crown } from 'lucide-react';

export default function JudgesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="judges" className="relative py-24 overflow-hidden" ref={ref}>
      {/* Background accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-600/6 rounded-full blur-[160px]" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-600/8 rounded-full blur-[120px]" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/6 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-sm font-semibold text-amber-400 uppercase tracking-widest">
            Coming Soon
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            The{' '}
            <span className="bg-gradient-to-r from-amber-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
              Judge
            </span>
          </h2>
          <p className="mt-4 max-w-lg mx-auto text-gray-400">
            One name. One decision. One legend who will decide your fate on stage.
          </p>
        </motion.div>

        {/* Single Judge Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-lg mx-auto group"
        >
          <div className="relative p-10 rounded-3xl bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-white/[0.04] border border-white/[0.08] backdrop-blur-sm hover:border-amber-500/20 transition-all duration-500 text-center overflow-hidden">
            {/* Animated glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-violet-500/0 to-cyan-500/0 group-hover:from-amber-500/[0.05] group-hover:via-violet-500/[0.03] group-hover:to-cyan-500/[0.05] transition-all duration-700 rounded-3xl" />

            {/* Crown icon */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative flex justify-center mb-6"
            >
              <Crown className="w-8 h-8 text-amber-400/60 group-hover:text-amber-400 transition-colors duration-500" />
            </motion.div>

            {/* Mystery silhouette — large */}
            <div className="relative mx-auto mb-8 w-36 h-36 rounded-full bg-gradient-to-br from-white/[0.05] to-white/[0.01] border-2 border-dashed border-white/[0.1] flex items-center justify-center group-hover:border-amber-500/25 transition-all duration-500">
              {/* Pulsing glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500 via-violet-500 to-cyan-500 opacity-0 group-hover:opacity-15 blur-lg transition-opacity duration-700 animate-pulse" />
              {/* Inner ring */}
              <div className="absolute inset-2 rounded-full border border-white/[0.05]" />
              {/* Question mark */}
              <HelpCircle className="w-14 h-14 text-white/15 group-hover:text-white/35 group-hover:rotate-12 transition-all duration-500" />
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 to-violet-500/15 border border-amber-500/20 mb-5">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                Identity Classified
              </span>
            </div>

            {/* Mystery tagline */}
            <p className="text-gray-300 text-base leading-relaxed mb-2 italic max-w-sm mx-auto">
              "A name that will make your jaw drop."
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Industry icon • Chart-topper • The ultimate authority
            </p>

            {/* Redacted Name Effect */}
            <div className="space-y-2 mb-6">
              <div className="mx-auto h-4 w-48 bg-white/[0.06] rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent animate-[shimmer_2.5s_ease-in-out_infinite]" />
              </div>
              <div className="mx-auto h-3 w-32 bg-white/[0.04] rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent animate-[shimmer_2.5s_ease-in-out_0.3s_infinite]" />
              </div>
            </div>

            {/* Decorative dashes */}
            <div className="flex items-center justify-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-0.5 rounded-full bg-amber-500/30"
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Countdown teaser */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-sm text-gray-300">
              Grand reveal dropping soon — stay tuned!
            </span>
            <span className="text-lg">🔥</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

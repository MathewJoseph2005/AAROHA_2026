import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Guitar, Mic, Drum, Music2, CalendarDays, GraduationCap, Clock, Timer } from 'lucide-react';

const features = [
  {
    icon: Guitar,
    title: 'Live Performances',
    description: 'Showcase your talent with raw, unprocessed live music on a professional stage.',
  },
  {
    icon: Mic,
    title: 'Professional Setup',
    description: 'State-of-the-art sound system, microphones, and stage equipment provided.',
  },
  {
    icon: Drum,
    title: 'Drum Kits Available',
    description: 'Specify your drum setup requirements and we\'ll have it ready for you.',
  },
  {
    icon: Music2,
    title: 'Expert Judges',
    description: 'Evaluated by industry professionals on musicality, stage presence, and creativity.',
  },
];

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative py-24 overflow-hidden" ref={ref}>
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-violet-600/10 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-neon-violet uppercase tracking-widest">
            About the Event
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Battle of Bands –{' '}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              SARGAM
            </span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-gray-400 text-lg">
            A high-energy inter-college music showdown bringing together the most
            talented campus bands for an electrifying live performance experience.
            No backing tracks, no software processing — just pure musical talent.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-violet-500/30 transition-all duration-300 hover:bg-white/[0.05]"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-neon-violet group-hover:text-neon-cyan transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Event Date & Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 rounded-2xl bg-gradient-to-br from-violet-500/10 via-slate-900/50 to-cyan-500/10 border border-white/[0.06] overflow-hidden"
        >
          {/* Top row – Date & Time + Alumni + Prize */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:divide-x divide-white/[0.06]">
            {/* Date & Time — hero card */}
            <div className="md:col-span-2 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-cyan-600/5 pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-semibold uppercase tracking-wider mb-4">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Save the Date
                </div>
                <p className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  7<span className="text-violet-400">th</span> March
                </p>
                <p className="text-lg font-semibold text-cyan-400 mt-1">2026</p>
                <p className="text-sm text-gray-400 mt-2 flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  12:00 PM – 5:00 PM
                </p>
              </div>
            </div>

            {/* Right side – Alumni + Reporting + Prize */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]">
              {/* Alumni Participation */}
              <div className="p-6 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-violet-500/20 flex items-center justify-center mb-3">
                  <GraduationCap className="w-5 h-5 text-pink-400" />
                </div>
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Participation</p>
                <p className="text-lg font-bold text-white">Alumni Welcome</p>
                <p className="text-xs text-pink-400 mt-1">Open to students & alumni</p>
              </div>

              {/* Reporting & Prize */}
              <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Reporting Time</p>
                  <p className="text-lg font-bold text-white">10:00 AM</p>
                  <p className="text-xs text-amber-400 mt-0.5">2 hours prior – Mandatory</p>
                </div>
                <div className="w-8 h-px bg-white/10" />
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Prize Pool</p>
                  <p className="text-lg font-bold text-neon-gold">₹60,000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row – Per-Team Timing Breakdown */}
          <div className="border-t border-white/[0.06] p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-5">
              <Timer className="w-5 h-5 text-neon-cyan" />
              <h4 className="text-base font-bold text-white">Time Allotment Per Team</h4>
              <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
                30 Minutes Total
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Sound Check */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-2xl font-black text-violet-400">15<span className="text-sm font-medium text-gray-500 ml-1">min</span></p>
                <p className="text-sm font-semibold text-white mt-1">Sound / Line Check</p>
                <p className="text-xs text-amber-400/80 mt-1 italic">Negative marking for exceeding time</p>
              </div>
              {/* Live Performance */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-2xl font-black text-cyan-400">15<span className="text-sm font-medium text-gray-500 ml-1">min</span></p>
                <p className="text-sm font-semibold text-white mt-1">Live Performance</p>
                <p className="text-xs text-gray-500 mt-1">On-stage performance window</p>
              </div>
              {/* Early Arrival Bonus */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-2xl font-black text-green-400">10<span className="text-sm font-medium text-gray-500 ml-1">min</span></p>
                <p className="text-sm font-semibold text-white mt-1">Early Testing</p>
                <p className="text-xs text-gray-500 mt-1">Available if team arrives before program</p>
              </div>
              {/* Remaining */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-2xl font-black text-pink-400">5<span className="text-sm font-medium text-gray-500 ml-1">min</span></p>
                <p className="text-sm font-semibold text-white mt-1">Remaining Check</p>
                <p className="text-xs text-gray-500 mt-1">Provided during event day</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Guitar, Mic, Drum, Music2 } from 'lucide-react';

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

        {/* Event Details Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-violet-500/10 via-slate-900/50 to-cyan-500/10 border border-white/[0.06]"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Reporting Time</p>
              <p className="text-xl font-bold text-white">10:00 AM</p>
              <p className="text-xs text-amber-400 mt-1">2 hours prior — Mandatory</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Event Duration</p>
              <p className="text-xl font-bold text-white">12:00 PM – 5:00 PM</p>
              <p className="text-xs text-gray-500 mt-1">6 hours of live music</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Prize Pool</p>
              <p className="text-xl font-bold text-neon-gold">₹60,000</p>
              <p className="text-xs text-gray-500 mt-1">Total cash prizes</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Music, Star, Sparkles, Heart } from 'lucide-react';

const criteria = [
  {
    icon: Music,
    title: 'Musicality',
    description:
      'Technical proficiency, tonal quality, rhythmic accuracy, and harmonic consistency of the performance.',
    weight: '30%',
    color: 'from-violet-500 to-violet-600',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    icon: Star,
    title: 'Stage Presence',
    description:
      'Energy, confidence, audience engagement, overall visual performance, and band coordination on stage.',
    weight: '25%',
    color: 'from-cyan-500 to-cyan-600',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
  },
  {
    icon: Sparkles,
    title: 'Creativity & Originality',
    description:
      'Unique arrangements, original compositions, creative expression, and artistic innovation.',
    weight: '25%',
    color: 'from-pink-500 to-pink-600',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/20',
  },
  {
    icon: Heart,
    title: 'Overall Impact',
    description:
      'The lasting impression on the audience and judges. Emotional connection, crowd response, and performance memorability.',
    weight: '20%',
    color: 'from-amber-500 to-amber-600',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
  },
];

export default function CriteriaSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="criteria" className="relative py-24 overflow-hidden" ref={ref}>
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-cyan-600/10 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-neon-cyan uppercase tracking-widest">
            Evaluation
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Judging{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">
              Criteria
            </span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-gray-400">
            Each band will be judged by a panel of industry professionals based on these four key areas.
          </p>
        </motion.div>

        {/* Criteria Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {criteria.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.12 }}
              className={`relative p-6 rounded-2xl ${item.bg} border ${item.border} backdrop-blur-sm group hover:scale-[1.02] transition-transform duration-300`}
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                </div>
                <span className={`text-2xl font-black bg-gradient-to-br ${item.color} bg-clip-text text-transparent shrink-0`}>
                  {item.weight}
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

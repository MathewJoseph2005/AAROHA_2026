import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  CheckCircle,
  XCircle,
  Users,
  Clock,
  AlertTriangle,
} from 'lucide-react';

const rules = [
  {
    icon: Users,
    title: 'Team Composition',
    items: [
      'Team size: 4 to 10 members',
      'All members must be college students',
      'Each team must have a designated leader',
    ],
  },
  {
    icon: Clock,
    title: 'Performance',
    items: [
      'Each band gets a fixed time slot for performance',
      'Reporting time: 10:00 AM (Mandatory)',
      'Event runs from 12:00 PM to 6:00 PM',
    ],
  },
  {
    icon: CheckCircle,
    title: 'Allowed',
    items: [
      'Original compositions and covers',
      'Acoustic and electric instruments',
      'Use of provided microphones and stage equipment',
    ],
    type: 'allowed',
  },
  {
    icon: XCircle,
    title: 'Not Allowed',
    items: [
      'No backing tracks or pre-recorded music',
      'No VST or software sound processing',
      'No obscene or offensive content',
    ],
    type: 'forbidden',
  },
];

const eligibility = [
  'Open to all college & university students across India',
  'Valid college ID is mandatory for all band members',
  'One student can be part of only one band',
  'Registration fee: ₹1,200 per team (non-refundable)',
  'All genres of music are welcome',
];

export default function RulesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="rules" className="relative py-24 overflow-hidden" ref={ref}>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-600/10 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-neon-magenta uppercase tracking-widest">
            Guidelines
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Rules &{' '}
            <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
              Eligibility
            </span>
          </h2>
        </motion.div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {rules.map((rule, i) => (
            <motion.div
              key={rule.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              className={`p-6 rounded-2xl border backdrop-blur-sm ${
                rule.type === 'forbidden'
                  ? 'bg-red-500/[0.03] border-red-500/20'
                  : rule.type === 'allowed'
                  ? 'bg-green-500/[0.03] border-green-500/20'
                  : 'bg-white/[0.03] border-white/[0.06]'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <rule.icon
                  className={`w-5 h-5 ${
                    rule.type === 'forbidden'
                      ? 'text-red-400'
                      : rule.type === 'allowed'
                      ? 'text-green-400'
                      : 'text-neon-violet'
                  }`}
                />
                <h3 className="text-lg font-semibold text-white">{rule.title}</h3>
              </div>
              <ul className="space-y-2">
                {rule.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                    <span
                      className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        rule.type === 'forbidden'
                          ? 'bg-red-400'
                          : rule.type === 'allowed'
                          ? 'bg-green-400'
                          : 'bg-violet-400'
                      }`}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Eligibility */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-pink-500/5 via-slate-900/50 to-violet-500/5 border border-white/[0.06]"
        >
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-neon-gold" />
            <h3 className="text-xl font-bold text-white">Eligibility Criteria</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {eligibility.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 text-sm text-gray-400"
              >
                <CheckCircle className="w-4 h-4 text-neon-cyan mt-0.5 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

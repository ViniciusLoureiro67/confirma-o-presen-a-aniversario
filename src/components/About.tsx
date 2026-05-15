import { motion } from 'framer-motion';
import { Crown, Info } from 'lucide-react';
import { Card } from './ui/card';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function About() {
  return (
    <section className="relative overflow-hidden">

      <div className="relative section-pad container-narrow">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          variants={fadeUp}
        >
          <p className="section-eyebrow text-center uppercase tracking-[0.3em] text-xs text-lilac-600 mb-3">
            A festa
          </p>
          <h2 className="section-title text-center text-4xl sm:text-5xl text-slate-800 mb-10">
            Era uma vez...
          </h2>

          <Card className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mx-auto mb-6 w-24 sm:w-28 animate-float"
            >
              <EnchantedRose />
            </motion.div>

            <p className="text-center text-lg text-slate-700 leading-relaxed font-display italic">
              “A Isabela é a nossa Bela, e está completando 7 anos!”
            </p>

            <div className="mt-8 rounded-2xl bg-rose-50/90 border border-rose-100 p-5 sm:p-6 text-center space-y-2">
              <Crown className="mx-auto h-6 w-6 text-gold-400" />
              <p className="text-slate-700 leading-relaxed">
                A Bela convida as princesas para virem{' '}
                <strong className="text-rose-500">de fantasia</strong> ao baile real.
              </p>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-lilac-100 bg-lilac-50/60 p-4 text-sm text-slate-600">
              <Info className="h-4 w-4 mt-0.5 text-lilac-500 shrink-0" />
              <p>
                <strong className="text-lilac-600">Observação:</strong> a fantasia da{' '}
                <em>princesa Bela</em> é exclusiva da aniversariante.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function EnchantedRose() {
  return (
    <svg viewBox="0 0 120 160" className="w-full h-auto" aria-hidden>
      <defs>
        <radialGradient id="domeGlow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff5f7" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#ffe4ec" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffc9d9" stopOpacity="0.15" />
        </radialGradient>
        <radialGradient id="petal" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ff7aa1" />
          <stop offset="100%" stopColor="#c43562" />
        </radialGradient>
        <linearGradient id="goldStand" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#f5c97a" />
          <stop offset="100%" stopColor="#c08a36" />
        </linearGradient>
      </defs>

      {/* base dourada */}
      <ellipse cx="60" cy="148" rx="34" ry="6" fill="url(#goldStand)" />
      <rect x="36" y="132" width="48" height="14" rx="4" fill="url(#goldStand)" />

      {/* redoma de vidro */}
      <path
        d="M30 130 Q30 50 60 30 Q90 50 90 130 Z"
        fill="url(#domeGlow)"
        stroke="#fff"
        strokeOpacity="0.6"
        strokeWidth="1"
      />
      <path
        d="M38 60 Q44 38 60 30"
        stroke="#fff"
        strokeOpacity="0.55"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      {/* haste */}
      <path d="M60 130 Q58 100 60 80" stroke="#3a6b3a" strokeWidth="2.5" fill="none" />
      <path d="M58 100 Q50 96 48 102 Q54 104 58 100" fill="#3a6b3a" />

      {/* flor */}
      <g transform="translate(60 72)">
        <circle r="14" fill="url(#petal)" />
        <path d="M-10 -2 Q0 -16 10 -2 Q0 4 -10 -2" fill="#c43562" opacity="0.85" />
        <path d="M-6 -8 Q0 -14 6 -8 Q0 -4 -6 -8" fill="#8b1d3a" opacity="0.7" />
        <circle r="3" fill="#5a0f24" />
      </g>

      {/* pétala caída */}
      <ellipse cx="46" cy="128" rx="5" ry="2.5" fill="#c43562" opacity="0.8" transform="rotate(-25 46 128)" />
    </svg>
  );
}


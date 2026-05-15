import { motion } from 'framer-motion';
import { CalendarHeart, Clock, MapPin, CalendarPlus } from 'lucide-react';
import { Button } from './ui/button';
import { calendarUrl } from '@/lib/calendar';

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[100svh] flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/ballroom-1.png)' }}
      />
      <div className="absolute inset-0 bg-black/55" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 45%, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 60%)',
        }}
      />

      <div className="relative section-pad container-narrow text-center w-full">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="uppercase tracking-[0.4em] text-xs sm:text-sm text-gold-200 font-medium mb-4"
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.7)' }}
        >
          Era uma vez um convite...
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display text-6xl sm:text-7xl md:text-9xl font-semibold bg-gradient-to-br from-gold-100 via-rose-200 to-gold-300 bg-clip-text text-transparent leading-[0.95] drop-shadow-[0_4px_30px_rgba(245,201,122,0.45)]"
        >
          Isabela
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-3 flex items-center justify-center gap-3"
        >
          <span className="h-px w-12 bg-gold-200/70" />
          <span className="font-display italic text-xl sm:text-2xl text-gold-100">
            faz 7 anos
          </span>
          <span className="h-px w-12 bg-gold-200/70" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-10 grid gap-3 sm:grid-cols-3 sm:gap-4"
        >
          <InfoPill icon={<CalendarHeart className="h-4 w-4" />} label="Sábado, 23 de maio" />
          <InfoPill icon={<Clock className="h-4 w-4" />} label="19h" />
          <InfoPill icon={<MapPin className="h-4 w-4" />} label="Planeta Mágico" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <Button
            size="lg"
            onClick={() => {
              document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Confirmar presença ✨
          </Button>
          <Button asChild variant="secondary" size="lg">
            <a href={calendarUrl()} target="_blank" rel="noopener noreferrer">
              <CalendarPlus className="h-4 w-4" />
              Salvar na agenda
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function InfoPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-full bg-white/15 backdrop-blur-md border border-white/30 px-4 py-2.5 flex items-center justify-center gap-2 text-sm text-white shadow-lg">
      <span className="text-gold-200">{icon}</span>
      <span className="font-medium">{label}</span>
    </div>
  );
}

import { motion } from 'framer-motion';
import { MapPin, ExternalLink, CalendarPlus } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { calendarUrl } from '@/lib/calendar';

const ADDRESS =
  'Planeta Mágico, R. Dr. Alfredo Oiticica, 84, Pitanguinha, Maceió, AL, 57052-230';
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent(ADDRESS);
const EMBED_URL =
  'https://www.google.com/maps?q=' + encodeURIComponent(ADDRESS) + '&output=embed';

export function Location() {
  return (
    <section className="relative overflow-hidden">

      <div className="relative section-pad container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-eyebrow text-center uppercase tracking-[0.3em] text-xs text-lilac-600 mb-3">
            Onde
          </p>
          <h2 className="section-title text-center text-4xl sm:text-5xl text-slate-800 mb-10">
            Como chegar
          </h2>

          <Card className="!p-0 overflow-hidden">
            <div className="aspect-[16/10] w-full bg-rose-50">
              <iframe
                title="Mapa do local da festa"
                src={EMBED_URL}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-start gap-3">
                <span className="mt-1 grid h-9 w-9 place-items-center rounded-full bg-rose-100 text-rose-500 shrink-0">
                  <MapPin className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold text-slate-800">Planeta Mágico</p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    R. Dr. Alfredo Oiticica, 84, Pitanguinha
                    <br />
                    Maceió, AL, 57052-230
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Button asChild variant="secondary" className="w-full">
                  <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                    Ver no Google Maps
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <a href={calendarUrl()} target="_blank" rel="noopener noreferrer">
                    <CalendarPlus className="h-4 w-4" />
                    Adicionar à agenda
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

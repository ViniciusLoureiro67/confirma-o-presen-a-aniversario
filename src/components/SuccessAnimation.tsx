import { motion } from 'framer-motion';
import { Sparkles, Check, CalendarPlus } from 'lucide-react';
import type { RsvpPayload } from '@/lib/schema';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { calendarUrl } from '@/lib/calendar';

export function SuccessAnimation({ payload }: { payload: RsvpPayload }) {
  const firstName = payload.nomeAdulto.split(' ')[0];
  const guestsCount = payload.convidados.length;

  const title = payload.responsavelVai
    ? 'Presença confirmada! 🎉'
    : 'Confirmação enviada! 💛';

  const message = payload.responsavelVai
    ? `Obrigado, ${firstName}! Recebemos sua confirmação. Mal podemos esperar para te ver no baile. 💛`
    : `Obrigado, ${firstName}! Cadastramos quem você confirmou. 💛`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
    >
      <Card className="text-center">
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-rose-400 via-lilac-400 to-gold-300 shadow-soft"
        >
          <Check className="h-10 w-10 text-white" strokeWidth={3} />
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-6 text-3xl sm:text-4xl text-slate-800"
        >
          {title}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-2 text-slate-600"
        >
          {message}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="mt-6 space-y-2 rounded-2xl bg-rose-50/80 p-5 text-left text-sm text-slate-700"
        >
          <p className="flex items-center gap-2 font-medium text-rose-500">
            <Sparkles className="h-4 w-4" />
            Resumo do que enviamos
          </p>
          <p>
            <strong>Telefone:</strong> {payload.telefone}
          </p>
          <p>
            <strong>Você vai:</strong> {payload.responsavelVai ? 'Sim' : 'Não'}
          </p>
          {guestsCount > 0 && (
            <div>
              <strong>
                {payload.responsavelVai ? 'Outras pessoas:' : 'Pessoas confirmadas:'}
              </strong>
              <ul className="mt-1 list-inside list-disc text-slate-600">
                {payload.convidados.map((c, i) => (
                  <li key={i}>
                    {c.nome}
                    {c.tipo === 'crianca' && c.idade !== undefined
                      ? ` (criança, ${c.idade} anos)`
                      : ' (adulto)'}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {payload.observacoes && (
            <p>
              <strong>Obs:</strong> {payload.observacoes}
            </p>
          )}
        </motion.div>

        {payload.responsavelVai && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-6"
          >
            <Button asChild variant="secondary" className="w-full">
              <a href={calendarUrl()} target="_blank" rel="noopener noreferrer">
                <CalendarPlus className="h-4 w-4" />
                Salvar na minha agenda
              </a>
            </Button>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}

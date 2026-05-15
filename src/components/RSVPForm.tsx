import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  Loader2,
  AlertCircle,
  CalendarPlus,
  User,
  Baby,
} from 'lucide-react';

import { rsvpSchema, toPayload, type RsvpFormValues, type RsvpPayload } from '@/lib/schema';
import { submitRsvp } from '@/lib/api';
import { calendarUrl } from '@/lib/calendar';
import { maskPhone, sanitizeName, sanitizeAge } from '@/lib/utils';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { SuccessAnimation } from './SuccessAnimation';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function RSVPForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [sentPayload, setSentPayload] = useState<RsvpPayload | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RsvpFormValues>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      nomeAdulto: '',
      telefone: '',
      vaiComparecer: 'sim' as const,
      convidados: [],
      observacoes: '',
    },
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'convidados' });
  const vai = watch('vaiComparecer');

  const addConvidado = (tipo: 'adulto' | 'crianca') => {
    append({ tipo, nome: '', idade: undefined });
    setTimeout(() => {
      const items = document.querySelectorAll<HTMLElement>('[data-guest-card]');
      const last = items[items.length - 1];
      if (!last) return;
      last.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = last.querySelector<HTMLInputElement>('input');
      input?.focus({ preventScroll: true });
    }, 100);
  };

  const onSubmit = async (values: RsvpFormValues) => {
    setStatus('loading');
    setErrorMsg(null);
    const payload = toPayload(values);
    try {
      await submitRsvp(payload);
      setSentPayload(payload);
      setStatus('success');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro inesperado.');
      setStatus('error');
    }
  };

  if (status === 'success' && sentPayload) {
    return (
      <section id="rsvp" className="relative overflow-hidden">
        <div className="relative section-pad container-narrow">
          <SuccessAnimation payload={sentPayload} />
        </div>
      </section>
    );
  }

  return (
    <section id="rsvp" className="relative overflow-hidden">
      <motion.div
        className="relative section-pad container-narrow"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6 }}
      >
        <p className="section-eyebrow text-center uppercase tracking-[0.3em] text-xs text-lilac-600 mb-3">
          RSVP
        </p>
        <h2 className="section-title text-center text-4xl sm:text-5xl text-slate-800 mb-10">
          Confirme sua presença
        </h2>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Field label="Seu nome (responsável)" error={errors.nomeAdulto?.message}>
              <Controller
                control={control}
                name="nomeAdulto"
                render={({ field }) => (
                  <Input
                    placeholder="Seu nome completo"
                    autoComplete="name"
                    value={field.value}
                    onChange={(e) => field.onChange(sanitizeName(e.target.value))}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </Field>

            <Field label="Telefone / WhatsApp" error={errors.telefone?.message}>
              <Controller
                control={control}
                name="telefone"
                render={({ field }) => (
                  <Input
                    inputMode="tel"
                    placeholder="(82) 99999-0000"
                    value={field.value}
                    onChange={(e) => field.onChange(maskPhone(e.target.value))}
                    onBlur={field.onBlur}
                  />
                )}
              />
            </Field>

            <Field label="Vai comparecer?" error={errors.vaiComparecer?.message}>
              <Controller
                control={control}
                name="vaiComparecer"
                render={({ field }) => (
                  <RadioGroup
                    value={field.value}
                    onValueChange={(v) => {
                      field.onChange(v);
                      if (v === 'nao') setValue('convidados', []);
                    }}
                    className="grid grid-cols-2 gap-3"
                  >
                    <RadioOption value="sim" label="Sim, vou! 🎉" />
                    <RadioOption value="nao" label="Não posso ir 🥲" />
                  </RadioGroup>
                )}
              />
            </Field>

            <AnimatePresence initial={false}>
              {vai === 'sim' && (
                <motion.div
                  key="guests"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="pt-2 space-y-1">
                    <Label className="text-base font-display text-slate-800">
                      Outros convidados (opcional)
                    </Label>
                    <p className="text-xs text-slate-500">
                      Adicione quem vai com você. Você já está contado como responsável.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addConvidado('adulto')}
                    >
                      <User className="h-4 w-4" />
                      + Adulto
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addConvidado('crianca')}
                    >
                      <Baby className="h-4 w-4" />
                      + Criança
                    </Button>
                  </div>

                  <AnimatePresence initial={false}>
                    {fields.map((f, idx) => {
                      const tipo = watch(`convidados.${idx}.tipo`);
                      const isCrianca = tipo === 'crianca';
                      const tipoIdx =
                        fields
                          .slice(0, idx)
                          .filter((x) => x.tipo === tipo).length + 1;
                      return (
                        <motion.div
                          key={f.id}
                          data-guest-card
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="rounded-2xl border border-rose-100 bg-white/60 p-4 space-y-3 scroll-mt-24"
                        >
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-lilac-500">
                              {isCrianca ? (
                                <Baby className="h-3.5 w-3.5" />
                              ) : (
                                <User className="h-3.5 w-3.5" />
                              )}
                              {isCrianca ? 'Criança' : 'Adulto'} {tipoIdx}
                            </span>
                            <button
                              type="button"
                              onClick={() => remove(idx)}
                              className="text-rose-400 hover:text-rose-600 transition-colors"
                              aria-label="Remover convidado"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div
                            className={
                              isCrianca
                                ? 'grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-3'
                                : 'grid grid-cols-1 gap-3'
                            }
                          >
                            <Field
                              label="Nome"
                              error={errors.convidados?.[idx]?.nome?.message}
                            >
                              <Controller
                                control={control}
                                name={`convidados.${idx}.nome` as const}
                                render={({ field }) => (
                                  <Input
                                    placeholder={
                                      isCrianca ? 'Nome da criança' : 'Nome do adulto'
                                    }
                                    value={field.value}
                                    onChange={(e) =>
                                      field.onChange(sanitizeName(e.target.value))
                                    }
                                    onBlur={field.onBlur}
                                  />
                                )}
                              />
                            </Field>
                            {isCrianca && (
                              <Field
                                label="Idade"
                                error={errors.convidados?.[idx]?.idade?.message}
                              >
                                <Controller
                                  control={control}
                                  name={`convidados.${idx}.idade` as const}
                                  render={({ field }) => (
                                    <Input
                                      inputMode="numeric"
                                      maxLength={2}
                                      value={
                                        field.value === undefined ||
                                        Number.isNaN(field.value)
                                          ? ''
                                          : String(field.value)
                                      }
                                      onChange={(e) => {
                                        const clean = sanitizeAge(e.target.value);
                                        field.onChange(
                                          clean === '' ? undefined : Number(clean),
                                        );
                                      }}
                                      onBlur={field.onBlur}
                                    />
                                  )}
                                />
                              </Field>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  <Field label="Observações (opcional)" error={errors.observacoes?.message}>
                    <Textarea
                      placeholder="Alergias, restrições alimentares, recado para os anfitriões..."
                      {...register('observacoes')}
                    />
                  </Field>
                </motion.div>
              )}
            </AnimatePresence>

            {status === 'error' && errorMsg && (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium">Não conseguimos enviar.</p>
                  <p className="text-rose-600/80">{errorMsg}</p>
                </div>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={status === 'loading'}
              className="w-full"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : status === 'error' ? (
                'Tentar novamente'
              ) : (
                'Confirmar presença ✨'
              )}
            </Button>
          </form>
        </Card>

        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-sm text-slate-600">Já quer separar a data?</p>
          <Button asChild variant="secondary" size="lg">
            <a href={calendarUrl()} target="_blank" rel="noopener noreferrer">
              <CalendarPlus className="h-4 w-4" />
              Adicionar à agenda
            </a>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}

function RadioOption({ value, label }: { value: string; label: string }) {
  return (
    <label
      htmlFor={`vai-${value}`}
      className="flex cursor-pointer items-center gap-3 rounded-2xl border border-rose-100 bg-white/70 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-white has-[:checked]:border-rose-300 has-[:checked]:bg-rose-50/80 has-[:checked]:text-rose-600"
    >
      <RadioGroupItem value={value} id={`vai-${value}`} />
      {label}
    </label>
  );
}

import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Loader2, AlertCircle, CalendarPlus } from 'lucide-react';

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
      criancas: [{ nome: '', idade: 0, acompanhante: '' }],
      observacoes: '',
    },
    mode: 'onBlur',
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'criancas' });
  const vai = watch('vaiComparecer');

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
            <Field label="Nome do adulto responsável" error={errors.nomeAdulto?.message}>
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
                      if (v === 'nao') {
                        setValue('criancas', []);
                      } else if (watch('criancas').length === 0) {
                        setValue('criancas', [{ nome: '', idade: 0, acompanhante: '' }]);
                      }
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
                  key="kids"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="flex items-center justify-between pt-2">
                    <Label className="text-base font-display text-slate-800">
                      Crianças que vão à festa
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => append({ nome: '', idade: 0, acompanhante: '' })}
                    >
                      <Plus className="h-4 w-4" />
                      Adicionar
                    </Button>
                  </div>

                  <AnimatePresence initial={false}>
                    {fields.map((f, idx) => (
                      <motion.div
                        key={f.id}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="rounded-2xl border border-rose-100 bg-white/60 p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium uppercase tracking-wider text-lilac-500">
                            Criança {idx + 1}
                          </span>
                          {fields.length > 1 && (
                            <button
                              type="button"
                              onClick={() => remove(idx)}
                              className="text-rose-400 hover:text-rose-600 transition-colors"
                              aria-label="Remover criança"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-3">
                          <Field
                            label="Nome"
                            error={errors.criancas?.[idx]?.nome?.message}
                          >
                            <Controller
                              control={control}
                              name={`criancas.${idx}.nome` as const}
                              render={({ field }) => (
                                <Input
                                  placeholder="Nome da criança"
                                  value={field.value}
                                  onChange={(e) =>
                                    field.onChange(sanitizeName(e.target.value))
                                  }
                                  onBlur={field.onBlur}
                                />
                              )}
                            />
                          </Field>
                          <Field
                            label="Idade"
                            error={errors.criancas?.[idx]?.idade?.message}
                          >
                            <Controller
                              control={control}
                              name={`criancas.${idx}.idade` as const}
                              render={({ field }) => (
                                <Input
                                  inputMode="numeric"
                                  maxLength={2}
                                  value={
                                    field.value === 0 || field.value === undefined
                                      ? ''
                                      : String(field.value)
                                  }
                                  onChange={(e) => {
                                    const clean = sanitizeAge(e.target.value);
                                    field.onChange(clean === '' ? 0 : Number(clean));
                                  }}
                                  onBlur={field.onBlur}
                                />
                              )}
                            />
                          </Field>
                        </div>
                        <Field
                          label="Acompanhante (opcional)"
                          error={errors.criancas?.[idx]?.acompanhante?.message}
                        >
                          <Controller
                            control={control}
                            name={`criancas.${idx}.acompanhante` as const}
                            render={({ field }) => (
                              <Input
                                placeholder="Nome de quem vai acompanhar a criança"
                                value={field.value ?? ''}
                                onChange={(e) =>
                                  field.onChange(sanitizeName(e.target.value))
                                }
                                onBlur={field.onBlur}
                              />
                            )}
                          />
                        </Field>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {errors.criancas?.message && (
                    <p className="text-sm text-rose-500">{errors.criancas.message}</p>
                  )}

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

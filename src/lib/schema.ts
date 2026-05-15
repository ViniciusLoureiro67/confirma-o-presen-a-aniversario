import { z } from 'zod';

const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
const nameRegex = /^[A-Za-zÀ-ÿ' -]+$/;
const NAME_MSG = 'Use apenas letras e espaços.';

export const rsvpSchema = z
  .object({
    nomeAdulto: z
      .string()
      .trim()
      .min(2, 'Informe seu nome (mínimo 2 caracteres).')
      .regex(nameRegex, NAME_MSG),
    telefone: z
      .string()
      .regex(phoneRegex, 'Telefone deve estar no formato (00) 00000-0000.'),
    vaiComparecer: z.enum(['sim', 'nao'], {
      required_error: 'Selecione uma opção.',
    }),
    convidados: z
      .array(
        z.object({
          tipo: z.enum(['adulto', 'crianca']),
          nome: z
            .string()
            .trim()
            .min(2, 'Nome muito curto.')
            .regex(nameRegex, NAME_MSG),
          idade: z
            .coerce
            .number()
            .int()
            .min(0)
            .max(17)
            .optional(),
        }),
      )
      .default([]),
    observacoes: z.string().trim().max(500, 'Máximo 500 caracteres.').optional(),
  })
  .superRefine((data, ctx) => {
    if (data.vaiComparecer !== 'sim') return;
    data.convidados.forEach((c, idx) => {
      if (c.tipo === 'crianca') {
        if (c.idade === undefined || Number.isNaN(c.idade)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['convidados', idx, 'idade'],
            message: 'Informe a idade da criança.',
          });
        } else if (c.idade < 0 || c.idade > 17) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['convidados', idx, 'idade'],
            message: 'Idade entre 0 e 17.',
          });
        }
      }
    });
  });

export type RsvpFormValues = z.infer<typeof rsvpSchema>;

export type RsvpConvidado = {
  tipo: 'adulto' | 'crianca';
  nome: string;
  idade?: number;
};

export type RsvpPayload = {
  nomeAdulto: string;
  telefone: string;
  vaiComparecer: boolean;
  convidados: RsvpConvidado[];
  observacoes: string;
};

export function toPayload(values: RsvpFormValues): RsvpPayload {
  const vai = values.vaiComparecer === 'sim';
  return {
    nomeAdulto: values.nomeAdulto.trim(),
    telefone: values.telefone.trim(),
    vaiComparecer: vai,
    convidados: vai
      ? values.convidados.map((c) => ({
          tipo: c.tipo,
          nome: c.nome.trim(),
          ...(c.tipo === 'crianca' && c.idade !== undefined
            ? { idade: c.idade }
            : {}),
        }))
      : [],
    observacoes: (values.observacoes ?? '').trim(),
  };
}

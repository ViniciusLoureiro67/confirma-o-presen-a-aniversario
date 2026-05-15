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
    criancas: z
      .array(
        z.object({
          nome: z
            .string()
            .trim()
            .min(2, 'Nome muito curto.')
            .regex(nameRegex, NAME_MSG),
          idade: z
            .coerce
            .number({ invalid_type_error: 'Informe a idade.' })
            .int('Use anos completos.')
            .min(0, 'Idade inválida.')
            .max(17, 'Idade máxima: 17 anos.'),
          acompanhante: z
            .string()
            .trim()
            .max(80, 'Nome muito longo.')
            .refine((v) => v === '' || nameRegex.test(v), NAME_MSG)
            .optional(),
        }),
      )
      .default([]),
    observacoes: z.string().trim().max(500, 'Máximo 500 caracteres.').optional(),
  })
  .superRefine((data, ctx) => {
    if (data.vaiComparecer === 'sim' && data.criancas.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['criancas'],
        message: 'Adicione pelo menos uma criança.',
      });
    }
  });

export type RsvpFormValues = z.infer<typeof rsvpSchema>;

export type RsvpPayload = {
  nomeAdulto: string;
  telefone: string;
  vaiComparecer: boolean;
  criancas: { nome: string; idade: number; acompanhante: string }[];
  observacoes: string;
};

export function toPayload(values: RsvpFormValues): RsvpPayload {
  const vai = values.vaiComparecer === 'sim';
  return {
    nomeAdulto: values.nomeAdulto.trim(),
    telefone: values.telefone.trim(),
    vaiComparecer: vai,
    criancas: vai
      ? values.criancas.map((c) => ({
          nome: c.nome.trim(),
          idade: c.idade,
          acompanhante: (c.acompanhante ?? '').trim(),
        }))
      : [],
    observacoes: (values.observacoes ?? '').trim(),
  };
}

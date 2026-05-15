import type { RsvpPayload } from './schema';

const URL = import.meta.env.VITE_APPS_SCRIPT_URL as string | undefined;

export async function submitRsvp(payload: RsvpPayload): Promise<void> {
  if (!URL) {
    throw new Error(
      'VITE_APPS_SCRIPT_URL não configurada. Defina no arquivo .env.',
    );
  }

  const res = await fetch(URL, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    redirect: 'follow',
  });

  if (!res.ok) {
    throw new Error(`Falha no envio (HTTP ${res.status}).`);
  }

  const text = await res.text();
  try {
    const json = JSON.parse(text);
    if (json && json.success === false) {
      throw new Error(json.error || 'Erro desconhecido no servidor.');
    }
  } catch (err) {
    if (err instanceof SyntaxError) {
      return;
    }
    throw err;
  }
}

const TITLE = '✨ 7 anos da Isabela • Baile da Bela e a Fera';
const LOCATION =
  'Planeta Mágico, R. Dr. Alfredo Oiticica, 84, Pitanguinha, Maceió, AL, 57052-230';
const DETAILS = [
  '👑 Você está convidado para o baile real de 7 anos da Isabela!',
  '',
  '🌹 Tema: A Bela e a Fera',
  '📅 Data: sábado, 23 de maio de 2026',
  '🕖 Horário: a partir das 19h',
  '📍 Local: Planeta Mágico (Pitanguinha, Maceió/AL)',
  '',
  '✨ A Bela convida todas as princesas para virem de fantasia ao baile real.',
  'Observação: a fantasia da princesa Bela é exclusiva da aniversariante.',
  '',
  'Não esqueça de confirmar presença pela landing do convite.',
  'Mal podemos esperar para te ver no salão! 💛',
].join('\\n');

// 23/05/2026 19:00 (Maceió UTC-3) → 22:00 UTC
// 4 horas de duração → 24/05/2026 02:00 UTC
const START_UTC = '20260523T220000Z';
const END_UTC = '20260524T020000Z';

export function calendarUrl(): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: TITLE,
    dates: `${START_UTC}/${END_UTC}`,
    details: DETAILS,
    location: LOCATION,
    ctz: 'America/Maceio',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function icsUrl(): string {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Isabela RSVP//PT-BR',
    'BEGIN:VEVENT',
    `UID:isabela.7anos@rsvp`,
    `DTSTAMP:${START_UTC}`,
    `DTSTART:${START_UTC}`,
    `DTEND:${END_UTC}`,
    `SUMMARY:${TITLE}`,
    `DESCRIPTION:${DETAILS}`,
    `LOCATION:${LOCATION}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

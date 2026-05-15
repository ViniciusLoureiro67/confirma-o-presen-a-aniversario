import { MessageCircle, Heart } from 'lucide-react';

const WHATSAPP_RAW = '82999404010';
const WHATSAPP_DISPLAY = '(82) 99940-4010';
const WHATSAPP_LINK = `https://wa.me/55${WHATSAPP_RAW}`;

export function Footer() {
  return (
    <footer className="py-12 px-5 text-center">
      <div className="container-narrow space-y-4">
        <p className="text-sm text-slate-600">
          Dúvidas ou precisa avisar algo?
        </p>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-rose-100 px-5 py-2.5 text-sm font-medium text-rose-600 shadow-sm hover:bg-white transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          {WHATSAPP_DISPLAY}
        </a>
        <p className="pt-6 text-xs text-slate-500 flex items-center justify-center gap-1.5">
          Feito com <Heart className="h-3 w-3 fill-rose-400 text-rose-400" /> para Isabela
        </p>
      </div>
    </footer>
  );
}

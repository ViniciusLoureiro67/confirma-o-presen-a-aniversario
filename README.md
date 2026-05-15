# 🌹 Festa Isabela 7 anos · Baile da Bela e a Fera

Landing page de confirmação de presença (RSVP) para o aniversário de 7 anos da
Isabela. Frontend em Vite + React + TypeScript + Tailwind + shadcn-style com
animações em Framer Motion. Backend serverless em Google Apps Script gravando
diretamente em uma Google Sheet.

> Demo: hospedado na Vercel.
> Tema: A Bela e a Fera · Data: 23/05/2026 · Local: Planeta Mágico (Maceió/AL)

---

## ✨ Recursos

- **RSVP completo** com:
  - Nome do responsável (validação só letras)
  - Telefone com máscara `(00) 00000-0000`
  - Radio Sim/Não
  - Lista dinâmica de crianças (nome, idade 0–17, acompanhante opcional)
  - Observações (alergias, restrições)
  - Validação Zod ponta a ponta
- **Persistência** em Google Sheets via Apps Script (1 linha por criança, coluna
  "Paga Buffet" calculada automaticamente para idade > 6)
- **Notificação por e-mail** a cada confirmação
- **Animação de sucesso** com resumo do RSVP
- **Botão "Salvar na agenda"** integrado ao Google Calendar (URL TEMPLATE)
- **Visual cinematográfico**: salão da Bela e a Fera como bg fixo, chuva de
  pétalas/rosas/corações/glitter dourado globais sobre toda landing
- **Mobile first** e totalmente responsivo

---

## 🧱 Stack

| Camada | Tecnologia |
|--------|------------|
| Build | Vite 5 |
| UI | React 18 + TypeScript |
| Estilo | Tailwind CSS 3 + classes shadcn-style |
| Forms | React Hook Form + Zod |
| Animações | Framer Motion |
| Ícones | Lucide React |
| Backend | Google Apps Script (Web App) + Google Sheets |
| Hosting | Vercel |

---

## 🚀 Rodando localmente

```bash
git clone git@github.com:ViniciusLoureiro67/confirma-o-presen-a-aniversario.git
cd confirma-o-presen-a-aniversario
npm install
cp .env.example .env
# edite .env com a URL do seu Web App do Apps Script
npm run dev
```

Abre em `http://localhost:5173`.

Build:

```bash
npm run build
npm run preview
```

---

## 🗂️ Estrutura

```
.
├── apps-script/
│   └── Code.gs              # webhook Apps Script
├── public/                  # imagens do salão (bg fixo)
├── src/
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Location.tsx
│   │   ├── RSVPForm.tsx
│   │   ├── SuccessAnimation.tsx
│   │   ├── GlobalBackdrop.tsx   # pétalas + véu globais
│   │   ├── Footer.tsx
│   │   └── ui/                  # Button, Input, Card, etc.
│   ├── lib/
│   │   ├── schema.ts        # Zod
│   │   ├── api.ts           # submit fetch
│   │   ├── calendar.ts      # URL Google Calendar
│   │   └── utils.ts         # cn, sanitizeName, maskPhone
│   ├── App.tsx
│   └── main.tsx
├── .env.example
└── README.md
```

---

## 🔧 Backend (Google Apps Script + Sheets)

### 1. Criar a planilha

1. Acesse https://sheets.new e crie uma planilha nova.
2. Renomeie a aba para `RSVP`.
3. Cole o cabeçalho na linha 1:

   | A | B | C | D | E | F | G | H | I |
   |---|---|---|---|---|---|---|---|---|
   | Timestamp | Nome Adulto | Telefone | Vai Comparecer | Nome Criança | Idade Criança | Paga Buffet (idade > 6) | Acompanhante | Observações |

### 2. Colar o Apps Script

1. Na planilha: `Extensões → Apps Script`.
2. Substitua o conteúdo de `Code.gs` pelo de [`apps-script/Code.gs`](apps-script/Code.gs).
3. Ajuste `NOTIFICATION_EMAIL` no topo do arquivo.
4. Salve.

### 3. Publicar como Web App

1. `Implantar → Nova implantação → App da Web`
2. **Executar como**: `Eu` · **Acesso**: `Qualquer pessoa`
3. Autorize quando solicitado.
4. Copie a URL do app da Web.

> ⚠️ A cada edição do `Code.gs`, faça `Implantar → Gerenciar implantações → editar
> → Versão: Nova versão → Implantar` para publicar.

### 4. Testar

```bash
curl -L -X POST \
  -H "Content-Type: text/plain;charset=utf-8" \
  -d '{"nomeAdulto":"Teste","telefone":"(82) 99999-0000","vaiComparecer":true,"criancas":[{"nome":"Crianca","idade":5,"acompanhante":""}],"observacoes":""}' \
  'SUA_URL_AQUI'
```

Deve retornar `{"success":true}` e adicionar linha na planilha.

---

## ☁️ Deploy na Vercel

1. Suba o repo no GitHub (já está).
2. Em https://vercel.com/new importe o repo.
3. Framework preset: **Vite** (detecta sozinho).
4. Environment variables:
   - `VITE_APPS_SCRIPT_URL` = URL do Web App do Apps Script.
5. Deploy.

---

## 🎨 Personalização

- Cores: editar `tailwind.config.js` (paletas `rose`, `lilac`, `gold`).
- Fontes: `index.html` (Google Fonts) e `tailwind.config.js` (`fontFamily`).
- Texto: componentes em `src/components/`.
- Data/local do evento: `src/lib/calendar.ts` (Google Calendar) + `src/components/Hero.tsx` + `src/components/Location.tsx`.
- Imagens de fundo: `public/ballroom-1.png` (Hero + bg fixo do body via `src/index.css`).

---

## 📦 Scripts

| Comando | Função |
|---------|--------|
| `npm run dev` | servidor Vite dev |
| `npm run build` | typecheck + build produção |
| `npm run preview` | preview do build |
| `npm run lint` | typecheck only (`tsc --noEmit`) |

---

## 💛 Crédito

Feito com carinho para a Isabela.
Tema: A Bela e a Fera · Maio/2026.

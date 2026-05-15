import { motion } from 'framer-motion';

type Shape = 'petal' | 'rose' | 'heart';

const PALETTE = ['#ff7aa1', '#ffa3bd', '#c43562', '#ffc9d9', '#f5a6c2'];

const PIECES: {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
  rotateStart: number;
  rotateEnd: number;
  hue: string;
  shape: Shape;
}[] = Array.from({ length: 22 }).map((_, i) => {
  const shape: Shape = i % 8 === 0 ? 'rose' : i % 9 === 0 ? 'heart' : 'petal';
  const big = shape === 'rose';
  return {
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 12,
    duration: 11 + Math.random() * 12,
    size: big ? 22 + Math.random() * 14 : 12 + Math.random() * 12,
    drift: (Math.random() - 0.5) * 140,
    rotateStart: Math.random() * 360,
    rotateEnd: Math.random() * 720 + 360,
    hue: PALETTE[i % PALETTE.length],
    shape,
  };
});

const STATIC_SPARKLES = Array.from({ length: 8 }).map((_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 4,
  size: 5 + Math.random() * 7,
}));

function Shape({ shape, color }: { shape: Shape; color: string }) {
  const gid = `g-${shape}-${color.replace('#', '')}`;

  if (shape === 'petal') {
    return (
      <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden>
        <defs>
          <radialGradient id={gid} cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="60%" stopColor={color} stopOpacity="0.95" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </radialGradient>
        </defs>
        <path
          d="M12 2 C19 6, 21 14, 12 22 C3 14, 5 6, 12 2 Z"
          fill={`url(#${gid})`}
          stroke={color}
          strokeOpacity="0.5"
          strokeWidth="0.6"
        />
      </svg>
    );
  }

  if (shape === 'rose') {
    return (
      <svg viewBox="0 0 32 32" width="100%" height="100%" aria-hidden>
        <defs>
          <radialGradient id={gid} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} />
          </radialGradient>
        </defs>
        <circle cx="16" cy="16" r="13" fill={`url(#${gid})`} />
        <path d="M8 14 Q16 4 24 14 Q16 18 8 14" fill="#fff" opacity="0.35" />
        <path d="M10 18 Q16 12 22 18 Q16 22 10 18" fill={color} opacity="0.7" />
        <circle cx="16" cy="17" r="3" fill="#5a0f24" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden>
      <defs>
        <radialGradient id={gid} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="100%" stopColor={color} />
        </radialGradient>
      </defs>
      <path
        d="M12 21 C 4 14, 4 6, 9 6 C 11 6, 12 8, 12 10 C 12 8, 13 6, 15 6 C 20 6, 20 14, 12 21 Z"
        fill={`url(#${gid})`}
      />
    </svg>
  );
}

export function GlobalBackdrop() {
  return (
    <>
      {/* véu pastel atrás de tudo */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0, background: 'rgba(255, 240, 245, 0.78)' }}
      />

      {/* sparkles estáticos pulsando atrás */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 1 }}
      >
        {STATIC_SPARKLES.map((s) => (
          <motion.svg
            key={`s-${s.id}`}
            viewBox="0 0 24 24"
            width={s.size}
            height={s.size}
            style={{
              position: 'absolute',
              top: `${s.y}%`,
              left: `${s.x}%`,
              filter: 'drop-shadow(0 0 6px rgba(245,201,122,0.7))',
            }}
            animate={{ opacity: [0.15, 1, 0.15], scale: [0.5, 1.3, 0.5] }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              delay: s.delay,
              ease: 'easeInOut',
            }}
          >
            <path
              d="M12 1 L14 10 L23 12 L14 14 L12 23 L10 14 L1 12 L10 10 Z"
              fill="#f5c97a"
            />
          </motion.svg>
        ))}
      </div>

      {/* pétalas caindo NA FRENTE de tudo (z máximo) */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 60 }}
      >
        {PIECES.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              y: -80,
              x: 0,
              opacity: 0,
              rotate: p.rotateStart,
              scale: 0.6,
            }}
            animate={{
              y: '115vh',
              x: [0, p.drift * 0.4, -p.drift * 0.5, p.drift, p.drift * 0.3],
              opacity: [0, 1, 1, 1, 0],
              rotate: p.rotateEnd,
              scale: [0.6, 1, 1, 1, 0.85],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'linear',
              times: [0, 0.1, 0.5, 0.9, 1],
            }}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              width: p.size,
              height: p.size,
            }}
          >
            <Shape shape={p.shape} color={p.hue} />
          </motion.div>
        ))}
      </div>
    </>
  );
}

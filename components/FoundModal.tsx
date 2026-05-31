'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface Props {
  nombrePerro?: string | null;
  onClose: () => void;
}

export default function FoundModal({ nombrePerro, onClose }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    // Confetti 🎉
    const end = Date.now() + 2500;
    const colors = ['#EE5A3B', '#22c55e', '#facc15', '#ffffff'];
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="w-full max-w-sm rounded-[32px] bg-white px-8 py-10 shadow-2xl text-center">

        <div className="text-6xl mb-4">🐾</div>

        <h1 className="font-display text-3xl font-black text-ink mb-3">
          {nombrePerro ? `¡${nombrePerro} volvió a casa!` : '¡Lo encontraste!'}
        </h1>

        <p className="text-ink-muted text-base leading-relaxed mb-6">
          Cada reencuentro es una historia que nos llena el corazón. Gracias a vos y a los vecinos que ayudan, más perros vuelven a sus casas. 🏠
        </p>

        <button
          type="button"
          onClick={onClose}
          className="btn-primary w-full text-base"
        >
          ¡Gracias Vecindog! 🎉
        </button>

        <p className="mt-3 text-xs text-ink-muted">
          El aviso fue marcado como resuelto y ya no aparece en la lista.
        </p>
      </div>
    </div>
  );
}

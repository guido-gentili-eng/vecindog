'use client';

import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export default function ShareButton({
  className = '',
  label = 'Compartir Patitas',
  text = 'Patitas — avisos de mascotas en tu ciudad'
}: {
  className?: string;
  label?: string;
  text?: string;
}) {
  const [estado, setEstado] = useState<'idle' | 'copiado'>('idle');

  async function handleClick() {
    const url = typeof window !== 'undefined' ? window.location.origin : 'https://patitas.app';

    // En mobile (y algunos browsers de desktop) usamos el share nativo.
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ title: 'Patitas', text, url });
        return;
      } catch {
        // Si el usuario canceló, no hacemos nada.
        return;
      }
    }

    // Fallback: copiar al portapapeles.
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setEstado('copiado');
        setTimeout(() => setEstado('idle'), 2000);
      } catch {
        // ignorar
      }
    }
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {estado === 'copiado' ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      {estado === 'copiado' ? 'Link copiado' : label}
    </button>
  );
}

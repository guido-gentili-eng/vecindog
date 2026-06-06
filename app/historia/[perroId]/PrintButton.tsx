'use client';

import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-2xl bg-brand-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-primary/90 active:scale-95"
    >
      <Printer className="h-4 w-4" />
      Imprimir / Exportar PDF
    </button>
  );
}

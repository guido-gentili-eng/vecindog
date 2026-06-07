'use client';

import { Printer } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PrintButton() {
  const { t } = useLanguage();
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-2 rounded-2xl bg-brand-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-primary/90 active:scale-95"
    >
      <Printer className="h-4 w-4" />
      {t.hpbImprimir}
    </button>
  );
}

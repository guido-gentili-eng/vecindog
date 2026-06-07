'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Dog, ArrowLeft, Calculator, Heart } from 'lucide-react';
import { useLanguage, type Translations } from '@/contexts/LanguageContext';

type Tamano = 'pequeño' | 'mediano' | 'grande';

function calcularEdadHumana(años: number, meses: number, tamano: Tamano): number {
  const edadTotal = años + meses / 12;
  if (edadTotal <= 0) return 0;
  const extra: Record<Tamano, number> = { 'pequeño': 4, 'mediano': 5, 'grande': 6 };
  if (edadTotal <= 1) return Math.round(15 * edadTotal);
  if (edadTotal <= 2) return Math.round(15 + 9 * (edadTotal - 1));
  return Math.round(15 + 9 + extra[tamano] * (edadTotal - 2));
}

interface EtapaVida {
  etiqueta: string;
  color:    string;
  bg:       string;
  texto:    string;
}

function obtenerEtapa(edadHumana: number, t: Translations): EtapaVida {
  if (edadHumana < 15)  return { etiqueta: t.calcPuppy,   color: 'text-amber-700',       bg: 'bg-amber-100',       texto: t.calcPuppyText };
  if (edadHumana < 30)  return { etiqueta: t.calcJuvenil, color: 'text-lime-700',        bg: 'bg-lime-100',        texto: t.calcJuvenilText };
  if (edadHumana < 55)  return { etiqueta: t.calcAdult,   color: 'text-brand-primary',   bg: 'bg-brand-coral-soft', texto: t.calcAdultText };
  if (edadHumana < 75)  return { etiqueta: t.calcSenior,  color: 'text-brand-sage-dark', bg: 'bg-green-100',       texto: t.calcSeniorText };
  return                         { etiqueta: t.calcElder,  color: 'text-purple-700',      bg: 'bg-purple-100',      texto: t.calcElderText };
}

export default function CalculadoraEdadPage() {
  const { t } = useLanguage();
  const [años,   setAños]   = useState<number>(0);
  const [meses,  setMeses]  = useState<number>(0);
  const [tamano, setTamano] = useState<Tamano>('mediano');

  const tamanos: { valor: Tamano; etiqueta: string; descripcion: string }[] = [
    { valor: 'pequeño', etiqueta: t.calcSmall,  descripcion: t.calcSmallDesc  },
    { valor: 'mediano', etiqueta: t.calcMedium, descripcion: t.calcMediumDesc },
    { valor: 'grande',  etiqueta: t.calcLarge,  descripcion: t.calcLargeDesc  },
  ];

  const edadHumana   = calcularEdadHumana(años, meses, tamano);
  const etapa        = obtenerEtapa(edadHumana, t);
  const hayResultado = años > 0 || meses > 0;

  const tamanoDesc = tamano === 'pequeño' ? t.calcSmallDesc : tamano === 'mediano' ? t.calcMediumDesc : t.calcLargeDesc;
  const tamanoEtiq = tamano === 'pequeño' ? t.calcSmall : tamano === 'mediano' ? t.calcMedium : t.calcLarge;
  const extraAnos  = tamano === 'pequeño' ? 4 : tamano === 'mediano' ? 5 : 6;

  return (
    <div className="mx-auto max-w-xl px-4 py-10">

      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted transition hover:text-brand-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.calcBack}
      </Link>

      {/* Hero */}
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-coral-soft px-3 py-1 text-xs font-bold text-brand-primary">
          <Calculator className="h-3.5 w-3.5" />
          {t.calcChip}
        </span>
        <h1 className="mt-3 font-display text-4xl font-black text-ink">
          {t.calcTitle}
        </h1>
        <p className="mt-3 text-ink-muted">
          {t.calcSub}
        </p>
      </div>

      {/* Formulario */}
      <div className="card space-y-6 p-6">

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">
              {t.calcYearsLabel}
            </label>
            <input
              type="number"
              min={0}
              max={30}
              value={años}
              onChange={(e) => setAños(Math.max(0, Math.min(30, Number(e.target.value))))}
              className="field text-center text-lg font-bold"
              placeholder="0"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">
              {t.calcMonthsLabel}
            </label>
            <input
              type="number"
              min={0}
              max={11}
              value={meses}
              onChange={(e) => setMeses(Math.max(0, Math.min(11, Number(e.target.value))))}
              className="field text-center text-lg font-bold"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-ink">
            {t.calcSizeLabel}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {tamanos.map(({ valor, etiqueta, descripcion }) => (
              <button
                key={valor}
                type="button"
                onClick={() => setTamano(valor)}
                className={`rounded-2xl border-2 p-3 text-center transition ${
                  tamano === valor
                    ? 'border-brand-primary bg-brand-coral-soft text-brand-primary'
                    : 'border-black/10 bg-white text-ink hover:border-brand-primary/40 hover:bg-brand-cream'
                }`}
              >
                <Dog className={`mx-auto mb-1 ${
                  valor === 'pequeño' ? 'h-4 w-4' : valor === 'mediano' ? 'h-5 w-5' : 'h-6 w-6'
                } ${tamano === valor ? 'text-brand-primary' : 'text-ink-muted'}`} />
                <p className="text-sm font-bold">{etiqueta}</p>
                <p className="text-xs text-ink-muted">{descripcion}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resultado */}
      {hayResultado && (
        <div className="mt-6 card overflow-hidden">
          <div className="bg-brand-primary px-6 py-5 text-center text-white">
            <p className="text-sm font-semibold opacity-80">{t.calcEquivalent}</p>
            <p className="mt-1 font-display text-6xl font-black leading-none">
              {edadHumana}
            </p>
            <p className="mt-1 text-lg font-bold opacity-90">{t.calcHumanYears}</p>
          </div>

          <div className="p-6">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ${etapa.bg} ${etapa.color}`}>
              <Heart className="h-3.5 w-3.5 fill-current" />
              {t.calcStageLabel}: {etapa.etiqueta}
            </div>
            <p className="mt-3 text-ink-muted">{etapa.texto}</p>
          </div>

          <div className="border-t border-black/5 bg-brand-cream px-6 py-4">
            <p className="text-xs font-semibold text-ink-muted">
              {t.calcFormula}{' '}
              <span className="font-bold text-ink">{tamanoEtiq}</span>
              {' '}({tamanoDesc}):
              {' '}año 1 = 15 {t.calcHumanYears}, año 2 = 9, {t.calcYearsLabel.toLowerCase()} adicionales = {extraAnos}.
            </p>
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {!hayResultado && (
        <div className="mt-6 rounded-3xl border-2 border-dashed border-brand-primary/20 bg-brand-cream-soft px-6 py-10 text-center">
          <Dog className="mx-auto h-10 w-10 text-brand-primary/30" />
          <p className="mt-3 text-sm font-semibold text-ink-muted">
            {t.calcEmpty}
          </p>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-ink-muted">
        {t.calcNote}
      </p>
    </div>
  );
}

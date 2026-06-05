'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Dog, ArrowLeft, Calculator, Heart } from 'lucide-react';

type Tamano = 'pequeño' | 'mediano' | 'grande';

interface EtapaVida {
  etiqueta: string;
  color:    string;
  bg:       string;
  texto:    string;
}

function calcularEdadHumana(años: number, meses: number, tamano: Tamano): number {
  const edadTotal = años + meses / 12;

  if (edadTotal <= 0) return 0;

  const extra: Record<Tamano, number> = {
    'pequeño': 4,
    'mediano': 5,
    'grande':  6,
  };

  if (edadTotal <= 1) {
    return Math.round(15 * edadTotal);
  }
  if (edadTotal <= 2) {
    return Math.round(15 + 9 * (edadTotal - 1));
  }
  return Math.round(15 + 9 + extra[tamano] * (edadTotal - 2));
}

function obtenerEtapa(edadHumana: number): EtapaVida {
  if (edadHumana < 15)  return { etiqueta: 'Cachorro',  color: 'text-amber-700',       bg: 'bg-amber-100',       texto: 'Todavía está descubriendo el mundo. ¡Todo es nuevo y emocionante!' };
  if (edadHumana < 30)  return { etiqueta: 'Juvenil',   color: 'text-lime-700',        bg: 'bg-lime-100',        texto: 'Lleno de energía y curiosidad. Es la etapa perfecta para el entrenamiento.' };
  if (edadHumana < 55)  return { etiqueta: 'Adulto',    color: 'text-brand-primary',   bg: 'bg-brand-coral-soft', texto: 'En su mejor momento: equilibrado, leal y con mucho amor para dar.' };
  if (edadHumana < 75)  return { etiqueta: 'Senior',    color: 'text-brand-sage-dark', bg: 'bg-green-100',       texto: 'Con la experiencia de años vividos. Merece mimos y cuidados especiales.' };
  return                         { etiqueta: 'Anciano',  color: 'text-purple-700',      bg: 'bg-purple-100',      texto: 'Un veterano lleno de sabiduría y amor incondicional. ¡Un tesoro!' };
}

const TAMANOS: { valor: Tamano; etiqueta: string; descripcion: string }[] = [
  { valor: 'pequeño', etiqueta: 'Pequeño',  descripcion: 'menos de 10 kg'  },
  { valor: 'mediano', etiqueta: 'Mediano',  descripcion: '10 – 25 kg'      },
  { valor: 'grande',  etiqueta: 'Grande',   descripcion: 'más de 25 kg'    },
];

export default function CalculadoraEdadPage() {
  const [años,   setAños]   = useState<number>(0);
  const [meses,  setMeses]  = useState<number>(0);
  const [tamano, setTamano] = useState<Tamano>('mediano');

  const edadHumana   = calcularEdadHumana(años, meses, tamano);
  const etapa        = obtenerEtapa(edadHumana);
  const hayResultado = años > 0 || meses > 0;

  return (
    <div className="mx-auto max-w-xl px-4 py-10">

      {/* Volver */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted transition hover:text-brand-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al inicio
      </Link>

      {/* Hero */}
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-coral-soft px-3 py-1 text-xs font-bold text-brand-primary">
          <Calculator className="h-3.5 w-3.5" />
          Herramienta gratuita
        </span>
        <h1 className="mt-3 font-display text-4xl font-black text-ink">
          Calculadora de<br />edad canina
        </h1>
        <p className="mt-3 text-ink-muted">
          Descubrí cuántos años humanos equivale la edad de tu perro.
        </p>
      </div>

      {/* Formulario */}
      <div className="card space-y-6 p-6">

        {/* Edad en años y meses */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-bold text-ink">
              Años
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
              Meses adicionales
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

        {/* Tamaño */}
        <div>
          <label className="mb-2 block text-sm font-bold text-ink">
            Tamaño del perro
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TAMANOS.map(({ valor, etiqueta, descripcion }) => (
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
          {/* Cabecera con la edad */}
          <div className="bg-brand-primary px-6 py-5 text-center text-white">
            <p className="text-sm font-semibold opacity-80">Tu perro equivale a</p>
            <p className="mt-1 font-display text-6xl font-black leading-none">
              {edadHumana}
            </p>
            <p className="mt-1 text-lg font-bold opacity-90">años humanos</p>
          </div>

          {/* Etapa de vida */}
          <div className="p-6">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ${etapa.bg} ${etapa.color}`}>
              <Heart className="h-3.5 w-3.5 fill-current" />
              Etapa: {etapa.etiqueta}
            </div>
            <p className="mt-3 text-ink-muted">{etapa.texto}</p>
          </div>

          {/* Fórmula usada */}
          <div className="border-t border-black/5 bg-brand-cream px-6 py-4">
            <p className="text-xs font-semibold text-ink-muted">
              Fórmula aplicada para perro{' '}
              <span className="font-bold text-ink">{tamano}</span>
              {' '}({
                tamano === 'pequeño' ? 'menos de 10 kg' :
                tamano === 'mediano' ? '10 – 25 kg' : 'más de 25 kg'
              }):
              año 1 = 15 años humanos, año 2 = 9, cada año adicional = {
                tamano === 'pequeño' ? 4 : tamano === 'mediano' ? 5 : 6
              }.
            </p>
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {!hayResultado && (
        <div className="mt-6 rounded-3xl border-2 border-dashed border-brand-primary/20 bg-brand-cream-soft px-6 py-10 text-center">
          <Dog className="mx-auto h-10 w-10 text-brand-primary/30" />
          <p className="mt-3 text-sm font-semibold text-ink-muted">
            Ingresá la edad de tu perro para ver el resultado.
          </p>
        </div>
      )}

      {/* Nota al pie */}
      <p className="mt-6 text-center text-xs text-ink-muted">
        Esta calculadora es orientativa. Para un seguimiento preciso de la salud de tu perro,
        consultá siempre a tu veterinario de confianza.
      </p>
    </div>
  );
}

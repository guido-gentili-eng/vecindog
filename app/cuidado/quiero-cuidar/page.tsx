'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, Check, ChevronLeft, HandHeart } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const EXPERIENCIA_OPTS = [
  'Soy dueño/a de perros',
  'Tuve perros de niño/a',
  'Cuidé perros de amigos/familia',
  'Trabajé con animales',
  'Sin experiencia previa',
];

const DISPONIBILIDAD_OPTS = [
  'De lunes a viernes',
  'Fines de semana',
  'Cualquier día',
  'Solo de día',
  'Con pernocte incluido',
];

export default function QuieroCuidarPage() {
  const router  = useRouter();
  const { user, isAuthenticated, isPro } = useAuth();

  const [nombre,        setNombre]        = useState('');
  const [experiencias,  setExperiencias]  = useState<string[]>([]);
  const [disponibilidad, setDisponibilidad] = useState<string[]>([]);
  const [maxPerros,     setMaxPerros]     = useState('1');
  const [tienePerros,   setTienePerros]   = useState<'si' | 'no' | ''>('');
  const [detalles,      setDetalles]      = useState('');
  const [zona,          setZona]          = useState('');
  const [contacto,      setContacto]      = useState('');

  const [enviando,  setEnviando]  = useState(false);
  const [error,     setError]     = useState('');
  const [publicado, setPublicado] = useState(false);

  function toggleOpt(arr: string[], setArr: (v: string[]) => void, val: string) {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { setError('Tenés que iniciar sesión para registrarte.'); return; }
    if (!nombre.trim()) { setError('El nombre es obligatorio.'); return; }
    if (!zona.trim())   { setError('La zona es obligatoria.'); return; }
    if (!contacto.trim()) { setError('El contacto de WhatsApp es obligatorio.'); return; }
    if (contacto.replace(/\D/g, '').length < 8) { setError('El WhatsApp debe tener al menos 8 dígitos. Ejemplo: 2914050210'); return; }

    setEnviando(true);
    setError('');

    // Construir descripción enriquecida
    const partes: string[] = [];
    if (experiencias.length)   partes.push(`Experiencia: ${experiencias.join(', ')}.`);
    if (disponibilidad.length) partes.push(`Disponibilidad: ${disponibilidad.join(', ')}.`);
    partes.push(`Puede cuidar hasta ${maxPerros} perro${maxPerros !== '1' ? 's' : ''} a la vez.`);
    if (tienePerros === 'si')  partes.push('Tiene perros propios en casa.');
    if (tienePerros === 'no')  partes.push('No tiene perros propios.');
    if (detalles.trim())       partes.push(detalles.trim());
    const descripcion = partes.join(' ');

    const { error: dbErr } = await supabase.from('posts').insert({
      user_id:     user.id,
      perro_id:    null,
      categoria:   'cuidador_disponible',
      especie:     'perro',
      nombre:      nombre.trim(),
      raza:        null,
      color:       null,
      tamano:      null,
      descripcion,
      zona:        zona.trim(),
      fecha:       new Date().toISOString().slice(0, 10),
      horario:     null,
      contacto:    contacto.trim(),
      images:      [],
      estado:      'activo',
      collar:      null,
      chapita:     null,
      lat:         null,
      lng:         null,
    });

    setEnviando(false);
    if (dbErr) { setError('No se pudo registrar. Intentá de nuevo.'); return; }
    setPublicado(true);
    setTimeout(() => router.push('/cuidado'), 1800);
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-ink-muted">Iniciá sesión para registrarte como cuidador.</p>
      </div>
    );
  }

  if (!isPro) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="card p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100">
            <HandHeart className="h-7 w-7 text-teal-600" />
          </div>
          <h2 className="font-display text-2xl font-black text-ink">Función exclusiva VecindogPro</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Para registrarte como cuidador y recibir calificaciones de los dueños, necesitás tener el plan Pro activo.
          </p>
          <Link
            href="/planes"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-600 px-5 py-3 font-bold text-white transition hover:bg-teal-700"
          >
            Ver planes
          </Link>
        </div>
      </div>
    );
  }

  if (publicado) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
          <Check className="h-8 w-8 text-teal-600" />
        </div>
        <h2 className="font-display text-2xl font-black text-ink">¡Te registraste como cuidador!</h2>
        <p className="mt-2 text-ink-muted">Tu perfil ya aparece en el listado de cuidadores disponibles.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Link href="/cuidado" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-ink-muted hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> Volver
      </Link>

      <h1 className="font-display text-3xl font-black text-ink mb-1">Quiero cuidar perros</h1>
      <p className="text-sm text-ink-muted mb-8">
        Completá tu perfil de cuidador para que los dueños puedan encontrarte.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Nombre */}
        <div>
          <label className="label">Tu nombre o apodo <span className="text-bad">*</span></label>
          <input
            className="field w-full mt-1"
            placeholder="Ej: Martina G."
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        {/* Experiencia */}
        <div>
          <label className="label">Experiencia con perros</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {EXPERIENCIA_OPTS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => toggleOpt(experiencias, setExperiencias, opt)}
                className={`rounded-2xl border-2 px-3 py-1.5 text-sm font-semibold transition ${
                  experiencias.includes(opt)
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-black/10 text-ink-muted hover:border-teal-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Disponibilidad */}
        <div>
          <label className="label">Disponibilidad</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {DISPONIBILIDAD_OPTS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => toggleOpt(disponibilidad, setDisponibilidad, opt)}
                className={`rounded-2xl border-2 px-3 py-1.5 text-sm font-semibold transition ${
                  disponibilidad.includes(opt)
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-black/10 text-ink-muted hover:border-teal-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Cantidad máxima */}
        <div>
          <label className="label">¿Cuántos perros podés cuidar a la vez?</label>
          <div className="mt-2 flex gap-2">
            {['1','2','3','4+'].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setMaxPerros(n)}
                className={`flex-1 rounded-2xl border-2 py-2 text-sm font-bold transition ${
                  maxPerros === n
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-black/10 text-ink-muted hover:border-teal-200'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Tiene perros propios */}
        <div>
          <label className="label">¿Tenés perros en casa?</label>
          <div className="mt-2 flex gap-3">
            {([['si', 'Sí'], ['no', 'No']] as const).map(([val, lbl]) => (
              <button
                key={val}
                type="button"
                onClick={() => setTienePerros(tienePerros === val ? '' : val)}
                className={`flex-1 rounded-2xl border-2 py-2.5 text-sm font-bold transition ${
                  tienePerros === val
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-black/10 text-ink-muted hover:border-teal-200'
                }`}
              >
                {lbl}
              </button>
            ))}
          </div>
        </div>

        {/* Detalles adicionales */}
        <div>
          <label className="label">Información adicional <span className="text-ink-muted font-normal">(opcional)</span></label>
          <textarea
            className="field w-full mt-1"
            rows={3}
            placeholder="Contá algo más: si tenés patio, si podés hacer pernocte, razas con las que te sentís cómodo/a…"
            value={detalles}
            onChange={(e) => setDetalles(e.target.value)}
          />
        </div>

        {/* Zona */}
        <div>
          <label className="label">Zona / Barrio <span className="text-bad">*</span></label>
          <input
            className="field w-full mt-1"
            placeholder="Ej: Palermo, Villa Crespo…"
            value={zona}
            onChange={(e) => setZona(e.target.value)}
            required
          />
        </div>

        {/* Contacto */}
        <div>
          <label className="label">WhatsApp de contacto <span className="text-bad">*</span></label>
          <input
            className="field w-full mt-1"
            type="tel"
            placeholder="Ej: 1122334455"
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
            required
          />
        </div>

        {error && (
          <p className="flex items-center gap-2 rounded-2xl bg-bad/10 p-3 text-sm font-bold text-bad">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-700 py-3.5 font-bold text-white transition hover:bg-teal-800 disabled:opacity-60"
        >
          {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <HandHeart className="h-4 w-4" />}
          Registrarme como cuidador
        </button>
      </form>
    </div>
  );
}

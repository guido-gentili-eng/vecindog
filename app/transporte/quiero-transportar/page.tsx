'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, Check, ChevronLeft, Car } from 'lucide-react';
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
  'Con horario flexible',
];

export default function QuieroTransportarPage() {
  const router  = useRouter();
  const { user, isAuthenticated, isPro } = useAuth();

  const [nombre,        setNombre]        = useState('');
  const [experiencias,  setExperiencias]  = useState<string[]>([]);
  const [disponibilidad, setDisponibilidad] = useState<string[]>([]);
  const [maxPerros,     setMaxPerros]     = useState('1');
  const [vehiculo,      setVehiculo]      = useState<'auto' | 'camioneta' | 'camion' | ''>('');
  const [detalles,      setDetalles]      = useState('');
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
    if (!contacto.trim()) { setError('El contacto de WhatsApp es obligatorio.'); return; }
    if (contacto.replace(/\D/g, '').length < 10) { setError('El WhatsApp debe tener al menos 10 dígitos. Ejemplo: +54 9 291 4050210'); return; }

    setEnviando(true);
    setError('');

    const partes: string[] = [];
    if (vehiculo)              partes.push(`Vehículo: ${vehiculo === 'camion' ? 'Camión' : vehiculo.charAt(0).toUpperCase() + vehiculo.slice(1)}.`);
    if (experiencias.length)   partes.push(`Experiencia: ${experiencias.join(', ')}.`);
    if (disponibilidad.length) partes.push(`Disponibilidad: ${disponibilidad.join(', ')}.`);
    partes.push(`Puede transportar hasta ${maxPerros} perro${maxPerros !== '1' ? 's' : ''} a la vez.`);
    if (detalles.trim())       partes.push(detalles.trim());
    const descripcion = partes.join(' ');

    const { error: dbErr } = await supabase.from('posts').insert({
      user_id:     user.id,
      perro_id:    null,
      categoria:   'transportador_disponible',
      especie:     'perro',
      nombre:      nombre.trim(),
      raza:        null,
      color:       null,
      tamano:      null,
      descripcion,
      zona:        '',
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
    if (dbErr) { setError(dbErr.message ?? 'No se pudo registrar. Intentá de nuevo.'); return; }
    setPublicado(true);
    setTimeout(() => router.push('/transporte'), 1800);
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-ink-muted">Iniciá sesión para registrarte como transportador.</p>
      </div>
    );
  }

  if (!isPro) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="card p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
            <Car className="h-7 w-7 text-blue-600" />
          </div>
          <h2 className="font-display text-2xl font-black text-ink">Función exclusiva VecindogPro</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Para registrarte como transportador y recibir calificaciones de los dueños, necesitás tener el plan Pro activo.
          </p>
          <Link
            href="/planes"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
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
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <Check className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="font-display text-2xl font-black text-ink">¡Te registraste como transportador!</h2>
        <p className="mt-2 text-ink-muted">Tu perfil ya aparece en el listado de transportadores disponibles.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Link href="/transporte" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-ink-muted hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> Volver
      </Link>

      <h1 className="font-display text-3xl font-black text-ink mb-1">Quiero transportar perros</h1>
      <p className="text-sm text-ink-muted mb-8">
        Completá tu perfil de transportador para que los dueños puedan encontrarte.
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
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-black/10 text-ink-muted hover:border-blue-200'
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
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-black/10 text-ink-muted hover:border-blue-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Cantidad máxima */}
        <div>
          <label className="label">¿Cuántos perros podés transportar a la vez?</label>
          <div className="mt-2 flex gap-2">
            {['1','2','3','4+'].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setMaxPerros(n)}
                className={`flex-1 rounded-2xl border-2 py-2 text-sm font-bold transition ${
                  maxPerros === n
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-black/10 text-ink-muted hover:border-blue-200'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Vehículo */}
        <div>
          <label className="label">¿Qué vehículo tenés?</label>
          <div className="mt-2 flex gap-2">
            {([['auto', '🚗 Auto'], ['camioneta', '🚐 Camioneta'], ['camion', '🚛 Camión']] as const).map(([val, lbl]) => (
              <button
                key={val}
                type="button"
                onClick={() => setVehiculo(vehiculo === val ? '' : val)}
                className={`flex-1 rounded-2xl border-2 py-2.5 text-sm font-bold transition ${
                  vehiculo === val
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-black/10 text-ink-muted hover:border-blue-200'
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
            placeholder="Contá algo más: si tenés auto propio, qué zonas cubrís, si hacés traslados al veterinario…"
            value={detalles}
            onChange={(e) => setDetalles(e.target.value)}
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
          {contacto.trim() && contacto.replace(/\D/g, '').length < 10 && (
            <p className="mt-1.5 text-xs font-semibold text-bad">
              Número incompleto — ingresá el número completo con código de área. Ej: +54 9 291 4050210
            </p>
          )}
        </div>

        {error && (
          <p className="flex items-center gap-2 rounded-2xl bg-bad/10 p-3 text-sm font-bold text-bad">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-700 py-3.5 font-bold text-white transition hover:bg-blue-800 disabled:opacity-60"
        >
          {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Car className="h-4 w-4" />}
          Registrarme como transportador
        </button>
      </form>
    </div>
  );
}

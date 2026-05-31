'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Dog, Syringe, ChevronRight, Trash2, Loader2, AlertCircle, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { listarMisPerros, eliminarPerro, type Perro } from '@/lib/perros';
import { useSearchParams } from 'next/navigation';

export default function MisPerrosPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const vieneDeResuelto = searchParams.get('resuelto') === '1';
  const [perros,   setPerros]   = useState<Perro[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { setCargando(false); return; }
    listarMisPerros()
      .then(setPerros)
      .catch(() => setError('No pudimos cargar tus perros.'))
      .finally(() => setCargando(false));
  }, [isAuthenticated, authLoading]);

  async function handleEliminar(id: string, nombre: string) {
    if (!confirm(`¿Eliminás a ${nombre}? Esta acción no se puede deshacer.`)) return;
    await eliminarPerro(id);
    setPerros((prev) => prev.filter((p) => p.id !== id));
  }

  /* ── Estados ── */
  if (authLoading || cargando) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="py-12 text-center">
        <p className="text-ink-muted">Iniciá sesión para ver tus perros.</p>
        <Link href="/" className="btn-primary mt-4 inline-flex">Ir al inicio</Link>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-10">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary">
            <Dog className="h-3.5 w-3.5" /> Mis perros
          </span>
          <h1 className="mt-2 font-display text-3xl font-black tracking-tight text-ink md:text-4xl">
            Tu familia canina
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Guardá los datos de tus perros. Si alguno se pierde, ya tenés todo listo.
          </p>
        </div>
        <Link
          href="/mis-perros/nuevo"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-2xl bg-gradient-to-br from-brand-coral to-brand-coral-dark px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Agregar perro
        </Link>
      </div>

      {/* Banner: aviso resuelto, perfil intacto */}
      {vieneDeResuelto && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl bg-good/10 p-4 ring-1 ring-good/20">
          <Heart className="h-5 w-5 shrink-0 fill-current text-good mt-0.5" />
          <div>
            <p className="font-bold text-good">¡El aviso se marcó como resuelto! 🎉</p>
            <p className="mt-0.5 text-sm text-ink-muted">
              El aviso ya no aparece en la lista. <strong>Los perfiles de acá no se borran</strong> — si alguno se vuelve a perder, entrá a su perfil y reportalo de nuevo con un click.
            </p>
          </div>
        </div>
      )}


      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl bg-bad/10 p-4 text-sm font-semibold text-bad">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {perros.length === 0 ? (
        /* Empty state */
        <div className="card p-10 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-cream text-brand-primary">
            <Dog className="h-9 w-9" />
          </div>
          <h2 className="mt-4 font-display text-xl font-extrabold text-ink">
            Todavía no registraste ningún perro
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
            Guardá sus datos, fotos y vacunas. Si algún día se pierde, ya vas a tener todo listo para buscarlo.
          </p>
          <Link
            href="/mis-perros/nuevo"
            className="btn-primary mt-6 inline-flex gap-2"
          >
            <Plus className="h-4 w-4" /> Registrar mi perro
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {perros.map((p) => (
            <PerroCard key={p.id} perro={p} onEliminar={handleEliminar} />
          ))}
          {/* Add card */}
          <Link
            href="/mis-perros/nuevo"
            className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-[20px] border-2 border-dashed border-black/10 p-6 text-center text-ink-muted transition hover:border-brand-primary hover:text-brand-primary"
          >
            <Plus className="h-7 w-7" />
            <span className="text-sm font-bold">Agregar otro perro</span>
          </Link>
        </div>
      )}
    </div>
  );
}

/* ── Tarjeta de perro ── */
function PerroCard({
  perro,
  onEliminar,
}: {
  perro: Perro;
  onEliminar: (id: string, nombre: string) => void;
}) {
  const vacunasCount = perro.vacunas?.length ?? 0;
  const edad = perro.fecha_nac ? calcularEdad(perro.fecha_nac) : null;

  return (
    <div className="card overflow-hidden p-0">
      {/* Foto */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-cream">
        {perro.foto_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={perro.foto_url}
            alt={perro.nombre}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-primary/30">
            <Dog className="h-14 w-14" />
          </div>
        )}
        {/* Chips */}
        {perro.sexo && (
          <span className="absolute left-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-[11px] font-bold capitalize text-white backdrop-blur-sm">
            {perro.sexo}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate font-display text-lg font-extrabold text-ink">{perro.nombre}</h3>
            <p className="text-xs text-ink-muted">
              {[perro.raza, perro.color, perro.tamano, edad].filter(Boolean).join(' · ')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onEliminar(perro.id, perro.nombre)}
            aria-label="Eliminar perro"
            className="shrink-0 rounded-xl p-1.5 text-ink-muted/40 transition hover:bg-bad/10 hover:text-bad"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Stats */}
        <div className="mt-3 flex items-center gap-3 text-xs text-ink-muted">
          <span className="flex items-center gap-1">
            <Syringe className="h-3.5 w-3.5 text-brand-primary/60" />
            {vacunasCount} {vacunasCount === 1 ? 'vacuna' : 'vacunas'}
          </span>
          {perro.chip && (
            <span className="truncate font-mono text-[10px]">Chip: {perro.chip}</span>
          )}
        </div>

        {/* Link ver detalles */}
        <Link
          href={`/mis-perros/${perro.id}`}
          className="mt-3 flex items-center justify-between rounded-xl bg-brand-cream px-3 py-2 text-xs font-bold text-ink transition hover:bg-brand-primary/10 hover:text-brand-primary"
        >
          Ver perfil completo <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function calcularEdad(fechaNac: string): string {
  const hoy  = new Date();
  const nac  = new Date(fechaNac);
  const años = hoy.getFullYear() - nac.getFullYear();
  const meses = hoy.getMonth() - nac.getMonth() + años * 12;
  if (meses < 1)  return 'Cachorro';
  if (meses < 12) return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
  const a = Math.floor(meses / 12);
  return `${a} ${a === 1 ? 'año' : 'años'}`;
}

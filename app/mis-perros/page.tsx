'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Dog, Syringe, ChevronRight, Trash2, Loader2, AlertCircle, Heart, Users, Lock, Sparkles } from 'lucide-react';
import AmigosPanel from '@/components/AmigosPanel';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { listarMisPerros, eliminarPerro, type Perro } from '@/lib/perros';
import { listarMisAmistades } from '@/lib/amistades';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';

interface AmigoInfo { id: string; nombre: string | null; foto_url: string | null; }

export default function MisPerrosPage() {
  const { user, isAuthenticated, loading: authLoading, isPro } = useAuth();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const vieneDeResuelto = searchParams.get('resuelto') === '1';
  const [perros,       setPerros]       = useState<Perro[]>([]);
  const [cargando,     setCargando]     = useState(true);
  const [error,        setError]        = useState('');
  const [amigosOpen,   setAmigosOpen]   = useState(false);
  const [amigos,       setAmigos]       = useState<AmigoInfo[]>([]);
  const [eliminarTarget, setEliminarTarget] = useState<{ id: string; nombre: string } | null>(null);
  const [eliminando,   setEliminando]   = useState(false);
  const [eliminarError, setEliminarError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { setCargando(false); return; }
    listarMisPerros()
      .then(setPerros)
      .catch(() => setError(t.mpLoadError))
      .finally(() => setCargando(false));
  }, [isAuthenticated, authLoading, t.mpLoadError]);

  useEffect(() => {
    if (!user) return;
    listarMisAmistades(user.id).then(async (amistades) => {
      const aceptadas = amistades.filter(a => a.estado === 'aceptada');
      const ids = aceptadas.map(a => a.solicitante_id === user.id ? a.receptor_id : a.solicitante_id);
      if (!ids.length) return;
      const { data } = await supabase.from('profiles').select('id, nombre, foto_url').in('id', ids);
      setAmigos((data ?? []) as AmigoInfo[]);
    });
  }, [user]);

  async function handleConfirmEliminar() {
    if (!eliminarTarget) return;
    setEliminando(true);
    setEliminarError('');
    try {
      await eliminarPerro(eliminarTarget.id);
      setPerros((prev) => prev.filter((p) => p.id !== eliminarTarget.id));
      setEliminarTarget(null);
    } catch {
      setEliminarError(t.mpDeleteError);
    } finally {
      setEliminando(false);
    }
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
        <p className="text-ink-muted">{t.mpNotAuth}</p>
        <Link href="/" className="btn-primary mt-4 inline-flex">{t.mpGoHome}</Link>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-10">
      {amigosOpen && <AmigosPanel onClose={() => setAmigosOpen(false)} />}

      {/* Modal confirmación eliminar perro */}
      {eliminarTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xs rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bad/10 mx-auto mb-4">
              <Trash2 className="h-6 w-6 text-bad" />
            </div>
            <h2 className="font-display text-lg font-black text-ink text-center">{t.mpDeleteTitle}{eliminarTarget.nombre}?</h2>
            <p className="mt-1 text-sm text-ink-muted text-center">{t.mpDeleteSub}</p>
            {eliminarError && <p className="mt-2 text-xs font-semibold text-bad text-center">{eliminarError}</p>}
            <div className="mt-5 flex gap-2">
              <button type="button" onClick={handleConfirmEliminar} disabled={eliminando}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-bad py-3 text-sm font-bold text-white transition hover:bg-bad/90 disabled:opacity-60">
                {eliminando ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Trash2 className="h-4 w-4" /> {t.mpDeleteBtn}</>}
              </button>
              <button type="button" onClick={() => setEliminarTarget(null)} disabled={eliminando}
                className="flex-1 rounded-2xl border-2 border-black/10 py-3 text-sm font-bold text-ink-muted transition hover:border-black/20">
                {t.mpCancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary">
            <Dog className="h-3.5 w-3.5" /> {t.mpChip}
          </span>
          <h1 className="mt-2 font-display text-3xl font-black tracking-tight text-ink md:text-4xl">
            {t.mpTitle}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {t.mpSub}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {isPro ? (
            <button
              type="button"
              onClick={() => setAmigosOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-brand-primary/30 px-4 py-2.5 text-sm font-bold text-brand-primary transition hover:border-brand-primary hover:bg-brand-primary/5"
            >
              <Users className="h-4 w-4" /> {t.mpFriends}
            </button>
          ) : (
            <Link href="/planes"
              className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-black/10 px-4 py-2.5 text-sm font-bold text-ink-muted transition hover:border-brand-primary/30 hover:text-brand-primary"
              title="Función Pro"
            >
              <Lock className="h-3.5 w-3.5" /> {t.mpFriends}
            </Link>
          )}
          {(!isPro && perros.length >= 1) ? (
            <Link href="/planes"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-black/5 px-4 py-2.5 text-sm font-bold text-ink-muted transition hover:bg-brand-primary/10 hover:text-brand-primary"
            >
              <Lock className="h-4 w-4" /> {t.mpAddDog}
            </Link>
          ) : (
            <Link
              href="/mis-perros/nuevo"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-gradient-to-br from-brand-coral to-brand-coral-dark px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" /> {t.mpAddDog}
            </Link>
          )}
        </div>
      </div>

      {/* Banner: aviso resuelto, perfil intacto */}
      {vieneDeResuelto && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl bg-good/10 p-4 ring-1 ring-good/20">
          <Heart className="h-5 w-5 shrink-0 fill-current text-good mt-0.5" />
          <div>
            <p className="font-bold text-good">{t.mpResolvedTitle}</p>
            <p className="mt-0.5 text-sm text-ink-muted">
              {t.mpResolvedSub}
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
            {t.mpEmptyTitle}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink-muted">
            {t.mpEmptySub}
          </p>
          <Link
            href="/mis-perros/nuevo"
            className="btn-primary mt-6 inline-flex gap-2"
          >
            <Plus className="h-4 w-4" /> {t.mpRegisterDog}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {perros.map((p) => (
            <PerroCard key={p.id} perro={p} amigos={amigos} onEliminar={(id, nombre) => setEliminarTarget({ id, nombre })} />
          ))}
          {/* Add card — oculto para Free con 1+ perro */}
          {(isPro || perros.length === 0) ? (
            <Link
              href="/mis-perros/nuevo"
              className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-[20px] border-2 border-dashed border-black/10 p-6 text-center text-ink-muted transition hover:border-brand-primary hover:text-brand-primary"
            >
              <Plus className="h-7 w-7" />
              <span className="text-sm font-bold">{t.mpAddAnother}</span>
            </Link>
          ) : (
            <Link
              href="/planes"
              className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-[20px] border-2 border-dashed border-black/10 p-6 text-center text-ink-muted transition hover:border-brand-primary/30"
            >
              <Lock className="h-7 w-7" />
              <span className="text-sm font-bold">{t.mpMoreWithPro}</span>
              <span className="flex items-center gap-1 text-xs text-brand-primary font-bold">
                <Sparkles className="h-3.5 w-3.5" /> {t.mpSeePlans}
              </span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Tarjeta de perro ── */
function PerroCard({
  perro,
  amigos,
  onEliminar,
}: {
  perro: Perro;
  amigos: AmigoInfo[];
  onEliminar: (id: string, nombre: string) => void;
}) {
  const { t } = useLanguage();
  const vacunasCount = perro.vacunas?.length ?? 0;
  const edad = perro.fecha_nac ? calcularEdad(perro.fecha_nac, t) : null;

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
            {vacunasCount} {vacunasCount === 1 ? t.mpVaccine : t.mpVaccines}
          </span>
          {perro.chip && (
            <span className="truncate font-mono text-[10px]">Chip: {perro.chip}</span>
          )}
        </div>

        {/* Amigos del perro */}
        {amigos.length > 0 && (
          <div className="mt-3 rounded-xl bg-brand-cream px-3 py-2">
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wide text-ink-muted">
              Amigos de {perro.nombre}
            </p>
            <div className="flex items-center gap-1.5">
              {amigos.slice(0, 5).map((a) => (
                a.foto_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={a.id} src={a.foto_url} alt={a.nombre ?? ''} className="h-7 w-7 rounded-full object-cover ring-2 ring-white" />
                ) : (
                  <span key={a.id} className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary/20 text-[11px] font-bold text-brand-primary ring-2 ring-white">
                    {a.nombre?.[0]?.toUpperCase() ?? '?'}
                  </span>
                )
              ))}
              {amigos.length > 5 && (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/10 text-[10px] font-bold text-ink-muted ring-2 ring-white">
                  +{amigos.length - 5}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Link ver detalles */}
        <Link
          href={`/mis-perros/${perro.id}`}
          className="mt-3 flex items-center justify-between rounded-xl bg-brand-cream px-3 py-2 text-xs font-bold text-ink transition hover:bg-brand-primary/10 hover:text-brand-primary"
        >
          {t.mpSeeProfile} <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function calcularEdad(fechaNac: string, t: { mpPuppy: string; mpMonth: string; mpMonths: string; mpYear: string; mpYears: string }): string {
  const hoy  = new Date();
  const nac  = new Date(fechaNac);
  const años = hoy.getFullYear() - nac.getFullYear();
  const meses = hoy.getMonth() - nac.getMonth() + años * 12;
  if (meses < 1)  return t.mpPuppy;
  if (meses < 12) return `${meses} ${meses === 1 ? t.mpMonth : t.mpMonths}`;
  const a = Math.floor(meses / 12);
  return `${a} ${a === 1 ? t.mpYear : t.mpYears}`;
}

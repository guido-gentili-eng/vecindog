'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Calendar, Dog, BadgeCheck, Loader2, AlertCircle,
  Trash2, CheckCircle2, RefreshCw, ShieldAlert, ChevronDown, ChevronUp, Lock, Heart,
} from 'lucide-react';
import { ETIQUETA_CATEGORIA, ETIQUETA_ESPECIE } from '@/lib/mockData';
import {
  obtenerPost, resolverPost, encontrarPost, renovarPost, eliminarPost, type Post,
} from '@/lib/posts';
import { useAuth } from '@/contexts/AuthContext';
import PhotoGallery from '@/components/PhotoGallery';
import ContactBlock from '@/components/ContactBlock';
import AdSlot from '@/components/AdSlot';
import AdoptionSheet from '@/components/AdoptionSheet';
import FoundModal from '@/components/FoundModal';

/* ──────────── Constantes ──────────── */

const ADMIN_EMAIL = 'guido-gentili@live.com.ar';

const COLOR_CATEGORIA: Record<string, string> = {
  perdido:    'bg-lost text-white',
  encontrado: 'bg-found text-white',
  adopcion:   'bg-adopt text-[#5b3a0e]',
};

/** Texto del botón "resuelto" según categoría */
const LABEL_RESUELTO: Record<string, string> = {
  perdido:    'Lo encontré',
  encontrado: 'El dueño lo reclamó',
  adopcion:   'Ya fue adoptado',
};

/** Texto del botón "renovar" según categoría */
const LABEL_RENOVAR: Record<string, string> = {
  perdido:    'Lo sigo buscando',
  encontrado: 'Sigue sin dueño',
  adopcion:   'Sigue en adopción',
};

/* ──────────── Página ──────────── */

export default function DetalleAvisoPage() {
  const { id }    = useParams<{ id: string }>();
  const router    = useRouter();
  const { user, isAuthenticated }  = useAuth();

  const [post,        setPost]        = useState<Post | null>(null);
  const [cargando,    setCargando]    = useState(true);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const [adoptarOpen,  setAdoptarOpen]  = useState(false);

  /* estados de acción */
  const [confirmBorrar,   setConfirmBorrar]   = useState(false);
  const [confirmResuelto, setConfirmResuelto] = useState(false);
  const [accionando,      setAccionando]      = useState(false);
  const [showFoundModal,  setShowFoundModal]  = useState(false);
  const [msgOk,           setMsgOk]           = useState('');
  const [msgErr,         setMsgErr]         = useState('');

  useEffect(() => {
    obtenerPost(id)
      .then(setPost)
      .finally(() => setCargando(false));
  }, [id]);

  if (cargando) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-12 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-bad" />
        <p className="mt-3 font-bold text-ink">Aviso no encontrado</p>
        <Link href="/publicaciones" className="btn-primary mt-4 inline-flex">
          Volver a los avisos
        </Link>
      </div>
    );
  }

  const isOwner   = !!user && !!post.user_id && user.id === post.user_id;
  const isAdmin   = !!user && user.email === ADMIN_EMAIL;
  const canManage = isOwner || isAdmin;
  const resuelto  = post.estado === 'resuelto';

  const waNumero = post.contacto.replace(/[^0-9]/g, '');
  const waTexto  = encodeURIComponent(
    `Hola, te escribo por el aviso de Vecindog (${ETIQUETA_CATEGORIA[post.categoria] ?? post.categoria} en ${post.zona}).`
  );

  /* ── Acciones ── */

  async function handleRenovar() {
    setAccionando(true); setMsgOk(''); setMsgErr('');
    try {
      await renovarPost(post!.id);
      setMsgOk('¡Aviso renovado! Aparece primero en la lista.');
      setConfirmBorrar(false); setConfirmResuelto(false);
    } catch {
      setMsgErr('No se pudo renovar el aviso.');
    } finally {
      setAccionando(false);
    }
  }

  async function handleResuelto() {
    setAccionando(true); setMsgOk(''); setMsgErr('');
    try {
      // Todos los casos: marcar como resuelto directamente
      await resolverPost(post!.id);
      setPost((p) => p ? { ...p, estado: 'resuelto' } : p);
      setConfirmResuelto(false);
      if (post!.categoria === 'perdido') {
        // Mostrar modal de celebración; al cerrarlo redirigir
        setShowFoundModal(true);
      } else {
        router.push('/mis-perros?resuelto=1');
      }
    } catch {
      setMsgErr('No se pudo actualizar el aviso.');
    } finally {
      setAccionando(false);
    }
  }

  async function handleBorrar() {
    setAccionando(true); setMsgOk(''); setMsgErr('');
    try {
      await eliminarPost(post!.id, post!.images);
      router.push('/publicaciones');
    } catch {
      setMsgErr('No se pudo borrar el aviso.');
      setAccionando(false);
    }
  }

  return (
    <article className="py-8 md:py-10">
      {showFoundModal && (
        <FoundModal
          nombrePerro={post?.nombre ?? null}
          onClose={() => { setShowFoundModal(false); router.push('/mis-perros?resuelto=1'); }}
        />
      )}

      <Link
        href="/publicaciones"
        className="mb-6 inline-flex items-center gap-1 text-sm font-bold text-brand-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Volver a los avisos
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Columna izquierda: galería + descripción */}
        <div className="space-y-6">
          <div className="card overflow-hidden p-4 md:p-6">
            <PhotoGallery
              imagenes={post.images}
              alt={post.nombre ?? 'Perro sin nombre'}
            />
          </div>

          <div className="card p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`badge px-3 py-1 text-xs ${COLOR_CATEGORIA[post.categoria] ?? 'bg-black/10 text-ink'}`}>
                {ETIQUETA_CATEGORIA[post.categoria] ?? post.categoria}
              </span>
              <span className="badge bg-black/5 text-ink">
                <Dog className="h-3 w-3" /> {ETIQUETA_ESPECIE[post.especie as keyof typeof ETIQUETA_ESPECIE] ?? post.especie}
              </span>
              <span className={`badge ${resuelto ? 'bg-black/10 text-ink-muted' : 'bg-good/10 text-good'}`}>
                <BadgeCheck className="h-3 w-3" /> {resuelto ? 'Resuelto' : 'Aviso activo'}
              </span>
            </div>

            <h1 className="mt-3 font-display text-3xl font-black tracking-tight text-ink md:text-4xl">
              {post.nombre ?? 'Perro sin nombre'}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-ink-muted">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4 text-brand-primary" />
                {isAuthenticated
                  ? <span className="font-bold text-ink">{post.zona}</span>
                  : <span className="select-none font-bold text-ink" style={{ filter: 'blur(5px)' }}>Villa Ejemplo</span>
                }
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-4 w-4" /> {post.fecha}
              </span>
            </div>

            <h2 className="mt-6 font-display text-sm font-extrabold uppercase tracking-wide text-ink">
              Descripción
            </h2>
            <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-ink">
              {post.descripcion}
            </p>
          </div>
        </div>

        {/* Columna derecha sticky */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          {post.categoria === 'adopcion' && !resuelto && isAuthenticated && (
            <button
              type="button"
              onClick={() => setAdoptarOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-brand-gold to-brand-gold-dark py-4 text-base font-bold text-[#5b3a0e] shadow-soft transition hover:opacity-90"
            >
              <Heart className="h-5 w-5" /> Quiero adoptarlo
            </button>
          )}

          <ContactBlock
            waNumero={waNumero}
            waTexto={waTexto}
            animalId={post.id}
          />

          {/* ── Panel de gestión ── */}
          {canManage && (
            <div className={`card overflow-hidden ${resuelto ? 'border border-black/10' : 'border border-brand-primary/20'}`}>
              {/* Header colapsable */}
              <button
                type="button"
                onClick={() => setPanelAbierto((v) => !v)}
                className="flex w-full items-center gap-2 p-4 text-left"
              >
                {isAdmin && !isOwner
                  ? <ShieldAlert className="h-4 w-4 shrink-0 text-bad" />
                  : <Dog className="h-4 w-4 shrink-0 text-brand-primary" />
                }
                <span className="flex-1 font-display text-sm font-extrabold text-ink">
                  {isAdmin && !isOwner ? 'Panel de administrador' : 'Gestionar mi aviso'}
                </span>
                {panelAbierto
                  ? <ChevronUp className="h-4 w-4 text-ink-muted" />
                  : <ChevronDown className="h-4 w-4 text-ink-muted" />
                }
              </button>

              {panelAbierto && (
                <div className="border-t border-black/8 px-4 pb-4 pt-3 space-y-2">

                  {/* Mensajes de estado */}
                  {msgOk && (
                    <p className="flex items-center gap-1.5 rounded-xl bg-good/10 px-3 py-2 text-xs font-bold text-good">
                      <CheckCircle2 className="h-4 w-4 shrink-0" /> {msgOk}
                    </p>
                  )}
                  {msgErr && (
                    <p className="flex items-center gap-1.5 rounded-xl bg-bad/10 px-3 py-2 text-xs font-bold text-bad">
                      <AlertCircle className="h-4 w-4 shrink-0" /> {msgErr}
                    </p>
                  )}

                  {/* Acción: Renovar (Lo sigo buscando) — solo si activo */}
                  {!resuelto && (
                    <button
                      type="button"
                      disabled={accionando}
                      onClick={handleRenovar}
                      className="flex w-full items-center gap-2 rounded-xl border-2 border-brand-primary/30 bg-brand-primary/5 px-3 py-2.5 text-sm font-bold text-brand-primary transition hover:bg-brand-primary/10 disabled:opacity-60"
                    >
                      <RefreshCw className={`h-4 w-4 shrink-0 ${accionando ? 'animate-spin' : ''}`} />
                      {LABEL_RENOVAR[post.categoria] ?? 'Renovar aviso'}
                      <span className="ml-auto text-[10px] font-normal text-brand-primary/60">Sube el aviso al tope</span>
                    </button>
                  )}

                  {/* Acción: Marcar resuelto — solo si activo */}
                  {!resuelto && !confirmResuelto && (
                    <button
                      type="button"
                      disabled={accionando}
                      onClick={() => { setConfirmResuelto(true); setConfirmBorrar(false); }}
                      className="flex w-full items-center gap-2 rounded-xl border-2 border-good/30 bg-good/5 px-3 py-2.5 text-sm font-bold text-good transition hover:bg-good/10 disabled:opacity-60"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      {isAdmin && !isOwner
                        ? 'El dueño lo encontró'
                        : LABEL_RESUELTO[post.categoria] ?? 'Marcar como resuelto'}
                    </button>
                  )}

                  {/* Confirm: resuelto */}
                  {confirmResuelto && (
                    <div className="rounded-xl bg-good/8 p-3">
                      <p className="text-xs font-bold text-ink">
                        {post.categoria === 'perdido'
                          ? '¿Confirmás que lo encontraste? El aviso va a pasar al filtro verde de Encontrados.'
                          : '¿Confirmás que el aviso se resolvió? Se va a ocultar de la lista.'}
                      </p>
                      <p className="mt-1 text-[11px] text-ink-muted">
                        {post.categoria === 'perdido'
                          ? 'Vas a poder marcarlo como "Volvió a casa" desde ahí cuando el dueño lo reclame.'
                          : <>El perfil del perro en Mis Perros <strong>no se borra</strong>.</>}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          type="button"
                          disabled={accionando}
                          onClick={handleResuelto}
                          className="flex-1 rounded-xl bg-good px-3 py-2 text-xs font-extrabold text-white transition hover:bg-good/90 disabled:opacity-60"
                        >
                          {accionando ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Sí, confirmar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmResuelto(false)}
                          className="flex-1 rounded-xl bg-black/8 px-3 py-2 text-xs font-bold text-ink transition hover:bg-black/12"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Separador */}
                  <div className="pt-1">
                    {/* Acción: Borrar */}
                    {!confirmBorrar && (
                      <button
                        type="button"
                        disabled={accionando}
                        onClick={() => { setConfirmBorrar(true); setConfirmResuelto(false); }}
                        className="flex w-full items-center gap-2 rounded-xl border-2 border-bad/25 bg-bad/5 px-3 py-2.5 text-sm font-bold text-bad transition hover:bg-bad/10 disabled:opacity-60"
                      >
                        <Trash2 className="h-4 w-4 shrink-0" />
                        Borrar publicación
                      </button>
                    )}

                    {/* Confirm: borrar */}
                    {confirmBorrar && (
                      <div className="rounded-xl bg-bad/8 p-3">
                        <p className="text-xs font-bold text-ink">
                          ¿Seguro que querés borrar este aviso? Esta acción no se puede deshacer.
                        </p>
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            disabled={accionando}
                            onClick={handleBorrar}
                            className="flex-1 rounded-xl bg-bad px-3 py-2 text-xs font-extrabold text-white transition hover:bg-bad/90 disabled:opacity-60"
                          >
                            {accionando ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Sí, borrar'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmBorrar(false)}
                            className="flex-1 rounded-xl bg-black/8 px-3 py-2 text-xs font-bold text-ink transition hover:bg-black/12"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <AdSlot variant="sidebar" />

          <div className="card p-6">
            <h2 className="font-display text-sm font-extrabold uppercase tracking-wide text-ink">
              Estado del aviso
            </h2>
            <dl className="mt-3 space-y-2 text-sm">
              <Row label="Tipo"      value={ETIQUETA_CATEGORIA[post.categoria] ?? post.categoria} />
              {isAuthenticated
                ? <Row label="Zona" value={post.zona} />
                : <div className="flex items-center justify-between gap-3 border-b border-black/5 pb-2">
                    <dt className="text-xs font-bold uppercase tracking-wide text-ink-muted">Zona</dt>
                    <dd className="flex items-center gap-1 text-xs font-bold text-ink-muted">
                      <Lock className="h-3 w-3" /> Solo usuarios registrados
                    </dd>
                  </div>
              }
              <Row label="Publicado" value={post.fecha} />
              {post.horario && <Row label="Horario" value={post.horario} />}
              <Row
                label="Estado"
                value={resuelto ? 'Resuelto' : 'Activo'}
                tone={resuelto ? 'text-ink-muted' : 'text-good'}
              />
            </dl>
          </div>
        </aside>
      </div>
      {adoptarOpen && post && (
        <AdoptionSheet post={post} onClose={() => setAdoptarOpen(false)} />
      )}
    </article>
  );
}

function Row({ label, value, tone = '' }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-black/5 pb-2 last:border-0 last:pb-0">
      <dt className="text-xs font-bold uppercase tracking-wide text-ink-muted">{label}</dt>
      <dd className={`text-sm font-extrabold text-ink ${tone}`}>{value}</dd>
    </div>
  );
}

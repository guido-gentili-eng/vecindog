'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, MapPin, Calendar, Dog, BadgeCheck, Loader2, AlertCircle,
  Trash2, CheckCircle2, RefreshCw, ShieldAlert, ChevronDown, ChevronUp, Lock, Heart,
  Share2, MessageCircle, Eye, Clock, SendHorizonal, Navigation, CheckCheck,
} from 'lucide-react';
import { ETIQUETA_CATEGORIA, ETIQUETA_ESPECIE } from '@/lib/mockData';
import {
  obtenerPost, resolverPost, encontrarPost, renovarPost, eliminarPost, actualizarZonaPost, type Post,
} from '@/lib/posts';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import PhotoGallery from '@/components/PhotoGallery';
import ContactBlock from '@/components/ContactBlock';
import AdSlot from '@/components/AdSlot';
import AdoptionSheet from '@/components/AdoptionSheet';
import FoundModal from '@/components/FoundModal';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import dynamic from 'next/dynamic';
const MapPinPicker = dynamic(() => import('@/components/MapPinPicker'), { ssr: false });

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
  const searchParams = useSearchParams();
  const { user, isAuthenticated, ciudad }  = useAuth();

  const [post,        setPost]        = useState<Post | null>(null);
  const [cargando,    setCargando]    = useState(true);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const accionEjecutada = useRef(false);
  const [adoptarOpen,  setAdoptarOpen]  = useState(false);

  /* estados de acción */
  const [confirmBorrar,   setConfirmBorrar]   = useState(false);
  const [confirmResuelto, setConfirmResuelto] = useState(false);
  const [accionando,      setAccionando]      = useState(false);
  const [showFoundModal,  setShowFoundModal]  = useState(false);
  const [msgOk,           setMsgOk]           = useState('');
  const [msgErr,         setMsgErr]         = useState('');

  /* Lo vi */
  const [loViOpen,       setLoViOpen]       = useState(false);
  const [loViCalle,      setLoViCalle]      = useState('');
  const [loViLat,        setLoViLat]        = useState<number | null>(null);
  const [loViLng,        setLoViLng]        = useState<number | null>(null);
  const [loViHora,       setLoViHora]       = useState('');
  const [loViLoading,    setLoViLoading]    = useState(false);
  const [loViEnviado,    setLoViEnviado]    = useState(false);
  const [loViError,      setLoViError]      = useState('');
  const [loViGps,        setLoViGps]        = useState<'idle' | 'cargando' | 'ok' | 'error'>('idle');
  const [loViManual,     setLoViManual]     = useState(false);
  const [loViShowMap,    setLoViShowMap]    = useState(false);
  const [loViMismoLugar, setLoViMismoLugar] = useState(false);
  const [loViFecha,      setLoViFecha]      = useState<'hoy' | 'otro'>('hoy');
  const [loViOtroDia,    setLoViOtroDia]    = useState('');

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    obtenerPost(id)
      .then(setPost)
      .finally(() => setCargando(false));
  }, [id]);

  // Notifica al dueño cuando un usuario logueado (no dueño) visita el aviso
  useEffect(() => {
    if (!post || !isAuthenticated || !user) return;
    if (post.user_id === user.id) return;
    if (post.estado === 'resuelto') return;

    const key = `visita_notif_${post.id}`;
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(key)) return;
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(key, '1');

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.access_token) return;
      fetch('/api/notificar-visita', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ post_id: post.id }),
      }).catch(() => {});
    });
  }, [post, isAuthenticated, user]);

  // Procesa ?accion=renovar|encontrado proveniente del email de vencimiento
  useEffect(() => {
    const accion = searchParams.get('accion');
    if (!accion || !post || !user || accionEjecutada.current) return;
    const esOwner = post.user_id === user.id;
    if (!esOwner || post.estado === 'resuelto') return;

    accionEjecutada.current = true;
    setPanelAbierto(true);

    if (accion === 'renovar') {
      handleRenovar();
    } else if (accion === 'encontrado') {
      setConfirmResuelto(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post, user, searchParams]);

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

  const waNumero = (post.contacto ?? '').replace(/[^0-9]/g, '');
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

  async function capturarGpsLoVi() {
    if (!navigator.geolocation) { setLoViGps('error'); setLoViManual(true); return; }
    setLoViGps('cargando');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const enArgentina = lat >= -55 && lat <= -21 && lng >= -73 && lng <= -53;
        if (!enArgentina) { setLoViGps('error'); setLoViManual(true); return; }
        setLoViLat(lat); setLoViLng(lng);
        setLoViGps('ok');
        setLoViShowMap(true);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
            { headers: { 'User-Agent': 'Vecindog/1.0' } }
          );
          const data = await res.json();
          if (data?.address) {
            const a = data.address;
            const calle  = a.road ?? a.pedestrian ?? a.footway ?? '';
            const numero = a.house_number ?? '';
            const barrio = a.suburb ?? a.neighbourhood ?? a.quarter ?? '';
            const zona   = [calle && numero ? `${calle} ${numero}` : calle, barrio].filter(Boolean).join(', ');
            if (zona) setLoViCalle(zona);
          }
        } catch { /* sin reverse geocode */ }
      },
      () => { setLoViGps('error'); setLoViManual(true); },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  async function handleLoVi() {
    const calleEfectiva = loViMismoLugar ? (post!.zona ?? '') : loViCalle.trim();
    const fechaEfectiva = loViFecha === 'hoy'
      ? new Date().toISOString().slice(0, 10)
      : loViOtroDia;
    if (!calleEfectiva || !loViHora.trim() || !fechaEfectiva) return;
    setLoViLoading(true);
    setLoViError('');
    try {
      const fechaLabel = loViFecha === 'hoy'
        ? 'hoy'
        : new Date(fechaEfectiva + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long' });
      if (post!.categoria === 'perdido') {
        const lugarTexto = loViMismoLugar ? `en el mismo lugar (${calleEfectiva})` : `en ${calleEfectiva}`;
        const mensaje = `👀 Alguien vio a ${post!.nombre ?? 'tu perro'} ${lugarTexto} a las ${loViHora} (${fechaLabel}).`;
        const { error } = await supabase.from('notifications').insert({
          user_id: post!.user_id,
          post_id: post!.id,
          tipo:    'avistamiento',
          mensaje,
          leida:   false,
        });
        if (error) throw error;
        await actualizarZonaPost(post!.id, calleEfectiva, loViHora,
          loViMismoLugar ? undefined : (loViLat ?? undefined),
          loViMismoLugar ? undefined : (loViLng ?? undefined),
          fechaEfectiva,
        );
        setPost((p) => p ? { ...p, horario: loViHora, fecha: fechaEfectiva } : p);
      } else if (post!.categoria === 'encontrado') {
        const lat = loViMismoLugar ? undefined : (loViLat ?? undefined);
        const lng = loViMismoLugar ? undefined : (loViLng ?? undefined);
        await actualizarZonaPost(post!.id, calleEfectiva, loViHora, lat, lng, fechaEfectiva);
        setPost((p) => p ? { ...p, zona: calleEfectiva, horario: loViHora, fecha: fechaEfectiva, ...(lat != null ? { lat, lng } : {}) } : p);
      }
      setLoViEnviado(true);
    } catch {
      setLoViError('No se pudo enviar. Intentá de nuevo.');
    } finally {
      setLoViLoading(false);
    }
  }

  function resetLoVi() {
    setLoViEnviado(false);
    setLoViCalle('');
    setLoViHora('');
    setLoViError('');
    setLoViLat(null);
    setLoViLng(null);
    setLoViGps('idle');
    setLoViManual(false);
    setLoViShowMap(false);
    setLoViMismoLugar(false);
    setLoViFecha('hoy');
    setLoViOtroDia('');
    setLoViOpen(true);
  }

  const postUrl = `https://www.mivecindog.com.ar/publicaciones/${post.id}`;

  function handleShare() {
    if (!post) return;
    const texto = `${post.nombre ?? 'Perro'} — ${ETIQUETA_CATEGORIA[post.categoria] ?? post.categoria} en ${post.zona}\n${postUrl}`;
    if (navigator.share) {
      navigator.share({ title: post.nombre ?? 'Aviso Vecindog', text: texto, url: postUrl }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(postUrl);
    }
  }

  return (
    <article className="py-8 md:py-10 pb-24 lg:pb-10">
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

            <div className="mt-3 flex items-start justify-between gap-3">
              <h1 className="font-display text-3xl font-black tracking-tight text-ink md:text-4xl">
                {post.nombre ?? 'Perro sin nombre'}
              </h1>
              <button type="button" onClick={handleShare}
                className="shrink-0 mt-1 grid h-9 w-9 place-items-center rounded-2xl bg-brand-cream text-ink-muted transition hover:bg-brand-primary/10 hover:text-brand-primary"
                title="Compartir aviso">
                <Share2 className="h-4 w-4" />
              </button>
            </div>

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
          {/* ── "Lo vi / Yo también lo vi" — perdido y encontrado, activo, no dueño ── */}
          {(post.categoria === 'perdido' || post.categoria === 'encontrado') && !resuelto && isAuthenticated && !isOwner && (
            <div className="card overflow-hidden border border-brand-primary/20">
              {!loViOpen && !loViEnviado && (
                <button
                  type="button"
                  onClick={() => setLoViOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary py-4 text-base font-bold text-white transition hover:opacity-90 active:scale-[0.99]"
                >
                  <Eye className="h-5 w-5" />
                  {post.categoria === 'encontrado' ? 'Yo también lo vi' : 'Lo vi'}
                </button>
              )}

              {loViOpen && !loViEnviado && (
                <div className="p-4 space-y-3">
                  <p className="text-sm font-extrabold text-ink flex items-center gap-1.5">
                    <Eye className="h-4 w-4 text-brand-primary shrink-0" /> ¿Dónde y cuándo lo viste?
                  </p>

                  {/* ── Mismo lugar ── */}
                  {!loViMismoLugar && loViGps !== 'ok' && !loViManual && (
                    <button
                      type="button"
                      onClick={() => setLoViMismoLugar(true)}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-black/15 bg-black/5 px-3 py-3 text-sm font-bold text-ink transition hover:bg-black/8"
                    >
                      <MapPin className="h-4 w-4 text-brand-primary" /> En el mismo lugar
                    </button>
                  )}

                  {loViMismoLugar && (
                    <div className="flex items-center justify-between rounded-2xl bg-brand-primary/8 px-3 py-2.5 ring-1 ring-brand-primary/20">
                      <div className="flex items-center gap-2 text-sm font-bold text-brand-primary">
                        <MapPin className="h-4 w-4 shrink-0" /> Mismo lugar que el aviso
                      </div>
                      <button type="button"
                        onClick={() => setLoViMismoLugar(false)}
                        className="text-xs text-ink-muted hover:text-bad transition">Cambiar</button>
                    </div>
                  )}

                  {/* ── GPS o manual (solo si no eligió mismo lugar) ── */}
                  {!loViMismoLugar && (
                    loViGps === 'ok' ? (
                      <div className="flex items-center justify-between rounded-2xl bg-good/10 px-3 py-2.5 ring-1 ring-good/20">
                        <div className="flex items-center gap-2 text-sm font-bold text-good">
                          <CheckCheck className="h-4 w-4 shrink-0" /> Ubicación GPS capturada
                        </div>
                        <button type="button"
                          onClick={() => { setLoViGps('idle'); setLoViManual(true); setLoViLat(null); setLoViLng(null); setLoViShowMap(false); }}
                          className="text-xs text-ink-muted hover:text-bad transition">Cambiar</button>
                      </div>
                    ) : loViGps === 'cargando' ? (
                      <div className="flex items-center gap-3 rounded-2xl border-2 border-brand-primary/30 bg-brand-primary/5 px-3 py-3">
                        <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
                        <span className="text-sm font-bold text-brand-primary">Obteniendo ubicación…</span>
                      </div>
                    ) : !loViManual ? (
                      <div className="space-y-2">
                        <button type="button" onClick={capturarGpsLoVi}
                          className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-brand-primary bg-brand-primary/5 px-3 py-3 text-sm font-bold text-brand-primary transition hover:bg-brand-primary/10">
                          <Navigation className="h-4 w-4" />
                          {loViGps === 'error' ? 'No se pudo obtener GPS — reintentar' : 'Usar mi ubicación GPS'}
                        </button>
                        <button type="button" onClick={() => setLoViManual(true)}
                          className="w-full text-center text-xs text-ink-muted hover:text-brand-primary transition underline">
                          Escribir dirección manual
                        </button>
                      </div>
                    ) : null
                  )}

                  {/* Campo de dirección — manual o confirmación GPS */}
                  {(loViManual || loViGps === 'ok') && (
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                        {loViGps === 'ok' ? 'Confirmá o ajustá la dirección' : 'Calle / zona'}
                      </label>
                      <AddressAutocomplete
                        value={loViCalle}
                        onChange={setLoViCalle}
                        onSelectCoords={(lat, lng) => {
                          setLoViLat(lat); setLoViLng(lng);
                          setLoViShowMap(true);
                        }}
                        placeholder="Ej: Av. Colón y Brandsen"
                        ciudad={ciudad}
                      />
                    </div>
                  )}

                  {/* MapPinPicker — confirmar pin */}
                  {loViShowMap && loViLat != null && loViLng != null && (
                    <MapPinPicker
                      lat={loViLat}
                      lng={loViLng}
                      onChange={(lat, lng) => { setLoViLat(lat); setLoViLng(lng); }}
                      onConfirm={() => setLoViShowMap(false)}
                    />
                  )}

                  {/* Hora */}
                  {(loViMismoLugar || loViManual || loViGps === 'ok') && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wide text-ink-muted">¿Cuándo lo viste?</label>
                      <div className="flex gap-2">
                        <button type="button"
                          onClick={() => setLoViFecha('hoy')}
                          className={`flex-1 rounded-xl border-2 py-2 text-sm font-bold transition ${loViFecha === 'hoy' ? 'border-brand-primary bg-brand-primary/8 text-brand-primary' : 'border-black/15 text-ink-muted hover:border-brand-primary/40'}`}>
                          Hoy
                        </button>
                        <button type="button"
                          onClick={() => setLoViFecha('otro')}
                          className={`flex-1 rounded-xl border-2 py-2 text-sm font-bold transition ${loViFecha === 'otro' ? 'border-brand-primary bg-brand-primary/8 text-brand-primary' : 'border-black/15 text-ink-muted hover:border-brand-primary/40'}`}>
                          Otro día
                        </button>
                      </div>
                      {loViFecha === 'otro' && (
                        <input
                          type="date"
                          value={loViOtroDia}
                          max={new Date().toISOString().slice(0, 10)}
                          onChange={(e) => setLoViOtroDia(e.target.value)}
                          className="w-full rounded-xl border border-black/15 bg-brand-cream px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                        />
                      )}
                      <label className="text-xs font-bold uppercase tracking-wide text-ink-muted flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Hora aproximada
                      </label>
                      <input
                        type="time"
                        value={loViHora}
                        onChange={(e) => setLoViHora(e.target.value)}
                        className="w-full rounded-xl border border-black/15 bg-brand-cream px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-primary/30"
                      />
                    </div>
                  )}

                  {loViError && (
                    <p className="text-xs font-bold text-bad">{loViError}</p>
                  )}

                  {(loViMismoLugar || loViManual || loViGps === 'ok') && (
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        disabled={loViLoading || !loViHora.trim() || (!loViMismoLugar && !loViCalle.trim()) || (loViFecha === 'otro' && !loViOtroDia)}
                        onClick={handleLoVi}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-primary py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                      >
                        {loViLoading
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <><SendHorizonal className="h-4 w-4" /> Enviar aviso</>
                        }
                      </button>
                      <button
                        type="button"
                        onClick={() => { setLoViOpen(false); setLoViError(''); setLoViMismoLugar(false); }}
                        className="rounded-xl bg-black/8 px-4 py-2.5 text-sm font-bold text-ink transition hover:bg-black/12"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              )}

              {loViEnviado && (
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-good">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <p className="text-sm font-bold">
                      {post.categoria === 'encontrado' ? '¡Ubicación actualizada en el mapa!' : '¡Aviso enviado al dueño!'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={resetLoVi}
                    className="text-xs font-bold text-brand-primary hover:underline"
                  >
                    Reportar otro avistamiento
                  </button>
                </div>
              )}
            </div>
          )}

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
                          ? '¿Confirmás que lo encontraste? El aviso va a pasar al filtro verde de Vistos.'
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

      {/* Barra flotante de contacto — solo mobile, solo si no está resuelto */}
      {!resuelto && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
          <div className="flex gap-3">
            <a
              href={`https://wa.me/${waNumero}?text=${waTexto}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3 text-sm font-bold text-white"
            >
              <MessageCircle className="h-4 w-4" /> Contactar por WhatsApp
            </a>
            <button type="button" onClick={handleShare}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-cream text-ink-muted">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
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

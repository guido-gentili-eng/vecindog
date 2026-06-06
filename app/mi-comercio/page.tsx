'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Loader2, Store, Phone, MapPin, Clock,
  ExternalLink, Edit3, CheckCircle2, AlertCircle, Plus, Trash2, Megaphone,
  Star, Eye, X, Upload,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { subirImagenAd, type Ad } from '@/lib/ads';

/* ── helpers ── */
function fmtFecha(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const CATEGORIAS = [
  { value: 'veterinaria',          label: 'Veterinaria'           },
  { value: 'pet-shop',             label: 'Pet Shop'              },
  { value: 'peluqueria-canina',    label: 'Peluquería Canina'     },
  { value: 'adiestrador',          label: 'Adiestrador'           },
  { value: 'paseador',             label: 'Paseador'              },
  { value: 'guarderia-hotel',      label: 'Guardería / Hotel'     },
  { value: 'refugio-rescate',      label: 'Refugio / Rescate'     },
  { value: 'tienda-mascotas',      label: 'Tienda de Mascotas'    },
  { value: 'farmacia-veterinaria', label: 'Farmacia Veterinaria'  },
];

const DIAS_OPCIONES = [
  'Lunes a viernes', 'Lunes a sábado', 'Todos los días',
  'Lunes, miércoles y viernes', 'Martes, jueves y sábado',
];

/* ── Novedad type ── */
interface Novedad {
  id: string;
  titulo: string;
  texto: string | null;
  imagen_url: string | null;
  created_at: string;
}

/* ── Página principal ── */
export default function MiComercioPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [comercio,  setComercio]  = useState<Ad | null>(null);
  const [cargando,  setCargando]  = useState(true);
  const [editando,  setEditando]  = useState(false);
  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [reviews,   setReviews]   = useState({ promedio: 0, total: 0 });

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.replace('/'); return; }
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated]);

  async function cargar() {
    setCargando(true);
    try {
      const email = user?.email;
      if (!email) return;

      const { data } = await supabase
        .from('ads')
        .select('*')
        .eq('variant', 'comercio')
        .eq('anunciante', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      setComercio(data ?? null);

      if (data?.id) {
        const [novRes, revRes] = await Promise.all([
          fetch(`/api/novedades?ad_id=${data.id}`).then((r) => r.json()),
          fetch(`/api/comercio-reviews?ad_id=${data.id}`).then((r) => r.json()),
        ]);
        setNovedades(novRes.novedades ?? []);
        setReviews({ promedio: revRes.promedio ?? 0, total: revRes.total ?? 0 });
      }
    } finally {
      setCargando(false);
    }
  }

  if (authLoading || cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f0eb]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!comercio) {
    return (
      <div className="min-h-screen bg-[#f5f0eb] py-12 px-4">
        <div className="mx-auto max-w-md text-center">
          <Store className="mx-auto mb-4 h-14 w-14 text-ink-muted/30" />
          <h1 className="font-display text-2xl font-black text-ink">No tenés un comercio registrado</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Unite a la Red Vecindog y aparecé en el mapa de dueños de mascotas.
          </p>
          <Link
            href="/red-vecindog"
            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-brand-primary px-6 py-3 font-bold text-white"
          >
            <Store className="h-4 w-4" /> Registrar mi comercio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0eb] py-8 px-4">
      <div className="mx-auto max-w-xl space-y-5">

        <div className="flex items-center justify-between">
          <Link href="/mi-perfil" className="inline-flex items-center gap-1 text-sm font-bold text-brand-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Mi perfil
          </Link>
          <Link
            href={`/comercio/${comercio.id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-primary/10 px-4 py-2 text-xs font-bold text-brand-primary hover:bg-brand-primary/20"
          >
            <Eye className="h-3.5 w-3.5" /> Ver perfil público
          </Link>
        </div>

        {/* Header del comercio */}
        <div className="rounded-[24px] bg-white border border-black/5 overflow-hidden">
          {comercio.imagen_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={comercio.imagen_url} alt={comercio.titulo} className="h-36 w-full object-cover" />
          )}
          <div className="px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-xl font-black text-ink">{comercio.titulo}</h1>
                {comercio.subtitulo && <p className="text-sm text-ink-muted">{comercio.subtitulo}</p>}
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${comercio.activo ? 'bg-good/15 text-good' : 'bg-bad/15 text-bad'}`}>
                {comercio.activo ? 'Activo' : 'Pendiente activación'}
              </span>
            </div>

            {/* Estadísticas */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#f5f0eb] px-4 py-3">
                <p className="text-xs font-bold text-ink-muted uppercase tracking-wide">Reviews</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                  <span className="font-bold text-ink">{reviews.promedio > 0 ? reviews.promedio.toFixed(1) : '—'}</span>
                  <span className="text-xs text-ink-muted">({reviews.total})</span>
                </div>
              </div>
              <div className="rounded-2xl bg-[#f5f0eb] px-4 py-3">
                <p className="text-xs font-bold text-ink-muted uppercase tracking-wide">Vence</p>
                <p className="mt-1 font-bold text-ink">{fmtFecha(comercio.fecha_fin)}</p>
              </div>
            </div>

            <button
              onClick={() => setEditando(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-brand-primary/20 px-4 py-3 text-sm font-bold text-brand-primary transition hover:bg-brand-primary/5"
            >
              <Edit3 className="h-4 w-4" /> Editar datos del comercio
            </button>
          </div>
        </div>

        {/* Novedades */}
        <NovedadesPanel adId={comercio.id} novedades={novedades} onRefresh={cargar} />

      </div>

      {/* Modal de edición */}
      {editando && (
        <EditarComercioModal
          comercio={comercio}
          onClose={() => setEditando(false)}
          onSaved={() => { setEditando(false); cargar(); }}
        />
      )}
    </div>
  );
}

/* ── Panel de novedades ── */
function NovedadesPanel({ adId, novedades, onRefresh }: { adId: string; novedades: Novedad[]; onRefresh: () => void }) {
  const [creando, setCreando]    = useState(false);
  const [titulo, setTitulo]      = useState('');
  const [texto, setTexto]        = useState('');
  const [loading, setLoading]    = useState(false);
  const [error, setError]        = useState('');

  async function handlePublicar() {
    if (!titulo.trim() || loading) return;
    setLoading(true); setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/novedades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session!.access_token}`,
        },
        body: JSON.stringify({ ad_id: adId, titulo, texto }),
      });
      if (!res.ok) throw new Error();
      setTitulo(''); setTexto(''); setCreando(false);
      onRefresh();
    } catch {
      setError('No se pudo publicar la novedad.');
    } finally {
      setLoading(false);
    }
  }

  async function handleEliminar(id: string) {
    const { data: { session } } = await supabase.auth.getSession();
    await fetch(`/api/novedades?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session!.access_token}` },
    });
    onRefresh();
  }

  return (
    <div className="rounded-[20px] bg-white border border-black/5 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
        <div className="flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-brand-primary" />
          <h2 className="font-display text-sm font-extrabold text-ink uppercase tracking-wide">Novedades y Ofertas</h2>
        </div>
        <button
          onClick={() => setCreando((v) => !v)}
          className="inline-flex items-center gap-1 rounded-2xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary"
        >
          <Plus className="h-3.5 w-3.5" /> Nueva
        </button>
      </div>

      {creando && (
        <div className="border-b border-black/5 px-5 py-4 space-y-3 bg-[#faf7f4]">
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título de la novedad (ej: Promoción de baño + corte)"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:border-brand-primary focus:outline-none"
          />
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Descripción (opcional)"
            rows={2}
            className="w-full resize-none rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:border-brand-primary focus:outline-none"
          />
          {error && <p className="text-xs font-bold text-bad">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={handlePublicar}
              disabled={!titulo.trim() || loading}
              className="flex-1 rounded-2xl bg-brand-primary py-2.5 text-sm font-bold text-white disabled:opacity-40"
            >
              {loading ? 'Publicando...' : 'Publicar'}
            </button>
            <button onClick={() => setCreando(false)} className="rounded-2xl bg-black/5 px-4 text-sm font-bold text-ink">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="divide-y divide-black/5">
        {novedades.length === 0 ? (
          <p className="px-5 py-6 text-center text-sm text-ink-muted">
            Publicá novedades, ofertas o turnos disponibles para que los clientes las vean.
          </p>
        ) : (
          novedades.map((n) => (
            <div key={n.id} className="flex items-start gap-3 px-5 py-3">
              <div className="flex-1">
                <p className="font-bold text-sm text-ink">{n.titulo}</p>
                {n.texto && <p className="text-xs text-ink-muted mt-0.5">{n.texto}</p>}
              </div>
              <button
                onClick={() => handleEliminar(n.id)}
                className="rounded-xl p-1.5 text-ink-muted/40 hover:bg-bad/10 hover:text-bad transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ── Modal de edición ── */
function EditarComercioModal({
  comercio,
  onClose,
  onSaved,
}: {
  comercio: Ad;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [nombre,      setNombre]      = useState(comercio.titulo ?? '');
  const [telefono,    setTelefono]    = useState(comercio.telefono_comercio ?? '');
  const [direccion,   setDireccion]   = useState(comercio.direccion_comercio ?? '');
  const [descripcion, setDescripcion] = useState(comercio.descripcion_comercio ?? '');
  const [apertura,    setApertura]    = useState(comercio.horario_apertura ?? '');
  const [cierre,      setCierre]      = useState(comercio.horario_cierre ?? '');
  const [dias,        setDias]        = useState(comercio.dias_atencion ?? '');
  const [categoria,   setCategoria]   = useState(comercio.categoria_local ?? '');
  const [link,        setLink]        = useState(
    comercio.href && !comercio.href.startsWith('tel:') && comercio.href !== 'https://www.mivecindog.com.ar'
      ? comercio.href : ''
  );
  const [fotoFile,    setFotoFile]    = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(comercio.imagen_url ?? null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [ok,          setOk]          = useState(false);

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  }

  async function handleGuardar() {
    if (!nombre.trim() || loading) return;
    setLoading(true); setError('');
    try {
      let imgUrl = comercio.imagen_url ?? null;
      if (fotoFile) imgUrl = await subirImagenAd(fotoFile);

      let href = comercio.href ?? 'https://www.mivecindog.com.ar';
      if (link?.trim()) {
        const raw = link.trim();
        href = raw.includes('://') ? raw : `https://${raw}`;
      } else if (telefono?.trim()) {
        href = `tel:${telefono.replace(/[\s\-\(\)]/g, '')}`;
      }

      const updates: Record<string, unknown> = {
        titulo:              nombre.trim(),
        telefono_comercio:   telefono.trim() || null,
        direccion_comercio:  direccion.trim() || null,
        descripcion_comercio: descripcion.trim() || null,
        horario_apertura:    apertura || null,
        horario_cierre:      cierre || null,
        dias_atencion:       dias || null,
        categoria_local:     categoria || null,
        href,
        imagen_url:          imgUrl,
        subtitulo:           [categoria ? CATEGORIAS.find((c) => c.value === categoria)?.label : null, comercio.localidad_comercio].filter(Boolean).join(' · ') || null,
      };

      const { error: upErr } = await supabase.from('ads').update(updates).eq('id', comercio.id);
      if (upErr) throw upErr;

      setOk(true);
      setTimeout(onSaved, 1200);
    } catch (e: unknown) {
      setError((e as Error).message ?? 'No se pudo guardar. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center" onClick={() => !loading && onClose()}>
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[32px] bg-white px-6 pb-8 pt-6 shadow-2xl sm:rounded-[32px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-black/10 sm:hidden" />

        {ok ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto mb-3 h-14 w-14 text-[#3F8B5C]" />
            <p className="font-display text-xl font-black text-ink">¡Datos actualizados!</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between sticky top-0 bg-white py-2">
              <h2 className="font-display text-xl font-black text-ink">Editar comercio</h2>
              <button onClick={onClose} className="rounded-full p-1.5 text-ink-muted hover:bg-black/5">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Foto */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">Foto del comercio</label>
                <div className="relative h-36 w-full overflow-hidden rounded-2xl border-2 border-dashed border-black/10 bg-[#f5f0eb]">
                  {fotoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={fotoPreview} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center flex-col gap-2 text-ink-muted">
                      <Upload className="h-6 w-6" />
                      <p className="text-xs">Subir foto</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFoto} className="absolute inset-0 cursor-pointer opacity-0" />
                </div>
              </div>

              {/* Nombre */}
              <Field label="Nombre del comercio *">
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="field" />
              </Field>

              {/* Categoría */}
              <Field label="Categoría *">
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="field">
                  <option value="">Seleccioná una categoría</option>
                  {CATEGORIAS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </Field>

              {/* Teléfono */}
              <Field label="Teléfono de contacto *">
                <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="field" />
              </Field>

              {/* Descripción */}
              <Field label="Descripción (opcional)">
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={2}
                  maxLength={200}
                  className="field resize-none"
                  placeholder="Describí brevemente tus servicios"
                />
              </Field>

              {/* Dirección */}
              <Field label="Dirección">
                <input value={direccion} onChange={(e) => setDireccion(e.target.value)} className="field" />
              </Field>

              {/* Horarios */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Apertura">
                  <input type="time" value={apertura} onChange={(e) => setApertura(e.target.value)} className="field" />
                </Field>
                <Field label="Cierre">
                  <input type="time" value={cierre} onChange={(e) => setCierre(e.target.value)} className="field" />
                </Field>
              </div>

              {/* Días */}
              <Field label="Días de atención">
                <select value={dias} onChange={(e) => setDias(e.target.value)} className="field">
                  <option value="">Seleccioná los días</option>
                  {DIAS_OPCIONES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>

              {/* Link */}
              <Field label="Sitio web / Instagram / WhatsApp (opcional)">
                <input type="url" value={link} onChange={(e) => setLink(e.target.value)} className="field" placeholder="https://instagram.com/tucomercio" />
              </Field>

              {error && (
                <div className="flex items-center gap-2 rounded-2xl bg-bad/10 px-4 py-3">
                  <AlertCircle className="h-4 w-4 shrink-0 text-bad" />
                  <p className="text-sm font-bold text-bad">{error}</p>
                </div>
              )}

              <button
                onClick={handleGuardar}
                disabled={!nombre.trim() || loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary py-3.5 text-sm font-bold text-white disabled:opacity-40"
              >
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</> : 'Guardar cambios'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">{label}</label>
      {children}
    </div>
  );
}

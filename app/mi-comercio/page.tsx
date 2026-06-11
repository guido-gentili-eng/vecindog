'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft, Loader2, Store, Phone, MapPin, Clock,
  ExternalLink, Edit3, CheckCircle2, AlertCircle, Plus, Trash2, Megaphone,
  Star, Eye, X, Upload, BarChart2, TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { subirImagenAd, type Ad } from '@/lib/ads';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { useLanguage } from '@/contexts/LanguageContext';

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

interface Novedad {
  id: string;
  titulo: string;
  texto: string | null;
  imagen_url: string | null;
  created_at: string;
}

export default function MiComercioPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

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
        .maybeSingle();

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
      <div className="min-h-screen bg-[#f5f0eb] py-8 px-4">
        <div className="mx-auto max-w-xl space-y-5">

          <div className="flex items-center justify-between">
            <Link href="/mi-perfil" className="inline-flex items-center gap-1 text-sm font-bold text-brand-primary hover:underline">
              <ArrowLeft className="h-4 w-4" /> {t.mcomVolver}
            </Link>
          </div>

          {/* Banner CTA */}
          <div className="rounded-[24px] bg-brand-primary px-6 py-6 text-white text-center">
            <Store className="mx-auto mb-3 h-10 w-10 opacity-90" />
            <h1 className="font-display text-xl font-black">{t.mcomSinComercioTitle}</h1>
            <p className="mt-1.5 text-sm opacity-80">{t.mcomSinComercioSub}</p>
            <Link
              href="/red-vecindog"
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-brand-primary shadow"
            >
              <Store className="h-4 w-4" /> {t.mcomRegistrar}
            </Link>
          </div>

          {/* Preview: tarjeta de comercio */}
          <div className="rounded-[24px] bg-white border border-black/5 overflow-hidden opacity-50 pointer-events-none select-none">
            <div className="h-28 w-full bg-gradient-to-r from-brand-primary/20 to-brand-primary/10" />
            <div className="px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="h-5 w-40 rounded-full bg-ink/10 mb-2" />
                  <div className="h-3 w-24 rounded-full bg-ink/5" />
                </div>
                <span className="shrink-0 rounded-full px-3 py-1 text-xs font-bold bg-good/15 text-good">
                  {t.mcomActivo}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#f5f0eb] px-4 py-3">
                  <p className="text-xs font-bold text-ink-muted uppercase tracking-wide">{t.mcomReviews}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Star className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                    <span className="font-bold text-ink">4.8</span>
                    <span className="text-xs text-ink-muted">(12)</span>
                  </div>
                </div>
                <div className="rounded-2xl bg-[#f5f0eb] px-4 py-3">
                  <p className="text-xs font-bold text-ink-muted uppercase tracking-wide">{t.mcomVence}</p>
                  <p className="mt-1 font-bold text-ink">31/12/2025</p>
                </div>
              </div>
              <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-brand-primary/20 px-4 py-3 text-sm font-bold text-brand-primary">
                <Edit3 className="h-4 w-4" /> {t.mcomEditar}
              </div>
            </div>
          </div>

          {/* Preview: novedades */}
          <div className="rounded-[20px] bg-white border border-black/5 overflow-hidden opacity-50 pointer-events-none select-none">
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
              <div className="flex items-center gap-2">
                <Megaphone className="h-4 w-4 text-brand-primary" />
                <h2 className="font-display text-sm font-extrabold text-ink uppercase tracking-wide">{t.mcomNovedadesTitle}</h2>
              </div>
              <div className="inline-flex items-center gap-1 rounded-2xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary">
                <Plus className="h-3.5 w-3.5" /> {t.mcomNueva}
              </div>
            </div>
            <div className="divide-y divide-black/5">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3">
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 w-32 rounded-full bg-ink/10" />
                    <div className="h-2.5 w-48 rounded-full bg-ink/5" />
                  </div>
                  <div className="rounded-xl p-1.5 text-ink-muted/20">
                    <Trash2 className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0eb] py-8 px-4">
      <div className="mx-auto max-w-xl space-y-5">

        <div className="flex items-center justify-between">
          <Link href="/mi-perfil" className="inline-flex items-center gap-1 text-sm font-bold text-brand-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> {t.mcomVolver}
          </Link>
          <Link
            href={`/comercio/${comercio.id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-primary/10 px-4 py-2 text-xs font-bold text-brand-primary hover:bg-brand-primary/20"
          >
            <Eye className="h-3.5 w-3.5" /> {t.mcomVerPerfil}
          </Link>
        </div>

        <div className="rounded-[24px] bg-white border border-black/5 overflow-hidden">
          {comercio.imagen_url && (
            <div className="relative h-44 w-full overflow-hidden">
              <Image src={comercio.imagen_url} alt={comercio.titulo} fill className="object-cover object-center" sizes="(max-width:768px) 100vw, 600px" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          )}
          <div className="px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-xl font-black text-ink">{comercio.titulo}</h1>
                {comercio.subtitulo && <p className="text-sm text-ink-muted">{comercio.subtitulo}</p>}
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${comercio.activo ? 'bg-good/15 text-good' : 'bg-bad/15 text-bad'}`}>
                {comercio.activo ? t.mcomActivo : t.mcomPendiente}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#f5f0eb] px-4 py-3">
                <p className="text-xs font-bold text-ink-muted uppercase tracking-wide">{t.mcomReviews}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                  <span className="font-bold text-ink">{reviews.promedio > 0 ? reviews.promedio.toFixed(1) : '—'}</span>
                  <span className="text-xs text-ink-muted">({reviews.total})</span>
                </div>
              </div>
              <div className="rounded-2xl bg-[#f5f0eb] px-4 py-3">
                <p className="text-xs font-bold text-ink-muted uppercase tracking-wide">{t.mcomVence}</p>
                <p className="mt-1 font-bold text-ink">{fmtFecha(comercio.fecha_fin)}</p>
              </div>
            </div>

            <button
              onClick={() => setEditando(true)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-brand-primary/20 px-4 py-3 text-sm font-bold text-brand-primary transition hover:bg-brand-primary/5"
            >
              <Edit3 className="h-4 w-4" /> {t.mcomEditar}
            </button>
          </div>
        </div>

        <StatsPanel adId={comercio.id} />

        <NovedadesPanel adId={comercio.id} novedades={novedades} onRefresh={cargar} />

      </div>

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

interface Stats {
  vistas_30d: number;
  vistas_7d: number;
  clicks_telefono_30d: number;
  clicks_mapa_30d: number;
  clicks_link_30d: number;
  vistas_por_dia: { fecha: string; total: number }[];
}

function StatsPanel({ adId }: { adId: string }) {
  const { t } = useLanguage();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch(`/api/comercio-stats?ad_id=${adId}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) setStats(await res.json());
    })();
  }, [adId]);

  const maxVista = stats ? Math.max(...stats.vistas_por_dia.map((d) => d.total), 1) : 1;

  return (
    <div className="rounded-[20px] bg-white border border-black/5 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-black/5">
        <BarChart2 className="h-4 w-4 text-brand-primary" />
        <h2 className="font-display text-sm font-extrabold text-ink uppercase tracking-wide">{t.mcomStatsTitle}</h2>
      </div>

      {!stats ? (
        <p className="px-5 py-5 text-sm text-ink-muted text-center">{t.mcomStatsCargando}</p>
      ) : (
        <div className="px-5 py-4 space-y-4">

          {/* Métrica principal: visitas */}
          <div className="flex items-end gap-4">
            <div>
              <p className="text-xs font-bold text-ink-muted uppercase tracking-wide">{t.mcomStatsVistas30}</p>
              <p className="font-display text-4xl font-black text-brand-primary leading-none mt-0.5">{stats.vistas_30d}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3.5 w-3.5 text-good" />
                <span className="text-xs font-bold text-good">{stats.vistas_7d} {t.mcomStatsVistas7.toLowerCase()}</span>
              </div>
            </div>

            {/* Mini sparkline */}
            <div className="flex-1 flex items-end gap-0.5 h-12">
              {stats.vistas_por_dia.map(({ fecha, total }) => (
                <div
                  key={fecha}
                  title={`${fecha}: ${total}`}
                  className="flex-1 rounded-t-sm bg-brand-primary/20 transition-all"
                  style={{ height: `${Math.max((total / maxVista) * 100, 4)}%` }}
                />
              ))}
            </div>
          </div>

          {/* Grid de clicks */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-[#f5f0eb] px-3 py-2.5 text-center">
              <Phone className="mx-auto h-4 w-4 text-brand-primary mb-1" />
              <p className="font-black text-lg text-ink leading-none">{stats.clicks_telefono_30d}</p>
              <p className="text-[10px] font-bold text-ink-muted mt-0.5 uppercase tracking-wide leading-tight">{t.mcomStatsTelefono}</p>
            </div>
            <div className="rounded-2xl bg-[#f5f0eb] px-3 py-2.5 text-center">
              <MapPin className="mx-auto h-4 w-4 text-brand-primary mb-1" />
              <p className="font-black text-lg text-ink leading-none">{stats.clicks_mapa_30d}</p>
              <p className="text-[10px] font-bold text-ink-muted mt-0.5 uppercase tracking-wide leading-tight">{t.mcomStatsMapa}</p>
            </div>
            <div className="rounded-2xl bg-[#f5f0eb] px-3 py-2.5 text-center">
              <ExternalLink className="mx-auto h-4 w-4 text-brand-primary mb-1" />
              <p className="font-black text-lg text-ink leading-none">{stats.clicks_link_30d}</p>
              <p className="text-[10px] font-bold text-ink-muted mt-0.5 uppercase tracking-wide leading-tight">{t.mcomStatsLink}</p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

function NovedadesPanel({ adId, novedades, onRefresh }: { adId: string; novedades: Novedad[]; onRefresh: () => void }) {
  const { t } = useLanguage();
  const [creando, setCreando] = useState(false);
  const [titulo,  setTitulo]  = useState('');
  const [texto,   setTexto]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  async function handlePublicar() {
    if (!titulo.trim() || loading) return;
    setLoading(true); setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Sin sesión');
      const res = await fetch('/api/novedades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ ad_id: adId, titulo, texto }),
      });
      if (!res.ok) throw new Error();
      setTitulo(''); setTexto(''); setCreando(false);
      onRefresh();
    } catch {
      setError(t.mcomNovError);
    } finally {
      setLoading(false);
    }
  }

  async function handleEliminar(id: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return;
    await fetch(`/api/novedades?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    onRefresh();
  }

  return (
    <div className="rounded-[20px] bg-white border border-black/5 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
        <div className="flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-brand-primary" />
          <h2 className="font-display text-sm font-extrabold text-ink uppercase tracking-wide">{t.mcomNovedadesTitle}</h2>
        </div>
        <button
          onClick={() => setCreando((v) => !v)}
          className="inline-flex items-center gap-1 rounded-2xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary"
        >
          <Plus className="h-3.5 w-3.5" /> {t.mcomNueva}
        </button>
      </div>

      {creando && (
        <div className="border-b border-black/5 px-5 py-4 space-y-3 bg-[#faf7f4]">
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder={t.mcomNovTituloPlaceholder}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm focus:border-brand-primary focus:outline-none"
          />
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={t.mcomNovDescPlaceholder}
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
              {loading ? t.mcomPublicando : t.mcomPublicar}
            </button>
            <button onClick={() => setCreando(false)} className="rounded-2xl bg-black/5 px-4 text-sm font-bold text-ink">
              {t.mcomCancelar}
            </button>
          </div>
        </div>
      )}

      <div className="divide-y divide-black/5">
        {novedades.length === 0 ? (
          <p className="px-5 py-6 text-center text-sm text-ink-muted">{t.mcomNovVacia}</p>
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

function EditarComercioModal({
  comercio,
  onClose,
  onSaved,
}: {
  comercio: Ad;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useLanguage();
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
  const [adLat,       setAdLat]       = useState<number | null>(comercio.lat ?? null);
  const [adLng,       setAdLng]       = useState<number | null>(comercio.lng ?? null);
  const [fotoFile,    setFotoFile]    = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(comercio.imagen_url ?? null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');
  const [ok,          setOk]          = useState(false);

  function handleFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoFile(file);
    const url = URL.createObjectURL(file);
    setFotoPreview((prev) => {
      if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
      return url;
    });
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
        lat:                 adLat,
        lng:                 adLng,
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
            <p className="font-display text-xl font-black text-ink">{t.mcomDatosActualizados}</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between sticky top-0 bg-white py-2">
              <h2 className="font-display text-xl font-black text-ink">{t.mcomEditarTitle}</h2>
              <button onClick={onClose} className="rounded-full p-1.5 text-ink-muted hover:bg-black/5">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">{t.mcomFotoLabel}</label>
                <div className="relative h-36 w-full overflow-hidden rounded-2xl border-2 border-dashed border-black/10 bg-[#f5f0eb]">
                  {fotoPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={fotoPreview} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center flex-col gap-2 text-ink-muted">
                      <Upload className="h-6 w-6" />
                      <p className="text-xs">{t.mcomSubirFoto}</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleFoto} className="absolute inset-0 cursor-pointer opacity-0" />
                </div>
              </div>

              <Field label={t.mcomNombreLabel}>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="field" />
              </Field>

              <Field label={t.mcomCategoriaLabel}>
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="field">
                  <option value="">{t.mcomCategoriaPlaceholder}</option>
                  {CATEGORIAS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </Field>

              <Field label={t.mcomTelefonoLabel}>
                <input type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="field" />
              </Field>

              <Field label={t.mcomDescripcionLabel}>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={2}
                  maxLength={200}
                  className="field resize-none"
                  placeholder={t.mcomDescripcionPlaceholder}
                />
              </Field>

              <Field label={t.mcomDireccionLabel}>
                <AddressAutocomplete
                  value={direccion}
                  onChange={setDireccion}
                  onSelectCoords={(lat, lng) => { setAdLat(lat); setAdLng(lng); }}
                  onClearCoords={() => { setAdLat(null); setAdLng(null); }}
                  placeholder="Av. San Martín 1234"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label={t.mcomApertura}>
                  <input type="time" value={apertura} onChange={(e) => setApertura(e.target.value)} className="field" />
                </Field>
                <Field label={t.mcomCierre}>
                  <input type="time" value={cierre} onChange={(e) => setCierre(e.target.value)} className="field" />
                </Field>
              </div>

              <Field label={t.mcomDiasLabel}>
                <select value={dias} onChange={(e) => setDias(e.target.value)} className="field">
                  <option value="">{t.mcomDiasPlaceholder}</option>
                  {DIAS_OPCIONES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>

              <Field label={t.mcomLinkLabel}>
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
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> {t.mcomGuardando}</> : t.mcomGuardarCambios}
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

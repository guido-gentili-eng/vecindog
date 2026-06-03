'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Plus, Trash2, Pencil, Loader2, CheckCircle2, AlertCircle,
  ToggleLeft, ToggleRight, ImagePlus, X, Save,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  listarAds, crearAd, actualizarAd, eliminarAd, subirImagenAd,
  type Ad, type AdInput, type AdVariant,
} from '@/lib/ads';

const ADMIN_EMAIL = 'guido-gentili@live.com.ar';
const VARIANT_LABEL: Record<AdVariant, string> = {
  leaderboard: 'Banner home',
  card:        'Card en avisos',
  sidebar:     'Sidebar detalle',
};
const PLAN_LABEL = { basico: 'Básico', estandar: 'Estándar', premium: 'Premium' };

const VACIO: AdInput = {
  variant: 'sidebar', titulo: '', subtitulo: '', imagen_url: '',
  href: '', cta: '', anunciante: '', plan: 'basico',
  activo: true, fecha_inicio: null, fecha_fin: null,
};

export default function AdminPublicidadPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [ads,      setAds]      = useState<Ad[]>([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState<Ad | 'nuevo' | null>(null);
  const [error,    setError]    = useState('');
  const [ok,       setOk]       = useState('');

  useEffect(() => {
    if (loading) return;
    if (!user || user.email !== ADMIN_EMAIL) { router.replace('/'); return; }
    listarAds().then(setAds).finally(() => setCargando(false));
  }, [user, loading, router]);

  async function toggleActivo(ad: Ad) {
    await actualizarAd(ad.id, { activo: !ad.activo });
    setAds((prev) => prev.map((a) => a.id === ad.id ? { ...a, activo: !a.activo } : a));
  }

  async function handleEliminar(id: string) {
    if (!confirm('¿Eliminás este anuncio?')) return;
    await eliminarAd(id);
    setAds((prev) => prev.filter((a) => a.id !== id));
    setOk('Anuncio eliminado.');
  }

  if (loading || cargando) return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Loader2 className="h-7 w-7 animate-spin text-brand-primary" />
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-black text-ink">Publicidad</h1>
          <p className="text-sm text-ink-muted">Gestión de anuncios activos en la app</p>
        </div>
        <button type="button" onClick={() => setEditando('nuevo')}
          className="inline-flex items-center gap-2 rounded-2xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white shadow-soft hover:opacity-90">
          <Plus className="h-4 w-4" /> Nuevo anuncio
        </button>
      </div>

      {ok && <p className="mb-4 flex items-center gap-2 rounded-2xl bg-good/10 p-3 text-sm font-bold text-good"><CheckCircle2 className="h-4 w-4" />{ok}</p>}
      {error && <p className="mb-4 flex items-center gap-2 rounded-2xl bg-bad/10 p-3 text-sm font-bold text-bad"><AlertCircle className="h-4 w-4" />{error}</p>}

      {/* Stats de negocios */}
      {ads.length > 0 && (() => {
        const negocios  = new Set(ads.map((a) => a.anunciante).filter(Boolean)).size;
        const activos   = ads.filter((a) => a.activo).length;
        const negActivos = new Set(ads.filter((a) => a.activo).map((a) => a.anunciante).filter(Boolean)).size;
        return (
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Negocios total',   val: negocios,   color: 'text-ink' },
              { label: 'Negocios activos', val: negActivos, color: 'text-good' },
              { label: 'Anuncios total',   val: ads.length, color: 'text-ink' },
              { label: 'Anuncios activos', val: activos,    color: 'text-good' },
            ].map(({ label, val, color }) => (
              <div key={label} className="card p-4 text-center">
                <p className={`font-display text-2xl font-black ${color}`}>{val}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{label}</p>
              </div>
            ))}
          </div>
        );
      })()}

      {ads.length === 0 ? (
        <div className="card p-10 text-center text-ink-muted">No hay anuncios. Creá el primero.</div>
      ) : (
        <div className="space-y-3">
          {ads.map((ad) => (
            <div key={ad.id} className="card flex items-center gap-4 p-4">
              {ad.imagen_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ad.imagen_url} alt={ad.titulo} className="h-14 w-14 rounded-xl object-cover" />
              ) : (
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand-cream text-brand-primary/40">
                  <ImagePlus className="h-6 w-6" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 text-[11px] font-bold text-brand-primary">
                    {VARIANT_LABEL[ad.variant]}
                  </span>
                  <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-bold text-ink-muted">
                    {PLAN_LABEL[ad.plan]}
                  </span>
                  {ad.fecha_fin && <span className="text-[11px] text-ink-muted">hasta {ad.fecha_fin}</span>}
                </div>
                <p className="mt-1 font-bold text-ink truncate">{ad.titulo}</p>
                {ad.subtitulo && <p className="text-xs text-ink-muted truncate">{ad.subtitulo}</p>}
                <p className="text-xs text-brand-primary truncate">{ad.href}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={() => toggleActivo(ad)} title={ad.activo ? 'Desactivar' : 'Activar'}
                  className={`rounded-xl p-2 transition ${ad.activo ? 'text-good hover:bg-good/10' : 'text-ink-muted hover:bg-black/5'}`}>
                  {ad.activo ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                </button>
                <button type="button" onClick={() => setEditando(ad)}
                  className="rounded-xl p-2 text-ink-muted hover:bg-brand-primary/10 hover:text-brand-primary">
                  <Pencil className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => handleEliminar(ad.id)}
                  className="rounded-xl p-2 text-ink-muted hover:bg-bad/10 hover:text-bad">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editando !== null && (
        <AdForm
          inicial={editando === 'nuevo' ? VACIO : {
            variant: editando.variant, titulo: editando.titulo,
            subtitulo: editando.subtitulo ?? '', imagen_url: editando.imagen_url ?? '',
            href: editando.href, cta: editando.cta ?? '',
            anunciante: editando.anunciante ?? '', plan: editando.plan,
            activo: editando.activo, fecha_inicio: editando.fecha_inicio,
            fecha_fin: editando.fecha_fin,
          }}
          editId={editando === 'nuevo' ? undefined : editando.id}
          onClose={() => setEditando(null)}
          onSaved={(ad) => {
            setAds((prev) => {
              const idx = prev.findIndex((a) => a.id === ad.id);
              return idx >= 0 ? prev.map((a) => a.id === ad.id ? ad : a) : [ad, ...prev];
            });
            setOk(editando === 'nuevo' ? 'Anuncio creado.' : 'Anuncio actualizado.');
            setEditando(null);
          }}
        />
      )}
    </div>
  );
}

/* ── Formulario ── */
function AdForm({
  inicial, editId, onClose, onSaved,
}: {
  inicial: AdInput;
  editId?: string;
  onClose: () => void;
  onSaved: (ad: Ad) => void;
}) {
  const [form,    setForm]    = useState<AdInput>(inicial);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');
  const [preview, setPreview] = useState<string>(inicial.imagen_url ?? '');
  const fileRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof AdInput>(k: K, v: AdInput[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setSaving(true);
    try {
      const url = await subirImagenAd(file);
      set('imagen_url', url);
    } finally { setSaving(false); }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.titulo.trim()) { setError('El nombre del negocio es obligatorio.'); return; }
    if (!form.href.trim())   { setError('El link es obligatorio.'); return; }
    setSaving(true); setError('');
    try {
      if (editId) {
        await actualizarAd(editId, form);
        onSaved({ id: editId, created_at: '', ...form } as Ad);
      } else {
        const { data, error: insErr } = await (await import('@/lib/supabase')).supabase
          .from('ads').insert(form).select().single();
        if (insErr) throw insErr;
        onSaved(data as Ad);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar.');
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-black text-ink">{editId ? 'Editar anuncio' : 'Nuevo anuncio'}</h2>
          <button type="button" onClick={onClose} className="rounded-xl p-1.5 hover:bg-black/5"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Imagen */}
          <div>
            <label className="label">Logo / imagen</label>
            <div className="relative mt-1 aspect-[3/1] w-full cursor-pointer overflow-hidden rounded-2xl bg-brand-cream"
              onClick={() => fileRef.current?.click()}>
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="" className="h-full w-full object-contain p-4" />
              ) : (
                <div className="flex h-full items-center justify-center gap-2 text-brand-primary/40">
                  <ImagePlus className="h-8 w-8" /> <span className="text-sm font-bold">Subir logo</span>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFoto} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Formato</label>
              <select className="field w-full" value={form.variant} onChange={(e) => set('variant', e.target.value as AdVariant)}>
                <option value="leaderboard">Banner home</option>
                <option value="card">Card en avisos</option>
                <option value="sidebar">Sidebar detalle</option>
              </select>
            </div>
            <div>
              <label className="label">Plan</label>
              <select className="field w-full" value={form.plan} onChange={(e) => set('plan', e.target.value as AdInput['plan'])}>
                <option value="basico">Básico</option>
                <option value="estandar">Estándar</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Nombre del negocio *</label>
            <input className="field w-full" placeholder="Veterinaria Central" value={form.titulo} onChange={(e) => set('titulo', e.target.value)} required />
          </div>

          <div>
            <label className="label">Tagline / descripción corta</label>
            <input className="field w-full" placeholder="Consultas, vacunas y cirugías" value={form.subtitulo ?? ''} onChange={(e) => set('subtitulo', e.target.value)} />
          </div>

          <div>
            <label className="label">Ciudad / zona (para el badge)</label>
            <input className="field w-full" placeholder="Bahía Blanca" value={form.anunciante ?? ''} onChange={(e) => set('anunciante', e.target.value)} />
          </div>

          <div>
            <label className="label">Link de destino * (web, Instagram, WhatsApp)</label>
            <input className="field w-full" placeholder="https://instagram.com/..." value={form.href} onChange={(e) => set('href', e.target.value)} required />
          </div>

          <div>
            <label className="label">Texto del botón CTA</label>
            <input className="field w-full" placeholder="Ver local · Pedir turno · Ver más" value={form.cta ?? ''} onChange={(e) => set('cta', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Fecha inicio</label>
              <input type="date" className="field w-full" value={form.fecha_inicio ?? ''} onChange={(e) => set('fecha_inicio', e.target.value || null)} />
            </div>
            <div>
              <label className="label">Fecha fin</label>
              <input type="date" className="field w-full" value={form.fecha_fin ?? ''} onChange={(e) => set('fecha_fin', e.target.value || null)} />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-black/8 p-3">
            <input type="checkbox" className="h-4 w-4 accent-brand-primary" checked={form.activo} onChange={(e) => set('activo', e.target.checked)} />
            <span className="text-sm font-bold text-ink">Activo (visible en la app)</span>
          </label>

          {error && <p className="flex items-center gap-2 rounded-2xl bg-bad/10 p-3 text-sm font-bold text-bad"><AlertCircle className="h-4 w-4" />{error}</p>}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 rounded-2xl border-2 border-black/10 py-3 text-sm font-bold text-ink-muted hover:border-bad/40 hover:text-bad">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-primary py-3 text-sm font-bold text-white disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Guardar</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

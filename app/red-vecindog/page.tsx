'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  Stethoscope, ShoppingBag, Scissors, Award, Footprints, Home,
  MapPin, Clock, Phone, CheckCircle2, X, Loader2, AlertCircle,
  ImagePlus, Star, ChevronRight, Building2, Map, Users, ArrowRight, Search, Plus,
  Heart, Pill,
} from 'lucide-react';
import { buscarCiudades } from '@/lib/ciudades';
import { useAuth } from '@/contexts/AuthContext';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { useLanguage } from '@/contexts/LanguageContext';

const ADMIN_EMAIL = 'guido-gentili@live.com.ar';

interface PrecioInfo {
  esPromo: boolean;
  cuposRestantes: number;
  precioActual: number;
  precioRegular: number;
  precioPromo: number;
}

export default function RedVecindogPage() {
  const { user } = useAuth();
  const { t }    = useLanguage();
  const isAdmin  = user?.email === ADMIN_EMAIL;

  const [modalAbierto,      setModalAbierto]      = useState(false);
  const [adminModalAbierto, setAdminModalAbierto] = useState(false);
  const [precioInfo, setPrecioInfo] = useState<PrecioInfo>({
    esPromo: true, cuposRestantes: 50, precioActual: 7990, precioRegular: 12900, precioPromo: 7990,
  });

  useEffect(() => {
    fetch('/api/pago/red-vecindog')
      .then((r) => r.json())
      .then((d) => setPrecioInfo(d))
      .catch(() => {});
  }, []);

  const CATEGORIAS = [
    { url: 'veterinaria',       slug: 'Veterinaria',       label: 'Veterinaria',       icon: Stethoscope, bg: 'bg-blue-50',   text: 'text-blue-600',   desc: t.rvnCatVetDesc },
    { url: 'pet-shop',          slug: 'Pet Shop',          label: 'Pet Shop',          icon: ShoppingBag, bg: 'bg-green-50',  text: 'text-green-600',  desc: t.rvnCatPetShopDesc },
    { url: 'peluqueria-canina', slug: 'Peluquería Canina', label: 'Peluquería Canina', icon: Scissors,    bg: 'bg-pink-50',   text: 'text-pink-600',   desc: t.rvnCatPeluDesc },
    { url: 'adiestrador',       slug: 'Adiestrador',       label: 'Adiestrador',       icon: Award,       bg: 'bg-purple-50', text: 'text-purple-600', desc: t.rvnCatAdiestrDesc },
    { url: 'paseador',          slug: 'Paseador',          label: 'Paseador',          icon: Footprints,  bg: 'bg-orange-50', text: 'text-orange-500', desc: t.rvnCatPaseadorDesc },
    { url: 'guarderia-hotel',   slug: 'Guardería / Hotel', label: 'Guardería / Hotel', icon: Home,        bg: 'bg-amber-50',  text: 'text-amber-600',  desc: t.rvnCatGuarderiaDesc },
    { url: 'refugio-rescate',   slug: 'Refugio / Rescate', label: 'Refugio / Rescate', icon: Heart,       bg: 'bg-red-50',    text: 'text-red-500',    desc: t.rvnCatRefugioDesc },
    { url: 'tienda-mascotas',   slug: 'Tienda de Mascotas',label: 'Tienda de Mascotas',icon: ShoppingBag, bg: 'bg-teal-50',   text: 'text-teal-600',   desc: t.rvnCatTiendaDesc },
    { url: 'farmacia-veterinaria', slug: 'Farmacia Veterinaria', label: 'Farmacia Veterinaria', icon: Pill, bg: 'bg-cyan-50', text: 'text-cyan-600', desc: t.rvnCatFarmaciaDesc },
  ];

  const BENEFICIOS = [
    { icon: Map,    titulo: t.rvnBenef1Title, desc: t.rvnBenef1Desc },
    { icon: Phone,  titulo: t.rvnBenef2Title, desc: t.rvnBenef2Desc },
    { icon: Clock,  titulo: t.rvnBenef3Title, desc: t.rvnBenef3Desc },
    { icon: MapPin, titulo: t.rvnBenef4Title, desc: t.rvnBenef4Desc },
  ];

  const BENEFITS_LIST = [
    t.rvnBenefit1, t.rvnBenefit2, t.rvnBenefit3,
    t.rvnBenefit4, t.rvnBenefit5, t.rvnBenefit6,
  ];

  return (
    <div className="py-10 md:py-14">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="mb-16 text-center md:mb-20">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
          <Star className="h-3.5 w-3.5" />
          {precioInfo.esPromo
            ? `${t.rvnPromoChip} · $${precioInfo.precioActual.toLocaleString('es-AR')} ARS / mes`
            : `${t.rvnNetworkChip} · $${precioInfo.precioActual.toLocaleString('es-AR')} ARS / mes`}
        </span>

        <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-ink md:text-5xl lg:text-6xl">
          Red Vecindog
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-muted">
          {t.rvnHeroSub}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setModalAbierto(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3.5 font-bold text-white shadow-soft transition hover:bg-amber-600 active:scale-[0.98]"
          >
            <Building2 className="h-5 w-5" /> {t.rvnRegisterBtn}
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setAdminModalAbierto(true)}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-dashed border-ink/20 bg-white px-6 py-3.5 font-bold text-ink shadow-soft transition hover:border-ink/40 active:scale-[0.98]"
            >
              <Plus className="h-5 w-5" /> {t.rvnAdminBtn}
            </button>
          )}
        </div>
      </section>

      {/* ── BENEFICIOS ───────────────────────────────────────────── */}
      <section className="mb-16 md:mb-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFICIOS.map(({ icon: Icon, titulo, desc }) => (
            <div key={titulo} className="card p-5">
              <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-amber-50">
                <Icon className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="font-display font-black text-ink">{titulo}</h3>
              <p className="mt-1 text-sm text-ink-muted leading-snug">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORÍAS ───────────────────────────────────────────── */}
      <section className="mb-16 md:mb-20">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-black text-ink md:text-4xl">
            {t.rvnCatTitle}
          </h2>
          <p className="mt-2 text-ink-muted">
            {t.rvnCatSub}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIAS.map(({ url, label, icon: Icon, bg, text, desc }) => (
            <Link
              key={url}
              href={`/red-vecindog/${url}`}
              className="card group flex items-start gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${bg}`}>
                <Icon className={`h-6 w-6 ${text}`} />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-black text-ink">{label}</h3>
                <p className="mt-0.5 text-sm text-ink-muted">{desc}</p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-amber-600 opacity-0 transition group-hover:opacity-100">
                  {t.rvnCatSeeMore} <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BANNER PROMOCIONAL ───────────────────────────────────── */}
      {precioInfo.esPromo && (
        <section className="mb-8">
          <div className="overflow-hidden rounded-3xl border-2 border-amber-400 bg-amber-50 p-6 md:p-8">
            <div className="flex items-start gap-4">
              <span className="text-3xl shrink-0">🎉</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <p className="text-xs font-extrabold uppercase tracking-widest text-amber-600">
                    {t.rvnPromoSubtitle}
                  </p>
                  <span className="rounded-full bg-amber-500 px-3 py-0.5 text-xs font-extrabold text-white">
                    {precioInfo.cuposRestantes} {precioInfo.cuposRestantes !== 1 ? t.rvnCupos : t.rvnCupo} {precioInfo.cuposRestantes !== 1 ? t.rvnDisponibles : t.rvnDisponible}
                  </span>
                </div>
                <h3 className="font-display text-xl font-black text-ink md:text-2xl">
                  {t.rvnPromoBannerTitle}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {t.rvnPromoBannerDesc}
                </p>
                <p className="mt-3 flex items-baseline gap-2 flex-wrap">
                  <span className="font-display text-3xl font-black text-amber-600">
                    ${precioInfo.precioPromo.toLocaleString('es-AR')}
                  </span>
                  <span className="text-sm font-semibold text-ink-muted">{t.rvnPromoMonths}</span>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                    {t.rvnPromoLuego} ${precioInfo.precioRegular.toLocaleString('es-AR')}/mes
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── PRECIO + BENEFICIOS ──────────────────────────────────── */}
      <section className="mb-16 md:mb-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-amber-600 p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:gap-16">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                <Users className="h-3.5 w-3.5" /> {t.rvnPricingChip}
              </span>
              <h2 className="mt-4 font-display text-3xl font-black md:text-4xl">
                {t.rvnPricingTitle}
              </h2>
              <div className="mt-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-extrabold mb-3">
                  🎁 Primer mes GRATIS
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-5xl font-black">
                    ${precioInfo.precioActual.toLocaleString('es-AR')}
                  </span>
                  <div>
                    {precioInfo.esPromo ? (
                      <>
                        <span className="block text-white/70 text-sm">a partir del 2.° mes</span>
                        <span className="block text-white/50 text-xs line-through">
                          ${precioInfo.precioRegular.toLocaleString('es-AR')}{t.rvnPricingPromoStrike}
                        </span>
                      </>
                    ) : (
                      <span className="block text-white/70 text-sm">a partir del 2.° mes</span>
                    )}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-white/70 leading-relaxed">
                {t.rvnPricingSub}
              </p>
              <button
                type="button"
                onClick={() => setModalAbierto(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-bold text-amber-600 transition hover:bg-amber-50 active:scale-[0.98]"
              >
                {t.rvnJoinBtn} <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <ul className="space-y-4">
              {BENEFITS_LIST.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-white" />
                  <span className="text-white/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────── */}
      <section className="text-center">
        <div className="card mx-auto max-w-lg p-8 md:p-10">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
            <Building2 className="h-7 w-7" />
          </span>
          <h2 className="mt-4 font-display text-2xl font-black text-ink md:text-3xl">
            {t.rvnCtaTitle}
          </h2>
          <p className="mt-2 text-ink-muted">
            {t.rvnCtaSub}
          </p>
          <button
            type="button"
            onClick={() => setModalAbierto(true)}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-6 py-3.5 font-bold text-white transition hover:bg-amber-600 active:scale-[0.98]"
          >
            <Building2 className="h-5 w-5" /> {t.rvnRegisterBtn}
          </button>
        </div>
      </section>

      {modalAbierto      && <RegistroModal      onClose={() => setModalAbierto(false)}      precioInfo={precioInfo} />}
      {adminModalAbierto && <AdminComercioModal onClose={() => setAdminModalAbierto(false)} />}
    </div>
  );
}

/* ── Modal admin: agregar comercio (admin-only, stays in Spanish) ── */

function AdminComercioModal({ onClose }: { onClose: () => void }) {
  const fileRef  = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [nombre,          setNombre]          = useState('');
  const [categoria,       setCategoria]       = useState('');
  const [telefono,        setTelefono]        = useState('');
  const [direccion,       setDireccion]       = useState('');
  const [localidad,       setLocalidad]       = useState('');
  const [localidadQuery,  setLocalidadQuery]  = useState('');
  const [localidadLat,    setLocalidadLat]    = useState<number | null>(null);
  const [localidadLng,    setLocalidadLng]    = useState<number | null>(null);
  const [adLat,           setAdLat]           = useState<number | null>(null);
  const [adLng,           setAdLng]           = useState<number | null>(null);
  const [showCiudades,    setShowCiudades]    = useState(false);
  const [horarioApertura, setHorarioApertura] = useState('');
  const [horarioCierre,   setHorarioCierre]   = useState('');
  const [diasAtencion,    setDiasAtencion]    = useState('');
  const [descripcion,     setDescripcion]     = useState('');
  const [link,            setLink]            = useState('');
  const [emailDuenio,     setEmailDuenio]     = useState(ADMIN_EMAIL);
  const [fotoFile,        setFotoFile]        = useState<File | null>(null);
  const [preview,         setPreview]         = useState('');
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState('');
  const [exito,           setExito]           = useState(false);

  const CATEGORIAS_SLUGS = [
    { slug: 'Veterinaria',         label: 'Veterinaria' },
    { slug: 'Pet Shop',            label: 'Pet Shop' },
    { slug: 'Peluquería Canina',   label: 'Peluquería Canina' },
    { slug: 'Adiestrador',         label: 'Adiestrador' },
    { slug: 'Paseador',            label: 'Paseador' },
    { slug: 'Guardería / Hotel',   label: 'Guardería / Hotel' },
    { slug: 'Refugio / Rescate',   label: 'Refugio / Rescate' },
    { slug: 'Tienda de Mascotas',  label: 'Tienda de Mascotas' },
    { slug: 'Farmacia Veterinaria',label: 'Farmacia Veterinaria' },
  ];

  useEffect(() => { modalRef.current?.scrollTo({ top: 0 }); }, []);

  function onFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('La imagen debe pesar menos de 5 MB.'); return; }
    setFotoFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim())    { setError('Ingresá el nombre del negocio.'); return; }
    if (!categoria)        { setError('Seleccioná una categoría.'); return; }
    if (!telefono.trim())  { setError('Ingresá un teléfono de contacto.'); return; }
    if (!direccion.trim()) { setError('Ingresá la dirección del negocio.'); return; }

    setError(''); setLoading(true);

    try {
      let imagen_url = '';
      if (fotoFile) {
        const { subirImagenAd } = await import('@/lib/ads');
        imagen_url = await subirImagenAd(fotoFile);
      }

      const { crearAd } = await import('@/lib/ads');
      await crearAd({
        variant:            'comercio',
        titulo:             nombre.trim(),
        subtitulo:          descripcion.trim() || null,
        imagen_url:         imagen_url || null,
        imagen_logo_url:    null,
        href:               link.trim() || '',
        cta:                null,
        anunciante:         emailDuenio.trim() || ADMIN_EMAIL,
        plan:               'comercio',
        activo:             true,
        fecha_inicio:       new Date().toISOString().slice(0, 10),
        fecha_fin:          null,
        lat:                adLat ?? localidadLat,
        lng:                adLng ?? localidadLng,
        telefono_comercio:  telefono.trim(),
        horario_apertura:   horarioApertura || null,
        horario_cierre:     horarioCierre || null,
        dias_atencion:      diasAtencion || null,
        direccion_comercio: `${direccion.trim()}${localidad ? `, ${localidad}` : ''}`,
        categoria_local:    categoria,
      });

      setExito(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar el comercio.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-6 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl"
        style={{ maxHeight: '90vh' }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl border-b border-black/5 bg-white px-6 py-4">
          <div>
            <h2 className="font-display text-xl font-black text-ink">Agregar comercio</h2>
            <p className="text-sm text-ink-muted">Solo visible para vos · Red Vecindog</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-1.5 hover:bg-black/5">
            <X className="h-5 w-5 text-ink-muted" />
          </button>
        </div>

        {exito ? (
          <div className="flex flex-col items-center gap-4 p-10 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-good/10 text-good">
              <CheckCircle2 className="h-8 w-8" />
            </span>
            <h3 className="font-display text-2xl font-black text-ink">¡Comercio agregado!</h3>
            <p className="text-ink-muted">Ya aparece en la Red Vecindog y en el mapa.</p>
            <button type="button" onClick={onClose} className="btn-primary mt-2">Cerrar</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink-muted">
                Foto del negocio <span className="font-normal normal-case text-ink-muted/60">(recomendado)</span>
              </label>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="flex w-full items-center gap-4 overflow-hidden rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/60 px-5 py-4 transition hover:border-amber-500 hover:bg-amber-50">
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                    <ImagePlus className="h-7 w-7 text-amber-500" />
                  </div>
                )}
                <div className="text-left">
                  <p className="font-bold text-ink">{preview ? 'Cambiar foto' : 'Subir foto del local'}</p>
                  <p className="text-xs text-ink-muted">PNG, JPG · Máx. 5 MB</p>
                </div>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFoto} />
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">Nombre del negocio <span className="text-bad">*</span></label>
                <input className="field w-full" placeholder="Veterinaria Central" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">Categoría <span className="text-bad">*</span></label>
                <select className="field w-full" value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
                  <option value="">Seleccioná una categoría</option>
                  {CATEGORIAS_SLUGS.map(({ slug, label }) => (
                    <option key={slug} value={slug}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">Descripción breve</label>
              <input className="field w-full" placeholder="Especialistas en razas pequeñas · Vacunación al día" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            </div>

            <div className="space-y-3 rounded-2xl bg-brand-cream p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">Ubicación</p>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-muted">Dirección <span className="text-bad">*</span></label>
                <AddressAutocomplete value={direccion} onChange={setDireccion}
                  onSelectCoords={(lat, lng) => { setAdLat(lat); setAdLng(lng); }}
                  onClearCoords={() => { setAdLat(null); setAdLng(null); }}
                  placeholder="Av. San Martín 1234" ciudad={localidad || null} required />
              </div>
              <div className="relative">
                <label className="mb-1 block text-xs font-semibold text-ink-muted">Localidad / Ciudad</label>
                {localidad ? (
                  <div className="flex items-center gap-2 rounded-2xl border-2 border-teal-400 bg-teal-50 px-3 py-2.5">
                    <MapPin className="h-4 w-4 shrink-0 text-teal-600" />
                    <span className="flex-1 text-sm font-semibold text-teal-700">{localidad}</span>
                    <button type="button" onClick={() => { setLocalidad(''); setLocalidadQuery(''); setLocalidadLat(null); setLocalidadLng(null); }} className="rounded-lg p-0.5 hover:bg-teal-100">
                      <X className="h-3.5 w-3.5 text-teal-600" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                    <input className="field w-full pl-9" placeholder="Ej: Bahía Blanca" value={localidadQuery}
                      onChange={(e) => { setLocalidadQuery(e.target.value); setShowCiudades(true); }}
                      onFocus={() => setShowCiudades(true)} autoComplete="off" />
                    {showCiudades && localidadQuery.trim().length > 0 && (() => {
                      const resultados = buscarCiudades(localidadQuery).slice(0, 8);
                      return resultados.length > 0 ? (
                        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-y-auto rounded-2xl bg-white shadow-lg ring-1 ring-black/10">
                          {resultados.map((c) => (
                            <button key={c.nombre} type="button"
                              onMouseDown={(e) => { e.preventDefault(); setLocalidad(c.nombre); setLocalidadQuery(''); setLocalidadLat(c.lat); setLocalidadLng(c.lng); setShowCiudades(false); }}
                              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-brand-cream">
                              <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-primary" />
                              <span className="font-semibold text-ink">{c.nombre}</span>
                              <span className="ml-auto text-xs text-ink-muted">{c.provincia}</span>
                            </button>
                          ))}
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 rounded-2xl bg-brand-cream p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">Horarios de atención</p>
              <div>
                <label className="mb-2 block text-xs font-semibold text-ink-muted">Días</label>
                <div className="flex gap-2">
                  {(['Lunes a viernes', 'Lunes a sábado', 'Todos los días'] as const).map((op) => (
                    <button key={op} type="button" onClick={() => setDiasAtencion(diasAtencion === op ? '' : op)}
                      className={`flex-1 rounded-2xl border-2 py-2 text-xs font-bold transition ${diasAtencion === op ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-black/10 text-ink-muted hover:border-amber-200'}`}>
                      {op}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink-muted">Apertura</label>
                  <input type="time" className="field w-full" value={horarioApertura} onChange={(e) => setHorarioApertura(e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink-muted">Cierre</label>
                  <input type="time" className="field w-full" value={horarioCierre} onChange={(e) => setHorarioCierre(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">Teléfono <span className="text-bad">*</span></label>
                <input type="tel" className="field w-full" placeholder="+54 9 291 405-0210" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">Link del negocio</label>
                <input className="field w-full" placeholder="https://instagram.com/tunegocio" value={link}
                  onChange={(e) => setLink(e.target.value)}
                  onBlur={() => { const v = link.trim(); if (v && !v.includes('://')) setLink(`https://${v}`); }} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">Email del dueño (para Mi comercio)</label>
                <input type="email" className="field w-full" placeholder="duenio@email.com" value={emailDuenio} onChange={(e) => setEmailDuenio(e.target.value)} />
              </div>
            </div>

            {error && (
              <p className="flex items-center gap-2 rounded-2xl bg-bad/10 p-3 text-sm font-bold text-bad">
                <AlertCircle className="h-4 w-4 shrink-0" /> {error}
              </p>
            )}

            <button type="submit" disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ink px-6 py-3.5 text-base font-bold text-white transition hover:bg-ink/80 disabled:opacity-60">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><CheckCircle2 className="h-5 w-5" /> Guardar comercio</>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ── Modal de registro ──────────────────────────────────────────── */

function RegistroModal({ onClose, precioInfo }: { onClose: () => void; precioInfo: PrecioInfo }) {
  const { t }    = useLanguage();
  const fileRef  = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [nombre,          setNombre]          = useState('');
  const [categoria,       setCategoria]       = useState('');
  const [telefono,        setTelefono]        = useState('');
  const [direccion,       setDireccion]       = useState('');
  const [localidad,       setLocalidad]       = useState('');
  const [localidadQuery,  setLocalidadQuery]  = useState('');
  const [localidadLat,    setLocalidadLat]    = useState<number | null>(null);
  const [localidadLng,    setLocalidadLng]    = useState<number | null>(null);
  const [adLat,           setAdLat]           = useState<number | null>(null);
  const [adLng,           setAdLng]           = useState<number | null>(null);
  const [showCiudades,    setShowCiudades]    = useState(false);
  const [horarioApertura, setHorarioApertura] = useState('');
  const [horarioCierre,   setHorarioCierre]   = useState('');
  const [diasAtencion,    setDiasAtencion]    = useState('');
  const [descripcion,     setDescripcion]     = useState('');
  const [link,            setLink]            = useState('');
  const [email,           setEmail]           = useState('');
  const [fotoFile,        setFotoFile]        = useState<File | null>(null);
  const [preview,         setPreview]         = useState('');
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState('');

  const CATEGORIAS_SLUGS = [
    { slug: 'Veterinaria',         label: 'Veterinaria' },
    { slug: 'Pet Shop',            label: 'Pet Shop' },
    { slug: 'Peluquería Canina',   label: 'Peluquería Canina' },
    { slug: 'Adiestrador',         label: 'Adiestrador' },
    { slug: 'Paseador',            label: 'Paseador' },
    { slug: 'Guardería / Hotel',   label: 'Guardería / Hotel' },
    { slug: 'Refugio / Rescate',   label: 'Refugio / Rescate' },
    { slug: 'Tienda de Mascotas',  label: 'Tienda de Mascotas' },
    { slug: 'Farmacia Veterinaria',label: 'Farmacia Veterinaria' },
  ];

  useEffect(() => { modalRef.current?.scrollTo({ top: 0 }); }, []);

  function onFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError(t.rvnErrPhoto); return; }
    setFotoFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim())    { setError(t.rvnErrName); return; }
    if (!categoria)        { setError(t.rvnErrCat); return; }
    if (!localidad.trim()) { setError(t.rvnErrCity); return; }
    if (!telefono.trim())  { setError(t.rvnErrPhone); return; }
    if (!direccion.trim()) { setError(t.rvnErrAddr); return; }
    if (!email.trim())     { setError(t.rvnErrEmail); return; }
    const digitos = telefono.replace(/\D/g, '');
    if (digitos.length < 10) { setError(t.rvnErrPhoneDigits); return; }

    setError(''); setLoading(true);

    try {
      let imagen_url = '';
      if (fotoFile) {
        const { subirImagenAd } = await import('@/lib/ads');
        imagen_url = await subirImagenAd(fotoFile);
      }

      const res = await fetch('/api/trial/red-vecindog', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre, categoria, telefono, direccion, localidad,
          lat: adLat ?? localidadLat, lng: adLng ?? localidadLng,
          horario_apertura: horarioApertura,
          horario_cierre:   horarioCierre,
          dias_atencion:    diasAtencion,
          descripcion, link, email, imagen_url,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        window.location.href = `/red-vecindog/pago-exitoso?ads=${data.ad_id}&trial=1`;
      } else {
        setError(data.error ?? t.rvnErrPayment);
        setLoading(false);
      }
    } catch {
      setError(t.rvnErrConnection);
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-6 backdrop-blur-sm">
      <div ref={modalRef} className="relative w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl" style={{ maxHeight: '90vh' }}>

        {/* Header sticky */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl border-b border-black/5 bg-white px-6 py-4">
          <div>
            <h2 className="font-display text-xl font-black text-ink">{t.rvnFormTitle}</h2>
            <p className="text-sm text-ink-muted">
              Red Vecindog ·{' '}
              {precioInfo.esPromo ? (
                <>
                  <span className="font-bold text-amber-600">${precioInfo.precioActual.toLocaleString('es-AR')} ARS/mes</span>
                  <span className="ml-1 line-through text-ink-muted/50">${precioInfo.precioRegular.toLocaleString('es-AR')}</span>
                </>
              ) : (
                <span className="font-bold">${precioInfo.precioActual.toLocaleString('es-AR')} ARS/mes</span>
              )}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-1.5 hover:bg-black/5">
            <X className="h-5 w-5 text-ink-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">

          {/* Foto del negocio */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink-muted">
              {t.rvnFormPhotoLabel}
              <span className="ml-1 font-normal normal-case text-ink-muted/60">({t.commonOptional})</span>
            </label>
            <button type="button" onClick={() => fileRef.current?.click()}
              className="flex w-full items-center gap-4 overflow-hidden rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/60 px-5 py-4 transition hover:border-amber-500 hover:bg-amber-50">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                  <ImagePlus className="h-7 w-7 text-amber-500" />
                </div>
              )}
              <div className="text-left">
                <p className="font-bold text-ink">{preview ? t.rvnFormPhotoChange : t.rvnFormPhotoBtn}</p>
                <p className="text-xs text-ink-muted">{t.rvnFormPhotoSize}</p>
              </div>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFoto} />
          </div>

          {/* Nombre y categoría */}
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
                {t.rvnFormNameLabel} <span className="text-bad">*</span>
              </label>
              <input className="field w-full" placeholder="Veterinaria Central" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
                {t.rvnFormCatLabel} <span className="text-bad">*</span>
              </label>
              <select className="field w-full" value={categoria} onChange={(e) => setCategoria(e.target.value)} required>
                <option value="">{t.rvnFormCatSelect}</option>
                {CATEGORIAS_SLUGS.map(({ slug, label }) => (
                  <option key={slug} value={slug}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
              {t.rvnFormDescLabel}
            </label>
            <input className="field w-full" placeholder="Especialistas en razas pequeñas · Vacunación al día" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          </div>

          {/* Ubicación */}
          <div className="space-y-3 rounded-2xl bg-brand-cream p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">{t.rvnFormLocLabel}</p>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-muted">
                {t.rvnFormAddrLabel} <span className="text-bad">*</span>
              </label>
              <AddressAutocomplete value={direccion} onChange={setDireccion}
                onSelectCoords={(lat, lng) => { setAdLat(lat); setAdLng(lng); }}
                onClearCoords={() => { setAdLat(null); setAdLng(null); }}
                placeholder="Av. San Martín 1234" ciudad={localidad || null} required />
            </div>
            <div className="relative">
              <label className="mb-1 block text-xs font-semibold text-ink-muted">
                {t.rvnFormCityLabel} <span className="text-bad">*</span>
              </label>
              {localidad ? (
                <div className="flex items-center gap-2 rounded-2xl border-2 border-teal-400 bg-teal-50 px-3 py-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-teal-600" />
                  <span className="flex-1 text-sm font-semibold text-teal-700">{localidad}</span>
                  <button type="button" onClick={() => { setLocalidad(''); setLocalidadQuery(''); setLocalidadLat(null); setLocalidadLng(null); }} className="rounded-lg p-0.5 hover:bg-teal-100">
                    <X className="h-3.5 w-3.5 text-teal-600" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input className="field w-full pl-9" placeholder="Ej: Bahía Blanca" value={localidadQuery}
                    onChange={(e) => { setLocalidadQuery(e.target.value); setShowCiudades(true); }}
                    onFocus={() => setShowCiudades(true)} autoComplete="off" />
                  {showCiudades && localidadQuery.trim().length > 0 && (() => {
                    const resultados = buscarCiudades(localidadQuery).slice(0, 8);
                    return resultados.length > 0 ? (
                      <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-y-auto rounded-2xl bg-white shadow-lg ring-1 ring-black/10">
                        {resultados.map((c) => (
                          <button key={c.nombre} type="button"
                            onMouseDown={(e) => { e.preventDefault(); setLocalidad(c.nombre); setLocalidadQuery(''); setLocalidadLat(c.lat); setLocalidadLng(c.lng); setShowCiudades(false); }}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-brand-cream">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-primary" />
                            <span className="font-semibold text-ink">{c.nombre}</span>
                            <span className="ml-auto text-xs text-ink-muted">{c.provincia}</span>
                          </button>
                        ))}
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </div>
          </div>

          {/* Horarios */}
          <div className="space-y-3 rounded-2xl bg-brand-cream p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">{t.rvnFormHoursLabel}</p>
            <div>
              <label className="mb-2 block text-xs font-semibold text-ink-muted">{t.rvnFormDaysLabel}</label>
              <div className="flex gap-2">
                {(['Lunes a viernes', 'Lunes a sábado', 'Todos los días'] as const).map((op) => (
                  <button key={op} type="button" onClick={() => setDiasAtencion(diasAtencion === op ? '' : op)}
                    className={`flex-1 rounded-2xl border-2 py-2 text-xs font-bold transition ${diasAtencion === op ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-black/10 text-ink-muted hover:border-amber-200'}`}>
                    {op}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-muted">{t.rvnFormOpen}</label>
                <input type="time" className="field w-full" value={horarioApertura} onChange={(e) => setHorarioApertura(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-muted">{t.rvnFormClose}</label>
                <input type="time" className="field w-full" value={horarioCierre} onChange={(e) => setHorarioCierre(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Contacto y link */}
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
                {t.rvnFormPhoneLabel} <span className="text-bad">*</span>
              </label>
              <input type="tel" className="field w-full" placeholder="+54 9 291 405-0210" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
                {t.rvnFormLinkLabel}
              </label>
              <input className="field w-full" placeholder="https://instagram.com/tunegocio" value={link}
                onChange={(e) => setLink(e.target.value)}
                onBlur={() => { const v = link.trim(); if (v && !v.includes('://')) setLink(`https://${v}`); }} />
              <p className="mt-1 text-xs text-ink-muted">{t.rvnFormLinkHint}</p>
            </div>
          </div>

          {/* Email */}
          <div className="rounded-2xl bg-brand-cream p-4">
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
              {t.rvnFormEmailLabel} <span className="text-bad">*</span>
            </label>
            <input type="email" className="field w-full" placeholder="info@tunegocio.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <p className="mt-1.5 text-[11px] text-ink-muted">{t.rvnFormEmailHint}</p>
          </div>

          {error && (
            <p className="flex items-center gap-2 rounded-2xl bg-bad/10 p-3 text-sm font-bold text-bad">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </p>
          )}

          <p className="text-center text-xs text-ink-muted">
            Sin costo el primer mes · después se renueva mensualmente
          </p>

          <button type="submit" disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-6 py-3.5 text-base font-bold text-white transition hover:bg-amber-600 disabled:opacity-60">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><CheckCircle2 className="h-5 w-5" /> Activar gratis — primer mes sin costo</>}
          </button>
        </form>
      </div>
    </div>
  );
}

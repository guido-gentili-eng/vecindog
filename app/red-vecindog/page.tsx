'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Stethoscope, ShoppingBag, Scissors, Award, Footprints, Home,
  MapPin, Clock, Phone, CheckCircle2, X, Loader2, AlertCircle,
  ImagePlus, Star, ChevronRight, Building2, Map, Users,
} from 'lucide-react';

/* ── Datos ─────────────────────────────────────────────────────── */

const CATEGORIAS = [
  { slug: 'Veterinaria',        label: 'Veterinaria',        icon: Stethoscope, bg: 'bg-blue-50',   text: 'text-blue-600',   desc: 'Atención médica, vacunas y urgencias' },
  { slug: 'Pet Shop',           label: 'Pet Shop',           icon: ShoppingBag, bg: 'bg-green-50',  text: 'text-green-600',  desc: 'Alimentos, accesorios y juguetes' },
  { slug: 'Peluquería Canina',  label: 'Peluquería Canina',  icon: Scissors,    bg: 'bg-pink-50',   text: 'text-pink-600',   desc: 'Baño, corte y estética canina' },
  { slug: 'Adiestrador',        label: 'Adiestrador',        icon: Award,       bg: 'bg-purple-50', text: 'text-purple-600', desc: 'Educación, obediencia y conducta' },
  { slug: 'Paseador',           label: 'Paseador',           icon: Footprints,  bg: 'bg-orange-50', text: 'text-orange-500', desc: 'Paseos diarios y actividad física' },
  { slug: 'Guardería / Hotel',  label: 'Guardería / Hotel',  icon: Home,        bg: 'bg-amber-50',  text: 'text-amber-600',  desc: 'Cuidado diurno y hospedaje canino' },
];

const BENEFICIOS = [
  { icon: Map,     titulo: 'En el mapa',           desc: 'Tu negocio aparece directamente donde los vecinos buscan perros perdidos.' },
  { icon: Phone,   titulo: 'Teléfono visible',     desc: 'Los usuarios ven tu número con un click desde el mapa.' },
  { icon: Clock,   titulo: 'Horario de atención',  desc: 'Informá tus días y horarios para que lleguen cuando abrís.' },
  { icon: MapPin,  titulo: 'Dirección exacta',     desc: 'Tu dirección y localidad visibles para toda la comunidad.' },
];

/* ── Página ─────────────────────────────────────────────────────── */

export default function RedVecindogPage() {
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <div className="py-10 md:py-14">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="mb-16 text-center md:mb-20">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
          <Star className="h-3.5 w-3.5" /> Red de comercios adheridos · $2.500 ARS / mes
        </span>

        <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-ink md:text-5xl lg:text-6xl">
          Red Vecindog
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-muted">
          Sumá tu negocio y aparecé en el mapa donde los vecinos buscan a sus perros —
          con tu teléfono, horario y dirección siempre visibles.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setModalAbierto(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-6 py-3.5 font-bold text-white shadow-soft transition hover:bg-amber-600 active:scale-[0.98]"
          >
            <Building2 className="h-5 w-5" /> Registrar mi negocio
          </button>
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

      {/* ── 6 CATEGORÍAS ─────────────────────────────────────────── */}
      <section className="mb-16 md:mb-20">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-black text-ink md:text-4xl">
            6 rubros en la red
          </h2>
          <p className="mt-2 text-ink-muted">
            Encontrá tu categoría y mostrá tu negocio donde importa.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIAS.map(({ label, icon: Icon, bg, text, desc }) => (
            <div key={label} className="card flex items-start gap-4 p-5 transition hover:shadow-card">
              <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${bg}`}>
                <Icon className={`h-6 w-6 ${text}`} />
              </div>
              <div>
                <h3 className="font-display font-black text-ink">{label}</h3>
                <p className="mt-0.5 text-sm text-ink-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRECIO + BENEFICIOS ──────────────────────────────────── */}
      <section className="mb-16 md:mb-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 to-amber-600 p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:gap-16">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
                <Users className="h-3.5 w-3.5" /> Sin contratos · Sin letras chicas
              </span>
              <h2 className="mt-4 font-display text-3xl font-black md:text-4xl">
                Una sola tarifa, sin sorpresas
              </h2>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-display text-5xl font-black">$2.500</span>
                <span className="text-white/70">ARS / mes</span>
              </div>
              <p className="mt-3 text-white/70 leading-relaxed">
                Mes a mes. Podés cancelar cuando quieras.
              </p>
              <button
                type="button"
                onClick={() => setModalAbierto(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 font-bold text-amber-600 transition hover:bg-amber-50 active:scale-[0.98]"
              >
                Unirme a la red <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <ul className="space-y-4">
              {[
                'Aparecés en el mapa donde los vecinos buscan perros',
                'Teléfono, dirección y horario siempre visibles',
                'Clasificado en tu rubro (vet, petshop, peluquería…)',
                'Audiencia 100% dueños de mascotas activos',
                'Sin bots — usuarios reales de tu zona',
                'Activación en menos de 24 horas',
              ].map((item) => (
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
            ¿Listo para sumarte?
          </h2>
          <p className="mt-2 text-ink-muted">
            Completá el formulario, pagá y tu negocio aparece en el mapa en menos de 24 horas.
          </p>
          <button
            type="button"
            onClick={() => setModalAbierto(true)}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-6 py-3.5 font-bold text-white transition hover:bg-amber-600 active:scale-[0.98]"
          >
            <Building2 className="h-5 w-5" /> Registrar mi negocio
          </button>
        </div>
      </section>

      {modalAbierto && <RegistroModal onClose={() => setModalAbierto(false)} />}
    </div>
  );
}

/* ── Modal de registro ──────────────────────────────────────────── */

function RegistroModal({ onClose }: { onClose: () => void }) {
  const fileRef  = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [nombre,          setNombre]          = useState('');
  const [categoria,       setCategoria]       = useState('');
  const [telefono,        setTelefono]        = useState('');
  const [direccion,       setDireccion]       = useState('');
  const [localidad,       setLocalidad]       = useState('');
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

  useEffect(() => {
    modalRef.current?.scrollTo({ top: 0 });
  }, []);

  function onFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('La imagen debe pesar menos de 5 MB.'); return; }
    setFotoFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim())    { setError('Ingresá el nombre de tu negocio.'); return; }
    if (!categoria)        { setError('Seleccioná una categoría.'); return; }
    if (!telefono.trim())  { setError('Ingresá un teléfono de contacto.'); return; }
    if (!direccion.trim()) { setError('Ingresá la dirección de tu negocio.'); return; }
    if (!email.trim())     { setError('Ingresá tu email.'); return; }
    const digitos = telefono.replace(/\D/g, '');
    if (digitos.length < 8) { setError('El teléfono debe tener al menos 8 dígitos.'); return; }

    setError(''); setLoading(true);

    try {
      let imagen_url = '';
      if (fotoFile) {
        const { subirImagenAd } = await import('@/lib/ads');
        imagen_url = await subirImagenAd(fotoFile);
      }

      const res = await fetch('/api/pago/red-vecindog', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre, categoria, telefono, direccion, localidad,
          horario_apertura: horarioApertura,
          horario_cierre:   horarioCierre,
          dias_atencion:    diasAtencion,
          descripcion, link, email, imagen_url,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error ?? 'Error al procesar el pago.');
        setLoading(false);
      }
    } catch {
      setError('Error de conexión. Intentá de nuevo.');
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
        {/* Header sticky */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl border-b border-black/5 bg-white px-6 py-4">
          <div>
            <h2 className="font-display text-xl font-black text-ink">Registrar mi negocio</h2>
            <p className="text-sm text-ink-muted">Red Vecindog · $2.500 ARS/mes</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-1.5 hover:bg-black/5">
            <X className="h-5 w-5 text-ink-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">

          {/* Foto del negocio */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink-muted">
              Foto del negocio
              <span className="ml-1 font-normal normal-case text-ink-muted/60">(recomendado)</span>
            </label>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center gap-4 overflow-hidden rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/60 px-5 py-4 transition hover:border-amber-500 hover:bg-amber-50"
            >
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

          {/* Nombre y categoría */}
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
                Nombre del negocio <span className="text-bad">*</span>
              </label>
              <input
                className="field w-full"
                placeholder="Veterinaria Central"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
                Categoría <span className="text-bad">*</span>
              </label>
              <select
                className="field w-full"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
              >
                <option value="">Seleccioná una categoría</option>
                {CATEGORIAS.map(({ slug, label }) => (
                  <option key={slug} value={slug}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
              Descripción breve
            </label>
            <input
              className="field w-full"
              placeholder="Especialistas en razas pequeñas · Vacunación al día"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>

          {/* Ubicación */}
          <div className="space-y-3 rounded-2xl bg-brand-cream p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">Ubicación</p>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-muted">
                Dirección <span className="text-bad">*</span>
              </label>
              <input
                className="field w-full"
                placeholder="Av. San Martín 1234"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-muted">Localidad / Ciudad</label>
              <input
                className="field w-full"
                placeholder="Bahía Blanca, Buenos Aires"
                value={localidad}
                onChange={(e) => setLocalidad(e.target.value)}
              />
            </div>
          </div>

          {/* Horarios */}
          <div className="space-y-3 rounded-2xl bg-brand-cream p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">Horarios de atención</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-muted">Apertura</label>
                <input
                  type="time"
                  className="field w-full"
                  value={horarioApertura}
                  onChange={(e) => setHorarioApertura(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-muted">Cierre</label>
                <input
                  type="time"
                  className="field w-full"
                  value={horarioCierre}
                  onChange={(e) => setHorarioCierre(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-muted">Días de atención</label>
              <input
                className="field w-full"
                placeholder="Lunes a Viernes · Sábados 9–14 hs"
                value={diasAtencion}
                onChange={(e) => setDiasAtencion(e.target.value)}
              />
            </div>
          </div>

          {/* Contacto y link */}
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
                Teléfono <span className="text-bad">*</span>
              </label>
              <input
                type="tel"
                className="field w-full"
                placeholder="+54 9 291 405-0210"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
                Link del negocio
              </label>
              <input
                className="field w-full"
                placeholder="https://instagram.com/tunegocio"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                onBlur={() => {
                  const v = link.trim();
                  if (v && !v.includes('://')) setLink(`https://${v}`);
                }}
              />
              <p className="mt-1 text-xs text-ink-muted">Web, Instagram, WhatsApp — adonde van los clicks</p>
            </div>
          </div>

          {/* Email */}
          <div className="rounded-2xl bg-brand-cream p-4">
            <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
              Tu email <span className="text-bad">*</span>
            </label>
            <input
              type="email"
              className="field w-full"
              placeholder="info@tunegocio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="mt-1.5 text-[11px] text-ink-muted">
              Para la confirmación de pago y datos de tu membresía.
            </p>
          </div>

          {error && (
            <p className="flex items-center gap-2 rounded-2xl bg-bad/10 p-3 text-sm font-bold text-bad">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </p>
          )}

          <p className="text-center text-xs text-ink-muted">
            Serás redirigido a Mercado Pago para abonar $2.500 ARS.
            Tu negocio se activa en menos de 24 horas.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-6 py-3.5 text-base font-bold text-white transition hover:bg-amber-600 disabled:opacity-60"
          >
            {loading
              ? <Loader2 className="h-5 w-5 animate-spin" />
              : <><CheckCircle2 className="h-5 w-5" /> Ir a pagar con Mercado Pago</>}
          </button>
        </form>
      </div>
    </div>
  );
}

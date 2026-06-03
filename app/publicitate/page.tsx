'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  Megaphone, CheckCircle2, ArrowRight, Star, LayoutTemplate,
  Layers, Sidebar, Mail, MessageCircle, TrendingUp, Users, MapPin, Target,
  X, Loader2, AlertCircle, ImagePlus,
} from 'lucide-react';

const WHATSAPP = '5492914050210';
const EMAIL    = 'hola@mivecindog.com.ar';

/* ─────────────────────── DATA ─────────────────────── */

const STATS = [
  { value: '500+',     label: 'Vecinos activos',        icon: Users },
  { value: 'Todo',     label: 'Argentina',               icon: MapPin },
  { value: '100%',     label: 'Orgánico · sin bots',    icon: TrendingUp },
  { value: 'Directo',  label: 'A dueños de mascotas',   icon: Target },
];

const FORMATOS = [
  {
    icon: LayoutTemplate,
    nombre: 'Banner entre secciones',
    slug: 'leaderboard',
    descripcion:
      'Aparece en la página de inicio entre el "Cómo funciona" y la sección de confianza. Alta visibilidad al primer scroll.',
    specs: 'Full width · Desktop y mobile · 1 anunciante a la vez',
    badge: 'Más visto',
    badgeColor: 'bg-brand-primary text-white',
  },
  {
    icon: Layers,
    nombre: 'Card en grilla de avisos',
    slug: 'card',
    descripcion:
      'Aparece integrada en la grilla de publicaciones, cada 4 avisos. El usuario la ve mientras busca su perro.',
    specs: 'Mismo tamaño que un aviso · marcado "Publicidad"',
    badge: 'Más clics',
    badgeColor: 'bg-good text-white',
  },
  {
    icon: Sidebar,
    nombre: 'Panel lateral de contacto',
    slug: 'sidebar',
    descripcion:
      'Aparece en la página de detalle de cada aviso, justo debajo del bloque de contacto. El usuario ya está en modo "quiero resolver esto".',
    specs: 'Detalle de aviso · Alta intención de compra',
    badge: 'Alta intención',
    badgeColor: 'bg-[#5b8e3a] text-white',
  },
];

const PAQUETES = [
  {
    nombre: 'Básico',
    precio: '$15.000',
    moneda: 'ARS / mes',
    usd: '≈ USD 15',
    descripcion: 'Ideal para empezar a probar.',
    slots: ['1 slot Sidebar (detalle de aviso)'],
    destacado: false,
    cta: 'Empezar',
  },
  {
    nombre: 'Estándar',
    precio: '$28.000',
    moneda: 'ARS / mes',
    usd: '≈ USD 28',
    descripcion: 'El más elegido por negocios locales.',
    slots: [
      '1 slot Sidebar',
      '1 slot Card en grilla',
    ],
    destacado: true,
    cta: 'Elegir Estándar',
  },
  {
    nombre: 'Premium',
    precio: '$45.000',
    moneda: 'ARS / mes',
    usd: '≈ USD 45',
    descripcion: 'Máxima presencia en toda la app.',
    slots: [
      'Banner entre secciones (home)',
      'Card en grilla de avisos',
      'Sidebar en detalle',
    ],
    destacado: false,
    cta: 'Contactar',
  },
];

const FAQ = [
  {
    q: '¿Cómo aparece mi negocio?',
    a: 'Te pedimos logo, nombre, tagline y el link a tu web o Instagram. En 24 hs tu aviso ya está visible.',
  },
  {
    q: '¿Puedo cambiar el anuncio durante el mes?',
    a: 'Sí. Podés actualizar el contenido una vez por mes sin costo adicional.',
  },
  {
    q: '¿Qué negocios pueden publicitar?',
    a: 'Veterinarias, petshops, peluquerías caninas, adiestradores, refugios, tiendas de accesorios y cualquier servicio relacionado con mascotas.',
  },
  {
    q: '¿Hay contratos o mínimos?',
    a: 'No. El pago es mes a mes. Podés discontinuar cuando quieras.',
  },
];

/* ─────────────────────── PAGE ─────────────────────── */

export default function PublicitatePage() {
  const waLink   = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola, quiero publicitar mi negocio en Vecindog')}`;
  const mailLink = `mailto:${EMAIL}?subject=Quiero%20publicitar%20en%20Vecindog`;
  const [planSeleccionado, setPlanSeleccionado] = useState<string | null>(null);

  return (
    <div className="py-10 md:py-14">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="mb-16 text-center md:mb-20">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary">
          <Megaphone className="h-3.5 w-3.5" /> Para negocios locales
        </span>

        <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-ink md:text-5xl lg:text-6xl">
          Llegá a quienes ya<br className="hidden sm:block" />{' '}
          cuidan a sus mascotas
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-muted">
          Vecindog conecta a dueños de perros de toda Argentina cuando más lo necesitan.
          Mostrá tu negocio en el momento exacto.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary gap-2"
          >
            <MessageCircle className="h-5 w-5" /> Hablar por WhatsApp
          </a>
          <a
            href={mailLink}
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-brand-primary/30 bg-white px-5 py-3.5 font-bold text-brand-primary transition hover:border-brand-primary hover:bg-brand-primary/5"
          >
            <Mail className="h-5 w-5" /> Escribir por email
          </a>
        </div>
      </section>


      {/* ── FORMATOS ──────────────────────────────────────────── */}
      <section className="mb-16 md:mb-20">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-black text-ink md:text-4xl">
            Formatos disponibles
          </h2>
          <p className="mt-2 text-ink-muted">
            Así se ve tu negocio en Vecindog. Cada formato está diseñado para un momento distinto.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">

          {/* ── BANNER ── */}
          <div className="card overflow-hidden p-0">
            <div className="flex items-start justify-between gap-3 p-6 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-primary/10 text-brand-primary">
                    <LayoutTemplate className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg font-black text-ink">Banner entre secciones</h3>
                  <span className="rounded-full bg-brand-primary px-2.5 py-1 text-[11px] font-bold text-white">Más visto</span>
                </div>
                <p className="mt-2 text-sm text-ink-muted">Aparece en el inicio entre secciones. Full width, alta visibilidad.</p>
              </div>
            </div>
            {/* Preview */}
            <div className="mx-6 mb-6 rounded-2xl border-2 border-dashed border-brand-primary/20 bg-brand-cream/50 p-3">
              <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-widest text-ink-muted/50">Vista previa</p>
              <div className="flex items-center justify-between gap-4 rounded-xl bg-gradient-to-r from-brand-primary to-brand-coral-dark px-5 py-4 text-white">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20 text-2xl font-black">V</div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Publicidad</p>
                    <p className="font-display text-base font-black">Veterinaria San Jorge</p>
                    <p className="text-xs opacity-80">Turno online · Vacunas · Cirugía</p>
                  </div>
                </div>
                <div className="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-bold text-brand-primary">Ver más →</div>
              </div>
            </div>
          </div>

          {/* ── CARD ── */}
          <div className="card overflow-hidden p-0">
            <div className="flex items-start gap-3 p-6 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-good/10 text-good">
                    <Layers className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg font-black text-ink">Card en grilla de avisos</h3>
                  <span className="rounded-full bg-good px-2.5 py-1 text-[11px] font-bold text-white">Más clics</span>
                </div>
                <p className="mt-2 text-sm text-ink-muted">Aparece integrada cada 4 avisos. El usuario la ve mientras busca su perro.</p>
              </div>
            </div>
            {/* Preview — simula la grilla */}
            <div className="mx-6 mb-6 rounded-2xl border-2 border-dashed border-brand-primary/20 bg-brand-cream/50 p-3">
              <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-widest text-ink-muted/50">Vista previa</p>
              <div className="grid grid-cols-2 gap-2">
                {/* Aviso real (simulado) */}
                {[1,2,3].map((i) => (
                  <div key={i} className="rounded-xl bg-white p-3 shadow-soft ring-1 ring-black/5">
                    <div className="mb-2 h-20 rounded-lg bg-brand-cream" />
                    <div className="h-3 w-3/4 rounded bg-black/10" />
                    <div className="mt-1 h-2.5 w-1/2 rounded bg-black/5" />
                  </div>
                ))}
                {/* Card publicitaria */}
                <div className="rounded-xl bg-gradient-to-br from-brand-primary/10 to-brand-coral/10 p-3 ring-2 ring-brand-primary/30">
                  <div className="mb-1 flex justify-between">
                    <span className="rounded-full bg-brand-primary px-2 py-0.5 text-[9px] font-bold text-white">Publicidad</span>
                  </div>
                  <div className="mb-1 flex h-16 items-center justify-center rounded-lg bg-brand-primary/10 text-2xl font-black text-brand-primary">P</div>
                  <p className="text-xs font-bold text-ink">Petshop El Hueso</p>
                  <p className="text-[10px] text-ink-muted">Accesorios · Baño · Peluquería</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div className="card overflow-hidden p-0">
            <div className="flex items-start gap-3 p-6 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#5b8e3a]/10 text-[#5b8e3a]">
                    <Sidebar className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg font-black text-ink">Panel lateral de contacto</h3>
                  <span className="rounded-full bg-[#5b8e3a] px-2.5 py-1 text-[11px] font-bold text-white">Alta intención</span>
                </div>
                <p className="mt-2 text-sm text-ink-muted">Aparece en el detalle de cada aviso, justo debajo del contacto. Alta intención de compra.</p>
              </div>
            </div>
            {/* Preview */}
            <div className="mx-6 mb-6 rounded-2xl border-2 border-dashed border-brand-primary/20 bg-brand-cream/50 p-3">
              <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-widest text-ink-muted/50">Vista previa</p>
              <div className="mx-auto max-w-xs space-y-2">
                {/* Simula bloque de contacto del aviso */}
                <div className="rounded-xl bg-white p-3 ring-1 ring-black/5">
                  <p className="text-[10px] font-bold uppercase text-ink-muted">Contacto del aviso</p>
                  <div className="mt-1 h-8 rounded-lg bg-good/20" />
                </div>
                {/* Ad sidebar */}
                <div className="rounded-xl border border-brand-primary/20 bg-white p-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-ink-muted/50">Publicidad</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-sm font-black text-brand-primary">🐾</div>
                    <div>
                      <p className="text-sm font-bold text-ink">Centro Veterinario Norte</p>
                      <p className="text-xs text-ink-muted">Urgencias 24hs · Bahía Blanca</p>
                    </div>
                  </div>
                  <div className="mt-2 rounded-lg bg-brand-primary px-3 py-2 text-center text-xs font-bold text-white">
                    Sacar turno →
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── PRECIOS ───────────────────────────────────────────── */}
      <section className="mb-16 md:mb-20">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-black text-ink md:text-4xl">
            Planes simples, sin letra chica
          </h2>
          <p className="mt-2 text-ink-muted">
            Mes a mes. Sin contrato. Cancelás cuando querés.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {PAQUETES.map(({ nombre, precio, moneda, usd, descripcion, slots, destacado, cta }) => (
            <div
              key={nombre}
              className={`card flex flex-col p-6 ${
                destacado
                  ? 'ring-2 ring-brand-primary'
                  : ''
              }`}
            >
              {destacado && (
                <span className="-mt-9 mb-4 self-start rounded-full bg-brand-primary px-3 py-1 text-xs font-bold text-white">
                  ★ Más elegido
                </span>
              )}

              <h3 className="font-display text-xl font-black text-ink">{nombre}</h3>
              <p className="mt-1 text-sm text-ink-muted">{descripcion}</p>

              <div className="mt-4">
                <span className="font-display text-4xl font-black text-ink">{precio}</span>
                <span className="ml-1 text-sm text-ink-muted">{moneda}</span>
                <p className="mt-0.5 text-xs text-ink-muted">{usd}</p>
              </div>

              <ul className="mt-5 flex-1 space-y-2">
                {slots.map((slot) => (
                  <li key={slot} className="flex items-start gap-2 text-sm text-ink">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-good" />
                    {slot}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => {
                  const slug: Record<string,string> = { 'Básico':'basico', 'Estándar':'estandar', 'Premium':'premium' };
                  setPlanSeleccionado(slug[nombre] ?? nombre.toLowerCase());
                }}
                className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-bold transition ${
                  destacado
                    ? 'bg-brand-primary text-white hover:opacity-90'
                    : 'border-2 border-brand-primary/30 text-brand-primary hover:border-brand-primary hover:bg-brand-primary/5'
                }`}
              >
                {cta} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-ink-muted">
          ¿Necesitás algo especial? <a href={mailLink} className="font-bold text-brand-primary underline">Escribinos</a> y armamos un plan a medida.
        </p>
      </section>

      {/* ── POR QUÉ VECINDOG ──────────────────────────────────── */}
      <section className="mb-16 md:mb-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c1c1e] to-[#2c2018] p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
                <Star className="h-3.5 w-3.5 text-brand-coral" /> Por qué Vecindog
              </span>
              <h2 className="mt-4 font-display text-3xl font-black leading-tight md:text-4xl">
                Publicidad con contexto, no con algoritmos
              </h2>
              <p className="mt-4 text-white/70 leading-relaxed">
                Los usuarios de Vecindog ya están pensando en sus mascotas cuando ven tu anuncio.
                No compite con redes sociales ni con publicidad genérica — aparecés cuando más importa.
              </p>
            </div>

            <ul className="space-y-4">
              {[
                ['Audiencia calificada', 'Solo dueños de mascotas activos en tu ciudad.'],
                ['Sin bots ni impresiones vacías', 'Usuarios reales buscando avisos activos.'],
                ['Activación en 24 hs', 'Tu ad publicado al día siguiente de pagar.'],
                ['Reporte mensual', 'Te informamos cuántas veces se vio tu ad.'],
              ].map(([titulo, desc]) => (
                <li key={titulo} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-coral" />
                  <div>
                    <p className="font-bold">{titulo}</p>
                    <p className="text-sm text-white/60">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="mb-16 md:mb-20">
        <h2 className="mb-8 text-center font-display text-3xl font-black text-ink">
          Preguntas frecuentes
        </h2>
        <div className="mx-auto max-w-2xl space-y-4">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="card p-6">
              <p className="font-display font-extrabold text-ink">{q}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────── */}
      <section className="text-center">
        <div className="card mx-auto max-w-lg p-8 md:p-10">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
            <Megaphone className="h-7 w-7" />
          </span>
          <h2 className="mt-4 font-display text-2xl font-black text-ink md:text-3xl">
            ¿Listo para llegar a más clientes?
          </h2>
          <p className="mt-2 text-ink-muted">
            Escribinos y activamos tu campaña en menos de 24 horas.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary justify-center"
            >
              <MessageCircle className="h-5 w-5" /> WhatsApp
            </a>
            <a
              href={mailLink}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-brand-primary/30 px-5 py-3.5 font-bold text-brand-primary transition hover:border-brand-primary"
            >
              <Mail className="h-5 w-5" /> {EMAIL}
            </a>
          </div>
        </div>
      </section>

      {planSeleccionado && (
        <PagoModal plan={planSeleccionado} onClose={() => setPlanSeleccionado(null)} />
      )}
    </div>
  );
}

/* ── Modal de datos + pago ── */
const PLAN_INFO: Record<string, { label: string; precio: string; slots: string[] }> = {
  basico:   { label: 'Plan Básico',    precio: '$15.000/mes', slots: ['Sidebar en detalle de aviso'] },
  estandar: { label: 'Plan Estándar',  precio: '$28.000/mes', slots: ['Sidebar en detalle de aviso', 'Card en grilla de avisos'] },
  premium:  { label: 'Plan Premium',   precio: '$45.000/mes', slots: ['Banner en inicio', 'Card en grilla', 'Sidebar en detalle'] },
};

function PagoModal({ plan, onClose }: { plan: string; onClose: () => void }) {
  const planKey  = plan === 'estándar' ? 'estandar' : plan;
  const info     = PLAN_INFO[planKey] ?? PLAN_INFO.basico;
  const fileRef  = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [negocio,   setNegocio]   = useState('');
  const [tagline,   setTagline]   = useState('');
  const [link,      setLink]      = useState('');
  const [cta,       setCta]       = useState('');
  const [email,     setEmail]     = useState('');
  const [telefono,  setTelefono]  = useState('');
  const [fotoFile,  setFotoFile]  = useState<File | null>(null);
  const [preview,   setPreview]   = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  // Siempre abrir desde arriba
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

  async function handlePagar(e: React.FormEvent) {
    e.preventDefault();
    if (!negocio.trim()) { setError('Ingresá el nombre de tu negocio.'); return; }
    if (!email.trim())   { setError('Ingresá tu email.'); return; }
    if (!link.trim())    { setError('Ingresá el link de tu negocio.'); return; }
    setError(''); setLoading(true);

    try {
      let imagen_url = '';
      if (fotoFile) {
        const { subirImagenAd } = await import('@/lib/ads');
        imagen_url = await subirImagenAd(fotoFile);
      }

      const res = await fetch('/api/pago/publicidad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planKey, negocio, tagline, link, cta, email, telefono, imagen_url,
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
      {/* Modal con scroll propio */}
      <div
        ref={modalRef}
        className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        {/* Header fijo dentro del modal */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-white px-6 py-4 border-b border-black/5">
          <div>
            <h2 className="font-display text-xl font-black text-ink">{info.label}</h2>
            <p className="text-sm text-ink-muted">{info.precio} · {info.slots.join(' + ')}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-1.5 hover:bg-black/5">
            <X className="h-5 w-5 text-ink-muted" />
          </button>
        </div>

        <form onSubmit={handlePagar} className="p-6 space-y-5">

            {/* Logo / foto del negocio */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink-muted">
              Logo o foto del negocio
            </label>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border-2 border-dashed border-brand-primary/40 bg-brand-cream/60 px-5 py-4 transition hover:border-brand-primary hover:bg-brand-cream"
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10">
                  <ImagePlus className="h-7 w-7 text-brand-primary/60" />
                </div>
              )}
              <div className="text-left">
                <p className="font-bold text-ink">{preview ? 'Cambiar imagen' : 'Subir logo o foto'}</p>
                <p className="text-xs text-ink-muted">PNG, JPG · Máx. 5 MB</p>
              </div>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFoto} />
          </div>

          {/* Nombre y tagline */}
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
                Nombre del negocio <span className="text-bad">*</span>
              </label>
              <input className="field w-full" placeholder="Veterinaria Central"
                value={negocio} onChange={(e) => setNegocio(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
                Descripción corta (tagline)
              </label>
              <input className="field w-full" placeholder="Vacunas · Bahía Blanca"
                value={tagline} onChange={(e) => setTagline(e.target.value)} />
            </div>
          </div>

          {/* Resto de campos */}
          <div className="space-y-3">
            <div>
              <label className="label">Link del negocio <span className="text-bad">*</span></label>
              <input className="field w-full" placeholder="https://instagram.com/tunegocio"
                value={link} onChange={(e) => setLink(e.target.value)} required />
              <p className="mt-1 text-xs text-ink-muted">Web, Instagram, WhatsApp — adonde van los clicks</p>
            </div>
            <div>
              <label className="label">Texto del botón</label>
              <input className="field w-full" placeholder="Ver local · Pedir turno · Ver Instagram"
                value={cta} onChange={(e) => setCta(e.target.value)} />
            </div>
          </div>

          {/* Contacto */}
          <div className="space-y-3 rounded-2xl bg-brand-cream p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">Tus datos de contacto</p>
            <div>
              <label className="label">Email <span className="text-bad">*</span></label>
              <input type="email" className="field w-full" placeholder="info@tunegocio.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="label">Teléfono / WhatsApp</label>
              <input className="field w-full" placeholder="+54 9 291 405-0210"
                value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </div>
          </div>

          {error && (
            <p className="flex items-center gap-2 rounded-2xl bg-bad/10 p-3 text-sm font-bold text-bad">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </p>
          )}

          <p className="text-center text-xs text-ink-muted">
            Serás redirigido a Mercado Pago. Tu anuncio se activa automáticamente al confirmar el pago.
          </p>

          <button type="submit" disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-60 text-base">
            {loading
              ? <Loader2 className="h-5 w-5 animate-spin" />
              : <><CheckCircle2 className="h-5 w-5" /> Ir a pagar con Mercado Pago</>}
          </button>
        </form>
      </div>
    </div>
  );
}

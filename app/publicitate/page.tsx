'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Megaphone, CheckCircle2, ArrowRight, Star, LayoutTemplate,
  Layers, Sidebar, Mail, MessageCircle, TrendingUp, Users, MapPin, Target,
  X, Loader2, AlertCircle, ImagePlus, ArrowLeft,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';

const WHATSAPP = '5492914050210';
const EMAIL    = 'hola@mivecindog.com.ar';

const PAQUETES = [
  {
    nombre: 'Básico',
    precio: '$15.000',
    moneda: 'ARS / mes',
    usd: '≈ USD 15',
    descripcion: 'Ideal para empezar a probar.',
    slots: ['1 slot Sidebar (detalle de aviso)'],
    destacado: false,
    cta: 'Elegir Básico',
    slug: 'basico',
  },
  {
    nombre: 'Estándar',
    precio: '$28.000',
    moneda: 'ARS / mes',
    usd: '≈ USD 28',
    descripcion: 'El más elegido por negocios locales.',
    slots: ['1 slot Sidebar', '1 slot Card en grilla'],
    destacado: true,
    cta: 'Elegir Estándar',
    slug: 'estandar',
  },
  {
    nombre: 'Premium',
    precio: '$45.000',
    moneda: 'ARS / mes',
    usd: '≈ USD 45',
    descripcion: 'Máxima presencia en toda la app.',
    slots: ['Banner entre secciones (home)', 'Card en grilla de avisos', 'Sidebar en detalle'],
    destacado: false,
    cta: 'Elegir Premium',
    slug: 'premium',
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

const POR_QUE_ITEMS = [
  ['Audiencia calificada', 'Solo dueños de mascotas activos en tu ciudad.'],
  ['Sin bots ni impresiones vacías', 'Usuarios reales buscando avisos activos.'],
  ['Activación en 24 hs', 'Tu ad publicado al día siguiente de pagar.'],
  ['Reporte mensual', 'Te informamos cuántas veces se vio tu anuncio.'],
] as const;

export default function PublicitatePage() {
  const router   = useRouter();
  const { t } = useLanguage();
  const waLink   = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola, quiero publicitar mi negocio en Vecindog')}`;
  const mailLink = `mailto:${EMAIL}?subject=Quiero%20publicitar%20en%20Vecindog`;
  const [planSeleccionado, setPlanSeleccionado] = useState<string | null>(null);
  const [totalUsuarios,   setTotalUsuarios]   = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        if (count !== null) setTotalUsuarios(count);
      } catch { /* silencioso */ }
    })();
  }, []);

  const statUsuarios = totalUsuarios === null ? '…' : `${totalUsuarios.toLocaleString('es-AR')}+`;

  const STATS = [
    { value: statUsuarios, label: t.publStats0label, icon: Users },
    { value: 'Todo',       label: t.publStats1label, icon: MapPin },
    { value: '100%',       label: t.publStats2label, icon: TrendingUp },
    { value: 'Directo',    label: t.publStats3label, icon: Target },
  ];

  return (
    <div className="py-10 md:py-14">

      <button type="button" onClick={() => router.back()}
        className="mb-6 inline-flex items-center gap-1 text-sm font-bold text-brand-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> {t.publVolver}
      </button>

      {/* ── HERO ── */}
      <section className="mb-16 text-center md:mb-20">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary">
          <Megaphone className="h-3.5 w-3.5" /> {t.publHeroChip}
        </span>

        <h1 className="mt-4 font-display text-4xl font-black tracking-tight text-ink md:text-5xl lg:text-6xl">
          {t.publHeroTitle}
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-muted">{t.publHeroSub}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-primary gap-2">
            <MessageCircle className="h-5 w-5" /> {t.publHeroWa}
          </a>
          <a href={mailLink}
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-brand-primary/30 bg-white px-5 py-3.5 font-bold text-brand-primary transition hover:border-brand-primary hover:bg-brand-primary/5">
            <Mail className="h-5 w-5" /> {t.publHeroMail}
          </a>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4 md:mb-20">
        {STATS.map(({ value, label, icon: Icon }) => (
          <div key={label} className="card flex flex-col items-center p-5 text-center">
            <Icon className="mb-2 h-6 w-6 text-brand-primary/60" />
            <span className="font-display text-2xl font-black text-ink">{value}</span>
            <span className="mt-1 text-xs text-ink-muted">{label}</span>
          </div>
        ))}
      </section>

      {/* ── FORMATOS ── */}
      <section className="mb-16 md:mb-20">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-black text-ink md:text-4xl">{t.publFormatosTitle}</h2>
          <p className="mt-2 text-ink-muted">{t.publFormatosSub}</p>
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
            <div className="mx-6 mb-6 rounded-2xl border-2 border-dashed border-brand-primary/20 bg-brand-cream/50 p-3">
              <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-widest text-ink-muted/50">{t.publVistaPrevia}</p>
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
            <div className="mx-6 mb-6 rounded-2xl border-2 border-dashed border-brand-primary/20 bg-brand-cream/50 p-3">
              <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-widest text-ink-muted/50">{t.publVistaPrevia}</p>
              <div className="grid grid-cols-2 gap-2">
                {[1,2,3].map((i) => (
                  <div key={i} className="rounded-xl bg-white p-3 shadow-soft ring-1 ring-black/5">
                    <div className="mb-2 h-20 rounded-lg bg-brand-cream" />
                    <div className="h-3 w-3/4 rounded bg-black/10" />
                    <div className="mt-1 h-2.5 w-1/2 rounded bg-black/5" />
                  </div>
                ))}
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
            <div className="mx-6 mb-6 rounded-2xl border-2 border-dashed border-brand-primary/20 bg-brand-cream/50 p-3">
              <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-widest text-ink-muted/50">{t.publVistaPrevia}</p>
              <div className="mx-auto max-w-xs space-y-2">
                <div className="rounded-xl bg-white p-3 ring-1 ring-black/5">
                  <p className="text-[10px] font-bold uppercase text-ink-muted">Contacto del aviso</p>
                  <div className="mt-1 h-8 rounded-lg bg-good/20" />
                </div>
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

      {/* ── CÓMO FUNCIONA ── */}
      <section className="mb-16 md:mb-20">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-black text-ink md:text-4xl">¿Cómo funciona?</h2>
          <p className="mt-2 text-ink-muted">En tres pasos simples tu negocio ya está visible.</p>
        </div>

        <div className="relative grid gap-6 md:grid-cols-3">

          {[
            {
              n: '1',
              titulo: 'Elegí tu plan',
              desc: 'Seleccioná el paquete que mejor se adapte a tu negocio: Básico, Estándar o Premium.',
              icon: '🎯',
            },
            {
              n: '2',
              titulo: 'Completá los datos',
              desc: 'Nombre del negocio, logo, tagline y el link a tu web o Instagram. Todo en menos de 2 minutos.',
              icon: '📋',
            },
            {
              n: '3',
              titulo: 'Tu aviso en vivo',
              desc: 'Procesamos tu solicitud y en 24 hs tu anuncio ya está visible para cientos de dueños de mascotas.',
              icon: '🚀',
            },
          ].map(({ n, titulo, desc, icon }) => (
            <div key={n} className="card flex flex-col items-center p-7 text-center">
              <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary/10">
                <span className="text-2xl">{icon}</span>
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-primary text-xs font-black text-white">
                  {n}
                </span>
              </div>
              <h3 className="font-display text-lg font-black text-ink">{titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRECIOS ── */}
      <section className="mb-16 md:mb-20">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-black text-ink md:text-4xl">{t.publPreciosTitle}</h2>
          <p className="mt-2 text-ink-muted">{t.publPreciosSub}</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {PAQUETES.map(({ nombre, precio, moneda, usd, descripcion, slots, destacado, cta, slug }) => (
            <div
              key={nombre}
              className={`relative card flex flex-col p-6 ${destacado ? 'ring-2 ring-brand-primary' : ''}`}
            >
              {destacado && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-primary px-3 py-1 text-xs font-bold text-white">
                  {t.publMasElegido}
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
                onClick={() => setPlanSeleccionado(slug)}
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
          {t.publPrecioEspecial.split('{link}')[0]}
          <a href={mailLink} className="font-bold text-brand-primary underline">Escribinos</a>
          {t.publPrecioEspecial.split('{link}')[1]}
        </p>
      </section>

      {/* ── POR QUÉ VECINDOG ── */}
      <section className="mb-16 md:mb-20">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c1c1e] to-[#2c2018] p-8 text-white md:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
                <Star className="h-3.5 w-3.5 text-brand-coral" /> {t.publPorQueChip}
              </span>
              <h2 className="mt-4 font-display text-3xl font-black leading-tight md:text-4xl">
                {t.publPorQueTitle}
              </h2>
              <p className="mt-4 text-white/70 leading-relaxed">{t.publPorQueSub}</p>
            </div>

            <ul className="space-y-4">
              {POR_QUE_ITEMS.map(([titulo, desc]) => (
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

      {/* ── FAQ ── */}
      <section className="mb-16 md:mb-20">
        <h2 className="mb-8 text-center font-display text-3xl font-black text-ink">{t.publFaqTitle}</h2>
        <div className="mx-auto max-w-2xl space-y-4">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="card p-6">
              <p className="font-display font-extrabold text-ink">{q}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="text-center">
        <div className="card mx-auto max-w-lg p-8 md:p-10">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
            <Megaphone className="h-7 w-7" />
          </span>
          <h2 className="mt-4 font-display text-2xl font-black text-ink md:text-3xl">{t.publCtaTitle}</h2>
          <p className="mt-2 text-ink-muted">{t.publCtaSub}</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-primary justify-center">
              <MessageCircle className="h-5 w-5" /> WhatsApp
            </a>
            <a href={mailLink}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-brand-primary/30 px-5 py-3.5 font-bold text-brand-primary transition hover:border-brand-primary">
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

const PLAN_INFO: Record<string, { label: string; precio: string; slots: string[] }> = {
  basico:   { label: 'Plan Básico',    precio: '$15.000/mes', slots: ['Sidebar en detalle de aviso'] },
  estandar: { label: 'Plan Estándar',  precio: '$28.000/mes', slots: ['Sidebar en detalle de aviso', 'Card en grilla de avisos'] },
  premium:  { label: 'Plan Premium',   precio: '$45.000/mes', slots: ['Banner en inicio', 'Card en grilla', 'Sidebar en detalle'] },
};

const FOTO_RECOMENDADA: Record<string, { ratio: string; medida: string; consejo: string }> = {
  basico:   { ratio: '1:1',  medida: '400×400 px',  consejo: 'Logo cuadrado — se muestra chico al costado del texto.' },
  estandar: { ratio: '4:3',  medida: '800×600 px',  consejo: 'Foto horizontal — se usa como banner en la card de avisos y también recortada como logo.' },
  premium:  { ratio: '4:3',  medida: '800×600 px',  consejo: 'Foto horizontal — se usa como banner en la card, en el inicio y recortada como logo.' },
};

function PagoModal({ plan, onClose }: { plan: string; onClose: () => void }) {
  const { t } = useLanguage();
  const planKey  = plan === 'estándar' ? 'estandar' : plan;
  const info     = PLAN_INFO[planKey] ?? PLAN_INFO.basico;
  const fotoRec  = FOTO_RECOMENDADA[planKey] ?? FOTO_RECOMENDADA.basico;
  const fileRef  = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [negocio,       setNegocio]       = useState('');
  const [tagline,       setTagline]       = useState('');
  const [link,          setLink]          = useState('');
  const [cta,           setCta]           = useState('');
  const [email,         setEmail]         = useState('');
  const [telefono,      setTelefono]      = useState('');
  const [fotoFile,      setFotoFile]      = useState<File | null>(null);
  const [preview,       setPreview]       = useState('');
  const [logoFile,      setLogoFile]      = useState<File | null>(null);
  const [previewLogo,   setPreviewLogo]   = useState('');
  const logoRef = useRef<HTMLInputElement>(null);
  const necesitaLogo = planKey === 'estandar' || planKey === 'premium';
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  useEffect(() => {
    modalRef.current?.scrollTo({ top: 0 });
  }, []);

  function onFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError(t.publModalErrFotoTam); return; }
    setFotoFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError(t.publModalErrLogoTam); return; }
    setLogoFile(file);
    setPreviewLogo(URL.createObjectURL(file));
  }

  async function handlePagar(e: React.FormEvent) {
    e.preventDefault();
    if (!negocio.trim()) { setError(t.publModalErrNegocio); return; }
    if (!email.trim())   { setError(t.publModalErrEmail); return; }
    if (!link.trim())    { setError(t.publModalErrLink); return; }
    try {
      const urlCheck = link.includes('://') ? link : `https://${link}`;
      const parsed = new URL(urlCheck);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error();
    } catch {
      setError(t.publModalErrLinkFmt);
      return;
    }
    if (telefono.trim()) {
      const digitos = telefono.replace(/\D/g, '');
      if (digitos.length < 10) { setError(t.publModalErrTel); return; }
    }
    setError(''); setLoading(true);

    try {
      let imagen_url = '';
      let imagen_logo_url = '';
      if (fotoFile) {
        const { subirImagenAd } = await import('@/lib/ads');
        imagen_url = await subirImagenAd(fotoFile);
      }
      if (logoFile && necesitaLogo) {
        const { subirLogoAd } = await import('@/lib/ads');
        imagen_logo_url = await subirLogoAd(logoFile);
      }

      const res = await fetch('/api/trial/publicidad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planKey, negocio, tagline, link, cta, email, telefono,
          imagen_url, imagen_logo_url,
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok && data.ad_ids?.length > 0) {
        window.location.href = `/publicitate/pago-exitoso?plan=${planKey}&ads=${data.ad_ids.join(',')}&trial=1`;
      } else if (res.ok && data.ok) {
        console.error('[publicitate] trial activado sin ad_ids:', { plan: planKey, negocio, email });
        window.location.href = `/publicitate/pago-exitoso?plan=${planKey}&trial=1`;
        return;
      } else {
        setError(data.error ?? 'Error al procesar.');
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
        className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-3xl bg-white px-6 py-4 border-b border-black/5">
          <div>
            <h2 className="font-display text-xl font-black text-ink">{info.label}</h2>
            <p className="text-sm text-ink-muted">
              <span className="font-bold text-good">🎁 Primer mes gratis</span>
              {' · '}después {info.precio} · {info.slots.join(' + ')}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-1.5 hover:bg-black/5">
            <X className="h-5 w-5 text-ink-muted" />
          </button>
        </div>

        <form onSubmit={handlePagar} className="p-6 space-y-5">

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink-muted">
              {t.publModalFotolabel}
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
                <p className="font-bold text-ink">{preview ? t.publModalFotoCambiar : t.publModalFotoSubir}</p>
                <p className="text-xs text-ink-muted">
                  PNG, JPG · Máx. 5 MB · Ratio {fotoRec.ratio} · {fotoRec.medida}
                </p>
              </div>
            </button>
            <p className="mt-1.5 text-[11px] text-ink-muted leading-relaxed">💡 {fotoRec.consejo}</p>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFoto} />
          </div>

          {necesitaLogo && (
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-ink-muted">
                {t.publModalLogoLabel} <span className="text-bad">*</span>
                <span className="ml-1 font-normal normal-case text-ink-muted/60">— para sidebar y leaderboard</span>
              </label>
              <button
                type="button"
                onClick={() => logoRef.current?.click()}
                className="relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border-2 border-dashed border-brand-primary/40 bg-brand-cream/60 px-5 py-4 transition hover:border-brand-primary hover:bg-brand-cream"
              >
                {previewLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewLogo} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10">
                    <ImagePlus className="h-7 w-7 text-brand-primary/60" />
                  </div>
                )}
                <div className="text-left">
                  <p className="font-bold text-ink">{previewLogo ? t.publModalLogoCambiar : t.publModalLogoSubir}</p>
                  <p className="text-xs text-ink-muted">PNG, JPG · Ratio 1:1 · 400×400 px mín.</p>
                </div>
              </button>
              <p className="mt-1.5 text-[11px] text-ink-muted">
                💡 Logo de tu negocio — se muestra como icono al costado del nombre en sidebar y banner.
              </p>
              <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={onLogo} />
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
                {t.publModalNegocioLabel} <span className="text-bad">*</span>
              </label>
              <input className="field w-full" placeholder="Veterinaria Central"
                value={negocio} onChange={(e) => setNegocio(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
                {t.publModalTaglineLabel}
              </label>
              <input className="field w-full" placeholder="Vacunas · Bahía Blanca"
                value={tagline} onChange={(e) => setTagline(e.target.value)} />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
                {t.publModalLinkLabel} <span className="text-bad">*</span>
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
                required
              />
              <p className="mt-1 text-xs text-ink-muted">{t.publModalLinkInfo}</p>
            </div>
            <div>
              <label className="label">{t.publModalCtaLabel}</label>
              <input className="field w-full" placeholder="Ver local · Pedir turno · Ver Instagram"
                value={cta} onChange={(e) => setCta(e.target.value)} />
            </div>
          </div>

          <div className="space-y-3 rounded-2xl bg-brand-cream p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">{t.publModalContactoLabel}</p>
            <div>
              <label className="label">{t.publModalEmailLabel} <span className="text-bad">*</span></label>
              <input type="email" className="field w-full" placeholder="info@tunegocio.com"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">{t.publModalTelLabel}</label>
              <input type="tel" className="field w-full" placeholder="+54 9 291 405-0210"
                value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            </div>
          </div>

          {error && (
            <p className="flex items-center gap-2 rounded-2xl bg-bad/10 p-3 text-sm font-bold text-bad">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </p>
          )}

          <p className="text-center text-xs text-ink-muted">Sin costo el primer mes · después se renueva</p>

          <button type="submit" disabled={loading}
            className="btn-primary w-full justify-center disabled:opacity-60 text-base">
            {loading
              ? <Loader2 className="h-5 w-5 animate-spin" />
              : <><CheckCircle2 className="h-5 w-5" /> Activar gratis — primer mes sin costo</>}
          </button>
        </form>
      </div>
    </div>
  );
}

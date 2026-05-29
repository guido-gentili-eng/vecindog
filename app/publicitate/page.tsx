import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Megaphone, CheckCircle2, ArrowRight, Star, LayoutTemplate,
  Layers, Sidebar, Mail, MessageCircle, TrendingUp, Users, MapPin, Target
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Publicitate en Vecindog | Llegá a los dueños de mascotas de tu ciudad',
  description:
    'Mostrá tu veterinaria, petshop o servicio a cientos de vecinos que ya buscan ayuda para sus mascotas. Publicidad local, efectiva y accesible.',
};

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
  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hola, quiero publicitar mi negocio en Vecindog')}`;
  const mailLink = `mailto:${EMAIL}?subject=Quiero%20publicitar%20en%20Vecindog`;

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

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="mb-16 md:mb-20">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="card p-5 text-center">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-3 font-display text-3xl font-black text-ink">{value}</p>
              <p className="mt-1 text-xs font-semibold text-ink-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FORMATOS ──────────────────────────────────────────── */}
      <section className="mb-16 md:mb-20">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-black text-ink md:text-4xl">
            Formatos disponibles
          </h2>
          <p className="mt-2 text-ink-muted">
            Tres ubicaciones pensadas para distintos momentos del recorrido del usuario.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {FORMATOS.map(({ icon: Icon, nombre, descripcion, specs, badge, badgeColor }) => (
            <div key={nombre} className="card flex flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${badgeColor}`}>
                  {badge}
                </span>
              </div>

              <h3 className="mt-4 font-display text-lg font-black text-ink">{nombre}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{descripcion}</p>

              <div className="mt-5 rounded-xl bg-brand-cream px-3 py-2 text-xs font-semibold text-ink-muted">
                {specs}
              </div>
            </div>
          ))}
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

              <a
                href={`${mailLink}&body=Hola%2C%20me%20interesa%20el%20plan%20${encodeURIComponent(nombre)}`}
                className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-bold transition ${
                  destacado
                    ? 'bg-brand-primary text-white hover:bg-brand-primary-dark'
                    : 'border-2 border-brand-primary/30 text-brand-primary hover:border-brand-primary hover:bg-brand-primary/5'
                }`}
              >
                {cta} <ArrowRight className="h-4 w-4" />
              </a>
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

    </div>
  );
}

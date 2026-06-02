import Link from 'next/link';
import { BrandBadge } from '@/components/Logo';
import { Heart, Megaphone } from 'lucide-react';

const LINKS = {
  app: [
    { href: '/',                label: 'Inicio' },
    { href: '/publicaciones',   label: 'Avisos' },
    { href: '/publicar',        label: 'Publicar' },
    { href: '/buscar-por-foto', label: 'Buscar por foto' }
  ],
  comunidad: [
    { href: '/publicaciones?cat=perdido',    label: 'Perdidos' },
    { href: '/publicaciones?cat=encontrado', label: 'Vistos' },
    { href: '/publicaciones?cat=adopcion',   label: 'En adopción' }
  ],
  negocios: [
    { href: '/publicitate', label: 'Publicitate' },
  ]
};

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-black/5 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:grid-cols-2 md:grid-cols-5">
        {/* Brand */}
        <div className="sm:col-span-2">
          <BrandBadge size="md" highlight />
          <p className="mt-3 max-w-xs text-sm text-ink-muted">
            La red vecinal para encontrar y adoptar perros cerca de vos.
            Hecho entre vecinos, gratis y sin venta de animales.
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted">
            <Heart className="h-3.5 w-3.5 text-brand-primary fill-current" /> Disponible en todo Argentina
          </p>
        </div>

        {/* Links App */}
        <div>
          <h3 className="font-display text-sm font-extrabold uppercase tracking-wide text-ink">
            La app
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {LINKS.app.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ink-muted hover:text-brand-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Links Comunidad */}
        <div>
          <h3 className="font-display text-sm font-extrabold uppercase tracking-wide text-ink">
            Comunidad
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            {LINKS.comunidad.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-ink-muted hover:text-brand-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Links Negocios */}
        <div>
          <h3 className="font-display text-sm font-extrabold uppercase tracking-wide text-ink">
            Negocios
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link
                href="/publicitate"
                className="inline-flex items-center gap-1.5 font-bold text-brand-primary hover:underline"
              >
                <Megaphone className="h-3.5 w-3.5" /> Publicitate
              </Link>
            </li>
            <li>
              <a
                href="mailto:hola@mivecindog.com.ar"
                className="text-ink-muted hover:text-brand-primary"
              >
                hola@mivecindog.com.ar
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-black/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-ink-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Vecindog · Buscá. Encontrá. Adoptá.</p>
          <div className="flex items-center gap-4">
            <Link href="/terminos" className="hover:text-brand-primary transition">Términos y Condiciones</Link>
            <Link href="/privacidad" className="hover:text-brand-primary transition">Política de Privacidad</Link>
            <p>Hecho con cariño en Argentina 🐾</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

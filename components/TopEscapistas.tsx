'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, MapPin, Lock, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Escapista {
  clave:    string;         // perro_id o "nombre|zona"
  perro_id: string | null;
  nombre:   string;
  raza:     string | null;
  color:    string | null;
  tamano:   string | null;
  foto:     string | null;  // imagen del aviso más reciente
  fugas:    number;
  zona:     string;
}

function norm(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}

function ciudadMatchZona(ciudad: string, zona: string): boolean {
  const c = norm(ciudad), z = norm(zona);
  if (z.includes(c) || c.includes(z)) return true;
  return c.split(/\s+/).filter(w => w.length > 3).some(p => z.includes(p));
}

export default function TopEscapistas() {
  const { ciudad, isPro, isAuthenticated } = useAuth();
  const [lista,    setLista]    = useState<Escapista[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function cargar() {
      try {
        // Traer todos los avisos de perros perdidos
        const { data: posts } = await supabase
          .from('posts')
          .select('id, perro_id, nombre, zona, raza, color, tamano, images')
          .eq('categoria', 'perdido');

        if (!posts?.length || cancelled) { setCargando(false); return; }

        // Filtrar por ciudad (best-effort)
        let candidatos = posts as Array<{
          id: string; perro_id: string | null; nombre: string | null;
          zona: string; raza: string | null; color: string | null;
          tamano: string | null; images: string[] | null;
        }>;

        if (ciudad) {
          const filtrados = candidatos.filter(p => ciudadMatchZona(ciudad, p.zona ?? ''));
          if (filtrados.length >= 3) candidatos = filtrados;
        }

        // Agrupar: si tiene perro_id → por perro_id; si no → por "nombre|zona"
        const conteo: Record<string, {
          fugas: number; zona: string; nombre: string;
          raza: string | null; color: string | null; tamano: string | null;
          foto: string | null; perro_id: string | null;
        }> = {};

        for (const p of candidatos) {
          if (!p.nombre) continue;
          const clave = p.perro_id ?? `${norm(p.nombre)}|${norm(p.zona ?? '')}`;
          if (!conteo[clave]) {
            conteo[clave] = {
              fugas: 0, zona: p.zona, nombre: p.nombre,
              raza: p.raza, color: p.color, tamano: p.tamano,
              foto: p.images?.[0] ?? null, perro_id: p.perro_id,
            };
          }
          conteo[clave].fugas++;
        }

        // Top 10
        const top10 = Object.entries(conteo)
          .sort((a, b) => b[1].fugas - a[1].fugas)
          .slice(0, 10);

        if (!top10.length || cancelled) { setCargando(false); return; }

        // Enriquecer con fotos de perfil si tiene perro_id
        const perroIds = top10
          .map(([, v]) => v.perro_id)
          .filter(Boolean) as string[];

        let perroFotos: Record<string, string> = {};
        if (perroIds.length) {
          const { data: perros } = await supabase
            .from('perros')
            .select('id, foto_url')
            .in('id', perroIds);
          perroFotos = Object.fromEntries(
            (perros ?? []).filter(p => p.foto_url).map(p => [p.id, p.foto_url])
          );
        }

        if (cancelled) return;

        const resultado: Escapista[] = top10.map(([clave, v]) => ({
          clave,
          perro_id: v.perro_id,
          nombre:   v.nombre,
          raza:     v.raza,
          color:    v.color,
          tamano:   v.tamano,
          foto:     (v.perro_id && perroFotos[v.perro_id]) ? perroFotos[v.perro_id] : v.foto,
          fugas:    v.fugas,
          zona:     v.zona,
        }));

        if (!cancelled) setLista(resultado);
      } catch { /* silencioso */ }
      finally { if (!cancelled) setCargando(false); }
    }

    cargar();
    return () => { cancelled = true; };
  }, [ciudad]);

  if (!cargando && lista.length === 0 && isPro) return null;

  const tituloLugar = ciudad ?? 'la comunidad';

  // Gate: mostrar teaser para usuarios free
  if (!isPro && isAuthenticated) {
    return (
      <section aria-label="Top escapistas">
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warn/15 px-3 py-1 text-xs font-bold text-[#8a5a00]">
            <AlertTriangle className="h-3.5 w-3.5" /> Ranking
          </span>
          <h2 className="mt-2 font-display text-2xl font-black tracking-tight text-ink md:text-3xl">
            Los más escapistas 🏃
          </h2>
        </div>
        <div className="relative overflow-hidden rounded-[20px]">
          <div className="pointer-events-none select-none space-y-2 opacity-25 blur-sm" aria-hidden>
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-black/5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-cream text-sm font-black text-ink-muted">{i}</span>
                <div className="h-12 w-12 shrink-0 rounded-xl bg-brand-cream" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-24 rounded bg-black/10" />
                  <div className="h-2.5 w-32 rounded bg-black/6" />
                </div>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[20px] bg-white/80 p-6 text-center backdrop-blur-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10">
              <Lock className="h-6 w-6 text-brand-primary" />
            </div>
            <p className="font-display text-base font-extrabold text-ink">Los más escapistas</p>
            <p className="text-xs text-ink-muted">Función exclusiva de VecindogPro</p>
            <Link href="/planes"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-primary px-5 py-2.5 text-sm font-bold text-white shadow-soft transition hover:opacity-90">
              <Sparkles className="h-4 w-4" /> Ver planes
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Top escapistas">
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-warn/15 px-3 py-1 text-xs font-bold text-[#8a5a00]">
          <AlertTriangle className="h-3.5 w-3.5" /> Ranking
        </span>
        <h2 className="mt-2 font-display text-2xl font-black tracking-tight text-ink md:text-3xl">
          Los más escapistas 🏃
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Los perros con más avisos de pérdida en {tituloLugar}.
        </p>
      </div>

      {cargando ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-black/5" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {lista.map((p, i) => (
            <div
              key={p.clave}
              className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft ring-1 ring-black/5"
            >
              {/* Posición */}
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                i === 0 ? 'bg-[#FFD700] text-[#5a4200]' :
                i === 1 ? 'bg-[#C0C0C0] text-[#3a3a3a]' :
                i === 2 ? 'bg-[#CD7F32] text-white' :
                          'bg-brand-cream text-ink-muted'
              }`}>
                {i + 1}
              </span>

              {/* Foto */}
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-brand-cream">
                {p.foto
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={p.foto} alt={p.nombre} className="h-full w-full object-cover" />
                  : <div className="flex h-full w-full items-center justify-center text-xl">🐶</div>
                }
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                {p.perro_id ? (
                  <Link href={`/historia/${p.perro_id}`}
                    className="font-display text-base font-extrabold text-ink hover:text-brand-primary hover:underline">
                    {p.nombre}
                  </Link>
                ) : (
                  <p className="font-display text-base font-extrabold text-ink">{p.nombre}</p>
                )}
                <p className="truncate text-xs text-ink-muted">
                  {[p.raza, p.color, p.tamano].filter(Boolean).join(' · ')}
                  {p.zona ? <> · <MapPin className="inline h-2.5 w-2.5" /> {p.zona}</> : null}
                </p>
              </div>

              {/* Fugas */}
              <span className="shrink-0 rounded-full bg-lost/10 px-2.5 py-1 text-xs font-extrabold text-[#D7503A]">
                {p.fugas} {p.fugas === 1 ? 'fuga' : 'fugas'}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

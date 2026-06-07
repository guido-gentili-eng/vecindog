'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';

type TipoEvento =
  | 'vacuna'
  | 'desparasitacion'
  | 'medicamento'
  | 'peso'
  | 'estudio'
  | 'grooming'
  | 'turno'
  | 'aviso';

interface EventoTimeline {
  id: string;
  tipo: TipoEvento;
  fecha: string;
  titulo: string;
  subtitulo?: string;
  notas?: string;
  extra?: string;
}

const CONFIG_STATIC: Record<TipoEvento, { emoji: string; color: string; bg: string }> = {
  vacuna:          { emoji: '💉', color: 'text-[#3F8B5C]',  bg: 'bg-[#3F8B5C]/10'  },
  desparasitacion: { emoji: '🐛', color: 'text-[#8B5CF6]',  bg: 'bg-[#8B5CF6]/10'  },
  medicamento:     { emoji: '💊', color: 'text-[#0EA5E9]',  bg: 'bg-[#0EA5E9]/10'  },
  peso:            { emoji: '⚖️', color: 'text-[#F59E0B]',  bg: 'bg-[#F59E0B]/10'  },
  estudio:         { emoji: '📋', color: 'text-[#64748B]',  bg: 'bg-[#64748B]/10'  },
  grooming:        { emoji: '✂️', color: 'text-[#EC4899]',  bg: 'bg-[#EC4899]/10'  },
  turno:           { emoji: '📅', color: 'text-[#EE5A3B]',  bg: 'bg-[#EE5A3B]/10'  },
  aviso:           { emoji: '📢', color: 'text-[#D7503A]',  bg: 'bg-[#D7503A]/10'  },
};

function fmt(iso: string) {
  if (!iso) return '—';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}

function fmtMes(iso: string) {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });
}

export default function TimelinePage() {
  const { id: perroId } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { t } = useLanguage();

  const [perroNombre, setPerroNombre] = useState('');
  const [eventos, setEventos] = useState<EventoTimeline[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { router.replace('/'); return; }
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated]);

  async function cargar() {
    setCargando(true);
    try {
      const [
        { data: perro },
        { data: vacunas },
        { data: desparas },
        { data: meds },
        { data: pesos },
        { data: estudios },
        { data: grooming },
        { data: turnos },
        { data: posts },
      ] = await Promise.all([
        supabase.from('perros').select('nombre, user_id').eq('id', perroId).single(),
        supabase.from('vacunas').select('*').eq('perro_id', perroId),
        supabase.from('desparasitaciones').select('*').eq('perro_id', perroId),
        supabase.from('medicamentos').select('*').eq('perro_id', perroId),
        supabase.from('pesos').select('*').eq('perro_id', perroId),
        supabase.from('estudios').select('*').eq('perro_id', perroId),
        supabase.from('grooming').select('*').eq('perro_id', perroId).maybeSingle(),
        supabase.from('turnos').select('*').eq('perro_id', perroId),
        supabase.from('posts').select('id, categoria, nombre, zona, fecha, created_at, estado').eq('perro_id', perroId),
      ]);

      if (!perro || perro.user_id !== user?.id) { router.replace('/mis-perros'); return; }

      setPerroNombre(perro.nombre);

      const lista: EventoTimeline[] = [];

      for (const v of vacunas ?? []) {
        lista.push({
          id: `vac-${v.id}`,
          tipo: 'vacuna',
          fecha: v.fecha,
          titulo: v.nombre,
          subtitulo: v.veterinario || undefined,
          notas: v.notas || undefined,
          extra: v.proxima ? t.tlineProxima.replace('{fecha}', fmt(v.proxima)) : undefined,
        });
      }

      for (const d of desparas ?? []) {
        lista.push({
          id: `desp-${d.id}`,
          tipo: 'desparasitacion',
          fecha: d.fecha,
          titulo: d.producto,
          subtitulo: d.tipo,
          notas: d.notas || undefined,
          extra: d.proxima ? t.tlineProxima.replace('{fecha}', fmt(d.proxima)) : undefined,
        });
      }

      for (const m of meds ?? []) {
        lista.push({
          id: `med-${m.id}`,
          tipo: 'medicamento',
          fecha: m.fecha_inicio,
          titulo: m.nombre,
          subtitulo: `${m.dosis} · ${m.frecuencia}`,
          notas: m.notas || undefined,
          extra: m.activo ? t.tlineActivo : (m.fecha_fin ? `Hasta: ${fmt(m.fecha_fin)}` : undefined),
        });
      }

      for (const p of pesos ?? []) {
        lista.push({
          id: `peso-${p.id}`,
          tipo: 'peso',
          fecha: p.fecha,
          titulo: `${p.valor_kg} kg`,
          notas: p.notas || undefined,
        });
      }

      for (const e of estudios ?? []) {
        lista.push({
          id: `est-${e.id}`,
          tipo: 'estudio',
          fecha: e.fecha ?? e.created_at?.slice(0, 10),
          titulo: e.nombre,
          subtitulo: e.tipo,
          notas: e.notas || undefined,
        });
      }

      if (grooming?.ultima_fecha) {
        lista.push({
          id: `groom-${grooming.id}`,
          tipo: 'grooming',
          fecha: grooming.ultima_fecha,
          titulo: grooming.tipo === 'baño' ? 'Baño' : grooming.tipo === 'peluquería' ? 'Peluquería' : 'Baño + Peluquería',
          notas: grooming.notas || undefined,
        });
      }

      for (const turno of turnos ?? []) {
        lista.push({
          id: `turno-${turno.id}`,
          tipo: 'turno',
          fecha: turno.fecha,
          titulo: turno.tipo === 'radiografia' ? 'Radiografía' : turno.tipo === 'ecografia' ? 'Ecografía' : turno.tipo,
          notas: turno.nota || undefined,
        });
      }

      for (const p of posts ?? []) {
        const catLabel = p.categoria === 'perdido' ? 'Perdido' : p.categoria === 'encontrado' ? 'Encontrado' : p.categoria === 'adopcion' ? 'Adopción' : p.categoria;
        lista.push({
          id: `post-${p.id}`,
          tipo: 'aviso',
          fecha: (p.fecha ?? p.created_at)?.slice(0, 10),
          titulo: catLabel,
          subtitulo: p.zona || undefined,
          extra: p.estado === 'resuelto' ? t.tlineResuelto : t.tlineActivo,
        });
      }

      lista.sort((a, b) => (b.fecha ?? '').localeCompare(a.fecha ?? ''));
      setEventos(lista);
    } finally {
      setCargando(false);
    }
  }

  const CONFIG: Record<TipoEvento, { emoji: string; color: string; bg: string; label: string }> = {
    vacuna:          { ...CONFIG_STATIC.vacuna,          label: t.tlineVacuna          },
    desparasitacion: { ...CONFIG_STATIC.desparasitacion, label: t.tlineDesparasitacion },
    medicamento:     { ...CONFIG_STATIC.medicamento,     label: t.tlineMedicamento     },
    peso:            { ...CONFIG_STATIC.peso,            label: t.tlinePeso            },
    estudio:         { ...CONFIG_STATIC.estudio,         label: t.tlineEstudio         },
    grooming:        { ...CONFIG_STATIC.grooming,        label: t.tlineGrooming        },
    turno:           { ...CONFIG_STATIC.turno,           label: t.tlineTurno           },
    aviso:           { ...CONFIG_STATIC.aviso,           label: t.tlineAviso           },
  };

  const grupos: { mes: string; items: EventoTimeline[] }[] = [];
  for (const ev of eventos) {
    const mes = fmtMes(ev.fecha);
    const ultimo = grupos[grupos.length - 1];
    if (!ultimo || ultimo.mes !== mes) {
      grupos.push({ mes, items: [ev] });
    } else {
      ultimo.items.push(ev);
    }
  }

  if (authLoading || cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f0eb]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0eb] py-8 px-4">
      <div className="mx-auto max-w-xl">
        <Link
          href={`/mis-perros/${perroId}`}
          className="mb-4 inline-flex items-center gap-1 text-sm font-bold text-brand-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> {t.tlineVolver}
        </Link>

        <div className="mb-6 rounded-[24px] bg-brand-primary px-6 py-5 text-white">
          <p className="text-xs font-bold uppercase tracking-[2px] opacity-70 mb-1">{t.tlineDiario}</p>
          <h1 className="font-display text-3xl font-black">{perroNombre}</h1>
          <p className="mt-1 text-sm opacity-75">{t.tlineEventos.replace('{n}', String(eventos.length))}</p>
        </div>

        {eventos.length === 0 ? (
          <div className="rounded-2xl bg-white border border-black/5 px-6 py-10 text-center">
            <p className="text-3xl mb-3">📋</p>
            <p className="font-bold text-ink">{t.tlineSinEventos}</p>
            <p className="text-sm text-ink-muted mt-1">{t.tlineSinEventosSub}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {grupos.map(({ mes, items }) => (
              <div key={mes}>
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-px flex-1 bg-black/10" />
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-muted capitalize">{mes}</span>
                  <div className="h-px flex-1 bg-black/10" />
                </div>

                <div className="space-y-2">
                  {items.map((ev) => {
                    const cfg = CONFIG[ev.tipo];
                    return (
                      <div
                        key={ev.id}
                        className="flex gap-3 rounded-2xl border border-black/5 bg-white px-4 py-3"
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg ${cfg.bg}`}>
                          {cfg.emoji}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className={`text-[10px] font-bold uppercase tracking-wide ${cfg.color}`}>
                                {cfg.label}
                              </span>
                              <p className="font-bold text-ink text-sm leading-tight">{ev.titulo}</p>
                              {ev.subtitulo && (
                                <p className="text-xs text-ink-muted capitalize">{ev.subtitulo}</p>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-xs font-bold text-ink-muted">{fmt(ev.fecha)}</p>
                              {ev.extra && (
                                <p className="text-[11px] text-ink-muted/70 mt-0.5">{ev.extra}</p>
                              )}
                            </div>
                          </div>
                          {ev.notas && (
                            <p className="mt-1 text-xs text-ink-muted/70 italic">{ev.notas}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

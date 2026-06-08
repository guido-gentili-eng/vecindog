import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import EncontrePerroButton from './EncontrePerroButton';
import PrintButton from './PrintButton';

interface Props { params: { perroId: string } }

export async function generateMetadata({ params }: Props) {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: perro } = await admin.from('perros').select('nombre, raza, foto_url').eq('id', params.perroId).single();
  const nombre = perro?.nombre ?? 'Perro';
  return {
    title: `${nombre} — Historia Clínica | Vecindog`,
    description: `Historial médico, vacunas y estudios de ${nombre}${perro?.raza ? ` (${perro.raza})` : ''}.`,
    openGraph: {
      title: `${nombre} — Historia Clínica`,
      description: `Historial médico completo de ${nombre} en Vecindog`,
      images: perro?.foto_url ? [{ url: perro.foto_url, width: 400, height: 400 }] : [],
    },
  };
}

function fmt(iso: string) {
  if (!iso) return '—';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}

export default async function HistoriaPublicaPage({ params }: Props) {
  const { perroId } = params;

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [{ data: perro }, { data: vacunas }, { data: estudios }, { data: posts }] = await Promise.all([
    admin.from('perros').select('*').eq('id', perroId).single(),
    admin.from('vacunas').select('*').eq('perro_id', perroId).order('fecha', { ascending: false }),
    admin.from('estudios').select('*').eq('perro_id', perroId).order('created_at', { ascending: false }),
    admin.from('posts').select('id, categoria, nombre, zona, fecha, created_at, estado, images').eq('perro_id', perroId).order('created_at', { ascending: false }),
  ]);

  if (!perro) notFound();

  // Perfil del dueño (solo teléfono, para contacto)
  const { data: profile } = await admin
    .from('profiles')
    .select('nombre, apellido, telefono')
    .eq('id', perro.user_id)
    .single();

  const labs   = (estudios ?? []).filter((e) => e.tipo === 'laboratorio');
  const radios = (estudios ?? []).filter((e) => e.tipo === 'radiografia');
  const ecos   = (estudios ?? []).filter((e) => e.tipo === 'ecografia');

  const hoy = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const nombreDuenio = [profile?.nombre, profile?.apellido].filter(Boolean).join(' ') || 'Dueño';

  return (
    <div className="min-h-screen bg-[#f5f0eb] py-8 px-4">
      <div id="historia-print" className="mx-auto max-w-xl">

        <div className="mb-4 flex items-center justify-between no-print">
          <Link href="/mis-perros"
            className="inline-flex items-center gap-1 text-sm font-bold text-brand-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> Volver a Mis perros
          </Link>
          <PrintButton />
        </div>

        {/* Header Vecindog */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-muted">mivecindog.com.ar</p>
            <p className="text-[11px] text-ink-muted/60">Red vecinal de mascotas · Argentina</p>
          </div>
          <span className="text-2xl">🐾</span>
        </div>

        {/* Título */}
        <div className="mb-6 rounded-[24px] bg-brand-primary px-6 py-5 text-white">
          <p className="text-xs font-bold uppercase tracking-[2px] opacity-70 mb-1">Historia Clínica</p>
          <h1 className="font-display text-3xl font-black">{perro.nombre}</h1>
          <p className="mt-1 text-sm opacity-75">Emitida el {hoy}</p>
        </div>

        {/* Botón "Encontré este perro" + contacto dueño */}
        <EncontrePerroButton
          perroId={perroId}
          perroNombre={perro.nombre}
          perroFoto={perro.foto_url}
          nombreDuenio={nombreDuenio}
          telefonoDuenio={profile?.telefono ?? null}
        />

        {/* Perfil */}
        <Section titulo="Perfil del Paciente" lleno>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {([
              ['Raza',      perro.raza],
              ['Color',     perro.color],
              ['Sexo',      perro.sexo],
              ['Tamaño',    perro.tamano],
              ['Microchip', perro.chip],
              ['Fecha nac.', perro.fecha_nac ? fmt(perro.fecha_nac) : null],
              ['Esterilizado', perro.esterilizado ? 'Sí' : 'No'],
            ] as [string, string | null | undefined][]).filter(([, v]) => v).map(([label, value]) => (
              <div key={label}>
                <p className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">{label}</p>
                <p className="font-semibold text-ink capitalize">{value}</p>
              </div>
            ))}
          </div>
          {perro.descripcion && (
            <p className="mt-3 text-sm text-ink-muted italic border-t border-black/5 pt-3">
              {perro.descripcion}
            </p>
          )}
        </Section>

        {/* Vacunas */}
        <Section titulo="Carnet de Vacunas" lleno={(vacunas ?? []).length > 0}>
          {(vacunas ?? []).length > 0 ? (
            <div className="divide-y divide-black/5">
              {(vacunas ?? []).map((v) => (
                <div key={v.id} className="flex items-start justify-between py-2.5">
                  <div>
                    <p className="font-semibold text-ink">{v.nombre}</p>
                    {v.veterinario && <p className="text-xs text-ink-muted">{v.veterinario}</p>}
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-xs font-bold text-ink-muted">{fmt(v.fecha)}</p>
                    {v.proxima && (
                      <p className={`text-[11px] font-bold ${new Date(v.proxima) < new Date() ? 'text-bad' : 'text-good'}`}>
                        Próx: {fmt(v.proxima)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </Section>

        {/* Análisis */}
        <Section titulo="Análisis de Laboratorio" lleno={labs.length > 0}>
          {labs.length > 0 ? <ArchivosList items={labs} /> : null}
        </Section>

        {/* Radiografías */}
        <Section titulo="Radiografías" lleno={radios.length > 0}>
          {radios.length > 0 ? <ArchivosList items={radios} /> : null}
        </Section>

        {/* Ecografías */}
        <Section titulo="Ecografías" lleno={ecos.length > 0}>
          {ecos.length > 0 ? <ArchivosList items={ecos} /> : null}
        </Section>

        {/* Avisos históricos */}
        <Section titulo="Historial de avisos" lleno={(posts ?? []).length > 0}>
          {(posts ?? []).length > 0 ? (
            <div className="space-y-3">
              {(posts ?? []).map((post) => {
                const catLabel =
                  post.categoria === 'perdido'    ? 'Perdido'      :
                  post.categoria === 'encontrado' ? 'Visto'        : 'En adopción';
                const catColor =
                  post.categoria === 'perdido'    ? 'bg-[#D7503A] text-white' :
                  post.categoria === 'encontrado' ? 'bg-[#3F8B5C] text-white' :
                  'bg-[#E8A53C] text-[#5b3a0e]';
                const resuelto = post.estado === 'resuelto';

                return (
                  <Link
                    key={post.id}
                    href={`/publicaciones/${post.id}`}
                    className="flex items-center gap-3 rounded-2xl border border-black/5 bg-[#faf7f4] p-3 transition hover:border-brand-primary/20 hover:bg-white"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-brand-cream">
                      {post.images?.[0] ? (
                        <Image src={post.images[0]} alt="" fill className="object-cover" sizes="56px" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-2xl">🐾</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${catColor}`}>
                          {catLabel}
                        </span>
                        {resuelto && (
                          <span className="rounded-full bg-good/15 px-2 py-0.5 text-[10px] font-bold text-good">
                            ✓ Resuelto
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-ink truncate">
                        {post.nombre ?? perro.nombre}
                      </p>
                      <p className="text-xs text-ink-muted">
                        {post.zona} · {fmt(post.fecha ?? post.created_at)}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-brand-primary">Ver →</span>
                  </Link>
                );
              })}
            </div>
          ) : null}
        </Section>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-ink-muted/60">
            Historia Clínica generada por Vecindog · mivecindog.com.ar<br/>
            Este documento es de carácter informativo. No reemplaza la consulta veterinaria.
          </p>
        </div>

      </div>
    </div>
  );
}

function Section({ titulo, lleno, children }: {
  titulo: string; lleno: boolean; children?: React.ReactNode;
}) {
  return (
    <div className={`mb-4 rounded-2xl border p-4 bg-white ${lleno ? 'border-brand-primary/15' : 'border-black/5'}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">{titulo}</p>
        {!lleno && <span className="text-[11px] font-bold text-ink-muted/40">✗ Sin datos</span>}
      </div>
      {children}
    </div>
  );
}

function ArchivosList({ items }: { items: Array<{ id: string; nombre: string; fecha: string | null; archivo_url: string }> }) {
  return (
    <div className="divide-y divide-black/5">
      {items.map((e) => (
        <div key={e.id} className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-semibold text-ink truncate max-w-[200px]">{e.nombre}</p>
            {e.fecha && <p className="text-[11px] text-ink-muted">{fmt(e.fecha)}</p>}
          </div>
          <a href={e.archivo_url} target="_blank" rel="noopener noreferrer"
            className="shrink-0 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary hover:bg-brand-primary/20 transition">
            Ver →
          </a>
        </div>
      ))}
    </div>
  );
}

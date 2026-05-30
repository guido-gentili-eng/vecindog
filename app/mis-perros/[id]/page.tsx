'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Dog, Syringe, ChevronLeft, CheckCircle2, CalendarDays,
  Loader2, AlertCircle, Cpu, MapPin, Pencil, X, ImagePlus, Save,
} from 'lucide-react';
import {
  obtenerPerro, actualizarPerro, subirFotoPerro,
  type Perro, type Vacuna, type PerroInput,
} from '@/lib/perros';
import { nombreCorto } from '@/lib/ciudades';
import { useAuth } from '@/contexts/AuthContext';

export default function PerroDetallePage() {
  const { id }        = useParams<{ id: string }>();
  const searchParams  = useSearchParams();
  const esNuevo       = searchParams.get('nuevo') === '1';
  const { ciudad }    = useAuth();

  const [perro,     setPerro]    = useState<Perro | null>(null);
  const [cargando,  setCargando] = useState(true);
  const [editando,  setEditando] = useState(false);

  useEffect(() => {
    obtenerPerro(id).then(setPerro).finally(() => setCargando(false));
  }, [id]);

  if (cargando) return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Loader2 className="h-7 w-7 animate-spin text-brand-primary" />
    </div>
  );

  if (!perro) return (
    <div className="py-12 text-center">
      <AlertCircle className="mx-auto h-8 w-8 text-bad" />
      <p className="mt-3 font-bold text-ink">Perro no encontrado</p>
      <Link href="/mis-perros" className="btn-primary mt-4 inline-flex">Volver</Link>
    </div>
  );

  const vacunas = (perro.vacunas ?? []).sort((a, b) =>
    new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
  const edad = perro.fecha_nac ? calcularEdad(perro.fecha_nac) : null;

  return (
    <div className="mx-auto max-w-2xl py-8 md:py-10">
      <div className="mb-5 flex items-center justify-between">
        <Link
          href="/mis-perros"
          className="inline-flex items-center gap-1 text-sm font-semibold text-ink-muted transition hover:text-ink"
        >
          <ChevronLeft className="h-4 w-4" /> Mis perros
        </Link>
        {!editando && (
          <button
            type="button"
            onClick={() => setEditando(true)}
            className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-brand-primary/30 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/10"
          >
            <Pencil className="h-3.5 w-3.5" /> Editar perfil
          </button>
        )}
      </div>

      {esNuevo && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl bg-good/10 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-good" />
          <div>
            <p className="font-bold text-ink">¡{perro.nombre} está registrado!</p>
            <p className="text-sm text-ink-muted">
              Si algún día se pierde, ya tenés toda su info guardada. También podés publicar un aviso desde{' '}
              <Link href="/publicar?cat=perdido" className="font-bold text-brand-primary underline">Perdidos</Link>.
            </p>
          </div>
        </div>
      )}

      {editando ? (
        <EditForm
          perro={perro}
          onSave={(updated) => { setPerro(updated); setEditando(false); }}
          onCancel={() => setEditando(false)}
        />
      ) : (
        <>
          {/* Foto + nombre */}
          <div className="card mb-5 overflow-hidden p-0">
            <div className="relative aspect-[4/3] w-full bg-brand-cream">
              {perro.foto_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={perro.foto_url} alt={perro.nombre} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-brand-primary/20">
                  <Dog className="h-20 w-20" />
                </div>
              )}
            </div>
            <div className="p-5">
              <h1 className="font-display text-3xl font-black text-ink">{perro.nombre}</h1>
              <div className="mt-1 flex flex-wrap gap-2">
                {perro.raza         && <Chip>{perro.raza}</Chip>}
                {perro.color        && <Chip>{perro.color}</Chip>}
                {perro.sexo         && <Chip className="capitalize">{perro.sexo}</Chip>}
                {perro.tamano       && <Chip className="capitalize">{perro.tamano}</Chip>}
                {edad               && <Chip>{edad}</Chip>}
                {perro.esterilizado && <Chip className="text-good">Esterilizado/a</Chip>}
              </div>
              {perro.descripcion && (
                <p className="mt-3 text-sm text-ink-muted leading-relaxed">{perro.descripcion}</p>
              )}
            </div>
          </div>

          {/* Identificación */}
          <div className="card mb-5 p-5">
            <h2 className="mb-3 flex items-center gap-2 font-display text-base font-extrabold text-ink">
              <Cpu className="h-4 w-4 text-brand-primary" /> Identificación
            </h2>
            <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <DataItem label="Microchip"      value={perro.chip      || '—'} mono />
              <DataItem label="Fecha de nac."  value={perro.fecha_nac ? formatFecha(perro.fecha_nac) : '—'} />
              <DataItem label="Edad"           value={edad            || '—'} />
              <DataItem label="Ciudad"         value={ciudad ? nombreCorto(ciudad) : '—'} />
              <DataItem label="Esterilizado/a" value={perro.esterilizado ? 'Sí' : 'No'} />
            </dl>
          </div>

          {/* Vacunas */}
          <div className="card p-5">
            <h2 className="mb-4 flex items-center gap-2 font-display text-base font-extrabold text-ink">
              <Syringe className="h-4 w-4 text-brand-primary" /> Carnet de vacunas
              {vacunas.length > 0 && (
                <span className="ml-auto rounded-full bg-good/15 px-2 py-0.5 text-xs font-bold text-good">
                  {vacunas.length} registrada{vacunas.length > 1 ? 's' : ''}
                </span>
              )}
            </h2>
            {vacunas.length === 0 ? (
              <p className="text-sm text-ink-muted">No hay vacunas registradas.</p>
            ) : (
              <div className="space-y-3">
                {vacunas.map((v) => <VacunaItem key={v.id} vacuna={v} />)}
              </div>
            )}
          </div>

          {/* CTA publicar aviso */}
          <div className="mt-6 rounded-2xl bg-gradient-to-br from-brand-coral/10 to-brand-coral/5 p-5 ring-1 ring-brand-coral/20">
            <p className="text-sm font-bold text-ink">¿Perdiste a {perro.nombre}?</p>
            <p className="mt-0.5 text-xs text-ink-muted">
              Publicá un aviso ahora con toda esta información para que los vecinos te ayuden.
            </p>
            <Link
              href={`/publicar?cat=perdido&perro=${perro.id}`}
              className="mt-3 inline-flex items-center gap-1.5 rounded-2xl bg-brand-coral px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-coral-dark"
            >
              <MapPin className="h-3.5 w-3.5" /> Publicar aviso de búsqueda
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Formulario de edición ── */
function EditForm({
  perro,
  onSave,
  onCancel,
}: {
  perro: Perro;
  onSave: (updated: Perro) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<PerroInput>({
    nombre:       perro.nombre,
    raza:         perro.raza         ?? '',
    color:        perro.color        ?? '',
    tamano:       perro.tamano       ?? '',
    sexo:         perro.sexo         ?? '',
    fecha_nac:    perro.fecha_nac    ?? '',
    chip:         perro.chip         ?? '',
    esterilizado: perro.esterilizado ?? false,
    descripcion:  perro.descripcion  ?? '',
    direccion:    perro.direccion    ?? '',
    foto_url:     perro.foto_url     ?? '',
  });
  const [fotoFile,  setFotoFile]  = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string>(perro.foto_url ?? '');
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function campo<K extends keyof PerroInput>(k: K, v: PerroInput[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function onFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('La foto debe pesar menos de 5 MB.'); return; }
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
    setError('');
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      let fotoUrl = form.foto_url;
      if (fotoFile) fotoUrl = await subirFotoPerro(fotoFile);
      await actualizarPerro(perro.id, { ...form, foto_url: fotoUrl });
      onSave({ ...perro, ...form, foto_url: fotoUrl });
    } catch {
      setError('No se pudo guardar. Intentá de nuevo.');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {/* Foto */}
      <div className="card overflow-hidden p-0">
        <div
          className="relative aspect-[4/3] w-full cursor-pointer bg-brand-cream"
          onClick={() => fileRef.current?.click()}
        >
          {fotoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fotoPreview} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-brand-primary/40">
              <ImagePlus className="h-12 w-12" />
              <span className="text-sm font-bold">Subir foto</span>
            </div>
          )}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-xl bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
            <ImagePlus className="h-3.5 w-3.5" /> Cambiar foto
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFoto} />
      </div>

      {/* Campos */}
      <div className="card space-y-4 p-5">
        <div>
          <label className="label">Nombre <span className="text-bad">*</span></label>
          <input className="field w-full" value={form.nombre} required
            onChange={(e) => campo('nombre', e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Raza</label>
            <input className="field w-full" value={form.raza} placeholder="Labrador, mestizo…"
              onChange={(e) => campo('raza', e.target.value)} />
          </div>
          <div>
            <label className="label">Color</label>
            <input className="field w-full" value={form.color} placeholder="Negro, marrón…"
              onChange={(e) => campo('color', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Sexo</label>
            <div className="flex gap-2">
              {(['macho', 'hembra'] as const).map((s) => (
                <button key={s} type="button"
                  onClick={() => campo('sexo', form.sexo === s ? '' : s)}
                  className={`flex-1 rounded-2xl border-2 py-2.5 text-sm font-bold capitalize transition ${
                    form.sexo === s ? 'border-brand-primary bg-brand-primary/10 text-brand-primary' : 'border-black/10 text-ink-muted hover:border-brand-primary/40'
                  }`}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Tamaño</label>
            <div className="flex gap-1">
              {([['pequeño','S'], ['mediano','M'], ['grande','L']] as const).map(([t, l]) => (
                <button key={t} type="button"
                  onClick={() => campo('tamano', form.tamano === t ? '' : t)}
                  className={`flex-1 rounded-2xl border-2 py-2.5 text-sm font-bold transition ${
                    form.tamano === t ? 'border-brand-primary bg-brand-primary/10 text-brand-primary' : 'border-black/10 text-ink-muted hover:border-brand-primary/40'
                  }`}>{l}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Fecha de nacimiento</label>
            <input type="date" className="field w-full" value={form.fecha_nac}
              onChange={(e) => campo('fecha_nac', e.target.value)} />
          </div>
          <div>
            <label className="label">Microchip</label>
            <input className="field w-full font-mono" value={form.chip} placeholder="Nº de chip"
              onChange={(e) => campo('chip', e.target.value)} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="edit-ester" checked={form.esterilizado}
            onChange={(e) => campo('esterilizado', e.target.checked)}
            className="h-4 w-4 accent-brand-primary" />
          <label htmlFor="edit-ester" className="text-sm font-semibold text-ink">Esterilizado/a</label>
        </div>

        <div>
          <label className="label">Descripción</label>
          <textarea className="field w-full" rows={3} value={form.descripcion}
            placeholder="Marcas especiales, comportamiento…"
            onChange={(e) => campo('descripcion', e.target.value)} />
        </div>
      </div>

      {error && (
        <p className="flex items-center gap-2 rounded-2xl bg-bad/10 p-3 text-sm font-bold text-bad">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </p>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={onCancel}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border-2 border-black/10 py-3 text-sm font-bold text-ink-muted transition hover:border-bad/40 hover:text-bad">
          <X className="h-4 w-4" /> Cancelar
        </button>
        <button type="submit" disabled={saving}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-brand-primary py-3 text-sm font-bold text-white shadow-soft transition hover:opacity-90 disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> Guardar cambios</>}
        </button>
      </div>
    </form>
  );
}

/* ── Sub-componentes ── */
function Chip({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`rounded-full bg-brand-cream px-2.5 py-0.5 text-xs font-semibold text-ink ${className}`}>
      {children}
    </span>
  );
}

function DataItem({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">{label}</dt>
      <dd className={`mt-0.5 text-sm font-semibold text-ink ${mono ? 'font-mono' : ''}`}>{value}</dd>
    </div>
  );
}

function VacunaItem({ vacuna }: { vacuna: Vacuna }) {
  const proxima = vacuna.proxima ? new Date(vacuna.proxima) : null;
  const vencida  = proxima && proxima < new Date();
  return (
    <div className="rounded-2xl bg-brand-cream p-3.5">
      <div className="flex items-start justify-between gap-2">
        <span className="font-bold text-ink">{vacuna.nombre}</span>
        {proxima && (
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${vencida ? 'bg-bad/15 text-bad' : 'bg-good/15 text-good'}`}>
            {vencida ? 'Vencida' : 'Vigente'}
          </span>
        )}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
        <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {formatFecha(vacuna.fecha)}</span>
        {vacuna.veterinario && <span>{vacuna.veterinario}</span>}
        {proxima && <span className={vencida ? 'font-bold text-bad' : ''}>Próxima: {formatFecha(vacuna.proxima)}</span>}
      </div>
      {vacuna.notas && <p className="mt-1 text-[11px] text-ink-muted/70 italic">{vacuna.notas}</p>}
    </div>
  );
}

function calcularEdad(fechaNac: string): string {
  const hoy   = new Date();
  const nac   = new Date(fechaNac);
  const meses = (hoy.getFullYear() - nac.getFullYear()) * 12 + (hoy.getMonth() - nac.getMonth());
  if (meses < 1)  return 'Cachorro';
  if (meses < 12) return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
  const a = Math.floor(meses / 12);
  return `${a} ${a === 1 ? 'año' : 'años'}`;
}

function formatFecha(iso: string): string {
  if (!iso) return '—';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}

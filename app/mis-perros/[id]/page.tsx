'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Dog, Syringe, ChevronLeft, CheckCircle2, CalendarDays,
  Loader2, AlertCircle, Cpu, MapPin, Pencil, X, ImagePlus, Save,
  RefreshCw, Search, FileText, FlaskConical, ScanLine, Activity,
  Upload, Trash2, Send, Mail, MessageCircle, Copy, Check,
} from 'lucide-react';
import {
  obtenerPerro, actualizarPerro, subirFotoPerro,
  type Perro, type Vacuna, type PerroInput,
} from '@/lib/perros';
import { buscarPostActivoDePerro, renovarPost, type Post } from '@/lib/posts';
import {
  listarEstudios, subirArchivoEstudio, agregarEstudio, eliminarEstudio,
  type Estudio, type TipoEstudio,
} from '@/lib/estudios';
import RazaAutocomplete from '@/components/RazaAutocomplete';
import PerroDocumento from '@/components/PerroDocumento';
import { nombreCorto } from '@/lib/ciudades';
import { useAuth } from '@/contexts/AuthContext';

export default function PerroDetallePage() {
  const { id }        = useParams<{ id: string }>();
  const searchParams  = useSearchParams();
  const esNuevo       = searchParams.get('nuevo') === '1';
  const { ciudad, profile } = useAuth();

  const [perro,             setPerro]             = useState<Perro | null>(null);
  const [postActivo,        setPostActivo]        = useState<Post | null | undefined>(undefined);
  const [estudios,          setEstudios]          = useState<Estudio[]>([]);
  const [cargando,          setCargando]          = useState(true);
  const [editando,          setEditando]          = useState(false);
  const [renovando,         setRenovando]         = useState(false);
  const [renovado,          setRenovado]          = useState(false);
  const [subiendoTipo,      setSubiendoTipo]      = useState<TipoEstudio | null>(null);
  const [estudioEnviar,     setEstudioEnviar]     = useState<Estudio | null>(null);

  useEffect(() => {
    obtenerPerro(id)
      .then((p) => {
        setPerro(p);
        if (p) {
          buscarPostActivoDePerro(p.id).then(setPostActivo);
          listarEstudios(p.id).then(setEstudios);
        }
        return null;
      })
      .finally(() => setCargando(false));
  }, [id]);

  async function handleSubirEstudio(tipo: TipoEstudio, file: File) {
    if (!perro) return;
    setSubiendoTipo(tipo);
    try {
      const url   = await subirArchivoEstudio(file);
      const nuevo = await agregarEstudio({
        perro_id:    perro.id,
        tipo,
        nombre:      file.name,
        archivo_url: url,
        fecha:       new Date().toISOString().slice(0, 10),
        notas:       null,
      });
      setEstudios((prev) => [nuevo, ...prev]);
    } finally {
      setSubiendoTipo(null);
    }
  }

  async function handleEliminarEstudio(id: string) {
    await eliminarEstudio(id);
    setEstudios((prev) => prev.filter((e) => e.id !== id));
  }

  async function handleRenovar() {
    if (!postActivo) return;
    setRenovando(true);
    try {
      await renovarPost(postActivo.id);
      setRenovado(true);
    } finally {
      setRenovando(false);
    }
  }

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
          <div className="flex gap-2">
            {postActivo && (
              <Link
                href={`/mis-perros/${id}/cartel`}
                className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-black/10 px-3 py-1.5 text-xs font-bold text-ink-muted transition hover:border-brand-primary/40 hover:text-brand-primary"
              >
                <FileText className="h-3.5 w-3.5" /> Generar cartel
              </Link>
            )}
            <button
              type="button"
              onClick={() => setEditando(true)}
              className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-brand-primary/30 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/10"
            >
              <Pencil className="h-3.5 w-3.5" /> Editar perfil
            </button>
          </div>
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
          {/* Documento / ficha del perro — compact */}
          <div className="mb-5">
            <PerroDocumento
              perro={perro}
              profile={profile}
              perdido={!!postActivo}
              compact
            />
          </div>

          {/* Header del perro: foto chica + nombre + chips */}
          <div className="card mb-5 flex items-center gap-4 p-4">
            {perro.foto_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={perro.foto_url} alt={perro.nombre}
                className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-cream">
                <Dog className="h-8 w-8 text-brand-primary/30" />
              </div>
            )}
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-black text-ink leading-tight">{perro.nombre}</h1>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {perro.raza         && <Chip>{perro.raza}</Chip>}
                {perro.color        && <Chip>{perro.color}</Chip>}
                {perro.sexo         && <Chip className="capitalize">{perro.sexo}</Chip>}
                {perro.tamano       && <Chip className="capitalize">{perro.tamano}</Chip>}
                {edad               && <Chip>{edad}</Chip>}
                {perro.esterilizado && <Chip className="text-good">Esterilizado/a</Chip>}
              </div>
              {perro.descripcion && (
                <p className="mt-2 text-xs text-ink-muted leading-relaxed line-clamp-2">{perro.descripcion}</p>
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
          <div className="card p-5 mb-5">
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

          {/* Análisis de Laboratorio */}
          <EstudiosSection
            tipo="laboratorio"
            titulo="Análisis de Laboratorio"
            icono={<FlaskConical className="h-4 w-4 text-brand-primary" />}
            accept="image/*,video/*,.pdf"
            estudios={estudios.filter((e) => e.tipo === 'laboratorio')}
            subiendo={subiendoTipo === 'laboratorio'}
            onSubir={(f) => handleSubirEstudio('laboratorio', f)}
            onEnviar={setEstudioEnviar}
            onEliminar={handleEliminarEstudio}
          />

          {/* Radiografía */}
          <EstudiosSection
            tipo="radiografia"
            titulo="Radiografías"
            icono={<ScanLine className="h-4 w-4 text-brand-primary" />}
            accept="image/*,video/*,.pdf"
            estudios={estudios.filter((e) => e.tipo === 'radiografia')}
            subiendo={subiendoTipo === 'radiografia'}
            onSubir={(f) => handleSubirEstudio('radiografia', f)}
            onEnviar={setEstudioEnviar}
            onEliminar={handleEliminarEstudio}
          />

          {/* Ecografías */}
          <EstudiosSection
            tipo="ecografia"
            titulo="Ecografías"
            icono={<Activity className="h-4 w-4 text-brand-primary" />}
            accept="image/*,video/*,.pdf"
            estudios={estudios.filter((e) => e.tipo === 'ecografia')}
            subiendo={subiendoTipo === 'ecografia'}
            onSubir={(f) => handleSubirEstudio('ecografia', f)}
            onEnviar={setEstudioEnviar}
            onEliminar={handleEliminarEstudio}
          />

          {/* Modal enviar estudio */}
          {estudioEnviar && (
            <EnviarEstudioModal
              estudio={estudioEnviar}
              perroNombre={perro.nombre}
              onClose={() => setEstudioEnviar(null)}
            />
          )}

          {/* Historia Clínica */}
          <HistoriaClinica
            perro={perro}
            vacunas={vacunas}
            estudios={estudios}
            ciudad={ciudad ?? null}
            edad={edad}
          />

          {/* CTA: aviso activo o publicar */}
          {postActivo !== undefined && (
            postActivo ? (
              /* Ya tiene aviso activo */
              <div className="mt-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-5 ring-1 ring-amber-200">
                <div className="flex items-center gap-2 mb-1">
                  <Search className="h-4 w-4 text-amber-600" />
                  <p className="text-sm font-bold text-ink">Aviso activo — en búsqueda</p>
                </div>
                <p className="text-xs text-ink-muted mb-3">
                  Ya hay un aviso publicado para {perro.nombre}. ¿Lo seguís buscando? Renovalo para que aparezca primero.
                </p>
                <div className="flex gap-2">
                  {renovado ? (
                    <span className="inline-flex items-center gap-1.5 rounded-2xl bg-good/15 px-4 py-2 text-sm font-bold text-good">
                      <CheckCircle2 className="h-3.5 w-3.5" /> ¡Aviso renovado!
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRenovar}
                      disabled={renovando}
                      className="inline-flex items-center gap-1.5 rounded-2xl bg-amber-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-amber-600 disabled:opacity-60"
                    >
                      {renovando
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <RefreshCw className="h-3.5 w-3.5" />}
                      ¿Seguís buscando? Renovar aviso
                    </button>
                  )}
                  <Link
                    href={`/publicaciones/${postActivo.id}`}
                    className="inline-flex items-center gap-1 rounded-2xl border-2 border-amber-200 px-4 py-2 text-sm font-bold text-amber-700 transition hover:bg-amber-50"
                  >
                    Ver aviso
                  </Link>
                </div>
              </div>
            ) : (
              /* Sin aviso activo */
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
            )
          )}
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
      onSave({ ...perro, ...form, tamano: form.tamano || null, sexo: form.sexo || null, foto_url: fotoUrl });
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
            <RazaAutocomplete value={form.raza} onChange={(v) => campo('raza', v)} />
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

/* ── Sección de estudios ── */
function EstudiosSection({
  tipo, titulo, icono, accept, estudios, subiendo, onSubir, onEnviar, onEliminar,
}: {
  tipo:       TipoEstudio;
  titulo:     string;
  icono:      React.ReactNode;
  accept:     string;
  estudios:   Estudio[];
  subiendo:   boolean;
  onSubir:    (f: File) => Promise<void>;
  onEnviar:   (e: Estudio) => void;
  onEliminar: (id: string) => void;
}) {
  const fileRef                     = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');

  async function confirmarSubida() {
    if (!pendingFile) return;
    setUploadError('');
    try {
      await onSubir(pendingFile);
      setPendingFile(null);
    } catch {
      setUploadError('No se pudo subir el archivo. Verificá tu conexión e intentá de nuevo.');
    }
  }

  return (
    <div className="card p-5 mb-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink">
          {icono} {titulo}
          {estudios.length > 0 && (
            <span className="ml-1 rounded-full bg-brand-primary/10 px-2 py-0.5 text-xs font-bold text-brand-primary">
              {estudios.length}
            </span>
          )}
        </h2>
        {!pendingFile && (
          <button
            type="button"
            onClick={() => { setUploadError(''); fileRef.current?.click(); }}
            disabled={subiendo}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20 disabled:opacity-60"
          >
            <Upload className="h-3.5 w-3.5" /> Subir archivo
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) { setPendingFile(f); setUploadError(''); }
            e.target.value = '';
          }}
        />
      </div>

      {/* Confirmación de subida */}
      {pendingFile && (
        <div className="mb-4 rounded-2xl border-2 border-brand-primary/30 bg-brand-primary/5 p-4">
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-ink truncate">{pendingFile.name}</p>
              <p className="text-xs text-ink-muted">{(pendingFile.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
          </div>
          {uploadError && (
            <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-bad">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {uploadError}
            </p>
          )}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={confirmarSubida}
              disabled={subiendo}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary py-2.5 text-sm font-bold text-white transition hover:bg-brand-primary/90 disabled:opacity-60"
            >
              {subiendo ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4" /> Confirmar y subir</>}
            </button>
            <button
              type="button"
              onClick={() => { setPendingFile(null); setUploadError(''); }}
              disabled={subiendo}
              className="rounded-xl border-2 border-black/10 px-4 py-2.5 text-sm font-bold text-ink-muted transition hover:border-bad/40 hover:text-bad disabled:opacity-60"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {estudios.length === 0 && !pendingFile ? (
        <p className="text-sm text-ink-muted">No hay archivos subidos.</p>
      ) : estudios.length > 0 ? (
        <div className="space-y-2">
          {estudios.map((e) => (
            <div key={e.id} className="flex items-center gap-3 rounded-2xl bg-brand-cream px-4 py-3">
              <FileText className="h-4 w-4 shrink-0 text-brand-primary/60" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{e.nombre}</p>
                {e.fecha && <p className="text-xs text-ink-muted">{formatFecha(e.fecha)}</p>}
              </div>
              <a href={e.archivo_url} target="_blank" rel="noopener noreferrer"
                className="text-xs font-bold text-brand-primary hover:underline shrink-0">
                Ver
              </a>
              <button type="button" onClick={() => onEnviar(e)}
                className="inline-flex items-center gap-1 rounded-xl bg-brand-primary px-2.5 py-1.5 text-xs font-bold text-white transition hover:bg-brand-primary/90 shrink-0">
                <Send className="h-3 w-3" /> Enviar
              </button>
              <button type="button" onClick={() => onEliminar(e.id)}
                className="text-ink-muted/40 hover:text-bad transition shrink-0">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ── Modal enviar estudio ── */
function EnviarEstudioModal({
  estudio, perroNombre, onClose,
}: {
  estudio:      Estudio;
  perroNombre:  string;
  onClose:      () => void;
}) {
  const [email,  setEmail]  = useState('');
  const [copied, setCopied] = useState(false);

  const texto = `Estudio de ${perroNombre} — ${estudio.nombre}\n${estudio.archivo_url}`;

  function enviarEmail() {
    const subject = encodeURIComponent(`Estudio de ${perroNombre}: ${estudio.nombre}`);
    const body    = encodeURIComponent(`Hola,\n\nTe comparto el estudio "${estudio.nombre}" de ${perroNombre}:\n${estudio.archivo_url}`);
    const to      = encodeURIComponent(email.trim());
    window.open(`mailto:${to}?subject=${subject}&body=${body}`, '_blank');
  }

  function enviarWhatsApp() {
    const msg = encodeURIComponent(texto);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  }

  async function copiarLink() {
    await navigator.clipboard.writeText(estudio.archivo_url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-0 sm:items-center sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-sm rounded-t-[32px] bg-white px-7 pb-8 pt-7 shadow-2xl sm:rounded-[32px]">
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-black/10 sm:hidden" />

        <div className="mb-5">
          <h2 className="font-display text-xl font-black text-ink">Enviar estudio</h2>
          <p className="mt-1 text-sm text-ink-muted truncate">{estudio.nombre}</p>
        </div>

        {/* Copiar link */}
        <button type="button" onClick={copiarLink}
          className="mb-4 flex w-full items-center justify-between gap-2 rounded-2xl bg-brand-cream px-4 py-3 text-sm font-semibold text-ink transition hover:bg-brand-primary/10">
          <span className="truncate text-xs text-ink-muted">{estudio.archivo_url}</span>
          {copied
            ? <Check className="h-4 w-4 shrink-0 text-good" />
            : <Copy className="h-4 w-4 shrink-0 text-brand-primary" />}
        </button>

        {/* Email */}
        <div className="mb-3">
          <label className="label mb-1 flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-brand-primary" /> Enviar por email
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="destinatario@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field flex-1 text-sm"
            />
            <button
              type="button"
              onClick={enviarEmail}
              disabled={!email.trim()}
              className="rounded-2xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-primary/90 disabled:opacity-40"
            >
              Enviar
            </button>
          </div>
        </div>

        <div className="my-4 flex items-center gap-3">
          <div className="flex-1 border-t border-black/10" />
          <span className="text-xs text-ink-muted">o</span>
          <div className="flex-1 border-t border-black/10" />
        </div>

        {/* WhatsApp */}
        <button type="button" onClick={enviarWhatsApp}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3 text-sm font-bold text-white transition hover:bg-[#1ebe5d]">
          <MessageCircle className="h-4 w-4" /> Enviar por WhatsApp
        </button>

        <button type="button" onClick={onClose}
          className="mt-3 w-full rounded-2xl border-2 border-black/10 py-2.5 text-sm font-bold text-ink-muted transition hover:border-black/20">
          Cancelar
        </button>
      </div>
    </div>
  );
}

/* ── Historia Clínica completa ── */
function HistoriaClinica({
  perro, vacunas, estudios, ciudad, edad,
}: {
  perro:    Perro;
  vacunas:  Vacuna[];
  estudios: Estudio[];
  ciudad:   string | null;
  edad:     string | null;
}) {
  const labs  = estudios.filter((e) => e.tipo === 'laboratorio');
  const radios = estudios.filter((e) => e.tipo === 'radiografia');
  const ecos  = estudios.filter((e) => e.tipo === 'ecografia');

  return (
    <div className="card p-5 mb-5 mt-2">
      {/* Título */}
      <div className="flex items-center gap-2 mb-5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-primary/10 text-brand-primary">
          <FileText className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-base font-extrabold text-ink">Historia Clínica</h2>
          <p className="text-[11px] text-ink-muted">{perro.nombre} · resumen completo</p>
        </div>
      </div>

      <div className="space-y-4">

        {/* ── Perfil ── */}
        <HCSection titulo="Perfil" lleno>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            {[
              ['Raza',      perro.raza],
              ['Color',     perro.color],
              ['Sexo',      perro.sexo],
              ['Tamaño',    perro.tamano],
              ['Microchip', perro.chip],
              ['Edad',      edad],
              ['Ciudad',    ciudad],
              ['Esterilizado', perro.esterilizado ? 'Sí' : null],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={label as string}>
                <span className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">{label}</span>
                <p className="font-semibold text-ink capitalize">{value as string}</p>
              </div>
            ))}
          </div>
          {perro.descripcion && (
            <p className="mt-2 text-xs text-ink-muted italic border-t border-black/5 pt-2">
              {perro.descripcion}
            </p>
          )}
        </HCSection>

        {/* ── Vacunas ── */}
        <HCSection titulo="Carnet de Vacunas" lleno={vacunas.length > 0}>
          {vacunas.length > 0 ? (
            <div className="space-y-1.5">
              {vacunas.map((v) => (
                <div key={v.id} className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink">{v.nombre}</span>
                  <span className="text-xs text-ink-muted">{formatFecha(v.fecha)}</span>
                </div>
              ))}
            </div>
          ) : null}
        </HCSection>

        {/* ── Análisis ── */}
        <HCSection titulo="Análisis de Laboratorio" lleno={labs.length > 0}>
          {labs.length > 0 ? (
            <EstudiosList estudios={labs} />
          ) : null}
        </HCSection>

        {/* ── Radiografías ── */}
        <HCSection titulo="Radiografías" lleno={radios.length > 0}>
          {radios.length > 0 ? (
            <EstudiosList estudios={radios} />
          ) : null}
        </HCSection>

        {/* ── Ecografías ── */}
        <HCSection titulo="Ecografías" lleno={ecos.length > 0}>
          {ecos.length > 0 ? (
            <EstudiosList estudios={ecos} />
          ) : null}
        </HCSection>

      </div>
    </div>
  );
}

function HCSection({
  titulo, lleno, children,
}: {
  titulo:   string;
  lleno:    boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border ${lleno ? 'border-brand-primary/15 bg-brand-cream/40' : 'border-black/5 bg-black/2'} p-3`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">{titulo}</span>
        {!lleno && (
          <span className="flex items-center gap-0.5 text-[11px] font-bold text-ink-muted/40">
            <X className="h-3.5 w-3.5" /> Sin datos
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function EstudiosList({ estudios }: { estudios: Estudio[] }) {
  return (
    <div className="space-y-1.5">
      {estudios.map((e) => (
        <div key={e.id} className="flex items-center justify-between text-sm">
          <span className="font-semibold text-ink truncate max-w-[70%]">{e.nombre}</span>
          <a
            href={e.archivo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-brand-primary hover:underline shrink-0"
          >
            Ver →
          </a>
        </div>
      ))}
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

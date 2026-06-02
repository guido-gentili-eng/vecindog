'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Dog, Syringe, ChevronLeft, CheckCircle2, CalendarDays,
  Loader2, AlertCircle, Cpu, MapPin, Pencil, X, ImagePlus, Save,
  RefreshCw, Search, FileText, FlaskConical, ScanLine, Activity,
  Upload, Trash2, Send, Mail, MessageCircle, Copy, Check, Download,
  Globe, ChevronDown,
} from 'lucide-react';
import {
  obtenerPerro, actualizarPerro, subirFotoPerro,
  agregarVacuna, actualizarVacuna, eliminarVacuna,
  VACUNAS_COMUNES,
  type Perro, type Vacuna, type VacunaInput, type PerroInput,
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
  const [vacunas,           setVacunas]           = useState<Vacuna[]>([]);
  const [cargando,          setCargando]          = useState(true);
  const [editando,          setEditando]          = useState(false);
  const [renovando,         setRenovando]         = useState(false);
  const [renovado,          setRenovado]          = useState(false);
  const [subiendoTipo,      setSubiendoTipo]      = useState<TipoEstudio | null>(null);
  const [estudioEnviar,     setEstudioEnviar]     = useState<Estudio | null>(null);
  const [editandoVacunaId,  setEditandoVacunaId]  = useState<string | null>(null);
  const [agregandoVacuna,   setAgregandoVacuna]   = useState(false);

  useEffect(() => {
    obtenerPerro(id)
      .then((p) => {
        setPerro(p);
        if (p) {
          const sorted = (p.vacunas ?? []).sort((a, b) =>
            new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          );
          setVacunas(sorted);
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

  const sortVacunas = (list: Vacuna[]) =>
    [...list].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  async function handleAgregarVacuna(input: VacunaInput) {
    if (!perro) return;
    const nueva = await agregarVacuna(perro.id, input);
    setVacunas((prev) => sortVacunas([nueva, ...prev]));
    setAgregandoVacuna(false);
  }

  async function handleActualizarVacuna(vacunaId: string, input: VacunaInput) {
    await actualizarVacuna(vacunaId, input);
    setVacunas((prev) => sortVacunas(prev.map((v) => v.id === vacunaId ? { ...v, ...input } : v)));
    setEditandoVacunaId(null);
  }

  async function handleEliminarVacuna(vacunaId: string) {
    await eliminarVacuna(vacunaId);
    setVacunas((prev) => prev.filter((v) => v.id !== vacunaId));
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
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink">
                <Cpu className="h-4 w-4 text-brand-primary" /> Identificación
              </h2>
              <Link
                href={`/mis-perros/${id}/cartel`}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20"
              >
                <Download className="h-3.5 w-3.5" /> Guardar / Enviar PDF
              </Link>
            </div>
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
            <div className="mb-4 flex items-center gap-2">
              <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink">
                <Syringe className="h-4 w-4 text-brand-primary" /> Carnet de vacunas
                {vacunas.length > 0 && (
                  <span className="rounded-full bg-good/15 px-2 py-0.5 text-xs font-bold text-good">
                    {vacunas.length} registrada{vacunas.length > 1 ? 's' : ''}
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={() => { setAgregandoVacuna(true); setEditandoVacunaId(null); }}
                className="ml-auto inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20"
              >
                + Agregar
              </button>
            </div>

            {agregandoVacuna && (
              <VacunaForm
                onSave={handleAgregarVacuna}
                onCancel={() => setAgregandoVacuna(false)}
              />
            )}

            {vacunas.length === 0 && !agregandoVacuna ? (
              <p className="text-sm text-ink-muted">No hay vacunas registradas.</p>
            ) : (
              <div className="space-y-3">
                {vacunas.map((v) =>
                  editandoVacunaId === v.id ? (
                    <VacunaForm
                      key={v.id}
                      inicial={v}
                      onSave={(input) => handleActualizarVacuna(v.id, input)}
                      onCancel={() => setEditandoVacunaId(null)}
                    />
                  ) : (
                    <VacunaItem
                      key={v.id}
                      vacuna={v}
                      onEdit={() => { setEditandoVacunaId(v.id); setAgregandoVacuna(false); }}
                      onDelete={() => handleEliminarVacuna(v.id)}
                    />
                  )
                )}
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

          {/* Certificado de Chip */}
          <ChipCertificadoSection
            perro={perro}
            estudios={estudios.filter((e) => e.tipo === 'certificado_chip')}
            subiendo={subiendoTipo === 'certificado_chip'}
            onSubir={(f) => handleSubirEstudio('certificado_chip', f)}
            onEnviar={setEstudioEnviar}
            onEliminar={handleEliminarEstudio}
            onChipUpdate={(chip) => setPerro((p) => p ? { ...p, chip } : p)}
          />

          {/* Certificado CVI */}
          <CVISection
            estudios={estudios.filter((e) => e.tipo === 'certificado_cvi')}
            subiendo={subiendoTipo === 'certificado_cvi'}
            onSubir={(f) => handleSubirEstudio('certificado_cvi', f)}
            onEnviar={setEstudioEnviar}
            onEliminar={handleEliminarEstudio}
          />

          {/* Certificado Antiparasitario */}
          <EstudiosSection
            tipo="certificado_antiparasitario"
            titulo="Certificado Antiparasitario"
            icono={<Activity className="h-4 w-4 text-brand-primary" />}
            accept="image/*,.pdf"
            estudios={estudios.filter((e) => e.tipo === 'certificado_antiparasitario')}
            subiendo={subiendoTipo === 'certificado_antiparasitario'}
            onSubir={(f) => handleSubirEstudio('certificado_antiparasitario', f)}
            onEnviar={setEstudioEnviar}
            onEliminar={handleEliminarEstudio}
          />

          {/* Vacuna Antirrábica */}
          <EstudiosSection
            tipo="vacuna_antirrabica"
            titulo="Vacuna Antirrábica"
            icono={<Syringe className="h-4 w-4 text-brand-primary" />}
            accept="image/*,.pdf"
            estudios={estudios.filter((e) => e.tipo === 'vacuna_antirrabica')}
            subiendo={subiendoTipo === 'vacuna_antirrabica'}
            onSubir={(f) => handleSubirEstudio('vacuna_antirrabica', f)}
            onEnviar={setEstudioEnviar}
            onEliminar={handleEliminarEstudio}
          />

          {/* AirTag */}
          <AirTagSection
            perroId={perro.id}
            airtags={estudios.filter((e) => e.tipo === 'airtag')}
            onAdd={(e) => setEstudios((prev) => [e, ...prev])}
            onDelete={(id) => setEstudios((prev) => prev.filter((e) => e.id !== id))}
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

function VacunaItem({ vacuna, onEdit, onDelete }: {
  vacuna:   Vacuna;
  onEdit:   () => void;
  onDelete: () => void;
}) {
  const proxima = vacuna.proxima ? new Date(vacuna.proxima) : null;
  const vencida  = proxima && proxima < new Date();
  return (
    <div className="rounded-2xl bg-brand-cream p-3.5">
      <div className="flex items-start justify-between gap-2">
        <span className="font-bold text-ink">{vacuna.nombre}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {proxima && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${vencida ? 'bg-bad/15 text-bad' : 'bg-good/15 text-good'}`}>
              {vencida ? 'Vencida' : 'Vigente'}
            </span>
          )}
          <button type="button" onClick={onEdit}
            className="rounded-lg p-1 text-ink-muted/50 transition hover:bg-black/5 hover:text-brand-primary">
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={onDelete}
            className="rounded-lg p-1 text-ink-muted/50 transition hover:bg-bad/10 hover:text-bad">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
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

function VacunaForm({ inicial, onSave, onCancel }: {
  inicial?:  Vacuna;
  onSave:    (input: VacunaInput) => Promise<void>;
  onCancel:  () => void;
}) {
  const [form, setForm] = useState<VacunaInput>({
    nombre:      inicial?.nombre      ?? '',
    fecha:       inicial?.fecha       ?? new Date().toISOString().slice(0, 10),
    veterinario: inicial?.veterinario ?? '',
    proxima:     inicial?.proxima     ?? '',
    notas:       inicial?.notas       ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  function campo<K extends keyof VacunaInput>(k: K, v: VacunaInput[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre || !form.fecha) { setError('Nombre y fecha son obligatorios.'); return; }
    setSaving(true);
    setError('');
    try {
      await onSave(form);
    } catch {
      setError('No se pudo guardar. Intentá de nuevo.');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="rounded-2xl border-2 border-brand-primary/20 bg-brand-primary/5 p-4 space-y-3 mb-3">
      <div>
        <label className="label text-xs">Vacuna <span className="text-bad">*</span></label>
        <input
          list="vacunas-comunes"
          className="field w-full text-sm"
          placeholder="Séxtuple, Antirrábica…"
          value={form.nombre}
          onChange={(e) => campo('nombre', e.target.value)}
          required
        />
        <datalist id="vacunas-comunes">
          {VACUNAS_COMUNES.map((v) => <option key={v} value={v} />)}
        </datalist>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label text-xs">Fecha <span className="text-bad">*</span></label>
          <input type="date" className="field w-full text-sm" value={form.fecha}
            onChange={(e) => campo('fecha', e.target.value)} required />
        </div>
        <div>
          <label className="label text-xs">Próxima dosis</label>
          <input type="date" className="field w-full text-sm" value={form.proxima}
            onChange={(e) => campo('proxima', e.target.value)} />
        </div>
      </div>

      <div>
        <label className="label text-xs">Veterinario</label>
        <input className="field w-full text-sm" placeholder="Dr. García…" value={form.veterinario}
          onChange={(e) => campo('veterinario', e.target.value)} />
      </div>

      <div>
        <label className="label text-xs">Notas</label>
        <input className="field w-full text-sm" placeholder="Observaciones…" value={form.notas}
          onChange={(e) => campo('notas', e.target.value)} />
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-xs font-semibold text-bad">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
        </p>
      )}

      <div className="flex gap-2">
        <button type="submit" disabled={saving}
          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> {inicial ? 'Guardar cambios' : 'Agregar vacuna'}</>}
        </button>
        <button type="button" onClick={onCancel} disabled={saving}
          className="rounded-xl border-2 border-black/10 px-4 py-2.5 text-sm font-bold text-ink-muted transition hover:border-bad/40 hover:text-bad disabled:opacity-60">
          Cancelar
        </button>
      </div>
    </form>
  );
}

/* ── AirTag ── */
function AirTagSection({
  perroId, airtags, onAdd, onDelete,
}: {
  perroId:  string;
  airtags:  Estudio[];
  onAdd:    (e: Estudio) => void;
  onDelete: (id: string) => void;
}) {
  const [agregando, setAgregando] = useState(false);
  const [serial,    setSerial]    = useState('');
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    if (!serial.trim()) { setError('Ingresá el número de serie.'); return; }
    setSaving(true);
    setError('');
    try {
      const nuevo = await agregarEstudio({
        perro_id:    perroId,
        tipo:        'airtag',
        nombre:      serial.trim(),
        archivo_url: null,
        fecha:       new Date().toISOString().slice(0, 10),
        notas:       null,
      });
      onAdd(nuevo);
      setSerial('');
      setAgregando(false);
    } catch {
      setError('No se pudo guardar. Intentá de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card p-5 mb-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink">
          <span className="text-base">📍</span> AirTag de Apple
          {airtags.length > 0 && (
            <span className="ml-1 rounded-full bg-brand-primary/10 px-2 py-0.5 text-xs font-bold text-brand-primary">
              {airtags.length}
            </span>
          )}
        </h2>
        {!agregando && (
          <button type="button" onClick={() => setAgregando(true)}
            className="inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20">
            + Agregar
          </button>
        )}
      </div>

      {/* Formulario agregar */}
      {agregando && (
        <form onSubmit={handleGuardar} className="mb-4 rounded-2xl border-2 border-brand-primary/20 bg-brand-primary/5 p-4 space-y-3">
          <div>
            <label className="label text-xs">Número de serie del AirTag <span className="text-bad">*</span></label>
            <input
              className="field w-full font-mono text-sm"
              placeholder="Ej: XXXXXXXX"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              autoFocus
            />
            <p className="mt-1 text-[11px] text-ink-muted">
              Lo encontrás en Ajustes → Apple ID → Buscar → tu AirTag, o en la caja.
            </p>
          </div>
          {error && (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-bad">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
            </p>
          )}
          <div className="flex gap-2">
            <button type="submit" disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4" /> Guardar</>}
            </button>
            <button type="button" onClick={() => { setAgregando(false); setSerial(''); setError(''); }} disabled={saving}
              className="rounded-xl border-2 border-black/10 px-4 py-2.5 text-sm font-bold text-ink-muted transition hover:border-bad/40 hover:text-bad disabled:opacity-60">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Lista de AirTags */}
      {airtags.length === 0 && !agregando ? (
        <p className="text-sm text-ink-muted">No hay AirTag registrado.</p>
      ) : (
        <div className="space-y-3">
          {airtags.map((a) => (
            <div key={a.id} className="rounded-2xl bg-brand-cream p-3.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">N° de serie</p>
                  <p className="mt-0.5 font-mono text-sm font-bold text-ink">{a.nombre}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href="https://www.icloud.com/find"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-xl bg-brand-primary px-2.5 py-1.5 text-xs font-bold text-white transition hover:opacity-90"
                  >
                    <MapPin className="h-3 w-3" /> Find My
                  </a>
                  <button type="button" onClick={() => onDelete(a.id)}
                    className="rounded-lg p-1 text-ink-muted/40 transition hover:bg-bad/10 hover:text-bad">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tip modo perdido */}
      <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3">
        <p className="text-xs font-bold text-amber-700 mb-1">💡 Si se perdió tu perro</p>
        <p className="text-xs text-amber-600 leading-relaxed">
          Activá el <strong>Modo Perdido</strong> en la app Buscar de tu iPhone. Así cualquier iPhone cercano que detecte el AirTag te manda su ubicación automáticamente.
        </p>
        <a
          href="https://support.apple.com/es-ar/HT212331"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:underline"
        >
          <Globe className="h-3 w-3" /> Cómo activar Modo Perdido
        </a>
      </div>
    </div>
  );
}

/* ── Certificado de Chip ── */
function ChipCertificadoSection({
  perro, estudios, subiendo, onSubir, onEnviar, onEliminar, onChipUpdate,
}: {
  perro:         Perro;
  estudios:      Estudio[];
  subiendo:      boolean;
  onSubir:       (f: File) => Promise<void>;
  onEnviar:      (e: Estudio) => void;
  onEliminar:    (id: string) => void;
  onChipUpdate:  (chip: string) => void;
}) {
  const fileRef                       = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [editandoChip, setEditandoChip] = useState(false);
  const [chip,         setChip]         = useState(perro.chip ?? '');
  const [savingChip,   setSavingChip]   = useState(false);
  const [chipError,    setChipError]    = useState('');

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

  async function handleSaveChip(e: React.FormEvent) {
    e.preventDefault();
    setSavingChip(true);
    setChipError('');
    try {
      await actualizarPerro(perro.id, { chip });
      onChipUpdate(chip);
      setEditandoChip(false);
    } catch {
      setChipError('No se pudo guardar. Intentá de nuevo.');
    } finally {
      setSavingChip(false);
    }
  }

  return (
    <div className="card p-5 mb-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink">
          <Cpu className="h-4 w-4 text-brand-primary" /> Certificado de Chip
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
            <Upload className="h-3.5 w-3.5" /> Subir certificado
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) { setPendingFile(f); setUploadError(''); }
            e.target.value = '';
          }}
        />
      </div>

      {/* Número de chip */}
      <div className="mb-4 rounded-2xl bg-brand-cream p-3.5">
        {editandoChip ? (
          <form onSubmit={handleSaveChip} className="flex items-center gap-2">
            <input
              className="field flex-1 font-mono text-sm"
              placeholder="Nº de chip (15 dígitos)"
              value={chip}
              onChange={(e) => setChip(e.target.value)}
              autoFocus
            />
            <button type="submit" disabled={savingChip}
              className="inline-flex items-center gap-1 rounded-xl bg-brand-primary px-3 py-2 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-60 shrink-0">
              {savingChip ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Check className="h-3.5 w-3.5" /> Guardar</>}
            </button>
            <button type="button" onClick={() => { setEditandoChip(false); setChip(perro.chip ?? ''); }}
              className="rounded-xl border-2 border-black/10 px-3 py-2 text-xs font-bold text-ink-muted transition hover:border-bad/40 hover:text-bad shrink-0">
              Cancelar
            </button>
          </form>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">Número de chip</p>
              <p className={`mt-0.5 font-mono text-sm font-bold ${perro.chip ? 'text-ink' : 'text-ink-muted/50'}`}>
                {perro.chip || 'Sin registrar'}
              </p>
            </div>
            <button type="button" onClick={() => setEditandoChip(true)}
              className="inline-flex items-center gap-1 rounded-xl bg-black/5 px-3 py-1.5 text-xs font-bold text-ink-muted transition hover:bg-brand-primary/10 hover:text-brand-primary shrink-0">
              <Pencil className="h-3 w-3" /> {perro.chip ? 'Editar' : 'Agregar'}
            </button>
          </div>
        )}
        {chipError && (
          <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-bad">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {chipError}
          </p>
        )}
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
            <button type="button" onClick={confirmarSubida} disabled={subiendo}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary py-2.5 text-sm font-bold text-white transition hover:bg-brand-primary/90 disabled:opacity-60">
              {subiendo ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4" /> Confirmar y subir</>}
            </button>
            <button type="button" onClick={() => { setPendingFile(null); setUploadError(''); }} disabled={subiendo}
              className="rounded-xl border-2 border-black/10 px-4 py-2.5 text-sm font-bold text-ink-muted transition hover:border-bad/40 hover:text-bad disabled:opacity-60">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de certificados */}
      {estudios.length === 0 && !pendingFile ? (
        <p className="text-sm text-ink-muted">No hay certificados subidos.</p>
      ) : estudios.length > 0 ? (
        <div className="space-y-2">
          {estudios.map((e) => (
            <div key={e.id} className="flex items-center gap-3 rounded-2xl bg-brand-cream px-4 py-3">
              <FileText className="h-4 w-4 shrink-0 text-brand-primary/60" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{e.nombre}</p>
                {e.fecha && <p className="text-xs text-ink-muted">{e.fecha.slice(0, 10).split('-').reverse().join('/')}</p>}
              </div>
              <a href={e.archivo_url ?? ''} target="_blank" rel="noopener noreferrer"
                className="text-xs font-bold text-brand-primary hover:underline shrink-0">Ver</a>
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

/* ── Certificado Veterinario Internacional (CVI) ── */
const SENASA_URL = 'https://mascotas.senasa.gob.ar/index.php/consultar_requisitos';
const ARG_BASE   = 'https://www.argentina.gob.ar/senasa/informacion-al-viajero/viajar-al-exterior/envios-al-exterior-perros-yo-gatos/requisitos-particulares-por-destino';

const CVI_PAISES: { bandera: string; nombre: string; url: string; pdf?: string }[] = [
  // ── América del Sur ──
  { bandera:'🇦🇷', nombre:'Argentina (tránsito)',   url: SENASA_URL },
  { bandera:'🇺🇾', nombre:'Uruguay',               url: SENASA_URL },
  { bandera:'🇧🇷', nombre:'Brasil',                url: SENASA_URL },
  { bandera:'🇨🇱', nombre:'Chile',                 url: SENASA_URL },
  { bandera:'🇨🇱', nombre:'Chile (tránsito zona australiana)', url: SENASA_URL },
  { bandera:'🇵🇾', nombre:'Paraguay',              url: SENASA_URL },
  { bandera:'🇵🇪', nombre:'Perú',                  url: SENASA_URL },
  { bandera:'🇧🇴', nombre:'Bolivia',               url: SENASA_URL },
  { bandera:'🇨🇴', nombre:'Colombia',              url: SENASA_URL },
  { bandera:'🇪🇨', nombre:'Ecuador',               url: SENASA_URL },
  { bandera:'🇻🇪', nombre:'Venezuela',             url: SENASA_URL },
  // ── América del Norte ──
  { bandera:'🇺🇸', nombre:'EE.UU. (caninos)',      url: SENASA_URL },
  { bandera:'🇺🇸', nombre:'EE.UU. (felinos)',      url: SENASA_URL },
  { bandera:'🇺🇸', nombre:'Hawaii',                url: SENASA_URL },
  { bandera:'🇲🇽', nombre:'México',                url: SENASA_URL },
  { bandera:'🇨🇦', nombre:'Canadá',                url: SENASA_URL },
  // ── América Central / Caribe ──
  { bandera:'🇵🇦', nombre:'Panamá',                url: SENASA_URL },
  { bandera:'🇨🇷', nombre:'Costa Rica',            url: SENASA_URL },
  { bandera:'🇨🇺', nombre:'Cuba',                  url: SENASA_URL },
  { bandera:'🇯🇲', nombre:'Jamaica',               url: SENASA_URL },
  { bandera:'🇩🇴', nombre:'República Dominicana',  url: SENASA_URL },
  { bandera:'🇭🇹', nombre:'Haití',                 url: SENASA_URL },
  { bandera:'🇵🇷', nombre:'Puerto Rico',           url: SENASA_URL },
  { bandera:'🇬🇹', nombre:'Guatemala',             url: SENASA_URL },
  { bandera:'🇭🇳', nombre:'Honduras',              url: SENASA_URL },
  { bandera:'🇸🇻', nombre:'El Salvador',           url: SENASA_URL },
  { bandera:'🇳🇮', nombre:'Nicaragua',             url: SENASA_URL },
  { bandera:'🇧🇸', nombre:'Bahamas',               url: SENASA_URL },
  { bandera:'🇧🇧', nombre:'Barbados',              url: SENASA_URL },
  { bandera:'🇹🇹', nombre:'Trinidad y Tobago',     url: SENASA_URL },
  { bandera:'🏝️', nombre:'Aruba',                 url: SENASA_URL },
  { bandera:'🏝️', nombre:'Curazao',               url: SENASA_URL },
  { bandera:'🏝️', nombre:'Bonaire',               url: SENASA_URL },
  { bandera:'🏝️', nombre:'Isla Martinica',        url: SENASA_URL },
  // ── Unión Europea ──
  { bandera:'🇪🇸', nombre:'España',                url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇮🇹', nombre:'Italia',                url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇫🇷', nombre:'Francia',               url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇩🇪', nombre:'Alemania',              url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇵🇹', nombre:'Portugal',              url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇬🇷', nombre:'Grecia',                url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇧🇪', nombre:'Bélgica',               url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇳🇱', nombre:'Países Bajos',          url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇦🇹', nombre:'Austria',               url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇵🇱', nombre:'Polonia',               url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇸🇪', nombre:'Suecia',                url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇩🇰', nombre:'Dinamarca',             url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇫🇮', nombre:'Finlandia',             url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇮🇪', nombre:'Irlanda',               url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇨🇿', nombre:'República Checa',       url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇭🇺', nombre:'Hungría',               url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇷🇴', nombre:'Rumania',               url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇧🇬', nombre:'Bulgaria',              url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇸🇰', nombre:'Eslovaquia',            url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇸🇮', nombre:'Eslovenia',             url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇨🇾', nombre:'Chipre',                url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇪🇪', nombre:'Estonia',               url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇱🇻', nombre:'Letonia',               url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇱🇹', nombre:'Lituania',              url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇱🇺', nombre:'Luxemburgo',            url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇲🇹', nombre:'Malta',                 url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  { bandera:'🇭🇷', nombre:'Croacia',               url:`${ARG_BASE}/union-europea`, pdf:'https://www.argentina.gob.ar/sites/default/files/402-2025-pasaportes_mascotas-1_1.pdf' },
  // ── Europa no-UE ──
  { bandera:'🇬🇧', nombre:'Gran Bretaña',           url:`${ARG_BASE}/europa/europa-no-ue` },
  { bandera:'🇨🇭', nombre:'Suiza',                  url:`${ARG_BASE}/europa/europa-no-ue` },
  { bandera:'🇳🇴', nombre:'Noruega',                url:`${ARG_BASE}/europa/europa-no-ue` },
  { bandera:'🇷🇸', nombre:'Serbia',                 url:`${ARG_BASE}/europa/europa-no-ue` },
  { bandera:'🇲🇪', nombre:'Montenegro',             url:`${ARG_BASE}/europa/europa-no-ue` },
  { bandera:'🇧🇦', nombre:'Bosnia y Herzegovina',   url:`${ARG_BASE}/europa/europa-no-ue` },
  { bandera:'🇦🇩', nombre:'Andorra',                url:`${ARG_BASE}/europa/europa-no-ue` },
  { bandera:'🇺🇦', nombre:'Ucrania',                url:`${ARG_BASE}/europa/union-economica-euroasiatica` },
  { bandera:'🇷🇺', nombre:'Rusia',                  url:`${ARG_BASE}/europa/union-economica-euroasiatica` },
  { bandera:'🇦🇲', nombre:'Armenia',                url:`${ARG_BASE}/europa/union-economica-euroasiatica` },
  { bandera:'🇬🇪', nombre:'Georgia',                url:`${ARG_BASE}/europa/union-economica-euroasiatica` },
  { bandera:'🇦🇿', nombre:'Azerbaiyán',             url:`${ARG_BASE}/asia/azerbaijan-singapur` },
  { bandera:'🇰🇿', nombre:'Kazajistán',             url:`${ARG_BASE}/europa/union-economica-euroasiatica` },
  { bandera:'🇰🇬', nombre:'Kirguistán',             url:`${ARG_BASE}/europa/union-economica-euroasiatica` },
  { bandera:'🇧🇾', nombre:'Bielorrusia',            url:`${ARG_BASE}/europa/union-economica-euroasiatica` },
  // ── Asia ──
  { bandera:'🇯🇵', nombre:'Japón',                  url:`${ARG_BASE}/asia/japon` },
  { bandera:'🇨🇳', nombre:'China',                  url:'https://www.argentina.gob.ar/senasa/china' },
  { bandera:'🇰🇷', nombre:'Corea del Sur',          url:`${ARG_BASE}/asia/corea` },
  { bandera:'🇸🇬', nombre:'Singapur',               url:'https://www.argentina.gob.ar/senasa/singapur' },
  { bandera:'🇭🇰', nombre:'Hong Kong',              url:`${ARG_BASE}/asia/hong-kong` },
  { bandera:'🇹🇭', nombre:'Tailandia',              url:`${ARG_BASE}/asia/tailandia` },
  { bandera:'🇲🇾', nombre:'Malasia',                url:`${ARG_BASE}/asia/malasia` },
  { bandera:'🇵🇭', nombre:'Filipinas',              url:'https://www.argentina.gob.ar/senasa/filipinas' },
  { bandera:'🇮🇳', nombre:'India',                  url:`${ARG_BASE}/asia/india-o-pakistan` },
  { bandera:'🇵🇰', nombre:'Pakistán',               url:`${ARG_BASE}/asia/india-o-pakistan` },
  { bandera:'🇧🇩', nombre:'Bangladesh',             url: SENASA_URL },
  { bandera:'🇹🇼', nombre:'Taiwán',                 url:`${ARG_BASE}/asia/taiwan` },
  { bandera:'🇻🇳', nombre:'Vietnam',                url:`${ARG_BASE}/asia/china-iran-kuwait-laos-siriavietnam-camboya-nepal-e-indonesia` },
  { bandera:'🇮🇩', nombre:'Indonesia',              url:`${ARG_BASE}/asia/china-iran-kuwait-laos-siriavietnam-camboya-nepal-e-indonesia` },
  { bandera:'🇳🇵', nombre:'Nepal',                  url:`${ARG_BASE}/asia/china-iran-kuwait-laos-siriavietnam-camboya-nepal-e-indonesia` },
  { bandera:'🇲🇲', nombre:'Myanmar',                url:`${ARG_BASE}/asia/myanmar-o-birmania` },
  { bandera:'🇰🇭', nombre:'Camboya',                url:`${ARG_BASE}/asia/china-iran-kuwait-laos-siriavietnam-camboya-nepal-e-indonesia` },
  { bandera:'🇱🇦', nombre:'Laos',                   url:`${ARG_BASE}/asia/china-iran-kuwait-laos-siriavietnam-camboya-nepal-e-indonesia` },
  { bandera:'🇱🇰', nombre:'Sri Lanka',              url:`${ARG_BASE}/asia/sri-lanka` },
  // ── Medio Oriente ──
  { bandera:'🇦🇪', nombre:'Emiratos Árabes Unidos', url:'https://www.argentina.gob.ar/senasa/emiratos-arabes' },
  { bandera:'🇸🇦', nombre:'Arabia Saudita',         url:`${ARG_BASE}/asia/arabia-saudita` },
  { bandera:'🇶🇦', nombre:'Qatar',                  url:'https://www.argentina.gob.ar/senasa/qatar' },
  { bandera:'🇰🇼', nombre:'Kuwait',                 url:`${ARG_BASE}/asia/china-iran-kuwait-laos-siriavietnam-camboya-nepal-e-indonesia` },
  { bandera:'🇴🇲', nombre:'Omán',                   url:`${ARG_BASE}/asia/oman` },
  { bandera:'🇯🇴', nombre:'Jordania',               url: SENASA_URL },
  { bandera:'🇱🇧', nombre:'Líbano',                 url: SENASA_URL },
  { bandera:'🇮🇱', nombre:'Israel',                 url: SENASA_URL },
  { bandera:'🇮🇷', nombre:'Irán',                   url:`${ARG_BASE}/asia/china-iran-kuwait-laos-siriavietnam-camboya-nepal-e-indonesia` },
  // ── Oceanía ──
  { bandera:'🇦🇺', nombre:'Australia (perros)',      url:`${ARG_BASE}/oceania/australia-perros` },
  { bandera:'🇦🇺', nombre:'Australia (gatos)',       url:`${ARG_BASE}/oceania/australia-gatos` },
  { bandera:'🇳🇿', nombre:'Nueva Zelanda (perros)',  url:`${ARG_BASE}/oceania/nueva-zelanda` },
  { bandera:'🇳🇿', nombre:'Nueva Zelanda (gatos)',   url:'https://www.argentina.gob.ar/senasa/nueva-zelanda-felinos' },
  { bandera:'🏝️', nombre:'Guam',                   url:`${ARG_BASE}/oceania/guam` },
  // ── África ──
  { bandera:'🇿🇦', nombre:'Sudáfrica',              url:`${ARG_BASE}/africa/sudafrica` },
  { bandera:'🇪🇬', nombre:'Egipto',                 url:`${ARG_BASE}/africa/angola-egipto-libia-marruecos-nigeria-ghana-nambia-y-senegal` },
  { bandera:'🇲🇦', nombre:'Marruecos',              url:`${ARG_BASE}/africa/angola-egipto-libia-marruecos-nigeria-ghana-nambia-y-senegal` },
  { bandera:'🇰🇪', nombre:'Kenia',                  url:`${ARG_BASE}/africa/cabo-verde-y-kenia` },
  { bandera:'🇨🇻', nombre:'Cabo Verde',             url:`${ARG_BASE}/africa/cabo-verde-y-kenia` },
  { bandera:'🇳🇬', nombre:'Nigeria',                url:`${ARG_BASE}/africa/angola-egipto-libia-marruecos-nigeria-ghana-nambia-y-senegal` },
  { bandera:'🇬🇭', nombre:'Ghana',                  url:`${ARG_BASE}/africa/angola-egipto-libia-marruecos-nigeria-ghana-nambia-y-senegal` },
  { bandera:'🇸🇳', nombre:'Senegal',                url:`${ARG_BASE}/africa/angola-egipto-libia-marruecos-nigeria-ghana-nambia-y-senegal` },
  { bandera:'🇦🇴', nombre:'Angola',                 url:`${ARG_BASE}/africa/angola-egipto-libia-marruecos-nigeria-ghana-nambia-y-senegal` },
  { bandera:'🇹🇳', nombre:'Túnez',                  url:'https://www.argentina.gob.ar/senasa/tunez' },
  { bandera:'🇿🇼', nombre:'Zimbabue',               url:`${ARG_BASE}/africa/zimbabue` },
  { bandera:'🇳🇦', nombre:'Namibia',                url:'https://www.argentina.gob.ar/senasa/namibia' },
  { bandera:'🇪🇹', nombre:'Etiopía',                url:'https://www.argentina.gob.ar/senasa/etiopia' },
  { bandera:'🇨🇮', nombre:'Costa de Marfil',        url:`${ARG_BASE}/africa/costa-de-marfil` },
  { bandera:'🇱🇾', nombre:'Libia',                  url:`${ARG_BASE}/africa/angola-egipto-libia-marruecos-nigeria-ghana-nambia-y-senegal` },
  { bandera:'🇹🇿', nombre:'Tanzania',               url: SENASA_URL },
];

function CVISection({
  estudios, subiendo, onSubir, onEnviar, onEliminar,
}: {
  estudios:   Estudio[];
  subiendo:   boolean;
  onSubir:    (f: File) => Promise<void>;
  onEnviar:   (e: Estudio) => void;
  onEliminar: (id: string) => void;
}) {
  const fileRef                       = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [requisitosOpen, setRequisitosOpen] = useState(false);
  const [paisExpandido, setPaisExpandido]   = useState<string | null>(null);

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
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink">
          <Globe className="h-4 w-4 text-brand-primary" /> Certificado CVI
          {estudios.length > 0 && (
            <span className="ml-1 rounded-full bg-brand-primary/10 px-2 py-0.5 text-xs font-bold text-brand-primary">
              {estudios.length}
            </span>
          )}
        </h2>
        {!pendingFile && (
          <button type="button"
            onClick={() => { setUploadError(''); fileRef.current?.click(); }}
            disabled={subiendo}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20 disabled:opacity-60">
            <Upload className="h-3.5 w-3.5" /> Subir certificado
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) { setPendingFile(f); setUploadError(''); }
            e.target.value = '';
          }} />
      </div>

      {/* Selector de país */}
      <button
        type="button"
        onClick={() => setRequisitosOpen((o) => !o)}
        className="mb-4 flex w-full items-center justify-between rounded-2xl border border-brand-primary/20 bg-brand-primary/5 px-4 py-3 text-sm font-bold text-brand-primary transition hover:bg-brand-primary/10"
      >
        <span className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Consultá los requisitos por país
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${requisitosOpen ? 'rotate-180' : ''}`} />
      </button>

      {requisitosOpen && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar país de destino…"
            value={paisExpandido ?? ''}
            onChange={(e) => setPaisExpandido(e.target.value || null)}
            className="field w-full mb-3 text-sm"
            autoFocus
          />
          <div className="max-h-64 overflow-y-auto rounded-2xl border border-black/5 divide-y divide-black/5">
            {CVI_PAISES.filter((p) =>
              !paisExpandido || p.nombre.toLowerCase().includes(paisExpandido.toLowerCase())
            ).map((p) => (
              <div key={p.nombre} className="flex items-center gap-3 px-4 py-3 hover:bg-brand-cream transition">
                <span className="text-lg shrink-0">{p.bandera}</span>
                <span className="flex-1 text-sm font-semibold text-ink">{p.nombre}</span>
                {p.pdf && (
                  <a href={p.pdf} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-xl bg-good/10 px-2.5 py-1.5 text-xs font-bold text-good transition hover:bg-good/20 shrink-0">
                    <FileText className="h-3 w-3" /> PDF
                  </a>
                )}
                <a href={p.url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-2.5 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20 shrink-0">
                  <Globe className="h-3 w-3" /> Ver
                </a>
              </div>
            ))}
            {CVI_PAISES.filter((p) =>
              !paisExpandido || p.nombre.toLowerCase().includes(paisExpandido.toLowerCase())
            ).length === 0 && (
              <p className="px-4 py-3 text-sm text-ink-muted">No se encontró ese destino.</p>
            )}
          </div>
          <p className="mt-2 text-[11px] text-ink-muted">
            Fuente: SENASA · Los requisitos pueden cambiar sin previo aviso.
          </p>
        </div>
      )}

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
            <button type="button" onClick={confirmarSubida} disabled={subiendo}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary py-2.5 text-sm font-bold text-white transition hover:bg-brand-primary/90 disabled:opacity-60">
              {subiendo ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4" /> Confirmar y subir</>}
            </button>
            <button type="button" onClick={() => { setPendingFile(null); setUploadError(''); }} disabled={subiendo}
              className="rounded-xl border-2 border-black/10 px-4 py-2.5 text-sm font-bold text-ink-muted transition hover:border-bad/40 hover:text-bad disabled:opacity-60">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de certificados */}
      {estudios.length === 0 && !pendingFile ? (
        <p className="text-sm text-ink-muted">No hay certificados subidos.</p>
      ) : estudios.length > 0 ? (
        <div className="space-y-2">
          {estudios.map((e) => (
            <div key={e.id} className="flex items-center gap-3 rounded-2xl bg-brand-cream px-4 py-3">
              <FileText className="h-4 w-4 shrink-0 text-brand-primary/60" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{e.nombre}</p>
                {e.fecha && <p className="text-xs text-ink-muted">{e.fecha.slice(0, 10).split('-').reverse().join('/')}</p>}
              </div>
              <a href={e.archivo_url ?? ''} target="_blank" rel="noopener noreferrer"
                className="text-xs font-bold text-brand-primary hover:underline shrink-0">Ver</a>
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
              <a href={e.archivo_url ?? ''} target="_blank" rel="noopener noreferrer"
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
    await navigator.clipboard.writeText(estudio.archivo_url ?? '');
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
  const labs   = estudios.filter((e) => e.tipo === 'laboratorio');
  const radios = estudios.filter((e) => e.tipo === 'radiografia');
  const ecos   = estudios.filter((e) => e.tipo === 'ecografia');
  const [enviarOpen, setEnviarOpen] = useState(false);

  const url     = `https://www.mivecindog.com.ar/historia/${perro.id}`;
  const texto   = encodeURIComponent(`Historia Clínica de ${perro.nombre} 🐾\n${url}`);
  const waLink  = `https://wa.me/?text=${texto}`;

  function enviarEmail(email: string) {
    const subject = encodeURIComponent(`Historia Clínica de ${perro.nombre}`);
    const body    = encodeURIComponent(`Hola,\n\nTe comparto la historia clínica de ${perro.nombre}:\n${url}`);
    window.open(`mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`, '_blank');
  }

  return (
    <div className="card p-5 mb-5 mt-2">
      {/* Título + botón enviar */}
      <div className="flex items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-primary/10 text-brand-primary">
            <FileText className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-base font-extrabold text-ink">Historia Clínica</h2>
            <p className="text-[11px] text-ink-muted">{perro.nombre} · resumen completo</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setEnviarOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary px-3 py-2 text-xs font-bold text-white transition hover:bg-brand-primary/90 shrink-0"
        >
          <Send className="h-3.5 w-3.5" /> Enviar
        </button>
      </div>

      {/* Modal enviar historia */}
      {enviarOpen && (
        <EnviarHistoriaModal
          url={url}
          waLink={waLink}
          onEnviarEmail={enviarEmail}
          onClose={() => setEnviarOpen(false)}
        />
      )}

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
            href={e.archivo_url ?? ''}
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

/* ── Modal enviar Historia Clínica ── */
function EnviarHistoriaModal({ url, waLink, onEnviarEmail, onClose }: {
  url:           string;
  waLink:        string;
  onEnviarEmail: (email: string) => void;
  onClose:       () => void;
}) {
  const [email,  setEmail]  = useState('');
  const [copied, setCopied] = useState(false);

  async function copiar() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-0 sm:items-center sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-sm rounded-t-[32px] bg-white px-7 pb-8 pt-7 shadow-2xl sm:rounded-[32px]">
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-black/10 sm:hidden" />

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-black text-ink">Enviar Historia Clínica</h2>
            <p className="mt-0.5 text-xs text-ink-muted">El destinatario puede verla sin cuenta</p>
          </div>
          <button type="button" onClick={onClose}
            className="rounded-xl p-1.5 text-ink-muted hover:bg-brand-cream">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Copiar link */}
        <button type="button" onClick={copiar}
          className="mb-4 flex w-full items-center justify-between gap-2 rounded-2xl bg-brand-cream px-4 py-3 transition hover:bg-brand-primary/10">
          <span className="truncate text-xs text-ink-muted">{url}</span>
          {copied
            ? <Check className="h-4 w-4 shrink-0 text-good" />
            : <Copy className="h-4 w-4 shrink-0 text-brand-primary" />}
        </button>

        {/* Email */}
        <div className="mb-3">
          <label className="label mb-1 flex items-center gap-1.5 text-xs font-bold text-ink-muted">
            <Mail className="h-3.5 w-3.5 text-brand-primary" /> Enviar por email
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="veterinario@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field flex-1 text-sm"
            />
            <button
              type="button"
              onClick={() => { if (email.trim()) { onEnviarEmail(email.trim()); } }}
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
        <a href={waLink} target="_blank" rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3 text-sm font-bold text-white transition hover:bg-[#1ebe5d]">
          <MessageCircle className="h-4 w-4" /> Enviar por WhatsApp
        </a>

        <button type="button" onClick={onClose}
          className="mt-3 w-full rounded-2xl border-2 border-black/10 py-2.5 text-sm font-bold text-ink-muted transition hover:border-black/20">
          Cancelar
        </button>
      </div>
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

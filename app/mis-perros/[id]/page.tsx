'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Dog, Syringe, ChevronLeft, CheckCircle2, CalendarDays,
  Loader2, AlertCircle, Cpu, MapPin, Pencil, X, ImagePlus, Save,
  RefreshCw, Search, FileText, FlaskConical, ScanLine, Activity,
  Upload, Trash2, Send, Mail, MessageCircle, Copy, Check, Download,
  Globe, ChevronDown, Share2, Lock, Sparkles, Bug, Scale, Stethoscope, Phone,
  Pill, QrCode, Printer, Store, TrendingUp, Clock, TriangleAlert,
  Heart, Camera, UtensilsCrossed, Scissors, PhoneCall, UserRound,
  Stethoscope as StethoscopeIcon, ClipboardList, ImageIcon, Plus as PlusIcon,
} from 'lucide-react';
import {
  obtenerPerro, actualizarPerro, eliminarPerro, subirFotoPerro,
  agregarVacuna, actualizarVacuna, eliminarVacuna,
  VACUNAS_COMUNES,
  type Perro, type Vacuna, type VacunaInput, type PerroInput,
} from '@/lib/perros';
import { buscarPostActivoDePerro, renovarPost, type Post } from '@/lib/posts';
import {
  listarEstudios, subirArchivoEstudio, agregarEstudio, eliminarEstudio,
  type Estudio, type TipoEstudio,
} from '@/lib/estudios';
import {
  listarTurnos, agregarTurno, eliminarTurno,
  type Turno, type TipoTurno,
} from '@/lib/turnos';
import {
  listarMedicamentos, agregarMedicamento, eliminarMedicamento,
  type Medicamento,
} from '@/lib/medicamentos';
import {
  listarVisitasVet, agregarVisitaVet, eliminarVisitaVet,
  type VisitaVet, type VisitaVetInput,
} from '@/lib/visitas-vet';
import {
  listarProcedimientos, agregarProcedimiento, eliminarProcedimiento,
  TIPOS_PROCEDIMIENTO, type Procedimiento, type ProcedimientoInput,
} from '@/lib/procedimientos';
import {
  listarFotos, subirFotoPerro as subirFotoGaleria, agregarFoto, eliminarFoto,
  type FotoPerro,
} from '@/lib/fotos-perro';
import {
  listarContactos, agregarContacto, eliminarContacto,
  type ContactoEmergencia, type ContactoInput,
} from '@/lib/contactos-emergencia';
import {
  obtenerGrooming, guardarGrooming,
  type Grooming, type TipoGrooming,
} from '@/lib/grooming';
import { type EstadoSalud } from '@/lib/perros';
import {
  listarDesparasitaciones, agregarDesparasitacion, actualizarDesparasitacion, eliminarDesparasitacion,
  PRODUCTOS_COMUNES,
  type Desparasitacion, type DesparasitacionInput,
} from '@/lib/desparasitaciones';
import {
  listarPesos, agregarPeso, eliminarPeso,
  type Peso, type PesoInput,
} from '@/lib/pesos';
import RazaAutocomplete from '@/components/RazaAutocomplete';
import PerroDocumento from '@/components/PerroDocumento';
import ProfileCompletion from '@/components/ProfileCompletion';
import { nombreCorto } from '@/lib/ciudades';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PerroDetallePage() {
  const { id }        = useParams<{ id: string }>();
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const esNuevo       = searchParams.get('nuevo') === '1';
  const { ciudad, profile, isPro } = useAuth();
  const { t } = useLanguage();

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
  const [desparasitaciones, setDesparasitaciones] = useState<Desparasitacion[]>([]);
  const [pesos,              setPesos]             = useState<Peso[]>([]);
  const [editandoDesparaId,  setEditandoDesparaId] = useState<string | null>(null);
  const [agregandoDesparas,  setAgregandoDesparas] = useState(false);
  const [agregandoPeso,      setAgregandoPeso]     = useState(false);
  const [turnos,             setTurnos]            = useState<Turno[]>([]);
  const [medicamentos,       setMedicamentos]      = useState<Medicamento[]>([]);
  const [showQR,             setShowQR]            = useState(false);
  const [showEnviarVacunas,  setShowEnviarVacunas] = useState(false);
  const [visitasVet,         setVisitasVet]        = useState<VisitaVet[]>([]);
  const [procedimientos,     setProcedimientos]    = useState<Procedimiento[]>([]);
  const [fotos,              setFotos]             = useState<FotoPerro[]>([]);
  const [contactos,          setContactos]         = useState<ContactoEmergencia[]>([]);
  const [grooming,           setGrooming]          = useState<Grooming | null>(null);

  const [subDataLoaded, setSubDataLoaded] = useState(false);

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
          Promise.allSettled([
            listarEstudios(p.id).then(setEstudios),
            listarDesparasitaciones(p.id).then(setDesparasitaciones),
            listarPesos(p.id).then(setPesos),
            listarTurnos(p.id).then(setTurnos),
            listarMedicamentos(p.id).then(setMedicamentos),
            listarVisitasVet(p.id).then(setVisitasVet),
            listarProcedimientos(p.id).then(setProcedimientos),
            listarFotos(p.id).then(setFotos),
            listarContactos(p.id).then(setContactos),
            obtenerGrooming(p.id).then(setGrooming),
          ]).then(() => setSubDataLoaded(true));
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

  async function handleRegistrarTurno(tipo: TipoTurno, fecha: string, nota: string) {
    if (!perro) return;
    // Solo un turno activo por tipo — reemplaza si ya existía
    const existing = turnos.find((t) => t.tipo === tipo);
    if (existing) await eliminarTurno(existing.id);
    try {
      const nuevo = await agregarTurno({ perro_id: perro.id, tipo, fecha, nota: nota || null });
      setTurnos((prev) => [...prev.filter((t) => t.tipo !== tipo), nuevo]);
    } catch {
      // Si el insert falla luego del delete, recargamos turnos desde la DB
      // para evitar que el estado local quede desincronizado
      listarTurnos(perro.id).then(setTurnos);
      throw new Error('No se pudo guardar el turno. Intentá de nuevo.');
    }
  }

  async function handleEliminarTurno(id: string) {
    await eliminarTurno(id);
    setTurnos((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleAgregarMedicamento(med: Omit<Medicamento, 'id' | 'created_at'>) {
    const nuevo = await agregarMedicamento(med);
    setMedicamentos((prev) => [nuevo, ...prev]);
  }

  async function handleEliminarMedicamento(id: string) {
    await eliminarMedicamento(id);
    setMedicamentos((prev) => prev.filter((m) => m.id !== id));
  }

  async function handleAgregarVisita(input: VisitaVetInput) {
    if (!perro) return;
    const nueva = await agregarVisitaVet(perro.id, input);
    setVisitasVet((prev) => [nueva, ...prev]);
  }
  async function handleEliminarVisita(id: string) {
    await eliminarVisitaVet(id);
    setVisitasVet((prev) => prev.filter((v) => v.id !== id));
  }

  async function handleAgregarProcedimiento(input: ProcedimientoInput) {
    if (!perro) return;
    const nuevo = await agregarProcedimiento(perro.id, input);
    setProcedimientos((prev) => [nuevo, ...prev]);
  }
  async function handleEliminarProcedimiento(id: string) {
    await eliminarProcedimiento(id);
    setProcedimientos((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleAgregarFoto(file: File) {
    if (!perro) return;
    const url = await subirFotoGaleria(file);
    const nueva = await agregarFoto(perro.id, url);
    setFotos((prev) => [nueva, ...prev]);
  }
  async function handleEliminarFoto(id: string) {
    await eliminarFoto(id);
    setFotos((prev) => prev.filter((f) => f.id !== id));
  }

  async function handleAgregarContacto(input: ContactoInput) {
    if (!perro) return;
    const nuevo = await agregarContacto(perro.id, input);
    setContactos((prev) => [...prev, nuevo]);
  }
  async function handleEliminarContacto(id: string) {
    await eliminarContacto(id);
    setContactos((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleGuardarGrooming(data: Omit<Grooming, 'id' | 'created_at'>) {
    if (!perro) return;
    const g = await guardarGrooming(perro.id, data);
    setGrooming(g);
  }

  async function handleEstadoSalud(estado: EstadoSalud | '') {
    if (!perro) return;
    try {
      await actualizarPerro(perro.id, { estado_salud: estado });
      setPerro((p) => p ? { ...p, estado_salud: (estado || null) as EstadoSalud | null } : p);
    } catch {
      // Estado no guardado — no mostramos feedback para no interrumpir el flujo visual
    }
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

  async function handleDeletePerro() {
    if (!perro) return;
    await eliminarPerro(perro.id);
    router.push('/mis-perros');
  }

  const sortDesparas = (list: Desparasitacion[]) =>
    [...list].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  async function handleAgregarDesparasitacion(input: DesparasitacionInput) {
    if (!perro) return;
    const nueva = await agregarDesparasitacion(perro.id, input);
    setDesparasitaciones((prev) => sortDesparas([nueva, ...prev]));
    setAgregandoDesparas(false);
  }

  async function handleActualizarDesparasitacion(despId: string, input: DesparasitacionInput) {
    await actualizarDesparasitacion(despId, input);
    setDesparasitaciones((prev) =>
      sortDesparas(prev.map((d) => d.id === despId ? { ...d, ...input } : d))
    );
    setEditandoDesparaId(null);
  }

  async function handleEliminarDesparasitacion(despId: string) {
    await eliminarDesparasitacion(despId);
    setDesparasitaciones((prev) => prev.filter((d) => d.id !== despId));
  }

  async function handleAgregarPeso(input: PesoInput) {
    if (!perro) return;
    const nuevo = await agregarPeso(perro.id, input);
    setPesos((prev) =>
      [nuevo, ...prev].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    );
    setAgregandoPeso(false);
  }

  async function handleEliminarPeso(pesoId: string) {
    await eliminarPeso(pesoId);
    setPesos((prev) => prev.filter((p) => p.id !== pesoId));
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
      <p className="mt-3 font-bold text-ink">{t.mpdPerroNoEncontrado}</p>
      <Link href="/mis-perros" className="btn-primary mt-4 inline-flex">{t.mpdVolverListado}</Link>
    </div>
  );

  const edad = perro.fecha_nac ? calcularEdad(perro.fecha_nac, t) : null;

  return (
    <div className="mx-auto max-w-2xl py-8 md:py-10">
      <div className="mb-5 flex items-center justify-between">
        <Link
          href="/mis-perros"
          className="inline-flex items-center gap-1 text-sm font-semibold text-ink-muted transition hover:text-ink"
        >
          <ChevronLeft className="h-4 w-4" /> {t.mpdMisPerros}
        </Link>
        {!editando && (
          <div className="flex gap-2">
            {postActivo && (
              <Link
                href={`/mis-perros/${id}/cartel`}
                className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-black/10 px-3 py-1.5 text-xs font-bold text-ink-muted transition hover:border-brand-primary/40 hover:text-brand-primary"
              >
                <FileText className="h-3.5 w-3.5" /> {t.mpdGenerarCartel}
              </Link>
            )}
            <Link
              href={`/mis-perros/${id}/historia`}
              className="inline-flex items-center gap-1.5 rounded-2xl border-2 px-3 py-1.5 text-xs font-bold transition hover:opacity-80"
              style={{ borderColor: '#e6683c', color: '#e6683c' }}
            >
              <Share2 className="h-3.5 w-3.5" /> {t.mpdPublicarRedes}
            </Link>
            <button
              type="button"
              onClick={() => setShowQR(true)}
              className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-black/10 px-3 py-1.5 text-xs font-bold text-ink-muted transition hover:border-brand-primary/40 hover:text-brand-primary"
            >
              <QrCode className="h-3.5 w-3.5" /> {t.mpdQrCollar}
            </button>
            <Link
              href={`/mis-perros/${perro.id}/timeline`}
              className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-black/10 px-3 py-1.5 text-xs font-bold text-ink-muted transition hover:border-brand-primary/40 hover:text-brand-primary"
            >
              <Activity className="h-3.5 w-3.5" /> {t.mpdDiario}
            </Link>
            <button
              type="button"
              onClick={() => setEditando(true)}
              className="inline-flex items-center gap-1.5 rounded-2xl border-2 border-brand-primary/30 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/10"
            >
              <Pencil className="h-3.5 w-3.5" /> {t.mpdEditarPerfil}
            </button>
          </div>
        )}
      </div>

      {esNuevo && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl bg-good/10 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-good" />
          <div>
            <p className="font-bold text-ink">{t.mpdRegistrado.replace('{nombre}', perro.nombre)}</p>
            <p className="text-sm text-ink-muted">{t.mpdRegistradoSub}</p>
          </div>
        </div>
      )}

      {editando ? (
        <EditForm
          perro={perro}
          onSave={(updated) => { setPerro(updated); setEditando(false); }}
          onCancel={() => setEditando(false)}
          onDelete={handleDeletePerro}
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
                {perro.esterilizado && <Chip className="text-good">{t.mpdEsterilizado}</Chip>}
              </div>
              {/* Estado de salud rápido */}
              <div className="mt-2 flex gap-1.5 flex-wrap">
                {(['saludable','en_tratamiento','en_recuperacion'] as EstadoSalud[]).map((e) => (
                  <button key={e} type="button" onClick={() => handleEstadoSalud(perro.estado_salud === e ? '' : e)}
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold transition ${
                      perro.estado_salud === e
                        ? e === 'saludable' ? 'bg-good text-white' : e === 'en_tratamiento' ? 'bg-amber-400 text-white' : 'bg-blue-400 text-white'
                        : 'bg-black/5 text-ink-muted hover:bg-black/10'
                    }`}>
                    {e === 'saludable' ? t.mpdSaludable : e === 'en_tratamiento' ? t.mpdEnTratamiento : t.mpdEnRecuperacion}
                  </button>
                ))}
              </div>
              {perro.descripcion && (
                <p className="mt-2 text-xs text-ink-muted leading-relaxed line-clamp-2">{perro.descripcion}</p>
              )}
            </div>
          </div>

          {/* Completado del perfil */}
          <ProfileCompletion
            perro={perro}
            vacunas={vacunas}
            estudios={estudios}
            pesos={pesos}
            contactos={contactos}
            dataLoaded={subDataLoaded}
          />

          {/* Banner Pro para usuarios Free */}
          {!isPro && (
            <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl border border-brand-primary/20 bg-brand-primary/5 px-4 py-3">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 shrink-0 text-brand-primary" />
                <p className="text-xs font-bold text-ink">{t.mpdBannerProText}</p>
              </div>
              <Link href="/planes"
                className="shrink-0 inline-flex items-center gap-1 rounded-xl bg-brand-primary px-3 py-1.5 text-xs font-bold text-white transition hover:opacity-90">
                <Sparkles className="h-3 w-3" /> {t.mpdVerPro}
              </Link>
            </div>
          )}

          {/* Banner alertas: vacunas y desparasitaciones vencidas / próximas */}
          {(() => {
            const hoy  = new Date(); hoy.setHours(0, 0, 0, 0);
            const en30 = new Date(hoy); en30.setDate(hoy.getDate() + 30);
            const vencidas = [
              ...vacunas.filter((v) => v.proxima && new Date(v.proxima) < hoy).map((v) => v.nombre),
              ...desparasitaciones.filter((d) => d.proxima && new Date(d.proxima) < hoy).map((d) => d.producto),
            ];
            const proximas = [
              ...vacunas.filter((v) => { if (!v.proxima) return false; const d = new Date(v.proxima); return d >= hoy && d <= en30; }).map((v) => v.nombre),
              ...desparasitaciones.filter((d) => { if (!d.proxima) return false; const dt = new Date(d.proxima); return dt >= hoy && dt <= en30; }).map((d) => d.producto),
            ];
            if (vencidas.length === 0 && proximas.length === 0) return null;
            return (
              <div className={`mb-5 rounded-2xl border p-4 space-y-1.5 ${vencidas.length > 0 ? 'border-bad/25 bg-bad/6' : 'border-warn/30 bg-warn/8'}`}>
                {vencidas.length > 0 && (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-bad shrink-0 mt-0.5" />
                    <p className="text-sm font-bold text-bad">
                      {vencidas.length === 1
                        ? t.mpdVencidoUno.replace('{nombre}', vencidas[0])
                        : t.mpdVencidosN.replace('{n}', String(vencidas.length)).replace('{lista}', vencidas.join(', '))}
                    </p>
                  </div>
                )}
                {proximas.length > 0 && (
                  <div className="flex items-start gap-2">
                    <CalendarDays className="h-4 w-4 text-[#7a4f00] shrink-0 mt-0.5" />
                    <p className="text-sm font-bold text-[#7a4f00]">
                      {proximas.length === 1
                        ? t.mpdProximaUna.replace('{nombre}', proximas[0])
                        : t.mpdProximasN.replace('{n}', String(proximas.length)).replace('{lista}', proximas.join(', '))}
                    </p>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Identificación */}
          <div className="card mb-5 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink">
                <Cpu className="h-4 w-4 text-brand-primary" /> {t.mpdIdentificacion}
              </h2>
              {isPro ? (
                <Link
                  href={`/mis-perros/${id}/cartel`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20"
                >
                  <Download className="h-3.5 w-3.5" /> {t.mpdGuardarPDF}
                </Link>
              ) : (
                <Link href="/planes"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20"
                >
                  <Lock className="h-3.5 w-3.5" /> {t.mpdGuardarPDF}
                </Link>
              )}
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <DataItem label={t.mpdMicrochip}        value={perro.chip      || '—'} mono />
              <DataItem label={t.mpdFechaNacLabel}   value={perro.fecha_nac ? formatFecha(perro.fecha_nac) : '—'} />
              <DataItem label={t.mpdEdadLabel}        value={edad            || '—'} />
              <DataItem label={t.mpdCiudadLabel}      value={ciudad ? nombreCorto(ciudad) : '—'} />
              <DataItem label={t.mpdEsterilizadoLabel} value={perro.esterilizado ? 'Sí' : 'No'} />
            </dl>
            {perro.alergias && (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-bad/25 bg-bad/6 px-3 py-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-bad mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-bad">{t.mpdAlergiasLabel}</p>
                  <p className="text-sm font-semibold text-ink">{perro.alergias}</p>
                </div>
              </div>
            )}
          </div>

          {/* Veterinario habitual */}
          {(perro.vet_nombre || perro.vet_telefono) && (
            <div className="card mb-5 p-5">
              <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink mb-3">
                <Stethoscope className="h-4 w-4 text-brand-primary" /> {t.mpdVetHabitual}
              </h2>
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-brand-cream p-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10">
                    <Stethoscope className="h-5 w-5 text-brand-primary" />
                  </div>
                  <div>
                    {perro.vet_nombre    && <p className="font-bold text-ink">{perro.vet_nombre}</p>}
                    {perro.vet_telefono  && <p className="text-sm text-ink-muted">{perro.vet_telefono}</p>}
                  </div>
                </div>
                {perro.vet_telefono && (
                  <a
                    href={`https://wa.me/${perro.vet_telefono.replace(/\D/g, '')}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-2 text-xs font-bold text-white transition hover:opacity-90 shrink-0"
                  >
                    <Phone className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Vacunas */}
          <div className="card p-5 mb-5">
            <div className="mb-4 flex items-center gap-2">
              <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink">
                <Syringe className="h-4 w-4 text-brand-primary" /> {t.mpdCarnetVacunas}
                {vacunas.length > 0 && (
                  <span className="rounded-full bg-good/15 px-2 py-0.5 text-xs font-bold text-good">
                    {t.mpdVacunasRegistradas.replace('{n}', String(vacunas.length)).replace('{s}', vacunas.length > 1 ? 's' : '')}
                  </span>
                )}
              </h2>
              {isPro ? (
                <div className="ml-auto flex gap-2">
                  {vacunas.length > 0 && (
                    <button type="button" onClick={() => setShowEnviarVacunas(true)}
                      className="inline-flex items-center gap-1 rounded-xl bg-brand-primary px-3 py-1.5 text-xs font-bold text-white transition hover:bg-brand-primary/90">
                      <Send className="h-3 w-3" /> Enviar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => { setAgregandoVacuna(true); setEditandoVacunaId(null); }}
                    className="inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20"
                  >
                    {t.mpdAgregar}
                  </button>
                </div>
              ) : (
                <Link href="/planes" className="ml-auto inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20">
                  <Sparkles className="h-3 w-3" /> VecindogPro
                </Link>
              )}
              {showEnviarVacunas && (
                <EnviarTextoModal
                  titulo="Enviar carnet de vacunas"
                  subtitulo={`${perro.nombre} · ${vacunas.length} vacuna${vacunas.length !== 1 ? 's' : ''}`}
                  texto={[
                    `💉 Carnet de vacunas de ${perro.nombre} 🐾`,
                    '',
                    ...vacunas.map((v) => `• ${v.nombre} — ${formatFecha(v.fecha)}${v.proxima ? ` (próxima: ${formatFecha(v.proxima)})` : ''}`),
                  ].join('\n')}
                  onClose={() => setShowEnviarVacunas(false)}
                />
              )}
            </div>

            {agregandoVacuna && (
              <VacunaForm
                onSave={handleAgregarVacuna}
                onCancel={() => setAgregandoVacuna(false)}
              />
            )}

            {vacunas.length === 0 && !agregandoVacuna ? (
              <p className="text-sm text-ink-muted">{t.mpdSinVacunas}</p>
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

          {/* Desparasitaciones */}
          <DesparasitacionesSection
            perroId={perro.id}
            desparasitaciones={desparasitaciones}
            agregando={agregandoDesparas}
            editandoId={editandoDesparaId}
            onAgregar={handleAgregarDesparasitacion}
            onActualizar={handleActualizarDesparasitacion}
            onEliminar={handleEliminarDesparasitacion}
            onSetAgregando={(v) => { setAgregandoDesparas(v); setEditandoDesparaId(null); }}
            onSetEditandoId={(id) => { setEditandoDesparaId(id); setAgregandoDesparas(false); }}
            locked={!isPro}
            perroNombre={perro.nombre}
          />

          {/* Medicamentos */}
          <MedicamentosSection
            perroId={perro.id}
            medicamentos={medicamentos}
            onAgregar={handleAgregarMedicamento}
            onEliminar={handleEliminarMedicamento}
            locked={!isPro}
            perroNombre={perro.nombre}
          />

          {/* Historial de peso */}
          <PesoSection
            pesos={pesos}
            agregando={agregandoPeso}
            onAgregar={handleAgregarPeso}
            onEliminar={handleEliminarPeso}
            onSetAgregando={setAgregandoPeso}
            locked={!isPro}
            perroNombre={perro.nombre}
          />

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
            locked={!isPro}
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
            locked={!isPro}
            turno={turnos.find((t) => t.tipo === 'radiografia') ?? null}
            onRegistrarTurno={(fecha, nota) => handleRegistrarTurno('radiografia', fecha, nota)}
            onEliminarTurno={(id) => handleEliminarTurno(id)}
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
            locked={!isPro}
            turno={turnos.find((t) => t.tipo === 'ecografia') ?? null}
            onRegistrarTurno={(fecha, nota) => handleRegistrarTurno('ecografia', fecha, nota)}
            onEliminarTurno={(id) => handleEliminarTurno(id)}
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
            locked={!isPro}
          />

          {/* Certificado CVI */}
          <CVISection
            estudios={estudios.filter((e) => e.tipo === 'certificado_cvi')}
            subiendo={subiendoTipo === 'certificado_cvi'}
            onSubir={(f) => handleSubirEstudio('certificado_cvi', f)}
            onEnviar={setEstudioEnviar}
            onEliminar={handleEliminarEstudio}
            locked={!isPro}
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
            locked={!isPro}
          />

          {/* Visitas al veterinario */}
          <VisitasVetSection
            visitas={visitasVet}
            onAgregar={handleAgregarVisita}
            onEliminar={handleEliminarVisita}
            locked={!isPro}
          />

          {/* Procedimientos / Cirugías */}
          <ProcedimientosSection
            procedimientos={procedimientos}
            onAgregar={handleAgregarProcedimiento}
            onEliminar={handleEliminarProcedimiento}
            locked={!isPro}
          />

          {/* Dieta y alimentación */}
          <DietaSection
            perro={perro}
            onGuardar={async (d) => {
              await actualizarPerro(perro.id, d);
              setPerro((p) => p ? { ...p, dieta_marca: d.dieta_marca||null, dieta_cantidad: d.dieta_cantidad||null, dieta_frecuencia: d.dieta_frecuencia||null, dieta_notas: d.dieta_notas||null } : p);
            }}
            locked={!isPro}
          />

          {/* Grooming */}
          <GroomingSection
            perroId={perro.id}
            grooming={grooming}
            onGuardar={handleGuardarGrooming}
            locked={!isPro}
          />

          {/* Galería de fotos */}
          <GaleriaSection
            fotos={fotos}
            onAgregar={handleAgregarFoto}
            onEliminar={handleEliminarFoto}
            locked={!isPro}
          />

          {/* Contactos de emergencia */}
          <ContactosSection
            contactos={contactos}
            onAgregar={handleAgregarContacto}
            onEliminar={handleEliminarContacto}
          />

          {/* AirTag */}
          <AirTagSection
            perroId={perro.id}
            airtags={estudios.filter((e) => e.tipo === 'airtag')}
            onAdd={(e) => setEstudios((prev) => [e, ...prev])}
            onDelete={handleEliminarEstudio}
            locked={!isPro}
          />

          {/* Modal enviar estudio */}
          {estudioEnviar && (
            <EnviarEstudioModal
              estudio={estudioEnviar}
              perroNombre={perro.nombre}
              onClose={() => setEstudioEnviar(null)}
            />
          )}

          {/* Modal QR collar */}
          {showQR && (
            <QRModal
              perroId={perro.id}
              perroNombre={perro.nombre}
              onClose={() => setShowQR(false)}
            />
          )}

          {/* Buscar veterinario en Red Vecindog */}
          <div className="card mb-5 flex items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-50">
                <Store className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">{t.mpdEncontrarVet}</p>
                <p className="text-xs text-ink-muted">{t.mpdRedVetSub}</p>
              </div>
            </div>
            <Link
              href="/red-vecindog/veterinaria"
              className="shrink-0 rounded-2xl bg-teal-50 px-3 py-2 text-xs font-bold text-teal-700 transition hover:bg-teal-100"
            >
              {t.mpdVerVets}
            </Link>
          </div>

          {/* Historia Clínica */}
          <HistoriaClinica
            perro={perro}
            vacunas={vacunas}
            estudios={estudios}
            desparasitaciones={desparasitaciones}
            pesos={pesos}
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
                  <p className="text-sm font-bold text-ink">{t.mpdAvisoActivo}</p>
                </div>
                <p className="text-xs text-ink-muted mb-3">
                  {t.mpdAvisoActivoSub.replace('{nombre}', perro.nombre)}
                </p>
                <div className="flex gap-2">
                  {renovado ? (
                    <span className="inline-flex items-center gap-1.5 rounded-2xl bg-good/15 px-4 py-2 text-sm font-bold text-good">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {t.mpdAvisoRenovado}
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
                      {t.mpdRenovarAviso}
                    </button>
                  )}
                  <Link
                    href={`/publicaciones/${postActivo.id}`}
                    className="inline-flex items-center gap-1 rounded-2xl border-2 border-amber-200 px-4 py-2 text-sm font-bold text-amber-700 transition hover:bg-amber-50"
                  >
                    {t.mpdVerAviso}
                  </Link>
                </div>
              </div>
            ) : (
              /* Sin aviso activo */
              <div className="mt-6 rounded-2xl bg-gradient-to-br from-brand-coral/10 to-brand-coral/5 p-5 ring-1 ring-brand-coral/20">
                <p className="text-sm font-bold text-ink">{t.mpdPerdiste.replace('{nombre}', perro.nombre)}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{t.mpdPerdistesSub}</p>
                <Link
                  href={`/publicar?cat=perdido&perro=${perro.id}`}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-2xl bg-brand-coral px-4 py-2 text-sm font-bold text-white transition hover:bg-brand-coral-dark"
                >
                  <MapPin className="h-3.5 w-3.5" /> {t.mpdPublicarAviso}
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
  onDelete,
}: {
  perro:    Perro;
  onSave:   (updated: Perro) => void;
  onCancel: () => void;
  onDelete: () => Promise<void>;
}) {
  const { isPro } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState<PerroInput>({
    nombre:           perro.nombre,
    raza:             perro.raza             ?? '',
    color:            perro.color            ?? '',
    tamano:           perro.tamano           ?? '',
    sexo:             perro.sexo             ?? '',
    fecha_nac:        perro.fecha_nac        ?? '',
    chip:             perro.chip             ?? '',
    esterilizado:     perro.esterilizado     ?? false,
    descripcion:      perro.descripcion      ?? '',
    alergias:         perro.alergias         ?? '',
    vet_nombre:       perro.vet_nombre       ?? '',
    vet_telefono:     perro.vet_telefono     ?? '',
    direccion:        perro.direccion        ?? '',
    foto_url:         perro.foto_url         ?? '',
    estado_salud:     perro.estado_salud     ?? '',
    dieta_marca:      perro.dieta_marca      ?? '',
    dieta_cantidad:   perro.dieta_cantidad   ?? '',
    dieta_frecuencia: perro.dieta_frecuencia ?? '',
    dieta_notas:      perro.dieta_notas      ?? '',
  });
  const [fotoFile,        setFotoFile]        = useState<File | null>(null);
  const [fotoPreview,     setFotoPreview]     = useState<string>(perro.foto_url ?? '');
  const [saving,          setSaving]          = useState(false);
  const [error,           setError]           = useState('');
  const [confirmEliminar, setConfirmEliminar] = useState(false);
  const [eliminando,      setEliminando]      = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleEliminar() {
    setEliminando(true);
    try {
      await onDelete();
    } catch {
      setError('No se pudo eliminar el perfil. Intentá de nuevo.');
      setEliminando(false);
    }
  }

  function campo<K extends keyof PerroInput>(k: K, v: PerroInput[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function onFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError(t.mpdFotoError); return; }
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
      onSave({ ...perro, ...form, tamano: form.tamano || null, sexo: form.sexo || null, foto_url: fotoUrl, estado_salud: form.estado_salud || null } as Perro);
    } catch {
      setError(t.mpdErrGuardar);
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
              <span className="text-sm font-bold">{t.mpdSubirFoto}</span>
            </div>
          )}
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-xl bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
            <ImagePlus className="h-3.5 w-3.5" /> {t.mpdCambiarFoto}
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFoto} />
      </div>

      {/* Campos */}
      <div className="card space-y-4 p-5">
        <div>
          <label className="label">{t.mpdNombreLabel} <span className="text-bad">*</span></label>
          <input className="field w-full" value={form.nombre} required
            onChange={(e) => campo('nombre', e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">{t.mpdRazaLabel}</label>
            <RazaAutocomplete value={form.raza} onChange={(v) => campo('raza', v)} />
          </div>
          <div>
            <label className="label">{t.mpdColorLabel}</label>
            <input className="field w-full" value={form.color} placeholder={t.mpdColorPlaceholder}
              onChange={(e) => campo('color', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">{t.mpdSexoLabel}</label>
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
            <label className="label">{t.mpdTamanoLabel}</label>
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
            <label className="label">{t.mpdFechaNacFormLabel}</label>
            <input type="date" className="field w-full" value={form.fecha_nac}
              onChange={(e) => campo('fecha_nac', e.target.value)} />
          </div>
          <div>
            <label className="label flex items-center gap-1.5">
              Microchip
              {!isPro && <Link href="/planes" className="inline-flex items-center gap-0.5 text-[10px] font-bold text-brand-primary/60 hover:text-brand-primary"><Lock className="h-2.5 w-2.5" /> Pro</Link>}
            </label>
            <input className="field w-full font-mono disabled:opacity-50 disabled:cursor-not-allowed" value={form.chip} placeholder={t.mpdChipPlaceholder}
              disabled={!isPro}
              onChange={(e) => campo('chip', e.target.value)} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="edit-ester" checked={form.esterilizado}
            onChange={(e) => campo('esterilizado', e.target.checked)}
            className="h-4 w-4 accent-brand-primary" />
          <label htmlFor="edit-ester" className="text-sm font-semibold text-ink">{t.mpdEsterilizadoCheck}</label>
        </div>

        <div>
          <label className="label">{t.mpdDescripcionLabel}</label>
          <textarea className="field w-full" rows={3} value={form.descripcion}
            placeholder={t.mpdDescripcionPlaceholder}
            onChange={(e) => campo('descripcion', e.target.value)} />
        </div>

        <div>
          <label className="label flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-bad/70" /> {t.mpdAlergiasCond}
          </label>
          <textarea className="field w-full" rows={2} value={form.alergias}
            placeholder={t.mpdAlergiasPlaceholder}
            onChange={(e) => campo('alergias', e.target.value)} />
        </div>
      </div>

      {/* Veterinario */}
      <div className="card space-y-4 p-5">
        <h3 className="flex items-center gap-2 font-display text-sm font-extrabold text-ink">
          <Stethoscope className="h-4 w-4 text-brand-primary" /> {t.mpdVetHabitual}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">{t.mpdVetNombreLabel}</label>
            <input className="field w-full" value={form.vet_nombre}
              placeholder="Dr. García / Clínica Mascotas"
              onChange={(e) => campo('vet_nombre', e.target.value)} />
          </div>
          <div>
            <label className="label">{t.mpdVetTelefonoLabel}</label>
            <input className="field w-full" value={form.vet_telefono}
              placeholder="+54 11 XXXX-XXXX"
              onChange={(e) => campo('vet_telefono', e.target.value)} />
          </div>
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
          <X className="h-4 w-4" /> {t.mpdCancelar}
        </button>
        <button type="submit" disabled={saving}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-brand-primary py-3 text-sm font-bold text-white shadow-soft transition hover:opacity-90 disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> {t.mpdGuardarCambios}</>}
        </button>
      </div>

      {/* Zona peligrosa — eliminar perro */}
      {!confirmEliminar ? (
        <button
          type="button"
          onClick={() => setConfirmEliminar(true)}
          className="flex w-full items-center justify-center gap-1.5 rounded-2xl border-2 border-bad/20 py-2.5 text-sm font-bold text-bad/50 transition hover:border-bad/40 hover:text-bad"
        >
          <Trash2 className="h-4 w-4" /> {t.mpdEliminarPerfil.replace('{nombre}', perro.nombre)}
        </button>
      ) : (
        <div className="rounded-2xl border border-bad/25 bg-bad/5 p-4 space-y-3">
          <p className="text-sm font-extrabold text-bad">{t.mpdEliminarConfirm.replace('{nombre}', perro.nombre)}</p>
          <p className="text-xs text-ink-muted leading-relaxed">
            {t.mpdEliminarWarning.replace(/{nombre}/g, perro.nombre)}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={eliminando}
              onClick={handleEliminar}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-bad py-2.5 text-sm font-extrabold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {eliminando ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Trash2 className="h-4 w-4" /> {t.mpdSiEliminar}</>}
            </button>
            <button
              type="button"
              onClick={() => setConfirmEliminar(false)}
              disabled={eliminando}
              className="flex-1 rounded-2xl border-2 border-black/10 py-2.5 text-sm font-bold text-ink-muted transition hover:border-black/20 disabled:opacity-60"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
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
  const { t } = useLanguage();
  const proxima = vacuna.proxima ? new Date(vacuna.proxima) : null;
  const vencida  = proxima && proxima < new Date();
  return (
    <div className="rounded-2xl bg-brand-cream p-3.5">
      <div className="flex items-start justify-between gap-2">
        <span className="font-bold text-ink">{vacuna.nombre}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {proxima && (
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${vencida ? 'bg-bad/15 text-bad' : 'bg-good/15 text-good'}`}>
              {vencida ? t.mpdVacunaVencida : t.mpdVacunaVigente}
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
        {proxima && <span className={vencida ? 'font-bold text-bad' : ''}>{t.mpdVacunaProxima} {formatFecha(vacuna.proxima)}</span>}
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
  const { t } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  function campo<K extends keyof VacunaInput>(k: K, v: VacunaInput[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre || !form.fecha) { setError(t.mpdVacunaErrReq); return; }
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
        <label className="label text-xs">{t.mpdVacunaLabel} <span className="text-bad">*</span></label>
        <input
          list="vacunas-comunes"
          className="field w-full text-sm"
          placeholder={t.mpdVacunaPlaceholder}
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
          <label className="label text-xs">{t.mpdFechaReqLabel} <span className="text-bad">*</span></label>
          <input type="date" className="field w-full text-sm" value={form.fecha}
            onChange={(e) => campo('fecha', e.target.value)} required />
        </div>
        <div>
          <label className="label text-xs">{t.mpdProximaDosis}</label>
          <input type="date" className="field w-full text-sm" value={form.proxima}
            onChange={(e) => campo('proxima', e.target.value)} />
        </div>
      </div>

      <div>
        <label className="label text-xs">{t.mpdVetFormLabel}</label>
        <input className="field w-full text-sm" placeholder="Dr. García…" value={form.veterinario}
          onChange={(e) => campo('veterinario', e.target.value)} />
      </div>

      <div>
        <label className="label text-xs">{t.mpdNotasLabel}</label>
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
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> {inicial ? t.mpdGuardarCambios : t.mpdAgregarVacuna}</>}
        </button>
        <button type="button" onClick={onCancel} disabled={saving}
          className="rounded-xl border-2 border-black/10 px-4 py-2.5 text-sm font-bold text-ink-muted transition hover:border-bad/40 hover:text-bad disabled:opacity-60">
          {t.mpdCancelar}
        </button>
      </div>
    </form>
  );
}

/* ── AirTag ── */
function AirTagSection({
  perroId, airtags, onAdd, onDelete, locked,
}: {
  perroId:  string;
  airtags:  Estudio[];
  onAdd:    (e: Estudio) => void;
  onDelete: (id: string) => void;
  locked?:  boolean;
}) {
  const { t } = useLanguage();
  const [agregando, setAgregando] = useState(false);
  const [serial,    setSerial]    = useState('');
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    if (!serial.trim()) { setError(t.mpdAirTagErrReq); return; }
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
          <span className="text-base">📍</span> {t.mpdAirTagTitle}
          {airtags.length > 0 && (
            <span className="ml-1 rounded-full bg-brand-primary/10 px-2 py-0.5 text-xs font-bold text-brand-primary">
              {airtags.length}
            </span>
          )}
        </h2>
        {locked ? (
          <Link href="/planes" className="inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20">
            <Sparkles className="h-3 w-3" /> VecindogPro
          </Link>
        ) : !agregando && (
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
            <label className="label text-xs">{t.mpdAirTagLabel} <span className="text-bad">*</span></label>
            <input
              className="field w-full font-mono text-sm"
              placeholder="Ej: XXXXXXXX"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              autoFocus
            />
            <p className="mt-1 text-[11px] text-ink-muted">{t.mpdAirTagTip}</p>
          </div>
          {error && (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-bad">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
            </p>
          )}
          <div className="flex gap-2">
            <button type="submit" disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4" /> {t.mpdGuardar}</>}
            </button>
            <button type="button" onClick={() => { setAgregando(false); setSerial(''); setError(''); }} disabled={saving}
              className="rounded-xl border-2 border-black/10 px-4 py-2.5 text-sm font-bold text-ink-muted transition hover:border-bad/40 hover:text-bad disabled:opacity-60">
              {t.mpdCancelar}
            </button>
          </div>
        </form>
      )}

      {/* Lista de AirTags */}
      {airtags.length === 0 && !agregando ? (
        <p className="text-sm text-ink-muted">{t.mpdAirTagVacio}</p>
      ) : (
        <div className="space-y-3">
          {airtags.map((a) => (
            <div key={a.id} className="rounded-2xl bg-brand-cream p-3.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">{t.mpdAirTagNSerie}</p>
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
        <p className="text-xs font-bold text-amber-700 mb-1">{t.mpdAirTagPerdidoTitle}</p>
        <p className="text-xs text-amber-600 leading-relaxed">{t.mpdAirTagPerdidoDesc}</p>
        <a
          href="https://support.apple.com/es-ar/HT212331"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:underline"
        >
          <Globe className="h-3 w-3" /> {t.mpdAirTagModoLink}
        </a>
      </div>
    </div>
  );
}

/* ── Certificado de Chip ── */
function ChipCertificadoSection({
  perro, estudios, subiendo, onSubir, onEnviar, onEliminar, onChipUpdate, locked,
}: {
  perro:         Perro;
  estudios:      Estudio[];
  subiendo:      boolean;
  onSubir:       (f: File) => Promise<void>;
  onEnviar:      (e: Estudio) => void;
  onEliminar:    (id: string) => void;
  onChipUpdate:  (chip: string) => void;
  locked?:       boolean;
}) {
  const { t } = useLanguage();
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
      setUploadError(t.mpdErrSubir);
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
          <Cpu className="h-4 w-4 text-brand-primary" /> {t.mpdChipCertTitle}
          {estudios.length > 0 && (
            <span className="ml-1 rounded-full bg-brand-primary/10 px-2 py-0.5 text-xs font-bold text-brand-primary">
              {estudios.length}
            </span>
          )}
        </h2>
        {locked ? (
          <Link href="/planes" className="inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20">
            <Sparkles className="h-3 w-3" /> VecindogPro
          </Link>
        ) : !pendingFile && (
          <button
            type="button"
            onClick={() => { setUploadError(''); fileRef.current?.click(); }}
            disabled={subiendo}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20 disabled:opacity-60"
          >
            <Upload className="h-3.5 w-3.5" /> {t.mpdSubirCertificado}
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
        {locked ? (
          /* Sin Pro: solo lectura con candado */
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">{t.mpdNumeroChip}</p>
              <p className={`mt-0.5 font-mono text-sm font-bold ${perro.chip ? 'text-ink' : 'text-ink-muted/50'}`}>
                {perro.chip || t.mpdSinRegistrar}
              </p>
            </div>
            <Link href="/planes" className="inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-2.5 py-1.5 text-xs font-bold text-brand-primary/60 shrink-0 transition hover:bg-brand-primary/20 hover:text-brand-primary">
              <Lock className="h-3 w-3" /> {t.mpdEditarBtn}
            </Link>
          </div>
        ) : editandoChip ? (
          /* Pro + editando */
          <form onSubmit={handleSaveChip} className="flex items-center gap-2">
            <input
              className="field flex-1 font-mono text-sm"
              placeholder={t.mpdChipPlaceholderForm}
              value={chip}
              onChange={(e) => setChip(e.target.value)}
              autoFocus
            />
            <button type="submit" disabled={savingChip}
              className="inline-flex items-center gap-1 rounded-xl bg-brand-primary px-3 py-2 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-60 shrink-0">
              {savingChip ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Check className="h-3.5 w-3.5" /> {t.mpdGuardar}</>}
            </button>
            <button type="button" onClick={() => { setEditandoChip(false); setChip(perro.chip ?? ''); }}
              className="rounded-xl border-2 border-black/10 px-3 py-2 text-xs font-bold text-ink-muted transition hover:border-bad/40 hover:text-bad shrink-0">
              {t.mpdCancelar}
            </button>
          </form>
        ) : (
          /* Pro + display */
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">{t.mpdNumeroChip}</p>
              <p className={`mt-0.5 font-mono text-sm font-bold ${perro.chip ? 'text-ink' : 'text-ink-muted/50'}`}>
                {perro.chip || t.mpdSinRegistrar}
              </p>
            </div>
            <button type="button" onClick={() => setEditandoChip(true)}
              className="inline-flex items-center gap-1 rounded-xl bg-black/5 px-3 py-1.5 text-xs font-bold text-ink-muted transition hover:bg-brand-primary/10 hover:text-brand-primary shrink-0">
              <Pencil className="h-3 w-3" /> {perro.chip ? t.mpdEditarBtn : t.mpdAgregarBtn}
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
              {subiendo ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4" /> {t.mpdConfirmarSubir}</>}
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
        <p className="text-sm text-ink-muted">{t.mpdSinCertificados}</p>
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
  estudios, subiendo, onSubir, onEnviar, onEliminar, locked,
}: {
  estudios:   Estudio[];
  subiendo:   boolean;
  onSubir:    (f: File) => Promise<void>;
  onEnviar:   (e: Estudio) => void;
  onEliminar: (id: string) => void;
  locked?:    boolean;
}) {
  const { t } = useLanguage();
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
          <Globe className="h-4 w-4 text-brand-primary" /> {t.mpdCVITitle}
          {estudios.length > 0 && (
            <span className="ml-1 rounded-full bg-brand-primary/10 px-2 py-0.5 text-xs font-bold text-brand-primary">
              {estudios.length}
            </span>
          )}
        </h2>
        {locked ? (
          <Link href="/planes" className="inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20">
            <Sparkles className="h-3 w-3" /> VecindogPro
          </Link>
        ) : !pendingFile && (
          <>
            <button type="button"
              onClick={() => { setUploadError(''); fileRef.current?.click(); }}
              disabled={subiendo}
              className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20 disabled:opacity-60">
              <Upload className="h-3.5 w-3.5" /> {t.mpdSubirCertificado}
            </button>
            <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) { setPendingFile(f); setUploadError(''); }
                e.target.value = '';
              }} />
          </>
        )}
      </div>

      {/* Selector de país — solo Pro */}
      {locked ? (
        <Link href="/planes" className="mb-4 flex w-full items-center justify-between rounded-2xl border border-black/10 bg-black/5 px-4 py-3 text-sm font-bold text-ink-muted/50 transition hover:bg-brand-primary/5 hover:text-brand-primary/70">
          <span className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {t.mpdCVIPaises}
          </span>
          <Lock className="h-4 w-4" />
        </Link>
      ) : <>
      <button
        type="button"
        onClick={() => setRequisitosOpen((o) => !o)}
        className="mb-4 flex w-full items-center justify-between rounded-2xl border border-brand-primary/20 bg-brand-primary/5 px-4 py-3 text-sm font-bold text-brand-primary transition hover:bg-brand-primary/10"
      >
        <span className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          {t.mpdCVIPaises}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${requisitosOpen ? 'rotate-180' : ''}`} />
      </button>

      {requisitosOpen && (
        <div className="mb-4">
          <input
            type="text"
            placeholder={t.mpdCVIBuscar}
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
              <p className="px-4 py-3 text-sm text-ink-muted">{t.mpdCVISinDestino}</p>
            )}
          </div>
          <p className="mt-2 text-[11px] text-ink-muted">{t.mpdCVIFuente}</p>
        </div>
      )}
      </>}

      {/* Confirmación de subida */}
      {!locked && pendingFile && (
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
              {subiendo ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4" /> {t.mpdConfirmarSubir}</>}
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
        <p className="text-sm text-ink-muted">{t.mpdSinCertificados}</p>
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

/* Días de validez por tipo de estudio (para alertas de vencimiento) */
const VALIDEZ_DIAS: Partial<Record<TipoEstudio, number>> = {
  certificado_cvi:            10,
  certificado_antiparasitario: 90,
  laboratorio:                180,
};

/* ── Sección de estudios ── */
function EstudiosSection({
  tipo, titulo, icono, accept, estudios, subiendo, onSubir, onEnviar, onEliminar, locked,
  turno, onRegistrarTurno, onEliminarTurno,
}: {
  tipo:               TipoEstudio;
  titulo:             string;
  icono:              React.ReactNode;
  accept:             string;
  estudios:           Estudio[];
  subiendo:           boolean;
  onSubir:            (f: File) => Promise<void>;
  onEnviar:           (e: Estudio) => void;
  onEliminar:         (id: string) => void;
  locked?:            boolean;
  turno?:             Turno | null;
  onRegistrarTurno?:  (fecha: string, nota: string) => Promise<void>;
  onEliminarTurno?:   (id: string) => void;
}) {
  const { t } = useLanguage();
  const fileRef                         = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile]   = useState<File | null>(null);
  const [uploadError, setUploadError]   = useState('');
  const [showTurnoForm, setShowTurnoForm] = useState(false);
  const [turnoFecha,    setTurnoFecha]    = useState('');
  const [turnoNota,     setTurnoNota]     = useState('');
  const [guardandoTurno, setGuardandoTurno] = useState(false);
  const [turnoError,     setTurnoError]     = useState('');

  const esTipoConTurno = tipo === 'ecografia' || tipo === 'radiografia';

  const [showCotizacionModal, setShowCotizacionModal] = useState(false);

  // Alerta de vencimiento
  const validezDias = VALIDEZ_DIAS[tipo];
  const masReciente = estudios[0];
  const diasDesde   = masReciente?.fecha
    ? Math.floor((Date.now() - new Date(masReciente.fecha).getTime()) / 86_400_000)
    : null;
  const vencido    = validezDias != null && diasDesde != null && diasDesde > validezDias;
  const porVencer  = validezDias != null && diasDesde != null && diasDesde > validezDias * 0.75 && !vencido;

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
          {vencido && (
            <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-bad/10 px-2 py-0.5 text-[10px] font-bold text-bad">
              <TriangleAlert className="h-2.5 w-2.5" /> {t.mpdVacunaVencida}
            </span>
          )}
          {porVencer && (
            <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
              <Clock className="h-2.5 w-2.5" /> {t.mpdPorVencer}
            </span>
          )}
        </h2>
        {locked ? (
          <Link href="/planes" className="inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20">
            <Sparkles className="h-3 w-3" /> VecindogPro
          </Link>
        ) : !pendingFile && (
          <button
            type="button"
            onClick={() => { setUploadError(''); fileRef.current?.click(); }}
            disabled={subiendo}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20 disabled:opacity-60"
          >
            <Upload className="h-3.5 w-3.5" /> {t.mpdSubirArchivo}
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
              {subiendo ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4" /> {t.mpdConfirmarSubir}</>}
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
        <p className="text-sm text-ink-muted">{t.mpdSinArchivos}</p>
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

      {/* Sección de turno — solo ecografía y radiografía */}
      {/* Banner cotización — solo laboratorio */}
      {tipo === 'laboratorio' && (
        <div className="mt-4 border-t border-black/5 pt-4">
          <div className="flex items-center justify-between rounded-2xl bg-brand-cream px-4 py-3">
            <div className="flex items-center gap-2">
              <FlaskConical className="h-4 w-4 shrink-0 text-brand-primary/60" />
              <p className="text-sm text-ink-muted">{t.mpdCotizacionSub}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowCotizacionModal(true)}
              className="ml-3 shrink-0 text-xs font-bold text-brand-primary hover:underline"
            >
              {t.mpdCotizacionLink}
            </button>
          </div>
          {showCotizacionModal && (
            <CotizacionLabModal onClose={() => setShowCotizacionModal(false)} />
          )}
        </div>
      )}

      {esTipoConTurno && onRegistrarTurno && !locked && (
        <div className="mt-4 border-t border-black/5 pt-4">
          {turno ? (
            /* Turno ya registrado */
            <div className="flex items-center gap-3 rounded-2xl bg-green-50 px-4 py-3">
              <CalendarDays className="h-4 w-4 shrink-0 text-green-600" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-green-700">{t.mpdTurnoRegistrado}</p>
                <p className="text-sm font-semibold text-ink">{formatFecha(turno.fecha)}</p>
                {turno.nota && <p className="text-xs text-ink-muted">{turno.nota}</p>}
              </div>
              <button
                type="button"
                onClick={() => onEliminarTurno?.(turno.id)}
                title="Eliminar turno"
                className="text-ink-muted/40 hover:text-bad transition shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : showTurnoForm ? (
            /* Formulario para registrar turno */
            <div className="rounded-2xl border-2 border-brand-primary/20 bg-brand-primary/5 p-4">
              <p className="mb-3 text-sm font-bold text-ink">
                {tipo === 'ecografia' ? t.mpdRegistrarTurnoEco : t.mpdRegistrarTurnoRad}
              </p>
              <div className="space-y-2">
                <input
                  type="date"
                  value={turnoFecha}
                  onChange={(e) => setTurnoFecha(e.target.value)}
                  className="w-full rounded-xl border-2 border-black/10 bg-white px-3 py-2 text-sm font-medium text-ink focus:border-brand-primary focus:outline-none"
                />
                <input
                  type="text"
                  value={turnoNota}
                  onChange={(e) => setTurnoNota(e.target.value)}
                  placeholder={t.mpdTurnoNotaPlaceholder}
                  className="w-full rounded-xl border-2 border-black/10 bg-white px-3 py-2 text-sm font-medium text-ink placeholder:text-ink-muted/50 focus:border-brand-primary focus:outline-none"
                />
              </div>
              {turnoError && (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-bad">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {turnoError}
                </p>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  disabled={!turnoFecha || guardandoTurno}
                  onClick={async () => {
                    if (!turnoFecha) return;
                    setGuardandoTurno(true);
                    setTurnoError('');
                    try {
                      await onRegistrarTurno(turnoFecha, turnoNota);
                      setShowTurnoForm(false);
                      setTurnoFecha('');
                      setTurnoNota('');
                    } catch (e: unknown) {
                      setTurnoError(e instanceof Error ? e.message : 'No se pudo guardar el turno.');
                    } finally {
                      setGuardandoTurno(false);
                    }
                  }}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary py-2.5 text-sm font-bold text-white transition hover:bg-brand-primary/90 disabled:opacity-60"
                >
                  {guardandoTurno
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <><CalendarDays className="h-4 w-4" /> {t.mpdRegistrarBtn}</>}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowTurnoForm(false); setTurnoFecha(''); setTurnoNota(''); }}
                  className="rounded-xl border-2 border-black/10 px-4 py-2.5 text-sm font-bold text-ink-muted transition hover:border-bad/40 hover:text-bad"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            /* Banner "¿Tenés turno?" */
            <div className="flex items-center justify-between rounded-2xl bg-brand-cream px-4 py-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 shrink-0 text-brand-primary/60" />
                <p className="text-sm text-ink-muted">
                  {tipo === 'ecografia' ? t.mpdTeneTurnoEco : t.mpdTeneTurnoRad}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTurnoForm(true)}
                className="ml-3 shrink-0 text-xs font-bold text-brand-primary hover:underline"
              >
                {t.mpdRegistraAvisamos}
              </button>
            </div>
          )}
        </div>
      )}
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
  const { t } = useLanguage();
  const [email,  setEmail]  = useState('');
  const [copied, setCopied] = useState(false);

  const texto = `${t.mpdEnviarEstudio} — ${perroNombre} — ${estudio.nombre}\n${estudio.archivo_url}`;

  function enviarEmail() {
    const subject = encodeURIComponent(`${t.mpdEnviarEstudio}: ${estudio.nombre} — ${perroNombre}`);
    const body    = encodeURIComponent(`${estudio.nombre} — ${perroNombre}:\n${estudio.archivo_url}`);
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
          <h2 className="font-display text-xl font-black text-ink">{t.mpdEnviarEstudio}</h2>
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
            <Mail className="h-3.5 w-3.5 text-brand-primary" /> {t.mpdEnviarEmail}
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
              {t.mpdEnviar}
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
          <MessageCircle className="h-4 w-4" /> {t.mpdEnviarWA}
        </button>

        <button type="button" onClick={onClose}
          className="mt-3 w-full rounded-2xl border-2 border-black/10 py-2.5 text-sm font-bold text-ink-muted transition hover:border-black/20">
          {t.mpdCancelar}
        </button>
      </div>
    </div>
  );
}

/* ── Modal genérico para enviar texto por email / WhatsApp ── */
function EnviarTextoModal({ titulo, subtitulo, texto, onClose }: {
  titulo:    string;
  subtitulo: string;
  texto:     string;
  onClose:   () => void;
}) {
  const [email,  setEmail]  = useState('');
  const [copied, setCopied] = useState(false);

  function enviarEmail() {
    const s = encodeURIComponent(titulo);
    const b = encodeURIComponent(texto);
    window.open(`mailto:${encodeURIComponent(email.trim())}?subject=${s}&body=${b}`, '_blank');
  }
  function enviarWA() {
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  }
  async function copiar() {
    await navigator.clipboard.writeText(texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-0 sm:items-center sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-sm rounded-t-[32px] bg-white px-7 pb-8 pt-7 shadow-2xl sm:rounded-[32px]">
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-black/10 sm:hidden" />
        <div className="mb-5">
          <h2 className="font-display text-xl font-black text-ink">{titulo}</h2>
          <p className="mt-1 text-sm text-ink-muted">{subtitulo}</p>
        </div>
        <button type="button" onClick={copiar}
          className="mb-4 flex w-full items-center justify-between gap-2 rounded-2xl bg-brand-cream px-4 py-3 text-sm font-semibold text-ink transition hover:bg-brand-primary/10">
          <span className="truncate text-xs text-ink-muted">{texto.slice(0, 55)}…</span>
          {copied ? <Check className="h-4 w-4 shrink-0 text-good" /> : <Copy className="h-4 w-4 shrink-0 text-brand-primary" />}
        </button>
        <div className="mb-3">
          <label className="label mb-1 flex items-center gap-1.5 text-xs">
            <Mail className="h-3.5 w-3.5 text-brand-primary" /> Enviar por email
          </label>
          <div className="flex gap-2">
            <input type="email" placeholder="destinatario@email.com" value={email}
              onChange={(e) => setEmail(e.target.value)} className="field flex-1 text-sm" />
            <button type="button" onClick={enviarEmail} disabled={!email.trim()}
              className="rounded-2xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-primary/90 disabled:opacity-40">
              Enviar
            </button>
          </div>
        </div>
        <div className="my-4 flex items-center gap-3">
          <div className="flex-1 border-t border-black/10" />
          <span className="text-xs text-ink-muted">o</span>
          <div className="flex-1 border-t border-black/10" />
        </div>
        <button type="button" onClick={enviarWA}
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

/* ── Modal de cotización de laboratorio ── */
function CotizacionLabModal({ onClose }: { onClose: () => void }) {
  const [nombreApellido, setNombreApellido] = useState('');
  const [email,          setEmail]          = useState('');
  const [nombrePerro,    setNombrePerro]    = useState('');
  const [recetaFile,     setRecetaFile]     = useState<File | null>(null);
  const { t } = useLanguage();
  const [enviando,       setEnviando]       = useState(false);
  const [error,          setError]          = useState('');
  const [exito,          setExito]          = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleSubmit() {
    if (!nombreApellido.trim() || !email.trim() || !nombrePerro.trim()) {
      setError(t.mpdCotizErrCampos);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(t.mpdCotizErrEmail);
      return;
    }

    setEnviando(true);
    setError('');

    try {
      let receta_url = '';
      if (recetaFile) {
        receta_url = await subirArchivoEstudio(recetaFile);
      }

      const res = await fetch('/api/cotizacion-laboratorio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_apellido: nombreApellido.trim(),
          email:           email.trim(),
          nombre_perro:    nombrePerro.trim(),
          receta_url,
        }),
      });

      const data = await res.json();
      if (!data.ok) throw new Error(data.error ?? 'Error al enviar');

      setExito(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'No se pudo enviar. Intentá de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-0 sm:items-center sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-sm rounded-t-[32px] bg-white px-7 pb-8 pt-7 shadow-2xl sm:rounded-[32px]">
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-black/10 sm:hidden" />

        {exito ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-good/10">
              <CheckCircle2 className="h-8 w-8 text-good" />
            </div>
            <div>
              <h2 className="font-display text-xl font-black text-ink">{t.mpdCotizOk}</h2>
              <p className="mt-2 text-sm text-ink-muted">{t.mpdCotizOkSub}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full rounded-2xl bg-brand-primary py-3 text-sm font-bold text-white transition hover:bg-brand-primary/90"
            >
              {t.mpdCerrar}
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <h2 className="font-display text-xl font-black text-ink">{t.mpdCotizTitle}</h2>
              <p className="mt-1 text-sm text-ink-muted">{t.mpdCotizSub}</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-bold text-ink-muted">{t.mpdCotizNombreLabel} *</label>
                <input
                  type="text"
                  value={nombreApellido}
                  onChange={(e) => setNombreApellido(e.target.value)}
                  placeholder="Ej: María García"
                  className="field w-full text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-ink-muted">{t.mpdCotizEmailLabel} *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="field w-full text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-ink-muted">{t.mpdCotizPerroLabel} *</label>
                <input
                  type="text"
                  value={nombrePerro}
                  onChange={(e) => setNombrePerro(e.target.value)}
                  placeholder="Ej: Luna"
                  className="field w-full text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-ink-muted">{t.mpdCotizRecetaLabel}</label>
                {recetaFile ? (
                  <div className="flex items-center gap-3 rounded-2xl border-2 border-brand-primary/20 bg-brand-primary/5 px-4 py-2.5">
                    <FileText className="h-4 w-4 shrink-0 text-brand-primary" />
                    <p className="flex-1 min-w-0 truncate text-sm font-semibold text-ink">{recetaFile.name}</p>
                    <button type="button" onClick={() => setRecetaFile(null)} className="text-ink-muted/40 hover:text-bad transition">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-black/10 px-4 py-3 text-sm font-semibold text-ink-muted transition hover:border-brand-primary/40 hover:text-brand-primary"
                  >
                    <Upload className="h-4 w-4" /> {t.mpdCotizSubirReceta}
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setRecetaFile(f);
                    e.target.value = '';
                  }}
                />
              </div>
            </div>

            {error && (
              <p className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-bad">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
              </p>
            )}

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={enviando}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-brand-primary py-3 text-sm font-bold text-white transition hover:bg-brand-primary/90 disabled:opacity-60"
              >
                {enviando
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <><Send className="h-4 w-4" /> {t.mpdCotizEnviar}</>}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={enviando}
                className="rounded-2xl border-2 border-black/10 px-4 py-3 text-sm font-bold text-ink-muted transition hover:border-black/20 disabled:opacity-60"
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Modal QR para el collar ── */
function QRModal({ perroId, perroNombre, onClose }: { perroId: string; perroNombre: string; onClose: () => void }) {
  const { t } = useLanguage();
  const [qrDataUrl, setQrDataUrl] = useState('');
  const url = `https://www.mivecindog.com.ar/historia/${perroId}`;

  useEffect(() => {
    import('qrcode').then(({ default: QRCode }) => {
      QRCode.toDataURL(url, { width: 256, margin: 2, color: { dark: '#1A1A1A', light: '#FFFFFF' } })
        .then(setQrDataUrl);
    });
  }, [url]);

  function descargar() {
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qr-${perroNombre.toLowerCase().replace(/\s+/g, '-')}.png`;
    a.click();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-0 sm:items-center sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-sm rounded-t-[32px] bg-white px-7 pb-8 pt-7 shadow-2xl sm:rounded-[32px]">
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-black/10 sm:hidden" />
        <div className="mb-5 text-center">
          <h2 className="font-display text-xl font-black text-ink">{t.mpdQRTitle}</h2>
          <p className="mt-1 text-sm text-ink-muted">
            {t.mpdQRDesc.replace('{nombre}', perroNombre)}
          </p>
        </div>
        <div className="flex justify-center mb-5">
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrDataUrl} alt="QR code" className="w-48 h-48 rounded-2xl border-4 border-brand-cream" />
          ) : (
            <div className="w-48 h-48 rounded-2xl bg-brand-cream flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            </div>
          )}
        </div>
        <p className="mb-4 text-center text-[11px] text-ink-muted break-all">{url}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={descargar}
            disabled={!qrDataUrl}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-2xl bg-brand-primary py-3 text-sm font-bold text-white transition hover:bg-brand-primary/90 disabled:opacity-40"
          >
            <Download className="h-4 w-4" /> {t.mpdQRDescargar}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border-2 border-black/10 px-4 py-3 text-sm font-bold text-ink-muted transition hover:border-black/20"
          >
            {t.mpdCerrar}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Sección de medicamentos ── */
function MedicamentosSection({
  perroId, medicamentos, onAgregar, onEliminar, locked, perroNombre,
}: {
  perroId:      string;
  medicamentos: Medicamento[];
  onAgregar:    (med: Omit<Medicamento, 'id' | 'created_at'>) => Promise<void>;
  onEliminar:   (id: string) => Promise<void>;
  locked?:      boolean;
  perroNombre?: string;
}) {
  const [agregando,   setAgregando]   = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState('');
  const [showEnviar,  setShowEnviar]  = useState(false);
  const [form, setForm] = useState({
    nombre: '', dosis: '', frecuencia: '', fecha_inicio: new Date().toISOString().slice(0, 10),
    fecha_fin: '', notas: '',
  });

  const { t } = useLanguage();
  const activos    = medicamentos.filter((m) => m.activo);
  const anteriores = medicamentos.filter((m) => !m.activo);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim() || !form.fecha_inicio) { setError(t.mpdMedErrReq); return; }
    setSaving(true); setError('');
    try {
      await onAgregar({
        perro_id:     perroId,
        nombre:       form.nombre.trim(),
        dosis:        form.dosis.trim(),
        frecuencia:   form.frecuencia.trim(),
        fecha_inicio: form.fecha_inicio,
        fecha_fin:    form.fecha_fin || null,
        notas:        form.notas.trim(),
        activo:       true,
      });
      setForm({ nombre: '', dosis: '', frecuencia: '', fecha_inicio: new Date().toISOString().slice(0, 10), fecha_fin: '', notas: '' });
      setAgregando(false);
    } catch {
      setError(t.mpdErrGuardar);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card p-5 mb-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink">
          <Pill className="h-4 w-4 text-brand-primary" /> {t.mpdMedicamentosTitle}
          {activos.length > 0 && (
            <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 text-xs font-bold text-brand-primary">
              {t.mpdMedActivos.replace('{n}', String(activos.length))}
            </span>
          )}
        </h2>
        {locked ? (
          <Link href="/planes" className="inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20">
            <Sparkles className="h-3 w-3" /> VecindogPro
          </Link>
        ) : (
          <div className="flex gap-2">
            {activos.length > 0 && (
              <button type="button" onClick={() => setShowEnviar(true)}
                className="inline-flex items-center gap-1 rounded-xl bg-brand-primary px-3 py-1.5 text-xs font-bold text-white transition hover:bg-brand-primary/90">
                <Send className="h-3 w-3" /> {t.mpdEnviar}
              </button>
            )}
            <button type="button" onClick={() => setAgregando((v) => !v)}
              className="inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20">
              {agregando ? <X className="h-3 w-3" /> : <>+ {t.mpdAgregar}</>}
            </button>
          </div>
        )}
      </div>

      {showEnviar && (
        <EnviarTextoModal
          titulo={t.mpdEnviarMed}
          subtitulo={`${perroNombre ?? ''} · ${t.mpdMedActivos.replace('{n}', String(activos.length))}`}
          texto={[
            `💊 ${t.mpdEnviarMed} — ${perroNombre ?? ''} 🐾`,
            '',
            ...activos.map((m) => `• ${m.nombre}${m.dosis ? ` — ${m.dosis}` : ''}${m.frecuencia ? ` (${m.frecuencia})` : ''}\n  ${t.mpdMedDesde} ${formatFecha(m.fecha_inicio)}${m.fecha_fin ? ` ${t.mpdMedHasta} ${formatFecha(m.fecha_fin)}` : ''}${m.notas ? `\n  📝 ${m.notas}` : ''}`),
          ].join('\n')}
          onClose={() => setShowEnviar(false)}
        />
      )}

      {/* Formulario */}
      {agregando && (
        <form onSubmit={handleSave} className="mb-4 rounded-2xl border-2 border-brand-primary/20 bg-brand-primary/5 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="label text-xs">{t.mpdMedLabel} <span className="text-bad">*</span></label>
              <input className="field w-full text-sm" placeholder={t.mpdMedPlaceholder} value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))} required />
            </div>
            <div>
              <label className="label text-xs">{t.mpdMedDosis}</label>
              <input className="field w-full text-sm" placeholder={t.mpdMedDosisPlaceholder} value={form.dosis}
                onChange={(e) => setForm((f) => ({ ...f, dosis: e.target.value }))} />
            </div>
            <div>
              <label className="label text-xs">{t.mpdMedFrecuencia}</label>
              <input className="field w-full text-sm" placeholder={t.mpdMedFrecuenciaPlaceholder} value={form.frecuencia}
                onChange={(e) => setForm((f) => ({ ...f, frecuencia: e.target.value }))} />
            </div>
            <div>
              <label className="label text-xs">{t.mpdMedInicio} <span className="text-bad">*</span></label>
              <input type="date" className="field w-full text-sm" value={form.fecha_inicio}
                onChange={(e) => setForm((f) => ({ ...f, fecha_inicio: e.target.value }))} required />
            </div>
            <div>
              <label className="label text-xs">{t.mpdMedFin}</label>
              <input type="date" className="field w-full text-sm" value={form.fecha_fin}
                onChange={(e) => setForm((f) => ({ ...f, fecha_fin: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="label text-xs">{t.mpdNotasLabel}</label>
              <input className="field w-full text-sm" placeholder={t.mpdMedPlaceholder} value={form.notas}
                onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))} />
            </div>
          </div>
          {error && (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-bad">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
            </p>
          )}
          <div className="flex gap-2">
            <button type="submit" disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4" /> {t.mpdGuardar}</>}
            </button>
            <button type="button" onClick={() => { setAgregando(false); setError(''); }}
              className="rounded-xl border-2 border-black/10 px-4 py-2.5 text-sm font-bold text-ink-muted transition hover:border-bad/40 hover:text-bad">
              {t.mpdCancelar}
            </button>
          </div>
        </form>
      )}

      {/* Lista activos */}
      {activos.length === 0 && !agregando ? (
        <p className="text-sm text-ink-muted">{t.mpdSinMedActivos}</p>
      ) : activos.length > 0 ? (
        <div className="space-y-2">
          {activos.map((m) => (
            <div key={m.id} className="flex items-start gap-3 rounded-2xl bg-brand-cream px-4 py-3">
              <Pill className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary/60" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ink">{m.nombre}</p>
                {(m.dosis || m.frecuencia) && (
                  <p className="text-xs text-ink-muted">{[m.dosis, m.frecuencia].filter(Boolean).join(' · ')}</p>
                )}
                <p className="text-xs text-ink-muted">
                  {t.mpdMedDesde} {formatFecha(m.fecha_inicio)}{m.fecha_fin ? ` ${t.mpdMedHasta} ${formatFecha(m.fecha_fin)}` : ''}
                </p>
                {m.notas && <p className="text-[11px] text-ink-muted italic mt-0.5">{m.notas}</p>}
              </div>
              <button type="button" onClick={() => onEliminar(m.id)}
                className="shrink-0 rounded-lg p-1 text-ink-muted/40 transition hover:bg-bad/10 hover:text-bad">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {/* Anteriores */}
      {anteriores.length > 0 && (
        <div className="mt-3 border-t border-black/5 pt-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-ink-muted">{t.mpdMedAnteriores}</p>
          <div className="space-y-1.5">
            {anteriores.map((m) => (
              <div key={m.id} className="flex items-center gap-2 rounded-xl px-3 py-2 bg-black/3">
                <p className="flex-1 text-xs text-ink-muted line-through">{m.nombre}</p>
                <button type="button" onClick={() => onEliminar(m.id)}
                  className="shrink-0 text-ink-muted/30 hover:text-bad transition">
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Historia Clínica completa ── */
function HistoriaClinica({
  perro, vacunas, estudios, desparasitaciones, pesos, ciudad, edad,
}: {
  perro:              Perro;
  vacunas:            Vacuna[];
  estudios:           Estudio[];
  desparasitaciones:  Desparasitacion[];
  pesos:              Peso[];
  ciudad:             string | null;
  edad:               string | null;
}) {
  const { t } = useLanguage();
  const labs   = estudios.filter((e) => e.tipo === 'laboratorio');
  const radios = estudios.filter((e) => e.tipo === 'radiografia');
  const ecos   = estudios.filter((e) => e.tipo === 'ecografia');
  const [enviarOpen, setEnviarOpen] = useState(false);

  const url     = `https://www.mivecindog.com.ar/historia/${perro.id}`;
  const texto   = encodeURIComponent(`${t.mpdHistoriaTitle} — ${perro.nombre} 🐾\n${url}`);
  const waLink  = `https://wa.me/?text=${texto}`;

  function enviarEmail(email: string) {
    const subject = encodeURIComponent(`${t.mpdHistoriaTitle} — ${perro.nombre}`);
    const body    = encodeURIComponent(`${t.mpdHistoriaTitle} — ${perro.nombre}:\n${url}`);
    window.open(`mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`, '_blank');
  }

  return (
    <div id="historia-print" className="card p-5 mb-5 mt-2">
      {/* Título + botón enviar */}
      <div className="flex items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-primary/10 text-brand-primary">
            <FileText className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-base font-extrabold text-ink">{t.mpdHistoriaTitle}</h2>
            <p className="text-[11px] text-ink-muted">{perro.nombre} · {t.mpdHistoriaResumen}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black/10 px-3 py-2 text-xs font-bold text-ink-muted transition hover:border-brand-primary/40 hover:text-brand-primary shrink-0 no-print"
          >
            <Printer className="h-3.5 w-3.5" /> PDF
          </button>
          <button
            type="button"
            onClick={() => setEnviarOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary px-3 py-2 text-xs font-bold text-white transition hover:bg-brand-primary/90 shrink-0"
          >
            <Send className="h-3.5 w-3.5" /> {t.mpdEnviar}
          </button>
        </div>
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
        <HCSection titulo={t.mpdHCPerfil} lleno>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            {[
              [t.mpdRazaLabel,      perro.raza],
              [t.mpdColorLabel,     perro.color],
              [t.mpdSexoLabel,      perro.sexo],
              [t.mpdTamanoLabel,    perro.tamano],
              [t.mpdMicrochip,      perro.chip],
              [t.mpdEdadLabel,      edad],
              [t.mpdCiudadLabel,    ciudad],
              [t.mpdEsterilizadoLabel, perro.esterilizado ? '✓' : null],
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
        <HCSection titulo={t.mpdHCVacunas} lleno={vacunas.length > 0}>
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
        <HCSection titulo={t.mpdHCAnalisis} lleno={labs.length > 0}>
          {labs.length > 0 ? (
            <EstudiosList estudios={labs} />
          ) : null}
        </HCSection>

        {/* ── Radiografías ── */}
        <HCSection titulo={t.mpdHCRadios} lleno={radios.length > 0}>
          {radios.length > 0 ? (
            <EstudiosList estudios={radios} />
          ) : null}
        </HCSection>

        {/* ── Ecografías ── */}
        <HCSection titulo={t.mpdHCEcos} lleno={ecos.length > 0}>
          {ecos.length > 0 ? (
            <EstudiosList estudios={ecos} />
          ) : null}
        </HCSection>

        {/* ── Desparasitaciones ── */}
        <HCSection titulo={t.mpdHCDesparas} lleno={desparasitaciones.length > 0}>
          {desparasitaciones.length > 0 ? (
            <div className="space-y-1.5">
              {desparasitaciones.map((d) => (
                <div key={d.id} className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink">{d.producto}</span>
                  <span className="text-xs text-ink-muted">{formatFecha(d.fecha)}</span>
                </div>
              ))}
            </div>
          ) : null}
        </HCSection>

        {/* ── Peso ── */}
        <HCSection titulo={t.mpdHCPeso} lleno={pesos.length > 0}>
          {pesos.length > 0 ? (
            <div className="space-y-1.5">
              {pesos.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink">{p.valor_kg} kg</span>
                  <span className="text-xs text-ink-muted">{formatFecha(p.fecha)}</span>
                </div>
              ))}
              {pesos.length > 5 && (
                <p className="text-xs text-ink-muted">{t.mpdHCPesoMas.replace('{n}', String(pesos.length - 5))}</p>
              )}
            </div>
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
  const { t } = useLanguage();
  return (
    <div className={`rounded-2xl border ${lleno ? 'border-brand-primary/15 bg-brand-cream/40' : 'border-black/5 bg-black/2'} p-3`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">{titulo}</span>
        {!lleno && (
          <span className="flex items-center gap-0.5 text-[11px] font-bold text-ink-muted/40">
            <X className="h-3.5 w-3.5" /> {t.mpdSinDatos}
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
  const { t } = useLanguage();
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
            <h2 className="font-display text-xl font-black text-ink">{t.mpdEnviarHistoria}</h2>
            <p className="mt-0.5 text-xs text-ink-muted">{t.mpdEnviarHistoriaSub}</p>
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
            <Mail className="h-3.5 w-3.5 text-brand-primary" /> {t.mpdEnviarEmail}
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
              {t.mpdEnviar}
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
          <MessageCircle className="h-4 w-4" /> {t.mpdEnviarWA}
        </a>

        <button type="button" onClick={onClose}
          className="mt-3 w-full rounded-2xl border-2 border-black/10 py-2.5 text-sm font-bold text-ink-muted transition hover:border-black/20">
          {t.mpdCancelar}
        </button>
      </div>
    </div>
  );
}

/* ── Desparasitaciones ── */
function DesparasitacionesSection({
  perroId, desparasitaciones, agregando, editandoId,
  onAgregar, onActualizar, onEliminar, onSetAgregando, onSetEditandoId, locked, perroNombre,
}: {
  perroId:           string;
  desparasitaciones: Desparasitacion[];
  agregando:         boolean;
  editandoId:        string | null;
  onAgregar:         (input: DesparasitacionInput) => Promise<void>;
  onActualizar:      (id: string, input: DesparasitacionInput) => Promise<void>;
  onEliminar:        (id: string) => Promise<void>;
  onSetAgregando:    (v: boolean) => void;
  onSetEditandoId:   (id: string | null) => void;
  locked?:           boolean;
  perroNombre?:      string;
}) {
  const TIPO_LABEL: Record<string, string> = { interna: 'Interna', externa: 'Externa', ambas: 'Int + Ext' };
  const TIPO_COLOR: Record<string, string> = {
    interna: 'bg-[#7c3aed]/10 text-[#7c3aed]',
    externa: 'bg-good/10 text-good',
    ambas:   'bg-brand-primary/10 text-brand-primary',
  };
  const { t } = useLanguage();
  const [showEnviar, setShowEnviar] = useState(false);

  return (
    <div className="card p-5 mb-5">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink">
          <Bug className="h-4 w-4 text-brand-primary" /> {t.mpdDesparasTitle}
          {desparasitaciones.length > 0 && (
            <span className="rounded-full bg-good/15 px-2 py-0.5 text-xs font-bold text-good">
              {t.mpdDesparasRegistradas.replace('{n}', String(desparasitaciones.length))}
            </span>
          )}
        </h2>
        {locked ? (
          <Link href="/planes" className="ml-auto inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20">
            <Sparkles className="h-3 w-3" /> VecindogPro
          </Link>
        ) : (
          <div className="ml-auto flex gap-2">
            {desparasitaciones.length > 0 && (
              <button type="button" onClick={() => setShowEnviar(true)}
                className="inline-flex items-center gap-1 rounded-xl bg-brand-primary px-3 py-1.5 text-xs font-bold text-white transition hover:bg-brand-primary/90">
                <Send className="h-3 w-3" /> {t.mpdEnviar}
              </button>
            )}
          <button type="button" onClick={() => onSetAgregando(true)}
            className="inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20">
            + {t.mpdAgregar}
          </button>
          </div>
        )}
      </div>

      {showEnviar && (
        <EnviarTextoModal
          titulo={t.mpdEnviarDesparas}
          subtitulo={`${perroNombre ?? ''} · ${t.mpdDesparasRegistradas.replace('{n}', String(desparasitaciones.length))}`}
          texto={[
            `🐛 ${t.mpdEnviarDesparas} — ${perroNombre ?? ''} 🐾`,
            '',
            ...desparasitaciones.map((d) => `• ${d.producto} (${d.tipo}) — ${formatFecha(d.fecha)}${d.proxima ? ` | ${t.mpdDesparasProxima}: ${formatFecha(d.proxima)}` : ''}`),
          ].join('\n')}
          onClose={() => setShowEnviar(false)}
        />
      )}

      {agregando && (
        <DesparasitacionForm onSave={onAgregar} onCancel={() => onSetAgregando(false)} />
      )}

      {desparasitaciones.length === 0 && !agregando ? (
        <p className="text-sm text-ink-muted">{t.mpdSinDesparas}</p>
      ) : (
        <div className="space-y-3">
          {desparasitaciones.map((d) =>
            editandoId === d.id ? (
              <DesparasitacionForm
                key={d.id}
                inicial={d}
                onSave={(input) => onActualizar(d.id, input)}
                onCancel={() => onSetEditandoId(null)}
              />
            ) : (
              <div key={d.id} className="rounded-2xl bg-brand-cream p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-ink">{d.producto}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${TIPO_COLOR[d.tipo] ?? ''}`}>
                      {TIPO_LABEL[d.tipo] ?? d.tipo}
                    </span>
                    {d.proxima && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${new Date(d.proxima) < new Date() ? 'bg-bad/15 text-bad' : 'bg-good/15 text-good'}`}>
                        {new Date(d.proxima) < new Date() ? t.mpdVacunaVencida : t.mpdVacunaVigente}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button type="button" onClick={() => onSetEditandoId(d.id)}
                      className="rounded-lg p-1 text-ink-muted/50 transition hover:bg-black/5 hover:text-brand-primary">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => onEliminar(d.id)}
                      className="rounded-lg p-1 text-ink-muted/50 transition hover:bg-bad/10 hover:text-bad">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
                  <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {formatFecha(d.fecha)}</span>
                  {d.veterinario && <span>{d.veterinario}</span>}
                  {d.proxima && (
                    <span className={new Date(d.proxima) < new Date() ? 'font-bold text-bad' : ''}>
                      {t.mpdDesparasProxima}: {formatFecha(d.proxima)}
                    </span>
                  )}
                </div>
                {d.notas && <p className="mt-1 text-[11px] text-ink-muted/70 italic">{d.notas}</p>}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

function DesparasitacionForm({ inicial, onSave, onCancel }: {
  inicial?:  Desparasitacion;
  onSave:    (input: DesparasitacionInput) => Promise<void>;
  onCancel:  () => void;
}) {
  const [form, setForm] = useState<DesparasitacionInput>({
    producto:    inicial?.producto    ?? '',
    tipo:        inicial?.tipo        ?? 'ambas',
    fecha:       inicial?.fecha       ?? new Date().toISOString().slice(0, 10),
    proxima:     inicial?.proxima     ?? '',
    veterinario: inicial?.veterinario ?? '',
    notas:       inicial?.notas       ?? '',
  });
  const { t } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  function campo<K extends keyof DesparasitacionInput>(k: K, v: DesparasitacionInput[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.producto || !form.fecha) { setError(t.mpdDesparasErrReq); return; }
    setSaving(true); setError('');
    try { await onSave(form); }
    catch { setError(t.mpdErrGuardar); setSaving(false); }
  }

  const TIPOS: { v: DesparasitacionInput['tipo']; l: string }[] = [
    { v: 'interna', l: 'Interna' },
    { v: 'externa', l: 'Externa' },
    { v: 'ambas',   l: 'Int + Ext' },
  ];

  return (
    <form onSubmit={handleSave} className="rounded-2xl border-2 border-brand-primary/20 bg-brand-primary/5 p-4 space-y-3 mb-3">
      <div>
        <label className="label text-xs">{t.mpdDesparasProductoLabel} <span className="text-bad">*</span></label>
        <input list="productos-comunes" className="field w-full text-sm"
          placeholder={t.mpdDesparasProductoPlaceholder} value={form.producto}
          onChange={(e) => campo('producto', e.target.value)} required />
        <datalist id="productos-comunes">
          {PRODUCTOS_COMUNES.map((p) => <option key={p} value={p} />)}
        </datalist>
      </div>
      <div>
        <label className="label text-xs">{t.mpdDesparasTipoLabel}</label>
        <div className="flex gap-2">
          {TIPOS.map(({ v, l }) => (
            <button key={v} type="button" onClick={() => campo('tipo', v)}
              className={`flex-1 rounded-2xl border-2 py-2 text-xs font-bold transition ${form.tipo === v ? 'border-brand-primary bg-brand-primary/10 text-brand-primary' : 'border-black/10 text-ink-muted hover:border-brand-primary/40'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label text-xs">{t.mpdFechaReqLabel} <span className="text-bad">*</span></label>
          <input type="date" className="field w-full text-sm" value={form.fecha}
            onChange={(e) => campo('fecha', e.target.value)} required />
        </div>
        <div>
          <label className="label text-xs">{t.mpdDesparasProxima}</label>
          <input type="date" className="field w-full text-sm" value={form.proxima}
            onChange={(e) => campo('proxima', e.target.value)} />
        </div>
      </div>
      <div>
        <label className="label text-xs">{t.mpdVetFormLabel}</label>
        <input className="field w-full text-sm" placeholder="Dr. García…" value={form.veterinario}
          onChange={(e) => campo('veterinario', e.target.value)} />
      </div>
      <div>
        <label className="label text-xs">{t.mpdNotasLabel}</label>
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
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4" /> {inicial ? t.mpdGuardarCambios : t.mpdAgregar}</>}
        </button>
        <button type="button" onClick={onCancel} disabled={saving}
          className="rounded-xl border-2 border-black/10 px-4 py-2.5 text-sm font-bold text-ink-muted transition hover:border-bad/40 hover:text-bad disabled:opacity-60">
          {t.mpdCancelar}
        </button>
      </div>
    </form>
  );
}

/* ── Historial de peso ── */
function PesoSection({
  pesos, agregando, onAgregar, onEliminar, onSetAgregando, locked, perroNombre,
}: {
  pesos:          Peso[];
  agregando:      boolean;
  onAgregar:      (input: PesoInput) => Promise<void>;
  onEliminar:     (id: string) => Promise<void>;
  onSetAgregando: (v: boolean) => void;
  locked?:        boolean;
  perroNombre?:   string;
}) {
  const [form,        setForm]        = useState<{ fecha: string; valor_kg: string; notas: string }>({
    fecha: new Date().toISOString().slice(0, 10), valor_kg: '', notas: '',
  });
  const { t } = useLanguage();
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState('');
  const [showEnviar,  setShowEnviar]  = useState(false);
  const [emailDest,   setEmailDest]   = useState('');
  const [copied,      setCopied]      = useState(false);

  const ultimo = pesos[0] ?? null;
  const maxKg  = Math.max(...pesos.map((p) => p.valor_kg), 0.1);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const kg = parseFloat(form.valor_kg.replace(',', '.'));
    if (!form.fecha || isNaN(kg) || kg <= 0) { setError(t.mpdPesoErrReq); return; }
    setSaving(true); setError('');
    try {
      await onAgregar({ fecha: form.fecha, valor_kg: kg, notas: form.notas });
      setForm({ fecha: new Date().toISOString().slice(0, 10), valor_kg: '', notas: '' });
    } catch {
      setError(t.mpdErrGuardar);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card p-5 mb-5">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink">
          <Scale className="h-4 w-4 text-brand-primary" /> {t.mpdPesoTitle}
          {pesos.length > 0 && (
            <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 text-xs font-bold text-brand-primary">
              {t.mpdPesoRegistros.replace('{n}', String(pesos.length))}
            </span>
          )}
        </h2>
        {locked ? (
          <Link href="/planes" className="ml-auto inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20">
            <Sparkles className="h-3 w-3" /> VecindogPro
          </Link>
        ) : (
          <div className="ml-auto flex gap-2">
            {pesos.length > 0 && (
              <button type="button" onClick={() => setShowEnviar(true)}
                className="inline-flex items-center gap-1 rounded-xl bg-brand-primary px-3 py-1.5 text-xs font-bold text-white transition hover:bg-brand-primary/90">
                <Send className="h-3 w-3" /> {t.mpdEnviar}
              </button>
            )}
            <button type="button" onClick={() => onSetAgregando(!agregando)}
              className="inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20">
              {agregando ? <X className="h-3 w-3" /> : <>+ {t.mpdPesoRegistrar}</>}
            </button>
          </div>
        )}
      </div>

      {/* Último peso destacado */}
      {ultimo && !agregando && (
        <div className="mb-4 flex items-center gap-4 rounded-2xl bg-brand-cream p-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">{t.mpdPesoUltimo}</p>
            <p className="mt-0.5 font-display text-3xl font-black text-ink">
              {ultimo.valor_kg} <span className="text-base font-bold text-ink-muted">kg</span>
            </p>
            <p className="text-xs text-ink-muted">{formatFecha(ultimo.fecha)}</p>
          </div>
          {pesos.length >= 2 && (() => {
            const diff = ultimo.valor_kg - pesos[1].valor_kg;
            const color = diff > 0 ? 'text-bad' : diff < 0 ? 'text-good' : 'text-ink-muted';
            return (
              <div className={`ml-auto text-right ${color}`}>
                <p className="text-xs font-bold">{t.mpdPesoVsAnterior}</p>
                <p className="font-bold">{diff > 0 ? '+' : ''}{diff.toFixed(2)} kg</p>
              </div>
            );
          })()}
        </div>
      )}

      {/* Formulario agregar */}
      {agregando && (
        <form onSubmit={handleSave} className="mb-4 rounded-2xl border-2 border-brand-primary/20 bg-brand-primary/5 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label text-xs">{t.mpdFechaReqLabel} <span className="text-bad">*</span></label>
              <input type="date" className="field w-full text-sm" value={form.fecha}
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setForm((f) => ({ ...f, fecha: e.target.value }))} required />
            </div>
            <div>
              <label className="label text-xs">{t.mpdPesoKgLabel} <span className="text-bad">*</span></label>
              <input className="field w-full text-sm" placeholder="Ej: 12.5" value={form.valor_kg}
                inputMode="decimal"
                onChange={(e) => setForm((f) => ({ ...f, valor_kg: e.target.value }))} required />
            </div>
          </div>
          <div>
            <label className="label text-xs">{t.mpdNotasLabel}</label>
            <input className="field w-full text-sm" placeholder="Ej: control de rutina" value={form.notas}
              onChange={(e) => setForm((f) => ({ ...f, notas: e.target.value }))} />
          </div>
          {error && (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-bad">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
            </p>
          )}
          <div className="flex gap-2">
            <button type="submit" disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4" /> {t.mpdGuardar}</>}
            </button>
            <button type="button" onClick={() => { onSetAgregando(false); setError(''); }}
              className="rounded-xl border-2 border-black/10 px-4 py-2.5 text-sm font-bold text-ink-muted transition hover:border-bad/40 hover:text-bad">
              {t.mpdCancelar}
            </button>
          </div>
        </form>
      )}

      {/* Gráfico de peso — SVG mini line chart */}
      {pesos.length >= 2 && !agregando && (() => {
        const sorted = [...pesos].reverse(); // ascendente por fecha
        const vals   = sorted.map((p) => p.valor_kg);
        const minV   = Math.min(...vals);
        const maxV   = Math.max(...vals);
        const range  = maxV - minV || 1;
        const W = 100; const H = 40; const pad = 4;
        const pts = sorted.map((p, i) => {
          const x = pad + (i / (sorted.length - 1)) * (W - pad * 2);
          const y = H - pad - ((p.valor_kg - minV) / range) * (H - pad * 2);
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' ');
        return (
          <div className="mb-4 rounded-2xl bg-brand-cream p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="h-3.5 w-3.5 text-brand-primary" />
              <span className="text-xs font-bold text-ink-muted">{t.mpdPesoEvolucion}</span>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 48 }}>
              <polyline points={pts} fill="none" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {sorted.map((p, i) => {
                const x = pad + (i / (sorted.length - 1)) * (W - pad * 2);
                const y = H - pad - ((p.valor_kg - minV) / range) * (H - pad * 2);
                return <circle key={p.id} cx={x.toFixed(1)} cy={y.toFixed(1)} r="2.5" fill="var(--brand-primary)" />;
              })}
            </svg>
            <div className="mt-1 flex justify-between text-[10px] text-ink-muted">
              <span>{formatFecha(sorted[0].fecha)}</span>
              <span>{formatFecha(sorted[sorted.length - 1].fecha)}</span>
            </div>
          </div>
        );
      })()}

      {/* Historial visual */}
      {pesos.length === 0 && !agregando ? (
        <p className="text-sm text-ink-muted">{t.mpdSinPeso}</p>
      ) : pesos.length > 0 ? (
        <div className="space-y-2">
          {pesos.map((p) => (
            <div key={p.id} className="flex items-center gap-3">
              {/* Barra proporcional */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs text-ink-muted">{formatFecha(p.fecha)}</span>
                  <span className="text-sm font-bold text-ink">{p.valor_kg} kg</span>
                </div>
                <div className="h-2 rounded-full bg-black/8 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-primary/60 transition-all"
                    style={{ width: `${Math.round((p.valor_kg / maxKg) * 100)}%` }}
                  />
                </div>
                {p.notas && <p className="mt-0.5 text-[11px] text-ink-muted italic">{p.notas}</p>}
              </div>
              <button type="button" onClick={() => onEliminar(p.id)}
                className="shrink-0 rounded-lg p-1 text-ink-muted/40 transition hover:bg-bad/10 hover:text-bad">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {/* Modal enviar historial de peso */}
      {showEnviar && (() => {
        const texto = [
          `⚖️ ${t.mpdEnviarPeso} — ${perroNombre ?? ''} 🐾`,
          '',
          ...pesos.map((p) => `📅 ${formatFecha(p.fecha)} — ${p.valor_kg} kg${p.notas ? ` (${p.notas})` : ''}`),
        ].join('\n');

        function enviarEmail() {
          const s = encodeURIComponent(`${t.mpdEnviarPeso} — ${perroNombre ?? ''}`);
          const b = encodeURIComponent(texto);
          window.open(`mailto:${encodeURIComponent(emailDest.trim())}?subject=${s}&body=${b}`, '_blank');
        }
        function enviarWA() {
          window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
        }
        async function copiar() {
          await navigator.clipboard.writeText(texto);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }

        return (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-0 sm:items-center sm:p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowEnviar(false); }}>
            <div className="w-full max-w-sm rounded-t-[32px] bg-white px-7 pb-8 pt-7 shadow-2xl sm:rounded-[32px]">
              <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-black/10 sm:hidden" />
              <div className="mb-5">
                <h2 className="font-display text-xl font-black text-ink">{t.mpdEnviarPeso}</h2>
                <p className="mt-1 text-sm text-ink-muted">{perroNombre} · {t.mpdPesoRegistros.replace('{n}', String(pesos.length))}</p>
              </div>
              {/* Copiar */}
              <button type="button" onClick={copiar}
                className="mb-4 flex w-full items-center justify-between gap-2 rounded-2xl bg-brand-cream px-4 py-3 text-sm font-semibold text-ink transition hover:bg-brand-primary/10">
                <span className="truncate text-xs text-ink-muted">{texto.slice(0, 60)}…</span>
                {copied ? <Check className="h-4 w-4 shrink-0 text-good" /> : <Copy className="h-4 w-4 shrink-0 text-brand-primary" />}
              </button>
              {/* Email */}
              <div className="mb-3">
                <label className="label mb-1 flex items-center gap-1.5 text-xs">
                  <Mail className="h-3.5 w-3.5 text-brand-primary" /> {t.mpdEnviarEmail}
                </label>
                <div className="flex gap-2">
                  <input type="email" placeholder="destinatario@email.com" value={emailDest}
                    onChange={(e) => setEmailDest(e.target.value)}
                    className="field flex-1 text-sm" />
                  <button type="button" onClick={enviarEmail} disabled={!emailDest.trim()}
                    className="rounded-2xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-primary/90 disabled:opacity-40">
                    {t.mpdEnviar}
                  </button>
                </div>
              </div>
              <div className="my-4 flex items-center gap-3">
                <div className="flex-1 border-t border-black/10" />
                <span className="text-xs text-ink-muted">o</span>
                <div className="flex-1 border-t border-black/10" />
              </div>
              <button type="button" onClick={enviarWA}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3 text-sm font-bold text-white transition hover:bg-[#1ebe5d]">
                <MessageCircle className="h-4 w-4" /> {t.mpdEnviarWA}
              </button>
              <button type="button" onClick={() => setShowEnviar(false)}
                className="mt-3 w-full rounded-2xl border-2 border-black/10 py-2.5 text-sm font-bold text-ink-muted transition hover:border-black/20">
                {t.mpdCancelar}
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ── Visitas al veterinario ── */
function VisitasVetSection({ visitas, onAgregar, onEliminar, locked }: {
  visitas:    VisitaVet[];
  onAgregar:  (i: VisitaVetInput) => Promise<void>;
  onEliminar: (id: string) => Promise<void>;
  locked?:    boolean;
}) {
  const { t } = useLanguage();
  const [agregando, setAgregando] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const empty: VisitaVetInput = { fecha: new Date().toISOString().slice(0,10), motivo:'', diagnostico:'', tratamiento:'', vet_nombre:'', notas:'' };
  const [form, setForm] = useState<VisitaVetInput>(empty);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fecha || !form.motivo.trim()) { setError(t.mpdVisitaErrReq); return; }
    setSaving(true); setError('');
    try { await onAgregar(form); setForm(empty); setAgregando(false); }
    catch { setError(t.mpdErrGuardar); }
    finally { setSaving(false); }
  }

  return (
    <div className="card p-5 mb-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink">
          <ClipboardList className="h-4 w-4 text-brand-primary" /> {t.mpdVisitasTitle}
          {visitas.length > 0 && <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 text-xs font-bold text-brand-primary">{visitas.length}</span>}
        </h2>
        {locked ? <Link href="/planes" className="inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20"><Sparkles className="h-3 w-3" /> VecindogPro</Link>
          : <button type="button" onClick={() => setAgregando((v)=>!v)} className="inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary transition hover:bg-brand-primary/20">{agregando ? <X className="h-3 w-3"/> : <>+ {t.mpdRegistrar}</>}</button>}
      </div>
      {agregando && (
        <form onSubmit={handleSave} className="mb-4 rounded-2xl border-2 border-brand-primary/20 bg-brand-primary/5 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label text-xs">{t.mpdFechaReqLabel} *</label><input type="date" className="field w-full text-sm" value={form.fecha} onChange={(e)=>setForm(f=>({...f,fecha:e.target.value}))} required /></div>
            <div><label className="label text-xs">{t.mpdVetFormLabel}</label><input className="field w-full text-sm" placeholder="Dr. García" value={form.vet_nombre} onChange={(e)=>setForm(f=>({...f,vet_nombre:e.target.value}))} /></div>
          </div>
          <div><label className="label text-xs">{t.mpdVisitaMotivo} *</label><input className="field w-full text-sm" placeholder={t.mpdVisitaMotivoPlaceholder} value={form.motivo} onChange={(e)=>setForm(f=>({...f,motivo:e.target.value}))} required /></div>
          <div><label className="label text-xs">{t.mpdVisitaDiagnostico}</label><input className="field w-full text-sm" placeholder={t.mpdVisitaDiagPlaceholder} value={form.diagnostico} onChange={(e)=>setForm(f=>({...f,diagnostico:e.target.value}))} /></div>
          <div><label className="label text-xs">{t.mpdVisitaTratamiento}</label><input className="field w-full text-sm" placeholder={t.mpdVisitaTratPlaceholder} value={form.tratamiento} onChange={(e)=>setForm(f=>({...f,tratamiento:e.target.value}))} /></div>
          <div><label className="label text-xs">{t.mpdNotasLabel}</label><input className="field w-full text-sm" placeholder="Observaciones adicionales" value={form.notas} onChange={(e)=>setForm(f=>({...f,notas:e.target.value}))} /></div>
          {error && <p className="flex items-center gap-1.5 text-xs font-semibold text-bad"><AlertCircle className="h-3.5 w-3.5 shrink-0"/>{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary py-2.5 text-sm font-bold text-white disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin"/> : <><Check className="h-4 w-4"/> {t.mpdGuardar}</>}</button>
            <button type="button" onClick={()=>{setAgregando(false);setError('');}} className="rounded-xl border-2 border-black/10 px-4 py-2.5 text-sm font-bold text-ink-muted hover:border-bad/40 hover:text-bad">{t.mpdCancelar}</button>
          </div>
        </form>
      )}
      {visitas.length === 0 && !agregando ? <p className="text-sm text-ink-muted">{t.mpdSinVisitas}</p>
        : <div className="space-y-2">{visitas.map((v) => (
          <div key={v.id} className="rounded-2xl bg-brand-cream px-4 py-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-ink-muted">{formatFecha(v.fecha)}</span>
                  {v.vet_nombre && <span className="text-xs text-ink-muted">· {v.vet_nombre}</span>}
                </div>
                <p className="text-sm font-bold text-ink mt-0.5">{v.motivo}</p>
                {v.diagnostico && <p className="text-xs text-ink-muted mt-0.5">🔍 {v.diagnostico}</p>}
                {v.tratamiento && <p className="text-xs text-ink-muted">💊 {v.tratamiento}</p>}
                {v.notas       && <p className="text-[11px] text-ink-muted italic mt-0.5">{v.notas}</p>}
              </div>
              <button type="button" onClick={()=>onEliminar(v.id)} className="shrink-0 rounded-lg p-1 text-ink-muted/40 hover:bg-bad/10 hover:text-bad"><Trash2 className="h-3.5 w-3.5"/></button>
            </div>
          </div>
        ))}</div>}
    </div>
  );
}

/* ── Procedimientos / Cirugías ── */
function ProcedimientosSection({ procedimientos, onAgregar, onEliminar, locked }: {
  procedimientos: Procedimiento[];
  onAgregar:      (i: ProcedimientoInput) => Promise<void>;
  onEliminar:     (id: string) => Promise<void>;
  locked?:        boolean;
}) {
  const { t } = useLanguage();
  const [agregando, setAgregando] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const empty: ProcedimientoInput = { fecha: new Date().toISOString().slice(0,10), tipo: TIPOS_PROCEDIMIENTO[0], descripcion:'', vet_nombre:'', notas:'' };
  const [form, setForm] = useState<ProcedimientoInput>(empty);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fecha || !form.descripcion.trim()) { setError(t.mpdProcErrReq); return; }
    setSaving(true); setError('');
    try { await onAgregar(form); setForm(empty); setAgregando(false); }
    catch { setError(t.mpdErrGuardar); }
    finally { setSaving(false); }
  }

  return (
    <div className="card p-5 mb-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink">
          <StethoscopeIcon className="h-4 w-4 text-brand-primary" /> {t.mpdProcedimientosTitle}
          {procedimientos.length > 0 && <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 text-xs font-bold text-brand-primary">{procedimientos.length}</span>}
        </h2>
        {locked ? <Link href="/planes" className="inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary hover:bg-brand-primary/20"><Sparkles className="h-3 w-3"/> VecindogPro</Link>
          : <button type="button" onClick={()=>setAgregando((v)=>!v)} className="inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary hover:bg-brand-primary/20">{agregando ? <X className="h-3 w-3"/> : <>+ {t.mpdRegistrar}</>}</button>}
      </div>
      {agregando && (
        <form onSubmit={handleSave} className="mb-4 rounded-2xl border-2 border-brand-primary/20 bg-brand-primary/5 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label text-xs">{t.mpdFechaReqLabel} *</label><input type="date" className="field w-full text-sm" value={form.fecha} onChange={(e)=>setForm(f=>({...f,fecha:e.target.value}))} required /></div>
            <div><label className="label text-xs">{t.mpdDesparasTipoLabel}</label>
              <select className="field w-full text-sm" value={form.tipo} onChange={(e)=>setForm(f=>({...f,tipo:e.target.value}))}>
                {TIPOS_PROCEDIMIENTO.map((tp)=><option key={tp}>{tp}</option>)}
              </select>
            </div>
          </div>
          <div><label className="label text-xs">{t.mpdProcDescLabel} *</label><input className="field w-full text-sm" placeholder={t.mpdProcDescPlaceholder} value={form.descripcion} onChange={(e)=>setForm(f=>({...f,descripcion:e.target.value}))} required /></div>
          <div><label className="label text-xs">{t.mpdProcVetLabel}</label><input className="field w-full text-sm" placeholder="Dr. García" value={form.vet_nombre} onChange={(e)=>setForm(f=>({...f,vet_nombre:e.target.value}))} /></div>
          <div><label className="label text-xs">{t.mpdNotasLabel}</label><input className="field w-full text-sm" placeholder="Observaciones" value={form.notas} onChange={(e)=>setForm(f=>({...f,notas:e.target.value}))} /></div>
          {error && <p className="flex items-center gap-1.5 text-xs font-semibold text-bad"><AlertCircle className="h-3.5 w-3.5 shrink-0"/>{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary py-2.5 text-sm font-bold text-white disabled:opacity-60">{saving?<Loader2 className="h-4 w-4 animate-spin"/>:<><Check className="h-4 w-4"/>{t.mpdGuardar}</>}</button>
            <button type="button" onClick={()=>{setAgregando(false);setError('');}} className="rounded-xl border-2 border-black/10 px-4 py-2.5 text-sm font-bold text-ink-muted hover:border-bad/40 hover:text-bad">{t.mpdCancelar}</button>
          </div>
        </form>
      )}
      {procedimientos.length === 0 && !agregando ? <p className="text-sm text-ink-muted">{t.mpdSinProcedimientos}</p>
        : <div className="space-y-2">{procedimientos.map((p) => (
          <div key={p.id} className="flex items-start gap-3 rounded-2xl bg-brand-cream px-4 py-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 text-[10px] font-bold text-brand-primary">{p.tipo}</span>
                <span className="text-xs text-ink-muted">{formatFecha(p.fecha)}</span>
                {p.vet_nombre && <span className="text-xs text-ink-muted">· {p.vet_nombre}</span>}
              </div>
              <p className="text-sm font-semibold text-ink mt-0.5">{p.descripcion}</p>
              {p.notas && <p className="text-[11px] text-ink-muted italic mt-0.5">{p.notas}</p>}
            </div>
            <button type="button" onClick={()=>onEliminar(p.id)} className="shrink-0 rounded-lg p-1 text-ink-muted/40 hover:bg-bad/10 hover:text-bad"><Trash2 className="h-3.5 w-3.5"/></button>
          </div>
        ))}</div>}
    </div>
  );
}

/* ── Dieta y alimentación ── */
function DietaSection({ perro, onGuardar, locked }: {
  perro:     Perro;
  onGuardar: (d: { dieta_marca: string; dieta_cantidad: string; dieta_frecuencia: string; dieta_notas: string }) => Promise<void>;
  locked?:   boolean;
}) {
  const { t } = useLanguage();
  const [editando, setEditando] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ dieta_marca: perro.dieta_marca??'', dieta_cantidad: perro.dieta_cantidad??'', dieta_frecuencia: perro.dieta_frecuencia??'', dieta_notas: perro.dieta_notas??'' });

  const tieneDieta = perro.dieta_marca || perro.dieta_cantidad || perro.dieta_frecuencia || perro.dieta_notas;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try { await onGuardar(form); setEditando(false); }
    catch { /* silent */ }
    finally { setSaving(false); }
  }

  return (
    <div className="card p-5 mb-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink">
          <UtensilsCrossed className="h-4 w-4 text-brand-primary" /> {t.mpdDietaTitle}
        </h2>
        {locked ? <Link href="/planes" className="inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary hover:bg-brand-primary/20"><Sparkles className="h-3 w-3"/> VecindogPro</Link>
          : <button type="button" onClick={()=>setEditando((v)=>!v)} className="inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary hover:bg-brand-primary/20">{editando?<X className="h-3 w-3"/>:<><Pencil className="h-3 w-3"/> {t.mpdEditar}</>}</button>}
      </div>
      {editando ? (
        <form onSubmit={handleSave} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label text-xs">{t.mpdDietaAlimentoLabel}</label><input className="field w-full text-sm" placeholder={t.mpdDietaMarcaPlaceholder} value={form.dieta_marca} onChange={(e)=>setForm(f=>({...f,dieta_marca:e.target.value}))} /></div>
            <div><label className="label text-xs">{t.mpdDietaCantidad}</label><input className="field w-full text-sm" placeholder={t.mpdDietaCantidadPlaceholder} value={form.dieta_cantidad} onChange={(e)=>setForm(f=>({...f,dieta_cantidad:e.target.value}))} /></div>
            <div><label className="label text-xs">{t.mpdDietaFrecuencia}</label><input className="field w-full text-sm" placeholder={t.mpdDietaFrecuenciaPlaceholder} value={form.dieta_frecuencia} onChange={(e)=>setForm(f=>({...f,dieta_frecuencia:e.target.value}))} /></div>
            <div><label className="label text-xs">{t.mpdDietaNotasLabel}</label><input className="field w-full text-sm" placeholder={t.mpdDietaNotasPlaceholder} value={form.dieta_notas} onChange={(e)=>setForm(f=>({...f,dieta_notas:e.target.value}))} /></div>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary py-2.5 text-sm font-bold text-white disabled:opacity-60">{saving?<Loader2 className="h-4 w-4 animate-spin"/>:<><Check className="h-4 w-4"/> {t.mpdGuardar}</>}</button>
            <button type="button" onClick={()=>setEditando(false)} className="rounded-xl border-2 border-black/10 px-4 py-2.5 text-sm font-bold text-ink-muted">{t.mpdCancelar}</button>
          </div>
        </form>
      ) : tieneDieta ? (
        <div className="grid grid-cols-2 gap-3">
          {perro.dieta_marca      && <div className="rounded-2xl bg-brand-cream p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">{t.mpdDietaAlimentoLabel}</p><p className="text-sm font-semibold text-ink mt-0.5">{perro.dieta_marca}</p></div>}
          {perro.dieta_cantidad   && <div className="rounded-2xl bg-brand-cream p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">{t.mpdDietaCantidad}</p><p className="text-sm font-semibold text-ink mt-0.5">{perro.dieta_cantidad}</p></div>}
          {perro.dieta_frecuencia && <div className="rounded-2xl bg-brand-cream p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">{t.mpdDietaFrecuencia}</p><p className="text-sm font-semibold text-ink mt-0.5">{perro.dieta_frecuencia}</p></div>}
          {perro.dieta_notas      && <div className="rounded-2xl bg-brand-cream p-3 col-span-2"><p className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">{t.mpdDietaRestriccionesLabel}</p><p className="text-sm font-semibold text-ink mt-0.5">{perro.dieta_notas}</p></div>}
        </div>
      ) : <p className="text-sm text-ink-muted">{t.mpdSinDieta}</p>}
    </div>
  );
}

/* ── Grooming / Baño ── */
function GroomingSection({ perroId, grooming, onGuardar, locked }: {
  perroId:   string;
  grooming:  Grooming | null;
  onGuardar: (d: Omit<Grooming,'id'|'created_at'>) => Promise<void>;
  locked?:   boolean;
}) {
  const { t } = useLanguage();
  const [editando, setEditando] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ultima_fecha: new Date().toISOString().slice(0,10), frecuencia_dias: 30, tipo: 'ambos' as TipoGrooming, notas:'' });

  useEffect(() => {
    // Solo sincronizar si el usuario NO está editando (evita sobreescribir cambios en progreso)
    if (grooming && !editando) setForm({ ultima_fecha: grooming.ultima_fecha, frecuencia_dias: grooming.frecuencia_dias, tipo: grooming.tipo, notas: grooming.notas??'' });
  }, [grooming]);

  const proximaFecha = grooming ? (() => {
    const d = new Date(grooming.ultima_fecha);
    d.setDate(d.getDate() + grooming.frecuencia_dias);
    return d.toISOString().slice(0,10);
  })() : null;
  const diasRestantes = proximaFecha ? Math.ceil((new Date(proximaFecha).getTime() - Date.now()) / 86400000) : null;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try { await onGuardar({ perro_id: perroId, ...form }); setEditando(false); }
    catch { /* silent */ }
    finally { setSaving(false); }
  }

  const TIPOS: TipoGrooming[] = ['baño','peluquería','ambos'];

  return (
    <div className="card p-5 mb-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink">
          <Scissors className="h-4 w-4 text-brand-primary" /> {t.mpdGroomingTitle}
        </h2>
        {locked ? <Link href="/planes" className="inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary hover:bg-brand-primary/20"><Sparkles className="h-3 w-3"/> VecindogPro</Link>
          : <button type="button" onClick={()=>setEditando((v)=>!v)} className="inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary hover:bg-brand-primary/20">{editando?<X className="h-3 w-3"/>:<><Pencil className="h-3 w-3"/> {grooming?t.mpdEditar:t.mpdGroomingConfigurar}</>}</button>}
      </div>
      {editando ? (
        <form onSubmit={handleSave} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label text-xs">{t.mpdGroomingUltimoLabel}</label><input type="date" className="field w-full text-sm" value={form.ultima_fecha} onChange={(e)=>setForm(f=>({...f,ultima_fecha:e.target.value}))} /></div>
            <div><label className="label text-xs">{t.mpdGroomingCadaCuantos}</label><input type="number" min={1} max={365} className="field w-full text-sm" value={form.frecuencia_dias} onChange={(e)=>setForm(f=>({...f,frecuencia_dias:+e.target.value}))} /></div>
          </div>
          <div>
            <label className="label text-xs">{t.mpdDesparasTipoLabel}</label>
            <div className="flex gap-2 mt-1">{TIPOS.map((tp)=>(
              <button key={tp} type="button" onClick={()=>setForm(f=>({...f,tipo:tp}))}
                className={`flex-1 rounded-xl py-2 text-xs font-bold capitalize transition ${form.tipo===tp?'bg-brand-primary text-white':'bg-brand-cream text-ink-muted hover:bg-brand-primary/10'}`}>
                {tp}
              </button>
            ))}</div>
          </div>
          <div><label className="label text-xs">{t.mpdNotasLabel}</label><input className="field w-full text-sm" placeholder="Peluquería Canina Mia, corte de pelo..." value={form.notas} onChange={(e)=>setForm(f=>({...f,notas:e.target.value}))} /></div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary py-2.5 text-sm font-bold text-white disabled:opacity-60">{saving?<Loader2 className="h-4 w-4 animate-spin"/>:<><Check className="h-4 w-4"/> {t.mpdGuardar}</>}</button>
            <button type="button" onClick={()=>setEditando(false)} className="rounded-xl border-2 border-black/10 px-4 py-2.5 text-sm font-bold text-ink-muted">{t.mpdCancelar}</button>
          </div>
        </form>
      ) : grooming ? (
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1 rounded-2xl bg-brand-cream p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">{t.mpdGroomingUltimo}</p>
              <p className="text-sm font-semibold text-ink mt-0.5">{formatFecha(grooming.ultima_fecha)}</p>
            </div>
            <div className={`flex-1 rounded-2xl p-3 ${diasRestantes !== null && diasRestantes <= 0 ? 'bg-bad/10' : diasRestantes !== null && diasRestantes <= 5 ? 'bg-amber-50' : 'bg-brand-cream'}`}>
              <p className="text-[10px] font-bold uppercase tracking-wide text-ink-muted">{t.mpdGroomingProximoLabel}</p>
              <p className={`text-sm font-semibold mt-0.5 ${diasRestantes !== null && diasRestantes <= 0 ? 'text-bad' : 'text-ink'}`}>
                {proximaFecha ? formatFecha(proximaFecha) : '—'}
                {diasRestantes !== null && <span className="ml-1 text-xs">({diasRestantes <= 0 ? t.mpdVacunaVencida : `en ${diasRestantes}d`})</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <Scissors className="h-3.5 w-3.5 shrink-0 text-brand-primary/60" />
            <span className="capitalize">{grooming.tipo}</span> · {t.mpdGroomingCadaCuantos.toLowerCase()} {grooming.frecuencia_dias}
            {grooming.notas && <span>· {grooming.notas}</span>}
          </div>
        </div>
      ) : <p className="text-sm text-ink-muted">{t.mpdSinGrooming}</p>}
    </div>
  );
}

/* ── Galería de fotos ── */
function GaleriaSection({ fotos, onAgregar, onEliminar, locked }: {
  fotos:      FotoPerro[];
  onAgregar:  (f: File) => Promise<void>;
  onEliminar: (id: string) => Promise<void>;
  locked?:    boolean;
}) {
  const { t } = useLanguage();
  const fileRef = useRef<HTMLInputElement>(null);
  const [subiendo, setSubiendo] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setSubiendo(true);
    try { await onAgregar(f); }
    catch { /* silent */ }
    finally { setSubiendo(false); e.target.value=''; }
  }

  return (
    <div className="card p-5 mb-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink">
          <Camera className="h-4 w-4 text-brand-primary" /> {t.mpdGaleriaTitle}
          {fotos.length > 0 && <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 text-xs font-bold text-brand-primary">{fotos.length}</span>}
        </h2>
        {locked ? <Link href="/planes" className="inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary hover:bg-brand-primary/20"><Sparkles className="h-3 w-3"/> VecindogPro</Link>
          : <button type="button" onClick={()=>fileRef.current?.click()} disabled={subiendo} className="inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary hover:bg-brand-primary/20 disabled:opacity-60">{subiendo?<Loader2 className="h-3 w-3 animate-spin"/>:<><ImageIcon className="h-3 w-3"/> {t.mpdAgregarFoto}</>}</button>}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {fotos.length === 0 ? <p className="text-sm text-ink-muted">{t.mpdSinFotos}</p>
        : <div className="grid grid-cols-3 gap-2">{fotos.map((f) => (
          <div key={f.id} className="relative group aspect-square">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={f.url} alt="" className="w-full h-full object-cover rounded-2xl" />
            <button type="button" onClick={()=>onEliminar(f.id)}
              className="absolute top-1 right-1 hidden group-hover:flex h-6 w-6 items-center justify-center rounded-full bg-bad text-white shadow">
              <X className="h-3 w-3" />
            </button>
            <a href={f.url} target="_blank" rel="noopener noreferrer"
              className="absolute bottom-1 right-1 hidden group-hover:flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white">
              <Download className="h-3 w-3" />
            </a>
          </div>
        ))}</div>}
    </div>
  );
}

/* ── Contactos de emergencia ── */
function ContactosSection({ contactos, onAgregar, onEliminar }: {
  contactos:  ContactoEmergencia[];
  onAgregar:  (i: ContactoInput) => Promise<void>;
  onEliminar: (id: string) => Promise<void>;
}) {
  const { t } = useLanguage();
  const [agregando, setAgregando] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const empty: ContactoInput = { nombre:'', relacion:'', telefono:'', notas:'' };
  const [form, setForm] = useState<ContactoInput>(empty);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim() || !form.telefono.trim()) { setError(t.mpdContactoErrReq); return; }
    setSaving(true); setError('');
    try { await onAgregar(form); setForm(empty); setAgregando(false); }
    catch { setError(t.mpdErrGuardar); }
    finally { setSaving(false); }
  }

  return (
    <div className="card p-5 mb-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-ink">
          <PhoneCall className="h-4 w-4 text-brand-primary" /> {t.mpdContactosTitle}
          {contactos.length > 0 && <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 text-xs font-bold text-brand-primary">{contactos.length}</span>}
        </h2>
        <button type="button" onClick={()=>setAgregando((v)=>!v)} className="inline-flex items-center gap-1 rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold text-brand-primary hover:bg-brand-primary/20">{agregando?<X className="h-3 w-3"/>:<>+ {t.mpdAgregar}</>}</button>
      </div>
      {agregando && (
        <form onSubmit={handleSave} className="mb-4 rounded-2xl border-2 border-brand-primary/20 bg-brand-primary/5 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label text-xs">{t.mpdNombreLabel} *</label><input className="field w-full text-sm" placeholder="María García" value={form.nombre} onChange={(e)=>setForm(f=>({...f,nombre:e.target.value}))} required /></div>
            <div><label className="label text-xs">{t.mpdContactoRelacion}</label><input className="field w-full text-sm" placeholder={t.mpdContactoRelacionPlaceholder} value={form.relacion} onChange={(e)=>setForm(f=>({...f,relacion:e.target.value}))} /></div>
          </div>
          <div><label className="label text-xs">{t.mpdVetTelefonoLabel} *</label><input type="tel" className="field w-full text-sm" placeholder="+54 9 11 1234-5678" value={form.telefono} onChange={(e)=>setForm(f=>({...f,telefono:e.target.value}))} required /></div>
          <div><label className="label text-xs">{t.mpdNotasLabel}</label><input className="field w-full text-sm" placeholder={t.mpdContactoNotasPlaceholder} value={form.notas} onChange={(e)=>setForm(f=>({...f,notas:e.target.value}))} /></div>
          {error && <p className="flex items-center gap-1.5 text-xs font-semibold text-bad"><AlertCircle className="h-3.5 w-3.5 shrink-0"/>{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={saving} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand-primary py-2.5 text-sm font-bold text-white disabled:opacity-60">{saving?<Loader2 className="h-4 w-4 animate-spin"/>:<><Check className="h-4 w-4"/> {t.mpdGuardar}</>}</button>
            <button type="button" onClick={()=>{setAgregando(false);setError('');}} className="rounded-xl border-2 border-black/10 px-4 py-2.5 text-sm font-bold text-ink-muted hover:border-bad/40 hover:text-bad">{t.mpdCancelar}</button>
          </div>
        </form>
      )}
      {contactos.length === 0 && !agregando ? <p className="text-sm text-ink-muted">{t.mpdSinContactos}</p>
        : <div className="space-y-2">{contactos.map((c) => (
          <div key={c.id} className="flex items-center gap-3 rounded-2xl bg-brand-cream px-4 py-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10">
              <UserRound className="h-4 w-4 text-brand-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-ink">{c.nombre}{c.relacion && <span className="ml-1 text-xs text-ink-muted">· {c.relacion}</span>}</p>
              <p className="text-xs text-ink-muted">{c.telefono}</p>
              {c.notas && <p className="text-[11px] text-ink-muted italic">{c.notas}</p>}
            </div>
            <a href={`tel:${c.telefono.replace(/[^\d+]/g,'')}`}
              className="shrink-0 flex h-8 w-8 items-center justify-center rounded-xl bg-good/10 text-good hover:bg-good/20 transition">
              <PhoneCall className="h-3.5 w-3.5" />
            </a>
            <button type="button" onClick={()=>onEliminar(c.id)} className="shrink-0 rounded-lg p-1 text-ink-muted/40 hover:bg-bad/10 hover:text-bad"><Trash2 className="h-3.5 w-3.5"/></button>
          </div>
        ))}</div>}
    </div>
  );
}

function calcularEdad(fechaNac: string, t: { mpdCachorro: string; mpdMes: string; mpdMeses: string; mpdAnio: string; mpdAnios: string }): string {
  const hoy   = new Date();
  const nac   = new Date(fechaNac);
  const meses = (hoy.getFullYear() - nac.getFullYear()) * 12 + (hoy.getMonth() - nac.getMonth());
  if (meses < 1)  return t.mpdCachorro;
  if (meses < 12) return `${meses} ${meses === 1 ? t.mpdMes : t.mpdMeses}`;
  const a = Math.floor(meses / 12);
  return `${a} ${a === 1 ? t.mpdAnio : t.mpdAnios}`;
}

function formatFecha(iso: string): string {
  if (!iso) return '—';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}

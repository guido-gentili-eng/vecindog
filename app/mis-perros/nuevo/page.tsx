'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Dog, ImagePlus, X, Plus, Trash2, Syringe, Loader2,
  AlertCircle, ChevronLeft, CheckCircle2, Lock, Sparkles, Stethoscope,
} from 'lucide-react';
import { listarMisPerros } from '@/lib/perros';
import { useAuth } from '@/contexts/AuthContext';
import {
  crearPerro, subirFotoPerro, VACUNAS_COMUNES, VACUNA_VACIA,
  type PerroInput, type VacunaInput,
} from '@/lib/perros';
import { COLORES_PERRO } from '@/lib/mockData';
import RazaAutocomplete from '@/components/RazaAutocomplete';

/* ─── Tipos internos ─── */
interface FotoPreview { file: File; preview: string; }

const FORM_INICIAL: PerroInput = {
  nombre: '', raza: '', color: '', tamano: '', sexo: '',
  fecha_nac: '', chip: '', esterilizado: false, descripcion: '',
  alergias: '', vet_nombre: '', vet_telefono: '', direccion: '', foto_url: '',
  estado_salud: '', dieta_marca: '', dieta_cantidad: '', dieta_frecuencia: '', dieta_notas: '',
};

/* ─── Constantes ─── */
const MAX_FOTOS = 5;
const ACCEPT    = 'image/jpeg,image/png,image/webp';

export default function NuevoPerroPage() {
  const router = useRouter();
  const { isAuthenticated, isPro } = useAuth();

  const [form,       setForm]       = useState<PerroInput>(FORM_INICIAL);
  const [fotos,      setFotos]      = useState<FotoPreview[]>([]);
  const [vacunas,    setVacunas]    = useState<VacunaInput[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [errorFoto,  setErrorFoto]  = useState('');
  const [bloqueado,  setBloqueado]  = useState(false);

  useEffect(() => {
    if (!isAuthenticated || isPro) return;
    listarMisPerros().then((lista) => {
      if (lista.length >= 1) setBloqueado(true);
    }).catch(() => {});
  }, [isAuthenticated, isPro]);
  const fileRef   = useRef<HTMLInputElement>(null);
  const previewsRef = useRef<string[]>([]);

  /* ─── Helpers form ─── */
  function campo<K extends keyof PerroInput>(k: K, v: PerroInput[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  /* ─── Fotos ─── */
  function onFotos(e: React.ChangeEvent<HTMLInputElement>) {
    setErrorFoto('');
    const files = Array.from(e.target.files ?? []);
    const nuevas: FotoPreview[] = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) { setErrorFoto('Solo se permiten imágenes.'); continue; }
      if (file.size > 5 * 1024 * 1024) { setErrorFoto('Cada foto debe pesar menos de 5 MB.'); continue; }
      if (fotos.length + nuevas.length >= MAX_FOTOS) { setErrorFoto(`Máximo ${MAX_FOTOS} fotos.`); break; }
      const url = URL.createObjectURL(file);
      previewsRef.current.push(url);
      nuevas.push({ file, preview: url });
    }
    setFotos((prev) => [...prev, ...nuevas]);
    if (fileRef.current) fileRef.current.value = '';
  }

  function quitarFoto(i: number) {
    setFotos((prev) => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, idx) => idx !== i);
    });
  }

  /* ─── Vacunas ─── */
  function agregarVacuna() { setVacunas((v) => [...v, { ...VACUNA_VACIA }]); }
  function quitarVacuna(i: number) { setVacunas((v) => v.filter((_, idx) => idx !== i)); }
  function campoVacuna<K extends keyof VacunaInput>(i: number, k: K, v: VacunaInput[K]) {
    setVacunas((prev) => prev.map((vac, idx) => idx === i ? { ...vac, [k]: v } : vac));
  }

  /* ─── Submit ─── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim()) { setError('El nombre es obligatorio.'); return; }

    // Re-verificar límite de perros al momento del submit (evita race condition)
    if (!isPro) {
      const lista = await listarMisPerros().catch(() => [] as Awaited<ReturnType<typeof listarMisPerros>>);
      if (lista.length >= 1) { setBloqueado(true); return; }
    }

    setError('');
    setLoading(true);

    try {
      // 1. Subir fotos
      let fotoUrl = '';
      for (let i = 0; i < fotos.length; i++) {
        const url = await subirFotoPerro(fotos[i].file);
        if (i === 0) fotoUrl = url; // primera foto = principal
      }

      // 2. Crear perro + vacunas
      const id = await crearPerro({ ...form, foto_url: fotoUrl }, vacunas);

      router.push(`/mis-perros/${id}?nuevo=1`);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message
        : typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message: unknown }).message)
          : String(err);
      const esMigracion = msg.toLowerCase().includes('column') || msg.toLowerCase().includes('schema');
      setError(
        esMigracion
          ? '⚠️ Error de base de datos: falta ejecutar la migración SQL en Supabase. El perro NO fue guardado.'
          : msg || 'Ocurrió un error. Intentá de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="py-12 text-center">
        <p className="text-ink-muted">Iniciá sesión para registrar tu perro.</p>
      </div>
    );
  }

  if (bloqueado) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-[28px] bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary/10">
            <Lock className="h-8 w-8 text-brand-primary" />
          </div>
          <h2 className="mt-5 font-display text-xl font-black text-ink">Límite del plan Gratis</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Con el plan Gratis podés registrar <strong>1 perro</strong>. Pasate a VecindogPro para perros ilimitados.
          </p>
          <div className="mt-6 space-y-2">
            <Link href="/planes"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary py-3 text-sm font-bold text-white transition hover:opacity-90">
              <Sparkles className="h-4 w-4" /> Ver plan Pro
            </Link>
            <Link href="/mis-perros"
              className="flex w-full items-center justify-center rounded-2xl border-2 border-black/10 py-3 text-sm font-bold text-ink-muted transition hover:border-black/20">
              Volver a Mis perros
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-8 md:py-10">
      {/* Header */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-muted transition hover:text-ink"
        >
          <ChevronLeft className="h-4 w-4" /> Volver
        </button>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary">
          <Dog className="h-3.5 w-3.5" /> Nuevo perro
        </span>
        <h1 className="mt-2 font-display text-3xl font-black tracking-tight text-ink">
          Registrá a tu perro
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Guardá todos sus datos. Si algún día se pierde, ya tenés todo listo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Sección 1: Datos básicos ── */}
        <Section titulo="Datos básicos">
          {/* Nombre */}
          <div>
            <label className="label">Nombre <span className="text-bad">*</span></label>
            <input
              className="field w-full"
              placeholder="Ej: Fido, Luna, Thor…"
              value={form.nombre}
              onChange={(e) => campo('nombre', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Raza */}
            <div>
              <label className="label">Raza</label>
              <RazaAutocomplete value={form.raza} onChange={(v) => campo('raza', v)} />
            </div>
            {/* Color */}
            <div>
              <label className="label">Color principal</label>
              <select
                className="field w-full"
                value={form.color}
                onChange={(e) => campo('color', e.target.value)}
              >
                <option value="">Seleccioná un color</option>
                {COLORES_PERRO.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Sexo */}
            <div>
              <label className="label">Sexo</label>
              <div className="flex gap-2">
                {(['macho', 'hembra'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => campo('sexo', form.sexo === s ? '' : s)}
                    className={`flex-1 rounded-2xl border-2 py-2.5 text-sm font-bold capitalize transition ${
                      form.sexo === s
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                        : 'border-black/10 text-ink-muted hover:border-brand-primary/40'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Tamaño */}
            <div>
              <label className="label">Tamaño</label>
              <div className="flex gap-1">
                {([['pequeño','S'], ['mediano','M'], ['grande','L']] as const).map(([t, l]) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => campo('tamano', form.tamano === t ? '' : t)}
                    className={`flex-1 rounded-2xl border-2 py-2.5 text-sm font-bold transition ${
                      form.tamano === t
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                        : 'border-black/10 text-ink-muted hover:border-brand-primary/40'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Fecha nacimiento */}
            <div>
              <label className="label">Fecha de nacimiento</label>
              <input
                type="date"
                className="field w-full"
                max={new Date().toISOString().slice(0, 10)}
                value={form.fecha_nac}
                onChange={(e) => campo('fecha_nac', e.target.value)}
              />
            </div>
            {/* Chip */}
            <div>
              <label className="label">N° de microchip</label>
              <input
                className="field w-full font-mono"
                placeholder="15 dígitos"
                value={form.chip}
                onChange={(e) => campo('chip', e.target.value)}
              />
            </div>
          </div>

          {/* Esterilizado */}
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-black/10 p-4 transition hover:border-brand-primary/40">
            <input
              type="checkbox"
              className="h-4 w-4 accent-brand-primary"
              checked={form.esterilizado}
              onChange={(e) => campo('esterilizado', e.target.checked)}
            />
            <span className="text-sm font-semibold text-ink">
              Está esterilizado/a (castrado o ligado)
            </span>
          </label>

          {/* Descripción */}
          <div>
            <label className="label">Descripción / características</label>
            <textarea
              className="field w-full resize-none"
              rows={3}
              placeholder="Marcas especiales, manchas, cicatrices, collar habitual, comportamiento…"
              value={form.descripcion}
              onChange={(e) => campo('descripcion', e.target.value)}
            />
          </div>

          {/* Alergias */}
          <div>
            <label className="label">Alergias / condiciones especiales</label>
            <textarea
              className="field w-full resize-none"
              rows={2}
              placeholder="Alérgico a X antibiótico, condición crónica, dieta especial…"
              value={form.alergias}
              onChange={(e) => campo('alergias', e.target.value)}
            />
            <p className="mt-1 text-xs text-ink-muted">Se mostrará en la identificación del perro.</p>
          </div>

          {/* Dirección */}
          <div>
            <label className="label">Dirección de tu casa</label>
            <input
              className="field w-full"
              placeholder="Ej: Av. Alem 1200, Villa Mitre"
              value={form.direccion}
              onChange={(e) => campo('direccion', e.target.value)}
            />
            <p className="mt-1 text-xs text-ink-muted">
              Si algún día lo perdés, se usará para completar el aviso automáticamente.
            </p>
          </div>
        </Section>

        {/* ── Sección 2: Fotos ── */}
        <Section titulo="Fotos" descripcion={`Subí hasta ${MAX_FOTOS} fotos. La primera será la principal.`}>
          {fotos.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {fotos.map((f, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-2xl bg-brand-cream">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.preview} alt="" className="h-full w-full object-cover" />
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                      Principal
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => quitarFoto(i)}
                    className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-bad/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {fotos.length < MAX_FOTOS && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-black/10 text-ink-muted transition hover:border-brand-primary hover:text-brand-primary"
                >
                  <Plus className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {fotos.length === 0 && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-black/10 py-8 text-ink-muted transition hover:border-brand-primary hover:text-brand-primary"
            >
              <ImagePlus className="h-8 w-8" />
              <span className="text-sm font-bold">Subir fotos</span>
              <span className="text-xs">JPG, PNG o WebP · Máx. 5 MB c/u</span>
            </button>
          )}

          {errorFoto && (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-bad">
              <AlertCircle className="h-3.5 w-3.5" /> {errorFoto}
            </p>
          )}

          <input
            ref={fileRef}
            type="file"
            accept={ACCEPT}
            multiple
            className="hidden"
            onChange={onFotos}
          />
        </Section>

        {/* ── Sección 3: Veterinario ── */}
        <Section titulo="Veterinario habitual">
          <p className="text-xs text-ink-muted -mt-2">Opcional. Útil si el perro se pierde y alguien lo encuentra.</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Nombre / clínica</label>
              <input
                className="field w-full"
                placeholder="Dr. García / Clínica Mascotas"
                value={form.vet_nombre}
                onChange={(e) => campo('vet_nombre', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Teléfono</label>
              <input
                className="field w-full"
                placeholder="+54 11 XXXX-XXXX"
                value={form.vet_telefono}
                onChange={(e) => campo('vet_telefono', e.target.value)}
              />
            </div>
          </div>
        </Section>

        {/* ── Sección 4: Vacunas ── */}
        <Section
          titulo="Carnet de vacunas"
          descripcion="Agregá todas las vacunas que tenga registradas."
        >
          {vacunas.length === 0 ? (
            <p className="text-sm text-ink-muted">
              Todavía no agregaste vacunas.
            </p>
          ) : (
            <div className="space-y-4">
              {vacunas.map((v, i) => (
                <VacunaRow
                  key={i}
                  vacuna={v}
                  index={i}
                  onChange={campoVacuna}
                  onQuitar={quitarVacuna}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={agregarVacuna}
            className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-black/10 px-4 py-3 text-sm font-bold text-ink-muted transition hover:border-brand-primary hover:text-brand-primary"
          >
            <Plus className="h-4 w-4" />
            Agregar vacuna
          </button>
        </Section>

        {/* Error general */}
        {error && (
          <div className="flex items-start gap-2 rounded-2xl bg-bad/10 p-4 text-sm font-semibold text-bad">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full gap-2 disabled:opacity-60"
        >
          {loading ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> Guardando…</>
          ) : (
            <><CheckCircle2 className="h-5 w-5" /> Guardar perfil de {form.nombre || 'mi perro'}</>
          )}
        </button>
      </form>
    </div>
  );
}

/* ── Sub-componentes ── */

function Section({
  titulo, descripcion, children,
}: {
  titulo: string; descripcion?: string; children: React.ReactNode;
}) {
  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        {titulo === 'Carnet de vacunas'   && <Syringe      className="h-4 w-4 text-brand-primary" />}
        {titulo === 'Fotos'             && <ImagePlus    className="h-4 w-4 text-brand-primary" />}
        {titulo === 'Datos básicos'     && <Dog          className="h-4 w-4 text-brand-primary" />}
        {titulo === 'Veterinario habitual' && <Stethoscope className="h-4 w-4 text-brand-primary" />}
        <h2 className="font-display text-base font-extrabold text-ink">{titulo}</h2>
      </div>
      {descripcion && (
        <p className="mb-4 text-xs text-ink-muted">{descripcion}</p>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function VacunaRow({
  vacuna, index, onChange, onQuitar,
}: {
  vacuna: VacunaInput;
  index: number;
  onChange: <K extends keyof VacunaInput>(i: number, k: K, v: VacunaInput[K]) => void;
  onQuitar: (i: number) => void;
}) {
  return (
    <div className="rounded-2xl bg-brand-cream p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold text-ink-muted">Vacuna #{index + 1}</span>
        <button
          type="button"
          onClick={() => onQuitar(index)}
          className="rounded-lg p-1 text-ink-muted/50 transition hover:bg-bad/10 hover:text-bad"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Nombre con sugerencias */}
        <div>
          <label className="label">Nombre <span className="text-bad">*</span></label>
          <input
            list={`vac-list-${index}`}
            className="field w-full"
            placeholder="Séxtuple, Antirrábica…"
            value={vacuna.nombre}
            onChange={(e) => onChange(index, 'nombre', e.target.value)}
          />
          <datalist id={`vac-list-${index}`}>
            {VACUNAS_COMUNES.map((v) => <option key={v} value={v} />)}
          </datalist>
        </div>

        {/* Fecha */}
        <div>
          <label className="label">Fecha <span className="text-bad">*</span></label>
          <input
            type="date"
            className="field w-full"
            max={new Date().toISOString().slice(0, 10)}
            value={vacuna.fecha}
            onChange={(e) => onChange(index, 'fecha', e.target.value)}
          />
        </div>

        {/* Veterinario */}
        <div>
          <label className="label">Veterinario/a</label>
          <input
            className="field w-full"
            placeholder="Nombre o clínica"
            value={vacuna.veterinario}
            onChange={(e) => onChange(index, 'veterinario', e.target.value)}
          />
        </div>

        {/* Próxima dosis */}
        <div>
          <label className="label">Próxima dosis</label>
          <input
            type="date"
            className="field w-full"
            min={new Date().toISOString().slice(0, 10)}
            value={vacuna.proxima}
            onChange={(e) => onChange(index, 'proxima', e.target.value)}
          />
        </div>

        {/* Notas */}
        <div className="sm:col-span-2">
          <label className="label">Notas</label>
          <input
            className="field w-full"
            placeholder="Lote, observaciones del veterinario…"
            value={vacuna.notas}
            onChange={(e) => onChange(index, 'notas', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

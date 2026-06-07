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
import { useLanguage } from '@/contexts/LanguageContext';
import {
  crearPerro, subirFotoPerro, VACUNAS_COMUNES, VACUNA_VACIA,
  type PerroInput, type VacunaInput,
} from '@/lib/perros';
import { COLORES_PERRO } from '@/lib/mockData';
import RazaAutocomplete from '@/components/RazaAutocomplete';

interface FotoPreview { file: File; preview: string; }

const FORM_INICIAL: PerroInput = {
  nombre: '', raza: '', color: '', tamano: '', sexo: '',
  fecha_nac: '', chip: '', esterilizado: false, descripcion: '',
  alergias: '', vet_nombre: '', vet_telefono: '', direccion: '', foto_url: '',
  estado_salud: '', dieta_marca: '', dieta_cantidad: '', dieta_frecuencia: '', dieta_notas: '',
};

const MAX_FOTOS = 5;
const ACCEPT    = 'image/jpeg,image/png,image/webp';

export default function NuevoPerroPage() {
  const router = useRouter();
  const { isAuthenticated, isPro } = useAuth();
  const { t } = useLanguage();

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
  const fileRef     = useRef<HTMLInputElement>(null);
  const previewsRef = useRef<string[]>([]);

  function campo<K extends keyof PerroInput>(k: K, v: PerroInput[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function onFotos(e: React.ChangeEvent<HTMLInputElement>) {
    setErrorFoto('');
    const files = Array.from(e.target.files ?? []);
    const nuevas: FotoPreview[] = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) { setErrorFoto(t.mpnFotoErrImagen); continue; }
      if (file.size > 5 * 1024 * 1024) { setErrorFoto(t.mpnFotoErrTamano); continue; }
      if (fotos.length + nuevas.length >= MAX_FOTOS) { setErrorFoto(t.mpnFotoErrMax.replace('{max}', String(MAX_FOTOS))); break; }
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

  function agregarVacuna() { setVacunas((v) => [...v, { ...VACUNA_VACIA }]); }
  function quitarVacuna(i: number) { setVacunas((v) => v.filter((_, idx) => idx !== i)); }
  function campoVacuna<K extends keyof VacunaInput>(i: number, k: K, v: VacunaInput[K]) {
    setVacunas((prev) => prev.map((vac, idx) => idx === i ? { ...vac, [k]: v } : vac));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nombre.trim()) { setError(t.mpnErrNombre); return; }

    if (!isPro) {
      const lista = await listarMisPerros().catch(() => [] as Awaited<ReturnType<typeof listarMisPerros>>);
      if (lista.length >= 1) { setBloqueado(true); return; }
    }

    setError('');
    setLoading(true);

    try {
      let fotoUrl = '';
      for (let i = 0; i < fotos.length; i++) {
        const url = await subirFotoPerro(fotos[i].file);
        if (i === 0) fotoUrl = url;
      }

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
        <p className="text-ink-muted">{t.mpnLoginSub}</p>
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
          <h2 className="mt-5 font-display text-xl font-black text-ink">{t.mpnLimiteTitle}</h2>
          <p className="mt-2 text-sm text-ink-muted">{t.mpnLimiteSub}</p>
          <div className="mt-6 space-y-2">
            <Link href="/planes"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary py-3 text-sm font-bold text-white transition hover:opacity-90">
              <Sparkles className="h-4 w-4" /> {t.mpnVerPro}
            </Link>
            <Link href="/mis-perros"
              className="flex w-full items-center justify-center rounded-2xl border-2 border-black/10 py-3 text-sm font-bold text-ink-muted transition hover:border-black/20">
              {t.mpnVolverLista}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-8 md:py-10">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-ink-muted transition hover:text-ink"
        >
          <ChevronLeft className="h-4 w-4" /> {t.mpnVolver}
        </button>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary">
          <Dog className="h-3.5 w-3.5" /> {t.mpnNuevoChip}
        </span>
        <h1 className="mt-2 font-display text-3xl font-black tracking-tight text-ink">
          {t.mpnTitle}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">{t.mpnSub}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        <Section titulo={t.mpnSecDatos} icono="datos">
          <div>
            <label className="label">{t.mpnNombre} <span className="text-bad">*</span></label>
            <input
              className="field w-full"
              placeholder="Ej: Fido, Luna, Thor…"
              value={form.nombre}
              onChange={(e) => campo('nombre', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">{t.mpnRaza}</label>
              <RazaAutocomplete value={form.raza} onChange={(v) => campo('raza', v)} />
            </div>
            <div>
              <label className="label">{t.mpnColor}</label>
              <select
                className="field w-full"
                value={form.color}
                onChange={(e) => campo('color', e.target.value)}
              >
                <option value="">{t.mpnColorPh}</option>
                {COLORES_PERRO.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">{t.mpnSexo}</label>
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
                    {s === 'macho' ? t.mpnSexoMacho : t.mpnSexoHembra}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">{t.mpnTamano}</label>
              <div className="flex gap-1">
                {([['pequeño','S'], ['mediano','M'], ['grande','L']] as const).map(([tam, lbl]) => (
                  <button
                    key={tam}
                    type="button"
                    onClick={() => campo('tamano', form.tamano === tam ? '' : tam)}
                    className={`flex-1 rounded-2xl border-2 py-2.5 text-sm font-bold transition ${
                      form.tamano === tam
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                        : 'border-black/10 text-ink-muted hover:border-brand-primary/40'
                    }`}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">{t.mpnFechaNac}</label>
              <input
                type="date"
                className="field w-full"
                max={new Date().toISOString().slice(0, 10)}
                value={form.fecha_nac}
                onChange={(e) => campo('fecha_nac', e.target.value)}
              />
            </div>
            <div>
              <label className="label">{t.mpnChip}</label>
              <input
                className="field w-full font-mono"
                placeholder="15 dígitos"
                value={form.chip}
                onChange={(e) => campo('chip', e.target.value)}
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-black/10 p-4 transition hover:border-brand-primary/40">
            <input
              type="checkbox"
              className="h-4 w-4 accent-brand-primary"
              checked={form.esterilizado}
              onChange={(e) => campo('esterilizado', e.target.checked)}
            />
            <span className="text-sm font-semibold text-ink">{t.mpnEsterilizado}</span>
          </label>

          <div>
            <label className="label">{t.mpnDescripcion}</label>
            <textarea
              className="field w-full resize-none"
              rows={3}
              placeholder={t.mpnDescripcionPh}
              value={form.descripcion}
              onChange={(e) => campo('descripcion', e.target.value)}
            />
          </div>

          <div>
            <label className="label">{t.mpnAlergias}</label>
            <textarea
              className="field w-full resize-none"
              rows={2}
              placeholder={t.mpnAlergiasPh}
              value={form.alergias}
              onChange={(e) => campo('alergias', e.target.value)}
            />
            <p className="mt-1 text-xs text-ink-muted">{t.mpnAlergiasInfo}</p>
          </div>

          <div>
            <label className="label">{t.mpnDireccion}</label>
            <input
              className="field w-full"
              placeholder={t.mpnDireccionPh}
              value={form.direccion}
              onChange={(e) => campo('direccion', e.target.value)}
            />
            <p className="mt-1 text-xs text-ink-muted">{t.mpnDireccionInfo}</p>
          </div>
        </Section>

        <Section titulo={t.mpnSecFotos} icono="fotos" descripcion={t.mpnSecFotosSub.replace('{max}', String(MAX_FOTOS))}>
          {fotos.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {fotos.map((f, i) => (
                <div key={f.preview} className="relative aspect-square overflow-hidden rounded-2xl bg-brand-cream">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.preview} alt="" className="h-full w-full object-cover" />
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                      {t.mpnFotoPrincipal}
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
              <span className="text-sm font-bold">{t.mpnFotoSubir}</span>
              <span className="text-xs">{t.mpnFotoFormato}</span>
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

        <Section titulo={t.mpnSecVet} icono="vet">
          <p className="text-xs text-ink-muted -mt-2">{t.mpnSecVetOpcional}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">{t.mpnVetNombre}</label>
              <input
                className="field w-full"
                placeholder={t.mpnVetNombrePh}
                value={form.vet_nombre}
                onChange={(e) => campo('vet_nombre', e.target.value)}
              />
            </div>
            <div>
              <label className="label">{t.mpnVetTel}</label>
              <input
                className="field w-full"
                placeholder="+54 11 XXXX-XXXX"
                value={form.vet_telefono}
                onChange={(e) => campo('vet_telefono', e.target.value)}
              />
            </div>
          </div>
        </Section>

        <Section titulo={t.mpnSecVacunas} icono="vacunas" descripcion={t.mpnSecVacunasSub}>
          {vacunas.length === 0 ? (
            <p className="text-sm text-ink-muted">{t.mpnVacunaSinVacunas}</p>
          ) : (
            <div className="space-y-4">
              {vacunas.map((v, i) => (
                <VacunaRow
                  key={i}
                  vacuna={v}
                  index={i}
                  onChange={campoVacuna}
                  onQuitar={quitarVacuna}
                  labelNum={t.mpnVacunaNum.replace('{n}', String(i + 1))}
                  labelNombre={t.mpnVacunaNombre}
                  labelFecha={t.mpnVacunaFecha}
                  labelVet={t.mpnVacunaVet}
                  labelProxima={t.mpnVacunaProxima}
                  labelNotas={t.mpnVacunaNotas}
                  labelNombrePh={t.mpnVacunaNombrePh}
                  labelVetPh={t.mpnVacunaVetPh}
                  labelNotasPh={t.mpnVacunaNotasPh}
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
            {t.mpnVacunaAgregar}
          </button>
        </Section>

        {error && (
          <div className="flex items-start gap-2 rounded-2xl bg-bad/10 p-4 text-sm font-semibold text-bad">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full gap-2 disabled:opacity-60"
        >
          {loading ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> {t.mpnGuardando}</>
          ) : (
            <><CheckCircle2 className="h-5 w-5" /> {t.mpnGuardar.replace('{nombre}', form.nombre || 'mi perro')}</>
          )}
        </button>
      </form>
    </div>
  );
}

function Section({
  titulo, icono, descripcion, children,
}: {
  titulo: string; icono: 'datos' | 'fotos' | 'vet' | 'vacunas'; descripcion?: string; children: React.ReactNode;
}) {
  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        {icono === 'vacunas' && <Syringe      className="h-4 w-4 text-brand-primary" />}
        {icono === 'fotos'   && <ImagePlus    className="h-4 w-4 text-brand-primary" />}
        {icono === 'datos'   && <Dog          className="h-4 w-4 text-brand-primary" />}
        {icono === 'vet'     && <Stethoscope  className="h-4 w-4 text-brand-primary" />}
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
  labelNum, labelNombre, labelFecha, labelVet, labelProxima, labelNotas,
  labelNombrePh, labelVetPh, labelNotasPh,
}: {
  vacuna: VacunaInput;
  index: number;
  onChange: <K extends keyof VacunaInput>(i: number, k: K, v: VacunaInput[K]) => void;
  onQuitar: (i: number) => void;
  labelNum: string;
  labelNombre: string;
  labelFecha: string;
  labelVet: string;
  labelProxima: string;
  labelNotas: string;
  labelNombrePh: string;
  labelVetPh: string;
  labelNotasPh: string;
}) {
  return (
    <div className="rounded-2xl bg-brand-cream p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold text-ink-muted">{labelNum}</span>
        <button
          type="button"
          onClick={() => onQuitar(index)}
          className="rounded-lg p-1 text-ink-muted/50 transition hover:bg-bad/10 hover:text-bad"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label">{labelNombre} <span className="text-bad">*</span></label>
          <input
            list={`vac-list-${index}`}
            className="field w-full"
            placeholder={labelNombrePh}
            value={vacuna.nombre}
            onChange={(e) => onChange(index, 'nombre', e.target.value)}
          />
          <datalist id={`vac-list-${index}`}>
            {VACUNAS_COMUNES.map((v) => <option key={v} value={v} />)}
          </datalist>
        </div>

        <div>
          <label className="label">{labelFecha} <span className="text-bad">*</span></label>
          <input
            type="date"
            className="field w-full"
            max={new Date().toISOString().slice(0, 10)}
            value={vacuna.fecha}
            onChange={(e) => onChange(index, 'fecha', e.target.value)}
          />
        </div>

        <div>
          <label className="label">{labelVet}</label>
          <input
            className="field w-full"
            placeholder={labelVetPh}
            value={vacuna.veterinario}
            onChange={(e) => onChange(index, 'veterinario', e.target.value)}
          />
        </div>

        <div>
          <label className="label">{labelProxima}</label>
          <input
            type="date"
            className="field w-full"
            min={new Date().toISOString().slice(0, 10)}
            value={vacuna.proxima}
            onChange={(e) => onChange(index, 'proxima', e.target.value)}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="label">{labelNotas}</label>
          <input
            className="field w-full"
            placeholder={labelNotasPh}
            value={vacuna.notas}
            onChange={(e) => onChange(index, 'notas', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

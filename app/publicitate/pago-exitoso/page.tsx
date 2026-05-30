'use client';

import { useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2, ArrowRight, ImagePlus, Loader2, AlertCircle, Send,
} from 'lucide-react';
import { crearAd, subirImagenAd } from '@/lib/ads';

const PLAN_LABEL: Record<string, string> = {
  basico:   'Plan Básico',
  estandar: 'Plan Estándar',
  premium:  'Plan Premium',
};

/* Variante principal según plan */
const PLAN_VARIANT: Record<string, 'leaderboard' | 'card' | 'sidebar'> = {
  basico:   'sidebar',
  estandar: 'card',
  premium:  'leaderboard',
};

export default function PagoExitosoPage() {
  const params  = useSearchParams();
  const plan    = params.get('plan') ?? 'estandar';
  const pending = params.get('pending') === '1';

  const [step, setStep] = useState<'form' | 'done'>(pending ? 'done' : 'form');

  if (step === 'done' || pending) {
    return <Confirmacion plan={plan} pending={pending} />;
  }

  return <FormularioAnuncio plan={plan} onDone={() => setStep('done')} />;
}

/* ── Formulario de datos del anuncio ── */
function FormularioAnuncio({ plan, onDone }: { plan: string; onDone: () => void }) {
  const [titulo,    setTitulo]    = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [href,      setHref]      = useState('');
  const [cta,       setCta]       = useState('');
  const [ciudad,    setCiudad]    = useState('');
  const [fotoFile,  setFotoFile]  = useState<File | null>(null);
  const [preview,   setPreview]   = useState('');
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function onFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('La imagen debe pesar menos de 5 MB.'); return; }
    setFotoFile(file);
    setPreview(URL.createObjectURL(file));
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) { setError('Ingresá el nombre de tu negocio.'); return; }
    if (!href.trim())   { setError('Ingresá el link de tu negocio.'); return; }
    setError(''); setLoading(true);
    try {
      let imagen_url = '';
      if (fotoFile) imagen_url = await subirImagenAd(fotoFile);

      await crearAd({
        variant:     PLAN_VARIANT[plan] ?? 'sidebar',
        titulo,
        subtitulo:   subtitulo || null,
        imagen_url:  imagen_url || null,
        href,
        cta:         cta || null,
        anunciante:  ciudad || null,
        plan:        plan as 'basico' | 'estandar' | 'premium',
        activo:      false,
        fecha_inicio: null,
        fecha_fin:    null,
      });
      onDone();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar. Intentá de nuevo.');
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg py-10">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-good/15 text-good">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-black text-ink">¡Pago confirmado!</h1>
          <p className="text-sm text-ink-muted">{PLAN_LABEL[plan] ?? plan} · Cargá los datos de tu anuncio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Logo */}
        <div className="card overflow-hidden p-0">
          <div
            className="relative flex aspect-[3/1] w-full cursor-pointer items-center justify-center overflow-hidden bg-brand-cream"
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="h-full w-full object-contain p-6" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-brand-primary/40">
                <ImagePlus className="h-10 w-10" />
                <span className="text-sm font-bold">Subir logo del negocio</span>
                <span className="text-xs">PNG, JPG · máx 5 MB · fondo blanco recomendado</span>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onFoto} />
          {preview && (
            <button type="button" onClick={() => fileRef.current?.click()}
              className="w-full py-2 text-center text-xs font-bold text-brand-primary hover:underline">
              Cambiar imagen
            </button>
          )}
        </div>

        {/* Datos */}
        <div className="card space-y-4 p-5">
          <div>
            <label className="label">Nombre de tu negocio <span className="text-bad">*</span></label>
            <input className="field w-full" placeholder="Veterinaria Central"
              value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
          </div>

          <div>
            <label className="label">Descripción corta (tagline)</label>
            <input className="field w-full" placeholder="Consultas, vacunas y cirugías en Bahía Blanca"
              value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} />
          </div>

          <div>
            <label className="label">Ciudad / zona</label>
            <input className="field w-full" placeholder="Bahía Blanca"
              value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
          </div>

          <div>
            <label className="label">Link de tu negocio <span className="text-bad">*</span></label>
            <input className="field w-full" placeholder="https://instagram.com/tunegocio o https://www.tunegocio.com"
              value={href} onChange={(e) => setHref(e.target.value)} required />
            <p className="mt-1 text-xs text-ink-muted">Web, Instagram, WhatsApp — adonde querés que vayan los clicks</p>
          </div>

          <div>
            <label className="label">Texto del botón</label>
            <input className="field w-full" placeholder="Ver local · Pedir turno · Ver Instagram"
              value={cta} onChange={(e) => setCta(e.target.value)} />
          </div>
        </div>

        {error && (
          <p className="flex items-center gap-2 rounded-2xl bg-bad/10 p-3 text-sm font-bold text-bad">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </p>
        )}

        <div className="rounded-2xl bg-brand-cream p-3 text-xs text-ink-muted">
          Tu anuncio quedará en revisión y lo activamos en menos de 24 hs. Te avisamos por WhatsApp o email.
        </div>

        <button type="submit" disabled={loading}
          className="btn-primary w-full justify-center disabled:opacity-60">
          {loading
            ? <Loader2 className="h-5 w-5 animate-spin" />
            : <><Send className="h-5 w-5" /> Enviar datos del anuncio</>}
        </button>
      </form>
    </div>
  );
}

/* ── Pantalla de confirmación final ── */
function Confirmacion({ plan, pending }: { plan: string; pending: boolean }) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="card p-8 md:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-good/15 text-good">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-black text-ink md:text-3xl">
          {pending ? '¡Pago en proceso!' : '¡Todo listo!'}
        </h1>
        <p className="mt-2 text-ink-muted">
          {pending
            ? 'Tu pago está siendo procesado. Cuando se confirme te contactamos para activar el anuncio.'
            : 'Recibimos los datos de tu anuncio. Lo revisamos y activamos en menos de 24 hs.'}
        </p>
        <div className="mt-5 rounded-2xl bg-brand-cream p-4 text-left text-sm text-ink-muted">
          <p className="font-bold text-ink">¿Necesitás hacer un cambio?</p>
          <p className="mt-1">Escribinos a <strong>hola@mivecindog.com.ar</strong> o por WhatsApp al <strong>+54 9 291 405-0210</strong></p>
        </div>
        <Link href="/" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-brand-primary hover:underline">
          Volver al inicio <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

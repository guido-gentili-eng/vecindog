'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dog, Loader2, AlertCircle, Check, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { listarMisPerros, type Perro } from '@/lib/perros';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BuscoCuidadorPage() {
  const router  = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [perros,      setPerros]      = useState<Perro[]>([]);
  const [perroSel,    setPerroSel]    = useState<Perro | null>(null);
  const [cargandoPerros, setCargandoPerros] = useState(true);

  const [descripcion, setDescripcion] = useState('');
  const [zona,        setZona]        = useState('');
  const [contacto,    setContacto]    = useState('');
  const [fechaDesde,  setFechaDesde]  = useState('');
  const [fechaHasta,  setFechaHasta]  = useState('');

  const [enviando,  setEnviando]  = useState(false);
  const [error,     setError]     = useState('');
  const [publicado, setPublicado] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    listarMisPerros()
      .then((lista) => {
        setPerros(lista);
        if (lista.length === 1) setPerroSel(lista[0]);
      })
      .finally(() => setCargandoPerros(false));
  }, [isAuthenticated]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { setError(t.cubcErrLogin); return; }
    if (!zona.trim()) { setError(t.cubcErrZona); return; }
    if (!contacto.trim()) { setError(t.cubcErrContacto); return; }
    if (contacto.replace(/\D/g, '').length < 10) { setError(t.cubcErrContactoShort); return; }

    setEnviando(true);
    setError('');

    const fechaTexto = (fechaDesde && fechaHasta)
      ? `Fechas: del ${fechaDesde} al ${fechaHasta}.`
      : fechaDesde ? `Desde el ${fechaDesde}.` : '';

    const descFinal = [descripcion.trim(), fechaTexto].filter(Boolean).join(' ') || 'Busco cuidador para mi perro.';

    const { error: dbErr } = await supabase.from('posts').insert({
      user_id:     user.id,
      perro_id:    perroSel?.id ?? null,
      categoria:   'busco_cuidador',
      especie:     'perro',
      nombre:      perroSel?.nombre || null,
      raza:        perroSel?.raza   || null,
      color:       perroSel?.color  || null,
      tamano:      perroSel?.tamano || null,
      descripcion: descFinal,
      zona:        zona.trim(),
      fecha:       fechaHasta || new Date().toISOString().slice(0, 10),
      horario:     null,
      contacto:    contacto.trim(),
      images:      perroSel?.foto_url ? [perroSel.foto_url] : [],
      estado:      'activo',
      collar:      null,
      chapita:     null,
      lat:         null,
      lng:         null,
    });

    setEnviando(false);
    if (dbErr) { setError(t.cubcErrPublicar); return; }
    setPublicado(true);
    setTimeout(() => router.push('/cuidado'), 1800);
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-ink-muted">{t.cubcLoginSub}</p>
        <Link href="/publicar" className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-teal-600 px-5 py-2.5 font-bold text-white">
          {t.cubcLoginBtn}
        </Link>
      </div>
    );
  }

  if (publicado) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
          <Check className="h-8 w-8 text-teal-600" />
        </div>
        <h2 className="font-display text-2xl font-black text-ink">{t.cubcOkTitle}</h2>
        <p className="mt-2 text-ink-muted">{t.cubcOkSub}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Link href="/cuidado" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-ink-muted hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> {t.cartelVolver}
      </Link>

      <h1 className="font-display text-3xl font-black text-ink mb-1">{t.cubcTitle}</h1>
      <p className="text-sm text-ink-muted mb-8">{t.cubcSub}</p>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="card p-5">
          <p className="mb-3 text-sm font-bold text-ink">{t.cubcCualPerro}</p>

          {cargandoPerros ? (
            <div className="flex items-center gap-2 text-sm text-ink-muted">
              <Loader2 className="h-4 w-4 animate-spin" /> {t.cubcCargandoPerros}
            </div>
          ) : perros.length === 0 ? (
            <div className="rounded-2xl bg-brand-cream p-4 text-sm text-ink-muted">
              {t.cubcSinPerros}{' '}
              <Link href="/mis-perros/nuevo" className="font-bold text-teal-600 hover:underline">
                {t.cubcRegistra}
              </Link>
              <p className="mt-2 text-xs">{t.cubcSinPerroSub}</p>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2">
              {perros.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPerroSel(perroSel?.id === p.id ? null : p)}
                  className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition ${
                    perroSel?.id === p.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-black/10 hover:border-teal-200'
                  }`}
                >
                  {p.foto_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.foto_url} alt={p.nombre} className="h-10 w-10 rounded-xl object-cover shrink-0" />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-cream">
                      <Dog className="h-5 w-5 text-ink-muted" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-ink truncate">{p.nombre}</p>
                    {p.raza && <p className="text-xs text-ink-muted truncate">{p.raza}</p>}
                  </div>
                  {perroSel?.id === p.id && <Check className="ml-auto h-4 w-4 shrink-0 text-teal-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {perroSel && (
          <div className="card p-5 bg-teal-50 border border-teal-100">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-teal-600">
              {t.cubcCualPerro.replace('?', '')} {perroSel.nombre}
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-ink">
              {perroSel.raza   && <span><span className="font-semibold">Raza:</span> {perroSel.raza}</span>}
              {perroSel.color  && <span><span className="font-semibold">Color:</span> {perroSel.color}</span>}
              {perroSel.tamano && <span><span className="font-semibold">Tamaño:</span> {perroSel.tamano}</span>}
              {perroSel.sexo   && <span><span className="font-semibold">Sexo:</span> {perroSel.sexo}</span>}
            </div>
          </div>
        )}

        <div>
          <label className="label">{t.cubcFechas} <span className="text-ink-muted font-normal">{t.cubcOpcional}</span></label>
          <div className="grid grid-cols-2 gap-3 mt-1">
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-muted">{t.cubcDesde}</label>
              <input type="date" className="field w-full" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-muted">{t.cubcHasta}</label>
              <input type="date" className="field w-full" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
            </div>
          </div>
        </div>

        <div>
          <label className="label">{t.cubcZona} <span className="text-bad">*</span></label>
          <input
            className="field w-full mt-1"
            placeholder="Ej: Palermo, Villa Crespo…"
            value={zona}
            onChange={(e) => setZona(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="label">{t.cubcDescripcion} <span className="text-ink-muted font-normal">{t.cubcOpcional}</span></label>
          <textarea
            className="field w-full mt-1"
            rows={3}
            placeholder={t.cubcDescripcionPh}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div>
          <label className="label">{t.cubcContacto} <span className="text-bad">*</span></label>
          <input
            className="field w-full mt-1"
            type="tel"
            placeholder={t.cubcContactoPh}
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
            required
          />
          {contacto.trim() && contacto.replace(/\D/g, '').length < 10 && (
            <p className="mt-1.5 text-xs font-semibold text-bad">{t.cubcContactoError}</p>
          )}
        </div>

        {error && (
          <p className="flex items-center gap-2 rounded-2xl bg-bad/10 p-3 text-sm font-bold text-bad">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </p>
        )}

        <button
          type="submit"
          disabled={enviando}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-600 py-3.5 font-bold text-white transition hover:bg-teal-700 disabled:opacity-60"
        >
          {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          {t.cubcPublicar}
        </button>
      </form>
    </div>
  );
}

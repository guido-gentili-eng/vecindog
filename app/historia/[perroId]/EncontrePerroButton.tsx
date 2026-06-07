'use client';

import { useState } from 'react';
import { Phone, MapPin, CheckCircle2, Loader2, MessageCircle, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Props {
  perroId: string;
  perroNombre: string;
  perroFoto: string | null;
  nombreDuenio: string;
  telefonoDuenio: string | null;
}

export default function EncontrePerroButton({
  perroId,
  perroNombre,
  perroFoto,
  nombreDuenio,
  telefonoDuenio,
}: Props) {
  const { t } = useLanguage();
  const [open, setOpen]       = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [contacto, setContacto] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError]     = useState('');

  async function handleEnviar() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/encontre-perro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perroId, mensaje, contacto }),
      });
      if (!res.ok) throw new Error('Error al enviar');
      setEnviado(true);
    } catch {
      setError(t.encErrEnviar);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Banner verde llamativo */}
      <div className="mb-5 rounded-[20px] bg-[#3F8B5C] px-5 py-4 text-white no-print">
        <div className="flex items-center gap-3">
          {perroFoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={perroFoto} alt={perroNombre} className="h-14 w-14 rounded-full object-cover border-2 border-white/30 shrink-0" />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/20 text-2xl">🐾</div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide opacity-75">{t.encPregunta}</p>
            <p className="font-display text-lg font-black">{perroNombre}</p>
            <p className="text-xs opacity-75">{t.encDuenio.replace('{nombre}', nombreDuenio)}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {/* Botón para avisar al dueño */}
          <button
            onClick={() => setOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#3F8B5C] transition active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            {t.encAvisar}
          </button>

          {/* Teléfono del dueño (si tiene) */}
          {telefonoDuenio && (
            <a
              href={`tel:${telefonoDuenio}`}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/15 px-4 py-3 text-sm font-bold text-white transition active:scale-95"
            >
              <Phone className="h-4 w-4" />
              {t.encLlamar.replace('{tel}', telefonoDuenio)}
            </a>
          )}
        </div>
      </div>

      {/* Modal de aviso */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center no-print" onClick={() => !loading && setOpen(false)}>
          <div
            className="w-full max-w-sm rounded-t-[32px] bg-white px-6 pb-8 pt-6 shadow-2xl sm:rounded-[32px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-black/10 sm:hidden" />

            {enviado ? (
              <div className="py-4 text-center">
                <CheckCircle2 className="mx-auto mb-3 h-14 w-14 text-[#3F8B5C]" />
                <h2 className="font-display text-xl font-black text-ink">{t.encEnviado}</h2>
                <p className="mt-2 text-sm text-ink-muted">
                  {t.encEnviadoDesc.replace('{nombre}', perroNombre)}
                  {telefonoDuenio && ` ${t.encLlamarTambien.replace('{tel}', telefonoDuenio)}`}
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="mt-5 w-full rounded-2xl bg-[#3F8B5C] py-3 text-sm font-bold text-white"
                >
                  {t.mpdCerrar}
                </button>
              </div>
            ) : (
              <>
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-xl font-black text-ink">{t.encEncontreA.replace('{nombre}', perroNombre)}</h2>
                    <p className="text-sm text-ink-muted">{t.encEnviarDesc}</p>
                  </div>
                  <button onClick={() => setOpen(false)} className="rounded-full p-1.5 text-ink-muted hover:bg-black/5">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-ink-muted uppercase tracking-wide">
                      {t.encMensaje}
                    </label>
                    <textarea
                      value={mensaje}
                      onChange={(e) => setMensaje(e.target.value)}
                      placeholder={`Ej: ${t.encEncontreA.replace('{nombre}', perroNombre)}...`}
                      rows={3}
                      className="w-full rounded-2xl border border-black/10 bg-[#f8f5f0] px-4 py-3 text-sm text-ink placeholder-ink-muted/50 focus:border-[#3F8B5C] focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-ink-muted uppercase tracking-wide">
                      {t.encTelefono}
                    </label>
                    <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-[#f8f5f0] px-4 py-3">
                      <Phone className="h-4 w-4 shrink-0 text-ink-muted" />
                      <input
                        type="tel"
                        value={contacto}
                        onChange={(e) => setContacto(e.target.value)}
                        placeholder="Ej: 11 1234-5678"
                        className="w-full bg-transparent text-sm text-ink placeholder-ink-muted/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-xs font-bold text-[#D7503A]">{error}</p>
                  )}

                  <button
                    onClick={handleEnviar}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3F8B5C] py-3.5 text-sm font-bold text-white disabled:opacity-60 transition active:scale-95"
                  >
                    {loading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> {t.encEnviando}</>
                    ) : (
                      <><MapPin className="h-4 w-4" /> {t.encAvisarBtn}</>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

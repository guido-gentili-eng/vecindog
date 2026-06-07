'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft, Star, Phone, MapPin, Calendar, User, Car,
  ThumbsUp, Clock, MessageCircle, Check, Loader2, AlertCircle,
} from 'lucide-react';
import { obtenerPost, type Post } from '@/lib/posts';
import {
  getRatingsTransportador, calificarTransportador,
  type TransportadorRating, type ResumenRatingTransportador,
} from '@/lib/transportadorRatings';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

function Estrellas({ valor, max = 5, size = 'sm' }: { valor: number; max?: number; size?: 'sm' | 'lg' }) {
  const sz = size === 'lg' ? 'h-6 w-6' : 'h-4 w-4';
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`${sz} ${i < Math.round(valor) ? 'fill-amber-400 text-amber-400' : 'text-black/10'}`}
        />
      ))}
    </span>
  );
}

function ModalPuntuacion({
  transportadorPostId,
  inicial,
  onGuardado,
  onClose,
}: {
  transportadorPostId: string;
  inicial: TransportadorRating | null;
  onGuardado: () => void;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const [estrellas,     setEstrellas]     = useState(inicial?.estrellas ?? 0);
  const [cuidadoAnimal, setCuidadoAnimal] = useState<'excelente'|'bueno'|'regular'|null>(inicial?.cuidado_animal ?? null);
  const [fuePuntual,    setFuePuntual]    = useState<boolean|null>(inicial?.fue_puntual ?? null);
  const [buenaCom,      setBuenaCom]      = useState<boolean|null>(inicial?.buena_comunicacion ?? null);
  const [loRecomienda,  setLoRecomienda]  = useState<boolean|null>(inicial?.lo_recomendaria ?? null);
  const [comentario,    setComentario]    = useState(inicial?.comentario ?? '');
  const [enviando,      setEnviando]      = useState(false);
  const [error,         setError]         = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (estrellas === 0) { setError(t.quidErrEstrella); return; }
    setEnviando(true);
    setError('');
    try {
      await calificarTransportador({
        transportadorPostId,
        estrellas,
        cuidado_animal:     cuidadoAnimal,
        fue_puntual:        fuePuntual,
        buena_comunicacion: buenaCom,
        lo_recomendaria:    loRecomienda,
        comentario,
      });
      onGuardado();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar. Intentá de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
        <h3 className="font-display text-xl font-black text-ink mb-5">{t.tridModalTitle}</h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-bold text-ink">{t.quidPuntuacion} <span className="text-bad">*</span></p>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((n) => (
                <button key={n} type="button" onClick={() => setEstrellas(n)}>
                  <Star className={`h-8 w-8 transition ${n <= estrellas ? 'fill-amber-400 text-amber-400' : 'text-black/15 hover:text-amber-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-bold text-ink">{t.tridCuidadoPerro}</p>
            <div className="flex gap-2">
              {([['excelente', t.quidExcelente], ['bueno', t.quidBueno], ['regular', t.quidRegular]] as const).map(([val, lbl]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setCuidadoAnimal(cuidadoAnimal === val ? null : val)}
                  className={`flex-1 rounded-2xl border-2 py-2 text-xs font-bold transition ${
                    cuidadoAnimal === val ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-black/10 text-ink-muted hover:border-blue-200'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          {([
            [t.quidFuePuntual, fuePuntual, setFuePuntual],
            [t.quidBuenaCom,   buenaCom,   setBuenaCom],
            [t.quidRecomienda, loRecomienda, setLoRecomienda],
          ] as [string, boolean | null, (v: boolean | null) => void][]).map(([pregunta, val, setter]) => (
            <div key={pregunta}>
              <p className="mb-2 text-sm font-bold text-ink">{pregunta}</p>
              <div className="flex gap-2">
                {([[true, t.adpSi], [false, t.adpNo]] as [boolean, string][]).map(([bval, lbl]) => (
                  <button
                    key={String(bval)}
                    type="button"
                    onClick={() => setter(val === bval ? null : (bval as boolean))}
                    className={`flex-1 rounded-2xl border-2 py-2 text-sm font-bold transition ${
                      val === bval ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-black/10 text-ink-muted hover:border-blue-200'
                    }`}
                  >
                    {lbl as string}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div>
            <p className="mb-2 text-sm font-bold text-ink">{t.quidComentario} <span className="text-ink-muted font-normal">{t.cubcOpcional}</span></p>
            <textarea
              className="field w-full"
              rows={2}
              placeholder={t.quidComentarioPh}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
          </div>

          {error && (
            <p className="flex items-center gap-2 rounded-2xl bg-bad/10 p-3 text-sm font-bold text-bad">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </p>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-2xl border-2 border-black/10 py-2.5 text-sm font-bold text-ink-muted transition hover:border-bad/30 hover:text-bad">
              {t.quidCancelar}
            </button>
            <button type="submit" disabled={enviando}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-60">
              {enviando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {t.quidGuardar}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PerfilTransportadorPage() {
  const { id }             = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [post,         setPost]         = useState<Post | null>(null);
  const [ratings,      setRatings]      = useState<TransportadorRating[]>([]);
  const [resumen,      setResumen]      = useState<ResumenRatingTransportador | null>(null);
  const [cargando,     setCargando]     = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardado,     setGuardado]     = useState(false);

  async function cargar() {
    setCargando(true);
    const [p, { ratings: rs, resumen: res }] = await Promise.all([
      obtenerPost(id),
      getRatingsTransportador(id),
    ]);
    setPost(p);
    setRatings(rs);
    setResumen(res);
    setCargando(false);
  }

  useEffect(() => { cargar(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleGuardado() {
    setModalAbierto(false);
    setGuardado(true);
    cargar();
    setTimeout(() => setGuardado(false), 3000);
  }

  if (cargando) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center text-ink-muted">
        {t.tridNoEncontrado}
        <br />
        <Link href="/transporte" className="mt-4 inline-block font-bold text-blue-600 hover:underline">{t.cartelVolver}</Link>
      </div>
    );
  }

  const yaCalificó   = resumen?.miRating != null;
  const esPropioPost = post.user_id === user?.id;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Link href="/transporte" className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-ink-muted hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> {t.tridBack}
      </Link>

      <div className="card mb-6 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100">
            <User className="h-8 w-8 text-blue-700" />
          </div>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-black text-ink">{post.nombre ?? 'Transportador disponible'}</h1>
            {post.zona && (
              <p className="mt-1 flex items-center gap-1 text-sm text-ink-muted">
                <MapPin className="h-3.5 w-3.5" /> {post.zona}
              </p>
            )}
            {resumen && resumen.total > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <Estrellas valor={resumen.promedio} size="sm" />
                <span className="text-sm font-bold text-ink">{resumen.promedio.toFixed(1)}</span>
                <span className="text-xs text-ink-muted">({resumen.total} {t.quidCalificaciones.toLowerCase()})</span>
                {resumen.recomendaciones > 0 && (
                  <span className="ml-1 text-xs text-blue-600 font-semibold">· {resumen.recomendaciones}{t.quidRecomendaciones}</span>
                )}
              </div>
            )}
          </div>
          {post.contacto && (
            <a
              href={`https://wa.me/${post.contacto.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              <Phone className="h-4 w-4" /> {t.quidContactar}
            </a>
          )}
        </div>
      </div>

      <div className="card mb-6 p-6">
        <h2 className="mb-4 font-display text-lg font-black text-ink flex items-center gap-2">
          <Car className="h-5 w-5 text-blue-600" /> {t.tridSobre}
        </h2>
        {post.descripcion && (
          <p className="text-sm leading-relaxed text-ink-muted mb-4">{post.descripcion}</p>
        )}
        {post.horario && (
          <div className="flex items-center gap-2 rounded-2xl bg-brand-cream px-4 py-2.5 text-sm">
            <Calendar className="h-4 w-4 shrink-0 text-blue-600" />
            <span className="font-semibold text-ink">{t.quidDisponibilidad}</span>
            <span className="text-ink-muted">{post.horario}</span>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-black text-ink flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
            {t.quidCalificaciones}
            {resumen && resumen.total > 0 && (
              <span className="ml-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-bold text-blue-700">
                {resumen.total}
              </span>
            )}
          </h2>

          {isAuthenticated && !esPropioPost && (
            <button
              type="button"
              onClick={() => setModalAbierto(true)}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              <Star className="h-3.5 w-3.5" />
              {yaCalificó ? t.quidEditarCal : t.quidCalificar}
            </button>
          )}
        </div>

        {guardado && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-blue-50 p-3 text-sm font-bold text-blue-700">
            <Check className="h-4 w-4" /> {t.quidCalGuardada}
          </div>
        )}

        {ratings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 p-8 text-center text-sm text-blue-600">
            {t.tridSinCal}{' '}
            {isAuthenticated && !esPropioPost && (
              <button onClick={() => setModalAbierto(true)} className="font-bold underline">{t.quidSePrimero}</button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {ratings.map((r) => (
              <div key={r.id} className="card p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <Estrellas valor={r.estrellas} />
                  <span className="text-xs text-ink-muted shrink-0">
                    {new Date(r.created_at).toLocaleDateString('es-AR')}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  {r.cuidado_animal && (
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      r.cuidado_animal === 'excelente' ? 'bg-blue-100 text-blue-700' :
                      r.cuidado_animal === 'bueno'     ? 'bg-teal-100 text-teal-700' :
                                                          'bg-amber-100 text-amber-700'
                    }`}>
                      {t.tridCuidadoBadge} {r.cuidado_animal}
                    </span>
                  )}
                  {r.fue_puntual === true  && <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700"><Clock className="inline h-3 w-3 mr-0.5" />{t.quidPuntual}</span>}
                  {r.buena_comunicacion === true && <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700"><MessageCircle className="inline h-3 w-3 mr-0.5" />{t.quidBuenaComunicacion}</span>}
                  {r.lo_recomendaria === true && <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700"><ThumbsUp className="inline h-3 w-3 mr-0.5" />{t.quidLoRecomienda}</span>}
                </div>

                {r.comentario && (
                  <p className="text-sm text-ink-muted leading-relaxed">{r.comentario}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {modalAbierto && (
        <ModalPuntuacion
          transportadorPostId={id}
          inicial={resumen?.miRating ?? null}
          onGuardado={handleGuardado}
          onClose={() => setModalAbierto(false)}
        />
      )}
    </div>
  );
}

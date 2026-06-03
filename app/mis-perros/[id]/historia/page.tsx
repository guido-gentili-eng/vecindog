'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Instagram, Download, Share2, Loader2, CheckCircle2 } from 'lucide-react';
import { obtenerPerro, type Perro } from '@/lib/perros';
import { buscarPostActivoDePerro } from '@/lib/posts';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

/* ── Helpers ── */
function limpiarHandle(raw: string) {
  return raw.replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/\/$/, '').trim();
}

export default function HistoriaInstagramPage() {
  const { id }       = useParams<{ id: string }>();
  const router       = useRouter();
  const { user, profile } = useAuth();

  const storyRef = useRef<HTMLDivElement>(null);

  const [perro,     setPerro]     = useState<Perro | null>(null);
  const [perdido,   setPerdido]   = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [generando, setGenerando] = useState(false);
  const [compartido, setCompartido] = useState(false);

  /* Instagram handle */
  const [igHandle,   setIgHandle]   = useState(profile?.instagram ?? '');
  const [editandoIg, setEditandoIg] = useState(false);
  const [guardando,  setGuardando]  = useState(false);

  useEffect(() => {
    obtenerPerro(id).then(async (p) => {
      setPerro(p);
      if (p) {
        const post = await buscarPostActivoDePerro(p.id);
        setPerdido(!!post);
      }
    }).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    setIgHandle(profile?.instagram ?? '');
  }, [profile?.instagram]);

  async function guardarInstagram() {
    if (!user) return;
    setGuardando(true);
    const handle = limpiarHandle(igHandle);
    await supabase.from('profiles').update({ instagram: handle || null }).eq('id', user.id);
    setIgHandle(handle);
    setEditandoIg(false);
    setGuardando(false);
  }

  async function compartirStory() {
    if (!storyRef.current) return;
    setGenerando(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(storyRef.current, {
        useCORS:     true,
        allowTaint:  false,
        scale:       2,
        backgroundColor: null,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `${perro?.nombre ?? 'perro'}-vecindog.png`, { type: 'image/png' });

        // Intentar Web Share API (funciona en móvil)
        if (navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: `${perro?.nombre ?? 'Mi perro'} en Vecindog` });
            setCompartido(true);
          } catch {
            descargar(canvas);
          }
        } else {
          descargar(canvas);
        }
        setGenerando(false);
      }, 'image/png');
    } catch {
      setGenerando(false);
    }
  }

  function descargar(canvas: HTMLCanvasElement) {
    const link = document.createElement('a');
    link.download = `${perro?.nombre ?? 'perro'}-vecindog-historia.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setCompartido(true);
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <Loader2 className="h-8 w-8 animate-spin text-white" />
    </div>
  );

  if (!perro) return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <p className="text-white">Perro no encontrado.</p>
    </div>
  );

  const accent   = perdido ? '#ef4444' : '#EE5A3B';
  const igFinal  = igHandle ? limpiarHandle(igHandle) : null;

  return (
    <div className="min-h-screen bg-[#111] py-6 px-4">

      {/* Header */}
      <div className="mx-auto max-w-sm mb-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm font-bold text-white/70 hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>
        <span className="flex items-center gap-1.5 text-sm font-bold text-white/50">
          <Instagram className="h-4 w-4" /> Historia de Instagram
        </span>
      </div>

      {/* Conectar Instagram */}
      <div className="mx-auto max-w-sm mb-5">
        {!igFinal && !editandoIg ? (
          <div className="rounded-2xl bg-white/10 p-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-bold text-white text-sm">Conectá tu Instagram</p>
              <p className="text-xs text-white/60">Aparecerá en la historia para que te contacten.</p>
            </div>
            <button
              type="button"
              onClick={() => setEditandoIg(true)}
              className="rounded-xl bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] px-3 py-2 text-xs font-bold text-white transition hover:opacity-90"
            >
              Conectar
            </button>
          </div>
        ) : editandoIg ? (
          <div className="rounded-2xl bg-white/10 p-4 space-y-3">
            <p className="font-bold text-white text-sm">Tu usuario de Instagram</p>
            <div className="flex gap-2">
              <input
                autoFocus
                type="text"
                placeholder="@tunombre"
                value={igHandle}
                onChange={(e) => setIgHandle(e.target.value)}
                className="field flex-1"
              />
              <button
                type="button"
                disabled={guardando}
                onClick={guardarInstagram}
                className="rounded-xl bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
              >
                {guardando ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar'}
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white/10 p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Instagram className="h-4 w-4 text-white/60" />
              <span className="font-bold text-white text-sm">@{igFinal}</span>
            </div>
            <button
              type="button"
              onClick={() => setEditandoIg(true)}
              className="text-xs font-bold text-white/50 hover:text-white transition"
            >
              Cambiar
            </button>
          </div>
        )}
      </div>

      {/* Preview de la historia */}
      <div className="mx-auto" style={{ maxWidth: '360px' }}>
        <div
          ref={storyRef}
          style={{
            width:      '360px',
            height:     '640px',
            background: `linear-gradient(160deg, ${accent}22 0%, #0a0a0a 40%, #0a0a0a 100%)`,
            borderRadius: '24px',
            overflow:   'hidden',
            position:   'relative',
            fontFamily: '"Arial", sans-serif',
            display:    'flex',
            flexDirection: 'column',
          }}
        >
          {/* Borde superior de color */}
          <div style={{ height: '5px', background: `linear-gradient(90deg, ${accent}, ${accent}99)` }} />

          {/* Header */}
          <div style={{ padding: '16px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: 0, fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                VECINDOG · mivecindog.com.ar
              </p>
              <p style={{ margin: '2px 0 0', fontSize: perdido ? '18px' : '13px', fontWeight: 900, color: accent, letterSpacing: '-0.3px' }}>
                {perdido ? '⚠ SE BUSCA · PERDIDO' : 'IDENTIFICACIÓN DE MASCOTA'}
              </p>
            </div>
            <div style={{ background: accent, borderRadius: '6px', padding: '4px 10px', fontSize: '9px', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {perdido ? 'PERDIDO' : 'REGISTRADO'}
            </div>
          </div>

          {/* Foto + nombre */}
          <div style={{ padding: '0 20px 12px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            {/* Foto */}
            <div style={{ flex: '0 0 auto' }}>
              {perro.foto_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={perro.foto_url}
                  crossOrigin="anonymous"
                  alt={perro.nombre}
                  style={{ width: '120px', height: '140px', objectFit: 'cover', borderRadius: '12px', border: `2px solid ${accent}`, display: 'block' }}
                />
              ) : (
                <div style={{ width: '120px', height: '140px', background: `${accent}22`, borderRadius: '12px', border: `2px solid ${accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🐶</div>
              )}
              <div style={{ marginTop: '6px', background: accent, borderRadius: '6px', padding: '4px 8px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 900, color: '#fff' }}>{perro.nombre}</p>
              </div>
            </div>

            {/* Datos */}
            <div style={{ flex: 1 }}>
              <div style={{ background: `${accent}18`, borderRadius: '8px', padding: '10px 12px' }}>
                <p style={{ margin: '0 0 6px', fontSize: '8px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: accent }}>Características</p>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                  <tbody>
                    {([
                      ['Raza',   perro.raza],
                      ['Color',  perro.color],
                      ['Tamaño', perro.tamano],
                      ['Sexo',   perro.sexo],
                      ['Chip',   perro.chip],
                    ] as [string, string | null | undefined][]).filter(([, v]) => v).map(([l, v]) => (
                      <tr key={l}>
                        <td style={{ padding: '2px 6px 2px 0', color: 'rgba(255,255,255,0.5)', fontWeight: 600, width: '55px', fontSize: '10px' }}>{l}</td>
                        <td style={{ padding: '2px 0', color: '#fff', fontWeight: 700, textTransform: 'capitalize', fontSize: '10px' }}>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {perro.descripcion && (
                <div style={{ marginTop: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '8px 10px', borderLeft: `2px solid ${accent}` }}>
                  <p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>{perro.descripcion.slice(0, 100)}{perro.descripcion.length > 100 ? '…' : ''}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sección contacto */}
          <div style={{ margin: '0 14px', background: accent, borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '8px', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700 }}>
                {perdido ? 'Si lo encontraste, avisá' : 'Dueño'}
              </p>
              {profile?.nombre && (
                <p style={{ color: '#fff', fontSize: '13px', fontWeight: 800, margin: '0 0 2px' }}>
                  {profile.nombre} {profile.apellido}
                </p>
              )}
              {profile?.telefono && (
                <p style={{ color: '#fff', fontSize: '18px', fontWeight: 900, margin: 0, letterSpacing: '-0.3px' }}>
                  {profile.telefono}
                </p>
              )}
            </div>
            {/* QR icon placeholder */}
            <div style={{ flex: '0 0 auto', textAlign: 'center', opacity: 0.6 }}>
              <p style={{ color: '#fff', fontSize: '20px', margin: 0 }}>🐾</p>
              <p style={{ color: '#fff', fontSize: '7px', fontWeight: 700, letterSpacing: '1px', margin: '2px 0 0' }}>VECINDOG</p>
            </div>
          </div>

          {/* Instagram handle */}
          {igFinal && (
            <div style={{ margin: '10px 14px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px' }}>📸</span>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: 800, color: 'rgba(255,255,255,0.8)' }}>@{igFinal}</p>
            </div>
          )}

          {/* Footer */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', padding: '10px 20px 14px' }}>
            <p style={{ margin: 0, fontSize: '9px', color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
              Creado en mivecindog.com.ar · Red vecinal de mascotas · Argentina
            </p>
          </div>

          {/* Borde inferior */}
          <div style={{ height: '4px', background: `linear-gradient(90deg, ${accent}99, ${accent})` }} />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="mx-auto max-w-sm mt-6 space-y-3">
        <button
          type="button"
          onClick={compartirStory}
          disabled={generando}
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-white transition disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
        >
          {generando
            ? <><Loader2 className="h-5 w-5 animate-spin" /> Generando imagen…</>
            : compartido
            ? <><CheckCircle2 className="h-5 w-5" /> ¡Imagen lista!</>
            : <><Share2 className="h-5 w-5" /> Compartir en Instagram Stories</>
          }
        </button>

        {compartido && (
          <div className="rounded-2xl bg-white/10 p-4 text-center text-sm text-white/80 space-y-1">
            <p className="font-bold">📱 En el celular:</p>
            <p>Abrí Instagram → ➕ Nueva historia → elegí la imagen descargada</p>
          </div>
        )}

        <button
          type="button"
          onClick={compartirStory}
          disabled={generando}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 py-3 text-sm font-bold text-white/60 transition hover:text-white hover:border-white/40 disabled:opacity-40"
        >
          <Download className="h-4 w-4" /> Solo descargar imagen
        </button>
      </div>
    </div>
  );
}

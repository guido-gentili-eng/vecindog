'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Loader2, CheckCircle2 } from 'lucide-react';
import { obtenerPerro, type Perro } from '@/lib/perros';
import { buscarPostActivoDePerro } from '@/lib/posts';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';

function IgIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function FbIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function limpiarHandle(raw: string) {
  return raw.trim().toLowerCase();
}

type Red = 'instagram' | 'facebook';

interface ConexionRed {
  red:      Red;
  handle:   string;
  editando: boolean;
  guardando: boolean;
}

export default function HistoriaPage() {
  const { id }            = useParams<{ id: string }>();
  const router            = useRouter();
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const storyRef          = useRef<HTMLDivElement>(null);

  const [perro,      setPerro]      = useState<Perro | null>(null);
  const [perdido,    setPerdido]    = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [generando,  setGenerando]  = useState<Red | 'download' | null>(null);
  const [compartido, setCompartido] = useState<Red | null>(null);

  const [redes, setRedes] = useState<Record<Red, ConexionRed>>({
    instagram: { red: 'instagram', handle: '', editando: false, guardando: false },
    facebook:  { red: 'facebook',  handle: '', editando: false, guardando: false },
  });

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
    setRedes((prev) => ({
      instagram: { ...prev.instagram, handle: profile?.instagram ?? '' },
      facebook:  { ...prev.facebook,  handle: profile?.facebook  ?? '' },
    }));
  }, [profile?.instagram, profile?.facebook]);

  function setHandle(red: Red, value: string) {
    setRedes((prev) => ({ ...prev, [red]: { ...prev[red], handle: value } }));
  }
  function setEditando(red: Red, v: boolean) {
    setRedes((prev) => ({ ...prev, [red]: { ...prev[red], editando: v } }));
  }

  async function guardarHandle(red: Red) {
    if (!user) return;
    setRedes((prev) => ({ ...prev, [red]: { ...prev[red], guardando: true } }));
    const handle = limpiarHandle(redes[red].handle);
    await supabase.from('profiles').update({ [red]: handle || null }).eq('id', user.id);
    setRedes((prev) => ({
      ...prev,
      [red]: { ...prev[red], handle, editando: false, guardando: false },
    }));
  }

  async function generarYCompartir(red: Red | 'download') {
    if (!storyRef.current) return;
    setGenerando(red);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(storyRef.current, {
        useCORS: true, allowTaint: false, scale: 2, backgroundColor: null,
      });

      const filename = `${perro?.nombre ?? 'perro'}-vecindog.png`;
      canvas.toBlob(async (blob) => {
        if (!blob) { setGenerando(null); return; }
        const file = new File([blob], filename, { type: 'image/png' });

        if (red !== 'download' && navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: `${perro?.nombre ?? 'Mi perro'} — Vecindog`,
            });
            setCompartido(red as Red);
          } catch {
            descargar(canvas, filename);
          }
        } else {
          descargar(canvas, filename);
          if (red !== 'download') setCompartido(red as Red);
        }
        setGenerando(null);
      }, 'image/png');
    } catch {
      setGenerando(null);
    }
  }

  function descargar(canvas: HTMLCanvasElement, filename: string) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
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

  const accent = perdido ? '#ef4444' : '#22c55e';
  const igFinal = redes.instagram.handle ? limpiarHandle(redes.instagram.handle) : null;
  const fbFinal = redes.facebook.handle  ? limpiarHandle(redes.facebook.handle)  : null;

  function ConexionCard({ red, label, color, icon }: {
    red: Red; label: string; color: string; icon: React.ReactNode;
  }) {
    const r = redes[red];
    if (!r.handle && !r.editando) return (
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/10 p-4">
        <div>
          <p className="font-bold text-white text-sm">{t.histConectarLabel.replace('{red}', label)}</p>
          <p className="text-xs text-white/60">{t.histEmailLabel}</p>
        </div>
        <button type="button" onClick={() => setEditando(red, true)}
          className="rounded-xl px-3 py-2 text-xs font-bold text-white transition hover:opacity-90"
          style={{ background: color }}>
          {t.histConectar}
        </button>
      </div>
    );
    if (r.editando) return (
      <div className="rounded-2xl bg-white/10 p-4 space-y-3">
        <p className="font-bold text-white text-sm flex items-center gap-2">{icon} {t.histEmailDe.replace('{red}', label)}</p>
        <div className="flex gap-2">
          <input autoFocus type="email" placeholder={t.histEmailPh}
            value={r.handle} onChange={(e) => setHandle(red, e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && guardarHandle(red)}
            className="field flex-1" />
          <button type="button" disabled={r.guardando} onClick={() => guardarHandle(red)}
            className="rounded-xl px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
            style={{ background: color }}>
            {r.guardando ? <Loader2 className="h-4 w-4 animate-spin" /> : t.histGuardar}
          </button>
        </div>
      </div>
    );
    return (
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/10 p-3">
        <div className="flex items-center gap-2">
          <span style={{ color }}>{icon}</span>
          <span className="font-bold text-white text-sm">{limpiarHandle(r.handle)}</span>
        </div>
        <button type="button" onClick={() => setEditando(red, true)}
          className="text-xs font-bold text-white/50 hover:text-white transition">
          {t.histCambiar}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] py-6 px-4">

      <div className="mx-auto max-w-sm mb-5 flex items-center justify-between">
        <button type="button" onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm font-bold text-white/70 hover:text-white transition">
          <ArrowLeft className="h-4 w-4" /> {t.histVolver}
        </button>
        <span className="text-sm font-bold text-white/50">{t.histCompartirRedes}</span>
      </div>

      <div className="mx-auto max-w-sm mb-5 space-y-2">
        <ConexionCard red="instagram" label="Instagram"
          color="linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)"
          icon={<IgIcon size={14} />} />
        <ConexionCard red="facebook" label="Facebook"
          color="#1877F2"
          icon={<FbIcon size={14} />} />
      </div>

      <div className="mx-auto mb-6" style={{ maxWidth: '360px' }}>
        <div ref={storyRef} style={{
          width: '360px', height: '640px',
          background: `linear-gradient(160deg, ${accent}22 0%, #0a0a0a 40%, #0a0a0a 100%)`,
          borderRadius: '24px', overflow: 'hidden', position: 'relative',
          fontFamily: '"Arial", sans-serif', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ height: '5px', background: `linear-gradient(90deg, ${accent}, ${accent}99)` }} />

          <div style={{ padding: '16px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ margin: 0, fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                mivecindog.com.ar
              </p>
              <p style={{ margin: '2px 0 0', fontSize: perdido ? '18px' : '13px', fontWeight: 900, color: accent }}>
                {perdido ? '⚠ SE BUSCA · PERDIDO' : 'IDENTIFICACIÓN DE MASCOTA'}
              </p>
            </div>
            <div style={{ background: accent, borderRadius: '6px', padding: '4px 10px', fontSize: '9px', fontWeight: 800, color: '#fff', textTransform: 'uppercase' }}>
              {perdido ? 'PERDIDO' : 'REGISTRADO'}
            </div>
          </div>

          <div style={{ padding: '0 20px 12px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ flex: '0 0 auto' }}>
              {perro.foto_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={perro.foto_url} crossOrigin="anonymous" alt={perro.nombre}
                  style={{ width: '120px', height: '140px', objectFit: 'cover', borderRadius: '12px', border: `2px solid ${accent}`, display: 'block' }} />
              ) : (
                <div style={{ width: '120px', height: '140px', background: `${accent}22`, borderRadius: '12px', border: `2px solid ${accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🐶</div>
              )}
              <div style={{ marginTop: '6px', background: accent, borderRadius: '6px', padding: '4px 8px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 900, color: '#fff' }}>{perro.nombre}</p>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ background: `${accent}18`, borderRadius: '8px', padding: '10px 12px' }}>
                <p style={{ margin: '0 0 6px', fontSize: '8px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: accent }}>Características</p>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {([
                      perro.numero_registro != null ? ['Registro', `#${perro.numero_registro}`] : null,
                      ['Raza',   perro.raza],
                      ['Color',  perro.color],
                      ['Tamaño', perro.tamano],
                      ['Sexo',   perro.sexo],
                      ['Chip',   perro.chip],
                    ].filter(Boolean) as [string, string | null | undefined][]).filter(([, v]) => v).map(([l, v]) => (
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
                  <p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
                    {perro.descripcion.slice(0, 100)}{perro.descripcion.length > 100 ? '…' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>

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
                <p style={{ color: '#fff', fontSize: '18px', fontWeight: 900, margin: 0, filter: 'blur(5px)', userSelect: 'none' }}>
                  {profile.telefono}
                </p>
              )}
            </div>
            <div style={{ opacity: 0.5, textAlign: 'center' }}>
              <p style={{ color: '#fff', fontSize: '20px', margin: 0 }}>🐾</p>
              <p style={{ color: '#fff', fontSize: '7px', fontWeight: 700, margin: '2px 0 0' }}>VECINDOG</p>
            </div>
          </div>

          {(igFinal || fbFinal) && (
            <div style={{ margin: '10px 14px 0', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {igFinal && (
                <p style={{ margin: 0, fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  📸 {igFinal}
                </p>
              )}
              {fbFinal && (
                <p style={{ margin: 0, fontSize: '11px', fontWeight: 800, color: 'rgba(255,255,255,0.75)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  👥 {fbFinal}
                </p>
              )}
            </div>
          )}

          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', padding: '10px 20px 12px' }}>
            <p style={{ margin: 0, fontSize: '9px', color: 'rgba(255,255,255,0.2)', fontWeight: 600 }}>
              Creado en mivecindog.com.ar · Red vecinal de mascotas · Argentina
            </p>
          </div>
          <div style={{ height: '4px', background: `linear-gradient(90deg, ${accent}99, ${accent})` }} />
        </div>
      </div>

      <div className="mx-auto max-w-sm space-y-3">

        <button type="button" disabled={!!generando}
          onClick={() => generarYCompartir('instagram')}
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-white transition disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' }}>
          {generando === 'instagram'
            ? <><Loader2 className="h-5 w-5 animate-spin" /> {t.histGenerando}</>
            : compartido === 'instagram'
            ? <><CheckCircle2 className="h-5 w-5" /> {t.histListaIg}</>
            : <><IgIcon size={20} /> {t.histCompartirIg}</>}
        </button>

        <button type="button" disabled={!!generando}
          onClick={() => generarYCompartir('facebook')}
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-white transition disabled:opacity-60"
          style={{ background: '#1877F2' }}>
          {generando === 'facebook'
            ? <><Loader2 className="h-5 w-5 animate-spin" /> {t.histGenerando}</>
            : compartido === 'facebook'
            ? <><CheckCircle2 className="h-5 w-5" /> {t.histListaFb}</>
            : <><FbIcon size={20} /> {t.histCompartirFb}</>}
        </button>

        {(compartido === 'instagram' || compartido === 'facebook') && (
          <div className="rounded-2xl bg-white/10 p-4 text-center text-sm text-white/80 space-y-1">
            <p className="font-bold">{t.histEnCelular}</p>
            {compartido === 'instagram'
              ? <p>{t.histPasoIg}</p>
              : <p>{t.histPasoFb}</p>}
          </div>
        )}

        <button type="button" disabled={!!generando}
          onClick={() => generarYCompartir('download')}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 py-3 text-sm font-bold text-white/60 transition hover:text-white hover:border-white/40 disabled:opacity-40">
          <Download className="h-4 w-4" />
          {generando === 'download' ? t.histGenerando : t.histDescargar}
        </button>
      </div>
    </div>
  );
}

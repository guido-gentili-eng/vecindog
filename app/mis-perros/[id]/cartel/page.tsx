'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { obtenerPerro, type Perro } from '@/lib/perros';
import { buscarPostActivoDePerro } from '@/lib/posts';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Printer, ArrowLeft } from 'lucide-react';
import QRCode from 'qrcode';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CartelPage() {
  const { id }      = useParams<{ id: string }>();
  const { profile } = useAuth();
  const { t } = useLanguage();

  const [perro,    setPerro]    = useState<Perro | null>(null);
  const [perdido,  setPerdido]  = useState(false);
  const [qr,       setQr]       = useState<string>('');
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    obtenerPerro(id)
      .then(async (p) => {
        setPerro(p);
        if (p) {
          const post = await buscarPostActivoDePerro(p.id);
          setPerdido(!!post);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!profile?.telefono) return;
    const raw = profile.telefono.replace(/\D/g, '');
    const num = raw.startsWith('54') ? raw : `54${raw}`;
    QRCode.toDataURL(`https://wa.me/${num}`, {
      width: 400,
      margin: 1,
      color: { dark: perdido ? '#dc2626' : '#1e3a5f', light: '#ffffff' },
    }).then(setQr);
  }, [profile?.telefono, perdido]);

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
    </div>
  );

  if (!perro) return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-ink-muted">Perro no encontrado.</p>
    </div>
  );

  const telefono    = profile?.telefono ?? '';
  const nombreDuenio = profile ? `${profile.nombre} ${profile.apellido}` : '';

  // Paleta según estado
  const accent  = perdido ? '#dc2626' : '#1e3a5f';
  const accentBg = perdido ? '#fef2f2' : '#eff6ff';
  const accentLight = perdido ? '#fee2e2' : '#dbeafe';

  return (
    <>
      {/* Controles — solo pantalla */}
      <div className="print:hidden bg-gray-100 border-b px-6 py-4 flex items-center justify-between gap-4">
        <Link href={`/mis-perros/${id}`}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-muted hover:text-ink transition">
          <ArrowLeft className="h-4 w-4" /> {t.cartelVolver}
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition"
          style={{ background: accent }}
        >
          <Printer className="h-4 w-4" /> {t.cartelImprimir}
        </button>
      </div>

      {/* ═══════════════ DOCUMENTO ═══════════════ */}
      <div
        id="cartel"
        style={{
          width: '210mm',
          minHeight: '297mm',
          margin: '0 auto',
          background: '#ffffff',
          fontFamily: '"Arial", sans-serif',
          position: 'relative',
          boxSizing: 'border-box',
        }}
      >
        {/* Borde superior de color */}
        <div style={{ height: '8px', background: accent }} />

        {/* Header del documento */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: `2px solid ${accentLight}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <p style={{ margin: 0, fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#888' }}>
              Vecindog · mivecindog.com.ar
            </p>
            <p style={{
              margin: '2px 0 0',
              fontSize: perdido ? '28px' : '18px',
              fontWeight: 900,
              color: accent,
              letterSpacing: '-0.5px',
            }}>
              {perdido ? '⚠ SE BUSCA · PERRO PERDIDO' : 'IDENTIFICACIÓN DE MASCOTA'}
            </p>
          </div>
          {/* Badge de estado */}
          <div style={{
            background: accent,
            color: '#fff',
            borderRadius: '8px',
            padding: '6px 14px',
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            {perdido ? 'PERDIDO' : 'REGISTRADO'}
          </div>
        </div>

        {/* Cuerpo principal */}
        <div style={{ padding: '20px 24px', display: 'flex', gap: '20px' }}>

          {/* Columna izquierda: foto */}
          <div style={{ flex: '0 0 auto', width: '160px' }}>
            {perro.foto_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={perro.foto_url}
                alt={perro.nombre}
                style={{
                  width: '160px',
                  height: '190px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                  border: `3px solid ${accent}`,
                  display: 'block',
                }}
              />
            ) : (
              <div style={{
                width: '160px', height: '190px',
                background: accentBg,
                borderRadius: '10px',
                border: `3px solid ${accentLight}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '56px',
              }}>🐶</div>
            )}
            {/* Nombre debajo de la foto */}
            <div style={{
              marginTop: '8px',
              background: accent,
              borderRadius: '8px',
              padding: '6px 10px',
              textAlign: 'center',
            }}>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#fff' }}>{perro.nombre}</p>
            </div>
          </div>

          {/* Columna derecha: datos */}
          <div style={{ flex: 1 }}>

            {/* Tabla de características */}
            <div style={{
              background: accentBg,
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '12px',
            }}>
              <p style={{ margin: '0 0 8px', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: accent }}>
                Características
              </p>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <tbody>
                  {([
                    ['Raza',      perro.raza],
                    ['Color',     perro.color],
                    ['Tamaño',    perro.tamano],
                    ['Sexo',      perro.sexo],
                    ['Microchip', perro.chip],
                  ] as [string, string | null | undefined][]).filter(([, v]) => v).map(([label, value]) => (
                    <tr key={label}>
                      <td style={{ padding: '3px 8px 3px 0', color: '#666', fontWeight: 600, width: '90px', fontSize: '12px' }}>{label}</td>
                      <td style={{ padding: '3px 0', color: '#1a1a1a', fontWeight: 700, textTransform: 'capitalize' }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Descripción */}
            {perro.descripcion && (
              <div style={{
                background: '#f9f9f9',
                borderRadius: '8px',
                padding: '10px 12px',
                marginBottom: '12px',
                borderLeft: `3px solid ${accent}`,
              }}>
                <p style={{ margin: '0 0 4px', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: accent }}>
                  Descripción
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#444', lineHeight: 1.5 }}>{perro.descripcion}</p>
              </div>
            )}

            {/* Zona/dirección */}
            {perro.direccion && (
              <div style={{
                background: '#f9f9f9',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '12px',
                color: '#555',
              }}>
                📍 <strong>Zona:</strong> {perro.direccion}
              </div>
            )}
          </div>
        </div>

        {/* Sección de contacto + QR */}
        <div style={{
          margin: '0 24px 20px',
          background: accent,
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}>
          {/* QR */}
          {qr && (
            <div style={{ flex: '0 0 auto', textAlign: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qr}
                alt="QR WhatsApp"
                style={{ width: '90px', height: '90px', borderRadius: '8px', background: '#fff', padding: '4px', display: 'block' }}
              />
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px', margin: '4px 0 0', textAlign: 'center', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                WhatsApp
              </p>
            </div>
          )}

          {/* Info contacto */}
          <div style={{ flex: 1 }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700 }}>
              Si lo encontraste, contactate
            </p>
            {nombreDuenio && (
              <p style={{ color: '#fff', fontSize: '15px', fontWeight: 800, margin: '0 0 4px' }}>{nombreDuenio}</p>
            )}
            {telefono && (
              <p style={{ color: '#fff', fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '-0.5px' }}>
                {telefono}
              </p>
            )}
          </div>

          {/* Logo Vecindog */}
          <div style={{
            flex: '0 0 auto',
            textAlign: 'center',
            opacity: 0.4,
          }}>
            <p style={{ color: '#fff', fontSize: '22px', margin: 0 }}>🐾</p>
            <p style={{ color: '#fff', fontSize: '8px', fontWeight: 700, letterSpacing: '1px', margin: '2px 0 0' }}>VECINDOG</p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: `1px solid ${accentLight}`,
          padding: '10px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <p style={{ margin: 0, fontSize: '10px', color: '#bbb' }}>
            Generado en <strong>mivecindog.com.ar</strong> · Red vecinal de mascotas · Argentina
          </p>
          <div style={{ height: '4px', width: '80px', background: accent, borderRadius: '2px' }} />
        </div>

        {/* Borde inferior */}
        <div style={{ height: '8px', background: accent }} />
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body > *:not(#cartel) { display: none !important; }
          #cartel { width: 210mm !important; margin: 0 !important; box-shadow: none !important; }
          @page { size: A4; margin: 0; }
        }
      `}</style>
    </>
  );
}

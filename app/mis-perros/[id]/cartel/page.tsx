'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { obtenerPerro, type Perro } from '@/lib/perros';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Printer } from 'lucide-react';
import QRCode from 'qrcode';

export default function CartelPage() {
  const { id }   = useParams<{ id: string }>();
  const { profile } = useAuth();

  const [perro,  setPerro]  = useState<Perro | null>(null);
  const [qr,     setQr]     = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    obtenerPerro(id).then(setPerro).finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!profile?.telefono) return;
    // Limpiar número: sacar espacios, guiones, paréntesis
    const raw = profile.telefono.replace(/\D/g, '');
    // Agregar código de país Argentina si no lo tiene
    const num = raw.startsWith('54') ? raw : `54${raw}`;
    const waUrl = `https://wa.me/${num}`;
    QRCode.toDataURL(waUrl, {
      width: 300,
      margin: 1,
      color: { dark: '#1a1a1a', light: '#ffffff' },
    }).then(setQr);
  }, [profile?.telefono]);

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

  const telefono = profile?.telefono ?? '';
  const nombreDuenio = profile ? `${profile.nombre} ${profile.apellido}` : '';

  return (
    <>
      {/* Botón imprimir — solo se ve en pantalla */}
      <div className="print:hidden flex justify-center gap-3 py-6 bg-brand-cream">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-2xl bg-brand-primary px-6 py-3 font-bold text-white shadow-soft transition hover:opacity-90"
        >
          <Printer className="h-5 w-5" /> Imprimir / Guardar PDF
        </button>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 rounded-2xl border-2 border-black/10 px-6 py-3 font-bold text-ink transition hover:bg-white"
        >
          Volver
        </button>
      </div>

      {/* ── CARTEL ── */}
      <div
        id="cartel"
        style={{
          width: '210mm',
          minHeight: '297mm',
          margin: '0 auto',
          background: '#fff',
          fontFamily: 'Georgia, serif',
          padding: '12mm',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Header rojo */}
        <div style={{
          background: '#EE5A3B',
          borderRadius: '12px',
          padding: '16px 24px',
          textAlign: 'center',
          marginBottom: '16px',
        }}>
          <p style={{ color: '#fff', fontSize: '13px', fontWeight: 700, margin: 0, letterSpacing: '3px', textTransform: 'uppercase' }}>
            🐾 Vecindog
          </p>
          <h1 style={{ color: '#fff', fontSize: '42px', fontWeight: 900, margin: '4px 0 0', letterSpacing: '-1px', fontFamily: 'Arial Black, sans-serif' }}>
            SE PERDIÓ
          </h1>
        </div>

        {/* Foto + datos */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          {/* Foto */}
          <div style={{ flex: '0 0 auto', width: '180px' }}>
            {perro.foto_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={perro.foto_url}
                alt={perro.nombre}
                style={{
                  width: '180px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  border: '3px solid #EE5A3B',
                }}
              />
            ) : (
              <div style={{
                width: '180px', height: '200px',
                background: '#FFF0EB',
                borderRadius: '12px',
                border: '3px solid #EE5A3B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '60px',
              }}>🐶</div>
            )}
          </div>

          {/* Datos del perro */}
          <div style={{ flex: 1 }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: 900,
              color: '#1a1a1a',
              margin: '0 0 8px',
              fontFamily: 'Arial Black, sans-serif',
            }}>{perro.nombre}</h2>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              {[
                ['Raza',      perro.raza],
                ['Color',     perro.color],
                ['Tamaño',    perro.tamano],
                ['Sexo',      perro.sexo],
              ].filter(([, v]) => v).map(([label, value]) => (
                <tr key={label as string} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '5px 8px 5px 0', color: '#888', fontWeight: 600, width: '80px' }}>{label}</td>
                  <td style={{ padding: '5px 0', color: '#1a1a1a', fontWeight: 700, textTransform: 'capitalize' }}>{value}</td>
                </tr>
              ))}
            </table>

            {perro.descripcion && (
              <p style={{
                marginTop: '10px',
                fontSize: '13px',
                color: '#555',
                lineHeight: 1.5,
                background: '#FFF8F6',
                borderLeft: '3px solid #EE5A3B',
                padding: '8px 10px',
                borderRadius: '0 8px 8px 0',
              }}>
                {perro.descripcion}
              </p>
            )}
          </div>
        </div>

        {/* Zona */}
        {perro.direccion && (
          <div style={{
            background: '#FFF8F6',
            borderRadius: '10px',
            padding: '10px 14px',
            marginBottom: '16px',
            fontSize: '14px',
            color: '#555',
          }}>
            📍 <strong>Zona:</strong> {perro.direccion}
          </div>
        )}

        {/* Contacto + QR */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          background: '#1a1a1a',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '16px',
        }}>
          {/* QR */}
          {qr && (
            <div style={{ flex: '0 0 auto', textAlign: 'center' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qr} alt="QR WhatsApp" style={{ width: '100px', height: '100px', borderRadius: '8px' }} />
              <p style={{ color: '#aaa', fontSize: '10px', margin: '4px 0 0', textAlign: 'center' }}>Escaneame</p>
            </div>
          )}
          {/* Texto contacto */}
          <div style={{ flex: 1 }}>
            <p style={{ color: '#aaa', fontSize: '12px', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Contacto</p>
            {nombreDuenio && (
              <p style={{ color: '#fff', fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>{nombreDuenio}</p>
            )}
            {telefono && (
              <p style={{ color: '#EE5A3B', fontSize: '22px', fontWeight: 900, margin: 0, fontFamily: 'Arial Black, sans-serif' }}>
                📱 {telefono}
              </p>
            )}
            <p style={{ color: '#888', fontSize: '11px', margin: '6px 0 0' }}>
              Escanear QR para contactar por WhatsApp
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <p style={{ color: '#bbb', fontSize: '11px', margin: 0 }}>
            Publicado en <strong>mivecindog.com.ar</strong> · Red vecinal de mascotas
          </p>
        </div>
      </div>

      {/* Estilos de impresión */}
      <style>{`
        @media print {
          body { margin: 0; }
          #cartel {
            width: 210mm !important;
            margin: 0 !important;
            padding: 12mm !important;
            box-shadow: none !important;
          }
          @page { size: A4; margin: 0; }
        }
      `}</style>
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { type Perro } from '@/lib/perros';
import { type Profile } from '@/contexts/AuthContext';
import QRCode from 'qrcode';

interface Props {
  perro:   Perro;
  profile: Profile | null;
  perdido: boolean;
}

export default function PerroDocumento({ perro, profile, perdido }: Props) {
  const [qr, setQr] = useState('');

  const accent      = perdido ? '#dc2626' : '#1e3a5f';
  const accentBg    = perdido ? '#fef2f2' : '#eff6ff';
  const accentLight = perdido ? '#fee2e2' : '#dbeafe';

  useEffect(() => {
    if (!profile?.telefono) return;
    const raw = profile.telefono.replace(/\D/g, '');
    const num = raw.startsWith('54') ? raw : `54${raw}`;
    QRCode.toDataURL(`https://wa.me/${num}`, {
      width: 300,
      margin: 1,
      color: { dark: accent, light: '#ffffff' },
    }).then(setQr);
  }, [profile?.telefono, accent]);

  const telefono    = profile?.telefono ?? '';
  const nombreDuenio = profile ? `${profile.nombre} ${profile.apellido}` : '';

  return (
    <div
      className="overflow-hidden rounded-2xl shadow-card ring-1 ring-black/5"
      style={{ background: '#fff', fontFamily: 'Arial, sans-serif' }}
    >
      {/* Borde superior */}
      <div style={{ height: '6px', background: accent }} />

      {/* Header */}
      <div style={{
        padding: '14px 18px 12px',
        borderBottom: `1.5px solid ${accentLight}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}>
        <div>
          <p style={{ margin: 0, fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#aaa' }}>
            Vecindog · mivecindog.com.ar
          </p>
          <p style={{ margin: '2px 0 0', fontSize: perdido ? '18px' : '14px', fontWeight: 900, color: accent, letterSpacing: '-0.3px' }}>
            {perdido ? '⚠ SE BUSCA — PERRO PERDIDO' : 'IDENTIFICACIÓN DE MASCOTA'}
          </p>
        </div>
        <div style={{
          background: accent, color: '#fff', borderRadius: '6px',
          padding: '4px 10px', fontSize: '10px', fontWeight: 800,
          textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap',
        }}>
          {perdido ? 'PERDIDO' : 'REGISTRADO'}
        </div>
      </div>

      {/* Cuerpo */}
      <div style={{ padding: '14px 18px', display: 'flex', gap: '14px' }}>

        {/* Foto */}
        <div style={{ flex: '0 0 auto', width: '120px' }}>
          {perro.foto_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={perro.foto_url}
              alt={perro.nombre}
              style={{ width: '120px', height: '140px', objectFit: 'cover', borderRadius: '8px', border: `2.5px solid ${accent}`, display: 'block' }}
            />
          ) : (
            <div style={{ width: '120px', height: '140px', background: accentBg, borderRadius: '8px', border: `2px solid ${accentLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '44px' }}>
              🐶
            </div>
          )}
          {/* Nombre */}
          <div style={{ marginTop: '6px', background: accent, borderRadius: '6px', padding: '4px 8px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '15px', fontWeight: 900, color: '#fff' }}>{perro.nombre}</p>
          </div>
        </div>

        {/* Datos */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ background: accentBg, borderRadius: '8px', padding: '10px 12px', marginBottom: '10px' }}>
            <p style={{ margin: '0 0 6px', fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: accent }}>Características</p>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <tbody>
                {([
                  ['Raza',      perro.raza],
                  ['Color',     perro.color],
                  ['Tamaño',    perro.tamano],
                  ['Sexo',      perro.sexo],
                  ['Chip',      perro.chip],
                ] as [string, string | null | undefined][]).filter(([, v]) => v).map(([label, value]) => (
                  <tr key={label}>
                    <td style={{ padding: '2px 6px 2px 0', color: '#666', fontWeight: 600, width: '70px', fontSize: '11px' }}>{label}</td>
                    <td style={{ padding: '2px 0', color: '#1a1a1a', fontWeight: 700, textTransform: 'capitalize', fontSize: '12px' }}>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {perro.descripcion && (
            <div style={{ background: '#f9f9f9', borderRadius: '6px', padding: '8px 10px', borderLeft: `3px solid ${accent}` }}>
              <p style={{ margin: 0, fontSize: '11px', color: '#555', lineHeight: 1.5 }}>{perro.descripcion}</p>
            </div>
          )}
        </div>
      </div>

      {/* Contacto + QR */}
      <div style={{ margin: '0 18px 14px', background: accent, borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        {qr && (
          <div style={{ flex: '0 0 auto', textAlign: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="QR" style={{ width: '70px', height: '70px', borderRadius: '6px', background: '#fff', padding: '3px', display: 'block' }} />
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '8px', margin: '3px 0 0', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>WhatsApp</p>
          </div>
        )}
        <div style={{ flex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '9px', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700 }}>
            {perdido ? 'Si lo encontraste, contactate' : 'Contacto del dueño'}
          </p>
          {nombreDuenio && <p style={{ color: '#fff', fontSize: '13px', fontWeight: 800, margin: '0 0 2px' }}>{nombreDuenio}</p>}
          {telefono && <p style={{ color: '#fff', fontSize: '18px', fontWeight: 900, margin: 0 }}>{telefono}</p>}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '18px', margin: 0, flex: '0 0 auto' }}>🐾</p>
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${accentLight}`, padding: '8px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0, fontSize: '9px', color: '#ccc' }}>mivecindog.com.ar · Red vecinal de mascotas</p>
        <div style={{ height: '3px', width: '50px', background: accent, borderRadius: '2px' }} />
      </div>

      {/* Borde inferior */}
      <div style={{ height: '6px', background: accent }} />
    </div>
  );
}

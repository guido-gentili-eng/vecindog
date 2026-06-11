import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function esc(s: string): string {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
}

export async function POST(req: NextRequest) {
  const { perroId, mensaje: rawMensaje, contacto: rawContacto } = await req.json();
  // Sanitizar inputs para evitar XSS en el email
  const mensaje  = rawMensaje  ? String(rawMensaje).slice(0, 1000)  : '';
  const contacto = rawContacto ? String(rawContacto).slice(0, 200) : '';

  if (!perroId) {
    return NextResponse.json({ error: 'perroId requerido' }, { status: 400 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Obtener perro y dueño
  const { data: perro } = await admin
    .from('perros')
    .select('id, nombre, user_id, foto_url')
    .eq('id', perroId)
    .single();

  if (!perro) {
    return NextResponse.json({ error: 'Perro no encontrado' }, { status: 404 });
  }

  const { data: userData } = await admin.auth.admin.getUserById(perro.user_id);
  const email = userData?.user?.email;

  const { data: profile } = await admin
    .from('profiles')
    .select('nombre')
    .eq('id', perro.user_id)
    .single();

  const nombreDuenio = profile?.nombre ?? 'dueño';
  const mensajeNotif = contacto
    ? `📍 Alguien encontró a ${perro.nombre}. Mensaje: "${mensaje || 'Sin mensaje'}". Contacto: ${contacto}`
    : `📍 Alguien encontró a ${perro.nombre}. Mensaje: "${mensaje || 'Sin mensaje'}"`;

  // Notificación in-app
  await admin.from('notifications').insert({
    user_id: perro.user_id,
    post_id: null,
    tipo: 'perro_encontrado',
    mensaje: mensajeNotif,
    leida: false,
  });

  // Email al dueño
  if (email) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Vecindog <noreply@mivecindog.com.ar>',
        to: [email],
        subject: `🐾 ¡Alguien encontró a ${perro.nombre}!`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;">
            <div style="background:#3F8B5C;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px;">
              <img src="https://www.mivecindog.com.ar/logo.svg" alt="Vecindog" width="160" height="40" style="display:block;margin:0 auto;" />
            </div>
            <h2 style="color:#1a1a1a;">Hola ${nombreDuenio},</h2>
            <p style="color:#555;font-size:16px;line-height:1.6;">
              ¡Buenas noticias! Alguien escaneó el QR del collar de
              <strong>${perro.nombre}</strong> y nos avisó que lo encontró.
            </p>
            ${mensaje ? `
            <div style="background:#F0FFF7;border-radius:12px;padding:16px;margin:16px 0;border-left:4px solid #3F8B5C;">
              <p style="margin:0;font-size:15px;color:#1a1a1a;">💬 <strong>Mensaje:</strong> ${esc(mensaje)}</p>
              ${contacto ? `<p style="margin:8px 0 0;font-size:15px;color:#1a1a1a;">📞 <strong>Contacto:</strong> ${esc(contacto)}</p>` : ''}
            </div>` : ''}
            <p style="color:#555;font-size:15px;">
              Revisá las notificaciones en la app para más detalles.
            </p>
            <div style="text-align:center;margin-top:24px;">
              <a href="https://www.mivecindog.com.ar/mis-perros/${perro.id}"
                 style="background:#3F8B5C;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:15px;">
                Ver perfil de ${perro.nombre}
              </a>
            </div>
            <p style="color:#aaa;font-size:12px;margin-top:32px;text-align:center;">
              Vecindog — mivecindog.com.ar
            </p>
          </div>
        `,
      }),
    });
  }

  return NextResponse.json({ ok: true });
}

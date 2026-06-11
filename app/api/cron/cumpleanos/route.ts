import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Corre todos los días a las 8am (configurado en vercel.json)
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  const hoyMD = `${mes}-${dia}`; // "MM-DD"

  // Buscar perros que cumplen años hoy (comparar mes-día de fecha_nac)
  // Usamos LIKE en el formato YYYY-MM-DD: busca cualquier año con el mismo MM-DD
  const { data: perros } = await admin
    .from('perros')
    .select('id, nombre, fecha_nac, user_id, foto_url')
    .like('fecha_nac', `%-${hoyMD}`);

  if (!perros || perros.length === 0) {
    return NextResponse.json({ ok: true, procesados: 0 });
  }

  let enviados = 0;

  for (const perro of perros) {
    if (!perro.fecha_nac) continue;

    const anioNac = parseInt(perro.fecha_nac.slice(0, 4));
    const edad = hoy.getFullYear() - anioNac;

    // Notificación in-app (una por día) — buscamos por perro.id para evitar
    // falsos positivos con nombres que son substring de otros (ej: "Toto" vs "Totona")
    const hoyStr = hoy.toISOString().slice(0, 10);
    const { data: existente } = await admin
      .from('notifications')
      .select('id')
      .eq('user_id', perro.user_id)
      .eq('tipo', 'cumpleanos')
      .ilike('mensaje', `%[${perro.id}]%`)
      .gte('created_at', hoyStr)
      .limit(1);

    if (!existente || existente.length === 0) {
      await admin.from('notifications').insert({
        user_id: perro.user_id,
        post_id: null,
        tipo: 'cumpleanos',
        // El [perro.id] al final permite deduplicación exacta sin depender del nombre
        mensaje: `🎂 ¡Hoy cumple ${edad} año${edad === 1 ? '' : 's'} ${perro.nombre}! Feliz cumpleaños. [${perro.id}]`,
        leida: false,
      });
    }

    // Email al dueño
    const { data: userData } = await admin.auth.admin.getUserById(perro.user_id);
    const email = userData?.user?.email;
    if (!email) continue;

    const { data: profile } = await admin
      .from('profiles')
      .select('nombre')
      .eq('id', perro.user_id)
      .single();

    const saludo = profile?.nombre ? `Hola ${profile.nombre},` : 'Hola,';

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Vecindog <noreply@mivecindog.com.ar>',
        to: [email],
        subject: `🎂 ¡Feliz cumpleaños ${perro.nombre}!`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;">
            <div style="background:#EE5A3B;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px;">
              <img src="https://www.mivecindog.com.ar/logo.svg" alt="Vecindog" width="160" height="40" style="display:block;margin:0 auto;" />
            </div>
            <h2 style="color:#1a1a1a;">${saludo}</h2>
            <p style="color:#555;font-size:16px;line-height:1.6;">
              ¡Hoy es un día especial! <strong>${perro.nombre}</strong> cumple
              <strong>${edad} año${edad === 1 ? '' : 's'}</strong>. 🎂🎉
            </p>
            ${perro.foto_url ? `
            <div style="text-align:center;margin:20px 0;">
              <img src="${perro.foto_url}" alt="${perro.nombre}"
                style="width:160px;height:160px;border-radius:50%;object-fit:cover;border:4px solid #EE5A3B;" />
            </div>` : ''}
            <p style="color:#555;font-size:15px;">
              ¡Celebralo con un mimo especial, una golosina o un paseo extra! 🦴
            </p>
            <div style="text-align:center;margin-top:24px;">
              <a href="https://www.mivecindog.com.ar/mis-perros/${perro.id}"
                 style="background:#EE5A3B;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:15px;">
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

    if (res.ok) enviados++;
  }

  return NextResponse.json({ ok: true, procesados: perros.length, enviados });
}

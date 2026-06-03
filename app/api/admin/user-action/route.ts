import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAIL = 'guido-gentili@live.com.ar';

const EMAIL_PAUSA = (nombre: string) => `
  <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
    <div style="background:#1e3a5f;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px">
      <h1 style="color:white;margin:0;font-size:22px">🐾 Vecindog</h1>
    </div>
    <h2 style="color:#1a1a1a">Hola${nombre ? ` ${nombre}` : ''},</h2>
    <p style="color:#555;font-size:16px;line-height:1.7">
      Queremos informarte que tu cuenta en Vecindog se encuentra temporalmente <strong>en revisión</strong> por parte de nuestro equipo.
    </p>
    <div style="background:#FFF8F0;border-left:4px solid #EE5A3B;border-radius:12px;padding:16px;margin:20px 0">
      <p style="margin:0;color:#555;font-size:15px">
        Estamos evaluando tu situación y nos comunicaremos con vos a la brevedad para darte más detalles.
        Este proceso suele resolverse en menos de 48 horas.
      </p>
    </div>
    <p style="color:#555;font-size:15px;line-height:1.7">
      Si creés que esto es un error o querés más información, podés escribirnos directamente:
    </p>
    <div style="text-align:center;margin:24px 0">
      <a href="mailto:hola@mivecindog.com.ar"
         style="background:#EE5A3B;color:white;padding:12px 28px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:15px;display:inline-block">
        Contactar al equipo
      </a>
    </div>
    <p style="color:#aaa;font-size:12px;text-align:center;margin-top:32px">
      Vecindog · <a href="https://www.mivecindog.com.ar" style="color:#EE5A3B">mivecindog.com.ar</a>
    </p>
  </div>
`;

export async function POST(req: NextRequest) {
  const token = req.headers.get('Authorization')?.slice(7);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const anon = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user: adminUser } } = await anon.auth.getUser(token);
  if (adminUser?.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { uid, accion } = await req.json() as { uid: string; accion: 'pausar' | 'reactivar' | 'eliminar' };
  if (!uid || !['pausar', 'reactivar', 'eliminar'].includes(accion)) {
    return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (accion === 'eliminar') {
    const { error } = await admin.auth.admin.deleteUser(uid);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (accion === 'pausar') {
    await admin.from('profiles').update({ suspendido: true }).eq('id', uid);

    // Email de notificación al usuario
    const { data: profileData } = await admin.from('profiles').select('nombre').eq('id', uid).single();
    const { data: authData }    = await admin.auth.admin.getUserById(uid);
    const email   = authData?.user?.email;
    const nombre  = profileData?.nombre ?? '';

    if (email) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from:    'Vecindog <noreply@mivecindog.com.ar>',
          to:      [email],
          subject: 'Tu cuenta en Vecindog está siendo revisada',
          html:    EMAIL_PAUSA(nombre),
        }),
      });
    }
    return NextResponse.json({ ok: true });
  }

  if (accion === 'reactivar') {
    await admin.from('profiles').update({ suspendido: false }).eq('id', uid);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Acción desconocida' }, { status: 400 });
}

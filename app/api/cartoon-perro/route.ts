import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: { user } } = await admin.auth.getUser(token);
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const { data: profile } = await admin
      .from('profiles')
      .select('plan, plan_vencimiento')
      .eq('id', user.id)
      .single();
    const hoy = new Date().toISOString().slice(0, 10);
    const isPro = profile?.plan === 'pro' &&
      (!profile?.plan_vencimiento || profile.plan_vencimiento >= hoy);
    const adminEmail = process.env.ADMIN_EMAIL ?? '';
    if (!isPro && user.email !== adminEmail) {
      return NextResponse.json({ error: 'Función exclusiva de VecindogPro' }, { status: 403 });
    }

    const body = await req.json();
    const { foto_url, style: styleInput, perro_id } = body;
    if (!foto_url || typeof foto_url !== 'string') {
      return NextResponse.json({ error: 'foto_url requerida' }, { status: 400 });
    }

    const VALID_STYLES = ['3D', 'Emoji', 'Video game', 'Pixels', 'Clay', 'Toy'];
    const style = VALID_STYLES.includes(styleInput) ? styleInput : '3D';

    if (perro_id && user.email !== adminEmail) {
      const { data: perroData } = await admin
        .from('perros').select('cartoon_generado_at').eq('id', perro_id).single();
      if (perroData?.cartoon_generado_at) {
        const generadoAt = new Date(perroData.cartoon_generado_at);
        const ahora = new Date();
        if (generadoAt.getFullYear() === ahora.getFullYear() && generadoAt.getMonth() === ahora.getMonth()) {
          return NextResponse.json(
            { error: 'Ya generaste un avatar este mes para este perro. Volvé el mes que viene 🐾' },
            { status: 429 }
          );
        }
      }
    }

    const STYLE_PROMPTS: Record<string, string> = {
      '3D':         'turn this dog into an anthropomorphic Pixar 3D cartoon character wearing cool sunglasses and a hoodie, big happy smile, vivid colors, fun and confident',
      'Clay':       'turn this dog into a Claymation character wearing tiny sunglasses and a cap, big happy smile, colorful clay texture, cute and fun',
      'Toy':        'turn this dog into a collectible vinyl toy figure wearing sunglasses and a jacket, big happy smile, street art style, bold vivid colors',
      'Pixels':     'turn this dog into a 16-bit pixel art retro game character wearing pixel sunglasses and a cap, big happy smile, vibrant pixel colors',
      'Video game': 'turn this dog into an RPG video game hero wearing sunglasses and a stylish outfit, big confident happy smile, epic heroic pose',
      'Emoji':      'turn this dog into a fun emoji sticker wearing sunglasses, huge happy smile, party vibe, flat bold cartoon style, expressive and funny',
    };

    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) return NextResponse.json({ error: 'REPLICATE_API_TOKEN no configurado' }, { status: 500 });

    // flux-kontext-apps/cartoonify — img2img cartoon
    const res = await fetch('https://api.replicate.com/v1/models/flux-kontext-apps/cartoonify/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait=55',
      },
      body: JSON.stringify({
        input: {
          input_image: foto_url,
          prompt:      STYLE_PROMPTS[style] ?? STYLE_PROMPTS['3D'],
        },
      }),
    });

    const prediction = await res.json();

    if (!res.ok) {
      console.error('[cartoon-perro] error:', res.status, JSON.stringify(prediction));
      return NextResponse.json({ error: `Error ${res.status}: ${prediction?.detail || prediction?.error || JSON.stringify(prediction)}` }, { status: 500 });
    }

    if (prediction.status === 'succeeded' && prediction.output) {
      const outputUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
      // Marcar cupo solo cuando hay imagen real
      if (perro_id) {
        await admin.from('perros').update({ cartoon_generado_at: new Date().toISOString() }).eq('id', perro_id);
      }
      return NextResponse.json({ ok: true, url: outputUrl, prediction_id: prediction.id });
    }

    // Pendiente — el cupo se marca desde el GET de polling cuando termina exitosamente
    if (prediction.id) {
      return NextResponse.json({ ok: false, pending: true, prediction_id: prediction.id, perro_id: perro_id ?? null });
    }

    return NextResponse.json({ error: 'Respuesta inesperada de Replicate' }, { status: 500 });

  } catch (e) {
    console.error('[cartoon-perro]', e);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const id      = req.nextUrl.searchParams.get('id');
  const perroId = req.nextUrl.searchParams.get('perro_id');
  if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 });

  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: { user } } = await admin.auth.getUser(token);
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) return NextResponse.json({ error: 'Sin API token' }, { status: 500 });

  const res = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
    headers: { 'Authorization': `Bearer ${apiToken}` },
  });

  if (!res.ok) return NextResponse.json({ error: 'Error consultando estado' }, { status: 500 });

  const prediction = await res.json();

  if (prediction.status === 'succeeded' && prediction.output) {
    const outputUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
    // Marcar cupo solo al confirmar éxito desde polling
    if (perroId) {
      await admin.from('perros').update({ cartoon_generado_at: new Date().toISOString() }).eq('id', perroId);
    }
    return NextResponse.json({ ok: true, url: outputUrl });
  }

  if (prediction.status === 'failed') {
    return NextResponse.json({ error: 'Falló la generación' }, { status: 500 });
  }

  return NextResponse.json({ ok: false, pending: true, status: prediction.status });
}

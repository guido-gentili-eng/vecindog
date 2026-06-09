import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 60; // Vercel Pro: hasta 60s

export async function POST(req: NextRequest) {
  try {
    // ── Auth ─────────────────────────────────────────────────────────
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: { user } } = await admin.auth.getUser(token);
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    // ── Verificar plan Pro ────────────────────────────────────────────
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

    // ── Input ─────────────────────────────────────────────────────────
    const body = await req.json();
    const { foto_url, style: styleInput, perro_id } = body;
    if (!foto_url || typeof foto_url !== 'string') {
      return NextResponse.json({ error: 'foto_url requerida' }, { status: 400 });
    }

    const VALID_STYLES = ['3D', 'Emoji', 'Video game', 'Pixels', 'Clay', 'Toy'];
    const style = VALID_STYLES.includes(styleInput) ? styleInput : '3D';

    // ── Límite: 1 avatar por perro por mes (admin lo saltea) ─────────
    if (perro_id && user.email !== adminEmail) {
      const { data: perroData } = await admin
        .from('perros')
        .select('cartoon_generado_at')
        .eq('id', perro_id)
        .single();
      if (perroData?.cartoon_generado_at) {
        const generadoAt = new Date(perroData.cartoon_generado_at);
        const ahora      = new Date();
        if (
          generadoAt.getFullYear() === ahora.getFullYear() &&
          generadoAt.getMonth()    === ahora.getMonth()
        ) {
          return NextResponse.json(
            { error: 'Ya generaste un avatar este mes para este perro. Volvé el mes que viene 🐾' },
            { status: 429 }
          );
        }
      }
    }

    // ── Prompts por estilo — perros humanizados y cancheros ──────────
    const STYLE_PROMPTS: Record<string, string> = {
      '3D':         'anthropomorphic cool dog wearing stylish sunglasses, big happy smile, thumbs up, wearing a hoodie or jacket, Pixar 3D style, vivid colors, fun personality, confident pose, humanized dog character',
      'Clay':       'anthropomorphic cool dog made of colorful clay, wearing tiny sunglasses, big goofy happy smile, fun clay texture, humanized dog wearing a cap, Claymation style, bright studio lighting',
      'Toy':        'anthropomorphic cool dog toy figurine, wearing sunglasses and a jacket, big happy smile, collectible vinyl toy style, street art character, cool pose, vivid colors',
      'Pixels':     'anthropomorphic cool pixel art dog, wearing pixel sunglasses and a cap, big happy smile, 16-bit retro game character, humanized dog with accessories, vibrant pixel colors, fun expression',
      'Video game': 'anthropomorphic cool dog video game character, wearing sunglasses and stylish outfit, big confident happy smile, RPG character art style, humanized dog hero, detailed vibrant colors, epic pose',
      'Emoji':      'anthropomorphic cool dog emoji sticker, wearing sunglasses, huge happy smile, party vibe, humanized dog with fun accessories, flat bold cartoon style, expressive and funny',
    };

    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json({ error: 'REPLICATE_API_TOKEN no configurado' }, { status: 500 });
    }

    // ── Llamar a Replicate — stability-ai/sdxl (img2img) ────────────
    const res = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait=55',
      },
      body: JSON.stringify({
        model: 'stability-ai/sdxl',
        input: {
          image:               foto_url,
          prompt:              STYLE_PROMPTS[style] ?? STYLE_PROMPTS['3D'],
          negative_prompt:     'sad, angry, scared, blurry, low quality, ugly, plain, boring, serious, human face, person',
          prompt_strength:     0.8,
          num_outputs:         1,
          num_inference_steps: 25,
          guidance_scale:      7.5,
          output_format:       'png',
        },
      }),
    });

    const prediction = await res.json();

    if (!res.ok) {
      console.error('[cartoon-perro] Replicate error:', res.status, JSON.stringify(prediction));
      return NextResponse.json({ error: `Error ${res.status}: ${JSON.stringify(prediction)}` }, { status: 500 });
    }

    // ── Marcar uso del mes ────────────────────────────────────────────
    if (perro_id) {
      admin.from('perros').update({ cartoon_generado_at: new Date().toISOString() }).eq('id', perro_id).then();
    }

    // Si ya terminó sincrónicamente
    if (prediction.status === 'succeeded' && prediction.output) {
      const outputUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
      return NextResponse.json({ ok: true, url: outputUrl, prediction_id: prediction.id });
    }

    // Si sigue procesando, devolvemos el id para polling
    if (prediction.id) {
      return NextResponse.json({ ok: false, pending: true, prediction_id: prediction.id });
    }

    return NextResponse.json({ error: 'Respuesta inesperada de Replicate' }, { status: 500 });

  } catch (e) {
    console.error('[cartoon-perro]', e);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

// Polling de estado
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
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
    return NextResponse.json({ ok: true, url: outputUrl });
  }

  if (prediction.status === 'failed') {
    return NextResponse.json({ error: 'Falló la generación' }, { status: 500 });
  }

  return NextResponse.json({ ok: false, pending: true, status: prediction.status });
}

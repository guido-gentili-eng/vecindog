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
    const { foto_url, style: styleInput } = body;
    if (!foto_url || typeof foto_url !== 'string') {
      return NextResponse.json({ error: 'foto_url requerida' }, { status: 400 });
    }

    const VALID_STYLES = ['3D', 'Emoji', 'Video game', 'Pixels', 'Clay', 'Toy'];
    const style = VALID_STYLES.includes(styleInput) ? styleInput : '3D';

    // Prompts específicos por estilo para mejores resultados
    const STYLE_PROMPTS: Record<string, string> = {
      '3D':         'a 3D cartoon dog, happy smiling joyful expression, bright cheerful eyes, cute, adorable, vivid colors, Pixar style',
      'Clay':       'a clay sculpture dog, happy smiling, colorful clay texture, cute, adorable, studio lighting',
      'Toy':        'a toy figurine dog, happy smiling, plastic toy style, cute, collectible, bright colors',
      'Pixels':     'a pixel art dog, happy smiling, retro game style, 16-bit, cute, colorful pixels',
      'Video game': 'a video game character dog, happy smiling, game art style, cute, detailed, vibrant colors',
      'Emoji':      'a cute emoji sticker dog, happy smiling, flat cartoon style, expressive, bright colors',
    };

    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json({ error: 'REPLICATE_API_TOKEN no configurado' }, { status: 500 });
    }

    // ── Llamar a Replicate (endpoint directo — siempre usa latest) ────
    const res = await fetch('https://api.replicate.com/v1/models/fofr/face-to-many/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait=55',
      },
      body: JSON.stringify({
        input: {
          image:                foto_url,
          style:                style,
          prompt:               STYLE_PROMPTS[style] ?? STYLE_PROMPTS['3D'],
          negative_prompt:      'sad, angry, scared, blurry, low quality, ugly, human, person',
          number_of_images:     1,
          output_format:        'png',
          guidance_scale:       7.5,
          ip_adapter_weight:    0.8,
          shape_match_strength: 1,
        },
      }),
    });

    const prediction = await res.json();

    if (!res.ok) {
      console.error('[cartoon-perro] Replicate error:', res.status, JSON.stringify(prediction));
      return NextResponse.json({ error: `Replicate: ${prediction?.detail || prediction?.error || res.status}` }, { status: 500 });
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

  // Auth check
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

  // Still processing
  return NextResponse.json({ ok: false, pending: true, status: prediction.status });
}

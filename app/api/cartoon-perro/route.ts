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

    // ── Input ─────────────────────────────────────────────────────────
    const { foto_url } = await req.json();
    if (!foto_url || typeof foto_url !== 'string') {
      return NextResponse.json({ error: 'foto_url requerida' }, { status: 400 });
    }

    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) {
      return NextResponse.json({ error: 'REPLICATE_API_TOKEN no configurado' }, { status: 500 });
    }

    // ── Obtener la versión más reciente del modelo ────────────────────
    // stability-ai/stable-diffusion-img2img: preserva la imagen y aplica estilo
    const MODEL_OWNER = 'stability-ai';
    const MODEL_NAME  = 'stable-diffusion-img2img';

    const modelRes = await fetch(
      `https://api.replicate.com/v1/models/${MODEL_OWNER}/${MODEL_NAME}`,
      { headers: { 'Authorization': `Bearer ${apiToken}` } }
    );
    if (!modelRes.ok) {
      const t = await modelRes.text();
      return NextResponse.json({ error: `No se pudo obtener el modelo: ${t}` }, { status: 500 });
    }
    const modelData = await modelRes.json();
    const version = modelData?.latest_version?.id;
    if (!version) {
      return NextResponse.json({ error: 'No se encontró versión del modelo' }, { status: 500 });
    }

    // ── Llamar a Replicate ────────────────────────────────────────────
    const res = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait=55',
      },
      body: JSON.stringify({
        version,
        input: {
          image:            foto_url,
          prompt:           'cute cartoon dog illustration, pixar style, disney style, colorful, friendly, detailed face, same dog breed and color as the photo',
          negative_prompt:  'ugly, blurry, low quality, multiple dogs, distorted, extra limbs, bad anatomy',
          prompt_strength:  0.55,
          guidance_scale:   8,
          num_inference_steps: 30,
          scheduler:        'K_EULER',
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

    // Si sigue procesando, devolvemos el id para que el cliente haga polling
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

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

    // ── Llamar a Replicate (Prefer: wait = respuesta sincrónica) ──────
    const res = await fetch('https://api.replicate.com/v1/models/catacolabs/cartoonify/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait=55', // espera hasta 55s por resultado
      },
      body: JSON.stringify({
        input: { image: foto_url },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[cartoon-perro] Replicate error:', res.status, errText);
      return NextResponse.json({ error: 'Error al generar la caricatura' }, { status: 500 });
    }

    const prediction = await res.json();

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

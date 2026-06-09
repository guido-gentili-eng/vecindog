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
      '3D':         'turn this dog into an anthropomorphic 3D Pixar cartoon character wearing cool sunglasses and a hoodie, big happy smile, thumbs up, vivid colors, fun and confident',
      'Clay':       'turn this dog into a Claymation character wearing tiny sunglasses and a cap, big goofy happy smile, colorful clay texture, bright studio lighting, fun and cute',
      'Toy':        'turn this dog into a collectible vinyl toy figure wearing sunglasses and a jacket, big happy smile, street art style, bold vivid colors, cool pose',
      'Pixels':     'turn this dog into a 16-bit pixel art retro game character wearing pixel sunglasses and a cap, big happy smile, vibrant pixel colors, fun retro expression',
      'Video game': 'turn this dog into an RPG video game hero character wearing sunglasses and a stylish outfit, big confident happy smile, detailed vibrant colors, epic heroic pose',
      'Emoji':      'turn this dog into a fun emoji sticker character wearing sunglasses, huge happy smile, party vibe, flat bold cartoon style, expressive and funny',
    };

    const hfToken = process.env.HF_TOKEN;
    if (!hfToken) {
      return NextResponse.json({ error: 'HF_TOKEN no configurado' }, { status: 500 });
    }

    // ── Descargar la foto del perro ───────────────────────────────────
    const imageRes = await fetch(foto_url);
    if (!imageRes.ok) {
      return NextResponse.json({ error: 'No se pudo descargar la foto del perro' }, { status: 400 });
    }
    const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
    const base64Image = imageBuffer.toString('base64');

    // ── Llamar a Hugging Face — instruct-pix2pix (gratis) ────────────
    const hfRes = await fetch(
      'https://api-inference.huggingface.co/models/timbrooks/instruct-pix2pix',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: base64Image,
          parameters: {
            prompt:               STYLE_PROMPTS[style] ?? STYLE_PROMPTS['3D'],
            negative_prompt:      'sad, angry, scared, blurry, low quality, ugly, plain, boring, serious',
            num_inference_steps:  25,
            guidance_scale:       7.5,
            image_guidance_scale: 1.5,
          },
        }),
      }
    );

    if (!hfRes.ok) {
      const errText = await hfRes.text().catch(() => String(hfRes.status));
      console.error('[cartoon-perro] HF error:', hfRes.status, errText);
      if (hfRes.status === 503) {
        return NextResponse.json(
          { error: 'El modelo está cargando, esperá 30 segundos e intentá de nuevo' },
          { status: 503 }
        );
      }
      return NextResponse.json({ error: `Error generando el avatar (${hfRes.status})` }, { status: 500 });
    }

    // ── Respuesta es imagen binaria — subir a Supabase storage ───────
    const imgBuffer = Buffer.from(await hfRes.arrayBuffer());
    const storagePath = `caricaturas/${perro_id ?? 'tmp'}-${Date.now()}.png`;
    const { error: upErr } = await admin.storage
      .from('posts')
      .upload(storagePath, imgBuffer, { upsert: true, contentType: 'image/png' });

    if (upErr) {
      console.error('[cartoon-perro] storage upload error:', upErr);
      return NextResponse.json({ error: 'Error guardando la imagen' }, { status: 500 });
    }

    const { data: urlData } = admin.storage.from('posts').getPublicUrl(storagePath);
    const finalUrl = urlData.publicUrl;

    // ── Marcar uso del mes y guardar URL ─────────────────────────────
    if (perro_id) {
      admin.from('perros').update({
        cartoon_generado_at: new Date().toISOString(),
        cartoon_url: finalUrl,
      }).eq('id', perro_id).then();
    }

    return NextResponse.json({ ok: true, url: finalUrl });

  } catch (e) {
    console.error('[cartoon-perro]', e);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

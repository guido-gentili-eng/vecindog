import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    // Verificar auth y plan Pro
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

    if (!isPro && user.email !== 'guido-gentili@live.com.ar') {
      return NextResponse.json({ error: 'Función exclusiva de VecindogPro' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('foto') as File | null;
    if (!file) return NextResponse.json({ error: 'No se recibió foto' }, { status: 400 });

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'La foto es demasiado grande (máx 5MB)' }, { status: 400 });
    }

    const bytes  = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mime   = (file.type as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif') || 'image/jpeg';

    const message = await client.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: [
          {
            type:   'image',
            source: { type: 'base64', media_type: mime, data: base64 },
          },
          {
            type: 'text',
            text: `Analizá esta foto de un perro y respondé ÚNICAMENTE con un JSON válido, sin texto adicional, con esta estructura exacta:
{
  "color": "<uno de: Negro, Blanco, Marron, Caramelo, Dorado, Gris, Atigrado, Tricolor, Manchado>",
  "tamano": "<uno de: pequeño, mediano, grande, o null si no se puede determinar>",
  "raza": "<nombre de la raza más probable en español, o null si es mestizo o no se puede determinar>",
  "descripcion": "<descripción breve del perro en 1 oración, máx 80 caracteres>"
}

Si la imagen no contiene un perro claramente visible, devolvé: {"error": "No se detectó un perro en la imagen"}`
          }
        ]
      }]
    });

    const text = (message.content[0] as { type: string; text: string }).text.trim();

    // Extraer JSON aunque venga con texto alrededor
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return NextResponse.json({ error: 'Respuesta inválida del análisis' }, { status: 500 });

    const resultado = JSON.parse(match[0]);
    return NextResponse.json({ ok: true, ...resultado });
  } catch {
    return NextResponse.json({ error: 'Error al analizar la foto' }, { status: 500 });
  }
}

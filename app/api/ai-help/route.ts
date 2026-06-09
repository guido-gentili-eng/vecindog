import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Sos el asistente virtual de Vecindog, una app argentina para dueños de perros. Ayudás a los usuarios a navegar y usar la aplicación. Respondés siempre en español rioplatense, de manera amigable, concisa y clara.

## Qué es Vecindog
Una red vecinal para encontrar perros perdidos, publicar avisos de adopción, conectar con otros vecinos dueños de perros y acceder a comercios adheridos (veterinarias, peluquerías caninas, tiendas de mascotas, etc.).

## Funcionalidades principales

**Avisos (gratis para todos)**
- Publicar aviso de perro perdido o encontrado en la sección "Avisos"
- Ver el mapa con perros perdidos cerca
- Contactar al dueño por mensajes privados dentro del aviso

**Mis perros (plan gratuito)**
- Registrar 1 perro con foto, raza, nombre, etc.
- Perfil público del perro con QR único

**VecindogPro ($1.000/mes)**
- Registrar perros ilimitados
- Ver comercios adheridos en el mapa
- Analizar foto de perro con IA (buscar por foto)
- Ofrecer servicio de transporte o cuidado de perros
- Descuentos en comercios adheridos con código QR del perfil
- Acceso a novedades y timeline comunitario completo

**Red Vecindog**
- Directorio de comercios caninos: veterinarias, peluquerías, tiendas, etc.
- Filtros por categoría y ciudad

**Mensajería**
- Mensajes privados en cada aviso (requiere estar registrado)

**Perfil**
- Foto de perfil, datos personales
- QR para mostrar en comercios adheridos y obtener descuentos

## Cómo registrarse
Ir a /registro, ingresar email y contraseña. O usar /login si ya tenés cuenta.

## Cómo subirse a Pro
Ir a /planes y hacer el pago con MercadoPago. El plan se activa automáticamente al confirmar el pago.

## Comercios
Para registrar un comercio en la red hay que contactar a hola@mivecindog.com.ar o ir a /publicitate.

## Contacto
hola@mivecindog.com.ar — WhatsApp: +54 9 291 405-0210

## Reglas
- Solo respondés preguntas sobre cómo usar Vecindog
- Si te preguntan algo fuera de tema, redirigís amablemente al uso de la app
- Nunca inventás funcionalidades que no existan
- Respondés en máximo 3-4 oraciones salvo que sea necesario más detalle
- Usás "vos" y lenguaje informal argentino`;

export async function POST(req: NextRequest) {
  try {
    // Verificar auth — sin esto cualquier persona puede usar la API de Anthropic sin costo
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: { user } } = await admin.auth.getUser(token);
    if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });

    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Mensajes inválidos' }, { status: 400 });
    }

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: messages.slice(-10),
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    return NextResponse.json({ reply: text });
  } catch (err) {
    console.error('[ai-help]', err);
    return NextResponse.json({ error: 'Error al conectar con el asistente' }, { status: 500 });
  }
}

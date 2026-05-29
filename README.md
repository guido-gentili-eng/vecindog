# Patitas — Scaffold Next.js + Tailwind

App de avisos de mascotas (perdidas, encontradas y en adopción) para Bahía Blanca. Esta carpeta es el **scaffold mínimo** con datos mock — sin base de datos, sin login — para que puedas levantarla en segundos y empezar a iterar.

## Cómo correrla

```bash
cd patitas-app
npm install
npm run dev
```

Abrí `http://localhost:3000`.

## Qué incluye

```
patitas-app/
├── app/
│   ├── layout.tsx                  # layout raíz con Header
│   ├── page.tsx                    # home con hero + avisos recientes
│   ├── globals.css                 # Tailwind + estilos base
│   ├── publicar/
│   │   └── page.tsx                # formulario para publicar (mock)
│   └── publicaciones/
│       ├── page.tsx                # listado con filtros
│       └── [id]/page.tsx           # detalle de un aviso
├── components/
│   ├── Header.tsx
│   ├── AnimalCard.tsx
│   └── Filters.tsx
├── lib/
│   └── mockData.ts                 # datos de prueba + helpers
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

## Próximos pasos

1. **Conectar Supabase** — reemplazá las llamadas a `mockData.ts` por queries reales.
2. **Login** — el proyecto hermano ya tiene login con Google implementado, podés copiar `/login` y `/auth/callback`.
3. **Subida de imágenes** — usar Supabase Storage o un servicio como Cloudinary.
4. **PWA / notificaciones** — ya pensado en la arquitectura del proyecto grande.

Pilotamos en **Bahía Blanca**. Los datos mock están escritos con barrios reales (Centro, Villa Mitre, Palihue, Universitario, Terminal, Patagonia).

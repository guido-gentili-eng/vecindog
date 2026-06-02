'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2, Plus, ImagePlus, X, AlertCircle, Camera, Star,
  ArrowLeft, Dog, Loader2, Home, MapPin, ScanSearch, Sparkles, ArrowRight,
  Navigation, CheckCheck, Lock,
} from 'lucide-react';
import {
  type Categoria, type Especie,
  MAX_FOTOS, MAX_PESO_MB, TIPOS_IMAGEN_PERMITIDOS, ACCEPT_IMAGEN
} from '@/lib/mockData';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { nombreCorto } from '@/lib/ciudades';
import { obtenerPerro, type Perro } from '@/lib/perros';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import RazaAutocomplete from '@/components/RazaAutocomplete';

/* ─── Tipos ─── */

type Tamano  = 'pequeño' | 'mediano' | 'grande';
type Ternario = boolean | null;   // true=sí, false=no, null=no sé

interface FormState {
  categoria:   Categoria;
  especie:     Especie;
  nombre:      string;
  raza:        string;
  color:       string;
  tamano:      Tamano | '';
  collar:      Ternario;
  chapita:     Ternario;
  descripcion: string;
  zona:        string;
  fecha:       string;
  horario:     string;
  contacto:    string;
  lat:         number | null;
  lng:         number | null;
}

interface FotoPreview {
  file:   File;
  url:    string;
  pesoMb: number;
}

const CATEGORIAS_VALIDAS: Categoria[] = ['perdido', 'encontrado', 'adopcion'];

const COLORES_PERRO = [
  'Negro', 'Blanco', 'Marrón', 'Caramelo', 'Dorado',
  'Gris', 'Atigrado', 'Tricolor', 'Manchado', 'Canela',
];

function estadoInicial(catParam: string | null): FormState {
  const cat: Categoria =
    catParam && (CATEGORIAS_VALIDAS as string[]).includes(catParam)
      ? (catParam as Categoria)
      : 'perdido';
  return {
    categoria:   cat,
    especie:     'perro',
    nombre:      '',
    raza:        '',
    color:       '',
    tamano:      '',
    collar:      null,
    chapita:     null,
    descripcion: '',
    zona:        '',
    fecha:       new Date().toISOString().slice(0, 10),
    horario:     '',
    contacto:    '',
    lat:         null,
    lng:         null,
  };
}

function generarDescripcion(p: Perro): string {
  const partes: string[] = [];
  if (p.sexo)         partes.push(p.sexo);
  if (p.esterilizado) partes.push('esterilizado/a');
  if (p.chip)         partes.push(`chip N° ${p.chip}`);
  if (p.descripcion)  partes.push(p.descripcion);
  return partes.length > 0 ? partes.join(', ') + '.' : '';
}

/** Agrega la ciudad a la zona si no está ya incluida, para que el geocoding funcione bien */
function appendCiudad(zona: string, ciudad: string | null): string {
  if (!ciudad || !zona.trim()) return zona;
  const ciudadBase = ciudad.toLowerCase().split(' ')[0];
  if (zona.toLowerCase().includes(ciudadBase)) return zona;
  return `${zona.trim()}, ${ciudad}`;
}

/* ─── Página ─── */

export default function PublicarPage() {
  const searchParams = useSearchParams();
  const catParam  = searchParams.get('cat');
  const perroId   = searchParams.get('perro');
  const { ciudad, user, isGuest, profile } = useAuth();
  const efectivaCiudad = profile?.ciudad || ciudad;
  const cityLabel = efectivaCiudad ? nombreCorto(efectivaCiudad) : 'tu ciudad';

  const [form,        setForm]        = useState<FormState>(estadoInicial(catParam));
  const [fotos,       setFotos]       = useState<FotoPreview[]>([]);
  const [errorFoto,   setErrorFoto]   = useState<string>('');
  const [enviado,     setEnviado]     = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [gpsEstado,   setGpsEstado]   = useState<'idle' | 'cargando' | 'ok' | 'error'>('idle');

  /* ── Perro pre-fill ── */
  const [perroData,         setPerroData]         = useState<Perro | null>(null);
  const [perroFotoRemovida, setPerroFotoRemovida] = useState(false);
  const [ubicacion,         setUbicacion]         = useState<'casa' | 'otro' | null>(null);

  const urlsRef = useRef<string[]>([]);
  useEffect(() => {
    return () => { urlsRef.current.forEach((u) => URL.revokeObjectURL(u)); };
  }, []);

  /* Cargar datos del perro si viene desde el perfil */
  useEffect(() => {
    if (!perroId) return;
    obtenerPerro(perroId).then((p) => {
      if (!p) return;
      setPerroData(p);
      setForm((prev) => ({
        ...prev,
        nombre:      p.nombre,
        raza:        p.raza   || '',
        color:       p.color  || '',
        tamano:      (p.tamano as Tamano) || '',
        descripcion: generarDescripcion(p),
      }));
    });
  }, [perroId]);

  function handleChange<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  /* ── Fotos ── */
  function handleAgregarFotos(files: FileList | null) {
    setErrorFoto('');
    if (!files || files.length === 0) return;
    const restantes = MAX_FOTOS - fotos.length;
    if (restantes <= 0) { setErrorFoto(`Ya subiste el máximo de ${MAX_FOTOS} fotos.`); return; }
    const nuevos: FotoPreview[] = [];
    const errores: string[]    = [];
    const pesadas: string[]    = [];
    for (const f of Array.from(files).slice(0, restantes)) {
      if (!TIPOS_IMAGEN_PERMITIDOS.includes(f.type)) {
        errores.push(`"${f.name}" no es una imagen válida (JPG, PNG o WEBP).`); continue;
      }
      const pesoMb = f.size / (1024 * 1024);
      if (pesoMb > MAX_PESO_MB) pesadas.push(`"${f.name}" pesa ${pesoMb.toFixed(1)} MB.`);
      const url = URL.createObjectURL(f);
      urlsRef.current.push(url);
      nuevos.push({ file: f, url, pesoMb });
    }
    if (files.length > restantes) errores.push(`Solo podés subir ${MAX_FOTOS} fotos en total.`);
    if (nuevos.length > 0) setFotos((prev) => [...prev, ...nuevos]);
    const msg = [...errores, ...pesadas].join(' ');
    if (msg) setErrorFoto(msg);
  }

  function handleRemoverFoto(idx: number) {
    setFotos((prev) => {
      const f = prev[idx];
      if (f) { URL.revokeObjectURL(f.url); urlsRef.current = urlsRef.current.filter((u) => u !== f.url); }
      return prev.filter((_, i) => i !== idx);
    });
    setErrorFoto('');
  }

  function handleHacerPrincipal(idx: number) {
    if (idx === 0) return;
    setFotos((prev) => { const c = [...prev]; const [m] = c.splice(idx, 1); c.unshift(m); return c; });
  }

  /* ── GPS para el pin del mapa ── */
  function capturarGPS() {
    if (!navigator.geolocation) { setGpsEstado('error'); return; }
    setGpsEstado('cargando');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({ ...f, lat: pos.coords.latitude, lng: pos.coords.longitude }));
        setGpsEstado('ok');
      },
      () => setGpsEstado('error'),
      { timeout: 10000 }
    );
  }

  /* ── Submit ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError('');
    setLoading(true);
    try {
      const uploadedUrls: string[] = [];

      /* Foto del perfil del perro (ya subida, no se re-sube) */
      if (perroData?.foto_url && !perroFotoRemovida) uploadedUrls.push(perroData.foto_url);

      /* Subir fotos nuevas */
      for (const foto of fotos) {
        const ext  = foto.file.name.split('.').pop() ?? 'jpg';
        const path = `${form.categoria}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage.from('posts').upload(path, foto.file, { upsert: false });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('posts').getPublicUrl(path);
        uploadedUrls.push(data.publicUrl);
      }

      const { error: insErr } = await supabase.from('posts').insert({
        user_id:     user?.id         ?? null,
        perro_id:    perroData?.id    ?? null,
        categoria:   form.categoria,
        especie:     form.especie,
        nombre:      form.nombre      || null,
        raza:        form.raza        || null,
        color:       form.color       || null,
        tamano:      form.tamano      || null,
        collar:      form.collar,
        chapita:     form.chapita,
        descripcion: form.descripcion,
        zona:        appendCiudad(form.zona, efectivaCiudad),
        fecha:       form.fecha,
        horario:     form.horario     || null,
        contacto:    form.contacto,
        images:      uploadedUrls,
        // Solo incluir lat/lng si el usuario capturó GPS (evita error si la columna aún no existe)
        ...(form.lat != null && form.lng != null ? { lat: form.lat, lng: form.lng } : {}),
      });
      if (insErr) throw insErr;

      // Obtener el post recién creado para tener el ID
      const { data: postData } = await supabase
        .from('posts')
        .select('id, lat, lng')
        .eq('user_id', user?.id ?? '')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Notificar vecinos cercanos (fire & forget)
      if (postData) {
        let notifLat = postData.lat;
        let notifLng = postData.lng;

        // Si no hay coords GPS, geocodificar la zona
        if (!notifLat || !notifLng) {
          try {
            const q = encodeURIComponent(`${form.zona}${efectivaCiudad ? ', ' + efectivaCiudad : ''}, Argentina`);
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`,
              { headers: { 'User-Agent': 'Vecindog/1.0' } }
            );
            const geoData = await geoRes.json();
            if (geoData?.[0]) {
              notifLat = parseFloat(geoData[0].lat);
              notifLng = parseFloat(geoData[0].lon);
            }
          } catch { /* sin coords */ }
        }

        if (notifLat && notifLng) {
          // Pasar el token de sesión para que la API valide el usuario
          supabase.auth.getSession().then(({ data: { session } }) => {
            fetch('/api/notificar-vecinos', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
              },
              body: JSON.stringify({
                post_id: postData.id,
                lat: notifLat,
                lng: notifLng,
                zona: form.zona,
                ciudad: efectivaCiudad,
                categoria: form.categoria,
                nombre_perro: form.nombre || null,
                publicador_id: user?.id ?? null,
              }),
            }).catch(() => {});
          });
        }
      }

      setEnviado(true);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : typeof err === 'object' && err !== null && 'message' in err
            ? String((err as { message: unknown }).message)
            : String(err);
      setSubmitError('Error al publicar: ' + msg);
    } finally {
      setLoading(false);
    }
  }

  /* ── Bloqueo invitados ── */
  if (isGuest) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <div className="card p-8">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-primary/10 text-brand-primary">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-black text-ink">Necesitás una cuenta</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Para publicar un aviso tenés que estar registrado. Es gratis y tarda menos de un minuto.
          </p>
          <a
            href="/"
            onClick={() => { if (typeof window !== 'undefined') localStorage.removeItem('vecindog_guest'); }}
            className="btn-primary mt-6 inline-flex"
          >
            Crear cuenta gratis
          </a>
        </div>
      </div>
    );
  }

  /* ── Pantalla de éxito ── */
  if (enviado) {
    return (
      <div className="mx-auto max-w-md py-12">
        <div className="card p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-good/15 text-good">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-black text-ink">¡Aviso publicado!</h1>
          <p className="mt-2 text-ink-muted">
            Tu aviso ya está publicado y los vecinos de {cityLabel} pueden verlo.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/publicaciones" className="btn-primary">Ver todos los avisos</Link>
            <button
              type="button"
              onClick={() => {
                fotos.forEach((f) => URL.revokeObjectURL(f.url));
                urlsRef.current = [];
                setFotos([]);
                setForm(estadoInicial(catParam));
                setPerroData(null);
                setPerroFotoRemovida(false);
                setUbicacion(null);
                setEnviado(false);
              }}
              className="btn-secondary"
            >
              <Plus className="h-5 w-5" /> Publicar otro
            </button>
          </div>
        </div>
      </div>
    );
  }

  const maxFotosNuevas = MAX_FOTOS - (perroData?.foto_url && !perroFotoRemovida ? 1 : 0);

  return (
    <div className="mx-auto max-w-2xl py-8 md:py-10">
      <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm font-bold text-brand-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> Volver al inicio
      </Link>

      <header className="mb-6">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
          form.categoria === 'perdido'    ? 'bg-lost/15 text-lost' :
          form.categoria === 'encontrado' ? 'bg-found/15 text-found' :
                                           'bg-adopt/30 text-[#7a4f00]'
        }`}>
          <Dog className="h-3.5 w-3.5" />
          {form.categoria === 'perdido'    ? 'Perro perdido' :
           form.categoria === 'encontrado' ? 'Encontré un perro' :
                                            'Doy en adopción'}
        </span>
        <h1 className="mt-2 font-display text-3xl font-black tracking-tight text-ink md:text-4xl">
          {form.categoria === 'perdido'    ? 'Perdí a mi perro' :
           form.categoria === 'encontrado' ? 'Encontré un perro' :
                                            'Doy en adopción'}
        </h1>
        <p className="mt-1 text-ink-muted">
          {form.categoria === 'perdido'    ? 'Completá los datos y los vecinos te van a ayudar a encontrarlo.' :
           form.categoria === 'encontrado' ? 'Cargá los datos del perro para que su familia lo pueda encontrar.' :
                                            'Completá la información para encontrarle una familia responsable.'}
        </p>
      </header>

      {/* ── Banners de búsqueda (solo perdido / encontrado) ── */}
      {(form.categoria === 'perdido' || form.categoria === 'encontrado') && (
        <div className="mb-5 rounded-2xl border border-black/8 bg-brand-cream/60 p-4">
          <p className="mb-3 text-sm font-bold text-ink">
            {form.categoria === 'perdido'
              ? '🔍 Antes de publicar: ¿alguien ya lo encontró?'
              : '🔍 Antes de publicar: ¿el dueño ya puso un aviso?'}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Link
              href="/buscar"
              className="group flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-br from-brand-primary to-brand-primary-dark p-3 text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/20">
                <ScanSearch className="h-4.5 w-4.5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-extrabold leading-tight">Buscar por características</p>
                <p className="text-[11px] text-white/75 leading-tight mt-0.5">Color, tamaño, collar…</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 opacity-70 transition group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/buscar-por-foto"
              className="group flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-br from-[#1A1A1A] to-[#2a1f1c] p-3 text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/15">
                <Sparkles className="h-4.5 w-4.5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-extrabold leading-tight">Buscar por foto</p>
                <p className="text-[11px] text-white/75 leading-tight mt-0.5">Subí una foto y comparamos</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 opacity-70 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
          <p className="mt-2.5 text-[11px] text-ink-muted">
            Si no encontrás nada, completá el formulario de abajo para publicar tu aviso.
          </p>
        </div>
      )}

      {/* Banner perro pre-fill */}
      {perroData && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl bg-brand-primary/10 p-4">
          <Dog className="h-5 w-5 shrink-0 text-brand-primary" />
          <div>
            <p className="font-bold text-ink">Reportando a {perroData.nombre} como perdido/a</p>
            <p className="text-xs text-ink-muted">Cargamos los datos del perfil. Revisá y completá si necesitás.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── PASO 1: fotos ── */}
        <StepCard n={1} titulo="Fotos del perro" subtitulo={`Subí hasta ${MAX_FOTOS} fotos. La primera se usa como imagen principal.`}>
          {/* Foto del perfil pre-cargada */}
          {perroData?.foto_url && !perroFotoRemovida && (
            <div className="mb-3">
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-muted">
                Foto del perfil de {perroData.nombre}
              </p>
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={perroData.foto_url} alt={perroData.nombre} className="h-24 w-24 rounded-2xl object-cover ring-2 ring-brand-primary" />
                <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-extrabold text-white shadow">
                  <Star className="h-3 w-3 fill-current" /> Principal
                </span>
                <button type="button" onClick={() => setPerroFotoRemovida(true)} aria-label="Quitar"
                  className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
          <FotosUploader
            fotos={fotos}
            maxFotos={maxFotosNuevas}
            esPrincipalExterna={perroData?.foto_url != null && !perroFotoRemovida}
            onAgregar={handleAgregarFotos}
            onRemover={handleRemoverFoto}
            onHacerPrincipal={handleHacerPrincipal}
          />
          {errorFoto && (
            <p className="mt-3 flex items-start gap-1.5 text-sm text-bad">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> <span>{errorFoto}</span>
            </p>
          )}
        </StepCard>

        {/* ── PASO 2: datos del perro ── */}
        <StepCard n={2} titulo="Datos del perro"
          subtitulo={
            form.categoria === 'perdido'    ? 'Completá lo que sepas. Más datos = más chances de encontrarlo.' :
            form.categoria === 'encontrado' ? 'Describí al perro para que su familia lo reconozca.' :
                                             'Contanos cómo es el perro que das en adopción.'
          }>
          <div className="space-y-4">

            {/* Nombre */}
            <Field label="Nombre (si lo sabés)">
              <input type="text" className="field" placeholder="Ej: Rocco"
                value={form.nombre} onChange={(e) => handleChange('nombre', e.target.value)} />
            </Field>

            {/* Raza + Color */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Raza">
                <RazaAutocomplete value={form.raza} onChange={(v) => handleChange('raza', v)} />
              </Field>

              <div>
                <label className="label">Color principal</label>
                <select className="field w-full" value={form.color}
                  onChange={(e) => handleChange('color', e.target.value)}>
                  <option value="">No sé / no recuerdo</option>
                  {COLORES_PERRO.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Tamaño */}
            <div>
              <label className="label">Tamaño</label>
              <div className="flex gap-2">
                {([['pequeño', 'Chico'], ['mediano', 'Mediano'], ['grande', 'Grande']] as const).map(([v, l]) => (
                  <button key={v} type="button"
                    onClick={() => handleChange('tamano', form.tamano === v ? '' : v)}
                    className={`flex-1 rounded-2xl border-2 py-2.5 text-sm font-bold transition ${
                      form.tamano === v
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                        : 'border-black/10 text-ink-muted hover:border-brand-primary/40'
                    }`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Collar */}
            <div>
              <label className="label">¿Tenía collar?</label>
              <TernarioBtn value={form.collar} onChange={(v) => handleChange('collar', v)} />
            </div>

            {/* Chapita */}
            <div>
              <label className="label">¿Tenía chapita / plaquita identificadora?</label>
              <TernarioBtn value={form.chapita} onChange={(v) => handleChange('chapita', v)} />
            </div>

            {/* Descripción */}
            <Field label="Descripción adicional">
              <textarea className="field min-h-[100px]"
                placeholder="Marcas especiales, manchas, comportamiento, collar rojo con chapita azul…"
                value={form.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                required
              />
            </Field>

          </div>
        </StepCard>

        {/* ── PASO 3: dónde y cuándo ── */}
        <StepCard n={3}
          titulo={
            form.categoria === 'perdido'    ? '¿Dónde y cuándo se perdió?' :
            form.categoria === 'encontrado' ? '¿Dónde y cuándo lo encontraste?' :
                                             '¿Dónde está el perro?'
          }>
          <div className="grid gap-4 sm:grid-cols-2">

            {/* Selector de ubicación (solo perdido desde perfil) */}
            {perroData && form.categoria === 'perdido' && (
              <div className="sm:col-span-2">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-muted">¿Dónde se perdió?</p>
                <div className="flex gap-2">
                  <button type="button"
                    onClick={() => {
                      setUbicacion('casa');
                      const dir = perroData.direccion || '';
                      if (dir) handleChange('zona', dir);
                    }}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 py-3 text-sm font-bold transition ${
                      ubicacion === 'casa'
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                        : 'border-black/10 text-ink-muted hover:border-brand-primary/40'
                    }`}>
                    <Home className="h-4 w-4" /> En mi casa
                  </button>
                  <button type="button"
                    onClick={() => { setUbicacion('otro'); handleChange('zona', ''); }}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 py-3 text-sm font-bold transition ${
                      ubicacion === 'otro'
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                        : 'border-black/10 text-ink-muted hover:border-brand-primary/40'
                    }`}>
                    <MapPin className="h-4 w-4" /> En otro lugar
                  </button>
                </div>
                {ubicacion === 'casa' && !perroData.direccion && (
                  <p className="mt-2 text-xs text-ink-muted">
                    No tenés dirección guardada.{' '}
                    <Link href={`/mis-perros/${perroData.id}`} className="font-bold text-brand-primary underline">
                      Agregarla al perfil
                    </Link>
                    {' '}o ingresala abajo.
                  </p>
                )}
              </div>
            )}

            <div className="sm:col-span-2">
              <Field label="Barrio o zona donde fue visto">
                <AddressAutocomplete
                  value={form.zona}
                  onChange={(v) => handleChange('zona', v)}
                  placeholder="Ej: Av. Colón 1200, Villa Mitre, Centro…"
                  ciudad={efectivaCiudad}
                  required
                />
                <p className="mt-1 text-xs text-ink-muted">
                  Podés escribir la calle y elegir una sugerencia, o escribir el barrio general.
                </p>
              </Field>

              {/* Botón GPS para pin en el mapa */}
              <div className="mt-2">
                {gpsEstado !== 'ok' ? (
                  <button
                    type="button"
                    onClick={capturarGPS}
                    disabled={gpsEstado === 'cargando'}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-1.5 text-xs font-bold text-ink-muted transition hover:border-brand-primary hover:text-brand-primary disabled:opacity-60"
                  >
                    {gpsEstado === 'cargando'
                      ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Obteniendo ubicación…</>
                      : gpsEstado === 'error'
                      ? <><Navigation className="h-3.5 w-3.5" /> No se pudo obtener el GPS — tocar para reintentar</>
                      : <><Navigation className="h-3.5 w-3.5" /> Agregar ubicación GPS (opcional — aparece en el mapa)</>
                    }
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-good/10 px-3 py-1.5 text-xs font-bold text-good">
                    <CheckCheck className="h-3.5 w-3.5" /> Ubicación GPS capturada — va a aparecer en el mapa
                  </span>
                )}
              </div>
            </div>

            <Field label="Fecha">
              <input type="date" className="field" value={form.fecha}
                onChange={(e) => handleChange('fecha', e.target.value)} required />
            </Field>

            {form.categoria === 'encontrado' && (
              <Field label="Horario aproximado">
                <input type="time" className="field" value={form.horario}
                  onChange={(e) => handleChange('horario', e.target.value)} />
              </Field>
            )}
          </div>
        </StepCard>

        {/* ── PASO 4: contacto ── */}
        <StepCard n={4} titulo="¿Cómo te contactan?">
          <Field label="WhatsApp de contacto">
            <input type="tel" className="field" placeholder="+54 9 291 ..."
              value={form.contacto} onChange={(e) => handleChange('contacto', e.target.value)} required />
          </Field>
        </StepCard>

        {submitError && (
          <p className="flex items-start gap-1.5 text-sm text-bad">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> <span>{submitError}</span>
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Publicando…</> : 'Publicar aviso'}
        </button>
      </form>
    </div>
  );
}

/* ══════════════════════ Sub-componentes ══════════════════════ */

function StepCard({ n, titulo, subtitulo, children }: {
  n: number; titulo: string; subtitulo?: string; children: React.ReactNode;
}) {
  return (
    <div className="card relative p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-brand-primary font-black text-white shadow-soft">{n}</span>
        <div className="flex-1">
          <h2 className="font-display text-lg font-extrabold leading-tight text-ink">{titulo}</h2>
          {subtitulo && <p className="text-sm text-ink-muted">{subtitulo}</p>}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">{label}</span>
      {children}
    </label>
  );
}

function TernarioBtn({ value, onChange }: { value: Ternario; onChange: (v: Ternario) => void }) {
  return (
    <div className="flex gap-2">
      {([
        [true,  'Sí'],
        [false, 'No'],
        [null,  'No sé'],
      ] as const).map(([v, l]) => (
        <button key={String(v)} type="button" onClick={() => onChange(v)}
          className={`flex-1 rounded-2xl border-2 py-2.5 text-sm font-bold transition ${
            value === v
              ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
              : 'border-black/10 text-ink-muted hover:border-brand-primary/40'
          }`}>
          {l}
        </button>
      ))}
    </div>
  );
}

function FotosUploader({ fotos, maxFotos, esPrincipalExterna, onAgregar, onRemover, onHacerPrincipal }: {
  fotos: FotoPreview[]; maxFotos: number; esPrincipalExterna: boolean;
  onAgregar: (files: FileList | null) => void;
  onRemover: (idx: number) => void;
  onHacerPrincipal: (idx: number) => void;
}) {
  const galeriaRef = useRef<HTMLInputElement>(null);
  const camaraRef  = useRef<HTMLInputElement>(null);
  const lleno      = fotos.length >= maxFotos;

  return (
    <div>
      {fotos.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {fotos.map((f, i) => (
            <Miniatura key={f.url} url={f.url}
              esPrincipal={i === 0 && !esPrincipalExterna}
              pesoMb={f.pesoMb}
              onRemover={() => onRemover(i)}
              onHacerPrincipal={() => onHacerPrincipal(i)} />
          ))}
          {!lleno && (
            <button type="button" onClick={() => galeriaRef.current?.click()}
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-brand-primary/40 bg-brand-cream/60 text-brand-primary transition hover:border-brand-primary hover:bg-brand-cream"
              aria-label="Agregar fotos">
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      {fotos.length === 0 && (
        <button type="button" onClick={() => galeriaRef.current?.click()}
          className="mb-3 flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-black/10 py-6 text-ink-muted transition hover:border-brand-primary hover:text-brand-primary">
          <ImagePlus className="h-7 w-7" />
          <span className="text-sm font-bold">{esPrincipalExterna ? 'Agregar más fotos' : 'Subir fotos'}</span>
          <span className="text-xs">JPG, PNG o WebP · Máx. {MAX_PESO_MB} MB c/u</span>
        </button>
      )}

      <input ref={galeriaRef} type="file" accept={ACCEPT_IMAGEN} multiple className="hidden"
        onChange={(e) => { onAgregar(e.target.files); e.target.value = ''; }} />
      <input ref={camaraRef} type="file" accept="image/*" capture="environment" className="hidden"
        onChange={(e) => { onAgregar(e.target.files); e.target.value = ''; }} />

      <div className="flex flex-wrap gap-2">
        <button type="button" disabled={lleno} onClick={() => galeriaRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary/10 px-3 py-2 text-sm font-bold text-brand-primary transition hover:bg-brand-primary/15 disabled:cursor-not-allowed disabled:opacity-50">
          <ImagePlus className="h-4 w-4" /> Galería
        </button>
        <button type="button" disabled={lleno} onClick={() => camaraRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary/10 px-3 py-2 text-sm font-bold text-brand-primary transition hover:bg-brand-primary/15 disabled:cursor-not-allowed disabled:opacity-50">
          <Camera className="h-4 w-4" /> Sacar foto
        </button>
        <span className="ml-auto self-center text-xs font-bold text-ink-muted">
          {fotos.length} / {maxFotos}
        </span>
      </div>
    </div>
  );
}

function Miniatura({ url, esPrincipal, pesoMb, onRemover, onHacerPrincipal }: {
  url: string; esPrincipal: boolean; pesoMb: number; onRemover: () => void; onHacerPrincipal: () => void;
}) {
  const pesada = pesoMb > MAX_PESO_MB;
  return (
    <div className={`relative aspect-square overflow-hidden rounded-2xl ring-1 ${esPrincipal ? 'ring-2 ring-brand-primary' : 'ring-black/10'}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="" className="h-full w-full object-cover" />
      {esPrincipal ? (
        <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-extrabold text-white shadow">
          <Star className="h-3 w-3 fill-current" /> Principal
        </span>
      ) : (
        <button type="button" onClick={onHacerPrincipal}
          className="absolute left-1.5 top-1.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-ink shadow ring-1 ring-black/5 hover:bg-white">
          Hacer principal
        </button>
      )}
      <button type="button" onClick={onRemover} aria-label="Eliminar foto"
        className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm transition hover:bg-black/75">
        <X className="h-3.5 w-3.5" />
      </button>
      {pesada && (
        <span className="absolute bottom-1 left-1 right-1 truncate rounded-md bg-warn/90 px-1.5 py-0.5 text-center text-[10px] font-extrabold text-[#5b3a0e] shadow">
          {pesoMb.toFixed(1)} MB
        </span>
      )}
    </div>
  );
}

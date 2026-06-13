'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2, Plus, ImagePlus, X, AlertCircle, Camera, Star,
  ArrowLeft, Dog, Loader2, Home, MapPin, ScanSearch, Sparkles, ArrowRight,
  Navigation, CheckCheck, Lock,
} from 'lucide-react';
import {
  type Categoria, type Especie,
  MAX_FOTOS, MAX_PESO_MB, TIPOS_IMAGEN_PERMITIDOS, ACCEPT_IMAGEN, COLORES_PERRO
} from '@/lib/mockData';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { nombreCorto } from '@/lib/ciudades';
import { obtenerPerro, type Perro } from '@/lib/perros';
import { listarPosts, actualizarZonaPost, contarPostsActivosDelUsuario, type Post } from '@/lib/posts';
import { notificarAmigosPerroPerdido } from '@/lib/amistades';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import RazaAutocomplete from '@/components/RazaAutocomplete';
import dynamicImport from 'next/dynamic';
const MapPinPicker = dynamicImport(() => import('@/components/MapPinPicker'), { ssr: false });

/* ─── Tipos ─── */

type Tamano  = 'pequeño' | 'mediano' | 'grande';
type Ternario = boolean | null;

interface FormState {
  categoria:             Categoria;
  especie:               Especie;
  nombre:                string;
  raza:                  string;
  color:                 string;
  tamano:                Tamano | '';
  sexo:                  'macho' | 'hembra' | '';
  collar:                Ternario;
  chapita:               Ternario;
  descripcion:           string;
  zona:                  string;
  fecha:                 string;
  horario:               string;
  contacto:              string;
  lat:                   number | null;
  lng:                   number | null;
  situacion_transito:    'tengo' | 'calle' | '';
  fecha_limite_transito: string;
}

interface FotoPreview {
  file:   File;
  url:    string;
  pesoMb: number;
}

const CATEGORIAS_VALIDAS: Categoria[] = ['perdido', 'encontrado', 'adopcion', 'transito'];

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
    sexo:        '',
    collar:      null,
    chapita:     null,
    descripcion: '',
    zona:        '',
    fecha:       new Date().toISOString().slice(0, 10),
    horario:     '',
    contacto:    '',
    lat:         null,
    lng:         null,
    situacion_transito:    '',
    fecha_limite_transito: '',
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
  const { ciudad, user, isGuest, profile, isPro } = useAuth();
  const { t } = useLanguage();
  const efectivaCiudad = profile?.ciudad || ciudad;
  const cityLabel = efectivaCiudad ? nombreCorto(efectivaCiudad) : 'tu ciudad';

  const [form,        setForm]        = useState<FormState>(estadoInicial(catParam));
  const [fotos,       setFotos]       = useState<FotoPreview[]>([]);
  const [errorFoto,   setErrorFoto]   = useState<string>('');
  const [enviado,       setEnviado]       = useState(false);
  const [loading,       setLoading]       = useState(false);
  const publicandoRef = useRef(false);
  const zonaRef       = useRef<HTMLDivElement>(null);
  const contactoRef   = useRef<HTMLDivElement>(null);
  const [submitError,   setSubmitError]   = useState('');
  const [showWaConfirm, setShowWaConfirm] = useState(false);
  const [gpsEstado,   setGpsEstado]   = useState<'idle' | 'cargando' | 'ok' | 'error'>('idle');

  const [perroData,         setPerroData]         = useState<Perro | null>(null);
  const [perroFotoRemovida, setPerroFotoRemovida] = useState(false);
  const [ubicacion,         setUbicacion]         = useState<'casa' | 'otro' | null>(null);

  const [sinContacto,     setSinContacto]     = useState(false);

  const [matchCandidatos, setMatchCandidatos] = useState<Post[]>([]);
  const [matchPost,       setMatchPost]       = useState<Post | null>(null);
  const [mismaZona,       setMismaZona]       = useState<boolean | null>(null);
  const [zonaVisto,       setZonaVisto]       = useState('');
  const [latVisto,        setLatVisto]        = useState<number | null>(null);
  const [lngVisto,        setLngVisto]        = useState<number | null>(null);
  const [horarioVisto,    setHorarioVisto]    = useState('');
  const [zonaManual,      setZonaManual]      = useState(false);
  const [showMapPicker,   setShowMapPicker]   = useState(false);

  useEffect(() => {
    if (enviado) window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [enviado]);

  useEffect(() => {
    if (form.categoria !== 'encontrado') return;
    if (!form.color && !form.tamano) { setMatchCandidatos([]); return; }
    listarPosts().then((posts) => {
      const candidatos = posts.filter(
        (p) =>
          p.categoria === 'perdido' &&
          p.especie   === form.especie &&
          (form.color  ? p.color?.toLowerCase()  === form.color.toLowerCase()  : true) &&
          (form.tamano ? p.tamano === form.tamano : true),
      );
      setMatchCandidatos(candidatos);
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.color, form.tamano, form.especie, form.categoria]);

  const urlsRef = useRef<string[]>([]);
  useEffect(() => {
    return () => { urlsRef.current.forEach((u) => URL.revokeObjectURL(u)); };
  }, []);

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
        sexo:        (p.sexo as 'macho' | 'hembra' | '') || '',
        descripcion: generarDescripcion(p),
      }));
    });
  }, [perroId]);

  function handleChange<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleAgregarFotos(files: FileList | null) {
    setErrorFoto('');
    if (!files || files.length === 0) return;
    const restantes = MAX_FOTOS - fotos.length;
    if (restantes <= 0) {
      setErrorFoto(t.pbrFotoLimit.replace('{max}', String(MAX_FOTOS)));
      return;
    }
    const nuevos: FotoPreview[] = [];
    const errores: string[]    = [];
    const pesadas: string[]    = [];
    for (const f of Array.from(files).slice(0, restantes)) {
      if (!TIPOS_IMAGEN_PERMITIDOS.includes(f.type)) {
        errores.push(`"${f.name}" ${t.pbrFotoInvalida}`); continue;
      }
      const pesoMb = f.size / (1024 * 1024);
      if (pesoMb > MAX_PESO_MB) {
        pesadas.push(`"${f.name}" ${t.pbrFotoPesada.replace('{mb}', pesoMb.toFixed(1))}`);
        continue; // no agregar fotos que superan el límite
      }
      const url = URL.createObjectURL(f);
      urlsRef.current.push(url);
      nuevos.push({ file: f, url, pesoMb });
    }
    if (files.length > restantes) errores.push(t.pbrFotoLimit.replace('{max}', String(MAX_FOTOS)));
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

  async function capturarGPS() {
    if (!navigator.geolocation) { setGpsEstado('error'); setZonaManual(true); return; }
    setGpsEstado('cargando');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const dentroDeArgentina = lat >= -55 && lat <= -21 && lng >= -73 && lng <= -53;
        if (!dentroDeArgentina) { setGpsEstado('error'); setZonaManual(true); return; }
        setForm((f) => ({ ...f, lat, lng }));
        setGpsEstado('ok');
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
            { headers: { 'User-Agent': 'Vecindog/1.0 (noreply@mivecindog.com.ar)' } }
          );
          const data = await res.json();
          if (data?.address) {
            const a = data.address;
            const calle = a.road ?? a.pedestrian ?? a.footway ?? '';
            const numero = a.house_number ?? '';
            const barrio = a.suburb ?? a.neighbourhood ?? a.quarter ?? '';
            const zona = [calle && numero ? `${calle} ${numero}` : calle, barrio].filter(Boolean).join(', ');
            if (zona) handleChange('zona', zona);
          }
        } catch { /* sin reverse geocode */ }
      },
      () => { setGpsEstado('error'); setZonaManual(true); },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setSubmitError('');

    // Zona obligatoria (necesaria para matching y notificaciones)
    if (!form.zona.trim()) {
      setSubmitError('Ingresá la zona o dirección donde ocurrió.');
      setTimeout(() => zonaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
      return;
    }

    // Foto obligatoria para perdido, encontrado y adopcion
    const tieneFoto = fotos.length > 0 || (perroData?.foto_url && !perroFotoRemovida);
    if (!tieneFoto && ['perdido', 'encontrado', 'adopcion'].includes(form.categoria)) {
      setSubmitError('Agregá al menos una foto. Ayuda mucho a que los vecinos reconozcan al perro.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (!sinContacto) {
      const digitos = form.contacto.replace(/\D/g, '');
      if (digitos.length < 10) {
        setSubmitError(t.pbrWhatsappError);
        setTimeout(() => contactoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
        return;
      }
    }

    if (!isPro && user && ['perdido', 'encontrado', 'transito'].includes(form.categoria)) {
      const count = await contarPostsActivosDelUsuario();
      if (count >= 5) {
        setSubmitError(t.pbrLimiteError);
        setTimeout(() => contactoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
        return;
      }
    }

    // Si no quiere mostrar contacto, publicar directo sin modal de confirmación
    if (sinContacto) {
      doPublicar();
      return;
    }

    // Mostrar confirmación del número de WhatsApp antes de publicar
    setShowWaConfirm(true);
  }

  async function doPublicar() {
    if (publicandoRef.current) return;
    publicandoRef.current = true;
    setShowWaConfirm(false);
    setLoading(true);
    try {
      if (!isPro && user && ['perdido', 'encontrado', 'transito'].includes(form.categoria)) {
        const countFinal = await contarPostsActivosDelUsuario();
        if (countFinal >= 5) {
          setSubmitError(t.pbrLimiteError);
          setLoading(false);
          return;
        }
      }

      const uploadedUrls: string[] = [];

      if (perroData?.foto_url && !perroFotoRemovida) uploadedUrls.push(perroData.foto_url);

      for (const foto of fotos) {
        const ext  = foto.file.name.split('.').pop() ?? 'jpg';
        const path = `${form.categoria}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: upErr } = await supabase.storage.from('posts').upload(path, foto.file, { upsert: false });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('posts').getPublicUrl(path);
        uploadedUrls.push(data.publicUrl);
      }

      const { data: postData, error: insErr } = await supabase.from('posts').insert({
        user_id:     user?.id         ?? null,
        perro_id:    perroData?.id    ?? null,
        categoria:   form.categoria,
        especie:     form.especie,
        nombre:      form.nombre      || null,
        raza:        form.raza        || null,
        color:       form.color       || null,
        tamano:      form.tamano      || null,
        sexo:        form.sexo        || null,
        collar:      form.collar,
        chapita:     form.chapita,
        descripcion: form.descripcion,
        zona:        appendCiudad(form.zona, efectivaCiudad),
        fecha:       form.fecha,
        horario:     form.horario     || null,
        contacto:    sinContacto ? 'OCULTO' : form.contacto,
        images:      uploadedUrls,
        ...(form.lat != null && form.lng != null ? { lat: form.lat, lng: form.lng } : {}),
        ...(form.categoria === 'transito' ? {
          situacion_transito:    form.situacion_transito || null,
          fecha_limite_transito: (form.situacion_transito === 'tengo' && form.fecha_limite_transito) ? form.fecha_limite_transito : null,
        } : {}),
      }).select('id, lat, lng').single();
      if (insErr) throw insErr;

      if (postData) {
        let notifLat = postData.lat;
        let notifLng = postData.lng;

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

      if (form.categoria === 'perdido' && user && postData?.id) {
        notificarAmigosPerroPerdido({
          ownerId:     user.id,
          postId:      postData.id,
          nombrePerro: form.nombre || null,
          zona:        appendCiudad(form.zona, efectivaCiudad),
        }).catch(() => {});
      }

      if (matchPost && mismaZona === false && zonaVisto.trim()) {
        await actualizarZonaPost(
          matchPost.id,
          zonaVisto,
          horarioVisto || undefined,
          latVisto,
          lngVisto,
        );
      }

      urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      urlsRef.current = [];
      setFotos([]);
      setForm(estadoInicial(catParam));
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
      publicandoRef.current = false;
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
          <h1 className="mt-4 font-display text-2xl font-black text-ink">{t.pbrGuestTitle}</h1>
          <p className="mt-2 text-sm text-ink-muted">{t.pbrGuestSub}</p>
          <a
            href="/"
            onClick={() => { if (typeof window !== 'undefined') localStorage.removeItem('vecindog_guest'); }}
            className="btn-primary mt-6 inline-flex"
          >
            {t.pbrGuestBtn}
          </a>
        </div>
      </div>
    );
  }

  /* ── Pantalla de éxito ── */
  if (enviado) {
    const esBusqueda = form.categoria === 'perdido' || form.categoria === 'encontrado';
    return (
      <div className="mx-auto max-w-md py-12 space-y-4">
        <div className="card p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-good/15 text-good">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-black text-ink">{t.pbrSuccessTitle}</h1>
          <p className="mt-2 text-ink-muted">
            {t.pbrSuccessMsg.replace('{city}', cityLabel)}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/publicaciones" className="btn-primary">{t.pbrVerAvisos}</Link>
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
                setSinContacto(false);
                setMatchCandidatos([]);
                setMatchPost(null);
                setMismaZona(null);
                setZonaVisto('');
                setLatVisto(null);
                setLngVisto(null);
                setHorarioVisto('');
                setZonaManual(false);
                setGpsEstado('idle');
                setEnviado(false);
              }}
              className="btn-secondary"
            >
              <Plus className="h-5 w-5" /> {t.pbrPublicarOtro}
            </button>
          </div>
        </div>

        {esBusqueda && (
          <div className="card p-6">
            <p className="mb-4 text-center text-sm font-bold text-ink">
              {form.categoria === 'perdido' ? t.pbrPostMasPrecision : t.pbrPostEncontrarDueno}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {isPro ? (
                <Link href="/buscar-por-foto"
                  className="flex flex-col items-center gap-2 rounded-2xl border-2 border-brand-primary/20 bg-brand-primary/5 p-4 text-center transition hover:bg-brand-primary/10">
                  <Camera className="h-7 w-7 text-brand-primary" />
                  <span className="text-xs font-bold text-ink">{t.pbrBuscarFoto}</span>
                  <span className="text-[10px] text-ink-muted leading-tight">{t.pbrBuscarFotoProSub}</span>
                </Link>
              ) : (
                <Link href="/planes"
                  className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-black/10 p-4 text-center transition hover:border-brand-primary/30">
                  <Camera className="h-7 w-7 text-ink-muted/40" />
                  <span className="text-xs font-bold text-ink-muted">{t.pbrBuscarFoto}</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-brand-primary">
                    <Sparkles className="h-3 w-3" /> {t.pbrSoloPro}
                  </span>
                </Link>
              )}

              {isPro ? (
                <Link href="/buscar"
                  className="flex flex-col items-center gap-2 rounded-2xl border-2 border-brand-primary/20 bg-brand-primary/5 p-4 text-center transition hover:bg-brand-primary/10">
                  <ScanSearch className="h-7 w-7 text-brand-primary" />
                  <span className="text-xs font-bold text-ink">{t.pbrBuscarCaractTitle}</span>
                  <span className="text-[10px] text-ink-muted leading-tight">{t.pbrBuscarCaractProSub}</span>
                </Link>
              ) : (
                <Link href="/planes"
                  className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-black/10 p-4 text-center transition hover:border-brand-primary/30">
                  <ScanSearch className="h-7 w-7 text-ink-muted/40" />
                  <span className="text-xs font-bold text-ink-muted">{t.pbrPorCaract}</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-brand-primary">
                    <Sparkles className="h-3 w-3" /> {t.pbrSoloPro}
                  </span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  const maxFotosNuevas = MAX_FOTOS - (perroData?.foto_url && !perroFotoRemovida ? 1 : 0);

  const waDigitos = form.contacto.replace(/\D/g, '');
  const waFormateado = waDigitos.length >= 10
    ? `+${waDigitos.startsWith('54') ? waDigitos : '54' + waDigitos}`
    : form.contacto;

  return (
    <div className="mx-auto max-w-2xl py-8 md:py-10">
      {/* Modal confirmación WhatsApp */}
      {showWaConfirm && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 sm:items-center">
          <div className="w-full max-w-sm rounded-t-[32px] bg-white px-6 pb-8 pt-5 shadow-2xl sm:rounded-[32px]">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-black/10 sm:hidden" />
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25D366]/10 text-[#25D366]">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.117 1.528 5.845L0 24l6.335-1.508A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 0 1-5.003-1.373l-.358-.213-3.758.894.952-3.653-.234-.374A9.78 9.78 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
              </svg>
            </div>
            <h2 className="font-display text-xl font-black text-ink">Confirmá tu WhatsApp</h2>
            <p className="mt-1 text-sm text-ink-muted">Los vecinos van a contactarte por este número. ¿Es correcto?</p>
            <div className="mt-4 rounded-2xl bg-brand-cream px-4 py-3 text-center">
              <p className="font-display text-2xl font-black text-ink tracking-wide">{waFormateado}</p>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setShowWaConfirm(false)}
                className="flex-1 rounded-2xl border-2 border-black/10 py-3 text-sm font-bold text-ink-muted transition hover:border-black/20"
              >
                Corregir
              </button>
              <button
                type="button"
                onClick={doPublicar}
                className="flex-1 rounded-2xl bg-[#25D366] py-3 text-sm font-bold text-white transition hover:opacity-90"
              >
                Sí, publicar
              </button>
            </div>
          </div>
        </div>
      )}

      <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm font-bold text-brand-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> {t.pbrBack}
      </Link>

      <header className="mb-6">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
          form.categoria === 'perdido'    ? 'bg-lost/15 text-lost' :
          form.categoria === 'encontrado' ? 'bg-found/15 text-found' :
          form.categoria === 'transito'   ? 'bg-[#7c3aed]/10 text-[#7c3aed]' :
                                           'bg-adopt/30 text-[#7a4f00]'
        }`}>
          <Dog className="h-3.5 w-3.5" />
          {form.categoria === 'perdido'    ? t.pbrChipPerdido :
           form.categoria === 'encontrado' ? t.pbrChipEncontrado :
           form.categoria === 'transito'   ? t.pbrChipTransito :
                                            t.pbrChipAdopcion}
        </span>
        <h1 className="mt-2 font-display text-3xl font-black tracking-tight text-ink md:text-4xl">
          {form.categoria === 'perdido'    ? t.pbrTitlePerdido :
           form.categoria === 'encontrado' ? t.pbrTitleEncontrado :
           form.categoria === 'transito'   ? t.pbrTitleTransito :
                                            t.pbrTitleAdopcion}
        </h1>
        <p className="mt-1 text-ink-muted">
          {form.categoria === 'perdido'    ? t.pbrSubPerdido :
           form.categoria === 'encontrado' ? t.pbrSubEncontrado :
           form.categoria === 'transito'   ? t.pbrSubTransito :
                                            t.pbrSubAdopcion}
        </p>
      </header>

      {/* ── Banners de búsqueda (solo perdido / encontrado) ── */}
      {(form.categoria === 'perdido' || form.categoria === 'encontrado') && (
        <div className="mb-5 rounded-2xl border border-black/8 bg-brand-cream/60 p-4">
          <p className="mb-3 text-sm font-bold text-ink">
            {form.categoria === 'perdido' ? t.pbrPrePerdido : t.pbrPreEncontrado}
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
                <p className="text-xs font-extrabold leading-tight">{t.pbrBuscarCaract}</p>
                <p className="text-[11px] text-white/75 leading-tight mt-0.5">{t.pbrBuscarCaractSub}</p>
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
                <p className="text-xs font-extrabold leading-tight">{t.pbrBuscarFoto}</p>
                <p className="text-[11px] text-white/75 leading-tight mt-0.5">{t.pbrBuscarFotoSub}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 opacity-70 transition group-hover:translate-x-0.5" />
            </Link>
          </div>
          <p className="mt-2.5 text-[11px] text-ink-muted">{t.pbrSiNoEncontras}</p>
        </div>
      )}

      {/* Banner perro pre-fill */}
      {perroData && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl bg-brand-primary/10 p-4">
          <Dog className="h-5 w-5 shrink-0 text-brand-primary" />
          <div>
            <p className="font-bold text-ink">{t.pbrPrefillPre} {perroData.nombre} {t.pbrPrefillPost}</p>
            <p className="text-xs text-ink-muted">{t.pbrPrefillSub}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ── PASO 1: fotos ── */}
        <StepCard n={1} titulo={t.pbrStep1}
          subtitulo={t.pbrStep1Sub.replace('{max}', String(MAX_FOTOS))}>
          {perroData?.foto_url && !perroFotoRemovida && (
            <div className="mb-3">
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-ink-muted">
                {t.pbrFotoPerfilDe} {perroData.nombre}
              </p>
              <div className="relative inline-block">
                <Image src={perroData.foto_url} alt={perroData.nombre} width={96} height={96} className="rounded-2xl object-cover ring-2 ring-brand-primary" />
                <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-extrabold text-white shadow">
                  <Star className="h-3 w-3 fill-current" /> {t.pbrPrincipal}
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
            labelAgregar={t.pbrAgregarFotos}
            labelSubir={t.pbrSubirFotos}
            labelPrincipal={t.pbrPrincipal}
            labelHacerPrincipal={t.pbrHacerPrincipal}
            labelGaleria={t.pbrGaleria}
            labelCamara={t.pbrSacarFoto}
          />
          {errorFoto && (
            <p className="mt-3 flex items-start gap-1.5 text-sm text-bad">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> <span>{errorFoto}</span>
            </p>
          )}
        </StepCard>

        {/* ── PASO 2 especial: sub-tipo tránsito ── */}
        {form.categoria === 'transito' && (
          <StepCard n={2} titulo={t.pbrStep2Transit} subtitulo={t.pbrStep2TransitSub}>
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {([
                  { val: 'tengo', label: t.pbrLoTengo, desc: t.pbrLoTengoDesc },
                  { val: 'calle', label: t.pbrLoVi,    desc: t.pbrLoViDesc },
                ] as const).map(({ val, label, desc }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleChange('situacion_transito', val)}
                    className={`rounded-2xl border-2 p-4 text-left transition ${
                      form.situacion_transito === val
                        ? 'border-[#7c3aed] bg-[#7c3aed]/5'
                        : 'border-black/10 hover:border-[#7c3aed]/40'
                    }`}
                  >
                    <p className="font-bold text-sm text-ink">{label}</p>
                    <p className="mt-1 text-xs text-ink-muted">{desc}</p>
                  </button>
                ))}
              </div>

              {form.situacion_transito === 'tengo' && (
                <Field label={t.pbrFechaLimite}>
                  <input
                    type="date"
                    className="field"
                    min={new Date().toISOString().slice(0, 10)}
                    value={form.fecha_limite_transito}
                    onChange={(e) => handleChange('fecha_limite_transito', e.target.value)}
                  />
                  <p className="mt-1 text-xs text-ink-muted">{t.pbrFechaLimiteSub}</p>
                </Field>
              )}

              {form.situacion_transito === 'calle' && (
                <>
                  <Field label={t.pbrHoraVisto}>
                    <input
                      type="time"
                      className="field w-40"
                      value={form.horario}
                      onChange={(e) => handleChange('horario', e.target.value)}
                    />
                  </Field>
                  <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                    {t.pbrTransitWarning}
                  </div>
                </>
              )}
            </div>
          </StepCard>
        )}

        {/* ── PASO 2/3: datos del perro ── */}
        <StepCard n={form.categoria === 'transito' ? 3 : 2}
          titulo={t.pbrStep2Data}
          subtitulo={
            form.categoria === 'perdido'    ? t.pbrStep2DataSub :
            form.categoria === 'encontrado' ? t.pbrStep2DataSubEncontrado :
            form.categoria === 'transito'   ? t.pbrStep2DataSubTransito :
                                             t.pbrStep2DataSubAdopcion
          }>
          <div className="space-y-4">

            <Field label={t.pbrNombre}>
              <input type="text" className="field" placeholder="Ej: Rocco"
                value={form.nombre} onChange={(e) => handleChange('nombre', e.target.value)} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t.pbrRaza}>
                <RazaAutocomplete value={form.raza} onChange={(v) => handleChange('raza', v)} />
              </Field>

              <div>
                <label className="label">{t.pbrColor}</label>
                <select className="field w-full" value={form.color}
                  onChange={(e) => handleChange('color', e.target.value)}>
                  <option value="">{t.pbrColorNoSe}</option>
                  {COLORES_PERRO.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="label">{t.pbrTamano}</label>
              <div className="flex gap-2">
                {([['pequeño', t.pbrChico], ['mediano', t.pbrMediano], ['grande', t.pbrGrande]] as const).map(([v, l]) => (
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

            <div>
              <label className="label">{t.pbrSexo} <span className="text-ink-muted font-normal">({t.commonOptional})</span></label>
              <div className="flex gap-2">
                {([['macho', t.pbrMacho], ['hembra', t.pbrHembra], ['', t.pbrNoSe]] as const).map(([v, l]) => (
                  <button key={v === '' ? 'no-se' : v} type="button"
                    onClick={() => handleChange('sexo', v as 'macho' | 'hembra' | '')}
                    className={`flex-1 rounded-2xl border-2 py-2.5 text-sm font-bold transition ${
                      form.sexo === v
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                        : 'border-black/10 text-ink-muted hover:border-brand-primary/40'
                    }`}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">{t.pbrCollar}</label>
              <TernarioBtn value={form.collar} onChange={(v) => handleChange('collar', v)}
                labelSi={t.pbrSi} labelNo={t.pbrNo} labelNs={t.pbrNoSe} />
            </div>

            <div>
              <label className="label">{t.pbrChapita}</label>
              <TernarioBtn value={form.chapita} onChange={(v) => handleChange('chapita', v)}
                labelSi={t.pbrSi} labelNo={t.pbrNo} labelNs={t.pbrNoSe} />
            </div>

            <Field label={t.pbrDescripcion}>
              <textarea className="field min-h-[100px]"
                placeholder={t.pbrDescripcionPh}
                value={form.descripcion}
                onChange={(e) => handleChange('descripcion', e.target.value)}
                required
              />
            </Field>

          </div>
        </StepCard>

        {/* ── COINCIDENCIAS (solo encontrado) ── */}
        {form.categoria === 'encontrado' && matchCandidatos.length > 0 && (
          <div className="rounded-2xl border-2 border-found/30 bg-found/5 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Dog className="h-5 w-5 shrink-0 text-found" />
              <p className="font-display font-extrabold text-ink">{t.pbrMatchTitle}</p>
            </div>

            <div className="space-y-2">
              {matchCandidatos.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setMatchPost(matchPost?.id === p.id ? null : p);
                    setMismaZona(null);
                    setZonaVisto('');
                    setHorarioVisto('');
                  }}
                  className={`w-full flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition ${
                    matchPost?.id === p.id
                      ? 'border-found bg-found/10'
                      : 'border-black/10 bg-white hover:border-found/40'
                  }`}
                >
                  {p.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0]} alt="" className="h-12 w-12 rounded-xl object-cover shrink-0" />
                  ) : (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-cream">
                      <Dog className="h-6 w-6 text-brand-primary/40" />
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-ink truncate">{p.nombre ?? 'Sin nombre'}</p>
                    <p className="text-xs text-ink-muted truncate">{p.zona} · {p.fecha}</p>
                  </div>
                  {matchPost?.id === p.id && (
                    <CheckCheck className="h-5 w-5 shrink-0 text-found" />
                  )}
                </button>
              ))}
              <button
                type="button"
                onClick={() => { setMatchPost(null); setMismaZona(null); }}
                className={`w-full rounded-2xl border-2 py-2.5 text-sm font-bold transition ${
                  matchPost === null && matchCandidatos.length > 0
                    ? 'border-black/20 bg-black/5 text-ink'
                    : 'border-black/10 text-ink-muted hover:border-black/20'
                }`}
              >
                {t.pbrMatchNo}
              </button>
            </div>

            {matchPost && (
              <div className="space-y-4 border-t border-found/20 pt-4">
                <div>
                  <p className="mb-2 text-sm font-bold text-ink">{t.pbrMatchMismaZona}</p>
                  <p className="mb-3 text-xs text-ink-muted">
                    Se perdió en: <span className="font-bold text-ink">{matchPost.zona}</span>
                  </p>
                  <div className="flex gap-2">
                    {([
                      [true,  t.adpSi],
                      [false, t.pbrMatchOtraZona],
                    ] as const).map(([v, l]) => (
                      <button
                        key={String(v)}
                        type="button"
                        onClick={() => setMismaZona(v)}
                        className={`flex-1 rounded-2xl border-2 py-2.5 text-sm font-bold transition ${
                          mismaZona === v
                            ? 'border-found bg-found/10 text-found'
                            : 'border-black/10 text-ink-muted hover:border-found/40'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {mismaZona === false && (
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
                      {t.pbrMatchDondeViste}
                    </label>
                    <AddressAutocomplete
                      value={zonaVisto}
                      onChange={setZonaVisto}
                      onSelectCoords={(lat, lng) => { setLatVisto(lat); setLngVisto(lng); }}
                      placeholder="Ej: Av. Colón 1200, Villa Mitre…"
                      ciudad={efectivaCiudad}
                    />
                  </div>
                )}

                {mismaZona !== null && (
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
                      {t.pbrMatchHora}
                    </label>
                    <input
                      type="time"
                      className="field"
                      value={horarioVisto}
                      onChange={(e) => setHorarioVisto(e.target.value)}
                    />
                  </div>
                )}

                {mismaZona === false && zonaVisto.trim() && (
                  <p className="rounded-xl bg-found/10 px-3 py-2 text-xs font-bold text-found">
                    {t.pbrMatchConfirm}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── PASO 3/4: dónde y cuándo ── */}
        <div ref={zonaRef}>
        <StepCard n={form.categoria === 'transito' ? 4 : 3}
          titulo={
            form.categoria === 'perdido'    ? t.pbrStep3Perdido :
            form.categoria === 'encontrado' ? t.pbrStep3Encontrado :
            form.categoria === 'transito'   ? t.pbrStep3Transito :
                                             t.pbrStep3Adopcion
          }>
          <div className="grid gap-4 sm:grid-cols-2">

            {perroData && form.categoria === 'perdido' && (
              <div className="sm:col-span-2">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-muted">{t.pbrDondePerdio}</p>
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
                    <Home className="h-4 w-4" /> {t.pbrEnMiCasa}
                  </button>
                  <button type="button"
                    onClick={() => { setUbicacion('otro'); handleChange('zona', ''); }}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 py-3 text-sm font-bold transition ${
                      ubicacion === 'otro'
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                        : 'border-black/10 text-ink-muted hover:border-brand-primary/40'
                    }`}>
                    <MapPin className="h-4 w-4" /> {t.pbrEnOtroLugar}
                  </button>
                </div>
                {ubicacion === 'casa' && !perroData.direccion && (
                  <p className="mt-2 text-xs text-ink-muted">
                    {t.pbrSinDireccion}{' '}
                    <Link href={`/mis-perros/${perroData.id}`} className="font-bold text-brand-primary underline">
                      {t.pbrAgregarPerfil}
                    </Link>
                    {' '}{t.pbrIngresalaAbajo}
                  </p>
                )}
              </div>
            )}

            <div className="sm:col-span-2 space-y-3">
              {gpsEstado === 'ok' ? (
                <div className="flex items-center justify-between rounded-2xl bg-good/10 px-4 py-3 ring-1 ring-good/20">
                  <div className="flex items-center gap-2 text-sm font-bold text-good">
                    <CheckCheck className="h-4 w-4 shrink-0" />
                    <span>{t.pbrGpsOk}</span>
                  </div>
                  <button type="button"
                    onClick={() => { setGpsEstado('idle'); setZonaManual(true); setForm((f) => ({ ...f, lat: null, lng: null })); }}
                    className="text-xs text-ink-muted hover:text-bad transition">{t.pbrGpsCambiar}</button>
                </div>
              ) : gpsEstado === 'cargando' ? (
                <div className="flex items-center gap-3 rounded-2xl border-2 border-brand-primary/30 bg-brand-primary/5 px-4 py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-brand-primary" />
                  <span className="text-sm font-bold text-brand-primary">{t.pbrGpsCargando}</span>
                </div>
              ) : !zonaManual ? (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={capturarGPS}
                    className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-brand-primary bg-brand-primary/5 px-4 py-4 text-sm font-bold text-brand-primary transition hover:bg-brand-primary/10 active:scale-[0.99]"
                  >
                    <Navigation className="h-5 w-5" />
                    {gpsEstado === 'error' ? t.pbrGpsError : t.pbrGpsUsar}
                  </button>
                  <button type="button" onClick={() => setZonaManual(true)}
                    className="w-full text-center text-xs text-ink-muted hover:text-brand-primary transition underline">
                    {t.pbrGpsManual}
                  </button>
                </div>
              ) : null}

              {(zonaManual || gpsEstado === 'ok') && (
                <Field label={gpsEstado === 'ok' ? t.pbrConfirmDir : t.pbrDireccionZona}>
                  <AddressAutocomplete
                    value={form.zona}
                    onChange={(v) => { handleChange('zona', v); setShowMapPicker(false); }}
                    onSelectCoords={(lat, lng) => {
                      setForm((f) => ({ ...f, lat, lng }));
                      setGpsEstado('ok');
                      setShowMapPicker(true);
                    }}
                    onClearCoords={() => { setForm((f) => ({ ...f, lat: null, lng: null })); setShowMapPicker(false); }}
                    placeholder="Ej: Av. Colón 1200, Villa Mitre, Centro…"
                    ciudad={efectivaCiudad}
                    required
                  />
                  {zonaManual && gpsEstado !== 'ok' && (
                    <button type="button" onClick={() => { setZonaManual(false); capturarGPS(); }}
                      className="mt-1 text-xs text-brand-primary hover:underline">
                      {t.pbrGpsVolver}
                    </button>
                  )}
                </Field>
              )}

              {showMapPicker && form.lat && form.lng && (
                <MapPinPicker
                  lat={form.lat}
                  lng={form.lng}
                  onChange={(lat, lng) => setForm((f) => ({ ...f, lat, lng }))}
                  onConfirm={() => setShowMapPicker(false)}
                />
              )}

            </div>

            <Field label={t.pbrFecha}>
              <input type="date" className="field" value={form.fecha}
                onChange={(e) => handleChange('fecha', e.target.value)} required />
            </Field>

            {form.categoria === 'encontrado' && (
              <Field label={t.pbrHorario}>
                <input type="time" className="field" value={form.horario}
                  onChange={(e) => handleChange('horario', e.target.value)} />
              </Field>
            )}
          </div>
        </StepCard>
        </div>

        {/* ── PASO 4/5: contacto ── */}
        <div ref={contactoRef}>
        <StepCard n={form.categoria === 'transito' ? 5 : 4} titulo={t.pbrContactoLabel}>
          {!sinContacto && (
            <Field label={t.pbrContactoLabel}>
              <input type="tel" className="field" placeholder="+54 9 291 ..."
                value={form.contacto} onChange={(e) => handleChange('contacto', e.target.value)} required={!sinContacto} />
              {form.contacto.trim() && form.contacto.replace(/\D/g, '').length < 10 && (
                <p className="mt-1.5 text-xs font-semibold text-bad">{t.pbrContactoError}</p>
              )}
            </Field>
          )}

          {form.categoria === 'encontrado' && (
            <button
              type="button"
              onClick={() => {
                setSinContacto((v) => !v);
                if (!sinContacto) handleChange('contacto', '');
              }}
              className={`mt-3 flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left text-sm transition ${
                sinContacto
                  ? 'border-brand-primary bg-brand-primary/5'
                  : 'border-black/10 hover:border-brand-primary/40'
              }`}
            >
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                sinContacto ? 'border-brand-primary bg-brand-primary' : 'border-black/20'
              }`}>
                {sinContacto && (
                  <svg viewBox="0 0 10 8" className="h-3 w-3 fill-white"><path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                )}
              </span>
              <div>
                <p className="font-bold text-ink">No quiero mostrar mi celular</p>
                <p className="text-xs text-ink-muted">El aviso se publica sin número de contacto</p>
              </div>
            </button>
          )}
        </StepCard>
        </div>

        {submitError && (
          <p className="flex items-start gap-1.5 text-sm text-bad">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> <span>{submitError}</span>
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> {t.pbrPublicando}</> : t.pbrPublicar}
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

function TernarioBtn({ value, onChange, labelSi, labelNo, labelNs }: {
  value: Ternario;
  onChange: (v: Ternario) => void;
  labelSi: string;
  labelNo: string;
  labelNs: string;
}) {
  return (
    <div className="flex gap-2">
      {([
        [true,  labelSi],
        [false, labelNo],
        [null,  labelNs],
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

function FotosUploader({ fotos, maxFotos, esPrincipalExterna, onAgregar, onRemover, onHacerPrincipal,
  labelAgregar, labelSubir, labelPrincipal, labelHacerPrincipal, labelGaleria, labelCamara }: {
  fotos: FotoPreview[]; maxFotos: number; esPrincipalExterna: boolean;
  onAgregar: (files: FileList | null) => void;
  onRemover: (idx: number) => void;
  onHacerPrincipal: (idx: number) => void;
  labelAgregar: string;
  labelSubir: string;
  labelPrincipal: string;
  labelHacerPrincipal: string;
  labelGaleria: string;
  labelCamara: string;
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
              onHacerPrincipal={() => onHacerPrincipal(i)}
              labelPrincipal={labelPrincipal}
              labelHacerPrincipal={labelHacerPrincipal} />
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
          <span className="text-sm font-bold">{esPrincipalExterna ? labelAgregar : labelSubir}</span>
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
          <ImagePlus className="h-4 w-4" /> {labelGaleria}
        </button>
        <button type="button" disabled={lleno} onClick={() => camaraRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand-primary/10 px-3 py-2 text-sm font-bold text-brand-primary transition hover:bg-brand-primary/15 disabled:cursor-not-allowed disabled:opacity-50">
          <Camera className="h-4 w-4" /> {labelCamara}
        </button>
        <span className="ml-auto self-center text-xs font-bold text-ink-muted">
          {fotos.length} / {maxFotos}
        </span>
      </div>
    </div>
  );
}

function Miniatura({ url, esPrincipal, pesoMb, onRemover, onHacerPrincipal, labelPrincipal, labelHacerPrincipal }: {
  url: string; esPrincipal: boolean; pesoMb: number; onRemover: () => void; onHacerPrincipal: () => void;
  labelPrincipal: string; labelHacerPrincipal: string;
}) {
  const pesada = pesoMb > MAX_PESO_MB;
  return (
    <div className={`relative aspect-square overflow-hidden rounded-2xl ring-1 ${esPrincipal ? 'ring-2 ring-brand-primary' : 'ring-black/10'}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="" className="h-full w-full object-cover" />
      {esPrincipal ? (
        <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-brand-primary px-2 py-0.5 text-[10px] font-extrabold text-white shadow">
          <Star className="h-3 w-3 fill-current" /> {labelPrincipal}
        </span>
      ) : (
        <button type="button" onClick={onHacerPrincipal}
          className="absolute left-1.5 top-1.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-ink shadow ring-1 ring-black/5 hover:bg-white">
          {labelHacerPrincipal}
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

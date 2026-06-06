'use client';

export const dynamic = 'force-dynamic';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  User, Phone, MapPin, Mail, Dog, Plus, ChevronRight, Loader2, AlertCircle,
  CheckCircle2, Pencil, Globe, BookOpen, KeyRound, Lock, QrCode, X,
  Instagram, Facebook, Sparkles, FileText, Camera, AlarmClock, History,
  Bell, Siren, ImagePlus, Heart,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { listarMisPerros, subirFotoPerfil, listarMisVacunasProximas, type Perro, type Vacuna } from '@/lib/perros';
import { contarPostsActivosDelUsuario, listarMisPostsResueltos, type Post } from '@/lib/posts';
import { useEffect, useCallback } from 'react';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { CIUDADES } from '@/lib/ciudades';
import QRCode from 'qrcode';

const ETIQUETA: Record<string, string> = {
  perdido: 'Perdido', encontrado: 'Visto', adopcion: 'Adopción',
  transito: 'Tránsito', busco_cuidador: 'Busca cuidador', cuidador_disponible: 'Cuidador',
};

const COLOR_CAT: Record<string, string> = {
  perdido: 'bg-lost/10 text-lost', encontrado: 'bg-found/10 text-found',
  adopcion: 'bg-adopt/10 text-amber-700', transito: 'bg-[#5b21b6]/10 text-[#5b21b6]',
  busco_cuidador: 'bg-teal-100 text-teal-700', cuidador_disponible: 'bg-teal-100 text-teal-700',
};

function diasHasta(fecha: string): number {
  return Math.ceil((new Date(fecha).getTime() - Date.now()) / 86400000);
}

export default function MiPerfilPage() {
  const { user, profile, isAuthenticated, isPro, loading: authLoading, saveProfile, resetPassword } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [pwSent,   setPwSent]   = useState(false);
  const [qrOpen,   setQrOpen]   = useState(false);

  async function handleChangePassword() {
    if (!user?.email) return;
    const err = await resetPassword(user.email);
    if (!err) { setPwSent(true); setTimeout(() => setPwSent(false), 6000); }
  }

  const [perros,        setPerros]        = useState<Perro[]>([]);
  const [postCount,     setPostCount]     = useState(0);
  const [resueltos,     setResueltos]     = useState<Post[]>([]);
  const [vacunas,       setVacunas]       = useState<Array<Vacuna & { perro_nombre: string }>>([]);
  const [cargando,      setCargando]      = useState(true);
  const [editando,      setEditando]      = useState(false);
  const [submitting,    setSubmitting]    = useState(false);
  const [success,       setSuccess]       = useState('');
  const [error,         setError]         = useState('');
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Form state
  const [nombre,        setNombre]        = useState('');
  const [apellido,      setApellido]      = useState('');
  const [telefono,      setTelefono]      = useState('');
  const [ciudadPerfil,  setCiudadPerfil]  = useState('');
  const [provincia,     setProvincia]     = useState('');
  const [pais,          setPais]          = useState('Argentina');
  const [direccion,     setDireccion]     = useState('');
  const [instagram,     setInstagram]     = useState('');
  const [facebook,      setFacebook]      = useState('');
  const [bio,           setBio]           = useState('');
  const [radioAlerta,   setRadioAlerta]   = useState(5);
  const [fotoUrl,       setFotoUrl]       = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setNombre(profile.nombre);
      setApellido(profile.apellido);
      setTelefono(profile.telefono);
      setDireccion(profile.direccion);
      setCiudadPerfil(profile.ciudad ?? '');
      setProvincia(profile.provincia ?? '');
      setPais(profile.pais ?? 'Argentina');
      setInstagram(profile.instagram ?? '');
      setFacebook(profile.facebook ?? '');
      setBio(profile.bio ?? '');
      setRadioAlerta(profile.radio_alerta_km ?? 5);
      setFotoUrl(profile.foto_url ?? null);
    }
  }, [profile]);

  function handleCiudadChange(nombre: string) {
    setCiudadPerfil(nombre);
    const found = CIUDADES.find((c) => c.nombre === nombre);
    if (found) setProvincia(found.provincia);
  }

  useEffect(() => {
    if (authLoading || !isAuthenticated) { setCargando(false); return; }
    Promise.all([
      listarMisPerros(),
      contarPostsActivosDelUsuario(),
      listarMisPostsResueltos(),
      listarMisVacunasProximas(),
    ])
      .then(([p, count, res, vac]) => {
        setPerros(p);
        setPostCount(count);
        setResueltos(res);
        setVacunas(vac);
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [isAuthenticated, authLoading]);

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setSuccess(''); setSubmitting(true);
    const err = await saveProfile({
      nombre, apellido, telefono, ciudad: ciudadPerfil, provincia, pais, direccion,
      instagram: instagram || null, facebook: facebook || null,
      bio: bio || null,
      radio_alerta_km: radioAlerta,
      foto_url: fotoUrl ?? null,
    });
    setSubmitting(false);
    if (err) { setError(err); return; }
    setSuccess('Perfil actualizado correctamente.');
    setEditando(false);
  }

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) { setError('La foto debe pesar menos de 5 MB.'); return; }
    setAvatarLoading(true);
    try {
      const url = await subirFotoPerfil(file, user.id);
      setFotoUrl(url);
      await saveProfile({
        nombre, apellido, telefono, ciudad: ciudadPerfil, provincia, pais, direccion,
        instagram: instagram || null, facebook: facebook || null,
        bio: bio || null, radio_alerta_km: radioAlerta, foto_url: url,
      });
    } catch { setError('Error al subir la foto.'); }
    finally { setAvatarLoading(false); }
  }

  if (authLoading || cargando) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="py-12 text-center">
        <p className="text-ink-muted">Iniciá sesión para ver tu perfil.</p>
        <Link href="/" className="btn-primary mt-4 inline-flex">Ir al inicio</Link>
      </div>
    );
  }

  // Vacunas próximas (en los próximos 60 días o vencidas)
  const vacunasAlerta = vacunas.filter((v) => diasHasta(v.proxima) <= 60);

  return (
    <div className="mx-auto max-w-2xl py-8 md:py-10 space-y-6">

      {/* ── HEADER con avatar ── */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative h-20 w-20 overflow-hidden rounded-2xl bg-brand-cream ring-2 ring-brand-primary/20 transition hover:ring-brand-primary"
          >
            {fotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={fotoUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1">
                <User className="h-8 w-8 text-brand-primary/40" />
              </div>
            )}
            {avatarLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              </div>
            )}
            <div className="absolute bottom-0 inset-x-0 flex items-center justify-center bg-black/30 py-1">
              <Camera className="h-3.5 w-3.5 text-white" />
            </div>
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
        </div>

        {/* Nombre + acciones */}
        <div className="flex-1 min-w-0">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary">
            <User className="h-3.5 w-3.5" /> Mi perfil
          </span>
          <h1 className="mt-1 font-display text-2xl font-black tracking-tight text-ink truncate">
            {profile ? `${profile.nombre} ${profile.apellido}` : 'Mi perfil'}
          </h1>
          {profile?.bio && (
            <p className="mt-0.5 text-sm text-ink-muted line-clamp-2">{profile.bio}</p>
          )}
        </div>

        {/* Botones QR + Obediencia */}
        <div className="flex flex-col gap-2 shrink-0">
          {isPro ? (
            <button type="button" onClick={() => setQrOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-cream px-3 py-2 text-sm font-bold text-brand-primary transition hover:bg-brand-primary/10">
              <QrCode className="h-4 w-4" /> QR
            </button>
          ) : (
            <Link href="/planes"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-cream px-3 py-2 text-sm font-bold text-brand-primary transition hover:bg-brand-primary/10">
              <QrCode className="h-4 w-4" /> QR
            </Link>
          )}
          {isPro ? (
            <a href="/plan-obediencia-canina.pdf" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-primary px-3 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-brand-primary/90">
              <BookOpen className="h-4 w-4" /> Obediencia
            </a>
          ) : (
            <Link href="/planes"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-primary px-3 py-2 text-sm font-bold text-white shadow-soft transition hover:bg-brand-primary/90">
              <BookOpen className="h-4 w-4" /> Obediencia
            </Link>
          )}
        </div>
      </div>

      {/* Modal QR */}
      {qrOpen && user && (
        <QRModal
          userId={user.id}
          nombre={profile ? `${profile.nombre} ${profile.apellido}` : user.email ?? ''}
          onClose={() => setQrOpen(false)}
        />
      )}

      {/* ── SOS: Botón perro perdido ── */}
      {isPro && (
        <Link
          href="/publicar?cat=perdido"
          className="flex items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-r from-lost to-[#c0392b] p-4 text-white shadow-soft transition hover:opacity-90 active:scale-[0.99]"
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/20">
            <Siren className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="font-display text-base font-black">🚨 Perro perdido — alertar ahora</p>
            <p className="text-xs text-white/80">Publicá un aviso de emergencia y notificá a tu comunidad al instante.</p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 opacity-70" />
        </Link>
      )}

      {/* ── Datos personales ── */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-extrabold text-ink">Datos personales</h2>
          {!editando && (
            <button type="button" onClick={() => setEditando(true)}
              className="inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold text-brand-primary hover:bg-brand-primary/10 transition">
              <Pencil className="h-3.5 w-3.5" /> Editar
            </button>
          )}
        </div>

        {editando ? (
          <form onSubmit={handleGuardar} className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input type="text" required placeholder="Nombre" value={nombre}
                onChange={(e) => setNombre(e.target.value)} className="field pl-9" />
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input type="text" required placeholder="Apellido" value={apellido}
                onChange={(e) => setApellido(e.target.value)} className="field pl-9" />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input type="tel" required placeholder="Teléfono" value={telefono}
                onChange={(e) => setTelefono(e.target.value)} className="field pl-9" />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted pointer-events-none z-10" />
              <select required value={ciudadPerfil} onChange={(e) => handleCiudadChange(e.target.value)}
                className="field pl-9 appearance-none">
                <option value="">Seleccioná tu ciudad</option>
                {CIUDADES.map((c) => (
                  <option key={c.nombre} value={c.nombre}>{c.nombre}</option>
                ))}
              </select>
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input type="text" required placeholder="Provincia" value={provincia}
                onChange={(e) => setProvincia(e.target.value)} className="field pl-9" />
            </div>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input type="text" required placeholder="País" value={pais}
                onChange={(e) => setPais(e.target.value)} className="field pl-9" />
            </div>
            <AddressAutocomplete value={direccion} onChange={setDireccion} ciudad={ciudadPerfil} required />

            {/* Bio — Pro */}
            {isPro ? (
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-muted">Descripción personal</label>
                <textarea
                  className="field w-full resize-none"
                  rows={3}
                  placeholder="Contá algo sobre vos: experiencia con perros, disponibilidad, patio…"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={280}
                />
                <p className="mt-0.5 text-right text-[10px] text-ink-muted">{bio.length}/280</p>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-2xl border-2 border-dashed border-black/10 px-4 py-3">
                <span className="text-sm text-ink-muted">Descripción personal</span>
                <Link href="/planes" className="flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline">
                  <Sparkles className="h-3.5 w-3.5" /> Pro
                </Link>
              </div>
            )}

            {/* Instagram y Facebook — Pro */}
            {isPro ? (
              <>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input type="text" placeholder="Instagram (ej: @usuario)" value={instagram}
                    onChange={(e) => setInstagram(e.target.value)} className="field pl-9" />
                </div>
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input type="text" placeholder="Facebook (ej: facebook.com/usuario)" value={facebook}
                    onChange={(e) => setFacebook(e.target.value)} className="field pl-9" />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between rounded-2xl border-2 border-dashed border-black/10 px-4 py-3">
                <div className="flex items-center gap-2 text-sm text-ink-muted">
                  <Instagram className="h-4 w-4" />
                  <span>Instagram y Facebook</span>
                </div>
                <Link href="/planes" className="flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline">
                  <Sparkles className="h-3.5 w-3.5" /> Pro
                </Link>
              </div>
            )}

            {/* Radio de alerta — Pro */}
            {isPro && (
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-muted flex items-center gap-1">
                  <Bell className="h-3.5 w-3.5" /> Radio de alertas de perros perdidos
                </label>
                <div className="flex gap-2">
                  {[1, 3, 5, 10, 20].map((km) => (
                    <button key={km} type="button"
                      onClick={() => setRadioAlerta(km)}
                      className={`flex-1 rounded-xl border-2 py-2 text-xs font-bold transition ${
                        radioAlerta === km
                          ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                          : 'border-black/10 text-ink-muted hover:border-brand-primary/40'
                      }`}
                    >
                      {km} km
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-[10px] text-ink-muted">Te avisamos cuando hay un perro perdido en este radio desde tu casa.</p>
              </div>
            )}

            {error && (
              <p className="flex items-center gap-1.5 rounded-xl bg-bad/10 p-3 text-sm font-semibold text-bad">
                <AlertCircle className="h-4 w-4 shrink-0" />{error}
              </p>
            )}
            <div className="flex gap-2">
              <button type="submit" disabled={submitting} className="btn-primary flex-1 disabled:opacity-60">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar cambios'}
              </button>
              <button type="button" onClick={() => setEditando(false)}
                className="flex-1 rounded-2xl border-2 border-black/10 py-2.5 text-sm font-bold text-ink-muted hover:border-black/20">
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            {success && (
              <p className="flex items-center gap-1.5 rounded-xl bg-good/10 p-3 text-sm font-semibold text-good">
                <CheckCircle2 className="h-4 w-4 shrink-0" />{success}
              </p>
            )}
            <InfoRow icon={<Mail className="h-4 w-4 text-brand-primary" />} label="Email" value={user?.email ?? ''} />
            <InfoRow icon={<User className="h-4 w-4 text-brand-primary" />} label="Nombre" value={profile ? `${profile.nombre} ${profile.apellido}` : '—'} />
            <InfoRow icon={<Phone className="h-4 w-4 text-brand-primary" />} label="Teléfono" value={profile?.telefono ?? '—'} />
            <InfoRow icon={<MapPin className="h-4 w-4 text-brand-primary" />} label="Ciudad" value={profile?.ciudad ?? '—'} />
            <InfoRow icon={<MapPin className="h-4 w-4 text-brand-primary" />} label="Provincia" value={profile?.provincia ?? '—'} />
            <InfoRow icon={<Globe className="h-4 w-4 text-brand-primary" />} label="País" value={profile?.pais ?? '—'} />
            <InfoRow icon={<MapPin className="h-4 w-4 text-brand-primary" />} label="Dirección" value={profile?.direccion ?? '—'} />

            {isPro && profile?.bio && (
              <InfoRow icon={<User className="h-4 w-4 text-brand-primary" />} label="Sobre mí" value={profile.bio} />
            )}

            {isPro && (
              <>
                <InfoRow icon={<Bell className="h-4 w-4 text-brand-primary" />} label="Radio alertas" value={`${profile?.radio_alerta_km ?? 5} km`} />
                {profile?.instagram && (
                  <InfoRow icon={<Instagram className="h-4 w-4 text-brand-primary" />} label="Instagram" value={profile.instagram} />
                )}
                {profile?.facebook && (
                  <InfoRow icon={<Facebook className="h-4 w-4 text-brand-primary" />} label="Facebook" value={profile.facebook} />
                )}
                {!profile?.instagram && !profile?.facebook && (
                  <div className="flex items-center justify-between py-2 border-b border-black/5">
                    <div className="flex items-center gap-3">
                      <Instagram className="h-4 w-4 text-brand-primary shrink-0" />
                      <span className="text-xs text-ink-muted">Redes sociales</span>
                    </div>
                    <button type="button" onClick={() => setEditando(true)}
                      className="text-xs font-bold text-brand-primary hover:underline">
                      + Agregar
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Contraseña */}
            <div className="flex items-center gap-3 py-2">
              <span className="shrink-0"><Lock className="h-4 w-4 text-brand-primary" /></span>
              <span className="text-xs text-ink-muted w-20 shrink-0">Contraseña</span>
              <span className="text-sm font-semibold text-ink tracking-widest">••••••••</span>
              <button type="button" onClick={handleChangePassword}
                className="ml-auto inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition hover:bg-brand-primary/10 text-brand-primary">
                {pwSent
                  ? <><CheckCircle2 className="h-3.5 w-3.5 text-good" /><span className="text-good">Link enviado</span></>
                  : <><KeyRound className="h-3.5 w-3.5" /> Cambiar</>}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Recordatorios de vacunas (Pro) ── */}
      {isPro && vacunas.length > 0 && (
        <div className="card p-5 space-y-3">
          <h2 className="font-display text-base font-extrabold text-ink flex items-center gap-2">
            <AlarmClock className="h-4 w-4 text-brand-primary" /> Próximas vacunas
            {vacunasAlerta.length > 0 && (
              <span className="ml-1 rounded-full bg-bad/10 px-2 py-0.5 text-xs font-bold text-bad">
                {vacunasAlerta.length} pendiente{vacunasAlerta.length !== 1 ? 's' : ''}
              </span>
            )}
          </h2>
          <div className="space-y-2">
            {vacunas.slice(0, 5).map((v) => {
              const dias = diasHasta(v.proxima);
              const color = dias < 0 ? 'bg-bad/10 text-bad' : dias <= 14 ? 'bg-warn/15 text-amber-700' : dias <= 60 ? 'bg-amber-50 text-amber-600' : 'bg-good/10 text-good';
              const label = dias < 0 ? `Vencida hace ${Math.abs(dias)} días` : dias === 0 ? 'Hoy' : `En ${dias} días`;
              return (
                <div key={v.id} className="flex items-center gap-3 rounded-xl bg-brand-cream px-4 py-3">
                  <div className={`rounded-lg px-2.5 py-1 text-xs font-bold ${color}`}>{label}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-ink truncate">{v.nombre}</p>
                    <p className="text-xs text-ink-muted">{v.perro_nombre} · {new Date(v.proxima + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <Link href={`/mis-perros`} className="text-xs font-bold text-brand-primary hover:underline shrink-0">
                    Ver →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Mis avisos activos ── */}
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-extrabold text-ink flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand-primary" /> Mis avisos activos
          </h2>
          <Link href="/publicaciones?solo=1"
            className="text-xs font-bold text-brand-primary hover:underline transition">
            Ver todos →
          </Link>
        </div>

        <div className="mt-3 flex items-center gap-3">
          {isPro ? (
            <div className="flex items-center gap-2">
              <span className="font-display text-3xl font-black text-ink">{postCount}</span>
              <span className="text-sm text-ink-muted">avisos publicados</span>
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[#7c3aed]/10 px-2.5 py-1 text-xs font-bold text-[#7c3aed]">
                <Sparkles className="h-3 w-3" /> Sin límite
              </span>
            </div>
          ) : (
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold text-ink">
                  <span className={postCount >= 5 ? 'text-bad' : 'text-ink'}>{postCount}</span>
                  <span className="text-ink-muted"> / 5 avisos</span>
                </span>
                {postCount >= 5 ? (
                  <Link href="/planes" className="text-xs font-bold text-brand-primary hover:underline">
                    <Sparkles className="h-3 w-3 inline mr-0.5" /> Pasate a Pro
                  </Link>
                ) : (
                  <span className="text-xs text-ink-muted">{5 - postCount} disponible{5 - postCount !== 1 ? 's' : ''}</span>
                )}
              </div>
              <div className="h-2 w-full rounded-full bg-black/8 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${postCount >= 5 ? 'bg-bad' : postCount >= 4 ? 'bg-warn' : 'bg-good'}`}
                  style={{ width: `${Math.min((postCount / 5) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Historial de avisos resueltos (Pro) ── */}
      {isPro && (
        <div className="card p-5 space-y-3">
          <h2 className="font-display text-base font-extrabold text-ink flex items-center gap-2">
            <History className="h-4 w-4 text-brand-primary" /> Historial de avisos resueltos
            {resueltos.length > 0 && (
              <span className="ml-1 rounded-full bg-good/10 px-2 py-0.5 text-xs font-bold text-good">
                {resueltos.length}
              </span>
            )}
          </h2>
          {resueltos.length === 0 ? (
            <p className="text-sm text-ink-muted py-2">Todavía no tenés avisos resueltos.</p>
          ) : (
            <div className="space-y-2">
              {resueltos.map((p) => (
                <Link key={p.id} href={`/publicaciones/${p.id}`}
                  className="flex items-center gap-3 rounded-xl bg-brand-cream px-4 py-3 hover:bg-brand-primary/10 transition">
                  {p.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0]} alt={p.nombre ?? ''} className="h-10 w-10 rounded-xl object-cover shrink-0" />
                  ) : (
                    <div className="h-10 w-10 rounded-xl bg-good/10 flex items-center justify-center shrink-0">
                      <Heart className="h-5 w-5 text-good" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-ink truncate">{p.nombre ?? 'Sin nombre'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${COLOR_CAT[p.categoria] ?? 'bg-black/5 text-ink-muted'}`}>
                        {ETIQUETA[p.categoria] ?? p.categoria}
                      </span>
                      <span className="text-xs text-ink-muted">{p.zona}</span>
                    </div>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-good shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Mis perros ── */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-extrabold text-ink flex items-center gap-2">
            <Dog className="h-5 w-5 text-brand-primary" /> Mis perros
          </h2>
          <Link href="/mis-perros/nuevo"
            className="inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold text-brand-primary hover:bg-brand-primary/10 transition">
            <Plus className="h-3.5 w-3.5" /> Agregar
          </Link>
        </div>

        {perros.length === 0 ? (
          <div className="text-center py-6">
            <Dog className="h-10 w-10 text-brand-primary/20 mx-auto mb-2" />
            <p className="text-sm text-ink-muted">Todavía no registraste ningún perro.</p>
            <Link href="/mis-perros/nuevo" className="btn-primary mt-3 inline-flex gap-1 text-sm">
              <Plus className="h-4 w-4" /> Registrar perro
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {perros.map((p) => (
              <Link key={p.id} href={`/mis-perros/${p.id}`}
                className="flex items-center gap-3 rounded-xl bg-brand-cream px-4 py-3 hover:bg-brand-primary/10 transition">
                {p.foto_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.foto_url} alt={p.nombre} className="h-10 w-10 rounded-xl object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                    <Dog className="h-5 w-5 text-brand-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-ink truncate">{p.nombre}</p>
                  <p className="text-xs text-ink-muted truncate">
                    {[p.raza, p.color, p.tamano].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-ink-muted shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-black/5 last:border-0">
      <span className="shrink-0">{icon}</span>
      <span className="text-xs text-ink-muted w-20 shrink-0">{label}</span>
      <span className="text-sm font-semibold text-ink">{value}</span>
    </div>
  );
}

/* ── Modal QR rotativo ── */
function QRModal({ userId, nombre, onClose }: { userId: string; nombre: string; onClose: () => void }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [countdown, setCountdown] = useState(0);

  const generarQR = useCallback(async () => {
    const window30 = Math.floor(Date.now() / 30000);
    const payload  = `https://www.mivecindog.com.ar/verificar/${userId}?t=${window30}`;
    try {
      const url = await QRCode.toDataURL(payload, {
        width: 280, margin: 2,
        color: { dark: '#1e3a5f', light: '#ffffff' },
      });
      setQrDataUrl(url);
    } catch { /* ignore */ }
  }, [userId]);

  useEffect(() => {
    generarQR();
    function calcCountdown() { return 30 - (Math.floor(Date.now() / 1000) % 30); }
    setCountdown(calcCountdown());
    const tick = setInterval(() => {
      const secs = calcCountdown();
      setCountdown(secs);
      if (secs === 30) generarQR();
    }, 1000);
    return () => clearInterval(tick);
  }, [generarQR]);

  const pct = countdown / 30;
  const r = 20;
  const circum = 2 * Math.PI * r;
  const dashOffset = circum * (1 - pct);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-xs rounded-[32px] bg-white px-7 py-8 shadow-2xl text-center">
        <div className="flex items-center justify-between mb-5">
          <div className="text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-muted">Vecindog</p>
            <p className="font-display text-lg font-black text-ink leading-tight">{nombre}</p>
          </div>
          <button type="button" onClick={onClose}
            className="rounded-xl p-1.5 text-ink-muted hover:bg-brand-cream transition">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex justify-center mb-4">
          {qrDataUrl
            ? <img src={qrDataUrl} alt="QR Vecindog" className="rounded-2xl" width={220} height={220} />
            : <div className="h-[220px] w-[220px] rounded-2xl bg-brand-cream animate-pulse" />}
        </div>
        <div className="flex flex-col items-center gap-1.5 mb-4">
          <div className="relative h-12 w-12">
            <svg className="absolute inset-0 -rotate-90" width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
              <circle cx="24" cy="24" r={r} fill="none" stroke="#EE5A3B" strokeWidth="4"
                strokeDasharray={circum} strokeDashoffset={dashOffset} strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.9s linear' }} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-ink">{countdown}</span>
          </div>
          <p className="text-xs text-ink-muted">Caduca en {countdown}s · se renueva solo</p>
        </div>
        <div className="rounded-2xl bg-brand-cream px-4 py-3 text-xs text-ink-muted">
          🏷️ Mostrá este QR para acceder a descuentos exclusivos de socios Vecindog.
        </div>
      </div>
    </div>
  );
}

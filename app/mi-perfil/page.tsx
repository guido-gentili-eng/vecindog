'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { User, Phone, MapPin, Mail, Dog, Plus, ChevronRight, Loader2, AlertCircle, CheckCircle2, Pencil, Globe, BookOpen, KeyRound, Lock, QrCode, X, Instagram, Facebook, Sparkles, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { listarMisPerros, type Perro } from '@/lib/perros';
import { contarPostsActivosDelUsuario } from '@/lib/posts';
import { useEffect, useCallback } from 'react';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { CIUDADES } from '@/lib/ciudades';
import QRCode from 'qrcode';

export default function MiPerfilPage() {
  const { user, profile, isAuthenticated, isPro, loading: authLoading, saveProfile, resetPassword } = useAuth();
  const [pwSent,   setPwSent]   = useState(false);
  const [qrOpen,   setQrOpen]   = useState(false);

  async function handleChangePassword() {
    if (!user?.email) return;
    const err = await resetPassword(user.email);
    if (!err) { setPwSent(true); setTimeout(() => setPwSent(false), 6000); }
  }

  const [perros,       setPerros]       = useState<Perro[]>([]);
  const [postCount,    setPostCount]    = useState(0);
  const [cargando,     setCargando]     = useState(true);
  const [editando,     setEditando]     = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [success,      setSuccess]      = useState('');
  const [error,        setError]        = useState('');

  // Form state
  const [nombre,       setNombre]       = useState('');
  const [apellido,     setApellido]     = useState('');
  const [telefono,     setTelefono]     = useState('');
  const [ciudadPerfil, setCiudadPerfil] = useState('');
  const [provincia,    setProvincia]    = useState('');
  const [pais,         setPais]         = useState('Argentina');
  const [direccion,    setDireccion]    = useState('');
  const [instagram,    setInstagram]    = useState('');
  const [facebook,     setFacebook]     = useState('');

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
    ])
      .then(([p, count]) => { setPerros(p); setPostCount(count); })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [isAuthenticated, authLoading]);

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setSuccess(''); setSubmitting(true);
    const err = await saveProfile({ nombre, apellido, telefono, ciudad: ciudadPerfil, provincia, pais, direccion, instagram: instagram || null, facebook: facebook || null });
    setSubmitting(false);
    if (err) { setError(err); return; }
    setSuccess('Perfil actualizado correctamente.');
    setEditando(false);
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

  return (
    <div className="mx-auto max-w-2xl py-8 md:py-10 space-y-6">

      {/* Título */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary">
            <User className="h-3.5 w-3.5" /> Mi perfil
          </span>
          <div className="mt-2 flex items-center gap-3">
            <h1 className="font-display text-3xl font-black tracking-tight text-ink">
              {profile ? `${profile.nombre} ${profile.apellido}` : 'Mi perfil'}
            </h1>
            {/* Botón QR — visible siempre; Free va a /planes */}
            {isPro ? (
              <button
                type="button"
                onClick={() => setQrOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-cream px-3 py-2 text-sm font-bold text-brand-primary transition hover:bg-brand-primary/10"
              >
                <QrCode className="h-4 w-4" /> QR
              </button>
            ) : (
              <Link href="/planes"
                className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-cream px-3 py-2 text-sm font-bold text-brand-primary transition hover:bg-brand-primary/10"
              >
                <QrCode className="h-4 w-4" /> QR
              </Link>
            )}
          </div>
        </div>
        {/* Plan de Obediencia — visible siempre; Free va a /planes */}
        {isPro ? (
          <a
            href="/plan-obediencia-canina.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex shrink-0 items-center gap-2 rounded-2xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-brand-primary/90"
          >
            <BookOpen className="h-4 w-4" />
            Plan de Obediencia
          </a>
        ) : (
          <Link
            href="/planes"
            className="mt-1 inline-flex shrink-0 items-center gap-2 rounded-2xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:bg-brand-primary/90"
          >
            <BookOpen className="h-4 w-4" />
            Plan de Obediencia
          </Link>
        )}
      </div>

      {/* Modal QR */}
      {qrOpen && user && (
        <QRModal
          userId={user.id}
          nombre={profile ? `${profile.nombre} ${profile.apellido}` : user.email ?? ''}
          onClose={() => setQrOpen(false)}
        />
      )}

      {/* Datos personales */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-extrabold text-ink">Datos personales</h2>
          {!editando && (
            <button
              type="button"
              onClick={() => setEditando(true)}
              className="inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold text-brand-primary hover:bg-brand-primary/10 transition"
            >
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
            {/* Ciudad */}
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
            {/* Provincia */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input type="text" required placeholder="Provincia" value={provincia}
                onChange={(e) => setProvincia(e.target.value)} className="field pl-9" />
            </div>
            {/* País */}
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input type="text" required placeholder="País" value={pais}
                onChange={(e) => setPais(e.target.value)} className="field pl-9" />
            </div>
            <AddressAutocomplete
              value={direccion}
              onChange={setDireccion}
              ciudad={ciudadPerfil}
              required
            />

            {/* Instagram y Facebook — solo Pro */}
            {isPro ? (
              <>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    type="text"
                    placeholder="Instagram (ej: @usuario)"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="field pl-9"
                  />
                </div>
                <div className="relative">
                  <Facebook className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    type="text"
                    placeholder="Facebook (ej: facebook.com/usuario)"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    className="field pl-9"
                  />
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

            {/* Instagram y Facebook — solo Pro, modo vista */}
            {isPro && (
              <>
                {profile?.instagram && (
                  <InfoRow
                    icon={<Instagram className="h-4 w-4 text-brand-primary" />}
                    label="Instagram"
                    value={profile.instagram}
                  />
                )}
                {profile?.facebook && (
                  <InfoRow
                    icon={<Facebook className="h-4 w-4 text-brand-primary" />}
                    label="Facebook"
                    value={profile.facebook}
                  />
                )}
                {!profile?.instagram && !profile?.facebook && (
                  <div className="flex items-center justify-between py-2 border-b border-black/5">
                    <div className="flex items-center gap-3">
                      <Instagram className="h-4 w-4 text-brand-primary shrink-0" />
                      <span className="text-xs text-ink-muted">Redes sociales</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditando(true)}
                      className="text-xs font-bold text-brand-primary hover:underline"
                    >
                      + Agregar
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Fila contraseña */}
            <div className="flex items-center gap-3 py-2">
              <span className="shrink-0"><Lock className="h-4 w-4 text-brand-primary" /></span>
              <span className="text-xs text-ink-muted w-20 shrink-0">Contraseña</span>
              <span className="text-sm font-semibold text-ink tracking-widest">••••••••</span>
              <button
                type="button"
                onClick={handleChangePassword}
                title="Cambiar contraseña por email"
                className="ml-auto inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition hover:bg-brand-primary/10
                  text-brand-primary"
              >
                {pwSent
                  ? <><CheckCircle2 className="h-3.5 w-3.5 text-good" /><span className="text-good">Link enviado</span></>
                  : <><KeyRound className="h-3.5 w-3.5" /> Cambiar</>}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mis avisos — contador de uso */}
      <div className="card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-extrabold text-ink flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand-primary" /> Mis avisos activos
          </h2>
          <Link href="/publicaciones?cat=todas"
            onClick={() => {/* prefiltrar a soloMios desde URL no es soportado aún */}}
            className="text-xs font-bold text-brand-primary hover:underline transition">
            Ver avisos →
          </Link>
        </div>

        <div className="mt-3 flex items-center gap-3">
          {isPro ? (
            /* Pro: solo muestra el número sin límite */
            <div className="flex items-center gap-2">
              <span className="font-display text-3xl font-black text-ink">{postCount}</span>
              <span className="text-sm text-ink-muted">avisos publicados</span>
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-[#7c3aed]/10 px-2.5 py-1 text-xs font-bold text-[#7c3aed]">
                <Sparkles className="h-3 w-3" /> Sin límite
              </span>
            </div>
          ) : (
            /* Free: muestra X/5 con barra de progreso */
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

      {/* Mis perros */}
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

  // Genera el token basado en ventana de 30 segundos
  const generarQR = useCallback(async () => {
    const window30 = Math.floor(Date.now() / 30000);
    const payload  = `https://www.mivecindog.com.ar/verificar/${userId}?t=${window30}`;
    try {
      const url = await QRCode.toDataURL(payload, {
        width: 280,
        margin: 2,
        color: { dark: '#1e3a5f', light: '#ffffff' },
      });
      setQrDataUrl(url);
    } catch { /* ignore */ }
  }, [userId]);

  useEffect(() => {
    generarQR();

    // Calcular segundos restantes hasta próxima ventana
    function calcCountdown() {
      return 30 - (Math.floor(Date.now() / 1000) % 30);
    }

    setCountdown(calcCountdown());

    const tick = setInterval(() => {
      const secs = calcCountdown();
      setCountdown(secs);
      if (secs === 30) generarQR(); // Nueva ventana → nuevo QR
    }, 1000);

    return () => clearInterval(tick);
  }, [generarQR]);

  // Porcentaje del arco de cuenta regresiva
  const pct      = countdown / 30;
  const r        = 20;
  const circum   = 2 * Math.PI * r;
  const dashOffset = circum * (1 - pct);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-xs rounded-[32px] bg-white px-7 py-8 shadow-2xl text-center">
        {/* Header */}
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

        {/* QR */}
        <div className="flex justify-center mb-4">
          {qrDataUrl
            ? <img src={qrDataUrl} alt="QR Vecindog" className="rounded-2xl" width={220} height={220} />
            : <div className="h-[220px] w-[220px] rounded-2xl bg-brand-cream animate-pulse" />
          }
        </div>

        {/* Cuenta regresiva circular */}
        <div className="flex flex-col items-center gap-1.5 mb-4">
          <div className="relative h-12 w-12">
            <svg className="absolute inset-0 -rotate-90" width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
              <circle
                cx="24" cy="24" r={r}
                fill="none" stroke="#EE5A3B" strokeWidth="4"
                strokeDasharray={circum}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.9s linear' }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-ink">
              {countdown}
            </span>
          </div>
          <p className="text-xs text-ink-muted">Caduca en {countdown}s · se renueva solo</p>
        </div>

        {/* Nota plan pago */}
        <div className="rounded-2xl bg-brand-cream px-4 py-3 text-xs text-ink-muted">
          🏷️ Mostrá este QR para acceder a descuentos exclusivos de socios Vecindog.
        </div>
      </div>
    </div>
  );
}

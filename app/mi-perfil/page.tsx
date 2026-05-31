'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import Link from 'next/link';
import { User, Phone, MapPin, Mail, Dog, Plus, ChevronRight, Loader2, AlertCircle, CheckCircle2, Pencil } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { listarMisPerros, type Perro } from '@/lib/perros';
import { useEffect } from 'react';
import AddressAutocomplete from '@/components/AddressAutocomplete';

export default function MiPerfilPage() {
  const { user, profile, isAuthenticated, loading: authLoading, saveProfile } = useAuth();

  const [perros,    setPerros]    = useState<Perro[]>([]);
  const [cargando,  setCargando]  = useState(true);
  const [editando,  setEditando]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success,   setSuccess]   = useState('');
  const [error,     setError]     = useState('');

  // Form state
  const [nombre,    setNombre]    = useState('');
  const [apellido,  setApellido]  = useState('');
  const [telefono,  setTelefono]  = useState('');
  const [direccion, setDireccion] = useState('');

  useEffect(() => {
    if (profile) {
      setNombre(profile.nombre);
      setApellido(profile.apellido);
      setTelefono(profile.telefono);
      setDireccion(profile.direccion);
    }
  }, [profile]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) { setCargando(false); return; }
    listarMisPerros()
      .then(setPerros)
      .catch(() => {})
      .finally(() => setCargando(false));
  }, [isAuthenticated, authLoading]);

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setSuccess(''); setSubmitting(true);
    const err = await saveProfile({ nombre, apellido, telefono, direccion });
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
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-bold text-brand-primary">
          <User className="h-3.5 w-3.5" /> Mi perfil
        </span>
        <h1 className="mt-2 font-display text-3xl font-black tracking-tight text-ink">
          {profile ? `${profile.nombre} ${profile.apellido}` : 'Mi perfil'}
        </h1>
      </div>

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
            <AddressAutocomplete
              value={direccion}
              onChange={setDireccion}
              required
            />
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
            <InfoRow icon={<MapPin className="h-4 w-4 text-brand-primary" />} label="Dirección" value={profile?.direccion ?? '—'} />
          </div>
        )}
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

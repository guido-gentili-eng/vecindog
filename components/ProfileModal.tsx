'use client';

import { useState } from 'react';
import { User, Phone, MapPin, Globe, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import AddressAutocomplete from '@/components/AddressAutocomplete';
import { CIUDADES } from '@/lib/ciudades';

export default function ProfileModal() {
  const { user, isAuthenticated, hasProfile, loading, profileLoading, saveProfile } = useAuth();
  const { t } = useLanguage();

  const [nombre,       setNombre]       = useState('');
  const [apellido,     setApellido]     = useState('');
  const [telefono,     setTelefono]     = useState('');
  const [ciudadPerfil, setCiudadPerfil] = useState('');
  const [provincia,    setProvincia]    = useState('');
  const [pais,         setPais]         = useState('Argentina');
  const [direccion,    setDireccion]    = useState('');
  const [error,        setError]        = useState('');
  const [submitting,   setSubmitting]   = useState(false);

  if (loading || profileLoading || !isAuthenticated || hasProfile) return null;

  function handleCiudadChange(nombre: string) {
    setCiudadPerfil(nombre);
    const found = CIUDADES.find((c) => c.nombre === nombre);
    if (found) setProvincia(found.provincia);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const err = await saveProfile({ nombre, apellido, telefono, ciudad: ciudadPerfil, provincia, pais, direccion });
      if (err) setError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-sm rounded-t-[32px] bg-white px-7 pb-10 pt-7 shadow-2xl sm:rounded-[32px] sm:pb-8 max-h-[90vh] overflow-y-auto">

        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-black/10 sm:hidden" />

        <div className="mb-6 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-soft">
            <User className="h-8 w-8" />
          </span>
          <h1 className="mt-3 font-display text-2xl font-black text-ink">{t.profileTitle}</h1>
          <p className="mt-1 text-sm text-ink-muted">{t.profileSub}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email */}
          <input type="email" value={user?.email ?? ''} disabled
            className="field w-full bg-black/5 text-ink-muted cursor-not-allowed" />

          {/* Nombre */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input type="text" required placeholder={t.firstName} value={nombre}
              onChange={(e) => setNombre(e.target.value)} className="field pl-9" />
          </div>

          {/* Apellido */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input type="text" required placeholder={t.lastName} value={apellido}
              onChange={(e) => setApellido(e.target.value)} className="field pl-9" />
          </div>

          {/* Teléfono */}
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input type="tel" required placeholder={t.phone} value={telefono}
              onChange={(e) => setTelefono(e.target.value)} className="field pl-9" />
          </div>

          {/* Ciudad */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted pointer-events-none z-10" />
            <select required value={ciudadPerfil} onChange={(e) => handleCiudadChange(e.target.value)}
              className="field pl-9 appearance-none">
              <option value="">{t.selectCity}</option>
              {CIUDADES.map((c) => (
                <option key={c.nombre} value={c.nombre}>{c.nombre}</option>
              ))}
            </select>
          </div>

          {/* Provincia (autocompletada) */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input type="text" required placeholder={t.province} value={provincia}
              onChange={(e) => setProvincia(e.target.value)} className="field pl-9" />
          </div>

          {/* País */}
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input type="text" required placeholder={t.country} value={pais}
              onChange={(e) => setPais(e.target.value)} className="field pl-9" />
          </div>

          {/* Dirección */}
          <AddressAutocomplete value={direccion} onChange={setDireccion}
            ciudad={ciudadPerfil} required />

          {error && (
            <p className="flex items-start gap-1.5 rounded-xl bg-bad/10 p-3 text-sm font-semibold text-bad">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}
            </p>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : t.btnSave}
          </button>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { User, Phone, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AddressAutocomplete from '@/components/AddressAutocomplete';

export default function ProfileModal() {
  const { user, isAuthenticated, hasProfile, loading, saveProfile, ciudad } = useAuth();

  const [nombre,    setNombre]    = useState('');
  const [apellido,  setApellido]  = useState('');
  const [telefono,  setTelefono]  = useState('');
  const [direccion, setDireccion] = useState('');
  const [error,     setError]     = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Solo mostrar si está autenticado, no es invitado, no tiene perfil aún y no está cargando
  if (loading || !isAuthenticated || hasProfile) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const err = await saveProfile({ nombre, apellido, telefono, direccion });
      if (err) setError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="w-full max-w-sm rounded-t-[32px] bg-white px-7 pb-10 pt-7 shadow-2xl sm:rounded-[32px] sm:pb-8">

        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-black/10 sm:hidden" />

        <div className="mb-6 text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-soft">
            <User className="h-8 w-8" />
          </span>
          <h1 className="mt-3 font-display text-2xl font-black text-ink">
            Completá tu perfil
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Necesitamos algunos datos para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email (solo lectura) */}
          <div className="relative">
            <input
              type="email"
              value={user?.email ?? ''}
              disabled
              className="field w-full bg-black/5 text-ink-muted cursor-not-allowed"
            />
          </div>

          {/* Nombre */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              required
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="field pl-9"
            />
          </div>

          {/* Apellido */}
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              required
              placeholder="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="field pl-9"
            />
          </div>

          {/* Teléfono */}
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="tel"
              required
              placeholder="Teléfono (ej: 1123456789)"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="field pl-9"
            />
          </div>

          {/* Dirección */}
          <AddressAutocomplete
            value={direccion}
            onChange={setDireccion}
            ciudad={ciudad}
            required
          />

          {error && (
            <p className="flex items-start gap-1.5 rounded-xl bg-bad/10 p-3 text-sm font-semibold text-bad">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Guardar y continuar'}
          </button>
        </form>
      </div>
    </div>
  );
}

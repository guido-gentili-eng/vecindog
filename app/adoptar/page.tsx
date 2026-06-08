'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Heart, CheckCircle2, User, Home, Users,
  Dog, Search, ClipboardList, AlertCircle, Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';

/* ══════════════════════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════════════════════ */

interface FormAdopcion {
  nombre:    string;
  dni:       string;
  edad:      string;
  telefono:  string;
  email:     string;
  direccion: string;
  zona:      string;
  tipoVivienda:       string;
  tenencia:           string;
  propietarioPermite: string;
  tienePatio:         string;
  patioFechado:       string;
  cantPersonas:    string;
  hayNinos:        string;
  edadesNinos:     string;
  todosDeAcuerdo:  string;
  alergias:        string;
  mascotasActuales:  string;
  detalleMascotas:   string;
  mascotasVacunadas: string;
  mascotasAnteriores: string;
  quePasoConEllas:   string;
  horasSolo:         string;
  tamanoPreferido: string;
  edadPreferida:   string;
  perroEnMente:    string;
  motivacion:      string;
  compromisoVeterinario:   boolean;
  compromisoVisita:        boolean;
  compromisoDevolucion:    boolean;
  compromisoEsterilizacion: boolean;
}

const FORM_INICIAL: FormAdopcion = {
  nombre: '', dni: '', edad: '', telefono: '', email: '', direccion: '', zona: '',
  tipoVivienda: '', tenencia: '', propietarioPermite: '', tienePatio: '', patioFechado: '',
  cantPersonas: '', hayNinos: '', edadesNinos: '', todosDeAcuerdo: '', alergias: '',
  mascotasActuales: '', detalleMascotas: '', mascotasVacunadas: '', mascotasAnteriores: '',
  quePasoConEllas: '', horasSolo: '',
  tamanoPreferido: '', edadPreferida: '', perroEnMente: '', motivacion: '',
  compromisoVeterinario: false, compromisoVisita: false,
  compromisoDevolucion: false, compromisoEsterilizacion: false,
};

/* ══════════════════════════════════════════════════════════════
   COMPONENTES AUXILIARES
══════════════════════════════════════════════════════════════ */

function SiNo({ value, onChange, labelSi, labelNo }: {
  value: string;
  onChange: (v: string) => void;
  labelSi: string;
  labelNo: string;
}) {
  return (
    <div className="flex gap-2">
      {[{ v: 'si', label: labelSi }, { v: 'no', label: labelNo }].map(({ v, label }) => (
        <button
          key={v} type="button"
          onClick={() => onChange(value === v ? '' : v)}
          className={`rounded-xl px-6 py-2 text-sm font-semibold transition ${
            value === v
              ? 'bg-brand-primary text-white shadow-soft'
              : 'bg-white text-ink ring-1 ring-black/10 hover:bg-brand-cream'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Chips({ opciones, value, onChange }: {
  opciones: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {opciones.map((o) => (
        <button
          key={o.value} type="button"
          onClick={() => onChange(value === o.value ? '' : o.value)}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            value === o.value
              ? 'bg-brand-primary text-white shadow-soft'
              : 'bg-white text-ink ring-1 ring-black/10 hover:bg-brand-cream'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Seccion({ n, icon: Icon, titulo, subtitulo, children }: {
  n: number;
  icon: React.ComponentType<{ className?: string }>;
  titulo: string;
  subtitulo?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card relative p-6">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-brand-primary font-black text-white shadow-soft">
          {n}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-brand-primary" />
            <h2 className="font-display text-lg font-extrabold leading-tight text-ink">{titulo}</h2>
          </div>
          {subtitulo && <p className="mt-0.5 text-sm text-ink-muted">{subtitulo}</p>}
        </div>
      </div>
      <div className="mt-5 space-y-5">{children}</div>
    </div>
  );
}

function Campo({ label, requerido, hint, children }: {
  label: string;
  requerido?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-bold text-ink">
        {label}
        {requerido && <span className="ml-1 text-bad">*</span>}
        {hint && <span className="ml-2 text-xs font-normal text-ink-muted">{hint}</span>}
      </p>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PÁGINA
══════════════════════════════════════════════════════════════ */

export default function AdoptarPage() {
  const { t } = useLanguage();
  const [form, setForm]       = useState<FormAdopcion>(FORM_INICIAL);
  const [error, setError]     = useState('');
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof FormAdopcion>(key: K, val: FormAdopcion[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function validar(): string {
    const f = form;
    if (!f.nombre.trim())    return t.adpErrNombre;
    if (!f.dni.trim())       return t.adpErrDni;
    if (!f.edad.trim() || isNaN(parseInt(f.edad))) return t.adpErrEdad;
    if (!f.telefono.trim())  return t.adpErrTelefono;
    if (!f.email.trim())     return t.adpErrEmail;
    if (!f.direccion.trim()) return t.adpErrDireccion;
    if (!f.zona.trim())      return t.adpErrZona;

    if (!f.tipoVivienda)     return t.adpErrVivienda;
    if (!f.tenencia)         return t.adpErrTenencia;
    if (f.tenencia === 'inquilino' && !f.propietarioPermite) return t.adpErrPropPermite;
    if (!f.tienePatio)       return t.adpErrPatio;
    if (f.tienePatio === 'si' && !f.patioFechado)            return t.adpErrPatioFechado;

    if (!f.cantPersonas.trim()) return t.adpErrPersonas;
    if (!f.hayNinos)         return t.adpErrNinos;
    if (f.hayNinos === 'si' && !f.edadesNinos.trim()) return t.adpErrEdadesNinos;
    if (!f.todosDeAcuerdo)   return t.adpErrAcuerdo;
    if (!f.alergias)         return t.adpErrAlergias;

    if (!f.mascotasActuales) return t.adpErrMascotas;
    if (f.mascotasActuales === 'si') {
      if (!f.detalleMascotas.trim()) return t.adpErrDetalle;
      if (!f.mascotasVacunadas)      return t.adpErrVacunadas;
    }
    if (!f.mascotasAnteriores) return t.adpErrAnteriores;
    if (f.mascotasAnteriores === 'si' && !f.quePasoConEllas.trim()) return t.adpErrQuePaso;
    if (!f.horasSolo)        return t.adpErrHoras;

    if (!f.tamanoPreferido)  return t.adpErrTamano;
    if (!f.edadPreferida)    return t.adpErrEdadPref;
    if (!f.motivacion.trim()) return t.adpErrMotivacion;

    if (!f.compromisoVeterinario || !f.compromisoVisita ||
        !f.compromisoDevolucion  || !f.compromisoEsterilizacion)
      return t.adpErrCompromisos;

    return '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    const err = validar();
    if (err) {
      setError(err);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setError('');
    setLoading(true);

    try {
      const { error: insErr } = await supabase.from('adoption_requests').insert({
        nombre:               form.nombre,
        dni:                  form.dni,
        edad:                 parseInt(form.edad),
        telefono:             form.telefono,
        email:                form.email,
        direccion:            form.direccion,
        zona:                 form.zona,
        tipo_vivienda:        form.tipoVivienda,
        tenencia:             form.tenencia,
        propietario_permite:  form.propietarioPermite || null,
        tiene_patio:          form.tienePatio,
        patio_fechado:        form.patioFechado       || null,
        cant_personas:        parseInt(form.cantPersonas),
        hay_ninos:            form.hayNinos,
        edades_ninos:         form.edadesNinos        || null,
        todos_de_acuerdo:     form.todosDeAcuerdo,
        alergias:             form.alergias,
        mascotas_actuales:    form.mascotasActuales,
        detalle_mascotas:     form.detalleMascotas    || null,
        mascotas_vacunadas:   form.mascotasVacunadas  || null,
        mascotas_anteriores:  form.mascotasAnteriores,
        que_paso_con_ellas:   form.quePasoConEllas    || null,
        horas_solo:           form.horasSolo,
        tamano_preferido:     form.tamanoPreferido,
        edad_preferida:       form.edadPreferida,
        perro_en_mente:       form.perroEnMente       || null,
        motivacion:           form.motivacion,
      });
      if (insErr) throw insErr;
      setEnviado(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(t.adpErrSubmit + msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  }

  if (enviado) {
    return (
      <div className="mx-auto max-w-md py-12">
        <div className="card p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-good/15 text-good">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-black text-ink">{t.adpSuccessTitle}</h1>
          <p className="mt-2 text-ink-muted">{t.adpSuccessMsg}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/publicaciones?cat=adopcion" className="btn-primary">
              {t.adpVerAdopcion}
            </Link>
            <Link href="/" className="btn-secondary">
              {t.adpBack}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-8 md:py-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm font-bold text-brand-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> {t.adpBack}
      </Link>

      <header className="mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold/20 px-3 py-1 text-xs font-bold text-[#7a4f0a]">
          <Heart className="h-3.5 w-3.5" /> {t.adpChip}
        </span>
        <h1 className="mt-2 font-display text-3xl font-black tracking-tight text-ink md:text-4xl">
          {t.adpTitle}
        </h1>
        <p className="mt-1 text-ink-muted">
          {t.adpSubtitulo}{' '}
          <span className="font-bold text-bad">*</span>{' '}
          <span className="text-sm">{t.adpRequired}</span>
        </p>
      </header>

      {error && (
        <div className="mb-5 flex items-start gap-2 rounded-2xl bg-bad/10 p-4 text-sm font-semibold text-bad">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>

        {/* ══ 1. DATOS PERSONALES ══════════════════════════════════════ */}
        <Seccion n={1} icon={User} titulo={t.adpSec1}>
          <div className="grid gap-4 sm:grid-cols-2">

            <div className="sm:col-span-2">
              <Campo label={t.adpNombre} requerido>
                <input type="text" className="field" placeholder="Juan Pérez"
                  value={form.nombre} onChange={(e) => set('nombre', e.target.value)} />
              </Campo>
            </div>

            <Campo label={t.adpDni} requerido>
              <input type="text" className="field" placeholder="30.123.456"
                value={form.dni} onChange={(e) => set('dni', e.target.value)} />
            </Campo>

            <Campo label={t.adpEdad} requerido hint={t.adpEdadHint}>
              <input type="number" className="field" placeholder="30" min={18} max={99}
                value={form.edad} onChange={(e) => set('edad', e.target.value)} />
            </Campo>

            <Campo label={t.adpTelefono} requerido>
              <input type="tel" className="field" placeholder="+54 9 291 ..."
                value={form.telefono} onChange={(e) => set('telefono', e.target.value)} />
            </Campo>

            <Campo label={t.adpEmail} requerido>
              <input type="email" className="field" placeholder="juan@email.com"
                value={form.email} onChange={(e) => set('email', e.target.value)} />
            </Campo>

            <div className="sm:col-span-2">
              <Campo label={t.adpDireccion} requerido hint={t.adpDireccionHint}>
                <input type="text" className="field" placeholder="Av. Colón 1234"
                  value={form.direccion} onChange={(e) => set('direccion', e.target.value)} />
              </Campo>
            </div>

            <div className="sm:col-span-2">
              <Campo label={t.adpZona} requerido>
                <input type="text" className="field" placeholder="Villa Mitre, Centro…"
                  value={form.zona} onChange={(e) => set('zona', e.target.value)} />
              </Campo>
            </div>

          </div>
        </Seccion>

        {/* ══ 2. VIVIENDA ══════════════════════════════════════════════ */}
        <Seccion n={2} icon={Home} titulo={t.adpSec2} subtitulo={t.adpSec2Sub}>

          <Campo label={t.adpTipoVivienda} requerido>
            <Chips
              opciones={[
                { value: 'casa',       label: t.adpCasa },
                { value: 'depto',      label: t.adpDepto },
                { value: 'casa_patio', label: t.adpCasaPatio },
                { value: 'otro',       label: t.adpOtro },
              ]}
              value={form.tipoVivienda}
              onChange={(v) => set('tipoVivienda', v)}
            />
          </Campo>

          <Campo label={t.adpTenencia} requerido>
            <Chips
              opciones={[
                { value: 'propietario', label: t.adpPropietario },
                { value: 'inquilino',   label: t.adpInquilino },
              ]}
              value={form.tenencia}
              onChange={(v) => set('tenencia', v)}
            />
          </Campo>

          {form.tenencia === 'inquilino' && (
            <Campo label={t.adpPropPermite} requerido>
              <SiNo value={form.propietarioPermite}
                onChange={(v) => set('propietarioPermite', v)}
                labelSi={t.adpSi} labelNo={t.adpNo} />
            </Campo>
          )}

          <Campo label={t.adpTienePatio} requerido>
            <SiNo value={form.tienePatio} onChange={(v) => set('tienePatio', v)}
              labelSi={t.adpSi} labelNo={t.adpNo} />
          </Campo>

          {form.tienePatio === 'si' && (
            <Campo label={t.adpPatioFechado} requerido>
              <SiNo value={form.patioFechado} onChange={(v) => set('patioFechado', v)}
                labelSi={t.adpSi} labelNo={t.adpNo} />
            </Campo>
          )}

        </Seccion>

        {/* ══ 3. GRUPO FAMILIAR ════════════════════════════════════════ */}
        <Seccion n={3} icon={Users} titulo={t.adpSec3} subtitulo={t.adpSec3Sub}>

          <Campo label={t.adpCantPersonas} requerido hint={t.adpCantPersonasHint}>
            <input type="number" className="field w-32" placeholder="3" min={1}
              value={form.cantPersonas} onChange={(e) => set('cantPersonas', e.target.value)} />
          </Campo>

          <Campo label={t.adpHayNinos} requerido>
            <SiNo value={form.hayNinos} onChange={(v) => set('hayNinos', v)}
              labelSi={t.adpSi} labelNo={t.adpNo} />
          </Campo>

          {form.hayNinos === 'si' && (
            <Campo label={t.adpEdadesNinos} requerido hint={t.adpEdadesNinosHint}>
              <input type="text" className="field" placeholder="3, 7 y 10 años"
                value={form.edadesNinos} onChange={(e) => set('edadesNinos', e.target.value)} />
            </Campo>
          )}

          <Campo label={t.adpTodosDeAcuerdo} requerido>
            <SiNo value={form.todosDeAcuerdo} onChange={(v) => set('todosDeAcuerdo', v)}
              labelSi={t.adpSi} labelNo={t.adpNo} />
          </Campo>

          <Campo label={t.adpAlergias} requerido>
            <SiNo value={form.alergias} onChange={(v) => set('alergias', v)}
              labelSi={t.adpSi} labelNo={t.adpNo} />
          </Campo>

        </Seccion>

        {/* ══ 4. EXPERIENCIA CON MASCOTAS ══════════════════════════════ */}
        <Seccion n={4} icon={Dog} titulo={t.adpSec4}>

          <Campo label={t.adpMascotasActuales} requerido>
            <SiNo value={form.mascotasActuales} onChange={(v) => set('mascotasActuales', v)}
              labelSi={t.adpSi} labelNo={t.adpNo} />
          </Campo>

          {form.mascotasActuales === 'si' && (<>
            <Campo label={t.adpCualesYCuantas} requerido hint={t.adpCualesHint}>
              <input type="text" className="field"
                placeholder="2 gatos domésticos, 1 perro labrador de 5 años…"
                value={form.detalleMascotas}
                onChange={(e) => set('detalleMascotas', e.target.value)} />
            </Campo>
            <Campo label={t.adpVacunadasCastradas} requerido>
              <Chips
                opciones={[
                  { value: 'si',      label: t.adpSiTodas },
                  { value: 'algunas', label: t.adpAlgunas },
                  { value: 'no',      label: t.adpNo },
                ]}
                value={form.mascotasVacunadas}
                onChange={(v) => set('mascotasVacunadas', v)}
              />
            </Campo>
          </>)}

          <Campo label={t.adpMascotasAnteriores} requerido>
            <SiNo value={form.mascotasAnteriores} onChange={(v) => set('mascotasAnteriores', v)}
              labelSi={t.adpSi} labelNo={t.adpNo} />
          </Campo>

          {form.mascotasAnteriores === 'si' && (
            <Campo label={t.adpQuePaso} requerido>
              <textarea className="field min-h-[80px] resize-none"
                placeholder="Murieron de viejas, las di en adopción, se escaparon…"
                value={form.quePasoConEllas}
                onChange={(e) => set('quePasoConEllas', e.target.value)} />
            </Campo>
          )}

          <Campo label={t.adpHorasSolo} requerido>
            <Chips
              opciones={[
                { value: '0-2', label: t.adpMenos2 },
                { value: '2-4', label: t.adp2a4 },
                { value: '4-6', label: t.adp4a6 },
                { value: '6-8', label: t.adp6a8 },
                { value: '+8',  label: t.adpMas8 },
              ]}
              value={form.horasSolo}
              onChange={(v) => set('horasSolo', v)}
            />
          </Campo>

        </Seccion>

        {/* ══ 5. EL PERRO QUE BUSCÁS ═══════════════════════════════════ */}
        <Seccion n={5} icon={Search} titulo={t.adpSec5} subtitulo={t.adpSec5Sub}>

          <Campo label={t.adpTamanoPreferido} requerido>
            <Chips
              opciones={[
                { value: 'chico',           label: t.adpChico },
                { value: 'mediano',         label: t.adpMediano },
                { value: 'grande',          label: t.adpGrande },
                { value: 'sin_preferencia', label: t.adpSinPref },
              ]}
              value={form.tamanoPreferido}
              onChange={(v) => set('tamanoPreferido', v)}
            />
          </Campo>

          <Campo label={t.adpEdadPreferida} requerido>
            <Chips
              opciones={[
                { value: 'cachorro',        label: t.adpCachorro },
                { value: 'joven',           label: t.adpJoven },
                { value: 'adulto',          label: t.adpAdulto },
                { value: 'mayor',           label: t.adpMayor },
                { value: 'sin_preferencia', label: t.adpSinPref },
              ]}
              value={form.edadPreferida}
              onChange={(v) => set('edadPreferida', v)}
            />
          </Campo>

          <Campo label={t.adpPerroEnMente} hint={t.adpPerroEnMenteHint}>
            <input type="text" className="field"
              placeholder={t.adpPerroEnMentePh}
              value={form.perroEnMente}
              onChange={(e) => set('perroEnMente', e.target.value)} />
          </Campo>

          <Campo label={t.adpMotivacion} requerido>
            <textarea
              className="field min-h-[130px] resize-none"
              placeholder={t.adpMotivacionPh}
              value={form.motivacion}
              onChange={(e) => set('motivacion', e.target.value)}
            />
          </Campo>

        </Seccion>

        {/* ══ 6. COMPROMISOS ═══════════════════════════════════════════ */}
        <Seccion n={6} icon={ClipboardList} titulo={t.adpSec6} subtitulo={t.adpSec6Sub}>

          <div className="space-y-3">
            {([
              { key: 'compromisoVeterinario' as const, texto: t.adpComp1 },
              { key: 'compromisoVisita'      as const, texto: t.adpComp2 },
              { key: 'compromisoDevolucion'  as const, texto: t.adpComp3 },
              { key: 'compromisoEsterilizacion' as const, texto: t.adpComp4 },
            ]).map(({ key, texto }) => (
              <label
                key={key}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl p-4 ring-1 transition ${
                  form[key]
                    ? 'bg-good/5 ring-good/50'
                    : 'bg-white ring-black/10 hover:bg-brand-cream'
                }`}
              >
                <input
                  type="checkbox"
                  className="mt-0.5 h-5 w-5 shrink-0 accent-brand-primary"
                  checked={form[key]}
                  onChange={(e) => set(key, e.target.checked)}
                />
                <span className="text-sm leading-snug text-ink">{texto}</span>
              </label>
            ))}
          </div>

        </Seccion>

        {/* ══ SUBMIT ═══════════════════════════════════════════════════ */}
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? (
            <><Loader2 className="h-5 w-5 animate-spin" /> {t.adpEnviando}</>
          ) : (
            <><Heart className="h-5 w-5" /> {t.adpEnviar}</>
          )}
        </button>

      </form>
    </div>
  );
}

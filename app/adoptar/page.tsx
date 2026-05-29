'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Heart, CheckCircle2, User, Home, Users,
  Dog, Search, ClipboardList, AlertCircle, Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

/* ══════════════════════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════════════════════ */

interface FormAdopcion {
  // 1. Datos personales
  nombre:    string;
  dni:       string;
  edad:      string;
  telefono:  string;
  email:     string;
  direccion: string;
  zona:      string;

  // 2. Vivienda
  tipoVivienda:       string;
  tenencia:           string;
  propietarioPermite: string;
  tienePatio:         string;
  patioFechado:       string;

  // 3. Grupo familiar
  cantPersonas:    string;
  hayNinos:        string;
  edadesNinos:     string;
  todosDeAcuerdo:  string;
  alergias:        string;

  // 4. Experiencia con mascotas
  mascotasActuales:  string;
  detalleMascotas:   string;
  mascotasVacunadas: string;
  mascotasAnteriores: string;
  quePasoConEllas:   string;
  horasSolo:         string;

  // 5. El perro que buscás
  tamanoPreferido: string;
  edadPreferida:   string;
  perroEnMente:    string;
  motivacion:      string;

  // 6. Compromisos
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

function SiNo({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-2">
      {[{ v: 'si', label: 'Sí' }, { v: 'no', label: 'No' }].map(({ v, label }) => (
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
  const [form, setForm]       = useState<FormAdopcion>(FORM_INICIAL);
  const [error, setError]     = useState('');
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  function set<K extends keyof FormAdopcion>(key: K, val: FormAdopcion[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  /* ── Validación ── */
  function validar(): string {
    const f = form;
    if (!f.nombre.trim())    return 'El nombre completo es obligatorio.';
    if (!f.dni.trim())       return 'El DNI es obligatorio.';
    if (!f.edad.trim())      return 'La edad es obligatoria.';
    if (!f.telefono.trim())  return 'El teléfono es obligatorio.';
    if (!f.email.trim())     return 'El email es obligatorio.';
    if (!f.direccion.trim()) return 'La dirección es obligatoria.';
    if (!f.zona.trim())      return 'La zona o barrio es obligatoria.';

    if (!f.tipoVivienda)     return 'Indicá el tipo de vivienda.';
    if (!f.tenencia)         return 'Indicá si sos propietario o inquilino.';
    if (f.tenencia === 'inquilino' && !f.propietarioPermite)
                             return 'Indicá si el propietario permite mascotas.';
    if (!f.tienePatio)       return 'Indicá si tenés patio o jardín.';
    if (f.tienePatio === 'si' && !f.patioFechado)
                             return 'Indicá si el patio está cercado.';

    if (!f.cantPersonas.trim()) return 'Indicá cuántas personas viven en tu hogar.';
    if (!f.hayNinos)         return 'Indicá si hay niños en el hogar.';
    if (f.hayNinos === 'si' && !f.edadesNinos.trim())
                             return 'Escribí las edades de los niños.';
    if (!f.todosDeAcuerdo)   return 'Indicá si todos en el hogar están de acuerdo.';
    if (!f.alergias)         return 'Indicá si alguien tiene alergia a los animales.';

    if (!f.mascotasActuales) return 'Indicá si tenés mascotas actualmente.';
    if (f.mascotasActuales === 'si') {
      if (!f.detalleMascotas.trim()) return 'Describí tus mascotas actuales.';
      if (!f.mascotasVacunadas)      return 'Indicá si tus mascotas están vacunadas y castradas.';
    }
    if (!f.mascotasAnteriores) return 'Indicá si tuviste mascotas anteriormente.';
    if (f.mascotasAnteriores === 'si' && !f.quePasoConEllas.trim())
                             return 'Contanos qué pasó con tus mascotas anteriores.';
    if (!f.horasSolo)        return 'Indicá cuántas horas estaría solo el perro.';

    if (!f.tamanoPreferido)  return 'Elegí el tamaño preferido.';
    if (!f.edadPreferida)    return 'Elegí la edad preferida.';
    if (!f.motivacion.trim()) return 'Contanos por qué querés adoptar.';

    if (!f.compromisoVeterinario || !f.compromisoVisita ||
        !f.compromisoDevolucion  || !f.compromisoEsterilizacion)
      return 'Debés aceptar todos los compromisos para continuar.';

    return '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
      setError('Error al enviar la solicitud: ' + msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  }

  /* ── Pantalla de éxito ── */
  if (enviado) {
    return (
      <div className="mx-auto max-w-md py-12">
        <div className="card p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-good/15 text-good">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-black text-ink">¡Solicitud enviada!</h1>
          <p className="mt-2 text-ink-muted">
            Recibimos tu solicitud. Te contactaremos a la brevedad.
            Gracias por querer adoptar de forma responsable.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/publicaciones?cat=adopcion" className="btn-primary">
              Ver perros en adopción
            </Link>
            <Link href="/" className="btn-secondary">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Formulario ── */
  return (
    <div className="mx-auto max-w-2xl py-8 md:py-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm font-bold text-brand-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Volver al inicio
      </Link>

      <header className="mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold/20 px-3 py-1 text-xs font-bold text-[#7a4f0a]">
          <Heart className="h-3.5 w-3.5" /> Adopción responsable
        </span>
        <h1 className="mt-2 font-display text-3xl font-black tracking-tight text-ink md:text-4xl">
          Solicitud de adopción
        </h1>
        <p className="mt-1 text-ink-muted">
          Completá el formulario con sinceridad. La información es confidencial y
          nos ayuda a asegurar el bienestar del perro.{' '}
          <span className="font-bold text-bad">*</span>{' '}
          <span className="text-sm">campo obligatorio</span>
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
        <Seccion n={1} icon={User} titulo="Tus datos personales">
          <div className="grid gap-4 sm:grid-cols-2">

            <div className="sm:col-span-2">
              <Campo label="Nombre y apellido" requerido>
                <input type="text" className="field" placeholder="Juan Pérez"
                  value={form.nombre} onChange={(e) => set('nombre', e.target.value)} />
              </Campo>
            </div>

            <Campo label="DNI" requerido>
              <input type="text" className="field" placeholder="30.123.456"
                value={form.dni} onChange={(e) => set('dni', e.target.value)} />
            </Campo>

            <Campo label="Edad" requerido hint="(mín. 18 años)">
              <input type="number" className="field" placeholder="30" min={18} max={99}
                value={form.edad} onChange={(e) => set('edad', e.target.value)} />
            </Campo>

            <Campo label="Teléfono / WhatsApp" requerido>
              <input type="tel" className="field" placeholder="+54 9 291 ..."
                value={form.telefono} onChange={(e) => set('telefono', e.target.value)} />
            </Campo>

            <Campo label="Email" requerido>
              <input type="email" className="field" placeholder="juan@email.com"
                value={form.email} onChange={(e) => set('email', e.target.value)} />
            </Campo>

            <div className="sm:col-span-2">
              <Campo label="Dirección" requerido hint="calle y número">
                <input type="text" className="field" placeholder="Av. Colón 1234"
                  value={form.direccion} onChange={(e) => set('direccion', e.target.value)} />
              </Campo>
            </div>

            <div className="sm:col-span-2">
              <Campo label="Barrio / zona" requerido>
                <input type="text" className="field" placeholder="Villa Mitre, Centro…"
                  value={form.zona} onChange={(e) => set('zona', e.target.value)} />
              </Campo>
            </div>

          </div>
        </Seccion>

        {/* ══ 2. VIVIENDA ══════════════════════════════════════════════ */}
        <Seccion n={2} icon={Home} titulo="Tu vivienda"
          subtitulo="El entorno es clave para el bienestar del perro.">

          <Campo label="Tipo de vivienda" requerido>
            <Chips
              opciones={[
                { value: 'casa',       label: 'Casa' },
                { value: 'depto',      label: 'Departamento' },
                { value: 'casa_patio', label: 'Casa con patio' },
                { value: 'otro',       label: 'Otro' },
              ]}
              value={form.tipoVivienda}
              onChange={(v) => set('tipoVivienda', v)}
            />
          </Campo>

          <Campo label="¿Sos propietario o alquilás?" requerido>
            <Chips
              opciones={[
                { value: 'propietario', label: 'Propietario' },
                { value: 'inquilino',   label: 'Inquilino' },
              ]}
              value={form.tenencia}
              onChange={(v) => set('tenencia', v)}
            />
          </Campo>

          {form.tenencia === 'inquilino' && (
            <Campo label="¿El propietario permite mascotas?" requerido>
              <SiNo value={form.propietarioPermite}
                onChange={(v) => set('propietarioPermite', v)} />
            </Campo>
          )}

          <Campo label="¿Tenés patio o jardín?" requerido>
            <SiNo value={form.tienePatio} onChange={(v) => set('tienePatio', v)} />
          </Campo>

          {form.tienePatio === 'si' && (
            <Campo label="¿Está cercado o vallado?" requerido>
              <SiNo value={form.patioFechado} onChange={(v) => set('patioFechado', v)} />
            </Campo>
          )}

        </Seccion>

        {/* ══ 3. GRUPO FAMILIAR ════════════════════════════════════════ */}
        <Seccion n={3} icon={Users} titulo="Tu grupo familiar"
          subtitulo="Necesitamos saber quiénes van a convivir con el perro.">

          <Campo label="¿Cuántas personas viven en tu hogar?" requerido hint="incluíte vos">
            <input type="number" className="field w-32" placeholder="3" min={1}
              value={form.cantPersonas} onChange={(e) => set('cantPersonas', e.target.value)} />
          </Campo>

          <Campo label="¿Hay niños en el hogar?" requerido>
            <SiNo value={form.hayNinos} onChange={(v) => set('hayNinos', v)} />
          </Campo>

          {form.hayNinos === 'si' && (
            <Campo label="Edades de los niños" requerido hint="ej: 3, 7 y 10 años">
              <input type="text" className="field" placeholder="3, 7 y 10 años"
                value={form.edadesNinos} onChange={(e) => set('edadesNinos', e.target.value)} />
            </Campo>
          )}

          <Campo label="¿Todos en el hogar están de acuerdo con la adopción?" requerido>
            <SiNo value={form.todosDeAcuerdo} onChange={(v) => set('todosDeAcuerdo', v)} />
          </Campo>

          <Campo label="¿Algún integrante tiene alergia a los animales?" requerido>
            <SiNo value={form.alergias} onChange={(v) => set('alergias', v)} />
          </Campo>

        </Seccion>

        {/* ══ 4. EXPERIENCIA CON MASCOTAS ══════════════════════════════ */}
        <Seccion n={4} icon={Dog} titulo="Tu experiencia con mascotas">

          <Campo label="¿Tenés mascotas actualmente?" requerido>
            <SiNo value={form.mascotasActuales} onChange={(v) => set('mascotasActuales', v)} />
          </Campo>

          {form.mascotasActuales === 'si' && (<>
            <Campo label="¿Cuáles y cuántas?" requerido hint="tipo, raza y cantidad">
              <input type="text" className="field"
                placeholder="2 gatos domésticos, 1 perro labrador de 5 años…"
                value={form.detalleMascotas}
                onChange={(e) => set('detalleMascotas', e.target.value)} />
            </Campo>
            <Campo label="¿Están vacunadas y castradas?" requerido>
              <Chips
                opciones={[
                  { value: 'si',      label: 'Sí, todas' },
                  { value: 'algunas', label: 'Algunas' },
                  { value: 'no',      label: 'No' },
                ]}
                value={form.mascotasVacunadas}
                onChange={(v) => set('mascotasVacunadas', v)}
              />
            </Campo>
          </>)}

          <Campo label="¿Tuviste mascotas anteriormente?" requerido>
            <SiNo value={form.mascotasAnteriores} onChange={(v) => set('mascotasAnteriores', v)} />
          </Campo>

          {form.mascotasAnteriores === 'si' && (
            <Campo label="¿Qué pasó con ellas?" requerido>
              <textarea className="field min-h-[80px] resize-none"
                placeholder="Murieron de viejas, las di en adopción, se escaparon…"
                value={form.quePasoConEllas}
                onChange={(e) => set('quePasoConEllas', e.target.value)} />
            </Campo>
          )}

          <Campo label="¿Cuántas horas por día estaría solo el perro?" requerido>
            <Chips
              opciones={[
                { value: '0-2', label: 'Menos de 2 hs' },
                { value: '2-4', label: '2 a 4 hs' },
                { value: '4-6', label: '4 a 6 hs' },
                { value: '6-8', label: '6 a 8 hs' },
                { value: '+8',  label: 'Más de 8 hs' },
              ]}
              value={form.horasSolo}
              onChange={(v) => set('horasSolo', v)}
            />
          </Campo>

        </Seccion>

        {/* ══ 5. EL PERRO QUE BUSCÁS ═══════════════════════════════════ */}
        <Seccion n={5} icon={Search} titulo="¿Qué perro buscás?"
          subtitulo="Nos ayuda a encontrar la mejor coincidencia para vos y para el perro.">

          <Campo label="Tamaño preferido" requerido>
            <Chips
              opciones={[
                { value: 'chico',           label: 'Chico' },
                { value: 'mediano',         label: 'Mediano' },
                { value: 'grande',          label: 'Grande' },
                { value: 'sin_preferencia', label: 'Sin preferencia' },
              ]}
              value={form.tamanoPreferido}
              onChange={(v) => set('tamanoPreferido', v)}
            />
          </Campo>

          <Campo label="Edad preferida" requerido>
            <Chips
              opciones={[
                { value: 'cachorro',        label: 'Cachorro' },
                { value: 'joven',           label: 'Joven' },
                { value: 'adulto',          label: 'Adulto' },
                { value: 'mayor',           label: 'Mayor' },
                { value: 'sin_preferencia', label: 'Sin preferencia' },
              ]}
              value={form.edadPreferida}
              onChange={(v) => set('edadPreferida', v)}
            />
          </Campo>

          <Campo label="¿Tenés algún perro en mente?" hint="opcional">
            <input type="text" className="field"
              placeholder="Nombre o descripción del perro que te interesa"
              value={form.perroEnMente}
              onChange={(e) => set('perroEnMente', e.target.value)} />
          </Campo>

          <Campo label="¿Por qué querés adoptar un perro?" requerido>
            <textarea
              className="field min-h-[130px] resize-none"
              placeholder="Contanos tu motivación, tu estilo de vida, cuánto tiempo le podés dedicar, qué esperás de la convivencia…"
              value={form.motivacion}
              onChange={(e) => set('motivacion', e.target.value)}
            />
          </Campo>

        </Seccion>

        {/* ══ 6. COMPROMISOS ═══════════════════════════════════════════ */}
        <Seccion n={6} icon={ClipboardList} titulo="Compromisos"
          subtitulo="Para garantizar el bienestar del perro necesitamos que aceptes los siguientes puntos. Todos son obligatorios.">

          <div className="space-y-3">
            {([
              {
                key:   'compromisoVeterinario' as const,
                texto: 'Me comprometo a proveer atención veterinaria regular: vacunas anuales, desparasitación y controles de salud.',
              },
              {
                key:   'compromisoVisita' as const,
                texto: 'Acepto que se realice una visita previa al hogar antes de confirmar la adopción.',
              },
              {
                key:   'compromisoDevolucion' as const,
                texto: 'Si por alguna razón no puedo conservar al perro, me comprometo a devolverlo a la organización y no darlo a terceros sin aviso previo.',
              },
              {
                key:   'compromisoEsterilizacion' as const,
                texto: 'Me comprometo a esterilizar al perro si aún no lo está, en los plazos recomendados por el veterinario.',
              },
            ] as const).map(({ key, texto }) => (
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
            <><Loader2 className="h-5 w-5 animate-spin" /> Enviando…</>
          ) : (
            <><Heart className="h-5 w-5" /> Enviar solicitud de adopción</>
          )}
        </button>

      </form>
    </div>
  );
}

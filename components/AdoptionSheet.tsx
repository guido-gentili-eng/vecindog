'use client';

import { useState } from 'react';
import {
  X, Heart, User, Home, Users, Dog, Search, ClipboardList,
  AlertCircle, Loader2, CheckCircle2, MessageCircle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Post } from '@/lib/posts';

/* ── Tipo del formulario ── */
interface FormAdopcion {
  nombre: string; telefono: string; email: string; zona: string;
  tipoVivienda: string; tenencia: string; propietarioPermite: string;
  tienePatio: string; patioFechado: string;
  cantPersonas: string; hayNinos: string; edadesNinos: string;
  todosDeAcuerdo: string; alergias: string;
  mascotasActuales: string; detalleMascotas: string;
  mascotasVacunadas: string; mascotasAnteriores: string;
  quePasoConEllas: string; horasSolo: string;
  motivacion: string;
  compromisoVeterinario: boolean; compromisoVisita: boolean;
  compromisoDevolucion: boolean; compromisoEsterilizacion: boolean;
}
const VACIO: FormAdopcion = {
  nombre: '', telefono: '', email: '', zona: '',
  tipoVivienda: '', tenencia: '', propietarioPermite: '',
  tienePatio: '', patioFechado: '',
  cantPersonas: '', hayNinos: '', edadesNinos: '',
  todosDeAcuerdo: '', alergias: '',
  mascotasActuales: '', detalleMascotas: '',
  mascotasVacunadas: '', mascotasAnteriores: '',
  quePasoConEllas: '', horasSolo: '',
  motivacion: '',
  compromisoVeterinario: false, compromisoVisita: false,
  compromisoDevolucion: false, compromisoEsterilizacion: false,
};

/* ── Helpers visuales ── */
function SiNo({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-2">
      {[{ v: 'si', label: 'Sí' }, { v: 'no', label: 'No' }].map(({ v, label }) => (
        <button key={v} type="button" onClick={() => onChange(value === v ? '' : v)}
          className={`rounded-xl px-5 py-2 text-sm font-semibold transition ${value === v ? 'bg-brand-primary text-white' : 'bg-white text-ink ring-1 ring-black/10 hover:bg-brand-cream'}`}>
          {label}
        </button>
      ))}
    </div>
  );
}
function Chips({ opciones, value, onChange }: { opciones: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {opciones.map((o) => (
        <button key={o.value} type="button" onClick={() => onChange(value === o.value ? '' : o.value)}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${value === o.value ? 'bg-brand-primary text-white' : 'bg-white text-ink ring-1 ring-black/10 hover:bg-brand-cream'}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
function F({ label, req, children }: { label: string; req?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-bold text-ink">{label}{req && <span className="ml-1 text-bad">*</span>}</p>
      {children}
    </div>
  );
}
function Sec({ n, Icon, titulo, children }: { n: number; Icon: React.ComponentType<{ className?: string }>; titulo: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 border-t border-black/8 pt-5 first:border-0 first:pt-0">
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-brand-primary text-xs font-black text-white">{n}</span>
        <Icon className="h-4 w-4 text-brand-primary" />
        <h3 className="font-display text-base font-extrabold text-ink">{titulo}</h3>
      </div>
      {children}
    </div>
  );
}

/* ── Componente principal ── */
export default function AdoptionSheet({ post, onClose }: { post: Post; onClose: () => void }) {
  const [form, setForm] = useState<FormAdopcion>(VACIO);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [waUrl, setWaUrl] = useState('');

  function set<K extends keyof FormAdopcion>(k: K, v: FormAdopcion[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function validar(): string {
    const f = form;
    if (!f.nombre.trim())      return 'El nombre es obligatorio.';
    if (!f.telefono.trim())    return 'El teléfono es obligatorio.';
    if (!f.email.trim())       return 'El email es obligatorio.';
    if (!f.zona.trim())        return 'El barrio / zona es obligatorio.';
    if (!f.tipoVivienda)       return 'Indicá el tipo de vivienda.';
    if (!f.tenencia)           return 'Indicá si sos propietario o inquilino.';
    if (f.tenencia === 'inquilino' && !f.propietarioPermite) return 'Indicá si el propietario permite mascotas.';
    if (!f.tienePatio)         return 'Indicá si tenés patio.';
    if (f.tienePatio === 'si' && !f.patioFechado) return 'Indicá si el patio está cercado.';
    if (!f.cantPersonas.trim()) return 'Indicá cuántas personas viven en tu hogar.';
    if (!f.hayNinos)           return 'Indicá si hay niños.';
    if (f.hayNinos === 'si' && !f.edadesNinos.trim()) return 'Escribí las edades de los niños.';
    if (!f.todosDeAcuerdo)     return 'Indicá si todos están de acuerdo.';
    if (!f.alergias)           return 'Indicá si hay alergias.';
    if (!f.mascotasActuales)   return 'Indicá si tenés mascotas.';
    if (f.mascotasActuales === 'si' && !f.detalleMascotas.trim()) return 'Describí tus mascotas actuales.';
    if (!f.mascotasAnteriores) return 'Indicá si tuviste mascotas antes.';
    if (f.mascotasAnteriores === 'si' && !f.quePasoConEllas.trim()) return '¿Qué pasó con tus mascotas anteriores?';
    if (!f.horasSolo)          return 'Indicá cuántas horas estaría solo.';
    if (!f.motivacion.trim())  return 'Contanos tu motivación para adoptar.';
    if (!f.compromisoVeterinario || !f.compromisoVisita || !f.compromisoDevolucion || !f.compromisoEsterilizacion)
      return 'Debés aceptar todos los compromisos.';
    return '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validar();
    if (err) { setError(err); return; }
    setError(''); setLoading(true);
    try {
      await supabase.from('adoption_requests').insert({
        post_id:             post.id,
        nombre:              form.nombre,
        telefono:            form.telefono,
        email:               form.email,
        zona:                form.zona,
        tipo_vivienda:       form.tipoVivienda,
        tenencia:            form.tenencia,
        propietario_permite: form.propietarioPermite || null,
        tiene_patio:         form.tienePatio,
        patio_fechado:       form.patioFechado || null,
        cant_personas:       parseInt(form.cantPersonas) || null,
        hay_ninos:           form.hayNinos,
        edades_ninos:        form.edadesNinos || null,
        todos_de_acuerdo:    form.todosDeAcuerdo,
        alergias:            form.alergias,
        mascotas_actuales:   form.mascotasActuales,
        detalle_mascotas:    form.detalleMascotas || null,
        mascotas_vacunadas:  form.mascotasVacunadas || null,
        mascotas_anteriores: form.mascotasAnteriores,
        que_paso_con_ellas:  form.quePasoConEllas || null,
        horas_solo:          form.horasSolo,
        motivacion:          form.motivacion,
      });

      // Armar mensaje WhatsApp para el dueño
      const msg = encodeURIComponent(
        `🐾 *Solicitud de adopción para ${post.nombre ?? 'el perro'}* (Vecindog)\n\n` +
        `👤 *Nombre:* ${form.nombre}\n` +
        `📱 *Teléfono:* ${form.telefono}\n` +
        `📧 *Email:* ${form.email}\n` +
        `📍 *Zona:* ${form.zona}\n` +
        `🏠 *Vivienda:* ${form.tipoVivienda}${form.tienePatio === 'si' ? ` con patio${form.patioFechado === 'si' ? ' cercado' : ''}` : ''}\n` +
        `👨‍👩‍👧 *Personas en el hogar:* ${form.cantPersonas}${form.hayNinos === 'si' ? ` (niños: ${form.edadesNinos})` : ''}\n` +
        `🐶 *Mascotas actuales:* ${form.mascotasActuales === 'si' ? form.detalleMascotas : 'No'}` +
        (form.horasSolo ? `\n⏰ *Horas solo:* ${form.horasSolo}` : '') +
        `\n\n💬 *Motivación:* ${form.motivacion}`
      );
      const waNumero = post.contacto.replace(/[^0-9]/g, '');
      setWaUrl(`https://wa.me/${waNumero}?text=${msg}`);
      setEnviado(true);
    } catch (err: unknown) {
      setError('Error al enviar: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex h-[92vh] w-full max-w-lg flex-col rounded-t-[28px] bg-white sm:h-auto sm:max-h-[90vh] sm:rounded-[28px]">
        {/* Header fijo */}
        <div className="flex shrink-0 items-center justify-between border-b border-black/8 px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-black text-ink">Solicitud de adopción</h2>
            <p className="text-xs text-ink-muted">Para: <strong>{post.nombre ?? 'el perro'}</strong></p>
          </div>
          <button type="button" onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-xl text-ink-muted hover:bg-black/5">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {enviado ? (
            <div className="py-6 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-good/15 text-good">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="mt-4 font-display text-xl font-black text-ink">¡Solicitud enviada!</h3>
              <p className="mt-2 text-sm text-ink-muted">
                Guardamos tus datos. Ahora podés escribirle directamente al dueño por WhatsApp con toda tu información.
              </p>
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                className="btn-primary mt-5 w-full justify-center">
                <MessageCircle className="h-5 w-5" /> Enviar solicitud por WhatsApp
              </a>
              <button type="button" onClick={onClose}
                className="mt-3 w-full rounded-2xl border-2 border-black/10 py-3 text-sm font-bold text-ink-muted">
                Cerrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {error && (
                <p className="flex items-start gap-2 rounded-2xl bg-bad/10 p-3 text-sm font-semibold text-bad">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}
                </p>
              )}

              <Sec n={1} Icon={User} titulo="Tus datos">
                <F label="Nombre y apellido" req><input className="field w-full" placeholder="Juan Pérez" value={form.nombre} onChange={(e) => set('nombre', e.target.value)} /></F>
                <div className="grid grid-cols-2 gap-3">
                  <F label="Teléfono / WhatsApp" req><input className="field w-full" placeholder="+54 9 291…" value={form.telefono} onChange={(e) => set('telefono', e.target.value)} /></F>
                  <F label="Email" req><input type="email" className="field w-full" placeholder="juan@email.com" value={form.email} onChange={(e) => set('email', e.target.value)} /></F>
                </div>
                <F label="Barrio / zona" req><input className="field w-full" placeholder="Villa Mitre, Centro…" value={form.zona} onChange={(e) => set('zona', e.target.value)} /></F>
              </Sec>

              <Sec n={2} Icon={Home} titulo="Tu vivienda">
                <F label="Tipo de vivienda" req>
                  <Chips opciones={[{value:'casa',label:'Casa'},{value:'depto',label:'Depto'},{value:'casa_patio',label:'Casa con patio'},{value:'otro',label:'Otro'}]} value={form.tipoVivienda} onChange={(v) => set('tipoVivienda', v)} />
                </F>
                <F label="¿Sos propietario o inquilino?" req>
                  <Chips opciones={[{value:'propietario',label:'Propietario'},{value:'inquilino',label:'Inquilino'}]} value={form.tenencia} onChange={(v) => set('tenencia', v)} />
                </F>
                {form.tenencia === 'inquilino' && <F label="¿El propietario permite mascotas?" req><SiNo value={form.propietarioPermite} onChange={(v) => set('propietarioPermite', v)} /></F>}
                <F label="¿Tenés patio o jardín?" req><SiNo value={form.tienePatio} onChange={(v) => set('tienePatio', v)} /></F>
                {form.tienePatio === 'si' && <F label="¿Está cercado?" req><SiNo value={form.patioFechado} onChange={(v) => set('patioFechado', v)} /></F>}
              </Sec>

              <Sec n={3} Icon={Users} titulo="Tu grupo familiar">
                <F label="¿Cuántas personas viven en tu hogar?" req><input type="number" className="field w-24" min={1} placeholder="3" value={form.cantPersonas} onChange={(e) => set('cantPersonas', e.target.value)} /></F>
                <F label="¿Hay niños?" req><SiNo value={form.hayNinos} onChange={(v) => set('hayNinos', v)} /></F>
                {form.hayNinos === 'si' && <F label="Edades de los niños" req><input className="field w-full" placeholder="3, 7 y 10 años" value={form.edadesNinos} onChange={(e) => set('edadesNinos', e.target.value)} /></F>}
                <F label="¿Todos de acuerdo con la adopción?" req><SiNo value={form.todosDeAcuerdo} onChange={(v) => set('todosDeAcuerdo', v)} /></F>
                <F label="¿Hay alergias a animales?" req><SiNo value={form.alergias} onChange={(v) => set('alergias', v)} /></F>
              </Sec>

              <Sec n={4} Icon={Dog} titulo="Tu experiencia con mascotas">
                <F label="¿Tenés mascotas actualmente?" req><SiNo value={form.mascotasActuales} onChange={(v) => set('mascotasActuales', v)} /></F>
                {form.mascotasActuales === 'si' && <F label="¿Cuáles y cuántas?" req><input className="field w-full" placeholder="1 gato, 1 perro…" value={form.detalleMascotas} onChange={(e) => set('detalleMascotas', e.target.value)} /></F>}
                <F label="¿Tuviste mascotas antes?" req><SiNo value={form.mascotasAnteriores} onChange={(v) => set('mascotasAnteriores', v)} /></F>
                {form.mascotasAnteriores === 'si' && <F label="¿Qué pasó con ellas?" req><textarea className="field w-full resize-none" rows={2} value={form.quePasoConEllas} onChange={(e) => set('quePasoConEllas', e.target.value)} /></F>}
                <F label="¿Cuántas horas solo por día?" req>
                  <Chips opciones={[{value:'0-2',label:'< 2 hs'},{value:'2-4',label:'2-4 hs'},{value:'4-6',label:'4-6 hs'},{value:'6-8',label:'6-8 hs'},{value:'+8',label:'> 8 hs'}]} value={form.horasSolo} onChange={(v) => set('horasSolo', v)} />
                </F>
              </Sec>

              <Sec n={5} Icon={Search} titulo="¿Por qué querés adoptar?">
                <F label="Contanos tu motivación" req>
                  <textarea className="field w-full resize-none" rows={4}
                    placeholder="Tu estilo de vida, tiempo disponible, qué esperás del perro…"
                    value={form.motivacion} onChange={(e) => set('motivacion', e.target.value)} />
                </F>
              </Sec>

              <Sec n={6} Icon={ClipboardList} titulo="Compromisos">
                <div className="space-y-2.5">
                  {([
                    { k: 'compromisoVeterinario' as const, t: 'Me comprometo a proveer atención veterinaria regular.' },
                    { k: 'compromisoVisita' as const,      t: 'Acepto una visita previa al hogar.' },
                    { k: 'compromisoDevolucion' as const,  t: 'Si no puedo conservarlo, lo devuelvo a quien lo dio en adopción.' },
                    { k: 'compromisoEsterilizacion' as const, t: 'Me comprometo a esterilizarlo si aún no lo está.' },
                  ]).map(({ k, t }) => (
                    <label key={k} className={`flex cursor-pointer items-start gap-3 rounded-2xl p-3.5 ring-1 transition ${form[k] ? 'bg-good/5 ring-good/40' : 'bg-white ring-black/10 hover:bg-brand-cream'}`}>
                      <input type="checkbox" className="mt-0.5 h-4 w-4 accent-brand-primary" checked={form[k]} onChange={(e) => set(k, e.target.checked)} />
                      <span className="text-sm text-ink">{t}</span>
                    </label>
                  ))}
                </div>
              </Sec>

              <button type="submit" disabled={loading}
                className="btn-primary w-full disabled:opacity-60 sticky bottom-0">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Heart className="h-5 w-5" /> Enviar solicitud</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

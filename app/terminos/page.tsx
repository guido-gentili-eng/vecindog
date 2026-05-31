import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Términos y Condiciones — Vecindog',
  description: 'Términos y condiciones de uso de la plataforma Vecindog.',
};

export default function TerminosPage() {
  return (
    <div className="mx-auto max-w-3xl py-10 px-4">
      <div className="mb-8">
        <Link href="/" className="text-sm text-brand-primary hover:underline">← Volver al inicio</Link>
      </div>

      <h1 className="font-display text-4xl font-black text-ink mb-2">Términos y Condiciones</h1>
      <p className="text-ink-muted text-sm mb-8">Última actualización: 31 de mayo de 2025</p>

      <div className="prose prose-sm max-w-none space-y-8 text-ink">

        <Section title="1. Aceptación de los términos">
          <p>Al acceder y utilizar la plataforma Vecindog (en adelante, "la Plataforma", "el Sitio" o "Vecindog"), disponible en <strong>mivecindog.com.ar</strong>, el usuario acepta de forma expresa e irrevocable los presentes Términos y Condiciones, así como la Política de Privacidad vigente. Si no está de acuerdo con estos términos, deberá abstenerse de utilizar la Plataforma.</p>
          <p>Vecindog se reserva el derecho de modificar estos Términos en cualquier momento. Los cambios entran en vigencia desde su publicación en el Sitio. El uso continuado de la Plataforma implica la aceptación de los términos modificados.</p>
        </Section>

        <Section title="2. Naturaleza de la plataforma y exención de responsabilidad">
          <p><strong>Vecindog es exclusivamente una plataforma tecnológica de conexión entre usuarios.</strong> Su único objeto es facilitar la publicación de avisos sobre mascotas perdidas, encontradas o en adopción, y poner en contacto a personas que puedan colaborar en su localización o reubicación.</p>
          <p><strong>Vecindog NO es responsable, bajo ninguna circunstancia, por:</strong></p>
          <ul>
            <li>El resultado exitoso o no de la búsqueda de un animal perdido.</li>
            <li>El estado físico, psíquico o de salud de cualquier animal.</li>
            <li>Las interacciones, encuentros, acuerdos o conflictos que se produzcan entre usuarios a raíz del uso de la Plataforma.</li>
            <li>La veracidad, exactitud o integridad de la información publicada por los usuarios.</li>
            <li>El incumplimiento de compromisos entre usuarios (adopciones, entrega de animales, recompensas, etc.).</li>
            <li>Daños directos, indirectos, incidentales, especiales o consecuentes derivados del uso o la imposibilidad de uso de la Plataforma.</li>
            <li>La pérdida, daño, muerte o lesión de cualquier animal o persona relacionada con un aviso publicado.</li>
            <li>El uso indebido que terceros hagan de los datos de contacto publicados por los usuarios.</li>
          </ul>
          <p>Vecindog actúa como un mero intermediario tecnológico y no es parte de ninguna relación jurídica, contractual ni de ninguna otra naturaleza que surja entre los usuarios de la Plataforma.</p>
        </Section>

        <Section title="3. Responsabilidades del usuario">
          <p>El usuario es el único y exclusivo responsable de:</p>
          <ul>
            <li>La veracidad, exactitud y licitud de toda la información que publique, incluyendo textos, fotografías e imágenes.</li>
            <li>Garantizar que posee los derechos necesarios sobre las imágenes y contenidos publicados.</li>
            <li>El uso que haga de los datos de contacto de otros usuarios.</li>
            <li>Cualquier acuerdo, transacción o compromiso que realice con otros usuarios.</li>
            <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
            <li>Cualquier daño que cause a terceros como consecuencia de su actividad en la Plataforma.</li>
          </ul>
          <p>El usuario se compromete a utilizar la Plataforma de forma lícita, ética y conforme a la legislación argentina vigente, respetando los derechos de terceros y las normas de bienestar animal.</p>
        </Section>

        <Section title="4. Contenido prohibido">
          <p>Está estrictamente prohibido publicar en la Plataforma:</p>
          <ul>
            <li>Información falsa, engañosa o que induzca a error.</li>
            <li>Avisos relacionados con la compraventa de animales.</li>
            <li>Contenido que promueva el maltrato, la crueldad o el abandono animal.</li>
            <li>Material con derechos de autor sin la debida autorización.</li>
            <li>Información de terceros sin su consentimiento expreso.</li>
            <li>Contenido de carácter ilegal, difamatorio, obsceno, amenazante o discriminatorio.</li>
            <li>Publicidad o spam no autorizado por Vecindog.</li>
          </ul>
          <p>Vecindog se reserva el derecho de eliminar, sin previo aviso ni explicación, cualquier contenido que considere inapropiado, así como de suspender o dar de baja las cuentas de usuarios que incumplan estas normas.</p>
        </Section>

        <Section title="5. Datos personales y privacidad">
          <p>Al registrarse, el usuario consiente el tratamiento de sus datos personales conforme a la <Link href="/privacidad" className="text-brand-primary underline">Política de Privacidad</Link> de Vecindog, en cumplimiento de la Ley 25.326 de Protección de Datos Personales de la República Argentina y sus normas complementarias.</p>
          <p>El usuario comprende que, al publicar datos de contacto (número de teléfono, correo electrónico, etc.), estos podrán ser visualizados por otros usuarios registrados de la Plataforma, y asume plena responsabilidad por dicha publicación.</p>
        </Section>

        <Section title="6. Notificaciones y comunicaciones">
          <p>Vecindog podrá enviar notificaciones por correo electrónico y/o notificaciones dentro de la aplicación relacionadas con la actividad del usuario, incluyendo recordatorios de vacunas, vencimiento de avisos y alertas de mascotas cercanas. El usuario acepta recibir estas comunicaciones al utilizar la Plataforma.</p>
        </Section>

        <Section title="7. Propiedad intelectual">
          <p>La marca, diseño, código fuente, logotipo, interfaz y demás elementos de la Plataforma son propiedad exclusiva de Vecindog y están protegidos por las leyes de propiedad intelectual vigentes. Queda prohibida su reproducción total o parcial sin autorización expresa y por escrito de Vecindog.</p>
          <p>Los contenidos publicados por los usuarios (fotos, textos) son de su exclusiva propiedad. Al publicarlos en la Plataforma, el usuario otorga a Vecindog una licencia no exclusiva, gratuita y transferible para mostrar, distribuir y reproducir dichos contenidos exclusivamente en el marco del funcionamiento de la Plataforma.</p>
        </Section>

        <Section title="8. Disponibilidad del servicio">
          <p>Vecindog no garantiza la disponibilidad ininterrumpida de la Plataforma. El servicio puede ser suspendido temporalmente por mantenimiento, actualizaciones técnicas, fuerza mayor u otras causas fuera del control razonable de Vecindog, sin que ello genere derecho a indemnización alguna.</p>
        </Section>

        <Section title="9. Menores de edad">
          <p>La Plataforma está destinada a personas mayores de 18 años. Los menores de edad no podrán registrarse ni utilizar la Plataforma sin el consentimiento expreso de sus padres o tutores legales, quienes serán responsables por el uso que aquellos hagan del servicio.</p>
        </Section>

        <Section title="10. Legislación aplicable y jurisdicción">
          <p>Los presentes Términos y Condiciones se rigen por la legislación de la República Argentina. Ante cualquier controversia derivada del uso de la Plataforma, las partes se someten a la jurisdicción de los Tribunales Ordinarios de la ciudad de Bahía Blanca, Provincia de Buenos Aires, con renuncia expresa a cualquier otro fuero que pudiera corresponder.</p>
        </Section>

        <Section title="11. Contacto">
          <p>Para consultas relacionadas con estos Términos y Condiciones, el usuario puede comunicarse a través del correo electrónico: <strong>contacto@mivecindog.com.ar</strong></p>
        </Section>

      </div>

      <div className="mt-10 pt-6 border-t border-black/10 flex gap-4 text-sm">
        <Link href="/privacidad" className="text-brand-primary hover:underline">Política de Privacidad</Link>
        <Link href="/" className="text-ink-muted hover:underline">Volver al inicio</Link>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl font-extrabold text-ink mb-3">{title}</h2>
      <div className="space-y-3 text-sm text-ink leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5">{children}</div>
    </div>
  );
}
